# CSS Architecture & Guidelines

Welcome to the styling layer of **The Reading Chamber**! This directory houses all stylesheets for the application, designed with a modular vanilla CSS architecture.

---

## Folder Structure

```
css/
├── core/            # Global variables, typography, resets, utility classes
├── layout/          # Global layout scaffolding (navigation, loaders)
├── sections/        # Homepage section styles (hero, latest episode, about)
├── components/      # Reusable standalone UI widgets (bookshelf, sneaky books)
└── pages/           # Dedicated styles for individual sub-pages
    ├── books/       # /books.html Perpustakaan library styles
    ├── episodes/    # /episodes.html Episode archive & 3D book modal styles
    └── coming_soon/ # /coming-soon.html Placeholder page styles
```

---

## Golden Rules for CSS

1. **Max 500 Lines Per File**: If a CSS file approaches 400 to 500 lines, split it into a logical sub-component or feature file.
2. **Vanilla CSS Only**: No Tailwind, SCSS, or CSS-in-JS. We rely on clean, native CSS custom properties (`var(--primary)`, `var(--bg-black)`, etc.).
3. **No Em Dashes**: Never use em dashes (`—`) in comments or generated content. Use standard dashes (`-`) or colons.
4. **Rich Aesthetics & Performance**: Prioritize smooth GPU-accelerated transforms (`transform`, `opacity`) instead of animating layout triggers (`top`, `margin`, `width`).
5. **Scoped Class Naming**: Prefix classes logically to prevent collisions (e.g., `.sbook-` for sneaky books, `.ep-` for episodes, `.bcard-` for book library cards).

---

## How to Add New Styles

1. **New Homepage Section**: Add a stylesheet in `css/sections/your_section.css` and import it in `styles.css`.
2. **New Standalone Component**: Add it in `css/components/your_component.css`.
3. **New Page**: Create a new subfolder in `css/pages/<page_name>/` with a master stylesheet that imports modular chunk files.

---

## What NOT to Do

* Do not write inline CSS in HTML tags.
* Do not hardcode arbitrary hex colors; use the color tokens defined in `css/core/base.css`.
* Do not set `overflow: hidden` on parent containers that wrap jumping or rotating 3D animations without checking clipping bounds.
