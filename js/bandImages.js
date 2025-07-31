const LS_KEY = 'rockmap_band_images_v1';
const imageCache = new Map();

try {
  const cached = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  Object.entries(cached).forEach(([k, v]) => imageCache.set(k, v));
} catch {}

function saveCache() {
  localStorage.setItem(LS_KEY, JSON.stringify(Object.fromEntries(imageCache)));
}

async function resolveBandImage(bandName, fallbackUrl = 'assets/img/fallback-guitar.svg') {
  const key = bandName.toLowerCase();
  if (imageCache.has(key)) return imageCache.get(key);

  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bandName)}`);
    if (res.ok) {
      const data = await res.json();
      const url = data?.thumbnail?.source || data?.originalimage?.source;
      if (url) {
        imageCache.set(key, url);
        saveCache();
        return url;
      }
    }
  } catch (err) {
    console.warn('Bildhämtning misslyckades för', bandName, err);
  }

  imageCache.set(key, fallbackUrl);
  saveCache();
  return fallbackUrl;
}
