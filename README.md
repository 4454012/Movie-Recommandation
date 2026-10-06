# 🎬 CineMatch

**Discover Your Next Favorite Movie.**

CineMatch is a movie recommendation website built with plain HTML5, CSS3, and vanilla JavaScript — no frameworks, no backend, no database. It is designed as a B.Tech college project that looks like a real movie platform.

## Features

- 🏠 Home page with cinematic hero, trending movies, genres
- 🔎 Discover page with live search, genre/rating/year filters and sorting
- 🎞 Movie details page with cast, info, similar movies, trailer modal
- ✨ Recommendation engine (genre + mood + rating scored by JavaScript logic)
- ❤️ Watchlist saved in `localStorage`
- 🌙 Dark / Light theme toggle (saved in `localStorage`)
- 🔔 Toast notifications
- ⏳ Loading screen, scroll reveal, back-to-top button
- 📱 Fully responsive (desktop, tablet, mobile)

## Tech Stack

| Technology   | Used For |
| ------------ | -------- |
| HTML5        | Structure, pages, cards, modals |
| CSS3         | Styling, responsive design, animations, themes |
| JavaScript   | Search, filters, sorting, recommendations, watchlist, localStorage, dynamic rendering |

## How to Run

1. Open the project folder.
2. Double-click `index.html` (or open it in any browser).
3. No server or installation needed.

## Recommendation Algorithm

Each movie stores `genres` and `moods`. When the user picks a genre, a mood and a minimum rating, the app scores every movie:

- Genre match → **+5**
- Mood match → **+4**
- Rating ≥ selected minimum → **+3**
- Released after 2020 → **+1**

Movies are sorted by score and the top 8 are shown, each with a "Why we recommend this" explanation.

## Folder Structure

```
CineMatch/
├── index.html
├── discover.html
├── recommendations.html
├── movie.html
├── watchlist.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
├── js/
│   ├── movies.js
│   ├── app.js
│   ├── discover.js
│   ├── recommendations.js
│   ├── movie-details.js
│   └── watchlist.js
└── README.md
```

© 2026 CineMatch. College Project.
