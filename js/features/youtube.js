export const FALLBACK_EPISODES = [
    {
        title: "Ep. 50 - Kenapa Kita Selalu Merasa Gelisah? Memahami Restlessness | bersama Okki Sutanto",
        link: "https://www.youtube.com/watch?v=wgNGCtnfdng",
        thumbnail: "https://i.ytimg.com/vi/wgNGCtnfdng/hq720.jpg",
        pubDate: "2026-09-18T22:00:17-07:00"
    },
    {
        title: "Ep. 49 - Kenapa Demokrasi Tidak Akan Pernah Sempurna? | Tentang Pilihan Publik (Public Choice)",
        link: "https://www.youtube.com/watch?v=HbUO9Are2Hw",
        thumbnail: "https://i.ytimg.com/vi/HbUO9Are2Hw/hq720.jpg",
        pubDate: "2026-09-04T23:00:23-07:00"
    },
    {
        title: "Ep. 48 - Christopher Nolan vs. Homer: Mengkaji Odyssey dari Perspektif Zaman Modern",
        link: "https://www.youtube.com/watch?v=0ytdhPJoWRA",
        thumbnail: "https://i.ytimg.com/vi/0ytdhPJoWRA/hq720.jpg",
        pubDate: "2026-08-21T22:00:20-07:00"
    },
    {
        title: "Ep. 47 - Sudah Nonton Odyssey dan Bingung? Nonton Video Ini | Respon Zaman Modern Mitologi Yunani",
        link: "https://www.youtube.com/watch?v=OUGfYiSk8oo",
        thumbnail: "https://i.ytimg.com/vi/OUGfYiSk8oo/hq720.jpg",
        pubDate: "2026-08-08T22:00:25-07:00"
    },
    {
        title: "Ep. 46 - Mengajar untuk Belajar | bersama Cania Citta dari Malaka Books",
        link: "https://www.youtube.com/watch?v=S3t1FFKl7IY",
        thumbnail: "https://i.ytimg.com/vi/S3t1FFKl7IY/hq720.jpg",
        pubDate: "2026-07-24T22:00:05-07:00"
    },
    {
        title: 'Ep. 45 - Lahirnya "Saham Dwiwarna" dan Deal Ratusan Miliar Dolar | Dealmaking dari Tuti Hadiputranto',
        link: "https://www.youtube.com/watch?v=o3WNHu-Vlh4",
        thumbnail: "https://i.ytimg.com/vi/o3WNHu-Vlh4/hq720.jpg",
        pubDate: "2026-07-10T22:00:25-07:00"
    },
    {
        title: 'Ep. 44 - Legenda "Kenji" dan Wu Tang Academy | Mengulik Kung Fu dan Loyalitas',
        link: "https://www.youtube.com/watch?v=2d07vj5i2YI",
        thumbnail: "https://i.ytimg.com/vi/2d07vj5i2YI/hq720.jpg",
        pubDate: "2026-06-26T22:00:22-07:00"
    },
    {
        title: "Ep. 43 - Pengambilan Keputusan dalam Pemerintahan | Leadership Blueprint",
        link: "https://www.youtube.com/watch?v=710oKYFv5Ic",
        thumbnail: "https://i.ytimg.com/vi/710oKYFv5Ic/hq720.jpg",
        pubDate: "2026-06-12T22:00:18-07:00"
    },
    {
        title: "Ep. 42 - Menjadi Lawyer Legendaris | Masterclass dari Tuti Hadiputranto",
        link: "https://www.youtube.com/watch?v=o80aUzcKTxo",
        thumbnail: "https://i.ytimg.com/vi/o80aUzcKTxo/hq720.jpg",
        pubDate: "2026-05-29T22:00:04-07:00"
    },
    {
        title: "Ep. 41 - Membongkar Kebobrokan Konoha | with Eno Bening",
        link: "https://www.youtube.com/watch?v=3euqFpnZ5Qw",
        thumbnail: "https://i.ytimg.com/vi/3euqFpnZ5Qw/hq720.jpg",
        pubDate: "2026-05-15T22:00:02-07:00"
    }
];

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
