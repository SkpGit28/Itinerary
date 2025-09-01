// app/api/plan/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // keep Node runtime (safe default)

export async function POST(req: NextRequest) {
  const { destination, startDate, endDate, model = "llama-3.1-8b-instant" } = await req.json();
  if (!destination || !startDate || !endDate) {
    return NextResponse.json({ error: "destination, startDate, endDate required" }, { status: 400 });
  }

  const timeoutMs = Number(process.env.REQUEST_TIMEOUT_MS) || 60_000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  // 1) JSON-only prompt (no markdown, no prose)
  const jsonPrompt = `You are a practical travel planner. Be specific and realistic. Avoid exact prices/hours.\n\nReturn ONLY a valid JSON object matching this schema (no backticks, no markdown, no extra text):\n{"destination":"string","startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD","days":[{"date":"YYYY-MM-DD","summary":"string","morning":[{"title":"string","desc":"string"}],"afternoon":[{"title":"string","desc":"string"}],"evening":[{"title":"string","desc":"string"}],"weatherAlternatives":["string","string","string"]}],"generalTips":["string","string","string"]}\n\nDestination: ${destination}\nStart date (YYYY-MM-DD): ${startDate}\nEnd date (YYYY-MM-DD): ${endDate}`.trim();

  try {
    // First call: enforce JSON via response_format
    const r1 = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: jsonPrompt }],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!r1.ok) {
      const msg = await r1.text().catch(() => "");
      clearTimeout(timeout);
      return NextResponse.json({ error: `Groq ${r1.status}`, detail: msg }, { status: 502 });
    }

    const data1 = await r1.json();
    const raw1: string = data1?.choices?.[0]?.message?.content ?? "";

    let itineraryJson: any = null;
    try { itineraryJson = JSON.parse(raw1); } catch {}

    // One repair attempt if parsing somehow fails
    if (!itineraryJson) {
      const rRepair = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: `Return only valid JSON per schema. Fix:\n\n${raw1}` }],
          temperature: 0.1,
          response_format: { type: "json_object" },
        }),
        signal: controller.signal,
      }).catch(() => null);

      if (rRepair && rRepair.ok) {
        const d = await rRepair.json().catch(() => null);
        const fixedText: string = d?.choices?.[0]?.message?.content ?? "";
        try { itineraryJson = JSON.parse(fixedText); } catch {}
      }

      if (!itineraryJson) {
        clearTimeout(timeout);
        return NextResponse.json({ itineraryJson: null, itineraryMarkdown: raw1?.trim() || "", note: "JSON parse failed" });
      }
    }

    // 2) Markdown-only prompt using the JSON
    const mdPrompt = `Using the following JSON itinerary, output a Markdown itinerary ONLY (no JSON, no code blocks). Mirror the same content with clear day sections and bullet points.\n\nJSON:\n${JSON.stringify(itineraryJson)}`;

    const r2 = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: mdPrompt }],
        temperature: 0.5,
      }),
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeout);

    let itineraryMarkdown = "";
    if (r2 && r2.ok) {
      const data2 = await r2.json().catch(() => null);
      itineraryMarkdown = (data2?.choices?.[0]?.message?.content ?? "").trim();
    } else {
      itineraryMarkdown = "## Itinerary\n\n(Generated from JSON. Markdown generation failed, but JSON is available.)";
    }

    return NextResponse.json({ itineraryJson, itineraryMarkdown });
  } catch (e: any) {
    clearTimeout(timeout);
    const msg = e?.name === "AbortError" ? "timeout" : (e?.message || "request failed");
    return NextResponse.json({ error: msg }, { status: 504 });
  }
}

// (Optional) simple health check for your UI "status" badge
export async function GET() {
  try {
    const r = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY!}` },
      cache: "no-store",
    });
    return NextResponse.json({ ok: r.ok });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
