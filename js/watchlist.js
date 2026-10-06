/* ============================================================
   CineMatch — Watchlist Page Logic
   ============================================================ */

function renderWatchlist() {
  var list = getWatchlist();
  var grid = $('#watchlistGrid');
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML =
      '<div class="empty-state">' +
        '<h3>Your watchlist is empty.</h3>' +
        '<a href="discover.html" class="btn">Discover Movies</a>' +
      '</div>';
    return;
  }

  list.forEach(function (id) {
    var m = MOVIES.find(function (x) { return x.id === id; });
    if (!m) return;
    var card = document.createElement('div');
    card.className = 'movie-card reveal';
    card.innerHTML =
      '<div class="poster-wrap">' +
        '<img src="' + m.poster + '" alt="' + m.title + ' poster" loading="lazy">' +
        '<span class="rating-badge">⭐ ' + m.rating.toFixed(1) + '</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<h3>' + m.title + '</h3>' +
        '<p class="meta">' + m.year + ' • ' + m.genres.join(', ') + '</p>' +
        '<div class="card-actions">' +
          '<button class="btn-small btn-details">View Details</button>' +
          '<button class="btn-small btn-remove">Remove</button>' +
        '</div>' +
      '</div>';
    card.querySelector('.btn-details').addEventListener('click', function () { openMovieDetails(m.id); });
    card.querySelector('.btn-remove').addEventListener('click', function () {
      toggleWatchlist(m.id);
      renderWatchlist();
    });
    grid.appendChild(card);
  });
  observeReveals();
}

renderWatchlist();
