'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { renderMarkdown } from '@/lib/sanitize';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { DayPlan } from '@/lib/schema';

export default function Page() {
  const [destination, setDestination] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [html, setHtml] = useState('');
  const [note, setNote] = useState('');
  const [days, setDays] = useState<DayPlan[] | null>(null);
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
    // Ping backend (Groq via our API route) to avoid CORS
    const controller = new AbortController();
    fetch('/api/plan', { signal: controller.signal })
      .then(r => r.json())
      .then((d) => setConnected(Boolean(d?.ok)))
      .catch(() => setConnected(false));
    return () => controller.abort();
  }, []);

  // Clear any previously saved itinerary on mount so refresh starts clean
  useEffect(() => {
    try { localStorage.removeItem('itinerary:last'); } catch {}
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
      if (data.itineraryJson?.days) setDays(data.itineraryJson.days as DayPlan[]);
      else setNote(data.note || 'Structured view unavailable');
      setMarkdown(data.itineraryMarkdown || '');
      setHtml(renderMarkdown(data.itineraryMarkdown || ''));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to generate.';
      setNote(msg.includes('fetch') ? "Can't reach planning service. Check GROQ_API_KEY and network." : msg);
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

  function clearResults() {
    setHtml('');
    setMarkdown('');
    setDays(null);
    setNote('');
    try { localStorage.removeItem('itinerary:last'); } catch {}
  }

  const statusBadge = useMemo(() => {
    if (connected === null) return (
      <Badge className="px-2 py-1 text-xs bg-zinc-700 text-zinc-200 border-transparent">Checking Groq…</Badge>
    );
    return connected
      ? <Badge className="px-2 py-1 text-xs bg-emerald-500 text-white border-transparent">Connected to Groq · {model}</Badge>
      : <Badge className="px-2 py-1 text-xs bg-rose-600 text-white border-transparent">Not connected</Badge>;
  }, [connected, model]);

  const suggestions = ['Paris', 'Tokyo', 'New York', 'London', 'Bali', 'Singapore'];
  const hasResults = Boolean(html || (days && days.length) || note);

  return (
    <main className="min-h-svh flex flex-col">
      {/* Top-right Clear button (always visible, disabled when empty) */}
      <div className="fixed top-4 right-4 z-30">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearResults}
                disabled={!hasResults || loading}
                className="border border-white/10 bg-white/5 hover:bg-white/10 rounded-full"
              >
                Clear
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Clear results</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight" style={{ fontFamily: 'Axiforma, var(--jakarta-font), system-ui, sans-serif' }}>Where do you want to go?</h1>

          <div className="space-y-4">
            {/* Destination */}
            <div className="text-left">
              <Label htmlFor="destination" className="sr-only">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Tokyo"
                value={destination}
                onChange={(e)=>setDestination(e.target.value)}
                className="h-12 rounded-full px-5 text-base border-zinc-800 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {suggestions.map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setDestination(s)}
                  className="rounded-full px-3"
                >
                  {s}
                </Button>
              ))}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="text-left">
                <Label htmlFor="start" className="sr-only">Start date</Label>
                <Input id="start" type="date" value={start} onChange={(e)=>setStart(e.target.value)} className="h-11 rounded-full px-4 border-zinc-800 bg-zinc-950/60 text-zinc-100 w-full" />
              </div>
              <div className="text-left">
                <Label htmlFor="end" className="sr-only">End date</Label>
                <Input id="end" type="date" value={end} onChange={(e)=>setEnd(e.target.value)} className="h-11 rounded-full px-4 border-zinc-800 bg-zinc-950/60 text-zinc-100 w-full" />
              </div>
            </div>

            {/* CTA */}
            <div>
              <Button onClick={onPlan} disabled={loading} className="h-11 rounded-full px-6 bg-white/10 hover:bg-white/15 border border-white/10 text-zinc-100">
                {loading ? 'Generating…' : 'Plan my Trip'}
              </Button>
            </div>

            {note && <p className="text-rose-400 text-sm" role="alert">{note}</p>}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-4 pb-12">
        <div className="mx-auto w-full max-w-3xl">
          {html ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
              <div className="prose prose-invert prose-zinc max-w-none">
                <article dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
