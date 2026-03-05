import { searchMovies } from "./api.js";
import { addFavorite, removeFavorite, isFavorite } from "./favorites.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("query");
  const results = document.getElementById("results");
  const status = document.getElementById("status");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageInfo = document.getElementById("pageInfo");
  const recentContainer = document.getElementById("recentSearches");

  const params = new URLSearchParams(window.location.search);
  const qParam = params.get("q");
  const pageParam = params.get("page");

  let currentQuery = "";
  let currentPage = 1;
  let totalResults = 0;

  function posterOrPlaceholder(poster) {
    if (!poster || poster === "N/A") return "assets/img/placeholder.png";
    return poster;
  }

  function favButtonHtml(imdbID) {
    if (isFavorite(imdbID)) {
      return `<button class="btn btn-outline-danger btn-sm" data-fav="${imdbID}">Remove</button>`;
    }
    return `<button class="btn btn-outline-success btn-sm" data-fav="${imdbID}">Add</button>`;
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

            <div class="d-flex gap-2 mt-auto">
              <a class="btn btn-outline-primary btn-sm" href="movie.html?id=${m.imdbID}&q=${currentQuery}&page=${currentPage}">Details</a>
              ${favButtonHtml(m.imdbID)}
            </div>
          </div>
        </div>
      `;

      results.appendChild(col);
    });
  }

  function updatePaginationUI() {
    const totalPages = Math.ceil(totalResults / 10) || 1;

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;

    pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
  }

  // ---------- Recent searches ----------
  function getRecentSearches() {
    return JSON.parse(localStorage.getItem("recentSearches") || "[]");
  }

  function saveRecentSearch(query) {
    let searches = getRecentSearches();
    searches = searches.filter((x) => x !== query); // ei duplikaatteja
    searches.unshift(query); // uusi alkuun
    if (searches.length > 5) searches = searches.slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  }

  function renderRecentSearches() {
    const searches = getRecentSearches();

    if (!searches.length) {
      recentContainer.innerHTML = "";
      return;
    }

    recentContainer.innerHTML = `
      <p class="small text-muted mb-1">Recent searches:</p>
      <div class="d-flex flex-wrap gap-2">
        ${searches
          .map(
            (q) => `
          <button class="btn btn-outline-secondary btn-sm recent-search" data-q="${q}">
            ${q}
          </button>
        `
          )
          .join("")}
      </div>
    `;
  }

  // Klikkaus recent search napista
  recentContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".recent-search");
    if (!btn) return;

    const q = btn.getAttribute("data-q");
    input.value = q;

    // Päivitetään listaa (nostaa valitun kärkeen)
    saveRecentSearch(q);
    renderRecentSearches();

    runSearch(q, 1);
  });

  // ---------- Search ----------
  async function runSearch(query, page) {
    currentQuery = query;
    currentPage = page;

    status.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Searching...
    `;

    results.innerHTML = "";
    pageInfo.textContent = "";
    prevBtn.disabled = true;
    nextBtn.disabled = true;

    try {
      const data = await searchMovies(query, page);

      if (data.Response === "False") {
        totalResults = 0;
        status.innerHTML = `<span class="text-danger">${data.Error || "No results found."}</span>`;
        results.innerHTML = "";
        updatePaginationUI();
        return;
      }

      totalResults = Number(data.totalResults || 0);
      status.textContent = `Found ${totalResults} results.`;
      renderMovies(data.Search || []);
      updatePaginationUI();
    } catch (err) {
      totalResults = 0;
      status.innerHTML =
        `<span class="text-danger">Error while fetching data. Check API key or internet connection.</span>`;
      updatePaginationUI();
    }
  }

  // Add/Remove favorites tuloksista (delegointi)
  results.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-fav]");
    if (!btn) return;

    const imdbID = btn.getAttribute("data-fav");
    const card = btn.closest(".card");
    const title = card?.querySelector(".card-title")?.textContent?.trim() || "";
    const meta = card?.querySelector("p")?.textContent || "";
    const year = meta.split("•")[0]?.trim() || "";
    const poster = card?.querySelector("img")?.getAttribute("src") || "N/A";

    if (isFavorite(imdbID)) {
      removeFavorite(imdbID);
      btn.classList.remove("btn-outline-danger");
      btn.classList.add("btn-outline-success");
      btn.textContent = "Add";
    } else {
      addFavorite({
        imdbID,
        Title: title,
        Year: year,
        Type: "movie",
        Poster: poster.includes("placeholder.png") ? "N/A" : poster,
      });
      btn.classList.remove("btn-outline-success");
      btn.classList.add("btn-outline-danger");
      btn.textContent = "Remove";
    }
  });

  // Prev/Next
  prevBtn.addEventListener("click", () => {
    if (currentQuery && currentPage > 1) {
      runSearch(currentQuery, currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(totalResults / 10) || 1;
    if (currentQuery && currentPage < totalPages) {
      runSearch(currentQuery, currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // Form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const q = input.value.trim();
    if (!q) return;

    saveRecentSearch(q);
    renderRecentSearches();
    runSearch(q, 1);
  });

  // Render recent list heti
  renderRecentSearches();

  // Jos tullaan back-linkillä ?q=...&page=...
  if (qParam) {
    input.value = qParam;
    saveRecentSearch(qParam);
    renderRecentSearches();
    runSearch(qParam, Number(pageParam) || 1);
  }
});