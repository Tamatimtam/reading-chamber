#!/usr/bin/env python3
"""
Phase 2 Book Cover Discovery & Deduplication for The Reading Chamber.
1. Reuses existing high-res covers across episodes for identical/similar book titles.
2. Performs subtitle-split + author-verified searches on Open Library for remaining books.
3. Updates episode chunks in js/data/ and outputs a final clear list of any remaining books.
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

def download_and_verify(url, dest_path, min_w=180, min_h=250):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (ReadingChamber/2.0)'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read()
            if len(content) < 1500:
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

def clean_title(title):
    t = title.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    t = re.sub(r'\s+karya\s+.*$', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\(Penerjemah.*?\)', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\(Pengantar.*?\)', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\(Editor.*?\)', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\(Jilid.*?\)', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\(Buku.*?\)', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\(Terjemahan.*?\)', '', t, flags=re.IGNORECASE)
    return t.strip(' "\'')

def clean_author(author):
    if not author: return ''
    a = author.replace('’', "'").replace('‘', "'")
    generic = ['koleksi', 'sebagai', 'perbandingan', 'mitologi', 'elite dynamics', 'institutional rise', 'archive', 'penerjemah', 'pengantar', 'editor', 'unknown']
    if any(k in a.lower() for k in generic):
        return ''
    return a.strip(' "\'')

def search_phase2(title, author):
    c_title = clean_title(title)
    c_author = clean_author(author)
    
    queries = []
    # If title has subtitle with colon or hyphen
    main_title = c_title.split(':')[0].strip() if ':' in c_title else (c_title.split('–')[0].strip() if '–' in c_title else c_title.split(' - ')[0].strip())
    
    if c_author:
        queries.append(f"{c_title} {c_author}")
        if main_title != c_title:
            queries.append(f"{main_title} {c_author}")
    queries.append(c_title)
    if main_title != c_title:
        queries.append(main_title)
        
    seen = set()
    for q in queries:
        q = q.strip()
        if not q or q.lower() in seen: continue
        seen.add(q.lower())
        
        encoded_q = urllib.parse.quote(q)
        url = f"https://openlibrary.org/search.json?q={encoded_q}&limit=6"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'ReadingChamberP2/1.0'})
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode())
                for doc in data.get('docs', []):
                    doc_title = doc.get('title', '')
                    doc_authors = [a.lower() for a in doc.get('author_name', [])]
                    
                    # Author check
                    author_matches = False
                    if c_author:
                        for a_part in c_author.lower().split():
                            if len(a_part) > 3 and any(a_part in da for da in doc_authors):
                                author_matches = True
                                break
                    
                    # Title similarity
                    t1 = re.sub(r'[^a-zA-Z0-9]', '', c_title.lower())
                    t2 = re.sub(r'[^a-zA-Z0-9]', '', doc_title.lower())
                    tm = re.sub(r'[^a-zA-Z0-9]', '', main_title.lower())
                    
                    is_title_match = (
                        t1 == t2 or t1 in t2 or t2 in t1 or
                        tm == t2 or tm in t2 or
                        SequenceMatcher(None, t1, t2).ratio() > 0.60
                    )
                    
                    # Validated match
                    if (author_matches and (tm in t2 or is_title_match)) or (is_title_match and len(t1) > 8):
                        if doc.get('cover_i'):
                            return f"https://covers.openlibrary.org/b/id/{doc['cover_i']}-L.jpg", doc_title
                        isbns = doc.get('isbn', [])
                        for isbn in isbns[:2]:
                            return f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg", doc_title
        except Exception:
            pass
        time.sleep(0.3)
    return None, None

def make_filename(ep_id, index, title):
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', title.lower()).strip('-')[:35]
    return f"assets/books/ep-{ep_id}-{index:02d}-{slug}.jpg"

def main():
    chunk_files = sorted([f"js/data/episodes_chunk{i}.js" for i in range(1, 6)])
    chunk_data = {}
    
    for cfile in chunk_files:
        with open(cfile, 'r', encoding='utf-8') as f:
            content = f.read()
        m = re.search(r'export const (\w+)\s*=\s*(\{[\s\S]*\});?\s*$', content)
        var_name = m.group(1)
        data = json.loads(m.group(2).rstrip(';'))
        chunk_data[cfile] = (var_name, data)
        
    # Build title -> existing cover map
    existing_covers = {}
    for cfile, (var_name, data) in chunk_data.items():
        for ep_id, ep_info in data.items():
            for b in ep_info.get('books', []):
                cov = b.get('coverImage', '')
                if cov and os.path.exists(cov):
                    clean_k = re.sub(r'[^a-zA-Z0-9]', '', b.get('title', '').lower())
                    existing_covers[clean_k] = (cov, b.get('coverColor', '#1a2634'))
                    
    # Step 1: Cross-episode reuse
    reused_count = 0
    for cfile, (var_name, data) in chunk_data.items():
        for ep_id, ep_info in data.items():
            for b in ep_info.get('books', []):
                cov = b.get('coverImage', '')
                if not cov or not os.path.exists(cov):
                    clean_k = re.sub(r'[^a-zA-Z0-9]', '', b.get('title', '').lower())
                    if clean_k in existing_covers:
                        b['coverImage'], b['coverColor'] = existing_covers[clean_k]
                        reused_count += 1
                        print(f"[REUSED] {b['title']} -> {b['coverImage']}")
                        
    print(f"[+] Reused covers across episodes: {reused_count}")
    
    # Step 2: Target search for remaining missing covers
    pending_tasks = []
    for cfile, (var_name, data) in chunk_data.items():
        for ep_id, ep_info in data.items():
            for idx, b in enumerate(ep_info.get('books', [])):
                cov = b.get('coverImage', '')
                if not cov or not os.path.exists(cov):
                    pending_tasks.append((cfile, ep_id, idx, b))
                    
    print(f"[*] Remaining books to search in Phase 2: {len(pending_tasks)}")
    
    def fetch_task(t):
        cfile, ep_id, idx, b = t
        title = b.get('title', '')
        author = b.get('author', '')
        c_title = clean_title(title)
        dest_path = make_filename(ep_id, idx, c_title)
        
        cover_url, matched_title = search_phase2(title, author)
        if cover_url and download_and_verify(cover_url, dest_path):
            color = get_dominant_color(dest_path)
            return (cfile, ep_id, idx, dest_path, color, True, title, matched_title)
        return (cfile, ep_id, idx, None, None, False, title, author)
        
    phase2_found = 0
    with ThreadPoolExecutor(max_workers=3) as executor:
        for res in executor.map(fetch_task, pending_tasks):
            cfile, ep_id, idx, dest_path, color, ok, title, extra = res
            if ok:
                var_name, data = chunk_data[cfile]
                data[ep_id]['books'][idx]['coverImage'] = dest_path
                data[ep_id]['books'][idx]['coverColor'] = color
                phase2_found += 1
                print(f"[✓ FOUND P2] {title} -> {dest_path}")
            else:
                print(f"[✗ STILL MISSING] {title} (by {extra})")
                
    # Save back all chunk files
    for cfile, (var_name, data) in chunk_data.items():
        code = f"/* ==========================================================================\n" \
               f"   Episode Data Chunk: {var_name}\n" \
               f"   ========================================================================== */\n\n" \
               f"export const {var_name} = " + json.dumps(data, indent=4, ensure_ascii=False) + ";\n"
        with open(cfile, 'w', encoding='utf-8') as f:
            f.write(code)
            
    print(f"\nPhase 2 Complete!")
    print(f" - Reused from other episodes: {reused_count}")
    print(f" - Newly found in Phase 2:     {phase2_found}")

if __name__ == '__main__':
    main()
