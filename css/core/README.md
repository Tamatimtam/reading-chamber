# CSS Core (`css/core/`)

This directory contains foundational design tokens, CSS variables, CSS resets, and global base styles used across the entire site.

---

## File Inventory

* `base.css`: Defines the global `:root` design tokens (colors, font families, transitions), typography styles, base body rules, and utility classes.

---

## Design Tokens Reference (`:root`)

* `--bg-black`: `#0a0a0a` (Deep dark background)
* `--paper-cream`: `#f4f1ea` (Editorial warm white / cream)
* `--gold-accent`: `#c99e32` (Gold highlight)
* `--yellow-accent`: `#f5c518` (Vibrant yellow accent)
* `--font-display`: `'Cinzel Decorative', serif` (Dramatic headline serif)
* `--font-serif`: `'Playfair Display', serif` (Editorial body serif)
* `--font-sans`: `'Inter', sans-serif` (Clean modern UI sans-serif)

---

## Contribution Rules

* **Single Source of Truth**: Any new global design tokens (colors, spacings, border radii, shadows) MUST be added here in `base.css`.
* **Zero Component Logic**: Do not add page-specific or component-specific layout rules here. Keep this strictly for site-wide defaults.
* **Keep under 500 lines**: Keep `base.css` lean and focused on foundational tokens.
