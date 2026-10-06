/* ============================================================
   CineMatch — Discover Page Logic
   Live search, genre/rating/year filters, sorting
   ============================================================ */

var grid = $('#movieGrid');
var searchInput = $('#searchInput');
var genreFilter = $('#genreFilter');
var ratingFilter = $('#ratingFilter');
var yearFilter = $('#yearFilter');
var sortFilter = $('#sortFilter');
var resultCount = $('#resultCount');

function getFilteredMovies() {
  var query = (searchInput.value || '').toLowerCase().trim();
  var genre = genreFilter.value;
  var rating = ratingFilter.value;
  var year = yearFilter.value;
  var sort = sortFilter.value;

  var list = MOVIES.filter(function (m) {
    // Search by title
    if (query && m.title.toLowerCase().indexOf(query) === -1) return false;

    // Genre
    if (genre !== 'All' && m.genres.indexOf(genre) === -1) return false;

    // Rating
    if (rating === '8+' && m.rating < 8) return false;
    if (rating === '7+' && m.rating < 7) return false;
    if (rating === '6+' && m.rating < 6) return false;

    // Year
    if (year === '2026' && m.year !== 2026) return false;
    if (year === '2025' && m.year !== 2025) return false;
    if (year === '2024' && m.year !== 2024) return false;
    if (year === '2023' && m.year !== 2023) return false;
    if (year === 'Older' && m.year >= 2023) return false;

    return true;
  });

  // Sorting
  if (sort === 'Rating') list.sort(function (a, b) { return b.rating - a.rating; });
  else if (sort === 'Newest') list.sort(function (a, b) { return b.year - a.year; });
  else if (sort === 'A-Z') list.sort(function (a, b) { return a.title.localeCompare(b.title); });
  else list.sort(function (a, b) { return b.rating - a.rating; }); // Popular ≈ high rating

  return list;
}

function renderMovies() {
  var list = getFilteredMovies();
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML =
      '<div class="empty-state">' +
        '<h3>No movies found.</h3>' +
        '<button id="clearSearch" class="btn">Clear Search</button>' +
      '</div>';
    var clear = $('#clearSearch');
    if (clear) clear.addEventListener('click', function () {
      searchInput.value = '';
      renderMovies();
    });
    if (resultCount) resultCount.textContent = '0 movies';
    return;
  }

  list.forEach(function (m) { grid.appendChild(createMovieCard(m)); });
  if (resultCount) resultCount.textContent = list.length + ' movies';
  observeReveals();
}

// Events — everything updates without page refresh
searchInput.addEventListener('input', renderMovies);
genreFilter.addEventListener('change', renderMovies);
ratingFilter.addEventListener('change', renderMovies);
yearFilter.addEventListener('change', renderMovies);
sortFilter.addEventListener('change', renderMovies);

// Pre-select genre from home page (e.g., discover.html?genre=Horror)
var params = new URLSearchParams(window.location.search);
var preset = params.get('genre');
if (preset && genreFilter) {
  genreFilter.value = preset;
}

renderMovies();
