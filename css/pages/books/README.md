# Books Page Styles (`css/pages/books/`)

Styles specifically crafted for **Perpustakaan** (`books.html`), the comprehensive library catalog of all books reviewed on The Reading Chamber podcast.

---

## File Inventory

* `books.css`: Master stylesheet entry point that imports all modular sub-sheets.
* `books_hero.css`: Editorial typography, live book count pill, and hero banner layout.
* `books_controls.css`: Search input bar, dynamic category filter pills, and sort dropdown.
* `books_grid.css`: Book card grid styling, realistic 3D book cover tilt physics, hover elevation, spine depth, and empty search state.
* `books_modal.css`: Fullscreen detailed book dossier modal, book metadata display, and episode cross-link list.

---

## Architectural Rules

1. **Modular Imports**: `books.html` loads `css/pages/books/books.css`, which cascades the rest via `@import`.
2. **Book Cover Aspect Ratio**: Book cards strictly maintain a `2:3` aspect ratio (`aspect-ratio: 2 / 3`).
3. **No Em Dashes**: Never use em dashes (`—`) in pseudo-elements or text labels.
4. **Max 500 Lines**: Keep all sub-files modular and under 500 lines.
