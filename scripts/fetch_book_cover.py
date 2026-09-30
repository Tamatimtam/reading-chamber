#!/usr/bin/env python3
"""
Book Cover Fetcher & Color Extractor for The Reading Chamber.
Usage:
    python3 scripts/fetch_book_cover.py "Book Title" "Author Name" [output_path]
"""

import sys
import os
import json
import urllib.request
import urllib.parse
from PIL import Image

def get_average_color(image_path):
    try:
        img = Image.open(image_path).convert('RGB').resize((10, 10))
        # Use getdata or get_flattened_data
        try:
            pixels = list(img.get_flattened_data())
            # grouped into triplets
            rgb_tuples = [pixels[i:i+3] for i in range(0, len(pixels), 3)]
        except AttributeError:
            rgb_tuples = list(img.getdata())
            
        r = sum(p[0] for p in rgb_tuples) // len(rgb_tuples)
        g = sum(p[1] for p in rgb_tuples) // len(rgb_tuples)
        b = sum(p[2] for p in rgb_tuples) // len(rgb_tuples)
        return f"#{r:02x}{g:02x}{b:02x}"
    except Exception as e:
        return "#2b5034"

def search_open_library(query):
    url = f"https://openlibrary.org/search.json?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'ReadingChamber/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            for doc in data.get('docs', [])[:5]:
                if 'cover_i' in doc and doc['cover_i']:
                    cover_id = doc['cover_i']
                    return f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
    except Exception as e:
        print(f"[!] Open Library query failed: {e}")
    return None

def download_cover(image_url, dest_path):
    req = urllib.request.Request(image_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp, open(dest_path, 'wb') as f:
        content = resp.read()
        if len(content) < 1000:
            return False
        f.write(content)
    return True

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/fetch_book_cover.py \"<Title>\" \"<Author>\" [output_path]")
        sys.exit(1)

    title = sys.argv[1]
    author = sys.argv[2] if len(sys.argv) > 2 else ""
    query = f"{title} {author}".strip()

    # Generate safe filename if not specified
    if len(sys.argv) > 3:
        dest_path = sys.argv[3]
    else:
        safe_name = "".join(c if c.isalnum() else "-" for c in title.lower())
        safe_name = "-".join(filter(None, safe_name.split("-")))[:40]
        dest_path = f"assets/books/{safe_name}.jpg"

    os.makedirs(os.path.dirname(dest_path) or '.', exist_ok=True)

    print(f"[*] Searching for: '{query}'...")
    cover_url = search_open_library(query)

    if not cover_url:
        print(f"[!] No direct cover ID found on Open Library for '{query}'.")
        print(f"    Tip: If this is an Indonesian title, check Gramedia.com or Mizanstore.")
        sys.exit(1)

    print(f"[+] Found cover URL: {cover_url}")
    print(f"[*] Downloading to: {dest_path}...")
    success = download_cover(cover_url, dest_path)

    if not success:
        print("[!] Downloaded file was invalid or empty placeholder.")
        sys.exit(1)

    color = get_average_color(dest_path)
    img = Image.open(dest_path)
    print("\n--- DONE! ---")
    print(f"File Saved:  {dest_path} ({img.size[0]}x{img.size[1]}px)")
    print(f"Dominant Hex: {color}")
    print("\nPaste into data.js:")
    print(f'    "coverColor": "{color}",')
    print(f'    "coverImage": "{dest_path}"')

if __name__ == "__main__":
    main()
