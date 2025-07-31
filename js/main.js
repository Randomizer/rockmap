// RockMap main.js — ASCII-safe with drop-shadow logo (absolute URL)
var V = "2025-08-01-ascii-3";

(async function(){
  console.log("RockMap: main.js loaded", V);
  var map = L.map("map").setView([54, 10], 4);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(map);

  var rockIcon = L.icon({
    iconUrl: "assets/img/marker-glow.svg?cv=" + V,
    iconSize: [25,41],
    iconAnchor: [12,41],
    popupAnchor: [0,-38]
  });
  L.Marker.prototype.options.icon = rockIcon;

  // Inject logo bottom right
  (function(){
    var css = ".rockmap-logo{position:fixed;right:12px;bottom:12px;z-index:1001;width:120px;opacity:.92;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6));}" +
              "@media(max-width:640px){.rockmap-logo{width:90px;right:8px;bottom:8px;}}" +
              ".rockmap-logo:hover{opacity:1;}";
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var a = document.createElement("a");
    a.href = "https://randomizer.github.io/rockmap/"; a.target = "_self"; a.rel="noopener";
    var img = document.createElement("img");
    img.src = "https://randomizer.github.io/rockmap/assets/img/rockmap-logo.png?cv=" + V;
    img.alt = "RockMap"; img.className = "rockmap-logo";
    img.onerror = function(){ console.warn("Logo image failed to load"); };
    a.appendChild(img); document.body.appendChild(a);
    console.log("Logo injected:", img.src);
  })();
})();