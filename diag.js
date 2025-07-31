(function () {
  const out = document.getElementById('log');
  const p = (msg) => { out.textContent += (typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)) + '\n'; console.log(msg); };

  p('Diag start');
  p('Location: ' + location.href);

  // 1) Lista laddade skript
  const srcs = Array.from(document.scripts).map(s => s.src || '(inline)');
  p({ loadedScripts: srcs });

  // 2) Testa om Leaflet finns
  p('Leaflet typeof L: ' + (typeof L));

  // 3) Initiera en enkel karta
  try {
    const map = L.map('map').setView([59.33, 18.06], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    L.marker([59.33, 18.06]).addTo(map).bindPopup('Hej Stockholm!').openPopup();
    p('Leaflet init: OK');
  } catch (e) {
    p('Leaflet init: ERROR ' + e.message);
  }

  // 4) Testa att dina filer finns (justera versionssuffix här om du vill)
  const ver = '2025-08-01-2';
  const paths = ['js/bandImages.js', 'js/main.js', 'css/style.css', 'assets/img/marker-glow.png', 'assets/img/marker-glow.svg'];
  Promise.all(paths.map(path =>
    fetch(path + '?v=' + ver, { cache: 'no-store' }).then(r => ({ path, status: r.status })).catch(() => ({ path, status: 'ERR' }))
  )).then(results => {
    p({ fetchStatuses: results });
  });
})();