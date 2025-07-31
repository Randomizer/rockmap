# 🎸 RockMap

![RockMap Logo](https://raw.githubusercontent.com/randomizer/rockmap/assets/img/rockmap-logo.png)

RockMap is an interactive map visualizing concerts for active rock and metal bands.  
The project fetches event data from external APIs (e.g., Bandsintown) and displays the shows on a Leaflet-based map.

---

## 🌐 Live Demo

[**Open RockMap on GitHub Pages →**](https://randomizer.github.io/rockmap/)

---

## ✨ Features

- Interactive **Leaflet map** with dark theme  
- **White glowing markers** for events  
- **Popup with band information**, including:
  - Band name
  - Venue, city, and country
  - Date of the show
  - **Direct Spotify link** to the band  
- **Bottom-right logo overlay** with subtle drop shadow

---
## 📂 Project Structure

rockmap/
├─ index.html
├─ README.md
├─ assets/
│ └─ img/
│ ├─ rockmap-logo.png
│ ├─ marker-glow.svg
│ └─ (optional) marker-glow.png
├─ js/
│ ├─ main.js
│ └─ bandImages.js
├─ css/
│ └─ style.css
├─ data/
│ └─ bands.json
└─ events.json


----

## ⚡ Tips

- Always **bump the `?v=` version** in `index.html` when updating `main.js` or CSS to avoid browser caching issues.  
- Use the **diag.html** page for debugging if you see a blank page – it logs all loaded files and HTTP statuses.

## 📂 Project Structure

