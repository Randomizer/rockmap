// Bildupplösare för band – hämtar från Wikipedia, annars fallback.
const LS_KEY = 'rockmap_band_images_v1';
const imageCache = new Map();

try {
  const cached = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  Object.entries(cached).forEach(([k, v]) => imageCache.set(k, v));
} catch { /* ignore */ }

function saveCache() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(Object.fromEntries(imageCache)));
  } catch { /* ignore quota */ }
}

async function resolveBandImage(bandName, fallbackUrl = 'assets/img/fallback-guitar.svg') {
  if (!bandName) return fallbackUrl;
  const key = bandName.toLowerCase().trim();
  if (imageCache.has(key)) return imageCache.get(key);

  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bandName)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      const img = (data && (data.thumbnail && data.thumbnail.source)) || (data && data.originalimage && data.originalimage.source);
      if (img) {
        imageCache.set(key, img);
        saveCache();
        return img;
      }
    }
  } catch (e) {
    console.warn('Wikipedia-bildhämtning misslyckades:', bandName, e);
  }

  imageCache.set(key, fallbackUrl);
  saveCache();
  return fallbackUrl;
}
