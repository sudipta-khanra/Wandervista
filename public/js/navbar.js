document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Element Selectors ---
  const menuToggle = document.getElementById('menu-toggle');
  const authDropdown = document.getElementById('auth-dropdown');
  const dropdownPanel = document.getElementById('dropdownPanel');
  const toggleBtn = document.getElementById('toggleDropdown');
  const countrySelect = document.getElementById('countrySelect');
  const citySelect = document.getElementById('citySelect');
  const searchInput = document.getElementById('btn-search-input');
  const searchForm = document.querySelector('form[role="search"]');
  const suggestionBox = document.getElementById('suggestion-box');
  const errorDiv = document.getElementById('searchError');

  // Initialize Fuse only if data exists
  const destinationsList =
    typeof destinations !== 'undefined' ? destinations : [];
  const fuse = new Fuse(destinationsList, { threshold: 0.3 });

  // --- 2. Helper: Render Suggestions ---
  function renderSuggestions(list) {
    if (!suggestionBox) return;
    suggestionBox.innerHTML = '';

    if (list.length === 0) {
      suggestionBox.innerHTML =
        '<li class="list-group-item">No results found</li>';
    } else {
      list.forEach((dest) => {
        const li = document.createElement('li');
        li.className = 'list-group-item list-group-item-action';
        li.textContent = dest;
        li.addEventListener('click', () => {
          if (searchInput) {
            searchInput.value = dest;
            suggestionBox.style.display = 'none';
          }
        });
        suggestionBox.appendChild(li);
      });
    }
    suggestionBox.style.display = 'block';
  }

  // --- 3. Dropdown & UI Logic (with safety checks) ---
  menuToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    authDropdown?.classList.toggle('show');
  });

  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dropdownPanel) {
      dropdownPanel.style.display =
        dropdownPanel.style.display === 'none' ? 'block' : 'none';
    }
  });

  document.addEventListener('click', (e) => {
    // Close Auth Dropdown
    if (
      authDropdown &&
      !authDropdown.contains(e.target) &&
      !menuToggle?.contains(e.target)
    ) {
      authDropdown.classList.remove('show');
    }
    // Close Country Dropdown
    if (
      dropdownPanel &&
      !dropdownPanel.contains(e.target) &&
      !toggleBtn?.contains(e.target)
    ) {
      dropdownPanel.style.display = 'none';
    }
    // Close Search Suggestions
    if (
      suggestionBox &&
      !searchInput?.contains(e.target) &&
      !suggestionBox.contains(e.target)
    ) {
      suggestionBox.style.display = 'none';
    }
  });

  // --- 4. Search & Autocomplete (Fuse.js) ---
  if (searchInput && suggestionBox) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      if (!query) {
        suggestionBox.style.display = 'none';
        return;
      }
      const filtered = fuse.search(query).map((r) => r.item);
      renderSuggestions(filtered);
    });

    searchInput.addEventListener('focus', () => {
      renderSuggestions(destinationsList);
    });
  }

  // --- 5. Country & City Filtering ---
  countrySelect?.addEventListener('change', function () {
    const selectedCountry = this.value;
    if (!citySelect) return;

    citySelect.innerHTML = '<option value="">Select City</option>';
    if (
      selectedCountry &&
      typeof citiesByDestinations !== 'undefined' &&
      citiesByDestinations[selectedCountry]
    ) {
      citiesByDestinations[selectedCountry].forEach((city) => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
    }
  });

  citySelect?.addEventListener('change', function () {
    const country = countrySelect?.value;
    const city = this.value;
    if (country && city && searchInput) {
      searchInput.value = `${city}, ${country}`;
      if (dropdownPanel) dropdownPanel.style.display = 'none';
    }
  });

  // --- 6. Form Validation ---
  searchForm?.addEventListener('submit', (e) => {
    const input = searchInput?.value.trim();
    if (!input) {
      e.preventDefault();
      if (errorDiv) {
        errorDiv.textContent = 'Please enter a city or country name.';
        errorDiv.classList.remove('d-none');
      }
    } else {
      errorDiv?.classList.add('d-none');
    }
  });
});
