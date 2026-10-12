#!/usr/bin/env python3
"""
Master episode generator for The Reading Chamber.
Extracts all 55 episodes from cache, preserves existing curated records,
and splits data into clean modular chunks under 500 lines.
"""

import os
import re
import json

CACHE_FILE = "scripts/cache/raw_youtube_episodes.json"
DATA_JS = "js/core/data.js"
OUTPUT_DIR = "js/data"
EPISODES_DATA_JS = "js/pages/episodes_data.js"

# Curated guest roles & names
GUEST_MAP = {
    "gCK0yl7wGAc": None, # Solo Gamer Special
    "wgNGCtnfdng": {"name": "Okki Sutanto", "role": "Penulis & Pemikir"},
    "S3t1FFKl7IY": {"name": "Cania Citta", "role": "Pendiri Malaka Books"},
    "o3WNHu-Vlh4": {"name": "Tuti Hadiputranto (Archive)", "role": "Senior Partner & Lawyer Legendaris"},
    "o80aUzcKTxo": {"name": "Tuti Hadiputranto (Archive)", "role": "Senior Partner & Lawyer Legendaris"},
    "3euqFpnZ5Qw": {"name": "Eno Bening", "role": "Content Creator & Analyst"},
    "r8zrrn_61iI": {"name": "Rachmat Kaimuddin", "role": "Deputi Menko Bidang Transportasi & Infrastruktur"},
    "nIa57ezhAG0": {"name": "Eno Bening", "role": "Content Creator & Analyst"},
    "qoucjz3Qb_s": {"name": "Dirgayuza Setiawan", "role": "Special Assistant to the President for Communications"},
    "MxUv9-pOYHA": {"name": "Abigail Limuria & Eno Bening", "role": "Bijak Memilih & Content Analyst"},
    "VJWAQbMrMK8": {"name": "Abigail Limuria", "role": "What Is Up, Indonesia? & Malaka Books"},
    "OrbrsyLXUYQ": {"name": "Eza Hazami", "role": "Content Creator & HR Specialist"},
    "juiJalRlZJ0": {"name": "Eza Hazami", "role": "Content Creator & HR Specialist"},
    "qMOlNeEGGkc": {"name": "Faza Meonk", "role": "Kreator Si Juki & Komikus"},
    "8fnseRh8FOc": {"name": "Masyita Crystallin", "role": "Ekonom & Staf Khusus Menkeu RI"},
    "6v0ZW4TlIb0": {"name": "Bagus Muljadi", "role": "Associate Professor University of Nottingham"},
    "zszgOzPDWp4": {"name": "Bagus Muljadi", "role": "Associate Professor University of Nottingham"},
    "WNPEGuRC7ak": {"name": "Eno Bening", "role": "Content Creator & Analyst"},
    "e2_1IEcO1eo": {"name": "Eno Bening", "role": "Content Creator & Analyst"},
    "ZKS8aON8zC4": {"name": "Hilmar Farid", "role": "Sejarawan & Dirjen Kebudayaan RI"},
    "5UWRmnV7kyQ": {"name": "Shofwan Al Banna Choiruzzad", "role": "Pakar Hubungan Internasional Universitas Indonesia"},
    "6KnNSRkAPG0": {"name": "Pandu Sjahrir", "role": "Managing Partner Indies Capital & Investor"},
    "ApMM1WNGy1A": {"name": "Yusuf Didi Setiarto", "role": "Direktur Legal & Manajemen Human Capital PLN"}
}

# Detailed tags for all 55 episodes
TAGS_MAP = {
    "gCK0yl7wGAc": ['budaya', 'filsafat'],
    "wgNGCtnfdng": ['filsafat', 'psikologi', 'guest'],
    "HbUO9Are2Hw": ['politik', 'hukum', 'filsafat'],
    "0ytdhPJoWRA": ['sastra', 'mitologi', 'filsafat'],
    "OUGfYiSk8oo": ['sastra', 'mitologi'],
    "S3t1FFKl7IY": ['edukasi', 'guest', 'buku'],
    "o3WNHu-Vlh4": ['hukum', 'bisnis', 'sejarah'],
    "2d07vj5i2YI": ['budaya', 'filsafat'],
    "710oKYFv5Ic": ['politik', 'kebijakan'],
    "o80aUzcKTxo": ['hukum', 'bisnis', 'guest'],
    "3euqFpnZ5Qw": ['budaya', 'politik', 'guest'],
    "r8zrrn_61iI": ['politik', 'kebijakan', 'guest'],
    "lqMedBcDGQ8": ['politik', 'sejarah', 'filsafat'],
    "ez4EitV9TvU": ['politik', 'filsafat'],
    "apklQflp3Hs": ['filsafat', 'sastra'],
    "1b0Sdj7fpBQ": ['hukum', 'psikologi'],
    "nIa57ezhAG0": ['budaya', 'sastra', 'guest'],
    "WSrRIzKo2q8": ['sastra', 'budaya', 'filsafat'],
    "qoucjz3Qb_s": ['politik', 'guest'],
    "MxUv9-pOYHA": ['budaya', 'guest'],
    "VJWAQbMrMK8": ['filsafat', 'psikologi', 'guest'],
    "OrbrsyLXUYQ": ['budaya', 'psikologi', 'guest'],
    "juiJalRlZJ0": ['budaya', 'psikologi', 'guest'],
    "qMOlNeEGGkc": ['budaya', 'sastra', 'guest'],
    "8fnseRh8FOc": ['bisnis', 'politik', 'guest'],
    "_7AyrDpYFUo": ['sastra', 'budaya'],
    "6v0ZW4TlIb0": ['hukum', 'filsafat', 'guest'],
    "tHzLEeTLy1o": ['buku', 'budaya'],
    "zszgOzPDWp4": ['hukum', 'kebijakan', 'guest'],
    "WNPEGuRC7ak": ['filsafat', 'budaya', 'guest'],
    "HPcUVn0m7Jw": ['filsafat', 'kebijakan'],
    "C7Eg9VTBDPs": ['edukasi', 'buku'],
    "e2_1IEcO1eo": ['budaya', 'guest'],
    "ZKS8aON8zC4": ['sejarah', 'budaya', 'guest'],
    "5UWRmnV7kyQ": ['politik', 'sejarah', 'guest'],
    "bDcRs6MemCE": ['hukum', 'filsafat'],
    "0CNyn_up99M": ['hukum', 'kebijakan'],
    "TtkrqJq8CMk": ['mitologi', 'sastra', 'filsafat'],
    "j-Vz8OY7CKM": ['filsafat', 'sains'],
    "Ad8IjF0cpbE": ['psikologi', 'filsafat'],
    "dni_jm__eSg": ['sains', 'filsafat'],
    "6ATB5PmYZk0": ['politik', 'filsafat'],
    "TVju5uJIWho": ['sains', 'filsafat'],
    "6KnNSRkAPG0": ['bisnis', 'politik', 'guest'],
    "kasoRl0Esxc": ['hukum', 'karier'],
    "4W5UYlqkTd4": ['filsafat', 'bisnis'],
    "sANL7DHvw5U": ['hukum', 'karier'],
    "mtyB_pEce-0": ['filsafat', 'psikologi'],
    "fIhTDLek0_k": ['budaya', 'filsafat'],
    "gWHjt4pQEuE": ['filsafat', 'psikologi'],
    "NT5s5Fuz1LQ": ['hukum', 'filsafat'],
    "IgmCofFeEjk": ['budaya', 'filsafat'],
    "ApMM1WNGy1A": ['bisnis', 'politik', 'guest'],
    "JcEtXq8Habs": ['filsafat', 'sastra'],
    "2sNs9AcvsSM": ['sastra', 'filsafat', 'buku']
}

ELEGANT_COLORS = [
    "#1a365d", "#234e52", "#22543d", "#744210", "#7b341e",
    "#521b41", "#44337a", "#2c5282", "#285e61", "#2d3748"
]

def load_existing_curated():
    with open("js/data/episodes_chunk1.js", 'r', encoding='utf-8') as f:
        # Load from previously exported chunk or data.js
        pass
    # We can read existing records from previous cache/js
    # Let's inspect data.js or backup
    with open(DATA_JS, 'r', encoding='utf-8') as f:
        text = f.read()
    # Check if data.js imports chunks
    if 'episodesChunk1' in text:
        with open("js/data/episodes_chunk1.js", 'r', encoding='utf-8') as f1:
            t1 = f1.read()
            m1 = re.search(r'export const episodesChunk1 =\s*(\{[\s\S]*\});?\s*$', t1)
            c1 = json.loads(m1.group(1).rstrip(';')) if m1 else {}
        with open("js/data/episodes_chunk2.js", 'r', encoding='utf-8') as f2:
            t2 = f2.read()
            m2 = re.search(r'export const episodesChunk2 =\s*(\{[\s\S]*\});?\s*$', t2)
            c2 = json.loads(m2.group(1).rstrip(';')) if m2 else {}
        combined = {**c1, **c2}
        return combined
    else:
        match = re.search(r'export const episodeData =\s*(\{[\s\S]*\});?\s*$', text)
        return json.loads(match.group(1).rstrip(';'))

def clean_description(desc):
    parts = re.split(r'(?:📚|Buku yang dibahas|Buku & Manga|Highlight Pembahasan|Yang akan dibahas|Timestamp|Daftar Isi|Chapters|Social Media|Instagram:|\n---)', desc, flags=re.IGNORECASE)
    cleaned = parts[0].strip()
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    return cleaned

def parse_books_from_desc(desc):
    books = []
    lines = desc.split('\n')
    in_books = False
    
    for line in lines:
        stripped = line.strip()
        if re.search(r'(?:📚|Buku yang dibahas|Buku & Manga|Books mentioned|Daftar Buku)', stripped, re.IGNORECASE):
            in_books = True
            continue
        if in_books and (re.search(r'(?:Timestamp|Chapters|Social Media|Instagram|Spotify|---)', stripped, re.IGNORECASE) or stripped.startswith('http')):
            in_books = False
            
        m = re.match(r'^\s*(\d+)[\.\)]\s*(.+)$', stripped)
        if m and (in_books or re.search(r'[–—\-]', m.group(2))):
            item_text = m.group(2).strip()
            title, author = item_text, ""
            if '–' in item_text:
                parts = item_text.split('–', 1)
                title, author = parts[0].strip(), parts[1].strip()
            elif '—' in item_text:
                parts = item_text.split('—', 1)
                title, author = parts[0].strip(), parts[1].strip()
            elif ' - ' in item_text:
                parts = item_text.split(' - ', 1)
                title, author = parts[0].strip(), parts[1].strip()
            elif ' karya ' in item_text.lower():
                idx = item_text.lower().find(' karya ')
                title = item_text[:idx].strip()
                author = item_text[idx+7:].strip()
            
            title = title.strip(' "\'“‘')
            author = author.strip(' "\'“‘')
            if title:
                books.append({
                    "title": title,
                    "author": author or "The Reading Chamber Archive",
                    "coverColor": ELEGANT_COLORS[len(books) % len(ELEGANT_COLORS)],
                    "coverImage": ""
                })
    return books

def format_pub_date(upload_date):
    if upload_date and len(upload_date) == 8:
        return f"{upload_date[:4]}-{upload_date[4:6]}-{upload_date[6:8]}T22:00:00Z"
    return "2026-01-01T00:00:00Z"

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    with open(CACHE_FILE, "r", encoding="utf-8") as f:
        raw_cache = json.load(f)
        
    existing_curated = load_existing_curated()
    
    fallback_episodes = []
    all_episodes_data = {}
    ordered_ids = list(raw_cache.keys())
    
    for vid in ordered_ids:
        raw = raw_cache[vid]
        title = raw.get("title", "")
        pub_date = format_pub_date(raw.get("upload_date", ""))
        
        fallback_episodes.append({
            "title": title,
            "link": f"https://www.youtube.com/watch?v={vid}",
            "thumbnail": f"https://i.ytimg.com/vi/{vid}/hq720.jpg",
            "pubDate": pub_date
        })
        
        if vid in existing_curated and vid != "default":
            all_episodes_data[vid] = existing_curated[vid]
        else:
            guest = GUEST_MAP.get(vid)
            desc = clean_description(raw.get("description", ""))
            books = parse_books_from_desc(raw.get("description", ""))
            
            all_episodes_data[vid] = {
                "guest": {
                    "name": guest["name"],
                    "role": guest["role"],
                    "photo": ""
                } if guest else None,
                "description": desc or "Episode The Reading Chamber bersama Pram & Pras, mengeksplorasi ide, buku, dan realitas dunia.",
                "books": books
            }
            
    # 1. Write js/data/episodes_meta.js
    meta_code = "/* ==========================================================================\n" \
                "   The Reading Chamber - Full Episodes Metadata Catalog (55 Episodes)\n" \
                "   ========================================================================== */\n\n" \
                "export const FALLBACK_EPISODES = " + json.dumps(fallback_episodes, indent=4, ensure_ascii=False) + ";\n"
                
    with open(os.path.join(OUTPUT_DIR, "episodes_meta.js"), "w", encoding="utf-8") as f:
        f.write(meta_code)
    print("Wrote js/data/episodes_meta.js")
    
    # 2. Partition into 5 chunks
    chunks = [
        ("episodes_chunk1.js", "episodesChunk1", ordered_ids[0:9]),    # Ep 51 down to Ep 43
        ("episodes_chunk2.js", "episodesChunk2", ordered_ids[9:20]),   # Ep 42 down to Ep 32
        ("episodes_chunk3.js", "episodesChunk3", ordered_ids[20:31]),  # Ep 31 down to Ep 23 / Specials
        ("episodes_chunk4.js", "episodesChunk4", ordered_ids[31:42]),  # Ep 22 down to Ep 14 / Specials
        ("episodes_chunk5.js", "episodesChunk5", ordered_ids[42:55]),  # Ep 13 down to Ep 1 & Ep 0
    ]
    
    for fname, varname, vid_list in chunks:
        chunk_dict = {vid: all_episodes_data[vid] for vid in vid_list if vid in all_episodes_data}
        content = f"/* ==========================================================================\n" \
                  f"   Episode Data Chunk: {varname}\n" \
                  f"   ========================================================================== */\n\n" \
                  f"export const {varname} = " + json.dumps(chunk_dict, indent=4, ensure_ascii=False) + ";\n"
        with open(os.path.join(OUTPUT_DIR, fname), "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Wrote {OUTPUT_DIR}/{fname} with {len(chunk_dict)} episodes")
        
    # 3. Write aggregated js/core/data.js
    data_agg_code = """/* ==========================================================================
   Episode Data Aggregator
   The Reading Chamber - Curated Episode Master Registry
   ========================================================================== */

import { episodesChunk1 } from '../data/episodes_chunk1.js';
import { episodesChunk2 } from '../data/episodes_chunk2.js';
import { episodesChunk3 } from '../data/episodes_chunk3.js';
import { episodesChunk4 } from '../data/episodes_chunk4.js';
import { episodesChunk5 } from '../data/episodes_chunk5.js';

export const episodeData = {
    ...episodesChunk1,
    ...episodesChunk2,
    ...episodesChunk3,
    ...episodesChunk4,
    ...episodesChunk5,
    "default": {
        "guest": null,
        "description": "A deep dive into classical literature and philosophy, exploring timeless ideas and how they apply to modern life.",
        "books": [
            {
                "title": "The Republic",
                "author": "Plato",
                "coverColor": "#1a1a19",
                "coverImage": "assets/books/republic.jpg"
            },
            {
                "title": "The Odyssey",
                "author": "Homer",
                "coverColor": "#0f5de8",
                "coverImage": "assets/books/odyssey.jpg"
            }
        ]
    }
};
"""
    with open(DATA_JS, "w", encoding="utf-8") as f:
        f.write(data_agg_code)
    print("Wrote updated js/core/data.js")

    # 4. Write updated js/pages/episodes_data.js
    tags_json = json.dumps(TAGS_MAP, indent=4, ensure_ascii=False)
    episodes_data_code = f"""/* ==========================================================================
   Episodes Archive - Data Layer & YouTube Feed Integration (All 55 Episodes)
   ========================================================================== */

import {{ episodeData }} from '../core/data.js';
import {{ FALLBACK_EPISODES }} from '../features/youtube.js';

export const EPISODE_TAGS = {tags_json};

export function buildEpisodeArchive() {{
    return FALLBACK_EPISODES.map((ep, idx) => {{
        const videoId = ep.link.split('v=')[1] || ep.link.split('/').pop();
        const custom = episodeData[videoId] || episodeData['default'] || {{}};
        const tags = EPISODE_TAGS[videoId] || ['filsafat'];
        
        // Accurate episode number and badge string extraction
        const match = ep.title.match(/Ep\\.?\\s*(\\d+)/i);
        let epNum = 0;
        let epDisplay = null;
        
        if (match) {{
            epNum = parseInt(match[1], 10);
            epDisplay = `EP. ${{epNum}}`;
        }} else if (/tur perpustakaan/i.test(ep.title) || /tour/i.test(ep.title)) {{
            epNum = 24.5;
            epDisplay = 'SPESIAL';
        }} else if (/teknologi/i.test(ep.title)) {{
            epNum = 22.6;
            epDisplay = 'COMPANION';
        }} else if (/tips baca buku/i.test(ep.title)) {{
            epNum = 22.3;
            epDisplay = 'SHARING';
        }} else {{
            epNum = 55 - idx;
            epDisplay = `EP. ${{epNum}}`;
        }}

        return {{
            ...ep,
            id: videoId,
            epNum,
            epDisplay,
            custom,
            tags,
            bookCount: (custom.books && custom.books.length) || 0
        }};
    }});
}}

export async function fetchLiveEpisodes(onEpisodesLoaded) {{
    const channelId = 'UCdmcPWN5ezGYw_WR9UXgJ2A';
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${{channelId}}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${{encodeURIComponent(rssUrl)}}`;

    try {{
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.status === 'ok' && data.items && data.items.length > 0) {{
            const epRegex = /^Ep\\.?\\s*(\\d+)/i;
            const fetched = data.items
                .filter(item => epRegex.test(item.title))
                .map(item => {{
                    const videoId = item.link.split('v=')[1] || item.link.split('/').pop();
                    const custom = episodeData[videoId] || episodeData['default'] || {{}};
                    const tags = EPISODE_TAGS[videoId] || ['filsafat'];
                    const match = item.title.match(epRegex);
                    const epNum = match ? parseInt(match[1], 10) : 51;
                    return {{
                        title: item.title,
                        link: item.link,
                        thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${{videoId}}/hq720.jpg`,
                        pubDate: item.pubDate,
                        id: videoId,
                        epNum,
                        epDisplay: `EP. ${{epNum}}`,
                        custom,
                        tags,
                        bookCount: (custom.books && custom.books.length) || 0
                    }};
                }});

            if (fetched.length > 0 && typeof onEpisodesLoaded === 'function') {{
                onEpisodesLoaded(fetched);
            }}
        }}
    }} catch (e) {{
        console.warn('YouTube live fetch offline or unavailable, using curated episodes archive.');
    }}
}}
"""
    with open(EPISODES_DATA_JS, "w", encoding="utf-8") as f:
        f.write(episodes_data_code)
    print("Wrote updated js/pages/episodes_data.js")

if __name__ == "__main__":
    main()
