# Book Cover Discovery & Curation Guide

A guide for finding, downloading, and standardizing high-res book covers for **The Reading Chamber** 3D showcase.

---

## 1. Quick Summary of the 3D Stage Specs

Our 3D book engine in `css/pages/episodes/episode_books.css` and `js/features/book_showcase.js` expects:

* **Aspect Ratio:** `2:3` (Width 250px x Height 375px in CSS)
* **Image Dimensions:** Ideal is **600 x 900 px** or **800 x 1200 px** (retina crisp, ~50 KB to 300 KB).
* **Format:** Flat front cover only (no 3D angled mockups, desk shadows, or slanted spine shots). The CSS creates the 3D geometry and rotation.
* **Storage Location:** `assets/books/`
* **Config Location:** `js/core/data.js`

---

## 2. The 3-Tier Pipeline Method

When you have a book title and author, don't rely on live API calls in the browser (they hit rate limits and cause slow page loads). Instead, use this 3-tier lookup method:

```
[Book Title & Author]
         │
         ▼
  Tier 1: Open Library API (Best for international/English books)
         │  Found? ── Yes ──► Download `-L.jpg`
         │  No
         ▼
  Tier 2: ISBN Lookup
         │  Found? ── Yes ──► Check byte size (> 1KB) & download
         │  No
         ▼
  Tier 3: Local Publisher CDNs (Gramedia / Mizan for Indonesian books)
            ──► Scrape direct CDN asset (650×1000px)
```

---

### Tier 1: Open Library Search API
* **Why it's great:** 100% free, no API keys, and no aggressive 429 rate limits like Google Books.
* **API Endpoint:**
  ```bash
  curl -s "https://openlibrary.org/search.json?q=On+Giving+Up+Adam+Phillips"
  ```
* **How to extract the image:**
  1. Inspect the JSON response under `docs[0].cover_i`.
  2. If a `cover_i` exists (e.g. `15164013`), the high-res cover URL is:
     ```
     https://covers.openlibrary.org/b/id/15164013-L.jpg
     ```
  *(The `-L` suffix stands for Large).*

---

### Tier 2: The ISBN Lookup Fallback
* When title searches have typos or too many translations, search by the book's 13-digit ISBN:
  ```
  https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg
  ```
* **Gotcha to watch out for:** If Open Library doesn't have a cover for that ISBN, it doesn't give a 404. Instead, it returns a 43-byte transparent 1×1 GIF. Always check if the file size is greater than 1,000 bytes before saving it.

---

### Tier 3: Local Publisher CDNs (For Indonesian Books)
Global APIs (Google Books, Open Library) frequently have missing or blurry low-res scans for Indonesian books (like Okki Sutanto, Goenawan Mohamad, Marie Muhammad, etc.).

For local Indonesian titles, grab directly from verified bookstore/publisher CDNs:

1. **Gramedia CDN:**
   * High-res portrait covers are usually hosted at:
     ```
     https://cdn.gramedia.com/uploads/products/{product_hash}.jpg
     ```
   * Resolution is typically **650 × 1006 px** (perfect 2:3 ratio).
2. **Mizan / Expose CDN:**
   * Hosted at:
     ```
     https://static.mizanstore.com/d/img/book/cover/...
     https://static.mizanmu.id/d/img/book/cover/...
     ```

---

## 3. Extracting the Dominant Color for 3D Spine & Ambient Glow

In `js/core/data.js`, each book has a `coverColor` field. This color is used by `BookShowcase` to:
1. Tint the ambient glowing aura behind the book (`radial-gradient`).
2. Tint the paper edges and spine bevel so the book feels like a physical object.

You can calculate this with a quick 3-line Python snippet:

```python
from PIL import Image

img = Image.open('assets/books/my-book.jpg').convert('RGB').resize((10, 10))
pixels = list(img.getdata())
r = sum(p[0] for p in pixels) // len(pixels)
g = sum(p[1] for p in pixels) // len(pixels)
b = sum(p[2] for p in pixels) // len(pixels)
print(f'coverColor: "#{r:02x}{g:02x}{b:02x}"')
```

---

## 4. Helper Script

A command-line script is provided at `scripts/fetch_book_cover.py`:

```bash
# Usage:
python3 scripts/fetch_book_cover.py "Book Title" "Author Name" [output_filename]

# Example:
python3 scripts/fetch_book_cover.py "The Dictator's Handbook" "Bruce Bueno de Mesquita" assets/books/dictators-handbook.jpg
```
