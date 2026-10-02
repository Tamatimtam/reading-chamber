# JavaScript Pages (`js/pages/`)

This directory contains dedicated page controllers and renderers for multi-page routing. Each page is split into three clean layers: **Controller**, **Data Layer**, and **DOM Renderer**.

---

## 3-Layer Pattern

For any complex page, separate concerns across three files:

```
js/pages/
├── <page>_page.js      # 1. Controller: State, user events, lifecycle, GSAP entrance
├── <page>_data.js      # 2. Data Layer: Data transformation, sorting, filtering logic
└── <page>_renderer.js  # 3. DOM Renderer: Pure HTML templating and DOM injection
```

---

## Current Page Modules

### 1. Books Library (`books.html`)
* `books_page.js`: Controller managing category filter state, search queries, sort orders, and modal opening.
* `books_data.js`: Extracted catalog of all unique books across all episodes, categorized by tags.
* `books_renderer.js`: Builds the book cards, category pill buttons, and detailed modal views.

### 2. Episodes Archive (`episodes.html`)
* `episodes_page.js`: Controller managing search queries, tag filtering, and spotlight cards.
* `episodes_data.js`: Assembles archive episodes and handles live YouTube background sync.
* `episodes_renderer.js`: Renders the spotlight featured episode card and archive card grid.

---

## Rules & Best Practices

1. **Keep Controllers Lean**: Do not hardcode HTML templates inside `_page.js` files; delegate HTML markup to `_renderer.js`.
2. **Never Exceed 500 Lines**: Keep all files modular and well under the 500-line limit.
3. **No Em Dashes**: Never use em dashes (`—`) in generated strings.
