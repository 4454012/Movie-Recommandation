/* ============================================================
   CineMatch — Shared JavaScript (runs on every page)
   Navbar, theme, loader, toasts, watchlist helpers,
   movie card builder, back-to-top, scroll reveal
   ============================================================ */

// ---------- Small utility ----------
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

// ---------- Loading Screen ----------
window.addEventListener('load', function () {
  var loader = $('#loader');
  if (loader) {
    setTimeout(function () { loader.classList.add('hide'); }, 900);
  }
});
// Safety: never trap the user behind the loader
setTimeout(function () {
  var loader = $('#loader');
  if (loader) loader.classList.add('hide');
}, 3500);

// ---------- Sticky Navbar ----------
window.addEventListener('scroll', function () {
  var nav = $('#navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);

  var btn = $('#backToTop');
  if (btn) btn.classList.toggle('show', window.scrollY > 500);
});

// ---------- Mobile Menu ----------
var burger = $('#burger');
if (burger) {
  burger.addEventListener('click', function () {
    $('#navLinks').classList.toggle('open');
  });
}

// ---------- Theme System ----------
var themeBtn = $('#themeToggle');
if (themeBtn) {
  themeBtn.addEventListener('click', function () {
    document.body.classList.toggle('light');
    var isLight = document.body.classList.contains('light');
    localStorage.setItem('cinematch_theme', isLight ? 'light' : 'dark');
    themeBtn.textContent = isLight ? '🌙' : '☀️';
  });
}
// Restore saved theme
if (localStorage.getItem('cinematch_theme') === 'light') {
  document.body.classList.add('light');
  if (themeBtn) themeBtn.textContent = '🌙';
}

// ---------- Back to Top ----------
var backToTop = $('#backToTop');
if (backToTop) {
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- Toast Notifications ----------
var toastTimer = null;
function showToast(msg) {
  var toast = $('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2800);
}

// ---------- Watchlist (localStorage) ----------
function getWatchlist() {
  return JSON.parse(localStorage.getItem('cinematch_watchlist') || '[]');
}
function saveWatchlist(list) {
  localStorage.setItem('cinematch_watchlist', JSON.stringify(list));
}
function isInWatchlist(id) {
  return getWatchlist().indexOf(id) !== -1;
}
function toggleWatchlist(id) {
  var list = getWatchlist();
  var movie = MOVIES.find(function (m) { return m.id === id; });
  if (list.indexOf(id) === -1) {
    list.push(id);
    saveWatchlist(list);
    showToast('✓ ' + (movie ? movie.title : 'Movie') + ' added to your watchlist.');
  } else {
    list = list.filter(function (x) { return x !== id; });
    saveWatchlist(list);
    showToast('✓ ' + (movie ? movie.title : 'Movie') + ' removed from your watchlist.');
  }
  return isInWatchlist(id);
}

// ---------- Open movie details page ----------
function openMovieDetails(id) {
  window.location.href = 'movie.html?id=' + id;
}

// ---------- Reusable Movie Card ----------
function createMovieCard(movie) {
  var card = document.createElement('div');
  card.className = 'movie-card reveal';

  var inList = isInWatchlist(movie.id);

  card.innerHTML =
    '<div class="poster-wrap">' +
      '<img src="' + movie.poster + '" alt="' + movie.title + ' poster" loading="lazy">' +
      '<div class="poster-overlay">' +
        '<button class="btn-details" data-id="' + movie.id + '">View Details</button>' +
      '</div>' +
      '<span class="rating-badge">⭐ ' + movie.rating.toFixed(1) + '</span>' +
    '</div>' +
    '<div class="card-body">' +
      '<h3>' + movie.title + '</h3>' +
      '<p class="meta">' + movie.year + ' • ' + movie.genres.join(', ') + '</p>' +
      '<p class="desc">' + movie.description + '</p>' +
      '<div class="card-actions">' +
        '<button class="btn-small btn-details" data-id="' + movie.id + '">Details</button>' +
        '<button class="btn-small btn-watch ' + (inList ? 'added' : '') + '" data-id="' + movie.id + '">' +
          (inList ? '♥ Added' : '♡ Watchlist') +
        '</button>' +
      '</div>' +
    '</div>';

  // Details buttons
  card.querySelectorAll('.btn-details').forEach(function (b) {
    b.addEventListener('click', function () { openMovieDetails(movie.id); });
  });

  // Watchlist button
  var watchBtn = card.querySelector('.btn-watch');
  watchBtn.addEventListener('click', function () {
    var added = toggleWatchlist(movie.id);
    watchBtn.textContent = added ? '♥ Added' : '♡ Watchlist';
    watchBtn.classList.toggle('added', added);
  });

  return card;
}

// ---------- Scroll Reveal (IntersectionObserver) ----------
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

function observeReveals() {
  $$('.reveal').forEach(function (el) { revealObserver.observe(el); });
}

// ---------- Floating Hero Particles ----------
(function () {
  var box = $('#particles');
  if (!box) return;
  for (var i = 0; i < 25; i++) {
    var p = document.createElement('span');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.animationDuration = (6 + Math.random() * 8) + 's';
    p.style.width = (2 + Math.random() * 4) + 'px';
    p.style.height = p.style.width;
    box.appendChild(p);
  }
})();
