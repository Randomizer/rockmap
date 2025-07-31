async function initRockMap() {
  const map = L.map('map').setView([50, 10], 4);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  const bands = await (await fetch('data/bands.json')).json();
  for (const band of bands) {
    const lat = 50 + Math.random() * 20 - 10; 
    const lon = 10 + Math.random() * 20 - 10;

    const imageUrl = await resolveBandImage(band.name);

    L.marker([lat, lon], { title: band.name })
      .bindPopup(`
        <div style="text-align:center; max-width:220px;">
          <strong>${band.name}</strong><br>
          <img src="${imageUrl}" alt="${band.name}" 
               style="width:220px;max-width:100%;border-radius:6px;margin-top:4px;">
        </div>
      `, { className: 'rockmap-popup', maxWidth: 260 })
      .addTo(map);
  }
}

initRockMap();
