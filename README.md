# Movie Finder

Movie Finder is a web application that allows users to search movies using the OMDb API.  
Users can view movie details, save their favorite movies, and browse previous searches.

This project was created as part of the Web Programming course.

---

## Features

- Search movies by title
- View detailed movie information
- Add or remove movies from favorites
- Favorites stored using localStorage
- Recent searches saved locally
- Pagination for search results
- Back to previous search results
- Loading indicators and error messages
- Responsive layout using Bootstrap

---

## Technologies Used

- HTML
- CSS
- JavaScript (ES Modules)
- Bootstrap
- OMDb API
- localStorage

---

## API

This project uses the **OMDb API** to fetch movie data.

https://www.omdbapi.com/

Example request:

https://www.omdbapi.com/?apikey=YOUR_API_KEY&s=Batman

---


## How to Run the Project

1. Clone the repository


2. Get an API key from OMDb

https://www.omdbapi.com/apikey.aspx

3. Create a file:

js/config.js

4. Add your API key:

```javascript
export const OMDB_API_KEY = "YOUR_API_KEY";

5. Open index.html in your browser



