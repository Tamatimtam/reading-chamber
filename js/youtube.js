export function initYouTube() {
    // 7. Fetch YouTube Data
        const channelId = 'UCdmcPWN5ezGYw_WR9UXgJ2A';
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok' && data.items.length > 0) {
                    // Filter to only include titles matching "Ep. XX" or "Ep XX"
                    const episodeRegex = /^Ep\.?\s*\d+/i;
                    const officialEpisodes = data.items.filter(item => episodeRegex.test(item.title));
                    
                    if (officialEpisodes.length === 0) return;
                    
                    const videos = officialEpisodes.slice(0, 4);
                    const featured = videos[0];
                    
                    // Set Featured
                    document.getElementById('featured-title').textContent = featured.title;
                    document.getElementById('featured-desc').textContent = 'Latest episode streaming now on YouTube.';
                    document.getElementById('featured-link').href = '#';
                    document.getElementById('featured-link').onclick = (e) => { e.preventDefault(); window.EpisodeManager.open(videos, 0, document.getElementById('featured-thumb')); };
                    
                    document.getElementById('featured-card-title').textContent = featured.title;
                    document.getElementById('featured-thumb').style.backgroundImage = `url('${featured.thumbnail}')`;
                    
                    // Add click to featured card
                    document.getElementById('featured-card').onclick = () => window.EpisodeManager.open(videos, 0, document.getElementById('featured-thumb'));
                    document.getElementById('featured-card').style.cursor = 'pointer';
                    
                    // Build Queue
                    const queueContainer = document.getElementById('queue-container');
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
                    viewAll.href = 'https://www.youtube.com/@TheReadingChamber-ID/videos';
                    viewAll.target = '_blank';
                    viewAll.className = 'view-all';
                    viewAll.innerHTML = 'VIEW ALL EPISODES &darr;';
                    queueContainer.appendChild(viewAll);
                    
                    // Animate queue items now that they exist
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
            })
            .catch(console.error);
    });
    
}
