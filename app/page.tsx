'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation, Download, Loader2, RefreshCw } from 'lucide-react';

type MapResult = {
  villageLat: number;
  villageLng: number;
  formattedAddress: string;
  imageUrl: string;
};

const SUGGESTIONS = ['Hallstatt', 'Santorini', 'Shirakawa-go', 'Colmar', 'Reine', 'Positano'];

export default function VillageMapPage() {
  const [villageName, setVillageName] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [mapResult, setMapResult] = useState<MapResult | null>(null);
  const [error, setError] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setError('');
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 12000,
        })
      );
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (e: unknown) {
      const msg =
        e instanceof GeolocationPositionError && e.code === 1
          ? 'Location permission denied. Enable it in browser settings.'
          : 'Could not get location. Try again.';
      setError(msg);
    } finally {
      setLocating(false);
    }
  }, []);

  const generateMap = useCallback(async () => {
    if (!villageName.trim()) { setError('Please enter a village name.'); return; }
    setError('');
    setGenerating(true);
    setMapResult(null);
    setImageLoaded(false);

    try {
      const res = await fetch('/api/map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          villageName: villageName.trim(),
          userLat: userLocation?.lat,
          userLng: userLocation?.lng,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Map generation failed');
      setMapResult(data as MapResult);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to generate map.');
    } finally {
      setGenerating(false);
    }
  }, [villageName, userLocation]);

  const downloadFramed = useCallback(async () => {
    if (!mapResult) return;
    setError('');

    try {
      const blob = await fetch(mapResult.imageUrl).then((r) => {
        if (!r.ok) throw new Error('Image fetch failed');
        return r.blob();
      });
      const img = await createImageBitmap(blob);

      const PAD = 48;
      const TITLE_H = 56;
      const FOOTER_H = 36;
      const canvas = document.createElement('canvas');
      canvas.width = img.width + PAD * 2;
      canvas.height = img.height + TITLE_H + FOOTER_H + PAD * 2;
      const ctx = canvas.getContext('2d')!;

      const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bg.addColorStop(0, '#13131a');
      bg.addColorStop(1, '#0f1623');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.shadowColor = 'rgba(99,179,237,0.15)';
      ctx.shadowBlur = 40;
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(PAD / 2, PAD / 2, canvas.width - PAD, canvas.height - PAD, 12);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.min(22, Math.floor(img.width / 24))}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(mapResult.formattedAddress, canvas.width / 2, PAD + TITLE_H / 2, img.width);

      const legendY = PAD + TITLE_H - 14;
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.arc(PAD + 10, legendY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('Village', PAD + 20, legendY);

      if (userLocation) {
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.arc(PAD + 90, legendY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillText('You are here', PAD + 100, legendY);
      }

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(PAD, PAD + TITLE_H, img.width, img.height, 6);
      ctx.clip();
      ctx.drawImage(img, PAD, PAD + TITLE_H);
      ctx.restore();

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Village Map Framer', canvas.width / 2, canvas.height - PAD / 2 - FOOTER_H / 2 + 4);

      const link = document.createElement('a');
      link.download = `${villageName.trim().replace(/\s+/g, '-').toLowerCase()}-map.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      setError('Download failed — try right-clicking the map image and saving it.');
    }
  }, [mapResult, villageName, userLocation]);

  return (
    <main className="min-h-svh flex flex-col">
      <header className="sticky top-0 z-10 border-b border-white/5 bg-[#0b0b0c]/80 backdrop-blur-md px-5 py-3 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-rose-400" />
        <span className="text-sm font-semibold text-zinc-100">Village Map Framer</span>
      </header>

      <section className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-2">
            <h1
              className="text-4xl sm:text-5xl font-semibold tracking-tight"
              style={{ fontFamily: 'Axiforma, "Plus Jakarta Sans", system-ui, sans-serif' }}
            >
              Village Map Framer
            </h1>
            <p className="text-zinc-400 text-base">
              Enter a village name, share your location, and get a framed satellite map.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="village" className="text-zinc-300 text-sm">Village name</Label>
              <Input
                id="village"
                placeholder="e.g., Hallstatt"
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !generating && generateMap()}
                className="h-12 rounded-full px-5 text-base border-zinc-800 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setVillageName(s)}
                  className="rounded-full px-3 text-xs"
                >
                  {s}
                </Button>
              ))}
            </div>

            <div className="flex items-center flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={getLocation}
                disabled={locating}
                className="rounded-full border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800 h-10"
              >
                {locating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4 mr-2" />
                )}
                {locating ? 'Getting location…' : userLocation ? 'Update location' : 'Use my location'}
              </Button>
              {userLocation && (
                <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                </span>
              )}
            </div>

            <Button
              onClick={generateMap}
              disabled={generating || !villageName.trim()}
              className="h-12 w-full rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-zinc-100"
            >
              {generating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating map…</>
              ) : (
                <><MapPin className="w-4 h-4 mr-2" />Generate Map</>
              )}
            </Button>

            {error && <p className="text-rose-400 text-sm" role="alert">{error}</p>}
          </div>

          {mapResult && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-xl">
                <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-sm font-medium text-zinc-100 truncate">
                      {mapResult.formattedAddress}
                    </span>
                  </div>
                  {userLocation && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-400 shrink-0">
                      <Navigation className="w-3 h-3" />
                      <span>You are here</span>
                    </div>
                  )}
                </div>

                <div className="relative bg-zinc-900">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center h-48">
                      <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={mapResult.imageUrl}
                    alt={`Satellite map of ${mapResult.formattedAddress}`}
                    className="w-full h-auto block"
                    style={{ display: imageLoaded ? 'block' : 'none' }}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                      setError('Failed to load map image. Verify GOOGLE_MAPS_API_KEY is valid and Maps Static API is enabled.');
                      setImageLoaded(true);
                    }}
                  />
                </div>

                <div className="px-5 py-3 border-t border-white/10 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    Village center (V)
                  </div>
                  {userLocation && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                      Your location (U)
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  onClick={downloadFramed}
                  variant="outline"
                  className="rounded-full border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download framed image
                </Button>
                <Button
                  onClick={() => { setMapResult(null); setImageLoaded(false); setError(''); }}
                  variant="ghost"
                  className="rounded-full text-zinc-400 hover:text-zinc-100"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New search
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
