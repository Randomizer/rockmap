
function flipCard(showBack) {
  const container = document.getElementById("flip-container");
  if (showBack) {
    container.classList.add("flipped");
  } else {
    container.classList.remove("flipped");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("popup-container");

  fetch("band-data-API.json")
    .then(res => res.json())
    .then(data => {
      const band = data.bands[0];
      const image = band.image || "";
      const spotify = band.spotify || "#";

      const clickedDate = band.clickedGigDate || "Unknown date";
      const clickedLocation = band.clickedLocation || "Unknown location";
      const nextDate = band.nextGigDate;
      const nextLocation = band.nextGigLocation;

      let html = "";
      html += `<button class="close-top-right" onclick="closePopup()">×</button>` + html;

      if (image) {
        html += `<img src="${image}" class="band-image" alt="${band.name}" />`;
      }

      html += `
        <h2 style='margin-top: 0; font-size: 1.5em;'>
          <svg class='icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path d='M9 18V5l12-2v13'/><circle cx='6' cy='18' r='3'/><circle cx='18' cy='16' r='3'/>
          </svg>${band.name}
        </h2>

        <p><strong>Gig date:</strong> ${clickedDate}</p>
        <p><strong>Location:</strong> ${clickedLocation}</p>

        <p>
          <svg class='spotify-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 168 168'>
            <circle cx='84' cy='84' r='84' fill='#1DB954'/>
            <path fill='#000' d='M119.36 117.29a6.33 6.33 0 0 1-8.7 2.14c-23.82-14.6-53.91-17.9-89.36-9.77a6.33 6.33 0 0 1-2.93-12.37c38.7-9.16 72-5.35 98.63 11.35a6.33 6.33 0 0 1 2.36 8.65Zm11.25-21.83a7.91 7.91 0 0 1-10.83 2.67c-27.28-16.72-68.86-21.59-101.17-11.78a7.91 7.91 0 1 1-4.63-15.18c38-11.6 84.72-6.09 116.45 13.65a7.91 7.91 0 0 1 2.18 10.64Zm2.84-22.65c-32.2-19.74-85.79-21.06-116.49-11.5a9.5 9.5 0 0 1-5.61-18.23c35.83-11 97.68-9.48 133.37 13.1a9.5 9.5 0 0 1-9.54 16.63Z'/>
          </svg>
          <strong>Spotify:</strong> <a href="${spotify}" target="_blank">Open in Spotify</a>
        </p>
      `;

      if (nextDate && new Date(nextDate) > new Date()) {
        html += `
          <hr style="margin: 16px 0; border-color: #333;">
          <h4 style="margin-bottom: 6px;">Upcoming gigs</h4>
          <p><strong>Next gig:</strong> ${nextDate}</p>
          <p><strong>Location:</strong> ${nextLocation}</p>
        `;
      }

      html += `<button class="more-info-btn" onclick="flipCard(true)">More info</button>`;

      container.innerHTML = html;
    })
    .catch(err => {
      container.innerHTML = "<p style='color:red;'>Failed to load band data.</p>";
      console.error("API fetch error:", err);
    });
});

function closePopup() {
  const card = document.getElementById("flip-container");
  if (card) {
    card.style.display = "none";
  }
}
