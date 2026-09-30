#!/usr/bin/env python3
"""
Batch fetch and update covers for all remaining episodes in Reading Chamber.
"""

import os
import re
import json
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

def clean_title(title):
    t = title
    # Remove 'karya ...'
    t = re.sub(r'\s+karya\s+.*$', '', t, flags=re.IGNORECASE)
    # Remove long explanatory notes
    t = re.sub(r',.*$', '', t)
    # Remove parenthetical subtitles if too long
    t = re.sub(r'\(.*?\)', '', t)
    # Remove leading/trailing quotes and spaces
    t = t.strip(' "\'')
    return t

def clean_author(author):
    a = author
    # Remove notes like 'koleksi perpustakaan', 'sebagai kerangka...', 'perbandingan...'
    if any(k in a.lower() for k in ['koleksi', 'sebagai', 'perbandingan', 'mitologi', 'elite dynamics', 'institutional rise']):
        return ''
    a = re.sub(r'\(.*?\)', '', a)
    return a.strip(' "\'')

def get_average_color(image_path):
    try:
        img = Image.open(image_path).convert('RGB').resize((10, 10))
        try:
            pixels = list(img.get_flattened_data())
            rgb_tuples = [pixels[i:i+3] for i in range(0, len(pixels), 3)]
        except AttributeError:
            rgb_tuples = list(img.getdata())
        r = sum(p[0] for p in rgb_tuples) // len(rgb_tuples)
        g = sum(p[1] for p in rgb_tuples) // len(rgb_tuples)
        b = sum(p[2] for p in rgb_tuples) // len(rgb_tuples)
        return f"#{r:02x}{g:02x}{b:02x}"
    except Exception:
        return "#2b5034"

def search_open_library(query):
    try:
        url = f"https://openlibrary.org/search.json?q={urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'ReadingChamber/1.0 (tama@example.com)'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            for doc in data.get('docs', [])[:5]:
                if doc.get('cover_i'):
                    return f"https://covers.openlibrary.org/b/id/{doc['cover_i']}-L.jpg"
    except Exception:
        pass
    return None

def download_image(url, dest_path):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            content = resp.read()
            if len(content) < 1000:
                return False
            with open(dest_path, 'wb') as f:
                f.write(content)
            return True
    except Exception:
        return False

def make_safe_filename(ep_id, index, title):
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', title.lower()).strip('-')[:30]
    return f"assets/books/ep-{ep_id}-{index:02d}-{slug}.jpg"

def process_book(item):
    ep_id, index, raw_title, raw_author = item
    cleaned_t = clean_title(raw_title)
    cleaned_a = clean_author(raw_author)

    dest_file = make_safe_filename(ep_id, index, cleaned_t)

    # 1. Search Open Library with clean title + author
    query = f"{cleaned_t} {cleaned_a}".strip()
    cover_url = search_open_library(query)

    # 2. If not found, try title alone
    if not cover_url and cleaned_a:
        cover_url = search_open_library(cleaned_t)

    if cover_url and download_image(cover_url, dest_file):
        color = get_average_color(dest_file)
        return (ep_id, index, dest_file, color, True, f"Found via Open Library: {cleaned_t}")

    return (ep_id, index, None, None, False, f"Not found via Open Library: '{cleaned_t}' ('{query}')")

def main():
    os.makedirs('assets/books', exist_ok=True)

    with open('js/core/data.js', 'r') as f:
        text = f.read()

    match = re.search(r'export const episodeData =\s*(\{[\s\S]*\});?\s*$', text)
    if not match:
        print("Could not parse data.js")
        return

    data = json.loads(match.group(1).rstrip(';'))

    tasks = []
    for ep_id, ep in data.items():
        if not ep.get('books'):
            continue
        for i, b in enumerate(ep['books']):
            if not b.get('coverImage') or b['coverImage'].strip() == '':
                tasks.append((ep_id, i, b.get('title', ''), b.get('author', '')))

    print(f"Total books to process: {len(tasks)}")

    results = []
    with ThreadPoolExecutor(max_workers=6) as executor:
        for res in executor.map(process_book, tasks):
            results.append(res)
            status = "✓" if res[4] else "✗"
            print(f"[{status}] {res[0]} #{res[1]}: {res[5]}")

    success_count = 0
    for ep_id, idx, dest_file, color, ok, _ in results:
        if ok:
            data[ep_id]['books'][idx]['coverImage'] = dest_file
            data[ep_id]['books'][idx]['coverColor'] = color
            success_count += 1

    # Save back to data.js
    new_js = "export const episodeData = " + json.dumps(data, indent=4, ensure_ascii=False) + ";\n"
    with open('js/core/data.js', 'w') as f:
        f.write(new_js)

    print(f"\nCompleted: {success_count}/{len(tasks)} covers updated in data.js!")

if __name__ == "__main__":
    main()
