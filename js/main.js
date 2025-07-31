// RockMap Spotify popup demo main.js

function spotifyLinkFor(artist, bandObj) {
  const direct = bandObj?.spotifyUrl && bandObj.spotifyUrl.trim();
  return direct || `https://open.spotify.com/search/${encodeURIComponent(artist)}`;
}

function spotifyAnchorHtml(artist, bandObj) {
  const url = spotifyLinkFor(artist, bandObj);
  return `
    <a class="spotify-link" href="${url}" target="_blank" rel="noopener"
       aria-label="Öppna ${artist} på Spotify">
      <svg class="sp-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.19 17.49c-.24.37-.74.49-1.12.25-3.08-1.87-6.96-2.29-11.53-1.25-.43.1-.87-.17-.97-.6-.1-.43.17-.87.6-.97 4.93-1.12 9.18-.64 12.57 1.49.38.23.5.73.25 1.08zm1.6-3.55c-.3.45-.92.59-1.39.3-3.52-2.17-8.89-2.8-13.05-1.52-.52.15-1.07-.14-1.22-.66-.15-.52.14-1.07.66-1.22 4.67-1.39 10.55-.7 14.5 1.72.48.3.62.93.33 1.38zm.14-3.74c-.36.54-1.1.7-1.66.38-4.02-2.4-10.14-2.62-13.82-1.44-.6.2-1.25-.14-1.45-.74-.2-.6.14-1.25.74-1.45 4.33-1.43 11.03-1.17 15.62 1.55.56.33.73 1.07.4 1.64z"></path>
      </svg>
      <span>Öppna på Spotify</span>
    </a>
  `;
}

// Example popup builder for one event
function popupHtml({ artist, bandImg, venueImg, venueName, city, country, dateText, bandObj, ticketUrl }) {
  return `
    <div class="rm-wrap">
      <div class="rm-title">${artist}</div>
      <div class="rm-meta">
        ${venueName ? venueName + '<br>' : ''}
        ${[city, country].filter(Boolean).join(', ')}<br>
        ${dateText || ''}
      </div>
      <div class="rm-actions">
        ${spotifyAnchorHtml(artist, bandObj)}
        ${ticketUrl ? `<a href="${ticketUrl}" target="_blank" rel="noopener" class="ticket-link">Biljetter</a>` : ''}
      </div>
    </div>
  `;
}

console.log('Spotify popup demo loaded');
