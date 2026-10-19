#!/usr/bin/env python3
"""
Comprehensive Book Cover Discovery and Updater for The Reading Chamber.
Iterates through all episode chunks in js/data/, searches Open Library for verified covers,
downloads high-res images to assets/books/, computes dominant colors, and updates the chunk files.
"""

import os
import re
import json
import time
import urllib.request
import urllib.parse
from difflib import SequenceMatcher
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

ELEGANT_FALLBACK_COLORS = [
    "#1a2634", "#2c3e50", "#1e372f", "#3e2723",
    "#263238", "#37474f", "#1a237e", "#311b92",
    "#4a148c", "#880e4f", "#b71c1c", "#e65100"
]

def clean_title(title):
    t = title
    t = re.sub(r'\s+karya\s+.*$', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\(Penerjemah.*?\)', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\(Pengantar.*?\)', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\(Editor.*?\)', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\(Jilid.*?\)', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\(Buku.*?\)', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\(Terjemahan.*?\)', '', t, flags=re.IGNORECASE)
    t = re.sub(r'[\"\'“”‘’]', '', t)
    return t.strip()

def clean_author(author):
    if not author:
        return ''
    a = author
    # Generic placeholders used by archive
    generic_words = [
        'koleksi', 'sebagai', 'perbandingan', 'mitologi', 'elite dynamics',
        'institutional rise', 'reading chamber', 'archive', 'penerjemah',
        'pengantar', 'editor', 'unknown'
    ]
    if any(k in a.lower() for k in generic_words):
        return ''
    a = re.sub(r'[\"\'“”‘’]', '', a)
    return a.strip()

def title_similarity(clean_t, doc_t):
    if not clean_t or not doc_t:
        return 0.0
    t1 = re.sub(r'[^a-zA-Z0-9\s]', '', clean_t.lower()).strip()
    t2 = re.sub(r'[^a-zA-Z0-9\s]', '', doc_t.lower()).strip()
    
    # Exact or substring containment
    if t1 == t2 or t1 in t2 or t2 in t1:
        return 1.0
        
    words1 = set(t1.split())
    words2 = set(t2.split())
    if not words1 or not words2:
        return 0.0
        
    overlap = len(words1 & words2) / max(len(words1), len(words2))
    seq_ratio = SequenceMatcher(None, t1, t2).ratio()
    return max(overlap, seq_ratio)

def get_dominant_color(image_path):
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
        return "#1e293b"

def download_and_verify(url, dest_path, min_w=200, min_h=280):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (ReadingChamber/2.0)'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read()
            if len(content) < 1500: # 1x1 GIF is ~43 bytes
                return False
            
            temp_path = dest_path + '.tmp'
            with open(temp_path, 'wb') as f:
                f.write(content)
                
            try:
                im = Image.open(temp_path)
                w, h = im.size
                if w < min_w or h < min_h:
                    os.remove(temp_path)
                    return False
            except Exception:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                return False
                
            os.replace(temp_path, dest_path)
            return True
    except Exception:
        return False

def search_open_library_for_book(title, author):
    c_title = clean_title(title)
    c_author = clean_author(author)
    
    queries = []
    if c_author:
        queries.append(f"{c_title} {c_author}")
    queries.append(c_title)
    if ':' in c_title:
        queries.append(c_title.split(':')[0].strip())
    if '–' in c_title:
        queries.append(c_title.split('–')[0].strip())
    if '-' in c_title:
        queries.append(c_title.split('-')[0].strip())
        
    seen = set()
    for q in queries:
        q = q.strip()
        if not q or q.lower() in seen:
            continue
        seen.add(q.lower())
        
        encoded_q = urllib.parse.quote(q)
        url = f"https://openlibrary.org/search.json?q={encoded_q}&limit=5"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'ReadingChamberCoverBot/1.0 (contact@readingchamber.id)'})
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode())
                docs = data.get('docs', [])
                
                for doc in docs:
                    doc_title = doc.get('title', '')
                    sim = title_similarity(c_title, doc_title)
                    if sim < 0.55:
                        continue
                        
                    # Candidate 1: cover_i
                    if doc.get('cover_i'):
                        return f"https://covers.openlibrary.org/b/id/{doc['cover_i']}-L.jpg", doc_title
                        
                    # Candidate 2: isbn
                    isbns = doc.get('isbn', [])
                    for isbn in isbns[:3]:
                        return f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg", doc_title
                        
                    # Candidate 3: cover_edition_key
                    if doc.get('cover_edition_key'):
                        return f"https://covers.openlibrary.org/b/olid/{doc['cover_edition_key']}-L.jpg", doc_title
        except Exception:
            pass
        time.sleep(0.3)
        
    return None, None

def make_filename(ep_id, index, title):
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', title.lower()).strip('-')[:35]
    return f"assets/books/ep-{ep_id}-{index:02d}-{slug}.jpg"

def process_book_task(task):
    chunk_file, ep_id, index, book = task
    title = book.get('title', '')
    author = book.get('author', '')
    existing_cover = book.get('coverImage', '')
    
    # Check if existing cover is already good
    needs_upgrade = False
    if not existing_cover or not os.path.exists(existing_cover):
        needs_upgrade = True
    else:
        try:
            im = Image.open(existing_cover)
            if im.size[0] < 300 or im.size[1] < 400:
                needs_upgrade = True
        except Exception:
            needs_upgrade = True
            
    if not needs_upgrade:
        return {
            'status': 'ALREADY_OK',
            'ep_id': ep_id,
            'index': index,
            'title': title,
            'author': author,
            'coverImage': existing_cover,
            'coverColor': book.get('coverColor', '#1a2634')
        }
        
    c_title = clean_title(title)
    dest_path = make_filename(ep_id, index, c_title)
    
    cover_url, matched_title = search_open_library_for_book(title, author)
    if cover_url:
        if download_and_verify(cover_url, dest_path, min_w=200, min_h=280):
            color = get_dominant_color(dest_path)
            return {
                'status': 'DOWNLOADED',
                'ep_id': ep_id,
                'index': index,
                'title': title,
                'author': author,
                'coverImage': dest_path,
                'coverColor': color,
                'source': cover_url,
                'matched_title': matched_title
            }
            
    return {
        'status': 'NOT_FOUND',
        'ep_id': ep_id,
        'index': index,
        'title': title,
        'author': author,
        'suggested_path': dest_path
    }

def main():
    os.makedirs('assets/books', exist_ok=True)
    os.makedirs('scripts/cache', exist_ok=True)
    
    chunk_files = sorted([f"js/data/episodes_chunk{i}.js" for i in range(1, 6)])
    all_tasks = []
    chunk_data = {}
    
    for cfile in chunk_files:
        with open(cfile, 'r', encoding='utf-8') as f:
            content = f.read()
            
        m = re.search(r'export const (\w+)\s*=\s*(\{[\s\S]*\});?\s*$', content)
        if not m:
            print(f"Error parsing {cfile}")
            continue
            
        var_name = m.group(1)
        data = json.loads(m.group(2).rstrip(';'))
        chunk_data[cfile] = (var_name, data)
        
        for ep_id, ep_info in data.items():
            books = ep_info.get('books', [])
            for idx, b in enumerate(books):
                all_tasks.append((cfile, ep_id, idx, b))
                
    print(f"[*] Total books to inspect across 5 chunks: {len(all_tasks)}")
    
    # Process tasks with limited concurrency to be gentle to Open Library
    results = []
    with ThreadPoolExecutor(max_workers=3) as executor:
        for idx, res in enumerate(executor.map(process_book_task, all_tasks)):
            results.append(res)
            st = res['status']
            if st == 'DOWNLOADED':
                print(f"[{idx+1}/{len(all_tasks)}] [✓ FOUND] {res['title']} -> {res['coverImage']}")
            elif st == 'ALREADY_OK':
                print(f"[{idx+1}/{len(all_tasks)}] [- OK]    {res['title']}")
            else:
                print(f"[{idx+1}/{len(all_tasks)}] [✗ MISS]  {res['title']} (by {res.get('author', 'Unknown')})")
                
    # Update chunk_data
    updated_count = 0
    not_found_list = []
    
    for res in results:
        ep_id = res['ep_id']
        idx = res['index']
        st = res['status']
        
        # Find which chunk
        for cfile, (var_name, data) in chunk_data.items():
            if ep_id in data and idx < len(data[ep_id].get('books', [])):
                if st == 'DOWNLOADED':
                    data[ep_id]['books'][idx]['coverImage'] = res['coverImage']
                    data[ep_id]['books'][idx]['coverColor'] = res['coverColor']
                    updated_count += 1
                elif st == 'NOT_FOUND':
                    not_found_list.append(res)
                break
                
    # Write back updated chunks
    for cfile, (var_name, data) in chunk_data.items():
        code = f"/* ==========================================================================\n" \
               f"   Episode Data Chunk: {var_name}\n" \
               f"   ========================================================================== */\n\n" \
               f"export const {var_name} = " + json.dumps(data, indent=4, ensure_ascii=False) + ";\n"
        with open(cfile, 'w', encoding='utf-8') as f:
            f.write(code)
        print(f"[+] Saved updated {cfile}")
        
    # Save audit report
    with open('scripts/cache/unmatched_books.json', 'w', encoding='utf-8') as f:
        json.dump(not_found_list, f, indent=2, ensure_ascii=False)
        
    print(f"\n==========================================")
    print(f"Summary:")
    print(f" - Newly downloaded & verified covers: {updated_count}")
    print(f" - Books already with high-res covers: {sum(1 for r in results if r['status'] == 'ALREADY_OK')}")
    print(f" - Books needing manual covers:        {len(not_found_list)}")
    print(f"Detailed manual list saved to: scripts/cache/unmatched_books.json")
    print(f"==========================================")

if __name__ == '__main__':
    main()
