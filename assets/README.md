# Watercolor background

`watercolor-paper.webp` is an original image generated with the built-in image generation tool and compressed for the website. It is used as a CSS background, with a light ivory overlay for the invitation and burgundy multiply blending for the opening and closing.

The watercolor is currently disabled, not removed. Set `data-watercolor="on"` on the `<html>` element in `index.html` to restore it.

`opening-flower.svg` and `opening-leaves.svg` contain selected artwork from the user-supplied `vecteezy_a-collection-of-hand-drawn-plants-leaves-and-flowers_25280558.svg`: direct child paths 3 and 11 (counting the initial background rectangle as child 0). The originals' coordinates are preserved with cropped view boxes and recolorable outlines. Inline copies in `index.html` allow Anime.js to draw the lines. The full supplied SVG is kept unchanged.

Generation prompt:

> Use case: stylized-concept. Asset type: a single flat, full-bleed watercolor paper background texture for an elegant wedding invitation website, portrait 1024 x 1536. Create ONLY a blank background texture, no invitation mockup, no writing. Warm ivory handmade cotton paper, subtle visible fine paper fibers. Organic translucent beige, champagne and muted ochre watercolor washes gathered along the outer edges and corners, especially upper right and lower left, uneven soft wet-on-wet blooms, gently feathered tide marks, tiny natural pigment granulation. The central 65 percent must remain mostly clean light ivory for readable text; diffuse pale washes may drift softly inward. Refined, airy, romantic, restrained, realistic scanned watercolor on paper. The image must reach every edge, no frame, no border, no shadows or objects, no foliage, no flowers, no line art, no lettering, no logos, no metallic foil, no watermark. It should resemble a subtle artisan wedding stationery paper wash rather than a dirty grunge texture. Base ivory approximately #f6f2e9, edge pigment warm taupe and sand approximately #c8ad8b with occasional deeper tan accents at very outer corners. Deliver one continuous texture, not multiple samples or panels.
