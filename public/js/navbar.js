document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const authDropdown = document.getElementById("auth-dropdown");
  const dropdownPanel = document.getElementById("dropdownPanel");
  const toggleBtn = document.getElementById("toggleDropdown");
  const countrySelect = document.getElementById("countrySelect");
  const citySelect = document.getElementById("citySelect");
  const searchInput = document.getElementById("btn-search-input");
  const searchForm = document.querySelector('form[role="search"]');
  const suggestionBox = document.getElementById("suggestion-box");
  const errorDiv = document.getElementById("searchError");
  // const destinations = window.destinations || [];

  if (!searchInput || !suggestionBox) {
    console.warn("Search input or suggestion box not found");
    return;
  }

  // 🔽 Auth dropdown
  menuToggle?.addEventListener("click", function (e) {
    e.stopPropagation();
    authDropdown.classList.toggle("show");
  });

  // 🔽 Country dropdown
  toggleBtn?.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdownPanel.style.display =
      dropdownPanel.style.display === "none" ? "block" : "none";
  });

  document.addEventListener("click", function (e) {
    if (!authDropdown?.contains(e.target) && !menuToggle?.contains(e.target)) {
      authDropdown?.classList.remove("show");
    }

    if (!dropdownPanel?.contains(e.target) && !toggleBtn?.contains(e.target)) {
      dropdownPanel.style.display = "none";
    }

    if (!searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
      suggestionBox.style.display = "none";
    }
  });

  // 🔽 Country => cities
  countrySelect?.addEventListener("change", function () {
    const selectedCountry = countrySelect.value;
    citySelect.innerHTML = '<option value="">Select City</option>';
    if (selectedCountry && citiesByDestinations[selectedCountry]) {
      citiesByDestinations[selectedCountry].forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
    }
  });

  citySelect?.addEventListener("change", function () {
    const country = countrySelect.value;
    const city = citySelect.value;
    if (country && city) {
      searchInput.value = `${city}, ${country}`;
      dropdownPanel.style.display = "none";
    }
  });

  // 🔍 Search input autocomplete
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query === "") {
      suggestionBox.style.display = "none";
      return;
    }
    const filtered = destinations.filter((dest) =>
      dest.toLowerCase().includes(query)
    );
    renderSuggestions(filtered);
  });

  searchInput.addEventListener("focus", () => {
    renderSuggestions(destinations);
  });

  function renderSuggestions(list) {
    suggestionBox.innerHTML = "";
    if (list.length === 0) {
      suggestionBox.innerHTML =
        '<li class="list-group-item">No results found</li>';
    } else {
      list.forEach((dest) => {
        const li = document.createElement("li");
        li.className = "list-group-item list-group-item-action";
        li.textContent = dest;
        li.addEventListener("click", () => {
          searchInput.value = dest;
          suggestionBox.style.display = "none";
        });
        suggestionBox.appendChild(li);
      });
    }
    suggestionBox.style.display = "block";
  }

  // 🔍 Form validation
  searchForm?.addEventListener("submit", function (e) {
    const input = searchInput.value.trim();
    if (!input) {
      e.preventDefault();
      errorDiv.textContent = "Please enter a city or country name.";
      errorDiv.classList.remove("d-none");
    } else {
      errorDiv.classList.add("d-none");
    }
  });
});

//fuse
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("btn-search-input");
  const suggestionBox = document.getElementById("suggestion-box");
  const fuse = new Fuse(destinations, { threshold: 0.3 });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    console.log("Input changed:", query);
    if (!query) {
      suggestionBox.style.display = "none";
      return;
    }
    const filtered = fuse.search(query).map((r) => r.item);
    console.log("Filtered:", filtered);
    renderSuggestions(filtered);
  });

  searchInput.addEventListener("focus", () => {
    renderSuggestions(destinations);
  });

  function renderSuggestions(list) {
    suggestionBox.innerHTML = "";
    if (list.length === 0) {
      suggestionBox.innerHTML = "<li>No results found</li>";
    } else {
      list.forEach((dest) => {
        const li = document.createElement("li");
        li.textContent = dest;
        li.addEventListener("click", () => {
          searchInput.value = dest;
          suggestionBox.style.display = "none";
        });
        suggestionBox.appendChild(li);
      });
    }
    suggestionBox.style.display = "block";
  }
});

