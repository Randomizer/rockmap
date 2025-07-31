// RockMap main.js — Light base map + vintage tone + SVG icon + Spotify + logo
// ASCII-safe version (no template literals). Last update: 2025-08-01
var V = "2025-08-01-ascii-8";

async function initRockMap() {
  console.log("RockMap: main.js loaded (", V, ")");

  // 1) Init Leaflet
  var map = L.map("map").setView([54, 10], 4);

  // Ljust baslager (Carto Positron) + klass för sepiafilter
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    subdomains: "abcd",
    maxZoom: 19,
    className: "sepia-tiles"
  }).addTo(map);

  // 2) Global vit markör (SVG)
  var iconUrl = "assets/img/marker-glow.svg?cv=" + V;
  var rockIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -38]
  });
  L.Marker.prototype.options.icon = rockIcon;
  console.log("Rock icon in use:", iconUrl);

  // 3) Hjälpfunktioner
  function fmtDate(d) {
    try {
      var dt = new Date(d);
      return isNaN(dt) ? (d || "") : dt.toLocaleDateString("sv-SE", { year: "numeric", month: "short", day: "numeric" });
    } catch (e) { return d || ""; }
  }
  function spotifyLinkFor(artist, bandObj) {
    var direct = bandObj && bandObj.spotifyUrl && bandObj.spotifyUrl.trim();
    return direct || ("https://open.spotify.com/search/" + encodeURIComponent(artist));
  }
  function spotifyAnchorHtml(artist, bandObj) {
    var url = spotifyLinkFor(artist, bandObj);
    // inline SVG ikon + text
    return "" +
      "<a href=\"" + url + "\" target=\"_blank\" rel=\"noopener\" " +
      "aria-label=\"Oppna " + artist.replace(/"/g, "&quot;") + " pa Spotify\" " +
      "style=\"display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#1DB954;text-decoration:none;\">" +
        "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" width=\"14\" height=\"14\" style=\"fill:currentColor;\">" +
          "<path d=\"M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.19 17.49c-.24.37-.74.49-1.12.25-3.08-1.87-6.96-2.29-11.53-1.25-.43.1-.87-.17-.97-.6-.1-.43.17-.87.6-.97 4.93-1.12 9.18-.64 12.57 1.49.38.23.5.73.25 1.08zm1.6-3.55c-.3.45-.92.59-1.39.3-3.52-2.17-8.89-2.8-13.05-1.52-.52.15-1.07-.14-1.22-.66-.15-.52.14-1.07.66-1.22 4.67-1.39 10.55-.7 14.5 1.72.48.3.62.93.33 1.38zm.14-3.74c-.36.54-1.1.7-1.66.38-4.02-2.4-10.14-2.62-13.82-1.44-.6.2-1.25-.14-1.45-.74-.2-.6.14-1.25.74-1.45 4.33-1.43 11.03-1.17 15.62 1.55.56.33.73 1.07.4 1.64z\"></path>" +
        "</svg>" +
        "<span>Oppna pa Spotify</span>" +
      "</a>";
  }
  function popupHtml(opts) {
    // opts: { artist, bandImg, venueName, city, country, dateText, bandObj, ticketUrl }
    var parts = [];
    parts.push("<div style=\"text-align:center;max-width:260px;\">");
    parts.push("<div style=\"font-size:15px;margin:2px 0 4px;font-weight:600;\">" + (opts.artist || "") + "</div>");
    if (opts.bandImg) {
      parts.push("<img src=\"" + opts.bandImg + "\" alt=\"" + (opts.artist || "") + "\" " +
                 "style=\"width:220px;max-width:100%;border-radius:6px;margin:6px 0;\" " +
                 "onerror=\"this.style.display='none'\">");
    }
    parts.push("<div style=\"font-size:12px;opacity:.9;line-height:1.3;\">");
    if (opts.venueName) parts.push(opts.venueName + "<br>");
    var place = [];
    if (opts.city) place.push(opts.city);
    if (opts.country) place.push(opts.country);
    parts.push(place.join(", "));
    parts.push("<br>");
    parts.push(opts.dateText || "");
    parts.push("</div>");
    parts.push("<div style=\"margin-top:6px;display:flex;justify-content:center;gap:10px;\">");
    parts.push(spotifyAnchorHtml(opts.artist, opts.bandObj));
    if (opts.ticketUrl) {
      parts.push("<a href=\"" + opts.ticketUrl + "\" target=\"_blank\" rel=\"noopener\" style=\"font-size:12px;\">Biljetter</a>");
    }
    parts.push("</div></div>");
    return parts.join("");
  }

  // 4) Läs data
  var events = [];
  try {
    var er = await fetch("events.json?v=" + V, { cache: "no-store" });
    if (er.ok) { events = await er.json(); }
  } catch (e) {}
  var bands = [];
  try {
    var br = await fetch("data/bands.json?v=" + V, { cache: "no-store" });
    if (br.ok) { bands = await br.json(); }
  } catch (e) {}
  var bandIndex = {};
  (bands || []).forEach(function(b){ if (b && b.name) bandIndex[String(b.name).toLowerCase()] = b; });
  console.log("Bands loaded:", bands.length);

  // 5) Rita ut: events med koordinater -> karta; annars demo från bands
  var hasGeoEvents = Array.isArray(events) && events.some(function(e){ return e && e.venue && e.venue.latitude && e.venue.longitude; });

  if (hasGeoEvents) {
    console.log("Events with coordinates found:", events.length);
    for (var i=0; i<events.length; i++) {
      var e = events[i];
      var lat = parseFloat(e && e.venue && e.venue.latitude);
      var lon = parseFloat(e && e.venue && e.venue.longitude);
      if (!isFinite(lat) || !isFinite(lon)) continue;

      var artist = e.artist || (e.lineup && e.lineup[0]) || "Oklart band";
      var bandImg = null;
      try { bandImg = await resolveBandImage(artist); } catch (err) {}

      var venue = (e.venue && e.venue.name) || "";
      var city = (e.venue && e.venue.city) || "";
      var country = (e.venue && e.venue.country) || "";
      var dateText = fmtDate(e.datetime || e.date);

      var html = popupHtml({
        artist: artist,
        bandImg: bandImg,
        venueName: venue,
        city: city,
        country: country,
        dateText: dateText,
        bandObj: bandIndex[artist.toLowerCase()],
        ticketUrl: e.ticketUrl
      });

      L.marker([lat, lon], { title: artist })
        .bindPopup(html, { className: "rockmap-popup", maxWidth: 320 })
        .addTo(map);
    }
  } else {
    console.log("No events with coordinates found. Falling back to demo markers from bands.json.");
    for (var j=0; j<bands.length; j++) {
      var b = bands[j];
      var lat2 = 50 + Math.random() * 20 - 10;
      var lon2 = 10 + Math.random() * 20 - 10;
      var bandImg2 = null;
      try { bandImg2 = await resolveBandImage(b.name); } catch (err2) {}

      var html2 = popupHtml({
        artist: b.name,
        bandImg: bandImg2,
        venueName: "",
        city: "",
        country: "",
        dateText: "",
        bandObj: b
      });

      L.marker([lat2, lon2], { title: b.name })
        .bindPopup(html2, { className: "rockmap-popup", maxWidth: 320 })
        .addTo(map);
    }
  }

  // 6) Injektera CSS (logga, attribution-offset, sepiafilter, vignette) + lägg in logga och overlay
  (function injectBrandAndTone() {
    try {
      var css = "" +
        /* Logga nere till höger */
        ".rockmap-logo{position:fixed;right:12px;bottom:12px;z-index:1001;width:120px;opacity:.92;" +
        "filter:drop-shadow(0 1px 2px rgba(0,0,0,.6));}" +
        "@media(max-width:640px){.rockmap-logo{width:90px;right:8px;bottom:8px;}}" +
        ".rockmap-logo:hover{opacity:1;}" +

        /* Flytta attributionen så den inte hamnar under loggan */
        ".leaflet-control-attribution{margin-right:140px;}" +

        /* Sepia/varm ton endast på kakelbilderna (klassen satt via className på tileLayer) */
        ".sepia-tiles{filter:sepia(.45) saturate(1.08) hue-rotate(-10deg) brightness(1.04) contrast(1.04);}" +

        /* Vignette + varm yttunn ton ovanpå hela kartan (klickbarheten påverkas inte) */
        ".vintage-overlay{position:fixed;inset:0;pointer-events:none;z-index:1000;" +
        "background:radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.12) 100%)," +
        "linear-gradient(rgba(92,64,51,.06), rgba(92,64,51,.06));}";

      var st = document.createElement("style");
      st.textContent = css;
      document.head.appendChild(st);

      // Logga (absolut URL för att undvika sökvägsmissar)
      var a = document.createElement("a");
      a.href = "https://randomizer.github.io/rockmap/";
      a.target = "_self";
      a.rel = "noopener";
      var img = document.createElement("img");
      img.src = "https://randomizer.github.io/rockmap/assets/img/rockmap-logo.png?cv=" + V;
      img.alt = "RockMap";
      img.className = "rockmap-logo";
      img.onerror = function(){ console.warn("Logo image failed to load"); };
      a.appendChild(img);
      document.body.appendChild(a);

      // Vignette/sepia overlay
      var ov = document.createElement("div");
      ov.className = "vintage-overlay";
      document.body.appendChild(ov);

      console.log("Brand & tone injected");
    } catch (e) {
      console.warn("Brand inject failed", e);
    }
  })();
}

initRockMap();

