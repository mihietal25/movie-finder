import { getMovieById } from "./api.js";
import { addFavorite, removeFavorite, isFavorite } from "./favorites.js";

document.addEventListener("DOMContentLoaded", async () => {
  const posterEl = document.getElementById("poster");
  const titleEl = document.getElementById("title");
  const metaEl = document.getElementById("meta");
  const plotEl = document.getElementById("plot");
  const favBtn = document.getElementById("favBtn");
  const imdbLink = document.getElementById("imdbLink");

  const params = new URLSearchParams(window.location.search);
  const imdbID = params.get("id");

  if (!imdbID) {
    titleEl.textContent = "No movie selected";
    metaEl.textContent = "Go back to Search and open a movie.";
    favBtn.disabled = true;
    return;
  }

  try {
    const movie = await getMovieById(imdbID);

    if (movie.Response === "False") {
      titleEl.textContent = "Movie not found";
      metaEl.textContent = movie.Error || "";
      favBtn.disabled = true;
      return;
    }

    // Poster
    if (movie.Poster && movie.Poster !== "N/A") {
      posterEl.src = movie.Poster;
    } else {
      posterEl.src = "assets/img/placeholder.png";
    }
    posterEl.alt = movie.Title;

    // Title + meta
    titleEl.textContent = movie.Title;
    metaEl.textContent = [
      movie.Year,
      movie.Rated !== "N/A" ? movie.Rated : null,
      movie.Runtime !== "N/A" ? movie.Runtime : null,
      movie.Genre !== "N/A" ? movie.Genre : null,
      movie.imdbRating !== "N/A" ? `IMDb ${movie.imdbRating}` : null,
    ].filter(Boolean).join(" • ");

    // Plot
    plotEl.textContent = movie.Plot !== "N/A" ? movie.Plot : "No plot available.";

    // IMDb link
    imdbLink.href = `https://www.imdb.com/title/${movie.imdbID}/`;

    // Favorites button state
    function setFavButton() {
      if (isFavorite(movie.imdbID)) {
        favBtn.textContent = "Remove from favorites";
        favBtn.classList.remove("btn-outline-primary");
        favBtn.classList.add("btn-outline-danger");
      } else {
        favBtn.textContent = "Add to favorites";
        favBtn.classList.remove("btn-outline-danger");
        favBtn.classList.add("btn-outline-primary");
      }
    }

    setFavButton();

    favBtn.addEventListener("click", () => {
      if (isFavorite(movie.imdbID)) {
        removeFavorite(movie.imdbID);
      } else {
        // Tallennetaan kevyt objekti favorites-sivua varten
        addFavorite({
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Type: movie.Type,
          Poster: movie.Poster,
        });
      }
      setFavButton();
    });

  } catch (err) {
    titleEl.textContent = "Error loading movie";
    metaEl.textContent = "Check your internet connection and API key.";
    favBtn.disabled = true;
  }
});