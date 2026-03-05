const KEY = "movieFinderFavorites";

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function isFavorite(imdbID) {
  return getFavorites().some((m) => m.imdbID === imdbID);
}

export function addFavorite(movie) {
  const favs = getFavorites();
  if (!favs.some((m) => m.imdbID === movie.imdbID)) {
    favs.push(movie);
    localStorage.setItem(KEY, JSON.stringify(favs));
  }
}

export function removeFavorite(imdbID) {
  const favs = getFavorites().filter((m) => m.imdbID !== imdbID);
  localStorage.setItem(KEY, JSON.stringify(favs));
}