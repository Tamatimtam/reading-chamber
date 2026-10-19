#!/usr/bin/env python3
"""
Generates docs/unmatched-books-manual-guide.md cleanly without bash escaping issues.
"""

import glob
import json
import re
import os
from PIL import Image

def main():
    with open('js/data/episodes_meta.js', 'r', encoding='utf-8') as fp:
        text = fp.read()
    m = re.search(r'export const FALLBACK_EPISODES =\s*(\[[\s\S]*\]);?\s*$', text)
    meta_list = json.loads(m.group(1).rstrip(';')) if m else []
    ep_title_map = {}
    for ep in meta_list:
        vid = ep['link'].split('v=')[1] if 'v=' in ep['link'] else ep['link'].split('/')[-1]
        ep_title_map[vid] = ep['title']

    all_books = []
    for f in sorted(glob.glob('js/data/episodes_chunk*.js')):
        with open(f, 'r', encoding='utf-8') as fp:
            lines = fp.readlines()
        current_ep = None
        in_books = False
        cur_book = {}
        idx = 0
        for line in lines:
            ep_m = re.match(r'\s*\"([a-zA-Z0-9_-]{11})\":\s*\{', line)
            if ep_m:
                current_ep = ep_m.group(1)
            if '\"books\": [' in line:
                in_books = True
                idx = 0
                continue
            if in_books and ']' in line:
                in_books = False
                continue
            if in_books:
                t_m = re.search(r'\"title\":\s*\"([^\"]+)\"', line)
                a_m = re.search(r'\"author\":\s*\"([^\"]+)\"', line)
                c_m = re.search(r'\"coverImage\":\s*\"([^\"]*)\"', line)
                col_m = re.search(r'\"coverColor\":\s*\"([^\"]*)\"', line)
                if t_m: cur_book['title'] = t_m.group(1)
                if a_m: cur_book['author'] = a_m.group(1)
                if c_m: cur_book['coverImage'] = c_m.group(1)
                if col_m: cur_book['coverColor'] = col_m.group(1)
                if '}' in line and 'title' in cur_book:
                    cur_book['ep'] = current_ep
                    cur_book['ep_title'] = ep_title_map.get(current_ep, f'Episode {current_ep}')
                    cur_book['index'] = idx
                    cur_book['file'] = f
                    cov = cur_book.get('coverImage', '')
                    if cov and os.path.exists(cov):
                        sz = os.path.getsize(cov)
                        try:
                            im = Image.open(cov)
                            cur_book['img_info'] = {'size': sz, 'w': im.size[0], 'h': im.size[1]}
                        except Exception:
                            cur_book['img_info'] = None
                    else:
                        cur_book['img_info'] = None
                    all_books.append(cur_book)
                    idx += 1
                    cur_book = {}

    needs_manual = [b for b in all_books if not b['img_info'] or b['img_info']['w'] < 200 or b['img_info']['h'] < 250]

    by_ep = {}
    for b in needs_manual:
        ep = b['ep']
        if ep not in by_ep:
            by_ep[ep] = {'title': b['ep_title'], 'books': []}
        by_ep[ep]['books'].append(b)

    lines = [
        "# Panduan Kurasi Cover Buku Manual",
        "",
        "Dokumen ini memuat daftar buku yang belum memiliki cover definisi tinggi resmi di situs **The Reading Chamber** (seperti komik Indonesia klasik, manuskrip keagamaan abad pertengahan, antologi independen, atau laporan publikasi khusus).",
        "",
        f"> Total buku tersisa yang butuh kurasi cover: **{len(needs_manual)} buku** (dari total 173 buku).",
        "> 106 buku lainnya sudah otomatis di-download dalam resolusi tinggi retina, dengan warna ambient glow 3D yang sudah disesuaikan.",
        "",
        "## Langkah Singkat Mengisi / Memperbarui Cover",
        "",
        "1. **Cari gambar cover** berorientasi tegak (portrait rasio 2:3, rekomendasi ukuran: `600x900px` atau `800x1200px`).",
        "2. **Simpan file gambar** ke folder `assets/books/` dengan path file yang sudah disiapkan di bawah.",
        "3. **Update datanya**: jalankan helper script otomatis:",
        "   ```bash",
        "   python3 scripts/fetch_book_cover.py \"Judul Buku\" \"Nama Penulis\" assets/books/nama-file.jpg",
        "   ```",
        "   Script tersebut otomatis menghitung `coverColor` rata-rata yang cocok untuk rotasi 3D dan ambient aura.",
        "4. Buka file chunk `js/data/episodes_chunkX.js` pada episode dan index yang tertera, lalu isi `coverImage` dan `coverColor`.",
        "",
        "---",
        ""
    ]

    for ep_id, data in by_ep.items():
        lines.append(f"### {data['title']}")
        lines.append(f"*YouTube ID: `{ep_id}`*")
        lines.append("")
        for b in data['books']:
            slug = re.sub(r'[^a-zA-Z0-9]+', '-', b['title'].lower()).strip('-')[:35]
            suggested = f"assets/books/ep-{b['ep']}-{b['index']:02d}-{slug}.jpg"
            author = b.get('author') or 'The Reading Chamber Archive'
            chunk_name = os.path.basename(b['file'])
            current_cov = b.get('coverImage', '')
            status_note = "Belum ada gambar" if not current_cov else f"Gambar resolusi rendah ({b['img_info']['w']}x{b['img_info']['h']}px)"
            lines.append(f"- **{b['title']}**")
            lines.append(f"  - **Penulis**: {author}")
            lines.append(f"  - **Status**: {status_note}")
            lines.append(f"  - **Target File**: `{suggested}`")
            lines.append(f"  - **File Data**: `js/data/{chunk_name}` (Index #{b['index']})")
            lines.append("")
        lines.append("---")
        lines.append("")

    with open('docs/unmatched-books-manual-guide.md', 'w', encoding='utf-8') as fp:
        fp.write('\n'.join(lines))

    print(f"Successfully generated docs/unmatched-books-manual-guide.md with {len(needs_manual)} books.")

if __name__ == '__main__':
    main()
