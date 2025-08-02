// JS logic for rendering popup based on fetched API test data
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("popup-container");

  fetch("band-data-API.json")
    .then(res => res.json())
    .then(data => {
      const band = data.bands[0];

      container.innerHTML = `
        <div style="border: 1px solid #888; padding: 20px; background: #222; color: #fff; max-width: 400px;">
          <img src="${band.image}" alt="${band.name}" style="width: 100%; height: auto; margin-bottom: 10px;" />
          <h2>${band.name}</h2>
          <p><strong>Date:</strong> ${band.date}</p>
          <p><strong>Location:</strong> ${band.location}</p>
          <p><a href="${band.spotify}" target="_blank" style="color: #1DB954;">Open in Spotify</a></p>
        </div>
      `;
    })
    .catch(err => {
      container.innerHTML = "<p style='color:red;'>Failed to load band data.</p>";
      console.error("API fetch error:", err);
    });
