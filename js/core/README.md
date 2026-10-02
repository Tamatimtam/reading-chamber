# JavaScript Core (`js/core/`)

This directory contains application foundation modules and the single source of truth for all content data.

---

## File Inventory

* `main.js`: Initializes global smooth scrolling via Lenis, handles mobile navigation menus, and orchestrates global scroll listeners.
* `data.js`: The central content database containing:
  * `episodeData`: Map of YouTube video IDs to rich metadata (titles, descriptions, quotes, and array of referenced books).
  * Host bios, social links, and podcast details.

---

## Rules & Best Practices

1. **Keep Data Normalized**: When adding a book to `episodeData` in `data.js`, provide `title`, `author`, `coverImage`, `description`, and `themes`.
2. **Path Integrity**: All image paths in `data.js` should be relative to the root (e.g. `assets/books/odyssey.jpg`).
3. **No Direct DOM Mutation in Data**: `data.js` is strictly a pure data store and must never touch the DOM or window object.
