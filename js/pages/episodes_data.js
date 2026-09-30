/* ==========================================================================
   Episodes Archive - Data Layer & YouTube Feed Integration
   ========================================================================== */

import { episodeData } from '../core/data.js';
import { FALLBACK_EPISODES } from '../features/youtube.js';

export const EPISODE_TAGS = {
    "wgNGCtnfdng": ['filsafat', 'psikologi', 'guest'],
    "HbUO9Are2Hw": ['politik', 'hukum', 'filsafat'],
    "0ytdhPJoWRA": ['sastra', 'mitologi', 'filsafat'],
    "OUGfYiSk8oo": ['sastra', 'mitologi'],
    "S3t1FFKl7IY": ['edukasi', 'guest', 'buku'],
    "o3WNHu-Vlh4": ['hukum', 'bisnis', 'sejarah'],
    "2d07vj5i2YI": ['budaya', 'filsafat'],
    "710oKYFv5Ic": ['politik', 'kebijakan'],
    "o80aUzcKTxo": ['hukum', 'bisnis', 'guest'],
    "3euqFpnZ5Qw": ['budaya', 'politik', 'guest']
};

export function buildEpisodeArchive() {
    return FALLBACK_EPISODES.map((ep, idx) => {
        const videoId = ep.link.split('v=')[1] || ep.link.split('/').pop();
        const custom = episodeData[videoId] || episodeData['default'] || {};
        const tags = EPISODE_TAGS[videoId] || ['filsafat'];
        
        // Extract episode number from title, e.g. "Ep. 50" -> 50
        const match = ep.title.match(/Ep\.?\s*(\d+)/i);
        const epNum = match ? parseInt(match[1], 10) : (50 - idx);

        return {
            ...ep,
            id: videoId,
            epNum,
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
                    const epNum = match ? parseInt(match[1], 10) : 50;
                    return {
                        title: item.title,
                        link: item.link,
                        thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${videoId}/hq720.jpg`,
                        pubDate: item.pubDate,
                        id: videoId,
                        epNum,
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
