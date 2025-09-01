'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { renderMarkdown } from '@/lib/sanitize';

export default function Page() {
  const [destination, setDestination] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [html, setHtml] = useState('');
  const [note, setNote] = useState('');
  const [days, setDays] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [model, setModel] = useState<string>('llama-3.1-8b-instant');
  const [markdown, setMarkdown] = useState('');
  const copyBtn = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Load last itinerary
    try {
      const raw = localStorage.getItem('itinerary:last');
      if (raw) {
        const parsed = JSON.parse(raw);
        setDestination(parsed.destination || '');
        setStart(parsed.start || '');
        setEnd(parsed.end || '');
        if (parsed.data?.itineraryMarkdown) {
          setMarkdown(parsed.data.itineraryMarkdown);
          setHtml(renderMarkdown(parsed.data.itineraryMarkdown));
        }
        if (parsed.data?.itineraryJson?.days) setDays(parsed.data.itineraryJson.days);
      }
    } catch {}
  }, []);

  useEffect(() => {
    // Ping Ollama connection via server route to avoid CORS
    const controller = new AbortController();
    fetch('/api/plan', { signal: controller.signal })
      .then(r => r.json())
      .then((d) => setConnected(Boolean(d?.ok)))
      .catch(() => setConnected(false));
    return () => controller.abort();
  }, []);

  function validate(): string | null {
    const dest = (destination || '').trim();
    if (dest.length < 2 || dest.length > 60) return 'Destination must be 2–60 characters.';
    if (!start || !end) return 'Provide both start and end dates.';
    if (end < start) return 'End date must be after start date.';
    const len = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000*60*60*24)) + 1;
    if (len > 14) return 'Trip length must be 14 days or less.';
    return null;
  }

  async function onPlan() {
    setNote(''); setHtml(''); setMarkdown(''); setDays(null); setLoading(true);
    const err = validate();
    if (err) { setNote(err); setLoading(false); return; }
    try {
      const r = await fetch('/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ destination: destination.trim(), startDate: start, endDate: end, model }) });
      const data = await r.json();
      if (!r.ok || data.error) throw new Error(data.error || 'Failed');
      if (data.itineraryJson?.days) setDays(data.itineraryJson.days);
      else setNote(data.note || 'Structured view unavailable');
      setMarkdown(data.itineraryMarkdown || '');
      setHtml(renderMarkdown(data.itineraryMarkdown || ''));
      localStorage.setItem('itinerary:last', JSON.stringify({ destination, start, end, data }));
    } catch (e: any) {
      const msg = e?.message || 'Failed to generate.';
      setNote(msg.includes('fetch') ? "Can't reach Ollama at localhost:11434. Start the Ollama app and pull the model." : msg);
    } finally { setLoading(false); }
  }

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown);
      if (copyBtn.current) {
        copyBtn.current.textContent = 'Copied!';
        setTimeout(() => { if (copyBtn.current) copyBtn.current.textContent = 'Copy Markdown'; }, 1000);
      }
    } catch {}
  }

  const statusBadge = useMemo(() => {
    if (connected === null) return <span role="status" aria-live="polite" className="px-2 py-1 rounded bg-zinc-700 text-zinc-200 text-xs">Checking Ollama…</span>;
    return connected
      ? <span role="status" aria-live="polite" className="px-2 py-1 rounded bg-emerald-500 text-white text-xs">Connected to Groq</span>
      : <span role="status" aria-live="polite" className="px-2 py-1 rounded bg-rose-600 text-white text-xs">Not connected</span>;
  }, [connected]);

  return (
    <main className="min-h-svh px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Itinerary Planner</h1>
          <p className="text-sm text-zinc-400">Local itinerary planner powered by Ollama</p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur p-5 sm:p-6 shadow-lg ring-1 ring-inset ring-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {statusBadge}
              <div className="flex items-center gap-2">
                <label className="text-xs text-zinc-400" htmlFor="model">Model</label>
                <input id="model" className="bg-zinc-950/60 border border-zinc-800 text-sm rounded px-2 py-1 text-zinc-200" value={model} onChange={e=>setModel(e.target.value)} aria-label="Model name" />
              </div>
            </div>
            <button onClick={onPlan} disabled={loading} className="inline-flex items-center gap-2 rounded bg-white/10 hover:bg-white/15 disabled:opacity-50 px-4 py-2 text-sm font-medium text-zinc-100 border border-white/10 shadow">
              {loading ? 'Generating…' : 'Plan my visit'}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-3">
              <label className="block text-sm text-zinc-300 mb-1" htmlFor="destination">Destination</label>
              <input id="destination" className="w-full rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" placeholder="e.g., Tokyo" value={destination} onChange={e=>setDestination(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1" htmlFor="start">Start date</label>
              <input id="start" type="date" className="w-full rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" value={start} onChange={e=>setStart(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1" htmlFor="end">End date</label>
              <input id="end" type="date" className="w-full rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" value={end} onChange={e=>setEnd(e.target.value)} />
            </div>
          </div>

          {note && <p className="mt-3 text-rose-400 text-sm" role="alert">{note}</p>}
        </section>

        {days && (
          <nav aria-label="Day navigator" className="flex flex-wrap gap-2">
            {days.map((d, i) => (
              <span key={i} className="text-xs sm:text-sm border border-zinc-800 bg-zinc-900/50 rounded-full px-3 py-1 text-zinc-200">
                Day {i+1}: {d.summary}
              </span>
            ))}
          </nav>
        )}

        <section className="prose prose-invert prose-zinc max-w-none">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="m-0 text-lg">Itinerary</h2>
            <button ref={copyBtn} onClick={copyMarkdown} className="rounded bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1.5 text-xs text-zinc-100">Copy Markdown</button>
          </div>
          {/* eslint-disable-next-line react/no-danger */}
          <article dangerouslySetInnerHTML={{ __html: html }} />
        </section>

        <footer className="text-xs text-zinc-500">
          Hours and fees may vary; verify locally. No data leaves your machine.
        </footer>
      </div>
    </main>
  );
}
