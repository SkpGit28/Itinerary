import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { villageName, userLat, userLng } = body as {
    villageName?: string;
    userLat?: number;
    userLng?: number;
  };

  if (!villageName?.trim()) {
    return NextResponse.json({ error: 'villageName is required' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_MAPS_API_KEY is not configured on the server.' }, { status: 503 });
  }

  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(villageName.trim())}&key=${apiKey}`;

  let geoData: { status: string; results?: Array<{ formatted_address: string; geometry: { location: { lat: number; lng: number } } }> };
  try {
    const geoRes = await fetch(geocodeUrl, { cache: 'no-store' });
    geoData = await geoRes.json();
  } catch {
    return NextResponse.json({ error: 'Geocoding request failed' }, { status: 502 });
  }

  if (geoData.status !== 'OK' || !geoData.results?.length) {
    return NextResponse.json(
      { error: `Village not found (geocoder status: ${geoData.status}). Try a more specific name.` },
      { status: 404 }
    );
  }

  const { lat, lng } = geoData.results[0].geometry.location;
  const formattedAddress = geoData.results[0].formatted_address;

  const imageParams = new URLSearchParams({ vLat: String(lat), vLng: String(lng) });
  if (typeof userLat === 'number' && typeof userLng === 'number') {
    imageParams.set('uLat', String(userLat));
    imageParams.set('uLng', String(userLng));
  }

  return NextResponse.json({
    villageLat: lat,
    villageLng: lng,
    formattedAddress,
    imageUrl: `/api/map/image?${imageParams.toString()}`,
  });
}

export async function GET() {
  return NextResponse.json({ ok: Boolean(process.env.GOOGLE_MAPS_API_KEY) });
}
