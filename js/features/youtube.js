import { FALLBACK_EPISODES } from '../data/episodes_meta.js';
export { FALLBACK_EPISODES };

function renderEpisodes(videos) {
    if (!videos || videos.length === 0) return;

    const featured = videos[0];

    // Set Featured
    const featuredTitle = document.getElementById('featured-title');
    const featuredDesc = document.getElementById('featured-desc');
    const featuredLink = document.getElementById('featured-link');
    const featuredCardTitle = document.getElementById('featured-card-title');
    const featuredThumb = document.getElementById('featured-thumb');
    const featuredCard = document.getElementById('featured-card');

    if (featuredTitle) featuredTitle.textContent = featured.title;
    if (featuredDesc) featuredDesc.textContent = 'Latest episode streaming now on YouTube.';
    if (featuredLink) {
        featuredLink.href = '#';
        featuredLink.onclick = (e) => { 
            e.preventDefault(); 
            window.EpisodeManager.open(videos, 0, featuredThumb); 
        };
    }

    if (featuredCardTitle) featuredCardTitle.textContent = featured.title;
    if (featuredThumb) featuredThumb.style.backgroundImage = `url('${featured.thumbnail}')`;

    // Add click to featured card
    if (featuredCard) {
        featuredCard.onclick = () => window.EpisodeManager.open(videos, 0, featuredThumb);
        featuredCard.style.cursor = 'pointer';
    }

    // Build Queue
    const queueContainer = document.getElementById('queue-container');
    if (!queueContainer) return;
    queueContainer.innerHTML = ''; // clear

    videos.forEach((video, index) => {
        const isActive = index === 0 ? 'active' : '';

        const queueItem = document.createElement('div');
        queueItem.className = `queue-item ${isActive}`;
        queueItem.onclick = () => window.EpisodeManager.open(videos, index, queueItem.querySelector('.ep-thumb'));

        queueItem.innerHTML = `
            <div class="ep-thumb" style="background-image: url('${video.thumbnail}'); background-size: cover; background-position: center;">
            </div>
            <div class="ep-details">
                <h4>${video.title}</h4>
                <span class="ep-time">Enter Chamber &rarr;</span>
            </div>
        `;
        queueContainer.appendChild(queueItem);
    });

    const viewAll = document.createElement('a');
    viewAll.href = 'episodes.html';
    viewAll.className = 'view-all';
    viewAll.innerHTML = 'VIEW ALL EPISODES &rarr;';
    queueContainer.appendChild(viewAll);

    // Animate queue items now that they exist
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.from('.queue-item', {
            x: 50,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: '.latest-queue',
                start: "top 85%",
            }
        });

        ScrollTrigger.refresh();
    }
}

export function initYouTube() {
    let hasRendered = false;

    const applyVideos = (videos) => {
        if (hasRendered) return;
        hasRendered = true;
        renderEpisodes(videos);
    };

    // Fetch YouTube Data
    const channelId = 'UCdmcPWN5ezGYw_WR9UXgJ2A';
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                // Filter to only include titles matching "Ep. XX" or "Ep XX"
                const episodeRegex = /^Ep\.?\s*\d+/i;
                const officialEpisodes = data.items.filter(item => episodeRegex.test(item.title));

                if (officialEpisodes.length > 0) {
                    applyVideos(officialEpisodes.slice(0, 4));
                    return;
                }
            }

            // RSS returned error status or no matching episodes
            console.warn('YouTube RSS feed unavailable, loading fallback episodes.');
            applyVideos(FALLBACK_EPISODES.slice(0, 4));
        })
        .catch(err => {
            console.warn('YouTube fetch error, loading fallback episodes:', err);
            applyVideos(FALLBACK_EPISODES.slice(0, 4));
        });
}
