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

The design uses ivory paper and burgundy type. On a fresh visit, the bold ivory letters appear in a random order with a soft pop, clearing blur, and a fading glow on a burgundy background. After the fonts load, the background plants draw in completely before the randomized letter reveal starts. The finished names then hold for two seconds before the opening lifts away and the invitation slides upward beneath it in a synchronized 1.5-second theater-style transition. Character wrappers stay in place throughout the pause to prevent a change in spacing or text rendering; they are removed when the cover closes. Escape skips the opening. Direct section links and reduced-motion visitors go straight to the invitation; without JavaScript, all content is available immediately.

The character reveal uses Anime.js `splitText`, `utils.shuffle`, and `stagger(75)` in `script.js`. The `setTimeout(finishOpening, 2000)` call controls the pause after the animation completes. Future artwork can be added without changing the content structure.

The watercolor background is preserved but currently disabled. To enable it again, change `data-watercolor="off"` to `data-watercolor="on"` on the first `<html>` element in `index.html`. It restores the texture on the opening, invitation, and closing. Generation details and the prompt are in `assets/README.md`.

The opening preserves two foreground flower sprigs at the top and bottom, currently hidden. To restore them, change `data-foreground-flowers="off"` to `data-foreground-flowers="on"` on the `<html>` element in `index.html`. The visible background is a sharp, faint dark-magenta meadow of individual flowers and leaves along the bottom edge (10% opacity on all screens, no blur). The top and bottom stem tips tuck slightly beyond the viewport edges. Both foreground and background artwork enter through stroke-following SVG reveal masks over 3.2–4 seconds per motif, with smooth sine easing and a slight stagger, then remain drawn. Each background stem sways independently with a randomized direction, angle, speed, and delay. The foreground keeps its gentle sway. The original filled pen strokes are rendered without an added outline, avoiding double contours. These loops run while the cover is visible and stop when the invitation opens or motion is reduced. The opening waits for the plant drawing to finish, then reveals the names and pauses before the vertical curtain transition. Extracted artwork is saved as `assets/opening-flower.svg` and `assets/opening-leaves.svg` and embedded in `index.html` so Anime.js can animate the paths, including when opened directly from disk. The supplied collection is unchanged.

Background plants are enlarged on desktop. Tablet screens show six spread-out stems, and mobile shows three larger stems at 0%, 50%, and 100%, preserving their aspect ratios and spacing. Hidden plants do not run sway animations.

The curtain transition uses an Anime.js timeline in `finishOpening`. It keeps scrolling and invitation links locked until both pages settle, then removes temporary transforms. Escape skips directly to the invitation; reduced-motion visitors bypass the opening and transition.

The upper opening background has two central hand-drawn hearts fixed at 15% opacity and eight neatly spaced smaller hearts with randomized sizes and 5-10% opacity. Anime.js draws the heart outlines and pulses each heart gently with independent timing; the flowers-finish-before-text sequence is preserved. All heart animations stop when the opening closes.
