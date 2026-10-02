# CSS Pages (`css/pages/`)

This directory contains stylesheets organized by sub-page. To maintain high developer ergonomics and avoid cluttered folders, each major page has its own dedicated subfolder.

---

## Directory Organization

```
css/pages/
├── books/         # Styles for Perpustakaan (books.html)
├── episodes/      # Styles for Episodes Archive & 3D Book Showcases (episodes.html)
└── coming_soon/   # Styles for Coming Soon placeholder (coming-soon.html)
```

---

## Design Pattern: Master Page Stylesheet

Each subfolder uses a master stylesheet (e.g. `books/books.css` and `episodes/episodes.css`) that imports modular sub-feature CSS files using `@import url(...)`.

This keeps individual CSS files focused and strictly below the 500-line threshold while allowing the HTML file to load just one clean entry point.

---

## Rules for Adding a New Page

1. Create a new folder: `css/pages/<page_name>/`.
2. Add a master stylesheet: `css/pages/<page_name>/<page_name>.css`.
3. Break the page into modular files:
   * `<page_name>_hero.css`
   * `<page_name>_controls.css`
   * `<page_name>_grid.css`
   * `<page_name>_modal.css`
4. Document the new folder with a localized `README.md`.
