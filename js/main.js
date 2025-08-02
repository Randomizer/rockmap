// main.js – RockMap v1.6

// === Initialize Mapbox ===
mapboxgl.accessToken = MAPBOX_TOKEN;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: ROCKMAP_CONFIG.defaultCenter,
  zoom: ROCKMAP_CONFIG.defaultZoom
});

// Placeholder for popup
let currentPopup = null;
let popupState = {
  flipped: false,
  band: null,
  selectedGig: null,
  nextGig: null,
  spotifyUrl: null,
  bandImage: null,
};

// === Sample data, replace with real API data ===
const bands = [
  {
    name: "Metallica",
    image: "images/metallica.jpg",
    spotify: "https://open.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
    gigs: [
      { date: "2025-08-10", city: "Stockholm", venue: "Friends Arena", lat: 59.505, lng: 17.072 },
      { date: "2025-10-11", city: "Berlin", venue: "Olympiastadion", lat: 52.514, lng: 13.239 },
    ]
  },
  {
    name: "Coldplay",
    image: "images/coldplay.jpg",
    spotify: "https://open.spotify.com/artist/4gzpq5DPGxSnKTe4SA8HAU",
    gigs: [
      { date: "2025-09-12", city: "Göteborg", venue: "Ullevi", lat: 57.720, lng: 11.979 },
      { date: "2025-11-03", city: "London", venue: "Wembley", lat: 51.556, lng: -0.279 },
    ]
  },
  // Add more bands...
];

// === Add markers for each gig ===
bands.forEach(band => {
  band.gigs.forEach((gig, i) => {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = '36px';
    el.style.height = '36px';
    el.style.backgroundImage = "url('images/marker.png')";
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

// === Show Popup Function ===
function showPopup(band, gig) {
  popupState.flipped = false;
  popupState.band = band;
  popupState.selectedGig = gig;
  popupState.nextGig = getNextGig(band.gigs, gig.date);
  popupState.spotifyUrl = band.spotify;
  popupState.bandImage = band.image;

  renderPopup();
}

// === Find next gig after selected ===
function getNextGig(gigs, currentDate) {
  const next = gigs.find(g => g.date > currentDate);
  return next ? next : null;
}

// === Popup rendering ===
function renderPopup() {
  const popupContainer = document.getElementById('popup-container');
  popupContainer.innerHTML = "";

  // Card wrapper
  const card = document.createElement('div');
  card.className = 'rockmap-card';
  if (popupState.flipped) card.classList.add('flipped');

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    popupContainer.innerHTML = "";
    popupState.flipped = false;
  });
  card.appendChild(closeBtn);

  // --- Front Side ---
  if (!popupState.flipped) {
    // Band image
    const img = document.createElement('img');
    img.className = 'band-image';
    img.src = popupState.bandImage;
    img.alt = popupState.band.name;
    card.appendChild(img);

    // Band name
    const name = document.createElement('div');
    name.className = 'band-name';
    name.innerText = popupState.band.name;
    card.appendChild(name);

    // Selected gig (date, city, venue)
    const eventDate = document.createElement('div');
    eventDate.className = 'event-date';
    eventDate.innerText = `${popupState.selectedGig.date} – ${popupState.selectedGig.city}, ${popupState.selectedGig.venue}`;
    card.appendChild(eventDate);

    // Spotify link
    if (popupState.spotifyUrl) {
      const spotify = document.createElement('a');
      spotify.className = 'spotify-link';
      spotify.href = popupState.spotifyUrl;
      spotify.target = "_blank";
      spotify.innerText = "Listen on Spotify";
      card.appendChild(spotify);
    }

    // Flip button
    const flipBtn = document.createElement('button');
    flipBtn.className = 'flip-btn';
    flipBtn.innerText = "More info";
    flipBtn.addEventListener('click', () => {
      popupState.flipped = true;
      renderPopup();
    });
    card.appendChild(flipBtn);

    // Next gig
    if (popupState.nextGig) {
      const nextGigDiv = document.createElement('div');
      nextGigDiv.className = 'next-gig';
      nextGigDiv.innerHTML = `<b>Next gig:</b> ${popupState.nextGig.date} – ${popupState.nextGig.city}, ${popupState.nextGig.venue}`;
      card.appendChild(nextGigDiv);
    }

  } else {
    // --- Back Side ---
    // Extra band info – customize here as needed
    const info = document.createElement('div');
    info.innerHTML = `
      <div style="margin-bottom:10px;">
        <b>About the band:</b><br>
        ${popupState.band.name} is one of the world's leading rock acts.<br>
        <!-- Add more info dynamically as needed -->
      </div>
      <div>
        <b>Selected gig:</b><br>
        ${popupState.selectedGig.date} – ${popupState.selectedGig.city}, ${popupState.selectedGig.venue}
      </div>
    `;
    card.appendChild(info);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.innerText = "Back";
    backBtn.addEventListener('click', () => {
      popupState.flipped = false;
      renderPopup();
    });
    card.appendChild(backBtn);
  }

  popupContainer.appendChild(card);
}

// === Close popup on outside click ===
document.addEventListener('click', function(e) {
  const popupContainer = document.getElementById('popup-container');
  if (popupContainer && e.target === popupContainer) {
    popupContainer.innerHTML = "";
    popupState.flipped = false;
  }
});

// === ESC to close popup ===
document.addEventListener('keydown', function(e) {
  if (e.key === "Escape") {
    const popupContainer = document.getElementById('popup-container');
    if (popupContainer) {
      popupContainer.innerHTML = "";
      popupState.flipped = false;
    }
  }
});

// === OPTIONAL: Customize marker icons if you have multiple types ===
// .marker class in CSS, or change 'images/marker.png' above for custom icons.

