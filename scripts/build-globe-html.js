// Builds scene-globe-saharanpur.html by embedding world-atlas data inline.
const fs = require("fs");
const path = require("path");

const topoData = fs.readFileSync(
  path.resolve(__dirname, "../node_modules/world-atlas/countries-110m.json"),
  "utf8"
);

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  html, body {
    margin: 0; padding: 0;
    width: 1080px; height: 1920px;
    background: #060c16;
    overflow: hidden;
    font-family: -apple-system, "Inter", "Segoe UI", sans-serif;
  }
  canvas { position: absolute; top: 0; left: 0; }
  .pin-dot {
    position: absolute;
    width: 28px; height: 28px;
    border-radius: 50%;
    background: #D97757;
    border: 3px solid #EDD9BC;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    box-shadow: 0 0 0 0 rgba(217,119,87,0);
  }
  .pin-label {
    position: absolute;
    font-size: 40px; font-weight: 800;
    color: #EDD9BC;
    white-space: nowrap;
    transform: translateX(-50%);
    opacity: 0;
    text-shadow: 0 3px 20px rgba(0,0,0,0.9), 0 0 40px rgba(217,119,87,0.4);
    letter-spacing: -0.01em;
  }
  .pin-sub {
    position: absolute;
    font-size: 28px; font-weight: 400;
    color: #D97757;
    white-space: nowrap;
    transform: translateX(-50%);
    opacity: 0;
    text-shadow: 0 2px 12px rgba(0,0,0,0.9);
    letter-spacing: 0.05em;
  }
  .coords {
    position: absolute;
    bottom: 220px; left: 0; right: 0;
    text-align: center;
    font-size: 30px; font-weight: 300;
    color: rgba(237,217,188,0.5);
    letter-spacing: 0.15em;
    opacity: 0;
    font-family: ui-monospace, monospace;
  }
</style>
</head>
<body>
<canvas id="c" width="1080" height="1920"></canvas>
<div class="pin-dot" id="pd"></div>
<div class="pin-label" id="pl">Saharanpur</div>
<div class="pin-sub" id="ps">Uttar Pradesh · India</div>
<div class="coords" id="co">29.97°N · 77.55°E</div>

<script>var __WORLD_TOPO__ = ${topoData};</script>
<script>
(function() {
  // Bail if libraries not injected yet — render-scene.js re-runs this after injection
  if (!window.d3 || !window.topojson || !window.gsap) return;

  var LON = 77.55, LAT = 29.97; // Saharanpur
  var W = 1080, H = 1920;

  var canvas = document.getElementById("c");
  var ctx = canvas.getContext("2d");

  // D3 data
  var world = __WORLD_TOPO__;
  var countries = topojson.feature(world, world.objects.countries).features;
  var land = topojson.feature(world, world.objects.land);
  var graticule = d3.geoGraticule()();
  var sphere = { type: "Sphere" };

  // Animation state — GSAP mutates these
  var S = {
    rotLon: -(LON - 130),   // start: globe showing Americas
    rotLat: -( LAT - 20),
    scale:  360,             // start scale (small globe)
    alpha:  0               // fade-in
  };

  var projection = d3.geoOrthographic()
    .scale(S.scale)
    .translate([W / 2, H / 2])
    .rotate([S.rotLon, S.rotLat])
    .clipAngle(90);

  var pathGen = d3.geoPath(projection, ctx);

  // Country color lookup (highlight India = numeric id 356)
  function countryFill(d) {
    return (d.id === 356) ? "#1f4e2e" : "#1a2744";
  }

  function draw() {
    projection.rotate([S.rotLon, S.rotLat]).scale(S.scale);

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, S.alpha));

    ctx.clearRect(0, 0, W, H);

    // Deep space background
    var bg = ctx.createRadialGradient(W/2, H/2, S.scale*0.2, W/2, H/2, S.scale*1.8);
    bg.addColorStop(0, "#0d1a2e");
    bg.addColorStop(0.7, "#060c16");
    bg.addColorStop(1, "#060c16");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Faint starfield (fixed dots)
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    var stars = [[120,180],[890,240],[340,800],[760,1100],[200,1400],[950,600],[480,1600],[80,1200]];
    stars.forEach(function(s) {
      ctx.beginPath();
      ctx.arc(s[0], s[1], 1.5, 0, Math.PI*2);
      ctx.fill();
    });

    // Globe outer glow
    var glow = ctx.createRadialGradient(W/2, H/2, S.scale*0.9, W/2, H/2, S.scale*1.15);
    glow.addColorStop(0, "rgba(60,120,220,0.18)");
    glow.addColorStop(1, "rgba(60,120,220,0)");
    ctx.beginPath();
    pathGen(sphere);
    ctx.fillStyle = glow;
    ctx.fill();

    // Ocean
    ctx.beginPath();
    pathGen(sphere);
    var ocean = ctx.createRadialGradient(
      W/2 - S.scale*0.3, H/2 - S.scale*0.25, 0,
      W/2, H/2, S.scale
    );
    ocean.addColorStop(0, "#1b4a7a");
    ocean.addColorStop(0.5, "#0d2d52");
    ocean.addColorStop(1, "#071828");
    ctx.fillStyle = ocean;
    ctx.fill();

    // Graticule
    ctx.beginPath();
    pathGen(graticule);
    ctx.strokeStyle = "rgba(100,160,220,0.1)";
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Countries
    countries.forEach(function(d) {
      ctx.beginPath();
      pathGen(d);
      ctx.fillStyle = countryFill(d);
      ctx.fill();
      ctx.strokeStyle = d.id === 356
        ? "rgba(76,217,100,0.45)"
        : "rgba(80,110,180,0.18)";
      ctx.lineWidth = d.id === 356 ? 1.2 : 0.5;
      ctx.stroke();
    });

    // Globe rim
    ctx.beginPath();
    pathGen(sphere);
    ctx.strokeStyle = "rgba(80,140,240,0.3)";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // India highlight glow (radial mask over India region)
    if (S.indiaGlow && S.indiaGlow > 0) {
      var pos = projection([78, 22]);
      if (pos) {
        var ig = ctx.createRadialGradient(pos[0], pos[1], 0, pos[0], pos[1], S.scale * 0.35);
        ig.addColorStop(0, "rgba(76,217,100," + (0.12 * S.indiaGlow) + ")");
        ig.addColorStop(1, "rgba(76,217,100,0)");
        ctx.fillStyle = ig;
        ctx.fillRect(0, 0, W, H);
      }
    }

    ctx.restore();

    // Update pin position every frame
    var pinPos = projection([LON, LAT]);
    if (pinPos) {
      document.getElementById("pd").style.left = pinPos[0] + "px";
      document.getElementById("pd").style.top  = pinPos[1] + "px";
      document.getElementById("pl").style.left = pinPos[0] + "px";
      document.getElementById("pl").style.top  = (pinPos[1] + 26) + "px";
      document.getElementById("ps").style.left = pinPos[0] + "px";
      document.getElementById("ps").style.top  = (pinPos[1] + 72) + "px";
    }
  }

  // Initial draw at state 0
  draw();

  // ── GSAP Timeline ──
  // NOT paused → child of gsap.globalTimeline
  // render-scene.js will pause globalTimeline and seek it frame-by-frame
  var tl = gsap.timeline();

  // Dummy tween covering full duration to ensure draw() fires every frame
  tl.to({ _: 0 }, { _: 1, duration: 8, ease: "none", onUpdate: draw }, 0);

  // 0-0.8s: Fade in globe
  tl.to(S, { alpha: 1, duration: 0.8, ease: "power2.out" }, 0);

  // 0-1.2s: Slow initial rotation (globe "waking up")
  tl.to(S, {
    rotLon: S.rotLon - 40,
    rotLat: S.rotLat + 8,
    duration: 1.2, ease: "power1.inOut"
  }, 0);

  // 1.0-4.5s: Fly to Saharanpur
  tl.to(S, {
    rotLon: -LON,
    rotLat: -LAT,
    scale: 2600,
    duration: 3.5, ease: "power3.inOut"
  }, 1.0);

  // 2.5-4.5s: India glow builds
  S.indiaGlow = 0;
  tl.to(S, { indiaGlow: 1, duration: 2.0, ease: "power2.inOut" }, 2.5);

  // 4.5s: Pin appears
  tl.to("#pd", { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.8)" }, 4.6);

  // Pin pulse ring
  tl.to("#pd", {
    boxShadow: "0 0 0 40px rgba(217,119,87,0)",
    duration: 0.9, ease: "power1.out"
  }, 4.6);

  // 5.0s: City name
  tl.to("#pl", { opacity: 1, duration: 0.4, ease: "power2.out" }, 5.0);
  tl.to("#ps", { opacity: 1, duration: 0.4, ease: "power2.out" }, 5.35);

  // 5.8s: Coords
  tl.to("#co", { opacity: 1, duration: 0.5, ease: "power2.out" }, 5.8);

  // 6.0-8.0s: Micro zoom breathe
  tl.to(S, { scale: 2650, duration: 2.0, ease: "sine.inOut" }, 6.0);

  window.__timelines = window.__timelines || {};
  window.__timelines["globe-saharanpur"] = tl;
})();
</script>
</body>
</html>`;

const outPath = require("path").resolve(__dirname, "../output/templates/scene-globe-saharanpur.html");
require("fs").writeFileSync(outPath, html);
console.log("Written:", outPath, "(" + html.length + " bytes)");
