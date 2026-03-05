import { searchMovies } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("query");
  const results = document.getElementById("results");
  const status = document.getElementById("status");

  function posterOrPlaceholder(poster) {
    // OMDb palauttaa "N/A" jos ei kuvaa
    if (!poster || poster === "N/A") return "assets/img/placeholder.png";
    return poster;
  }

  function renderMovies(list) {
    results.innerHTML = "";

    list.forEach((m) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${posterOrPlaceholder(m.Poster)}" class="card-img-top" alt="${m.Title}">
          <div class="card-body d-flex flex-column">
            <h2 class="h6 card-title mb-1">${m.Title}</h2>
            <p class="text-muted small mb-3">${m.Year} • ${m.Type}</p>
            <a class="btn btn-outline-primary btn-sm mt-auto" href="movie.html?id=${m.imdbID}">
              Details
            </a>
          </div>
        </div>
      `;

      results.appendChild(col);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;

    status.textContent = "Searching...";
    results.innerHTML = "";

    try {
      const data = await searchMovies(q, 1);

      if (data.Response === "False") {
        status.textContent = data.Error || "No results.";
        return;
      }

      status.textContent = `Found ${data.totalResults} results (showing first page).`;
      renderMovies(data.Search);
    } catch (err) {
      status.textContent = "Error while fetching data. Check your API key and internet connection.";
    }
  });
});