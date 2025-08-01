mapboxgl.accessToken = MAPBOX_TOKEN;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [10.0, 50.0],
    zoom: 2.5
});

new mapboxgl.Marker({ color: 'black' })
  .setLngLat([10.0, 50.0])
  .setPopup(new mapboxgl.Popup().setText("Exempelband – Berlin"))
  .addTo(map);

console.log("🔧 RockMap version 1.1 loaded");