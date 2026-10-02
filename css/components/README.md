# CSS Components (`css/components/`)

This directory houses self-contained, reusable UI widgets and interactive delight components.

---

## File Inventory

* `sneaky_books.css`: Styles for the playful footer caravan animation where books hop across the bottom of the screen, get startled on hover, dive into hiding, and reveal the "Buka Perpustakaan" CTA pill.
* `bookshelf.css`: Styles for the 3D / illustrated bookshelf showcase widget.

---

## Rules & Best Practices

1. **Self-Contained & Encapsulated**: A component stylesheet should contain everything that component needs to render, including internal responsive rules, shadows, and hover states.
2. **Animation Bounds**: Always ensure animation zones (like `.sneaky-footer-zone`) have sufficient vertical height (`160px`) and `overflow: visible` so hopping elements don't get sliced off at their peak jump.
3. **Hardware Acceleration**: Use `transform: translate3d(...)` or `will-change: transform` on actively animating elements for 60fps rendering.

---

## What NOT to Do

* Do not style global tags (like `body`, `h1`, `a`) directly inside component files. Always use scoped class selectors (e.g. `.sbook-cover-img`, `.sbook-cta`).
* Do not exceed 500 lines per component file.
