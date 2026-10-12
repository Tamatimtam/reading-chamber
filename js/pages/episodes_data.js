/* ==========================================================================
   Episodes Archive - Data Layer & YouTube Feed Integration (All 55 Episodes)
   ========================================================================== */
import { episodeData } from '../core/data.js';
import { FALLBACK_EPISODES } from '../features/youtube.js';

export const EPISODE_TAGS = {
    "gCK0yl7wGAc": [
        "budaya",
        "filsafat"
    ],
    "wgNGCtnfdng": [
        "filsafat",
        "psikologi",
        "guest"
    ],
    "HbUO9Are2Hw": [
        "politik",
        "hukum",
        "filsafat"
    ],
    "0ytdhPJoWRA": [
        "sastra",
        "mitologi",
        "filsafat"
    ],
    "OUGfYiSk8oo": [
        "sastra",
        "mitologi"
    ],
    "S3t1FFKl7IY": [
        "edukasi",
        "guest",
        "buku"
    ],
    "o3WNHu-Vlh4": [
        "hukum",
        "bisnis",
        "sejarah"
    ],
    "2d07vj5i2YI": [
        "budaya",
        "filsafat"
    ],
    "710oKYFv5Ic": [
        "politik",
        "kebijakan"
    ],
    "o80aUzcKTxo": [
        "hukum",
        "bisnis",
        "guest"
    ],
    "3euqFpnZ5Qw": [
        "budaya",
        "politik",
        "guest"
    ],
    "r8zrrn_61iI": [
        "politik",
        "kebijakan",
        "guest"
    ],
    "lqMedBcDGQ8": [
        "politik",
        "sejarah",
        "filsafat"
    ],
    "ez4EitV9TvU": [
        "politik",
        "filsafat"
    ],
    "apklQflp3Hs": [
        "filsafat",
        "sastra"
    ],
    "1b0Sdj7fpBQ": [
        "hukum",
        "psikologi"
    ],
    "nIa57ezhAG0": [
        "budaya",
        "sastra",
        "guest"
    ],
    "WSrRIzKo2q8": [
        "sastra",
        "budaya",
        "filsafat"
    ],
    "qoucjz3Qb_s": [
        "politik",
        "guest"
    ],
    "MxUv9-pOYHA": [
        "budaya",
        "guest"
    ],
    "VJWAQbMrMK8": [
        "filsafat",
        "psikologi",
        "guest"
    ],
    "OrbrsyLXUYQ": [
        "budaya",
        "psikologi",
        "guest"
    ],
    "juiJalRlZJ0": [
        "budaya",
        "psikologi",
        "guest"
    ],
    "qMOlNeEGGkc": [
        "budaya",
        "sastra",
        "guest"
    ],
    "8fnseRh8FOc": [
        "bisnis",
        "politik",
        "guest"
    ],
    "_7AyrDpYFUo": [
        "sastra",
        "budaya"
    ],
    "6v0ZW4TlIb0": [
        "hukum",
        "filsafat",
        "guest"
    ],
    "tHzLEeTLy1o": [
        "buku",
        "budaya"
    ],
    "zszgOzPDWp4": [
        "hukum",
        "kebijakan",
        "guest"
    ],
    "WNPEGuRC7ak": [
        "filsafat",
        "budaya",
        "guest"
    ],
    "HPcUVn0m7Jw": [
        "filsafat",
        "kebijakan"
    ],
    "C7Eg9VTBDPs": [
        "edukasi",
        "buku"
    ],
    "e2_1IEcO1eo": [
        "budaya",
        "guest"
    ],
    "ZKS8aON8zC4": [
        "sejarah",
        "budaya",
        "guest"
    ],
    "5UWRmnV7kyQ": [
        "politik",
        "sejarah",
        "guest"
    ],
    "bDcRs6MemCE": [
        "hukum",
        "filsafat"
    ],
    "0CNyn_up99M": [
        "hukum",
        "kebijakan"
    ],
    "TtkrqJq8CMk": [
        "mitologi",
        "sastra",
        "filsafat"
    ],
    "j-Vz8OY7CKM": [
        "filsafat",
        "sains"
    ],
    "Ad8IjF0cpbE": [
        "psikologi",
        "filsafat"
    ],
    "dni_jm__eSg": [
        "sains",
        "filsafat"
    ],
    "6ATB5PmYZk0": [
        "politik",
        "filsafat"
    ],
    "TVju5uJIWho": [
        "sains",
        "filsafat"
    ],
    "6KnNSRkAPG0": [
        "bisnis",
        "politik",
        "guest"
    ],
    "kasoRl0Esxc": [
        "hukum",
        "karier"
    ],
    "4W5UYlqkTd4": [
        "filsafat",
        "bisnis"
    ],
    "sANL7DHvw5U": [
        "hukum",
        "karier"
    ],
    "mtyB_pEce-0": [
        "filsafat",
        "psikologi"
    ],
    "fIhTDLek0_k": [
        "budaya",
        "filsafat"
    ],
    "gWHjt4pQEuE": [
        "filsafat",
        "psikologi"
    ],
    "NT5s5Fuz1LQ": [
        "hukum",
        "filsafat"
    ],
    "IgmCofFeEjk": [
        "budaya",
        "filsafat"
    ],
    "ApMM1WNGy1A": [
        "bisnis",
        "politik",
        "guest"
    ],
    "JcEtXq8Habs": [
        "filsafat",
        "sastra"
    ],
    "2sNs9AcvsSM": [
        "sastra",
        "filsafat",
        "buku"
    ]
};

export function buildEpisodeArchive() {
    return FALLBACK_EPISODES.map((ep, idx) => {
        const videoId = ep.link.split('v=')[1] || ep.link.split('/').pop();
        const custom = episodeData[videoId] || episodeData['default'] || {};
        const tags = EPISODE_TAGS[videoId] || ['filsafat'];
        
        // Accurate episode number and badge string extraction
        const match = ep.title.match(/Ep\.?\s*(\d+)/i);
        let epNum = 0;
        let epDisplay = null;
        
        if (match) {
            epNum = parseInt(match[1], 10);
            epDisplay = `EP. ${epNum}`;
        } else if (/tur perpustakaan/i.test(ep.title) || /tour/i.test(ep.title)) {
            epNum = 24.5;
            epDisplay = 'SPESIAL';
        } else if (/teknologi/i.test(ep.title)) {
            epNum = 22.6;
            epDisplay = 'COMPANION';
        } else if (/tips baca buku/i.test(ep.title)) {
            epNum = 22.3;
            epDisplay = 'SHARING';
        } else {
            epNum = 55 - idx;
            epDisplay = `EP. ${epNum}`;
        }

        return {
            ...ep,
            id: videoId,
            epNum,
            epDisplay,
            custom,
            tags,
            bookCount: (custom.books && custom.books.length) || 0
        };
    });
}

export async function fetchLiveEpisodes(onEpisodesLoaded) {
    const channelId = 'UCdmcPWN5ezGYw_WR9UXgJ2A';
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.status === 'ok' && data.items && data.items.length > 0) {
            const epRegex = /^Ep\.?\s*(\d+)/i;
            const fetched = data.items
                .filter(item => epRegex.test(item.title))
                .map(item => {
                    const videoId = item.link.split('v=')[1] || item.link.split('/').pop();
                    const custom = episodeData[videoId] || episodeData['default'] || {};
                    const tags = EPISODE_TAGS[videoId] || ['filsafat'];
                    const match = item.title.match(epRegex);
                    const epNum = match ? parseInt(match[1], 10) : 51;
                    return {
                        title: item.title,
                        link: item.link,
                        thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${videoId}/hq720.jpg`,
                        pubDate: item.pubDate,
                        id: videoId,
                        epNum,
                        epDisplay: `EP. ${epNum}`,
                        custom,
                        tags,
                        bookCount: (custom.books && custom.books.length) || 0
                    };
                });

            if (fetched.length > 0 && typeof onEpisodesLoaded === 'function') {
                onEpisodesLoaded(fetched);
            }
        }
    } catch (e) {
        console.warn('YouTube live fetch offline or unavailable, using curated episodes archive.');
    }
}
