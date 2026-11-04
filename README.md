# Counter-Strike 2 embeddings viewer

An archived 2024 visualization by [Programming with Julius](https://www.youtube.com/@ProgrammingWithJulius).

**[Open the viewer](https://programming-with-julius.github.io/cs2-embeddings-viewer/)**

Explore the UMAP embeddings of two neural networks trained to predict the in-game location from Counter-Strike 2 screenshots. The multihead model also predicts the map. Each visualization displays 10,000 screenshot sprites in a 3D embedding space.

## Using the viewer

- Choose the default or multihead model on the home page.
- Click inside the visualization to capture the mouse.
- Use WASD and the mouse to move; hold Shift to move slowly.
- Press Esc to release the mouse, or F to toggle fullscreen.

A desktop browser with WebGL is recommended. Each model downloads about 91 MB of images and coordinates on its first load. Loading and rendering thousands of images can take time.

## Archive

The historical static-site commits retain their original author and committer dates, from August through October 2024. Their author and committer identities have been normalized to the channel account. The GitHub Pages setup was added in November 2026.

This repository preserves the static assets and the two published embeddings visualizations. It does not include the original experimental server application or its quiz/account features. The viewer is preserved as an archive, without ongoing feature development.

## Hosting

The website lives in `site/` and requires no application server or build step. GitHub Actions publishes that directory to GitHub Pages. Internal links and assets are relative, so the site works at its project URL.

For a local preview, run `python -m http.server --directory site` and open `http://localhost:8000`.

Three.js and its controls are loaded from public CDNs. Third-party assets retain their existing notices.
