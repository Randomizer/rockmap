document.addEventListener("DOMContentLoaded", () => {
  const front = document.getElementById("card-front");
  const back = document.getElementById("card-back");
  const card = document.getElementById("band-card");

  fetch("band-data-API.json")
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(data => {
      const band = data.bands[0];
      const date = band.date ? band.date : "No upcoming shows";
      const location = band.location ? band.location : "Unknown";

      front.innerHTML = `
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
      `;

      back.innerHTML = `
        <h2>${band.name} – Full Info</h2>
        <p>🧾 <strong>Band bio:</strong> (from Wikipedia or MusicBrainz)</p>
        <p>🎫 <strong>Upcoming shows:</strong> (from Bandsintown)</p>
        <p>🎧 <strong>Spotify top tracks:</strong> (optional future feature)</p>
        <button id="back-btn" style="
          margin-top: 12px;
          background: #333;
          color: #fff;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
        ">Back</button>
      `;

      document.getElementById("more-info-btn").onclick = () => {
        card.classList.add("flipped");
      };

      document.getElementById("back-btn").onclick = () => {
        card.classList.remove("flipped");
      };

      document.getElementById("close-btn").onclick = () => {
        document.querySelector(".card-container").innerHTML = "";
      };
    })
    .catch(err => {
      front.innerHTML = "<p style='color:red;'>Failed to load band data.</p>";
      console.error("API fetch error:", err);
    });
});
