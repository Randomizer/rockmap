
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
      const date = band.date || "No upcoming shows";
      const location = band.location || "Unknown";
      const image = band.image || "";

      container.innerHTML = `
        ${image ? `<img src="${image}" class="band-image" alt="${band.name}" />` : ""}
        <h2 style='margin-top: 0; font-size: 1.5em;'>
          <svg class='icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path d='M9 18V5l12-2v13'/><circle cx='6' cy='18' r='3'/><circle cx='18' cy='16' r='3'/>
          </svg>${band.name}
        </h2>
        <p><svg class='icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <rect width='18' height='18' x='3' y='4' rx='2'/>
          <line x1='16' x2='16' y1='2' y2='6'/>
          <line x1='8' x2='8' y1='2' y2='6'/>
          <line x1='3' x2='21' y1='10' y2='10'/>
        </svg><strong>Next gig:</strong> ${date}</p>
        <p><svg class='icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <path d='M12 21s-6-5.686-6-10a6 6 0 0112 0c0 4.314-6 10-6 10z'/>
          <circle cx='12' cy='11' r='2'/>
        </svg><strong>Location:</strong> ${location}</p>
        <p>
          <svg class='spotify-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 168 168'>
            <circle cx='84' cy='84' r='84' fill='#1DB954'/>
            <path fill='#000' d='M119.36 117.29a6.33 6.33 0 0 1-8.7 2.14c-23.82-14.6-53.91-17.9-89.36-9.77a6.33 6.33 0 0 1-2.93-12.37c38.7-9.16 72-5.35 98.63 11.35a6.33 6.33 0 0 1 2.36 8.65Zm11.25-21.83a7.91 7.91 0 0 1-10.83 2.67c-27.28-16.72-68.86-21.59-101.17-11.78a7.91 7.91 0 1 1-4.63-15.18c38-11.6 84.72-6.09 116.45 13.65a7.91 7.91 0 0 1 2.18 10.64Zm2.84-22.65c-32.2-19.74-85.79-21.06-116.49-11.5a9.5 9.5 0 0 1-5.61-18.23c35.83-11 97.68-9.48 133.37 13.1a9.5 9.5 0 0 1-9.54 16.63Z'/>
          </svg>
          <strong>Spotify:</strong> <a href="${band.spotify}" target="_blank">Open in Spotify</a>
        </p>
        <button class="more-info-btn" onclick="flipCard(true)">More info</button>
      `;
    })
    .catch(err => {
      container.innerHTML = "<p style='color:red;'>Failed to load band data.</p>";
      console.error("API fetch error:", err);
    });
});
