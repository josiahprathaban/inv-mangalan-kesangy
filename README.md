# Mangalan & Kesangy

A simple wedding invitation built with HTML, CSS, JavaScript, and Anime.js. No framework, package installation, or build step.

Open `index.html` directly, or serve the directory with `python -m http.server 8000` and visit http://localhost:8000.

- `index.html` — invitation wording and layout
- `styles.css` — colors, typography, responsive layout, and print styles
- `script.js` — a names-only opening with a randomized character reveal, automatic invitation reveal, and scroll animations, respecting reduced motion
- `mangalan-kesangy.ics` — downloadable calendar event, 1 November 2026 at 10:00 AM Sri Lanka time
- `vendor/` — Anime.js 4.5.0 and its MIT license
- `assets/watercolor-paper.webp` — original watercolor paper texture, used in ivory and burgundy across the invitation

The opening uses preloaded local font files in `fonts/`, shown only after loading to avoid a visible typeface swap. The rest of the invitation uses Google Fonts, with local serif and sans-serif fallbacks. Anime.js is stored locally so the invitation and its animations do not depend on a CDN. The venue link opens a Google Maps search; a confirmed map pin can replace it later.

The design uses ivory paper and burgundy type. On a fresh visit, the bold ivory letters appear in a random order with a soft pop, clearing blur, and a fading glow on a burgundy background. The reveal starts after the fonts are ready, then holds for two seconds before switching to the invitation. Character wrappers stay in place throughout the pause to prevent a change in spacing or text rendering; they are removed when the cover closes. Escape skips the opening. Direct section links and reduced-motion visitors go straight to the invitation; without JavaScript, all content is available immediately.

The character reveal uses Anime.js `splitText`, `utils.shuffle`, and `stagger(75)` in `script.js`. The `setTimeout(finishOpening, 2000)` call controls the pause after the animation completes. Future artwork can be added without changing the content structure.

The watercolor background is preserved but currently disabled. To enable it again, change `data-watercolor="off"` to `data-watercolor="on"` on the first `<html>` element in `index.html`. It restores the texture on the opening, invitation, and closing. Generation details and the prompt are in `assets/README.md`.

The opening uses a flower and leafy sprig extracted from the supplied Vecteezy SVG, with continuously looping line drawing/erasing and a gentle sway. These loops run while the cover is visible and stop when the invitation opens or motion is reduced. The automatic opening timing is unchanged. Extracted artwork is saved as `assets/opening-flower.svg` and `assets/opening-leaves.svg` and embedded in `index.html` so Anime.js can animate the paths, including when opened directly from disk. The supplied collection is unchanged.
