# Episodes Page Styles (`css/pages/episodes/`)

Styles for the **Episodes Archive** (`episodes.html`) and the shared interactive 3D Book Experience Modal.

---

## File Inventory

* `episodes.css`: Master stylesheet entry point that imports the archive sub-sheets.
* `episodes_hero.css`: Editorial archive hero, title typography, and dynamic episode counter.
* `episodes_spotlight.css`: Featured spotlight episode card, mini book avatar preview stack, and badge styles.
* `episodes_controls.css`: Search input bar, topic tag filter chips, and sorting controls.
* `episodes_grid.css`: Responsive grid of episode cards with YouTube thumbnails, topic badges, and book tags.
* `episode_modal.css`: Fullscreen modal dialog for exploring an episode and listening via YouTube embed.
* `episode_books.css`: Realistic 3D rotating book engine styles (pages, spine, hardback cover lighting).

---

## Architectural Rules

1. **Shared 3D Book Engine**: `episode_books.css` and `episode_modal.css` are also included on `index.html` for homepage episode popups. Keep them backward-compatible.
2. **3D Perspective**: Any element rendering a 3D book requires a parent with `perspective: 1200px` and `transform-style: preserve-3d`.
3. **No Em Dashes**: Never use em dashes (`—`) in badges or headings.
4. **Max 500 Lines**: Keep all sub-files under 500 lines.
