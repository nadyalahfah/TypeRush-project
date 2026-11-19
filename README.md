# TypeRush

**Type faster. Think sharper.** TypeRush is a lightweight typing speed test built with plain HTML, CSS, and JavaScript. It runs entirely in your browser and stores your theme and recent results locally.

## Features

- Random English typing passages from a built-in word bank
- 15, 30, and 60 second tests with a precise, visibility-safe timer
- Live WPM, accuracy, error count, and character feedback
- Session summary and up to 20 saved results
- Personal best, average accuracy, and history management
- Dark and light themes, responsive layout, and keyboard accessible controls

## Run locally

Open `index.html` in a modern browser, or serve the folder with VS Code Live Server. The app does not need Node.js, a backend, or a network connection.

## Project structure

```text
index.html
css/style.css
js/script.js
js/words.js
assets/favicon.svg
README.md
prd.md
```

## Storage

Test history and the selected theme are stored in browser LocalStorage under `typerush_history` and `typerush_theme`. Clearing browser storage removes these preferences and results.

## Project details

TypeRush is a small frontend project built for local use and practice.
