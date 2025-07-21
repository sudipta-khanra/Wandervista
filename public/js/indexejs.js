function bindSaveButtons() {
  const buttons = document.querySelectorAll(".save-btn");
  console.log("✅ Binding Save Buttons:", buttons.length);
  buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const listingId = button.getAttribute("data-id");
      const icon = button.querySelector("i");
      if (!icon) return;
      try {
        const res = await fetch(`/listings/${listingId}/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const result = await res.json();
        console.log("💾 Toggle result:", result);
        if (!result.success) return;
        if (result.saved) {
          icon.classList.remove("fa-regular", "far", "text-dark");
          icon.classList.add("fa-solid", "fas", "text-danger");
        } else {
          icon.classList.remove("fa-solid", "fas", "text-danger");
          icon.classList.add("fa-regular", "far", "text-dark");
        }
      } catch (err) {
        console.error("❌ Error toggling save:", err);
      }
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  bindSaveButtons();
});
// GST Toggle
function bindSaveButtons() {
  const buttons = document.querySelectorAll(".save-btn");
  console.log("💾 Re-binding Save Buttons:", buttons.length);
  buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const listingId = button.getAttribute("data-id");
      const icon = button.querySelector("i");
      if (!icon) return;
      try {
        const res = await fetch(`/listings/${listingId}/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await res.json();
        if (result.saved) {
          icon.classList.remove("fa-regular", "text-dark", "far");
          icon.classList.add("fa-solid", "text-danger", "fas");
        } else {
          icon.classList.remove("fa-solid", "text-danger", "fas");
          icon.classList.add("fa-regular", "text-dark", "far");
        }
      } catch (err) {
        console.error("❌ Error saving listing:", err);
      }
    });
  });
}
function updatePricesWithGST() {
  const gstToggle = document.getElementById("gstToggle");
  const prices = document.querySelectorAll(".listing-price");
  prices.forEach((priceEl) => {
    const basePrice = parseFloat(priceEl.dataset.price);
    if (gstToggle?.checked) {
      const gstPrice = Math.round(basePrice * 1.18);
      priceEl.textContent = gstPrice.toLocaleString("en-IN");
    } else {
      priceEl.textContent = basePrice.toLocaleString("en-IN");
    }
  });
}
//if this is not called then gst won't work
const gstToggle = document.getElementById("gstToggle");
gstToggle?.addEventListener("change", updatePricesWithGST);
// Expose GST logic
window.updatePricesWithGST = updatePricesWithGST;
document.addEventListener("DOMContentLoaded", () => {
  updatePricesWithGST();
  bindSaveButtons();
  // Slider buttons
  const slider = document.getElementById("sliderWrapper");
  window.scrollSlider = function (amount) {
    slider.scrollBy({ left: amount, behavior: "smooth" });
  };
  // Modal handling
  const filterBox = document.getElementById("filterBox");
  const filterModal = document.getElementById("filterModal");
  const closeModal = document.getElementById("closeModal");
  filterBox.addEventListener("click", () => {
    filterModal.style.display = "block";
    document.body.style.overflow = "hidden";
  });
  closeModal.addEventListener("click", () => {
    filterModal.style.display = "none";
    document.body.style.overflow = "auto";
  });
  window.addEventListener("click", (e) => {
    if (e.target === filterModal) {
      filterModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
  // Price range slider
  const minPrice = document.getElementById("minPrice");
  const maxPrice = document.getElementById("maxPrice");
  const minVal = document.getElementById("minVal");
  const maxVal = document.getElementById("maxVal");
  const sliderTrack = document.querySelector(".slider-track");
  function updateSlider() {
    let min = parseInt(minPrice.value);
    let max = parseInt(maxPrice.value);
    if (max < min + 500) {
      max = min + 500;
      maxPrice.value = max;
    }
    if (min > max - 500) {
      min = max - 500;
      minPrice.value = min;
    }
    minVal.textContent = min.toLocaleString();
    maxVal.textContent = max.toLocaleString();
    const range = maxPrice.max - minPrice.min;
    const minPercent = ((min - minPrice.min) / range) * 100;
    const maxPercent = ((max - minPrice.min) / range) * 100;
    sliderTrack.style.background = `linear-gradient(to right, #ddd ${minPercent}%, #000 ${minPercent}%, #000 ${maxPercent}%, #ddd ${maxPercent}%)`;
  }
  minPrice.addEventListener("input", updateSlider);
  maxPrice.addEventListener("input", updateSlider);
  updateSlider();
  // Filter counts and apply logic
  function updateFilterCounts() {
    const totalSelected =
      document.querySelectorAll(".filter-option-box.active").length +
      document.querySelectorAll('input[type="checkbox"]:checked').length;
    document.getElementById("filterCount").textContent =
      totalSelected > 0 ? `Filters (${totalSelected})` : "Filters";
    document.getElementById("applyFilters").textContent =
      totalSelected > 0 ? `Apply Filters (${totalSelected})` : "Apply Filters";
  }
  const propertyTypes = [
    { icon: "apartment", label: "Apartment" },
    { icon: "house", label: "House" },
    { icon: "villa", label: "Villa" },
    { icon: "cottage", label: "Guesthouse" },
    { icon: "hotel", label: "Hotel" },
  ];
  const placeTypes = [
    { icon: "home", label: "Entire Place" },
    { icon: "meeting_room", label: "Private Room" },
    { icon: "bed", label: "Shared Room" },
  ];
  const amenities = [
    { icon: "wifi", label: "WiFi" },
    { icon: "kitchen", label: "Kitchen" },
    { icon: "local_parking", label: "Free Parking" },
    { icon: "ac_unit", label: "Air Conditioning" },
    { icon: "local_laundry_service", label: "Washer" },
    { icon: "tv", label: "TV" },
    { icon: "pool", label: "Pool" },
    { icon: "whatshot", label: "Heating" },
    { icon: "laptop", label: "Workspace" },
    { icon: "pets", label: "Pet-Friendly" },
  ];
  function renderFilterBoxes(data, containerId, singleSelect = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    // ✅ Clear previous items (important to prevent duplicates)
    container.innerHTML = "";
    const seen = new Set();
    data.forEach(({ icon, label }) => {
      if (seen.has(label)) return;
      seen.add(label);
      const box = document.createElement("div");
      box.className = "filter-option-box";
      box.innerHTML = `
      <span class="material-icons">${icon}</span>
      <span>${label}</span>
    `;
      box.addEventListener("click", () => {
        if (singleSelect) {
          [...container.children].forEach((child) =>
            child.classList.remove("active")
          );
        }
        box.classList.toggle("active");
        onFilterChange();
      });
      container.appendChild(box);
    });
  }
  function setupRatingFilter() {
    const ratingCheckboxes = document.querySelectorAll(
      '#ratingFilters input[type="checkbox"]'
    );
    ratingCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          ratingCheckboxes.forEach((cb) => {
            if (cb !== this) cb.checked = false;
          });
        }
        onFilterChange();
      });
    });
  }
  function clearAllFilters() {
    document
      .querySelectorAll(".filter-option-box.active")
      .forEach((box) => box.classList.remove("active"));
    document
      .querySelectorAll('input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false));
    updateFilterCounts();
  }
  renderFilterBoxes(propertyTypes, "propertyTypeFilters");
  renderFilterBoxes(placeTypes, "placeTypeFilters", true);
  renderFilterBoxes(amenities, "amenitiesFilters");
  setupRatingFilter();
  document
    .getElementById("applyFilters")
    .addEventListener("click", updateFilterCounts);
  document
    .getElementById("clearFilters")
    .addEventListener("click", clearAllFilters);
  updateFilterCounts();
  document.querySelectorAll(".slide.filter").forEach((filterBtn) => {
    filterBtn.addEventListener("click", () => {
      const tag = filterBtn.getAttribute("data-tag");
      document.querySelectorAll(".slide.filter").forEach((el) => {
        el.classList.remove("active");
      });
      filterBtn.classList.add("active");
      fetch(`/listings/filter/${tag}`)
        .then((res) => res.json()) 
        .then((filteredListings) => {
          currentPage = 1;
          // renderListingsWithPagination(filteredListings);
          renderListingsWithPagination(
            filteredListings,
            "listingContainer",
            true
          ); // ✅ scroll to listings
          updatePricesWithGST(); // GST logic
          bindSaveButtons();
        })
        .catch((err) => console.error("Error fetching listings:", err));
    });
  });
  function applyFiltersToListings() {
    const container = document.getElementById("listingContainer");
    if (!container) return;
    // Get selected filters
    const activePropertyTypes = [
      ...document.querySelectorAll(
        "#propertyTypeFilters .filter-option-box.active"
      ),
    ].map((el) => el.textContent.trim());
    const activePlaceTypes = [
      ...document.querySelectorAll(
        "#placeTypeFilters .filter-option-box.active"
      ),
    ].map((el) => el.textContent.trim());
    const activeAmenities = [
      ...document.querySelectorAll(
        "#amenitiesFilters .filter-option-box.active"
      ),
    ].map((el) => el.textContent.trim());
    const checkedRatings = [
      ...document.querySelectorAll(
        '#ratingFilters input[type="checkbox"]:checked'
      ),
    ].map((cb) => cb.value);
    const minPrice = parseInt(document.getElementById("minPrice").value, 10);
    const maxPrice = parseInt(document.getElementById("maxPrice").value, 10);
    // Iterate listings
    const listings = container.querySelectorAll(".listing-item");
    listings.forEach((listing) => {
      const propertyType = listing.dataset.property;
      const placeType = listing.dataset.place;
      const amenities = listing.dataset.amenities?.split(",") || [];
      const rating = listing.dataset.rating;
      const price = parseInt(listing.dataset.price, 10);
      // Check filter conditions (customize based on your data)
      const matchesProperty =
        activePropertyTypes.length === 0 ||
        activePropertyTypes.includes(propertyType);
      const matchesPlace =
        activePlaceTypes.length === 0 || activePlaceTypes.includes(placeType);
      const matchesAmenities = activeAmenities.every((am) =>
        amenities.includes(am)
      );
      const matchesRating =
        checkedRatings.length === 0 || checkedRatings.includes(rating);
      const matchesPrice = price >= minPrice && price <= maxPrice;
      // Show or hide listing
      if (
        matchesProperty &&
        matchesPlace &&
        matchesAmenities &&
        matchesRating &&
        matchesPrice
      ) {
        listing.style.display = "";
      } else {
        listing.style.display = "none";
      }
    });
  }
  function fetchFilteredListings() {
    // Gather filters
    const activePropertyTypes = [
      ...document.querySelectorAll(
        "#propertyTypeFilters .filter-option-box.active"
      ),
    ].map((el) => el.textContent.trim());
    const activePlaceTypes = [
      ...document.querySelectorAll(
        "#placeTypeFilters .filter-option-box.active"
      ),
    ].map((el) => el.textContent.trim());
    const activeAmenities = [
      ...document.querySelectorAll(
        "#amenitiesFilters .filter-option-box.active"
      ),
    ].map((el) => el.textContent.trim());
    const checkedRatings = [
      ...document.querySelectorAll(
        '#ratingFilters input[type="checkbox"]:checked'
      ),
    ].map((cb) => cb.value);
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;
    // Build query parameters (encodeURIComponent helps with special chars)
    const params = new URLSearchParams();
    if (activePropertyTypes.length)
      params.append("propertyTypes", activePropertyTypes.join(","));
    if (activePlaceTypes.length)
      params.append("placeTypes", activePlaceTypes.join(","));
    if (activeAmenities.length)
      params.append("amenities", activeAmenities.join(","));
    if (checkedRatings.length)
      params.append("ratings", checkedRatings.join(","));
    params.append("minPrice", minPrice);
    params.append("maxPrice", maxPrice);
    fetch(`/listings/filter?${params.toString()}`)
      .then((res) => res.text())
      .then((html) => {
        const container = document.getElementById("listingContainer");
        if (container) container.innerHTML = html;
        window.updatePricesWithGST?.();
      })
      .catch((err) => console.error("Error fetching filtered listings:", err));
  }
});
document.addEventListener("DOMContentLoaded", () => {
  bindSaveButtons();
  console.log("JS loaded ✅");
  console.log("Real allListings:", allListings);
  allListings.forEach((listing) => {
    const reviews = listing.reviews || [];
    listing.rating =
      reviews.length > 0
        ? parseFloat(
            (
              reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
              reviews.length
            ).toFixed(2)
          )
        : null;
  });
  function renderListings(filteredListings, containerId = "listingContainer") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    if (filteredListings.length === 0) {
      container.innerHTML = `<div class="no-results"> Currently no rooms are available here.</div>`;
      const pagination = document.getElementById("pagination");
      if (pagination) pagination.innerHTML = "";
      return;
    }
    filteredListings.forEach((listing) => {
      const priceFormatted = listing.price.toLocaleString("en-IN");
      const cardHTML = `
  <div class="col position-relative listing-item" data-property="${
    listing.propertyType
  }" data-place="${listing.placeType}" data-amenities="${listing.amenities.join(
        ","
      )}" data-rating="${listing.rating}" data-price="${listing.price}">
    <a class="touch" href="/listings/${listing._id}">
      <div class="card h-100 hover-card">
        <img src="${
          listing.image.url
        }" class="card-img-top-index" alt="listing" />
        <button 
          type="button"
          class="save-btn btn btn-light rounded-circle shadow-sm p-2 position-absolute top-0 end-0 m-2"
          data-id="${listing._id}">
          <i class="${
            listing.isSaved
              ? "fas fa-heart text-danger"
              : "far fa-heart text-dark"
          }"></i>
        </button>
        <div class="card-body d-flex flex-column justify-content-between">
          <h6 class="card-title">${listing.title}</h6>
          <p class="card-text">&#8377;
            <span class="listing-price" data-price="${listing.price}">
              ${priceFormatted}
            </span>/night
          </p>
        </div>
      </div>
    </a>
  </div>`;
      container.insertAdjacentHTML("beforeend", cardHTML);
    });
    bindSaveButtons();
  }
  const gstToggle = document.getElementById("gstToggle");
  function updatePricesWithGST() {
    document.querySelectorAll(".listing-price").forEach((priceEl) => {
      const basePrice = parseFloat(priceEl.dataset.price);
      const newPrice = gstToggle?.checked
        ? Math.round(basePrice * 1.18)
        : basePrice;
      priceEl.textContent = newPrice.toLocaleString("en-IN");
    });
  }
  updatePricesWithGST();
  gstToggle?.addEventListener("change", updatePricesWithGST);
  window.updatePricesWithGST = updatePricesWithGST;
  const slider = document.getElementById("sliderWrapper");
  window.scrollSlider = (amount) => {
    slider?.scrollBy({ left: amount, behavior: "smooth" });
  };
  const filterBox = document.getElementById("filterBox");
  const filterModal = document.getElementById("filterModal");
  const closeModal = document.getElementById("closeModal");
  const clearBtn = document.getElementById("clearFilters");
  const applyBtn = document.getElementById("applyFilters");
  const filterCountText = document.getElementById("filterCount");
  filterBox?.addEventListener("click", () => {
    filterModal.style.display = "block";
    document.body.style.overflow = "hidden";
  });
  closeModal?.addEventListener("click", () => {
    filterModal.style.display = "none";
    document.body.style.overflow = "auto";
  });
  window.addEventListener("click", (e) => {
    if (e.target === filterModal) {
      filterModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
  // Price Range Slider Elements
  const minPrice = document.getElementById("minPrice");
  const maxPrice = document.getElementById("maxPrice");
  const minVal = document.getElementById("minVal");
  const maxVal = document.getElementById("maxVal");
  const sliderTrack = document.querySelector(".slider-track");
  function updateSlider() {
    let min = parseInt(minPrice?.value || 0);
    let max = parseInt(maxPrice?.value || 0);
    if (max < min + 500) max = min + 500;
    if (min > max - 500) min = max - 500;
    minPrice.value = min;
    maxPrice.value = max;
    minVal.textContent = min.toLocaleString();
    maxVal.textContent = max.toLocaleString();
    const range = maxPrice.max - minPrice.min;
    const minPercent = ((min - minPrice.min) / range) * 100;
    const maxPercent = ((max - minPrice.min) / range) * 100;
    sliderTrack.style.background = `linear-gradient(to right, #ddd ${minPercent}%, #000 ${minPercent}%, #000 ${maxPercent}%, #ddd ${maxPercent}%)`;
  }
  minPrice?.addEventListener("input", updateSlider);
  maxPrice?.addEventListener("input", updateSlider);
  updateSlider();
  function updateFilterCounts() {
    const activeBoxes = document.querySelectorAll(
      ".filter-option-box.active"
    ).length;
    const checkedBoxes = [
      ...document.querySelectorAll('input[type="checkbox"]:checked'),
    ].filter((cb) => cb.id !== "gstToggle").length;
    const totalSelected = activeBoxes + checkedBoxes;
    filterCountText.textContent =
      totalSelected > 0 ? `Filters (${totalSelected})` : "Filters";
    applyBtn.textContent =
      totalSelected > 0 ? `Apply Filters (${totalSelected})` : "Apply Filters";
  }
  function setupRatingFilter() {
    const checkboxes = document.querySelectorAll(
      '#ratingFilters input[type="checkbox"]'
    );
    checkboxes.forEach((cb) => {
      cb.addEventListener("change", function () {
        if (this.checked) {
          checkboxes.forEach((c) => {
            if (c !== this) c.checked = false;
          });
        }
        updateFilterCounts();
      });
    });
  }
  // Setup Single Select Filter Boxes
  function setupSingleSelectBox(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll(".filter-option-box").forEach((box) => {
      box.addEventListener("click", () => {
        container
          .querySelectorAll(".filter-option-box")
          .forEach((b) => b.classList.remove("active"));
        box.classList.add("active");
        updateFilterCounts();
      });
    });
  }
  // Setup All Checkbox Filters (except GST toggle)
  function setupAllCheckboxFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", () => {
        if (cb.id !== "gstToggle") updateFilterCounts();
      });
    });
  }
  // Get active labels text from filter boxes
  const getActiveLabels = (containerId) => {
    const container = document.getElementById(containerId);
    return container
      ? [...container.querySelectorAll(".filter-option-box.active")].map(
          (box) => box.querySelectorAll("span")[1]?.textContent.trim() || ""
        )
      : [];
  };
  // Apply Filters and render listings
  applyBtn?.addEventListener("click", () => {
    filterModal.style.display = "none";
    document.body.style.overflow = "auto";
    const filters = {
      propertyTypes: getActiveLabels("propertyTypeFilters"),
      placeTypes: getActiveLabels("placeTypeFilters"),
      amenities: getActiveLabels("amenitiesFilters"),
      topPicks: [
        ...document.querySelectorAll("#topPicksFilters input:checked"),
      ].map((el) =>
        el.nextElementSibling.nextElementSibling.textContent.trim()
      ),
      ratings: [
        ...document.querySelectorAll("#ratingFilters input:checked"),
      ].map((el) =>
        el.closest("label")?.querySelector("span")?.textContent.trim()
      ),
      priceRange: {
        min: parseInt(minPrice.value, 10),
        max: parseInt(maxPrice.value, 10),
      },
    };
    const selectedRatingFilter = filters.ratings[0] || null;
    // Match listing rating with selected rating filter
    const matchRating = (listing) => {
      const avgRating = listing.rating ?? null;
      if (!selectedRatingFilter) return true;
      if (avgRating === null) return false;
      const match = selectedRatingFilter.match(/(\d+(\.\d+)?)/);
      if (!match) return true;
      return avgRating >= parseFloat(match[0]);
    };
    const filtered = allListings.filter((listing) => {
      const price = listing.price;
      return (
        (filters.propertyTypes.length === 0 ||
          filters.propertyTypes.includes(listing.propertyType)) &&
        (filters.placeTypes.length === 0 ||
          filters.placeTypes.includes(listing.placeType)) &&
        (filters.amenities.length === 0 ||
          filters.amenities.every((a) => listing.amenities.includes(a))) &&
        (filters.topPicks.length === 0 ||
          filters.topPicks.every((t) => listing.topPicks.includes(t))) &&
        matchRating(listing) &&
        price >= filters.priceRange.min &&
        price <= filters.priceRange.max
      );
    });
    // renderListings(filtered, "listingContainer");
    currentPage = 1;
    renderListingsWithPagination(filtered, "listingContainer", true);
    updateFilterCounts();
    bindSaveButtons(); // ← ADD THIS
  });
  // Reset to show all listings (expose as global for manual clearing)
  window.resetListings = () => {
    renderListings(allListings, "listingContainer");
    updateFilterCounts();
  };
  // Clear Filters Button
  clearBtn?.addEventListener("click", () => {
    // Clear all checkboxes except GST toggle
    document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      if (cb.id !== "gstToggle") cb.checked = false;
    });
    // Clear active classes on filter boxes
    ["propertyTypeFilters", "placeTypeFilters", "amenitiesFilters"].forEach(
      (id) => {
        const container = document.getElementById(id);
        if (!container) return;
        container.querySelectorAll(".filter-option-box").forEach((box) => {
          box.classList.remove("active");
        });
      }
    );
    // Reset price range sliders to default min/max
    if (minPrice && maxPrice && minVal && maxVal) {
      minPrice.value = minPrice.min;
      maxPrice.value = maxPrice.max;
      updateSlider();
    }
    // Reset rating checkboxes
    document
      .querySelectorAll("#ratingFilters input[type=checkbox]")
      .forEach((cb) => (cb.checked = false));
    updateFilterCounts();
  });
  // Initialize everything
  renderListings(allListings, "listingContainer");
  setupRatingFilter();
  setupSingleSelectBox("propertyTypeFilters");
  setupSingleSelectBox("placeTypeFilters");
  // setupSingleSelectBox("amenitiesFilters");
  setupAllCheckboxFilters();
  updateFilterCounts();
});
const applyBtn = document.getElementById("applyFilters");
applyBtn?.addEventListener("click", () => {
  console.log("✅ Apply button clicked");
});
//pagination
const pagination = document.getElementById("pagination");
const listingsPerPage = 24;
let currentPage = 1;
function renderListingsWithPagination(
  listings,
  containerId = "listingContainer",
  shouldScroll = false
) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const totalPages = Math.ceil(listings.length / listingsPerPage);
  const start = (currentPage - 1) * listingsPerPage;
  const end = currentPage * listingsPerPage;
  const paginatedListings = listings.slice(start, end);
  if (listings.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center my-5">
        <p class="text-muted fs-5">
          <i class="fa-solid fa-magnifying-glass fa-lg me-2"></i>
          No matching rooms found ${
            tag && city
              ? `for "<strong>${tag}</strong>" in "<strong>${city}</strong>"`
              : city
              ? `in "<strong>${city}</strong>"`
              : tag
              ? `for "<strong>${tag}</strong>"`
              : ""
          }.
        </p>
      </div>
    `;
    const pagination = document.getElementById("paginationContainer");
    if (pagination) pagination.innerHTML = "";
    return;
  }
  container.innerHTML = "";
  paginatedListings.forEach((listing) => {
    const priceFormatted = listing.price.toLocaleString("en-IN");
    const isSaved = listing.isSaved === true;
    const saveButtonHTML = currUserId
      ? `
      <button 
        type="button"
        class="save-btn btn btn-light rounded-circle shadow-sm p-2 position-absolute top-0 end-0 m-2"
        data-id="${listing._id}">
        <i class="${
          isSaved ? "fas fa-heart text-danger" : "far fa-heart text-dark"
        }"></i>
      </button>`
      : "";
    const cardHTML = `
      <div class="col">
        <div class="card h-100 hover-card position-relative">
          ${saveButtonHTML}
          <a class="touch text-decoration-none text-dark" href="/listings/${listing._id}">
            <img src="${listing.image.url}" class="card-img-top-index" alt="listing" />
            <div class="card-body d-flex flex-column justify-content-between">
              <h6 class="card-title">${listing.title}</h6>
                <p class="card-text">
  ₹<span class="listing-price" data-price="${listing.price}">
    ${priceFormatted}
  </span> /night
</p>
            </div>
          </a>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", cardHTML);
  });
  renderPagination(listings);
  if (shouldScroll) {
    window.scrollTo({
      top: container.offsetTop - 100,
      behavior: "smooth",
    });
  }
  bindSaveButtons(); // Re-bind after DOM update
}
function renderPagination(listings) {
  const totalPages = Math.ceil(listings.length / listingsPerPage);
  // Don't show pagination if only 1 or 0 pages
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }
  pagination.innerHTML = "";
  // Previous Button
  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = "&#10094;";
  prevBtn.classList.add("arrow-btn");
  prevBtn.disabled = currentPage === 1;
  prevBtn.style.opacity = prevBtn.disabled ? "0.3" : "1";
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderListingsWithPagination(listings);
    }
  };
  pagination.appendChild(prevBtn);
  function createPageBtn(num) {
    const btn = document.createElement("button");
    btn.textContent = num;
    btn.classList.add("page-btn");
    if (num === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = num;
      renderListingsWithPagination(listings, "listingContainer", true);
    };
    return btn;
  }
  // Page Button Logic
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pagination.appendChild(createPageBtn(i));
    }
  } else {
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pagination.appendChild(createPageBtn(i));
      }
      pagination.appendChild(makeEllipsis());
      pagination.appendChild(createPageBtn(totalPages));
    } else if (currentPage > totalPages - 4) {
      pagination.appendChild(createPageBtn(1));
      pagination.appendChild(makeEllipsis());
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pagination.appendChild(createPageBtn(i));
      }
    } else {
      pagination.appendChild(createPageBtn(1));
      pagination.appendChild(makeEllipsis());
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pagination.appendChild(createPageBtn(i));
      }
      pagination.appendChild(makeEllipsis());
      pagination.appendChild(createPageBtn(totalPages));
    }
  }
  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = "&#10095;";
  nextBtn.classList.add("arrow-btn");
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.style.opacity = nextBtn.disabled ? "0.3" : "1";
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderListingsWithPagination(listings, "listingContainer", true);
    }
  };
  pagination.appendChild(nextBtn);
}
function makeEllipsis() {
  const ellipsis = document.createElement("span");
  ellipsis.textContent = "...";
  ellipsis.classList.add("ellipsis");
  return ellipsis;
}
document.addEventListener("DOMContentLoaded", () => {
  bindSaveButtons();
  if (typeof allListings !== "undefined") {
    renderListingsWithPagination(allListings); // no scroll
    bindSaveButtons();
  } else {
    console.error("allListings not found");
  }
});

