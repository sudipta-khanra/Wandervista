document.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.getElementById('map');

  // 1. Safety Checks
  if (!mapContainer) {
    console.warn('⚠️ #map not found — skipping map initialization');
    return;
  }

  if (
    typeof mapToken === 'undefined' ||
    !mapToken ||
    mapToken === 'YOUR_API_KEY'
  ) {
    console.error(
      '❌ mapToken missing or invalid. Check your .env and EJS passing.'
    );
    return;
  }

  if (
    typeof listing === 'undefined' ||
    !listing.geometry ||
    !Array.isArray(listing.geometry.coordinates)
  ) {
    console.error('❌ listing coordinates missing');
    return;
  }

  const coordinates = listing.geometry.coordinates;

  // 2. Initialize the Map
  const map = new maplibregl.Map({
    container: mapContainer,
    style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
    center: coordinates,
    zoom: 9,
  });

  // Add zoom and rotation controls
  map.addControl(new maplibregl.NavigationControl());

  // 3. Prepare the Popup
  const popupHTML = `
        <div style="max-width:200px; text-align: center;">
            <img src="${listing.image.url}" 
                 alt="Listing" 
                 style="width:100%; height:100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" 
            />
            <h6 style="margin: 0; font-size: 14px;">${listing.location}</h6>
            <p style="margin: 4px 0 0; font-size: 12px; color: #666;">
                Exact location provided after booking
            </p>
        </div>
    `;

  const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupHTML);

  // 4. Create Custom Marker Element
  const homeIconSVG = `
        <svg viewBox="0 0 24 24" width="32" height="32" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
            <path fill="#fe424d" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
    `;

  const markerEl = document.createElement('div');
  markerEl.className = 'custom-marker';
  markerEl.style.cursor = 'pointer';
  markerEl.innerHTML = homeIconSVG;

  // 5. Add Marker to Map
  new maplibregl.Marker({ element: markerEl })
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);
});
