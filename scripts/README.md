# Automation & Utility Scripts (`scripts/`)

This directory contains standalone Python utility scripts used during build, asset preparation, and batch updates.

---

## Script Inventory

* `batch_update_all_episodes.py`: Updates episode book listings and custom metadata in `js/core/data.js`.
* `fetch_book_cover.py`: Queries open book APIs (Google Books, Open Library) to fetch high-resolution covers for new episodes.
* `fetch_covers.py`: Batch utility for downloading book cover images into `assets/books/`.
* `extract_images.py`: Extracts and standardizes image assets.
* `generate_perfect_loader.py`: Generates the SVG and markup for the brand curtain loader.
* `split_css.py` & `refactor_js.py`: Helper refactoring scripts used during modularization passes.

---

## Guidelines for Adding Scripts

1. **Python 3 Standard Library**: Favor using the standard library (`urllib.request`, `json`, `re`, `sys`) so scripts can run in any environment without installing extra pip packages.
2. **Deterministic Output**: Always write clean output or error logs so developers can see what was updated.
3. **Do Not Touch Production Code Blindly**: Always verify generated outputs or run `git diff` after running any automation script.
