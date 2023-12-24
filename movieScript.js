// movieScript.js

// Replace with your OMDB API key
const API_KEY = "bb92d24f";

// Extract IMDb ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get("imdbID");

// Reference to the container where movie details will be displayed
const movieDetailsContainer = document.getElementById("movieDetails");

// Wait for the DOM to be fully loaded before executing code
document.addEventListener("DOMContentLoaded", () => {
  // Check if IMDb ID is present in the URL
  if (imdbID) {
    // Fetch movie details using the IMDb ID from the OMDB API
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
      .then((response) => response.json())
      .then((movieData) => displayMovieDetails(movieData))
      .catch((error) => console.error("Error fetching movie details:", error));
  }
});

// Display movie details in the designated container
function displayMovieDetails(movieData) {
  // Update the HTML content of the movieDetailsContainer with the fetched movie details
  movieDetailsContainer.innerHTML = `
    <h2>${movieData.Title}</h2>
    <img src="${movieData.Poster}" alt="${movieData.Title} Poster" class="img-fluid">
    <p>Plot: ${movieData.Plot}</p>
  `;
}
