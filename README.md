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

The backgrounds combine a local watercolor paper asset with CSS color blending: warm ivory on the invitation, burgundy on the opening and closing. The texture stays still so it does not compete with the letter animation. Generation details and the prompt are in `assets/README.md`.
