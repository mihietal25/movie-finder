import { getFavorites, removeFavorite } from "./favorites.js";

document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("favList");
  const emptyEl = document.getElementById("empty");
  const clearBtn = document.getElementById("clearBtn");

  function posterOrPlaceholder(poster) {
    if (!poster || poster === "N/A") return "assets/img/placeholder.png";
    return poster;
  }

  function render() {
    const favs = getFavorites();

    listEl.innerHTML = "";

    if (!favs.length) {
      emptyEl.classList.remove("d-none");
      return;
    }

    emptyEl.classList.add("d-none");

    favs.forEach((m) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${posterOrPlaceholder(m.Poster)}" class="card-img-top" alt="${m.Title}">
          <div class="card-body d-flex flex-column">
            <h2 class="h6 card-title mb-1">${m.Title}</h2>
            <p class="text-muted small mb-3">${m.Year || ""}</p>

            <div class="d-flex gap-2 mt-auto">
              <a class="btn btn-outline-primary btn-sm" href="movie.html?id=${m.imdbID}">
                Details
              </a>
              <button class="btn btn-outline-danger btn-sm" data-remove="${m.imdbID}">
                Remove
              </button>
            </div>
          </div>
        </div>
      `;

      listEl.appendChild(col);
    });
  }

  // Poisto delegoinnilla (toimii kaikille luoduille napeille)
  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-remove]");
    if (!btn) return;

    const id = btn.getAttribute("data-remove");
    removeFavorite(id);
    render();
  });

  // Clear all
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("movieFinderFavorites");
    render();
  });

  render();
});