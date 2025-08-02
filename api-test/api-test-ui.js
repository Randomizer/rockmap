document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("popup-container");

  fetch("band-data-API.json")
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(data => {
      const band = data.bands[0];
      const date = band.date ? band.date : "No upcoming shows";
      const location = band.location ? band.location : "Unknown";

      container.innerHTML = `
        <div style="
          position: relative;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          background: rgba(34, 34, 34, 0.95);
          padding: 20px;
          color: #fff;
          font-family: sans-serif;
          max-width: 400px;
          width: 100%;
          backdrop-filter: blur(4px);
        ">
          <span id='close-btn' style="
            position: absolute;
            top: 8px;
            right: 12px;
            font-size: 20px;
            cursor: pointer;
          ">✖</span>
          <img src="${band.image}" alt="${band.name}" style="
            width: 100%;
            height: auto;
            border-radius: 8px;
            margin-bottom: 15px;
          " />
          <h2 style='margin-top: 0; font-size: 1.5em;'>🎸 ${band.name}</h2>
          <p style='margin: 0.2em 0;'><strong>📅 Next gig:</strong> ${date}</p>
          <p style='margin: 0.2em 0;'><strong>📍 Location:</strong> ${location}</p>
          <p style='margin: 0.2em 0;'>
            <strong>🎧 Spotify:</strong>
            <a href="${band.spotify}" target="_blank" style="color: #1DB954; text-decoration: none;">Open in Spotify</a>
          </p>
          <button id="more-info-btn" style="
            margin-top: 12px;
            background: #444;
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
          ">More info</button>
        </div>
      `;

      document.getElementById("close-btn").onclick = () => {
        container.innerHTML = "";
      };

      document.getElementById("more-info-btn").onclick = () => {
        container.innerHTML = `
          <div style="
            background: #111;
            color: #fff;
            padding: 20px;
            font-family: sans-serif;
            max-width: 600px;
          ">
            <h2>${band.name} – Full Info</h2>
            <p>🧾 <strong>Band bio:</strong> (from Wikipedia or MusicBrainz)<br><br>🎫 <strong>Upcoming shows:</strong> (from Bandsintown)<br><br>🎧 <strong>Spotify top tracks:</strong> (optional future feature)</p>
            <button onclick='window.location.reload()' style="
              margin-top: 12px;
              background: #333;
              color: #fff;
              border: none;
              padding: 8px 12px;
              border-radius: 6px;
              cursor: pointer;
            ">Back</button>
          </div>
        `;
      };
    })
    .catch(err => {
      container.innerHTML = "<p style='color:red;'>Failed to load band data.</p>";
      console.error("API fetch error:", err);
    });
});
