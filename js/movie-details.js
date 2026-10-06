/* ============================================================
   CineMatch — Movie Details Page Logic
   ============================================================ */

var params = new URLSearchParams(window.location.search);
var movieId = parseInt(params.get('id'), 10);
var movie = MOVIES.find(function (m) { return m.id === movieId; });

if (!movie) {
  $('#details').innerHTML = '<h2>Movie not found.</h2><a href="discover.html" class="btn">Back to Discover</a>';
} else {
  document.title = movie.title + ' — CineMatch';

  $('#backdrop').style.backgroundImage = 'url(' + movie.backdrop + ')';
  $('#poster').src = movie.poster;
  $('#poster').alt = movie.title + ' poster';
  $('#title').textContent = movie.title;
  $('#rating').textContent = '⭐ ' + movie.rating.toFixed(1) + '/10';
  $('#year').textContent = movie.year;
  $('#genres').textContent = movie.genres.join(' • ');
  $('#description').textContent = movie.description;
  $('#director').textContent = movie.director;
  $('#language').textContent = movie.language;
  $('#duration').textContent = movie.duration;
  $('#imdbScore').textContent = movie.rating.toFixed(1);
  $('#story').textContent = movie.description + ' A cinematic experience that blends storytelling, visuals and memorable performances.';

  // Cast
  var castBox = $('#castList');
  movie.cast.forEach(function (c) {
    var div = document.createElement('div');
    div.className = 'cast-card';
    div.innerHTML =
      '<img src="https://placehold.co/200x200/222233/ffffff?text=' + encodeURIComponent(c.name) + '" alt="' + c.name + '">' +
      '<h4>' + c.name + '</h4><p>' + c.role + '</p>';
    castBox.appendChild(div);
  });

  // Similar movies — share at least one genre
  var similar = MOVIES.filter(function (m) {
    return m.id !== movie.id && m.genres.some(function (g) { return movie.genres.indexOf(g) !== -1; });
  }).slice(0, 6);
  var simGrid = $('#similarGrid');
  similar.forEach(function (m) { simGrid.appendChild(createMovieCard(m)); });
  observeReveals();

  // Watchlist button
  var watchBtn = $('#watchBtn');
  function refreshWatchBtn() {
    watchBtn.textContent = isInWatchlist(movie.id) ? '♥ In Watchlist' : '♡ Add to Watchlist';
  }
  refreshWatchBtn();
  watchBtn.addEventListener('click', function () {
    toggleWatchlist(movie.id);
    refreshWatchBtn();
  });

  // Trailer modal
  var modal = $('#trailerModal');
  $('#trailerBtn').addEventListener('click', function () {
    $('#trailerFrame').innerHTML =
      '<div class="trailer-placeholder">' +
        '<p>▶ Trailer for ' + movie.title + '</p>' +
        '<a target="_blank" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(movie.title + ' official trailer') + '">Watch on YouTube</a>' +
      '</div>';
    modal.classList.add('open');
  });
  $('#closeModal').addEventListener('click', function () { modal.classList.remove('open'); });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('open'); });
}
