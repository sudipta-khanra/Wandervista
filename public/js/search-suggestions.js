// public/js/search-suggestions.js

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('btn-search-input');
  const suggestionBox = document.getElementById('suggestion-box');

  if (!searchInput || !suggestionBox) return;

  // Use the CDN version of Fuse since this is the frontend
  const fuse = new Fuse(destinations, { threshold: 0.5 });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (!query) {
      suggestionBox.style.display = 'none';
      return;
    }
    const filtered = fuse.search(query).map((r) => r.item);
    renderSuggestions(filtered);
  });

  function renderSuggestions(list) {
    suggestionBox.innerHTML = '';
    if (list.length === 0) {
      suggestionBox.innerHTML = '<li>No results found</li>';
    } else {
      list.forEach((dest) => {
        const li = document.createElement('li');
        li.textContent = dest;
        li.addEventListener('click', () => {
          searchInput.value = dest;
          suggestionBox.style.display = 'none';
        });
        suggestionBox.appendChild(li);
      });
    }
    suggestionBox.style.display = 'block';
  }
});
