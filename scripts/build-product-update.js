// Generates output/templates/scene-product-update.html
// A 15-second product update reel spotlighting two new features:
//   1. "Frequent host" badge
//   2. Home pickup icon
const fs = require("fs");
const path = require("path");

const LIGHTNING = `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></svg>`;
const HOME_ICON = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>`;
const PEOPLE   = `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="7" r="3"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/><circle cx="19" cy="7" r="2"/><path d="M22 21v-1a3 3 0 0 0-3-3"/></svg>`;
const COMPASS  = `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5" fill="#AEAEB2"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/></svg>`;

function badge() {
  return `<span class="fh-badge">Frequent host</span>`;
}

function card({ id, dep, arr, dur, from, to, price, name, rating, showBadge, icons, rideFull }) {
  const priceHtml = rideFull
    ? `<span class="ride-full-txt">Ride full</span>`
    : `<span class="price-txt">₹${price}<sup>00</sup></span>`;
  const badgeRow = showBadge ? `<div class="badge-spacer">${badge()}</div>` : `<div class="badge-spacer"></div>`;
  const iconHtml = icons.map(i => `<span class="icon-wrap">${i}</span>`).join("");
  return `
  <div class="ride-card" id="${id}">
    <div class="card-top">
      <div class="time-col">
        <span class="time-bold">${dep}</span>
        <span class="dur-txt">${dur}</span>
        <span class="time-bold">${arr}</span>
      </div>
      <div class="route-dots">
        <div class="rdot"></div>
        <div class="rline"></div>
        <div class="rdot"></div>
      </div>
      <div class="cities-col">
        <div class="city-row"><span class="city-name">${from}</span></div>
        ${badgeRow}
        <div class="city-row"><span class="city-name">${to}</span></div>
      </div>
      <div class="price-col">${priceHtml}</div>
    </div>
    <div class="card-div"></div>
    <div class="card-bottom">
      <div class="avatar av-${id}"></div>
      <span class="drv-name">${name}</span>
      <span class="rating-txt"><span class="star">★</span> ${rating}</span>
      <div class="icon-row">${iconHtml}</div>
    </div>
  </div>`;
}

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;width:1080px;height:1920px;background:#F2F2F7;overflow:hidden;
    font-family:-apple-system,"SF Pro Display","Inter",sans-serif;-webkit-font-smoothing:antialiased;}

  /* ── Intro screen ── */
  #intro{position:absolute;inset:0;background:#0A1628;display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:28px;z-index:80;}
  .i-tag{font-size:32px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
    color:#3B82F6;opacity:0;}
  .i-title{font-size:104px;font-weight:900;color:#F8FAFC;letter-spacing:-.04em;line-height:1;
    clip-path:inset(0 100% 0 0);}
  .i-sub{font-size:48px;font-weight:300;color:rgba(248,250,252,.45);opacity:0;}

  /* ── App shell ── */
  #app{position:absolute;top:0;left:0;width:1080px;height:1920px;opacity:0;transform:translateY(60px);}

  /* status bar */
  #sb{height:56px;background:white;display:flex;align-items:center;justify-content:space-between;
    padding:0 44px;}
  .sb-time{font-size:30px;font-weight:600;color:#1C1C1E;}
  .sb-icons{display:flex;gap:10px;align-items:center;}

  /* header */
  #hdr{background:white;padding:20px 40px 24px;border-bottom:1.5px solid #E5E5EA;display:flex;align-items:center;gap:16px;}
  .hdr-back{font-size:44px;font-weight:300;color:#1C1C1E;cursor:default;}
  .hdr-txt{flex:1;}
  .hdr-route{font-size:38px;font-weight:700;color:#1C1C1E;line-height:1.15;}
  .hdr-sub{font-size:28px;color:#6C6C70;font-weight:400;}
  .filter-btn{width:76px;height:76px;border-radius:50%;background:#F2F2F7;display:flex;
    align-items:center;justify-content:center;flex-shrink:0;}

  /* cards */
  #card-list{padding:20px 32px;display:flex;flex-direction:column;gap:18px;}
  .ride-card{background:white;border-radius:24px;overflow:visible;
    box-shadow:0 2px 14px rgba(0,0,0,.07);position:relative;z-index:1;
    opacity:0;transform:translateY(50px);}
  .card-top{display:flex;align-items:stretch;padding:28px 28px 0;gap:14px;}
  .time-col{display:flex;flex-direction:column;justify-content:space-between;min-width:120px;padding:2px 0;}
  .time-bold{font-size:44px;font-weight:700;color:#1C1C1E;line-height:1;}
  .dur-txt{font-size:26px;color:#8E8E93;font-weight:400;margin:4px 0;}
  .route-dots{display:flex;flex-direction:column;align-items:center;padding:4px 0;min-width:22px;}
  .rdot{width:14px;height:14px;border-radius:50%;border:2.5px solid #1C1C1E;background:white;flex-shrink:0;}
  .rline{flex:1;width:2.5px;background:#C7C7CC;margin:4px 0;min-height:36px;}
  .cities-col{flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:2px 0;gap:4px;}
  .city-row{display:flex;align-items:center;gap:14px;}
  .city-name{font-size:40px;font-weight:500;color:#1C1C1E;line-height:1.1;}
  .badge-spacer{height:26px;display:flex;align-items:center;}
  .fh-badge{display:inline-flex;align-items:center;background:#EBF3FF;color:#2563EB;
    font-size:24px;font-weight:600;padding:6px 20px;border-radius:100px;
    white-space:nowrap;letter-spacing:.01em;}
  .price-col{display:flex;flex-direction:column;justify-content:flex-start;padding-top:2px;flex-shrink:0;}
  .price-txt{font-size:40px;font-weight:700;color:#1C1C1E;white-space:nowrap;line-height:1;}
  .price-txt sup{font-size:24px;font-weight:500;vertical-align:super;}
  .ride-full-txt{font-size:32px;color:#8E8E93;font-weight:400;padding-top:4px;}
  .card-div{height:1.5px;background:#E5E5EA;margin:20px 28px 0;}
  .card-bottom{display:flex;align-items:center;padding:18px 28px 24px;gap:14px;}
  .avatar{width:68px;height:68px;border-radius:50%;flex-shrink:0;display:flex;
    align-items:center;justify-content:center;font-size:30px;color:white;font-weight:600;}
  .av-c1{background:#7B9EC7;} .av-c2{background:#7C6FBF;} .av-c3{background:#5FAE7E;}
  .drv-name{font-size:36px;font-weight:500;color:#1C1C1E;}
  .rating-txt{font-size:28px;color:#8E8E93;display:flex;align-items:center;gap:4px;}
  .star{color:#FFB800;}
  .icon-row{margin-left:auto;display:flex;align-items:center;gap:10px;}
  .icon-wrap{display:flex;align-items:center;}

  /* ── Dim overlay (sits above #app, below bottom sheet) ── */
  #dim{position:absolute;inset:0;background:rgba(10,22,40,0);pointer-events:none;z-index:20;}

  /* highlighted card peeks above dim */
  .ride-card.lit{z-index:25;box-shadow:0 0 0 3.5px #2563EB,0 8px 48px rgba(37,99,235,.22),0 2px 14px rgba(0,0,0,.07);}

  /* ── Bottom sheet annotation ── */
  #bsheet{position:absolute;bottom:0;left:0;right:0;height:700px;background:white;
    border-radius:48px 48px 0 0;box-shadow:0 -6px 60px rgba(0,0,0,.12);
    padding:52px 64px 60px;z-index:40;transform:translateY(700px);
    display:flex;flex-direction:column;gap:28px;}
  .bs-handle{width:60px;height:5px;border-radius:3px;background:#E5E5EA;margin:0 auto 8px;}
  .bs-pill{display:inline-flex;align-items:center;background:#3B82F6;color:white;
    font-size:26px;font-weight:700;letter-spacing:.14em;padding:10px 28px;border-radius:100px;
    width:fit-content;}
  .bs-title{font-size:72px;font-weight:800;color:#1C1C1E;letter-spacing:-.03em;line-height:1.05;
    clip-path:inset(0 100% 0 0);}
  .bs-desc{font-size:36px;font-weight:400;color:#6C6C70;line-height:1.5;opacity:0;}

  /* ── Outro ── */
  #outro{position:absolute;bottom:160px;left:0;right:0;text-align:center;
    font-size:52px;font-weight:700;color:#1C1C1E;opacity:0;z-index:30;}
  .green{color:#22C55E;}
</style>
</head><body>

<!-- ── Intro ── -->
<div id="intro">
  <div class="i-tag" id="itag">Product Update</div>
  <div class="i-title" id="ititle">What's New</div>
  <div class="i-sub" id="isub">Itinerary App</div>
</div>

<!-- ── App ── -->
<div id="app">
  <div id="sb">
    <span class="sb-time">9:41</span>
    <div class="sb-icons">
      <svg width="52" height="22" viewBox="0 0 52 22"><rect x="0" y="10" width="8" height="12" rx="1.5" fill="#1C1C1E"/><rect x="11" y="6" width="8" height="16" rx="1.5" fill="#1C1C1E"/><rect x="22" y="2" width="8" height="20" rx="1.5" fill="#1C1C1E"/><rect x="33" y="0" width="8" height="22" rx="1.5" fill="#1C1C1E"/></svg>
      <svg width="34" height="22" viewBox="0 0 34 22"><path d="M17 2C9 2 3 7 1 11c2 4 8 9 16 9s14-5 16-9C31 7 25 2 17 2z" stroke="#1C1C1E" stroke-width="2" fill="none"/><circle cx="17" cy="11" r="4" fill="#1C1C1E"/></svg>
      <div style="display:flex;align-items:center;gap:2px;">
        <div style="width:46px;height:22px;border:2px solid #1C1C1E;border-radius:5px;padding:3px;">
          <div style="background:#1C1C1E;width:100%;height:100%;border-radius:2px;"></div>
        </div>
      </div>
    </div>
  </div>
  <div id="hdr">
    <span class="hdr-back">‹</span>
    <div class="hdr-txt">
      <div class="hdr-route">Haridwar → Delhi</div>
      <div class="hdr-sub">Tomorrow, 1 co-traveller</div>
    </div>
    <div class="filter-btn">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" stroke-width="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </div>
  </div>

  <div id="card-list">
    ${card({ id:"c1", dep:"05:30", arr:"09:10", dur:"3h40", from:"Haridwar", to:"Delhi",    price:"550", name:"Sahil",  rating:"4.6", showBadge:false, icons:[LIGHTNING] })}
    ${card({ id:"c2", dep:"08:20", arr:"12:00", dur:"3h40", from:"Haridwar", to:"Ghaziabad",price:"510", name:"Vikram", rating:"4.9", showBadge:true,  icons:[COMPASS,PEOPLE,LIGHTNING] })}
    ${card({ id:"c3", dep:"06:15", arr:"10:05", dur:"3h50", from:"Rishikesh",to:"Gurugram", price:"620", name:"Arjun",  rating:"4.8", showBadge:true,  icons:[HOME_ICON,LIGHTNING] })}
  </div>

  <div id="outro">2 new features&nbsp; <span class="green">live now ✓</span></div>
</div>

<!-- ── Dim overlay ── -->
<div id="dim"></div>

<!-- ── Bottom sheet ── -->
<div id="bsheet">
  <div class="bs-handle"></div>
  <div class="bs-pill" id="bs-pill">NEW</div>
  <div class="bs-title" id="bs-title"></div>
  <div class="bs-desc"  id="bs-desc"></div>
</div>

<script>
(function(){
  if(!window.gsap) return;

  /* helpers */
  function setAnnotation(title, desc) {
    document.getElementById("bs-title").textContent = title;
    document.getElementById("bs-desc").textContent  = desc;
  }

  var tl = gsap.timeline();

  /* ── INTRO  0-2.2s ── */
  tl.fromTo("#itag",   {opacity:0},{opacity:1,duration:.45,ease:"power2.out"},0.2);
  tl.fromTo("#ititle", {clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0% 0 0)",duration:.9,ease:"power3.inOut"},0.5);
  tl.fromTo("#isub",   {opacity:0},{opacity:1,duration:.5,ease:"power2.out"},1.1);

  /* ── TRANSITION  2.0-3.2s ── */
  tl.to("#intro", {opacity:0,duration:.55,ease:"power2.in"},2.0);
  tl.to("#app",   {opacity:1,y:0,duration:.55,ease:"power2.out"},2.3);

  /* ── CARDS STAGGER  2.9-4.2s ── */
  tl.to(".ride-card",{opacity:1,y:0,duration:.5,ease:"back.out(1.5)",stagger:{each:.18}},2.9);

  /* ── PAUSE  4.2-4.8s: show full app ── */

  /* ── FEATURE 1: Frequent Host  4.8-9.8s ── */
  tl.to("#dim",{background:"rgba(10,22,40,.52)",duration:.45},4.8);
  tl.to("#c2", {zIndex:25,boxShadow:"0 0 0 3.5px #2563EB,0 8px 48px rgba(37,99,235,.25)",duration:.3},4.8);
  tl.to("#c1,#c3",{opacity:.45,duration:.35},4.8);

  // Sheet slides up
  tl.call(()=>setAnnotation("Frequent Host","Instantly spot experienced, trusted drivers before you book"),[],5.0);
  tl.set("#bs-title",{clipPath:"inset(0 100% 0 0)"},5.0);
  tl.set("#bs-desc", {opacity:0},5.0);
  tl.to("#bsheet",{y:0,duration:.55,ease:"power3.out"},5.0);
  tl.to("#bs-title",{clipPath:"inset(0 0% 0 0)",duration:.65,ease:"power3.inOut"},5.4);
  tl.to("#bs-desc", {opacity:1,duration:.45,ease:"power2.out"},5.9);

  // Badge pulse ×2
  tl.to(".fh-badge",{scale:1.08,duration:.18,ease:"power2.out",yoyo:true,repeat:1},6.5);
  tl.to(".fh-badge",{scale:1.06,duration:.16,ease:"power2.out",yoyo:true,repeat:1},8.2);

  /* ── TRANSITION  9.8-10.6s ── */
  tl.to("#bsheet",{y:700,duration:.4,ease:"power2.in"},9.8);
  tl.to("#c2",{zIndex:1,boxShadow:"0 2px 14px rgba(0,0,0,.07)",duration:.25},9.9);
  tl.to("#c1,#c2,#c3",{opacity:1,duration:.3},10.0);

  /* ── FEATURE 2: Home Icon  10.4-14.6s ── */
  tl.to("#c3",{zIndex:25,boxShadow:"0 0 0 3.5px #2563EB,0 8px 48px rgba(37,99,235,.25)",duration:.3},10.4);
  tl.to("#c1,#c2",{opacity:.45,duration:.35},10.4);

  // Home icon pop
  tl.to("#c3 .icon-row .icon-wrap:first-child",{scale:1.5,duration:.22,ease:"back.out(2)"},10.7);
  tl.to("#c3 .icon-row .icon-wrap:first-child",{scale:1.0,duration:.2,ease:"power2.in"},10.95);

  // Sheet
  tl.call(()=>setAnnotation("Home Pickup Icon","See drivers departing from their home — more reliable, on-time starts"),[],10.9);
  tl.set("#bs-title",{clipPath:"inset(0 100% 0 0)"},10.9);
  tl.set("#bs-desc", {opacity:0},10.9);
  tl.to("#bsheet",{y:0,duration:.55,ease:"power3.out"},10.9);
  tl.to("#bs-title",{clipPath:"inset(0 0% 0 0)",duration:.65,ease:"power3.inOut"},11.3);
  tl.to("#bs-desc", {opacity:1,duration:.45,ease:"power2.out"},11.8);

  // Home icon pulse ×2
  tl.to("#c3 .icon-row .icon-wrap:first-child",{scale:1.35,duration:.2,ease:"power2.out",yoyo:true,repeat:1},12.8);
  tl.to("#c3 .icon-row .icon-wrap:first-child",{scale:1.25,duration:.18,ease:"power2.out",yoyo:true,repeat:1},14.0);

  /* ── OUTRO  14.6-15s ── */
  tl.to("#bsheet",{y:700,duration:.4,ease:"power2.in"},14.6);
  tl.to("#dim",{background:"rgba(10,22,40,0)",duration:.4},14.6);
  tl.to(".ride-card",{opacity:1,zIndex:1,boxShadow:"0 2px 14px rgba(0,0,0,.07)",duration:.35},14.7);
  tl.to("#outro",{opacity:1,duration:.5,ease:"power2.out"},15.1);

  window.__timelines = window.__timelines || {};
  window.__timelines["product-update"] = tl;
})();
</script>
</body></html>`;

const outPath = path.resolve(__dirname, "../output/templates/scene-product-update.html");
fs.writeFileSync(outPath, html);
console.log("Written:", outPath, "(", html.length, "bytes)");
