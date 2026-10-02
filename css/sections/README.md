# CSS Sections (`css/sections/`)

This directory contains styling for individual vertical sections of the landing page (`index.html`).

---

## File Inventory

* `hero.css`: Main landing page hero, bold editorial typography, and collage layout positioning.
* `latest_episode.css`: The featured latest YouTube episode player section, episode cards, and meta tags.
* `about.css`: Manifesto section, editorial quotes, host information, and footer structure.

---

## Rules & Best Practices

1. **Scoped Sections**: Each file corresponds to one semantic `<section>` on `index.html`.
2. **Modular Imports**: These files are bundled together inside the root `styles.css`.
3. **Footer Clearance**: The footer in `about.css` accommodates the interactive sneaky books animation widget. Maintain sufficient bottom padding (`6.5rem`) and `min-height: 180px` to prevent vertical clipping of jumping elements.

---

## What NOT to Do

* Do not leak section styles to sub-pages. If a style is used by sub-pages (like `episodes.html` or `books.html`), move it into a component in `css/components/` or a page bundle in `css/pages/`.
