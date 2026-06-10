# Village Map Framer

A Next.js 15 app that geocodes a village name and renders a framed satellite map with an optional "You are here" GPS marker.

## Setup

```bash
npm install
```

Create a `.env.local` file:

```
GOOGLE_MAPS_API_KEY=your_key_here
```

> Enable **Geocoding API** and **Maps Static API** in [Google Cloud Console](https://console.cloud.google.com).

## Run

```bash
npm run dev
# open http://localhost:3000
```

## How it works

1. Enter a village name and optionally share your GPS location
2. The app geocodes the village via the Geocoding API
3. A satellite map is fetched server-side (API key never exposed to the browser)
4. Red **V** marker = village centre, blue **U** marker = your location
5. Download a framed PNG with title, legend, and decorative border
