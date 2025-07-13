document.addEventListener("DOMContentLoaded", function () {
  const maptilerKey = mapToken; // Provided by EJS from the server

  const map = new maplibregl.Map({
    container: "map",
    style: `https://api.maptiler.com/maps/streets/style.json?key=${maptilerKey}`,
    // center: [88.3639, 22.5726],
    center: listing.geometry.coordinates,
    zoom: 9,
  });

// const homeIconSVG = `
//   <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
//     <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
//   </svg>
// `;

// const popupHTML = `
//   <div style="max-width: 240px;">
//     <img src="${listing.image.url}" alt="Listing image" style="width:100%; height:140px; object-fit:cover; border-radius:8px;" />
//     <h6 style="margin: 8px 0 4px; font-size: 16px;">${listing.title}</h6>
//     <p style="margin: 0; color: gray; font-size: 14px;">${listing.location}</p>
//     <strong style="color:#222;">₹${listing.price.toLocaleString("en-IN")} / night</strong>
//   </div>
// `;

// const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupHTML);

// const el = document.createElement('div');
// el.className = 'custom-marker';
// el.innerHTML = homeIconSVG;

// const marker = new maplibregl.Marker({ element: el })
//   .setLngLat(listing.geometry.coordinates)
//   .setPopup(popup)
//   .addTo(map);

const homeIconSVG = `
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
`;

const popupHTML = `
  <div style="max-width: 240px;">
      <img 
        src="${listing.image.url}" 
        alt="Listing image" 
        style="width: 75%; height: 90px; display: block; margin: 0 auto; border: 1px solid #ddd; border-radius: 12px;" 
      />

    <h6 style="font-size: 14px; margin: 5px 0 4px;">${listing.location}</h6>
    <p style="margin: 0; color: gray; font-size: 13px;">Exact location provided after booking</p>
  </div>
`;


const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupHTML);

const el = document.createElement('div');
el.className = 'custom-marker';
el.innerHTML = homeIconSVG;

const marker = new maplibregl.Marker({ element: el })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);



  // Geocoding button logic
  const geocodeBtn = document.getElementById("geocodeBtn");
  const addressInput = document.getElementById("addressInput");

  if (geocodeBtn && addressInput) {
    geocodeBtn.addEventListener("click", function () {
      const address = addressInput.value.trim();
      if (!address) return alert("Please enter an address");

      fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          address
        )}.json?key=${maptilerKey}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.features && data.features.length > 0) {
            const coords = data.features[0].center;
            map.flyTo({ center: coords, zoom: 14 });
            marker.setLngLat(coords);
          } else {
            alert("No location found.");
          }
        })
        .catch((err) => {
          console.error("Geocoding failed:", err);
          alert("Error occurred during geocoding.");
        });
    });
  }
});
