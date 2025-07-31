// RockMap main.js — Voyager base + vintage tone + strong contours + Spotify + logo
// ASCII-safe version. Updated: 2025-08-01
var V = "2025-08-01-ascii-6";

async function initRockMap() {
  console.log("RockMap: main.js loaded (", V, ")");

  // 1) Init Leaflet
  var map = L.map("map").setView([54, 10], 4);

  // Carto Voyager (ljus, med tydliga gränser) + sepia-klass
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
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
    return "" +
      "<a href=\"" + url + "\" target=\"_blank\" rel=\"noopener\" " +
      "aria-label=\"Open " + artist.replace(/"/g, "&quot;") + " on Spotify\" " +
      "style=\"display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#1DB954;text-decoration:none;\">" +
        "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" width=\"14\" height=\"14\" style=\"fill:currentColor;\">" +
          "<path d=\"M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.19 17.49c-.24.37-.74.49-1.12.25-3.08-1.87-6.96-2.29-11.53-1.25-.43.1-.87-.17-.97-.6-.1-.43.17-.87.6-.97 4.93-1.12 9.18-.64 12.57 1.49.38.23.5.73.25 1.08zm1.6-3.55c-.3.45-.92.59-1.39.3-3.52-2.17-8.89-2.8-13.05-1.52-.52.15-1.07-.14-1.22-.66-.15-.52.14-1.07.66-1.22 4.67-1.39 10.55-.7 14.5 1.72.48.3.62.93.33 1.38zm.14-3.74c-.36.54-1.1.7-1.66.38-4.02-2.4-10.14-2.62-13.82-1.44-.6.2-1.25-.14-1.45-.74-.2-.6.14-1.25.74-1.45 4.33-1.43 11.03-1.17 15.62 1.55.56.33.73 1.07.4 1.64z\"></path>" +
        "</svg>" +
        "<span>Open on Spotify</span>" +
      "</a>";
  }
  function popupHtml(opts) {
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
      parts.push("<a href=\"" + opts.ticketUrl + "\" target=\"_blank\" rel=\"noopener\" style=\"font-size:12px;\">Tickets</a>");
    }
    parts.push("</div></div>");
    return parts.join("");
  }

  // 4) Läs data
  va
