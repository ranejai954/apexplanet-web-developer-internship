// ============================================
// MOVIE SEARCH APP - OMDb API
// ============================================

// 🔑 Get API key from config.js
const API_KEY = window.CONFIG?.MOVIE_API_KEY || '';
const BASE_URL = 'https://www.omdbapi.com/';

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentResults = [];

// ===== DOM Elements =====
const movieInput = document.getElementById('movieInput');
const searchBtn = document.getElementById('searchMovieBtn');
const movieResults = document.getElementById('movieResults');
const favoritesGrid = document.getElementById('favoritesGrid');
const favoritesSection = document.getElementById('favoritesSection');
const yearFilter = document.getElementById('yearFilter');
const typeFilter = document.getElementById('typeFilter');
const errorMessage = document.getElementById('errorMessage');
const modal = document.getElementById('movieModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

// ===== Check if API Key is Set =====
if (!API_KEY || API_KEY === 'your_omdb_api_key_here') {
    console.warn('⚠️ Movie API key not configured!');
    movieResults.innerHTML = `
        <div style="background:#7f1d1d;color:#fca5a5;padding:30px;border-radius:16px;text-align:center;">
            <h3><i class="fas fa-key"></i> API Key Required</h3>
            <p>Please add your OMDb API key to <code>js/config.js</code></p>
            <p style="margin-top:10px;">
                Get a free key at: 
                <a href="http://www.omdbapi.com/apikey.aspx" target="_blank" style="color:#facc15;">
                    omdbapi.com/apikey.aspx
                </a>
            </p>
        </div>
    `;
} else {
    console.log('✅ Movie API key loaded!');
}

// ===== Populate Year Filter =====
for (let year = new Date().getFullYear(); year >= 1900; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
}

// ===== Event Listeners =====
searchBtn.addEventListener('click', searchMovies);
movieInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ===== Search Movies =====
async function searchMovies() {
    const query = movieInput.value.trim();
    if (!query) {
        showError('Please enter a movie title');
        return;
    }

    const year = yearFilter.value;
    const type = typeFilter.value;

    showLoading();
    hideError();

    try {
        let url = `${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`;
        if (year) url += `&y=${year}`;
        if (type) url += `&type=${type}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === 'True') {
            currentResults = data.Search;
            displayMovies(data.Search);
        } else {
            showError(data.Error || 'No movies found');
            movieResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${data.Error || 'No movies found. Try a different search!'}</p>
                </div>
            `;
        }
    } catch (error) {
        showError('Failed to fetch movies. Please try again.');
        movieResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-wifi"></i>
                <p>Network error. Please check your connection.</p>
            </div>
        `;
    }
}

// ===== Display Movies =====
function displayMovies(movies) {
    if (!movies || movies.length === 0) {
        movieResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No movies found. Try a different search!</p>
            </div>
        `;
        return;
    }

    movieResults.innerHTML = `
        <div class="results-header">
            <h3><i class="fas fa-list"></i> Results</h3>
            <span class="count">${movies.length} movies found</span>
        </div>
        <div class="movie-grid">
            ${movies.map(movie => `
                <div class="movie-card" onclick="getMovieDetails('${movie.imdbID}')">
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/1e293b/64748b?text=No+Poster'}" 
                         alt="${movie.Title}">
                    <div class="movie-info">
                        <h4>${movie.Title}</h4>
                        <span class="year">${movie.Year}</span>
                        <span class="type">${movie.Type}</span>
                    </div>
                    <div class="movie-actions">
                        <button class="favorite-btn ${isFavorite(movie.imdbID) ? 'active' : ''}" 
                                onclick="event.stopPropagation(); toggleFavorite('${movie.imdbID}', '${movie.Title}', '${movie.Year}', '${movie.Poster}')">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ===== Get Movie Details =====
async function getMovieDetails(imdbID) {
    try {
        const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === 'True') {
            showMovieDetails(data);
        } else {
            showError('Failed to load movie details');
        }
    } catch (error) {
        showError('Failed to load movie details');
    }
}

// ===== Show Movie Details Modal =====
function showMovieDetails(movie) {
    const isFav = isFavorite(movie.imdbID);

    modalContent.innerHTML = `
        <div class="modal-grid">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/1e293b/64748b?text=No+Poster'}" 
                 alt="${movie.Title}">
            <div>
                <h2>${movie.Title}</h2>
                <p class="modal-year">${movie.Year} • ${movie.Runtime || 'N/A'} • ${movie.Rated || 'N/A'}</p>
                <p class="modal-rating">⭐ ${movie.imdbRating || 'N/A'}/10 (${movie.imdbVotes || 'N/A'} votes)</p>
                <p class="modal-detail"><strong>Genre:</strong> ${movie.Genre || 'N/A'}</p>
                <p class="modal-detail"><strong>Director:</strong> ${movie.Director || 'N/A'}</p>
                <p class="modal-detail"><strong>Actors:</strong> ${movie.Actors || 'N/A'}</p>
                <p class="modal-detail"><strong>Released:</strong> ${movie.Released || 'N/A'}</p>
                <p class="modal-plot">${movie.Plot || 'No plot available.'}</p>
                <div class="modal-actions">
                    <button class="btn ${isFav ? 'btn-danger' : 'btn-primary'}" onclick="toggleFavoriteFromModal('${movie.imdbID}', '${movie.Title}', '${movie.Year}', '${movie.Poster}')">
                        <i class="fas fa-heart"></i> ${isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                    <a href="https://www.imdb.com/title/${movie.imdbID}/" target="_blank" class="btn btn-secondary">
                        <i class="fab fa-imdb"></i> View on IMDb
                    </a>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Close Modal =====
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Favorites =====
function toggleFavorite(imdbID, title, year, poster) {
    const index = favorites.findIndex(f => f.imdbID === imdbID);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push({ imdbID, title, year, poster });
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
    
    // Refresh current results if they exist
    if (currentResults.length > 0) {
        displayMovies(currentResults);
    }
}

function toggleFavoriteFromModal(imdbID, title, year, poster) {
    toggleFavorite(imdbID, title, year, poster);
    // Refresh modal content
    getMovieDetails(imdbID);
}

function isFavorite(imdbID) {
    return favorites.some(f => f.imdbID === imdbID);
}

// ===== Display Favorites =====
function displayFavorites() {
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;color:#64748b;padding:20px;">
                <i class="fas fa-heart" style="color:#475569;font-size:2rem;display:block;margin-bottom:10px;"></i>
                <p>No favorites yet. ❤️ Add some movies!</p>
            </div>
        `;
        return;
    }

    favoritesGrid.innerHTML = favorites.map(movie => `
        <div class="movie-card" onclick="getMovieDetails('${movie.imdbID}')">
            <img src="${movie.poster !== 'N/A' ? movie.poster : 'https://via.placeholder.com/300x450/1e293b/64748b?text=No+Poster'}" 
                 alt="${movie.title}">
            <div class="movie-info">
                <h4>${movie.title}</h4>
                <span class="year">${movie.year}</span>
            </div>
            <div class="movie-actions">
                <button class="favorite-btn active" onclick="event.stopPropagation(); toggleFavorite('${movie.imdbID}', '${movie.title}', '${movie.year}', '${movie.poster}')">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== UI Helpers =====
function showLoading() {
    movieResults.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner"></i>
            <p>Searching for movies...</p>
        </div>
    `;
}

function showError(message) {
    errorMessage.textContent = '⚠️ ' + message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function hideError() {
    errorMessage.style.display = 'none';
}

// ===== Initialize =====
displayFavorites();

// Show a default search on load (if API key is set)
if (API_KEY && API_KEY !== 'your_omdb_api_key_here') {
    movieInput.value = 'Inception';
    searchMovies();
}