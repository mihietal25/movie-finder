import { OMDB_API_KEY } from "./config.js";

const BASE = "https://www.omdbapi.com/";

export async function searchMovies(query, page = 1) {
  const url = `${BASE}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  return data; // { Search: [...], totalResults: "xx", Response: "True/False", Error? }
}

export async function getMovieById(imdbID) {
  const url = `${BASE}?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}