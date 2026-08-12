import { NextResponse } from 'next/server'

/**
 * Jawab Supabase me daalne wala route.
 *
 * Client se seedha Supabase call karne ke bajaye ye beech me isliye hai ki
 * key browser bundle me na jaye. Table pe RLS lagi hai aur anon ke paas sirf
 * insert ki permission hai, koi select nahi, isliye is raaste se koi doosra
 * jawab padh nahi sakta.
 */

const TABLE = 'reality_check_responses'

/*
 * Supabase ka publishable key design se hi client ke liye banaya gaya hai,
 * isliye ise fallback ke taur pe rakhna theek hai. Asli suraksha RLS se aati
 * hai, key chhupane se nahi. Env var set ho toh wahi use hoti hai, taaki
 * project badalne pe code chhuye bina kaam ho jaye.
 */
const SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://jswidyxlvybpomuxhwdm.supabase.co'
const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_ORzAq6kNVf4p6-RuWq2QKA_I69eLHGE'

/** Jitna bada payload sensible hai, usse zyada seedha mana kar do. */
const MAX_BYTES = 512 * 1024

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

  const upstream = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
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

  if (!upstream.ok) {
    // Upstream ka message aage bhejo, par jawab kabhi log mat karo.
    const detail = await upstream.text().catch(() => '')
    return NextResponse.json(
      { error: 'save failed', detail: detail.slice(0, 300) },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
