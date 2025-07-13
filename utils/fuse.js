//fuse
const Fuse = require("fuse.js");

function fuzzySearch(listings, searchTerm) {
  const options = {
    keys: ["location", "country"],
    threshold: 0.4,
  };

  const fuse = new Fuse(listings, options);
  return fuse.search(searchTerm).map((result) => result.item);
}

module.exports = { fuzzySearch };

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("btn-search-input");
  const suggestionBox = document.getElementById("suggestion-box");

  console.log("searchInput:", searchInput);
  console.log("suggestionBox:", suggestionBox);

  const fuse = new Fuse(destinations, { threshold: 0.5 });
  console.log("destinations:", destinations);

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
