// --- 1. Global State ---
const listingsPerPage = 24;
let currentPage = 1;

// --- 2. Data Definitions ---
const propertyTypes = [
  { icon: 'apartment', label: 'Apartment' },
  { icon: 'house', label: 'House' },
  { icon: 'villa', label: 'Villa' },
  { icon: 'cottage', label: 'Guesthouse' },
  { icon: 'hotel', label: 'Hotel' },
];
const placeTypes = [
  { icon: 'home', label: 'Entire Place' },
  { icon: 'meeting_room', label: 'Private Room' },
  { icon: 'bed', label: 'Shared Room' },
];
const amenities = [
  { icon: 'wifi', label: 'WiFi' },
  { icon: 'kitchen', label: 'Kitchen' },
  { icon: 'local_parking', label: 'Free Parking' },
  { icon: 'ac_unit', label: 'Air Conditioning' },
  { icon: 'local_laundry_service', label: 'Washer' },
  { icon: 'tv', label: 'TV' },
  { icon: 'pool', label: 'Pool' },
  { icon: 'whatshot', label: 'Heating' },
  { icon: 'laptop', label: 'Workspace' },
  { icon: 'pets', label: 'Pet-Friendly' },
];

// --- 3. Global Helpers (Fixes the "Not Defined" Error) ---

window.scrollSlider = function (amount) {
  const slider = document.getElementById('sliderWrapper');
  if (slider) {
    slider.scrollBy({ left: amount, behavior: 'smooth' });
  }
};

window.updatePricesWithGST = function () {
  const gstToggle = document.getElementById('gstToggle');
  document.querySelectorAll('.listing-price').forEach((priceEl) => {
    const basePrice = parseFloat(priceEl.dataset.price);
    const displayPrice = gstToggle?.checked
      ? Math.round(basePrice * 1.18)
      : basePrice;
    priceEl.textContent = displayPrice.toLocaleString('en-IN');
  });
};

// --- 4. Core Logic Functions ---

function bindSaveButtons() {
  document.querySelectorAll('.save-btn').forEach((btn) => {
    // Standardize to a fresh listener
    btn.onclick = async (e) => {
      e.preventDefault();
      const listingId = btn.getAttribute('data-id');
      const icon = btn.querySelector('i');
      try {
        const res = await fetch(`/listings/${listingId}/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await res.json();
        if (result.success) {
          icon.className = result.saved
            ? 'fas fa-heart text-danger'
            : 'far fa-heart text-dark';
        }
      } catch (err) {
        console.error('Error saving:', err);
      }
    };
  });
}
// --- Slider Filter Functionality ---
function initializeSliderFilters() {
  const filterButtons = document.querySelectorAll('.slide.filter');
  const listingContainer = 'listingContainer';

  filterButtons.forEach((filterBtn) => {
    filterBtn.addEventListener('click', async () => {
      const tag = filterBtn.getAttribute('data-tag');

      // 1. UI: Update active state
      filterButtons.forEach((el) => el.classList.remove('active'));
      filterBtn.classList.add('active');

      // 2. Data: Fetch filtered results from server
      try {
        const response = await fetch(`/listings/filter/${tag}`);

        if (!response.ok) throw new Error('Network response was not ok');

        const filteredListings = await response.json();

        // 3. Logic: Reset pagination and render
        currentPage = 1;

        // Use your existing pagination render function
        renderListingsWithPagination(
          filteredListings,
          listingContainer,
          true // true = scroll to top of listings
        );

        // 4. Maintenance: Re-apply GST and Heart Buttons
        if (window.updatePricesWithGST) window.updatePricesWithGST();
        if (typeof bindSaveButtons === 'function') bindSaveButtons();
      } catch (err) {
        console.error('❌ Error fetching slider listings:', err);
      }
    });
  });
}

// --- Add this to your existing DOMContentLoaded listener ---
document.addEventListener('DOMContentLoaded', () => {
  // ... your other initializations (bindSaveButtons, updateSlider, etc.) ...

  initializeSliderFilters();

  // Ensure the horizontal scroll buttons work
  const slider = document.getElementById('sliderWrapper');
  window.scrollSlider = (amount) => {
    if (slider) {
      slider.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };
});
function renderFilterBoxes(data, containerId, singleSelect = false) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = data
    .map(
      (item) => `
    <div class="filter-option-box" data-label="${item.label}">
      <span class="material-icons">${item.icon}</span>
      <span>${item.label}</span>
    </div>
  `
    )
    .join('');

  container.querySelectorAll('.filter-option-box').forEach((box) => {
    box.addEventListener('click', () => {
      if (singleSelect) {
        container
          .querySelectorAll('.filter-option-box')
          .forEach((b) => b.classList.remove('active'));
      }
      box.classList.toggle('active');
      updateFilterCounts();
    });
  });
}

function updateFilterCounts() {
  const activeBoxes = document.querySelectorAll(
    '.filter-option-box.active'
  ).length;
  const checkedBoxes = [
    ...document.querySelectorAll('input[type="checkbox"]:checked'),
  ].filter((cb) => cb.id !== 'gstToggle').length;
  const total = activeBoxes + checkedBoxes;

  const countEl = document.getElementById('filterCount');
  const applyBtn = document.getElementById('applyFilters');
  if (countEl)
    countEl.textContent = total > 0 ? `Filters (${total})` : 'Filters';
  if (applyBtn)
    applyBtn.textContent =
      total > 0 ? `Apply Filters (${total})` : 'Apply Filters';
}

function onFilterChange() {
  const sourceData =
    typeof searchResults !== 'undefined' && searchResults.length > 0
      ? searchResults
      : allListings || [];

  const getSelected = (id) =>
    [...document.querySelectorAll(`#${id} .filter-option-box.active`)].map(
      (el) => el.dataset.label
    );

  const props = getSelected('propertyTypeFilters');
  const places = getSelected('placeTypeFilters');
  const amts = getSelected('amenitiesFilters');
  const minP = parseInt(document.getElementById('minPrice')?.value || 0);
  const maxP = parseInt(document.getElementById('maxPrice')?.value || 1000000);

  const filtered = sourceData.filter((l) => {
    const mProp = !props.length || props.includes(l.propertyType);
    const mPlace = !places.length || places.includes(l.placeType);
    const mAmts =
      !amts.length ||
      (l.amenities && amts.every((a) => l.amenities.includes(a)));
    const mPrice = l.price >= minP && l.price <= maxP;
    return mProp && mPlace && mAmts && mPrice;
  });

  currentPage = 1;
  renderListingsWithPagination(filtered, 'listingContainer', true);
}

// --- 5. Pagination & Rendering ---
function renderListingsWithPagination(
  listings,
  containerId = 'listingContainer',
  shouldScroll = false
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const start = (currentPage - 1) * listingsPerPage;
  const paginated = listings.slice(start, start + listingsPerPage);

  if (listings.length === 0) {
    container.innerHTML =
      '<div class="col-12 text-center my-5">No rooms found.</div>';
    return;
  }

  container.innerHTML = paginated
    .map(
      (l) => `
    <div class="col">
      <div class="card h-100 hover-card position-relative">
        <button class="save-btn btn btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-2" data-id="${l._id}">
          <i class="${l.isSaved ? 'fas fa-heart text-danger' : 'far fa-heart text-dark'}"></i>
        </button>
        <a class="text-decoration-none text-dark" href="/listings/${l._id}">
          <img src="${l.image.url}" class="card-img-top-index" />
          <div class="card-body">
            <h6>${l.title}</h6>
            <p>₹<span class="listing-price" data-price="${l.price}">${l.price.toLocaleString('en-IN')}</span>/night</p>
          </div>
        </a>
      </div>
    </div>
  `
    )
    .join('');

  renderPaginationControls(listings);
  window.updatePricesWithGST(); // Refresh prices after render
  bindSaveButtons();
  if (shouldScroll)
    window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
}

function renderPaginationControls(listings) {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  const totalPages = Math.ceil(listings.length / listingsPerPage);
  pagination.innerHTML = '';
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    btn.onclick = () => {
      currentPage = i;
      renderListingsWithPagination(listings, 'listingContainer', true);
    };
    pagination.appendChild(btn);
  }
}

// --- 6. Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  renderFilterBoxes(propertyTypes, 'propertyTypeFilters');
  renderFilterBoxes(placeTypes, 'placeTypeFilters', true);
  renderFilterBoxes(amenities, 'amenitiesFilters');

  const modal = document.getElementById('filterModal');
  document.getElementById('filterBox')?.addEventListener('click', () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });

  document.getElementById('closeModal')?.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  };

  document.getElementById('applyFilters')?.addEventListener('click', () => {
    onFilterChange();
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  document.getElementById('clearFilters')?.addEventListener('click', () => {
    document
      .querySelectorAll('.filter-option-box.active')
      .forEach((b) => b.classList.remove('active'));
    document
      .querySelectorAll('#filterModal input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false));
    updateFilterCounts();
  });

  document
    .getElementById('gstToggle')
    ?.addEventListener('change', window.updatePricesWithGST);

  if (typeof allListings !== 'undefined') {
    renderListingsWithPagination(allListings);
  }
});
