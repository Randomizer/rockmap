// RockMap main.js — Consolidated version using SVG icon (no PNG required)
// Version token (bump internally for cache-busting on fetch calls)
const V = '2025-08-01-svg-1';

async function initRockMap() {
  console.log('RockMap: main.js loaded (', V, ')');

  // 1) Init Leaflet
  const map = L.map('map').setView([54, 10], 4);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // 2) Global white marker icon (SVG only, since PNG may be missing)
  const iconUrl = 'assets/img/marker-glow.svg?cv=' + V;
  const rockIcon = L.icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -38]
  });
  L.Marker.prototype.options.icon = rockIcon;
  console.log('Rock icon in use:', iconUrl);

  // 3) Helpers
  const fmtDate = (d) => {
    try {
      const dt = new Date(d);
      return isNaN(dt) ? (d || '') : dt.toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return d || ''; }
  };
  function spotifyLinkFor(artist, bandObj) {
    const direct = bandObj && bandObj.spotifyUrl && bandObj.spotifyUrl.trim();
    return direct || `https://open.spotify.com/search/${encodeURIComponent(artist)}`;
  }
  function spotifyAnchorHtml(artist, bandObj) {
    const url = spotifyLinkFor(artist, bandObj);
    // Inline styles to avoid external CSS dependency
    return `
      <a href="${url}" target="_blank" rel="noopener"
         aria-label="Öppna ${artist} på Spotify"
         style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#1DB954;text-decoration:none;">
        <svg viewBox="0 0 24 24" aria-hidden="true" width="14" height="14" style="fill:currentColor;">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.19 17.49c-.24.37-.74.49-1.12.25-3.08-1.87-6.96-2.29-11.53-1.25-.43.1-.87-.17-.97-.6-.1-.43.17-.87.6-.97 4.93-1.12 9.18-.64 12.57 1.49.38.23.5.73.25 1.08zm1.6-3.55c-.3.45-.92.59-1.39.3-3.52-2.17-8.89-2.8-13.05-1.52-.52.15-1.07-.14-1.22-.66-.15-.52.14-1.07.66-1.22 4.67-1.39 10.55-.7 14.5 1.72.48.3.62.93.33 1.38zm.14-3.74c-.36.54-1.1.7-1.66.38-4.02-2.4-10.14-2.62-13.82-1.44-.6.2-1.25-.14-1.45-.74-.2-.6.14-1.25.74-1.45 4.33-1.43 11.03-1.17 15.62 1.55.56.33.73 1.07.4 1.64z"></path>
        </svg>
        <span>Öppna på Spotify</span>
      </a>`;
  }
  function popupHtml({ artist, bandImg, venueName, city, country, dateText, bandObj, ticketUrl }) {
    return `
      <div style="text-align:center;max-width:260px;">
        <div style="font-size:15px;margin:2px 0 4px;font-weight:600;">${artist}</div>
        ${bandImg ? `<img src="${bandImg}" alt="${artist}" style="width:220px;max-width:100%;border-radius:6px;margin:6px 0;" onerror="this.style.display='none'">` : ''}
        <div style="font-size:12px;opacity:.9;line-height:1.3;">
          ${venueName ? venueName + '<br>' : ''}
          ${[city, country].filter(Boolean).join(', ')}<br>
          ${dateText || ''}
        </div>
        <div style="margin-top:6px;display:flex;justify-content:center;gap:10px;">
          ${spotifyAnchorHtml(artist, bandObj)}
          ${ticketUrl ? \`<a href="\${ticketUrl}" target="_blank" rel="noopener" style="font-size:12px;">Biljetter</a>\` : ''}
        </div>
      </div>`;
  }

  // 4) Load data
  let events = [];
  try { const er = await fetch(`events.json?v=${V}`, { cache: 'no-store' }); if (er.ok) events = await er.json(); } catch {}
  let bands = [];
  try { const br = await fetch(`data/bands.json?v=${V}`, { cache: 'no-store' }); if (br.ok) bands = await br.json(); } catch {}
  const bandIndex = Object.fromEntries((bands || []).map(b => [String(b.name || '').toLowerCase(), b]));
  console.log('Bands loaded:', bands.length);

  // 5) Plot: events with coordinates -> map; else demo markers from bands
  const hasGeoEvents = Array.isArray(events) && events.some(e => e?.venue?.latitude && e?.venue?.longitude);

  if (hasGeoEvents) {
    console.log('Events with coordinates found:', events.length);
    for (const e of events) {
      const lat = parseFloat(e?.venue?.latitude);
      const lon = parseFloat(e?.venue?.longitude);
      if (!isFinite(lat) || !isFinite(lon)) continue;

      const artist = e.artist || (e.lineup && e.lineup[0]) || 'Okänt band';
      let bandImg = null;
      try { bandImg = await resolveBandImage(artist); } catch {}

      const venue = e?.venue?.name || '';
      const city = e?.venue?.city || '';
      const country = e?.venue?.country || '';
      const dateText = fmtDate(e?.datetime || e?.date);

      const html = popupHtml({
        artist,
        bandImg,
        venueName: venue,
        city, country, dateText,
        bandObj: bandIndex[artist.toLowerCase()],
        ticketUrl: e.ticketUrl
      });

      L.marker([lat, lon], { title: artist }).bindPopup(html, { className: 'rockmap-popup', maxWidth: 320 }).addTo(map);
    }
  } else {
    console.log('No events with coordinates found. Falling back to demo markers from bands.json.');
    for (const band of bands) {
      const lat = 50 + Math.random() * 20 - 10;
      const lon = 10 + Math.random() * 20 - 10;
      let bandImg = null;
      try { bandImg = await resolveBandImage(band.name); } catch {}
      const html = popupHtml({ artist: band.name, bandImg, venueName: '', city: '', country: '', dateText: '', bandObj: band });
      L.marker([lat, lon], { title: band.name }).bindPopup(html, { className: 'rockmap-popup', maxWidth: 320 }).addTo(map);
    }
  }
}

initRockMap();
