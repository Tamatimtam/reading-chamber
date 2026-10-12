/* ==========================================================================
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
