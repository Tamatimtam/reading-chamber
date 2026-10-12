#!/usr/bin/env python3
"""
Scrapes all episode metadata, descriptions, guests, and book lists from YouTube.
"""

import os
import sys
import re
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor

YT_DLP_BIN = "/home/tama/.local/bin/yt-dlp"
CHANNEL_URL = "https://www.youtube.com/channel/UCdmcPWN5ezGYw_WR9UXgJ2A/videos"

def get_channel_video_ids():
    print("Fetching channel video list...")
    cmd = [
        YT_DLP_BIN,
        "--flat-playlist",
        "--print", "%(id)s",
        CHANNEL_URL
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    lines = [line.strip() for line in res.stdout.strip().split('\n') if line.strip() and not line.startswith('WARNING')]
    print(f"Found {len(lines)} videos on channel.")
    return lines

def fetch_video_details(video_id):
    cmd = [
        YT_DLP_BIN,
        "--skip-download",
        "--no-warnings",
        "-j",
        "--add-header", "Accept-Language: id-ID,id;q=0.9,en;q=0.8",
        f"https://www.youtube.com/watch?v={video_id}"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0 or not res.stdout.strip():
        print(f"Failed to fetch {video_id}", file=sys.stderr)
        return None
    try:
        return json.loads(res.stdout)
    except Exception as e:
        print(f"Error parsing json for {video_id}: {e}", file=sys.stderr)
        return None

def main():
    video_ids = get_channel_video_ids()
    results = {}
    
    print("Fetching metadata for all videos in parallel...")
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(fetch_video_details, vid): vid for vid in video_ids}
        for future in futures:
            vid = futures[future]
            try:
                data = future.result()
                if data:
                    results[vid] = data
                    print(f"[{len(results)}/{len(video_ids)}] {data.get('title')}")
            except Exception as e:
                print(f"Error processing {vid}: {e}")

    os.makedirs("scripts/cache", exist_ok=True)
    cache_path = "scripts/cache/raw_youtube_episodes.json"
    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"Successfully cached {len(results)} episodes into {cache_path}")

if __name__ == "__main__":
    main()
