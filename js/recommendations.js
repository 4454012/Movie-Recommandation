/* ============================================================
   CineMatch — Recommendations Engine
   Simple scoring algorithm (no machine learning):
   genre match = +5, mood match = +4, rating = +3, newness = +1
   ============================================================ */

var selectedGenre = null;
var selectedMood = null;
var ratingSlider = $('#ratingSlider');
var ratingValue = $('#ratingValue');

// Genre / Mood pill selection
$$('[data-genre]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    $$('[data-genre]').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    selectedGenre = btn.getAttribute('data-genre');
  });
});

$$('[data-mood]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    $$('[data-mood]').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    selectedMood = btn.getAttribute('data-mood');
  });
});

// Live rating value
ratingSlider.addEventListener('input', function () {
  ratingValue.textContent = parseFloat(ratingSlider.value).toFixed(1) + ' ⭐';
});

// Generate recommendations
$('#recommendBtn').addEventListener('click', function () {
  var minRating = parseFloat(ratingSlider.value);

  if (!selectedGenre || !selectedMood) {
    showToast('Please select both a genre and a mood first.');
    return;
  }

  // Score every movie
  var scored = MOVIES.map(function (m) {
    var score = 0;
    var reasons = [];

    if (m.genres.indexOf(selectedGenre) !== -1) { score += 5; reasons.push('matches your "' + selectedGenre + '" genre'); }
    if (m.moods.indexOf(selectedMood) !== -1) { score += 4; reasons.push('fits your "' + selectedMood + '" mood'); }
    if (m.rating >= minRating) { score += 3; reasons.push('has a ' + m.rating.toFixed(1) + ' rating'); }
    if (m.year >= 2020) { score += 1; reasons.push('is a recent release'); }

    return { movie: m, score: score, reasons: reasons };
  })
    .filter(function (x) { return x.score > 0; })
    .sort(function (a, b) { return b.score - a.score; })
    .slice(0, 8);

  var box = $('#recommendResults');
  box.innerHTML = '<h2>Your Top Recommendations</h2><div class="grid" id="recGrid"></div>';
  var recGrid = $('#recGrid');

  if (scored.length === 0) {
    box.innerHTML += '<p class="empty-state">No matches found. Try a lower rating or different mood.</p>';
    return;
  }

  scored.forEach(function (item) {
    var m = item.movie;
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
        '<p class="why"><strong>Why we recommend this:</strong> ' + m.title + ' ' + item.reasons.join(', ') + '.</p>' +
        '<div class="card-actions">' +
          '<button class="btn-small btn-details">Details</button>' +
        '</div>' +
      '</div>';
    card.querySelector('.btn-details').addEventListener('click', function () {
      openMovieDetails(m.id);
    });
    recGrid.appendChild(card);
  });

  observeReveals();
  showToast('✨ Your recommendations are ready!');
  box.scrollIntoView({ behavior: 'smooth' });
});
