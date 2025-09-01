'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { renderMarkdown } from '@/lib/sanitize';
// New UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Toaster, toast } from 'sonner';

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
  const articleRef = useRef<HTMLDivElement | null>(null);
  const [activeDay, setActiveDay] = useState<number>(0);

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

  useEffect(() => {
    // After html renders, attach ids to day headings if possible
    const root = articleRef.current;
    if (!root || !days || days.length === 0) return;
    const headings = Array.from(root.querySelectorAll('h1,h2,h3')) as HTMLElement[];
    for (let i = 0; i < days.length; i++) {
      const targetText = `Day ${i + 1}`;
      const el = headings.find(h => h.textContent?.trim().toLowerCase().startsWith(targetText.toLowerCase()));
      if (el && !el.id) el.id = `day-${i + 1}`;
    }
  }, [html, days]);

  useEffect(() => {
    // Scroll spy
    const onScroll = () => {
      if (!days || days.length === 0) return;
      let current = 0;
      for (let i = 0; i < days.length; i++) {
        const el = document.getElementById(`day-${i + 1}`);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= 120) current = i; else break;
      }
      setActiveDay(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [days]);

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
      const friendly = msg.includes('fetch') ? "Can't reach planning service. Check GROQ_API_KEY and network." : msg;
      setNote(friendly);
      toast.error(friendly);
    } finally { setLoading(false); }
  }

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success('Markdown copied');
      if (copyBtn.current) {
        copyBtn.current.textContent = 'Copied!';
        setTimeout(() => { if (copyBtn.current) copyBtn.current.textContent = 'Copy Markdown'; }, 1000);
      }
    } catch {}
  }

  const statusBadge = useMemo(() => {
    if (connected === null) return (
      <Badge className="px-2 py-1 text-xs bg-zinc-700 text-zinc-200 border-transparent">Checking Groq…</Badge>
    );
    return connected
      ? <Badge className="px-2 py-1 text-xs bg-emerald-500 text-white border-transparent">Connected to Groq · {model}</Badge>
      : <Badge className="px-2 py-1 text-xs bg-rose-600 text-white border-transparent">Not connected</Badge>;
  }, [connected, model]);

  return (
    <main className="min-h-svh px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header and planner card */}
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Itinerary Planner</h1>
          <p className="text-sm text-zinc-400">Plan practical day-by-day trips using Groq</p>
        </header>

        <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur ring-1 ring-inset ring-white/5 shadow-lg">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {statusBadge}
                {/* Model moved into Preferences too, kept here for convenience */}
                <div className="hidden sm:flex items-center gap-2">
                  <Label className="text-xs text-zinc-400" htmlFor="model">Model</Label>
                  <Input id="model" value={model} onChange={e=>setModel(e.target.value)} className="h-8 w-[210px] text-xs bg-zinc-950/60 border-zinc-800 text-zinc-200" aria-label="Model name" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-zinc-100">Preferences</Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Preferences</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-3">
                      <div>
                        <Label htmlFor="pref-model">Model</Label>
                        <Input id="pref-model" value={model} onChange={e=>setModel(e.target.value)} className="mt-1" />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <Button onClick={onPlan} disabled={loading} className="bg-white/10 hover:bg-white/15 border-white/10 text-zinc-100">
                  {loading ? 'Generating…' : 'Plan my visit'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <Separator className="bg-zinc-800" />
          <CardContent className="p-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <Label className="mb-1 block text-zinc-300" htmlFor="destination">Destination</Label>
                <Input id="destination" placeholder="e.g., Tokyo" value={destination} onChange={e=>setDestination(e.target.value)} className="border-zinc-800 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-500" />
              </div>
              <div>
                <Label className="mb-1 block text-zinc-300" htmlFor="start">Start date</Label>
                <Input id="start" type="date" value={start} onChange={e=>setStart(e.target.value)} className="border-zinc-800 bg-zinc-950/60 text-zinc-100" />
              </div>
              <div>
                <Label className="mb-1 block text-zinc-300" htmlFor="end">End date</Label>
                <Input id="end" type="date" value={end} onChange={e=>setEnd(e.target.value)} className="border-zinc-800 bg-zinc-950/60 text-zinc-100" />
              </div>
            </div>

            {note && <p className="mt-3 text-rose-400 text-sm" role="alert">{note}</p>}
          </CardContent>
        </Card>

        {/* Sticky day navigation */}
        {loading ? (
          <div className="flex gap-2">
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-7 w-36 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        ) : days && (
          <div className="sticky top-0 z-20 -mx-4 sm:-mx-8 px-4 sm:px-8 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 border-b border-zinc-900 py-2">
            <ScrollArea className="w-full whitespace-nowrap">
              <nav aria-label="Day navigator" className="flex items-center gap-2 pb-2">
                {days.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const el = document.getElementById(`day-${i + 1}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`text-xs sm:text-sm border rounded-full px-3 py-1 ${activeDay === i ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-zinc-800 bg-zinc-900/50 text-zinc-200'}`}
                    aria-current={activeDay === i ? 'true' : undefined}
                  >
                    Day {i+1}: {d.summary}
                  </button>
                ))}
              </nav>
            </ScrollArea>
          </div>
        )}

        {/* Results */}
        <section className="prose prose-invert prose-zinc max-w-none">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="m-0 text-lg">Itinerary</h2>
            <Button ref={copyBtn as any} onClick={copyMarkdown} variant="outline" size="sm" className="border-white/10 bg-white/10 hover:bg-white/15 text-zinc-100">
              Copy Markdown
            </Button>
          </div>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/6" />
              <Skeleton className="h-5 w-3/6" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-2/6" />
            </div>
          ) : (
            // eslint-disable-next-line react/no-danger
            <article ref={articleRef as any} dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </section>

        <footer className="text-xs text-zinc-500">
          Hours and fees may vary; verify locally. No data leaves your machine.
        </footer>
      </div>
      <Toaster richColors theme="dark" />
    </main>
  );
}
