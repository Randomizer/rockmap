// main.js – RockMap v1.6 with Bandsintown API

mapboxgl.accessToken = MAPBOX_TOKEN;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: ROCKMAP_CONFIG.defaultCenter,
  zoom: ROCKMAP_CONFIG.defaultZoom
});

// The artists you want to show on the map
const artists = [
  {
    name: "Metallica",
    spotify: "https://open.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
    image: "assets/img/metallica.jpg"
  },
  {
    name: "Coldplay",
    spotify: "https://open.spotify.com/artist/4gzpq5DPGxSnKTe4SA8HAU",
    image: "assets/img/coldplay.jpg"
  }
];

// Popup state
let popupState = {
  flipped: false,
  band: null,
  selectedGig: null,
  nextGig: null,
  spotifyUrl: null,
  bandImage: null,
};

// Load all gigs for all artists from Bandsintown
async function loadAndShowGigs() {
  for (const artist of artists) {
    try {
      const response = await fetch(`https://rest.bandsintown.com/artists/${encodeURIComponent(artist.name)}/events?app_id=rockmapdemo&date=upcoming`);
      if (!response.ok) throw new Error("API error");
      const events = await response.json();

      // Only proceed if we get an array
      if (!Array.isArray(events)) continue;

      // Add a marker for each event
      events.forEach((event, i) => {
        // Only plot if location exists
        if (event.venue && event.venue.latitude && event.venue.longitude) {
          const gig = {
            date: event.datetime.slice(0, 10),
            city: event.venue.city,
            venue: event.venue.name,
            lat: parseFloat(event.venue.latitude),
            lng: parseFloat(event.venue.longitude),
            country: event.venue.country,
            region: event.venue.region
          };

          const el = document.createElement('div');
          el.className = 'marker';
          el.style.width = '36px';
          el.style.height = '36px';
          el.style.backgroundImage = "url('assets/img/marker.png')";
          el.style.backgroundSize = 'cover';
          el.style.borderRadius = '50%';
          el.style.cursor = 'pointer';
          el.title = `${artist.name} - ${gig.city}`;

          el.addEventListener('click', (e) => {
            e.stopPropagation();
            showPopup({
              ...artist,
              gigs: events.map(ev => ({
                date: ev.datetime.slice(0, 10),
                city: ev.venue.city,
                venue: ev.venue.name,
                lat: parseFloat(ev.venue.latitude),
                lng: parseFloat(ev.venue.longitude),
                country: ev.venue.country,
                region: ev.venue.region
              }))
            }, gig);
          });

          new mapboxgl.Marker(el)
            .setLngLat([gig.lng, gig.lat])
            .addTo(map);
        }
      });
    } catch (err) {
      console.error(`Could not load events for ${artist.name}:`, err);
    }
  }
}

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

// Render the popup card
function renderPopup() {
  const popupContainer = document.getElementById('popup-container');
  popupContainer.innerHTML = "";

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

  // Front Side
  if (!popupState.flipped) {
    const img = document.createElement('img');
    img.className = 'band-image';
    img.src = popupState.bandImage;
    img.alt = popupState.band.name;
    card.appendChild(img);

    const name = document.createElement('div');
    name.className = 'band-name';
    name.innerText = popupState.band.name;
    card.appendChild(name);

    const eventDate = document.createElement('div');
    eventDate.className = 'event-date';
    eventDate.innerText = `${popupState.selectedGig.date} – ${popupState.selectedGig.city}, ${popupState.selectedGig.venue}`;
    card.appendChild(eventDate);

    if (popupState.spotifyUrl) {
      const spotify = document.createElement('a');
      spotify.className = 'spotify-link';
      spotify.href = popupState.spotifyUrl;
      spotify.target = "_blank";
      spotify.innerText = "Listen on Spotify";
      card.appendChild(spotify);
    }

    const flipBtn = document.createElement('button');
    flipBtn.className = 'flip-btn';
    flipBtn.innerText = "More info";
    flipBtn.addEventListener('click', () => {
      popupState.flipped = true;
      renderPopup();
    });
    card.appendChild(flipBtn);

    if (popupState.nextGig) {
      const nextGigDiv = document.createElement('div');
      nextGigDiv.className = 'next-gig';
      nextGigDiv.innerHTML = `<b>Next gig:</b> ${popupState.nextGig.date} – ${popupState.nextGig.city}, ${popupState.nextGig.venue}`;
      card.appendChild(nextGigDiv);
    }

  } else {
    // Back Side
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
    card.appendChild(info);

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

// Load the map with all gigs from Bandsintown
loadAndShowGigs();
