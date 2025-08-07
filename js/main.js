// main.js – RockMap v1.6 (mockdata, flip card, popup UI, ENGLISH COMMENTS)

// Set Mapbox token from config.js
mapboxgl.accessToken = MAPBOX_TOKEN;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: ROCKMAP_CONFIG.defaultCenter,
  zoom: ROCKMAP_CONFIG.defaultZoom
});

// Mock band and gig data
const bands = [
  {
    name: "Metallica",
    image: "assets/img/metallica.jpg",
    spotify: "https://open.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
    gigs: [
      { date: "2025-08-10", city: "Stockholm", venue: "Friends Arena", lat: 59.505, lng: 17.072 },
      { date: "2025-10-11", city: "Berlin", venue: "Olympiastadion", lat: 52.514, lng: 13.239 }
    ]
  },
  {
    name: "Coldplay",
    image: "assets/img/coldplay.jpg",
    spotify: "https://open.spotify.com/artist/4gzpq5DPGxSnKTe4SA8HAU",
    gigs: [
      { date: "2025-09-12", city: "Göteborg", venue: "Ullevi", lat: 57.720, lng: 11.979 },
      { date: "2025-11-03", city: "London", venue: "Wembley", lat: 51.556, lng: -0.279 }
    ]
  }
];

// State for popup
let popupState = {
  flipped: false,
  band: null,
  selectedGig: null,
  nextGig: null,
  spotifyUrl: null,
  bandImage: null
};

// Add map markers for each gig
bands.forEach(band => {
  band.gigs.forEach(gig => {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = '36px';
    el.style.height = '36px';
    el.style.backgroundImage = "url('assets/img/marker.png')";
    el.style.backgroundSize = 'cover';
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';
    el.title = `${band.name} - ${gig.city}`;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      showPopup(band, gig);
    });

    new mapboxgl.Marker(el)
      .setLngLat([gig.lng, gig.lat])
      .addTo(map);
  });
});

// Show popup card for selected gig
function showPopup(band, gig) {
  popupState.flipped = false;
  popupState.band = band;
  popupState.selectedGig = gig;
  popupState.nextGig = getNextGig(band.gigs, gig.date);
  popupState.spotifyUrl = band.spotify;
  popupState.bandImage = band.image;

  renderPopup();
}

// Find the next gig after selected
function getNextGig(gigs, currentDate) {
  const next = gigs.find(g => g.date > currentDate);
  return next ? next : null;
}

// Render the popup flip card (front & back)
function renderPopup() {
  const popupContainer = document.getElementById('popup-container');
  popupContainer.innerHTML = "";

  // Card wrapper
  const card = document.createElement('div');
  card.className = 'rockmap-card' + (popupState.flipped ? ' flipped' : '');

  // Inner wrapper for 3D flip
  const cardInner = document.createElement('div');
  cardInner.className = 'card-inner';

  // --- Front Side ---
  const cardFront = document.createElement('div');
  cardFront.className = 'card-front';

  // Close button (front)
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    popupContainer.innerHTML = "";
    popupState.flipped = false;
  });
  cardFront.appendChild(closeBtn);

  // Band image, name, gig, spotify, flip
  const img = document.createElement('img');
  img.className = 'band-image';
  img.src = popupState.bandImage;
  img.alt = popupState.band.name;
  cardFront.appendChild(img);

  const name = document.createElement('div');
  name.className = 'band-name';
  name.innerText = popupState.band.name;
  cardFront.appendChild(name);

  const eventDate = document.createElement('div');
  eventDate.className = 'event-date';
  eventDate.innerText = `${popupState.selectedGig.date} – ${popupState.selectedGig.city}, ${popupState.selectedGig.venue}`;
  cardFront.appendChild(eventDate);

  if (popupState.spotifyUrl) {
    const spotify = document.createElement('a');
    spotify.className = 'spotify-link';
    spotify.href = popupState.spotifyUrl;
    spotify.target = "_blank";
    spotify.innerText = "Listen on Spotify";
    cardFront.appendChild(spotify);
  }

  const flipBtn = document.createElement('button');
  flipBtn.className = 'flip-btn';
  flipBtn.innerText = "More info";
  flipBtn.addEventListener('click', () => {
    popupState.flipped = true;
    renderPopup();
  });
  cardFront.appendChild(flipBtn);

  // NEXT GIG -- This must be inside cardFront for flip to work!
  if (popupState.nextGig) {
    const nextGigDiv = document.createElement('div');
    nextGigDiv.className = 'next-gig';
    nextGigDiv.innerHTML = `<b>Next gig:</b> ${popupState.nextGig.date} – ${popupState.nextGig.city}, ${popupState.nextGig.venue}`;
    cardFront.appendChild(nextGigDiv); // INSIDE cardFront!
  }

  // --- Back Side ---
  const cardBack = document.createElement('div');
  cardBack.className = 'card-back';

  // Close button (back)
  const closeBtnBack = document.createElement('button');
  closeBtnBack.className = 'close-btn';
  closeBtnBack.innerHTML = '&times;';
  closeBtnBack.addEventListener('click', () => {
    popupContainer.innerHTML = "";
    popupState.flipped = false;
  });
  cardBack.appendChild(closeBtnBack);

  // Band info (customize as needed)
  const info = document.createElement('div');
  info.innerHTML = `
    <div style="margin-bottom:10px;">
      <b>About the band:</b><br>
      ${popupState.band.name} is one of the world's leading rock acts.<br>
    </div>
    <div>
      <b>Selected gig:</b><br>
      ${popupState.selectedGig.date} – ${popupState.selectedGig.city}, ${popupState.selectedGig.venue}
    </div>
  `;
  cardBack.appendChild(info);

  // Back button
  const backBtn = document.createElement('button');
  backBtn.className = 'back-btn';
  backBtn.innerText = "Back";
  backBtn.addEventListener('click', () => {
    popupState.flipped = false;
    renderPopup();
  });
  cardBack.appendChild(backBtn);

  // Build the card
  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);
  popupContainer.appendChild(card);
}

// Close popup on outside click
document.addEventListener('click', function(e) {
  const popupContainer = document.getElementById('popup-container');
  if (popupContainer && e.target === popupContainer) {
    popupContainer.innerHTML = "";
    popupState.flipped = false;
  }
});

// ESC to close popup
document.addEventListener('keydown', function(e) {
  if (e.key === "Escape") {
    const popupContainer = document.getElementById('popup-container');
    if (popupContainer) {
      popupContainer.innerHTML = "";
      popupState.flipped = false;
    }
  }
});
