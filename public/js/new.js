 (() => {
    const box = document.getElementById("moreOptionsBox");
    const checkbox = document.getElementById("toggleEnumOptions");
    const enumWrapper = document.getElementById("enumOptionsWrapper");
    const overlay = document.getElementById("overlay");

    const steps = ["step1", "step2", "step3", "step4", "step5"];
    let stepIndex = 0;
    const stepElements = steps.map((id) => document.getElementById(id));
    const backBtn = document.getElementById("backBtn");
    const nextBtn = document.getElementById("nextBtn");
    const progressBarFill = document.querySelector(".progress-bar-fill");

    // Force buttons to never submit
    backBtn.setAttribute("type", "button");
    nextBtn.setAttribute("type", "button");

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
    const categories = [
      { icon: "trending_up", label: "Trending" },
      { icon: "beach_access", label: "Beach" },
      { icon: "location_city", label: "Iconic Cities" },
      { icon: "terrain", label: "Mountains" },
      { icon: "meeting_room", label: "Rooms" },
      { icon: "pool", label: "Amazing Pools" },
      { icon: "park", label: "Camping" },
      { icon: "water", label: "Lake Front" },
      { icon: "castle", label: "Castles" },
      { icon: "agriculture", label: "Farms" },
      { icon: "home", label: "Tiny House" },
      { icon: "cable", label: "Cable Car" },
      { icon: "hotel", label: "Hotels" },
      { icon: "temple_buddhist", label: "Worship" },
      { icon: "account_balance", label: "Domes" },
      { icon: "directions_boat", label: "Boats" },
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
    const topPicks = [
      { icon: "bolt", label: "Instant Book" },
      { icon: "cancel", label: "Free Cancellation" },
      { icon: "pets", label: "Pets Allowed" },
      { icon: "eco", label: "Eco-friendly Stay" },
    ];

    const categoryInputs = document.getElementById("categoryInputs");
    const amenityInputs = document.getElementById("amenityInputs");
    const propertyInput = document.getElementById("propertyTypeInput");
    const placeInput = document.getElementById("placeTypeInput");
    const topPickInputs = document.getElementById("topPickInputs");

    let selectedTags = [];
    let selectedAmenities = [];
    let selectedTopPicks = [];

    function renderOptions(containerId, options, single, onUpdate) {
      const container = document.getElementById(containerId);
      container.innerHTML = "";
      options.forEach((opt) => {
        const div = document.createElement("div");
        div.className = "btn-select";
        div.innerHTML = `
          <span class="material-symbols-outlined btn_icon">${opt.icon}</span>
          <span class="label-text">${opt.label}</span>
        `;
        div.dataset.value = opt.label;

        div.onclick = () => {
          if (single) {
            [...container.children].forEach((el) => el.classList.remove("selected"));
            div.classList.add("selected");
            onUpdate(opt.label);
          } else {
            div.classList.toggle("selected");
            onUpdate();
          }
        };
        container.appendChild(div);
      });
    }

    // Render options
    renderOptions("propertyTypes", propertyTypes, true, (val) => {
      propertyInput.value = val;
    });
    renderOptions("placeTypes", placeTypes, true, (val) => {
      placeInput.value = val;
    });
    renderOptions("categories", categories, false, () => {
      selectedTags = [...document.querySelectorAll("#categories .selected")].map(div => div.dataset.value);
      categoryInputs.innerHTML = selectedTags.map(tag =>
        `<input type="hidden" name="tags" value="${tag}">`
      ).join("");
    });
    renderOptions("amenities", amenities, false, () => {
      selectedAmenities = [...document.querySelectorAll("#amenities .selected")].map(div => div.dataset.value);
      amenityInputs.innerHTML = selectedAmenities.map(tag =>
        `<input type="hidden" name="amenities" value="${tag}">`
      ).join("");
    });
    renderOptions("topPicks", topPicks, false, () => {
      selectedTopPicks = [...document.querySelectorAll("#topPicks .selected")].map(div => div.dataset.value);
      topPickInputs.innerHTML = selectedTopPicks.map(tag =>
        `<input type="hidden" name="listing[topPicks]" value="${tag}">`
      ).join("");
    });

    function updateStepUI() {
      stepElements.forEach((el, i) => el.classList.toggle("hidden", i !== stepIndex));
      progressBarFill.style.width = `${((stepIndex + 1) / steps.length) * 100}%`;
      backBtn.disabled = stepIndex === 0;
      nextBtn.textContent = stepIndex === steps.length - 1 ? "Finish" : "Next";
    }

    backBtn.onclick = () => {
      if (stepIndex > 0) {
        stepIndex--;
        updateStepUI();
      }
    };

    nextBtn.onclick = (e) => {
      e.preventDefault();
      const isLastStep = stepIndex === steps.length - 1;
      if (!isLastStep) {
        stepIndex++;
        updateStepUI();
      } else {
        saveSelectedOptions();
        toggleModal(false);
        document.body.style.overflow = "auto";
        checkbox.checked = false;
        stepIndex = 0;
        updateStepUI();
      }
    };

    function saveSelectedOptions() {
      const selectedProperty = document.querySelector("#propertyTypes .selected");
      propertyInput.value = selectedProperty?.dataset.value || "";

      const selectedPlace = document.querySelector("#placeTypes .selected");
      placeInput.value = selectedPlace?.dataset.value || "";

      selectedTags = [...document.querySelectorAll("#categories .selected")].map(div => div.dataset.value);
      categoryInputs.innerHTML = selectedTags.map(tag =>
        `<input type="hidden" name="tags" value="${tag}">`
      ).join("");

      selectedAmenities = [...document.querySelectorAll("#amenities .selected")].map(div => div.dataset.value);
      amenityInputs.innerHTML = selectedAmenities.map(tag =>
        `<input type="hidden" name="amenities" value="${tag}">`
      ).join("");

      selectedTopPicks = [...document.querySelectorAll("#topPicks .selected")].map(div => div.dataset.value);
      topPickInputs.innerHTML = selectedTopPicks.map(tag =>
        `<input type="hidden" name="listing[topPicks]" value="${tag}">`
      ).join("");
    }

    function toggleModal(show) {
      enumWrapper.style.display = show ? "block" : "none";
      overlay.style.display = show ? "block" : "none";
    }

    // Open modal toggle
    box.addEventListener("click", () => {
      checkbox.checked = !checkbox.checked;
      toggleModal(checkbox.checked);
      document.body.style.overflow = checkbox.checked ? "hidden" : "auto";
    });

    // Close modal on overlay or button
    overlay.addEventListener("click", () => {
      toggleModal(false);
      checkbox.checked = false;
      document.body.style.overflow = "auto";
    });

    document.getElementById("closeModalBtn").onclick = () => {
      toggleModal(false);
      checkbox.checked = false;
      document.body.style.overflow = "auto";
    };

    updateStepUI(); // Initialize
  })();