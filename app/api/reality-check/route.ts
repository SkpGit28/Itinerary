import { NextResponse } from 'next/server'

/**
 * Jawab save karne wala route.
 *
 * Do jagah support karta hai:
 *  1. Google Sheet, ek Apps Script web app ke through. Iske liye bas
 *     SHEETS_WEBHOOK_URL set karna hota hai, koi API key nahi.
 *  2. Supabase, agar Sheet set nahi hai. Ye pehle se bana hua hai, isliye
 *     jab tak Sheet nahi lagti tab tak jawab yahin surakshit rehte hain.
 *
 * Client seedha kisi bhi service ko call nahi karta, isliye na URL na key
 * browser bundle me jaati hai.
 */

const TABLE = 'reality_check_responses'

/** Apps Script web app ka URL. Set hote hi Sheet primary ban jaati hai. */
const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL

/*
 * Supabase ka publishable key design se hi client ke liye banaya gaya hai,
 * isliye ise fallback ke taur pe rakhna theek hai. Asli suraksha RLS se aati
 * hai: anon sirf insert kar sakta hai, padh nahi sakta.
 */
const SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://jswidyxlvybpomuxhwdm.supabase.co'
const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_ORzAq6kNVf4p6-RuWq2QKA_I69eLHGE'

/** Jitna bada payload sensible hai, usse zyada seedha mana kar do. */
const MAX_BYTES = 512 * 1024

type Saved = { ok: true; where: string } | { ok: false; where: string; detail: string }

async function saveToSheet(payload: Record<string, unknown>): Promise<Saved> {
  const response = await fetch(SHEETS_WEBHOOK_URL as string, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Apps Script sirf rows aur thoda context maangta hai, poora payload nahi.
    body: JSON.stringify({
      submitted_at: payload.submitted_at,
      submission_id: payload.submission_id,
      respondent: payload.respondent,
      answered_count: payload.answered_count,
      total_count: payload.total_count,
      rows: payload.rows,
    }),
    // Apps Script hamesha 302 se guzarta hai, isliye redirect follow karna zaroori hai.
    redirect: 'follow',
  })

  const body = await response.text().catch(() => '')
  if (!response.ok) return { ok: false, where: 'sheet', detail: body.slice(0, 300) }

  // Apps Script galti pe bhi 200 de deta hai, isliye body bhi dekhni padti hai.
  if (/"ok"\s*:\s*true/.test(body)) return { ok: true, where: 'sheet' }
  return { ok: false, where: 'sheet', detail: body.slice(0, 300) || 'unexpected reply' }
}

async function saveToSupabase(raw: string): Promise<Saved> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      // Row wapas mangwane ki zaroorat nahi, aur RLS select allow bhi nahi karti.
      Prefer: 'return=minimal',
    },
    body: raw,
  })

  if (response.ok) return { ok: true, where: 'supabase' }
  const detail = await response.text().catch(() => '')
  return { ok: false, where: 'supabase', detail: detail.slice(0, 300) }
}

export async function POST(request: Request) {
  const raw = await request.text()

  if (raw.length > MAX_BYTES) {
    return NextResponse.json({ error: 'payload too large' }, { status: 413 })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'expected an object' }, { status: 400 })
  }

  const payload = body as Record<string, unknown>
  if (typeof payload.answers !== 'object' || payload.answers === null) {
    return NextResponse.json({ error: 'answers missing' }, { status: 400 })
  }

  /*
   * Sheet set hai toh wahi asli jagah hai. Agar Sheet fail ho jaye toh
   * Supabase pe gir jaate hain, taaki jawab kisi bhi soorat me na khoyein.
   * Sheet chal rahi ho toh Supabase ko chhua tak nahi jaata, do jagah niji
   * jawab rakhne ka koi matlab nahi.
   */
  const attempts: Saved[] = []

  if (SHEETS_WEBHOOK_URL) {
    const sheet = await saveToSheet(payload).catch((): Saved => ({
      ok: false,
      where: 'sheet',
      detail: 'network',
    }))
    attempts.push(sheet)
    if (sheet.ok) return NextResponse.json({ ok: true, saved_to: 'sheet' }, { status: 201 })
  }

  const supabase = await saveToSupabase(raw).catch((): Saved => ({
    ok: false,
    where: 'supabase',
    detail: 'network',
  }))
  attempts.push(supabase)
  if (supabase.ok) {
    return NextResponse.json({ ok: true, saved_to: 'supabase' }, { status: 201 })
  }

  // Kabhi bhi jawab khud log mat karo, sirf service ka error aage bhejo.
  return NextResponse.json(
    {
      error: 'save failed',
      tried: attempts.map((a) => ({ where: a.where, detail: a.ok ? null : a.detail })),
    },
    { status: 502 }
  )
}
