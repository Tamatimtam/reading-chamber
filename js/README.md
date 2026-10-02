# JavaScript Architecture & Guidelines

Welcome to the JavaScript layer of **The Reading Chamber**! This application uses clean, modern ES Modules with GSAP and Lenis for cinematic smooth scrolling and micro-animations.

---

## Folder Structure

```
js/
├── core/         # Core application bootstrap & central database
│   ├── main.js   # Global orchestrator (Lenis scroll, nav behavior)
│   └── data.js   # Central repository of episodes, books, and hosts
├── features/     # Reusable feature engines
│   ├── animations.js    # GSAP scroll animations & sneaky footer books
│   ├── book_showcase.js # 3D book cover interaction engine
│   ├── episode.js       # Episode modal controller & audio/video state
│   └── youtube.js       # YouTube RSS feed fetcher & cache fallback
└── pages/        # Standalone application controllers for sub-pages
    ├── books_page.js      # Perpustakaan main app controller
    ├── books_data.js      # Book catalog extraction & category indexer
    ├── books_renderer.js  # DOM rendering for book cards and modal
    ├── episodes_page.js     # Archive main app controller
    ├── episodes_data.js     # Episode dataset builder & YouTube updater
    └── episodes_renderer.js # DOM rendering for episode cards and spotlight
```

---

## Core Developer Rules

1. **Max 500 Lines Per File**: Strictly enforce modular design. Keep files below 500 lines for readability and maintainability.
2. **ES Modules (`import` / `export`)**: Use native browser modules. All `<script>` tags for page controllers must have `type="module"`.
3. **No Em Dashes**: Never use em dashes (`—`) in user-facing strings or console logs.
4. **Resilient Fallbacks**: Never assume external network requests (like YouTube RSS) will succeed. Always provide robust local fallback data so the app remains 100% functional offline.
5. **No Browser Testing Via Chrome/Agent**: In accordance with project rules, run all verification via node CLI (`node --check <file>`) or curl.

---

## How to Add a Feature

* For site-wide animations or interactions, add methods to `js/features/animations.js`.
* For new data entries (new books or episodes), add them directly to `js/core/data.js`.
* For new standalone pages, create a dedicated page controller in `js/pages/<page_name>_page.js`.
