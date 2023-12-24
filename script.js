// script.js

const API_KEY = "bb92d24f"; // Replace with your OMDB API key

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");
const favoritesList = document.getElementById("favoritesList");
const movieDetails = document.getElementById("movieDetails");

let favoriteMovies = [];

// Listen for input events with debouncing to improve performance
searchInput.addEventListener("input", debounce(handleSearch, 300));

// Debouncing function to delay search until user stops typing
function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}

// Handle movie search
async function handleSearch() {
  const searchTerm = searchInput.value.trim();

  if (searchTerm === "") {
    clearResults();
    return;
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`
    );
    const data = await response.json();

    if (data.Search) {
      displaySearchResults(data.Search);
    } else {
      clearResults();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Display search results dynamically
function displaySearchResults(movies) {
  clearResults();

  movies.forEach((movie) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${movie.Title}</strong> (${movie.Year})
      <a href="movie.html?imdbID=${movie.imdbID}" class="btn btn-primary btn-sm">View Details</a>
      <button class="btn btn-primary btn-sm favoriteBtn" data-imdbid="${movie.imdbID}">Add to Favorites</button>
    `;

    const favoriteBtn = li.querySelector(".favoriteBtn");
    favoriteBtn.addEventListener("click", (event) =>
      addToFavorites(event, movie.imdbID)
    );

    searchResults.appendChild(li);
  });
}

// Clear search results
function clearResults() {
  searchResults.innerHTML = "";
}

// Add movie to favorites
function addToFavorites(event, imdbID) {
  event.stopPropagation();

  if (favoriteMovies.some((movie) => movie.imdbID === imdbID)) {
    alert("This movie is already in your favorites!");
    return;
  }

  fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
    .then((response) => response.json())
    .then((movieData) => {
      favoriteMovies.push(movieData);
      saveToLocalStorage();
      displayFavorites();
    })
    .catch((error) => console.error("Error fetching movie details:", error));
}

// Show detailed movie information
function showMovieDetails(imdbID) {
  fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
    .then((response) => response.json())
    .then((movieData) => {
      const glassmorphicContainer = document.createElement("div");
      glassmorphicContainer.classList.add("glassmorphic-container");

      const closeButton = document.createElement("button");
      closeButton.classList.add("close-btn");
      closeButton.innerHTML = "&#10006;";
      closeButton.addEventListener("click", hideMovieDetails);

      const content = document.createElement("div");
      content.innerHTML = `
        <h2>${movieData.Title}</h2>
        <img src="${movieData.Poster}" alt="${movieData.Title} Poster" class="img-fluid">
        <p>Plot: ${movieData.Plot}</p>
      `;

      glassmorphicContainer.appendChild(closeButton);
      glassmorphicContainer.appendChild(content);

      document.body.appendChild(glassmorphicContainer);

      document.body.style.overflow = "hidden"; // Prevent scrolling while focused
    })
    .catch((error) => console.error("Error fetching movie details:", error));
}

// Hide detailed movie information
function hideMovieDetails() {
  const glassmorphicContainer = document.querySelector(
    ".glassmorphic-container"
  );
  if (glassmorphicContainer) {
    glassmorphicContainer.remove();
    document.body.style.overflow = "auto"; // Allow scrolling again
  }
}

// Load favorite movies from local storage on page load
function loadFromLocalStorage() {
  const storedFavorites = localStorage.getItem("favoriteMovies");
  if (storedFavorites) {
    favoriteMovies = JSON.parse(storedFavorites);
    displayFavorites();
  }
}

// Save favorite movies to local storage
function saveToLocalStorage() {
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
}

// Display favorite movies
function displayFavorites() {
  favoritesList.innerHTML = "";

  favoriteMovies.forEach((movie) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div>
          <img src="${movie.Poster}" alt="${movie.Title} Poster" class="img-thumbnail">
          <strong>${movie.Title}</strong> (${movie.Year})
        </div>
        <button class="btn btn-danger btn-sm removeBtn" data-imdbid="${movie.imdbID}">Remove</button>
      </div>
    `;

    const removeBtn = li.querySelector(".removeBtn");
    removeBtn.addEventListener("click", () =>
      removeFromFavorites(movie.imdbID)
    );

    favoritesList.appendChild(li);
  });
}

// Remove movie from favorites
function removeFromFavorites(imdbID) {
  favoriteMovies = favoriteMovies.filter((movie) => movie.imdbID !== imdbID);
  saveToLocalStorage();
  displayFavorites();
}

// Load favorite movies on page load
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);
