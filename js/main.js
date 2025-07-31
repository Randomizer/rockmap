// RockMap main.js — konsoliderad version (ikon + events + fallback)
// Författare: Per + assistent, 2025-07-31

async function initRockMap() {
  // --- 0) Liten cache-buster för Pages ---
  const V = '2025-07-31-2';

  // --- 1) Initiera kartan ---
  const map = L.map('map').setView([54, 10], 4);

  // Mörkt baslager (Carto Dark). Vill du ljusa upp: byt till Stadia alidade_smooth_dark.
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // --- 2) Säkra en ljus markörikon globalt (PNG → fallback SVG) ---
  async function chooseMarkerIconUrl() {
    // Först PNG (bäst kompatibilitet), annars SVG
    try {
      const r = await fetch(`assets/img/marker-glow.png?cv=${V}`, { cache: 'no-store' });
      if (r.ok) return `assets/img/marker-glow.png?cv=${V}`;
    } catch {}
    return `assets/img/marker-glow.svg?cv=${V}`;
  }

  const iconUrl = await chooseMarkerIconUrl();
  const rockIcon = L.icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -38]
  });

  // Sätt globalt så ALLA markörer använder denna om inget annat anges
  L.Marker.prototype.options.icon = rockIcon;
  console.log('Rock icon in use:', iconUrl);

  // --- 3) Hjälpfunktioner ---
  const fmtDate = (d) => {
    try {
      const dt = new Date(d);
      return isNaN(dt) ? (d || '') : dt.toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return d || ''; }
  };

  // --- 4) Läs data ---
  // Events (i roten). OK om tomt: []
  let events = [];
  try {
    const er = await fetch(`events.json?v=${V}`, { cache: 'no-store' });
    if (er.ok) events = await er.json();
  } catch (e) {
    console.warn('Kunde inte läsa events.json:', e);
  }

  // Bandlista (enda "source of truth")
  let bands = [];
  try {
    const br = await fetch(`data/bands.json?v=${V}`, { cache: 'no-store' });
    if (br.ok) bands = await br.json();
  } catch (e) {
    console.warn('Kunde inte läsa data/bands.json:', e);
  }
  console.log('Bands loaded:', bands.length, bands.map(b => b.name));

  // --- 5) Plotta: events om koordinater finns, annars demo från bands ---
  const hasGeoEvents = Array.isArray(events) && events.some(e => e?.venue?.latitude && e?.venue?.longitude);

  if (hasGeoEvents) {
    console.log('Events with coordinates found:', events.length);

    for (const e of events) {
      const lat = parseFloat(e?.venue?.latitude);
      const lon = parseFloat(e?.venue?.longitude);
      if (!isFinite(lat) || !isFinite(lon)) continue;

      const name = e.artist || (e.lineup && e.lineup[0]) || 'Okänt band';
      // Om du i framtiden sparar bild i eventet, använd den före bildupplösaren:
      const imgUrl = e.imageUrl ? e.imageUrl : await resolveBandImage(name);

      const venue = e?.venue?.name || '';
      const city = [e?.venue?.city, e?.venue?.country].filter(Boolean).join(', ');
      const date = fmtDate(e?.datetime || e?.date);

      const html = `
        <div style="text-align:center; max-width:240px;">
          <strong>${name}</strong><br>
          <img src="${imgUrl}" alt="${name}"
               style="width:220px;max-width:100%;border-radius:6px;margin:6px 0;"
               onerror="this.style.display='none'">
          <div style="font-size:12px;opacity:.9;line-height:1.3;">
            ${venue ? venue + '<br>' : ''}
            ${city ? city + '<br>' : ''}
            ${date}
          </div>
        </div>`;

      L.marker([lat, lon], { title: name })  // icon sätts globalt
        .bindPopup(html, { className: 'rockmap-popup', maxWidth: 280 })
        .addTo(map);
    }
  } else {
    console.log('No events with coordinates found. Falling back to demo markers from bands.json.');
    // Demo: slumpa lägen för att visa popup/bild tills riktiga events finns
    for (const band of bands) {
      const lat = 50 + Math.random() * 20 - 10;
      const lon = 10 + Math.random() * 20 - 10;
      const imageUrl = await resolveBandImage(band.name);

      const html = `
        <div style="text-align:center; max-width:220px;">
          <strong>${band.name}</strong><br>
          <img src="${imageUrl}" alt="${band.name}" 
               style="width:220px;max-width:100%;border-radius:6px;margin-top:4px;"
               onerror="this.style.display='none'">
        </div>`;

      L.marker([lat, lon], { title: band.name })  // icon sätts globalt
        .bindPopup(html, { className: 'rockmap-popup', maxWidth: 260 })
        .addTo(map);
    }
  }
}

initRockMap();
