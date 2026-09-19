# My Game Library — GitHub Pages Website

This folder is ready to publish as a **static GitHub Pages website**.

## What is included

- `index.html` — main Game Library website
- Eight game/app HTML files
- `manifest.webmanifest` — installable PWA information
- `service-worker.js` — offline/runtime caching
- `offline.html` — offline fallback page
- `404.html` — custom GitHub Pages 404 page
- `.nojekyll` — tells GitHub Pages to serve the files directly
- `icons/` — website/PWA icons

## Upload to GitHub Pages

1. Create a new GitHub repository, for example `my-game-library`.
2. **Extract this ZIP first.**
3. Upload **everything inside this folder** to the root of the repository.
   - `index.html` must be at the repository root.
4. Commit the files to the `main` branch.
5. In the repository, open **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select:
   - Branch: `main`
   - Folder: `/(root)`
8. Save.

Your site will normally be:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

All of the website links use relative paths, so the Game Library works under a repository name instead of requiring the domain root.

## Updating a game later

When you make a new game version:

1. Replace that game's `.html` file in the repository with the new file.
2. Update its version/date/update-log entry in `index.html`.
3. Commit the change.
4. GitHub Pages will publish the new version.
5. The service worker uses network-first loading for HTML, so visitors can receive the updated game and the new copy will replace the cached one after it loads successfully.

## Installable app

On compatible browsers, the website can show an **Install App** button. This installs a PWA-style shortcut/app shell while keeping the website hosted on GitHub Pages.

## Offline behavior

- The main library shell is cached.
- A local HTML game is cached after it has been opened successfully.
- `3D Hoops` uses the Three.js library from jsDelivr. The service worker caches that dependency after it is fetched once.
- `Watcher+` uses YouTube and therefore requires internet access for video playback and thumbnails.
- `Sky Flapper` currently contains its existing reference to `music.mp3`; no separate `music.mp3` was provided with the project, so that music control may not produce music until a matching file is added.

## Help email

The Help button opens a message addressed to:

`7famsains@gmail.com`
