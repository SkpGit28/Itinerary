import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vLat = searchParams.get('vLat');
  const vLng = searchParams.get('vLng');
  const uLat = searchParams.get('uLat');
  const uLng = searchParams.get('uLng');

  if (!vLat || !vLng) {
    return NextResponse.json({ error: 'vLat and vLng are required' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_MAPS_API_KEY is not configured' }, { status: 503 });
  }

  let zoom = 14;
  if (uLat && uLng) {
    const dLat = Math.abs(Number(vLat) - Number(uLat));
    const dLng = Math.abs(Number(vLng) - Number(uLng));
    const maxDelta = Math.max(dLat, dLng);
    if (maxDelta > 5) zoom = 4;
    else if (maxDelta > 2) zoom = 6;
    else if (maxDelta > 0.5) zoom = 9;
    else if (maxDelta > 0.1) zoom = 11;
    else zoom = 14;
  }

  const params = new URLSearchParams({
    center: `${vLat},${vLng}`,
    zoom: String(zoom),
    size: '640x480',
    scale: '2',
    maptype: 'hybrid',
    key: apiKey,
  });

  params.append('markers', `color:red|size:mid|label:V|${vLat},${vLng}`);

  if (uLat && uLng) {
    params.append('markers', `color:blue|size:mid|label:U|${uLat},${uLng}`);
  }

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;

  let imageBuffer: ArrayBuffer;
  let contentType: string;
  try {
    const mapRes = await fetch(mapUrl, { cache: 'no-store' });
    if (!mapRes.ok) {
      const errText = await mapRes.text().catch(() => '');
      return NextResponse.json({ error: `Maps API error ${mapRes.status}`, detail: errText }, { status: 502 });
    }
    imageBuffer = await mapRes.arrayBuffer();
    contentType = mapRes.headers.get('Content-Type') || 'image/png';
  } catch {
    return NextResponse.json({ error: 'Failed to fetch map image' }, { status: 502 });
  }

  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
