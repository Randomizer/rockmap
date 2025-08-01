mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // byt ut mot din nyckel
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [10.0, 50.0],
    zoom: 2.5
});

document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('filter-box').classList.toggle('hidden');
});
console.log("🔧 RockMap version 1.0 loaded");
// Lägg till testmarkör
new mapboxgl.Marker({ color: 'black' })
  .setLngLat([10.0, 50.0])
  .setPopup(new mapboxgl.Popup().setText("Exempelband – Berlin"))
  .addTo(map);
