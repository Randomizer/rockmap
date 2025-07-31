mapboxgl.accessToken = 'pk.eyJ1IjoiYXJhbmV0IiwiYSI6ImNtZHI1eHoxNjBkeDkybnNibm9nMmpiOGoifQ.fAtpWpVeQgSG8XivujRiHw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [13.405, 52.52],
  zoom: 13,
  pitch: 60,
  bearing: -30,
  antialias: true
});

let concerts = [];
let markers = [];

// Dropdown och sökfilter
const bandSelect = document.createElement("select");
bandSelect.id = "bandSelect";
bandSelect.style.position = "absolute";
bandSelect.style.top = "10px";
bandSelect.style.right = "10px";
bandSelect.style.zIndex = "1000";
bandSelect.style.padding = "6px";
bandSelect.style.background = "#222";
bandSelect.style.color = "#fff";
bandSelect.style.border = "1px solid #555";
document.body.appendChild(bandSelect);

const searchInput = document.createElement("input");
searchInput.id = "searchInput";
searchInput.placeholder = "Sök plats...";
searchInput.style.position = "absolute";
searchInput.style.top = "50px";
searchInput.style.right = "10px";
searchInput.style.zIndex = "1000";
searchInput.style.padding = "6px";
searchInput.style.background = "#222";
searchInput.style.color = "#fff";
searchInput.style.border = "1px solid #555";
document.body.appendChild(searchInput);

// Dummydata – detta ersätts med JSON-hämtning i riktig version
concerts = [
  { band: "Metallica", coords: [13.405, 52.52], date: "2025-08-15", venue: "Waldbühne" },
  { band: "Coldplay", coords: [2.3522, 48.8566], date: "2025-09-01", venue: "Accor Arena" },
  { band: "The Killers", coords: [-0.1276, 51.5072], date: "2025-08-22", venue: "O2 Arena" },
  { band: "Metallica", coords: [10.75, 59.91], date: "2025-09-12", venue: "Oslo Spektrum" }
];

map.on('load', () => {
  add3DBuildings();
  populateBandDropdown();
  renderMarkers(concerts);
});

function add3DBuildings() {
  map.addLayer({
    id: '3d-buildings',
    source: 'composite',
    'source-layer': 'building',
    filter: ['==', 'extrude', 'true'],
    type: 'fill-extrusion',
    minzoom: 15,
    paint: {
      'fill-extrusion-color': '#aaa',
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'min_height'],
      'fill-extrusion-opacity': 0.6
    }
  });
}

function renderMarkers(data) {
  markers.forEach(m => m.remove());
  markers = [];

  data.forEach(concert => {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(../assets/img/marker-glow.svg)';
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.backgroundSize = 'cover';

    const marker = new mapboxgl.Marker(el)
      .setLngLat(concert.coords)
      .setPopup(new mapboxgl.Popup().setHTML(`
        <strong>${concert.band}</strong><br>
        ${concert.venue}<br>
        ${concert.date}
      `))
      .addTo(map);

    marker.getElement().addEventListener('click', () => {
      filterByBand(concert.band);
    });

    markers.push(marker);
  });
}

function populateBandDropdown() {
  const bands = [...new Set(concerts.map(c => c.band))];
  bandSelect.innerHTML = '<option value="all">Alla band</option>';
  bands.forEach(band => {
    const opt = document.createElement("option");
    opt.value = band;
    opt.textContent = band;
    bandSelect.appendChild(opt);
  });
}

bandSelect.addEventListener("change", () => {
  const band = bandSelect.value;
  const filtered = band === "all" ? concerts : concerts.filter(c => c.band === band);
  renderMarkers(filtered);
  if (band !== "all") showClearButton(band);
  else hideClearButton();
});

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = concerts.filter(c => c.venue.toLowerCase().includes(value));
  renderMarkers(filtered);
  if (value) showClearButton("Sök: " + value);
  else hideClearButton();
});

function filterByBand(band) {
  bandSelect.value = band;
  const filtered = concerts.filter(c => c.band === band);
  renderMarkers(filtered);
  showClearButton(band);
}

function showClearButton(label) {
  let btn = document.getElementById("clearFilter");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "clearFilter";
    btn.style.position = "absolute";
    btn.style.bottom = "10px";
    btn.style.right = "10px";
    btn.style.zIndex = "1000";
    btn.style.padding = "6px 12px";
    btn.style.background = "#222";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    document.body.appendChild(btn);
    btn.addEventListener("click", () => {
      bandSelect.value = "all";
      searchInput.value = "";
      renderMarkers(concerts);
      hideClearButton();
    });
  }
  btn.innerText = "Rensa filter: " + label;
  btn.style.display = "block";
}

function hideClearButton() {
  const btn = document.getElementById("clearFilter");
  if (btn) btn.style.display = "none";
}

// Toggle 3D
let is3D = true;
document.getElementById("toggle3d").onclick = () => {
  is3D = !is3D;
  map.easeTo({
    pitch: is3D ? 60 : 0,
    bearing: is3D ? -30 : 0,
    duration: 800
  });
};
