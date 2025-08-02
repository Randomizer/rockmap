document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("popup-container");

  fetch("band-data-API.json")
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(data => {
      const band = data.bands[0];

      container.innerHTML = `
        <div style="
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          background: rgba(34, 34, 34, 0.95);
          padding: 20px;
          color: #fff;
          font-family: sans-serif;
          max-width: 400px;
          backdrop-filter: blur(4px);
        ">
          <img src="${band.image}" alt="${band.name}" style="
            width: 100%;
            height: auto;
            border-radius: 8px;
            margin-bottom: 15px;
          " />
          <h2 style='margin-top: 0; font-size: 1.5em;'>🎸 ${band.name}</h2>
          <p style='margin: 0.2em 0;'><strong>📅 Date:</strong> ${band.date}</p>
          <p style='margin: 0.2em 0;'><strong>📍 Location:</strong> ${band.location}</p>
          <p style='margin: 0.2em 0;'>
            <strong>🎧 Spotify:</strong>
            <a href="${band.spotify}" target="_blank" style="color: #1DB954; text-decoration: none;">Open in Spotify</a>
          </p>
        </div>
      `;
    })
    .catch(err => {
      container.innerHTML = "<p style='color:red;'>Failed to load band data.</p>";
      console.error("API fetch error:", err);
    });
});
