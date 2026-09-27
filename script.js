document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis for Smooth Scrolling
    window.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        window.lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP with Lenis
    window.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{
      window.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Pre-split text for animation
    const heroTitleSplit = new SplitType('.hero-title .line', { types: 'words, chars' });
    const aboutTitleSplit = new SplitType('.about-title span', { types: 'words, chars' });
    
    // 3. Hero Entry Animation (Focal Moment)
    const tl = gsap.timeline();

    // Initial state
    gsap.set('.nav', { y: -100, opacity: 0 });
    gsap.set(heroTitleSplit.chars, { y: 100, opacity: 0 });
    gsap.set('.doodle', { opacity: 0, scale: 0.8 });
    gsap.set('.hero-desc', { opacity: 0, x: -20 });
    gsap.set('.btn-play', { opacity: 0, y: 20 });
    gsap.set('.shape', { scale: 0.8, opacity: 0 });

    tl.to('.nav', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        delay: 0.2
    })
    .to('.shape', {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power3.out'
    }, "-=0.8")
    .to(heroTitleSplit.chars, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.02,
        ease: 'power4.out'
    }, "-=1.2")
    .to('.doodle-1, .doodle-2', {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.5)'
    }, "-=0.5")
    .to('.hero-desc', {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, "-=0.6")
    .to('.btn-play', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, "-=0.6");

    // 4. Parallax Background Shapes
    gsap.utils.toArray('.shape').forEach(shape => {
        gsap.to(shape, {
            yPercent: -30,
            rotation: "+=10",
            ease: "none",
            scrollTrigger: {
                trigger: shape,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // 5. Scroll Reveals for Latest Episode
    gsap.from('.latest-info > *', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.latest-episode',
            start: "top 70%",
        }
    });

    gsap.from('.latest-featured-card', {
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '.latest-featured-card',
            start: "top 80%",
        }
    });

    // We will animate .queue-item after fetch completes
    
    // 6. About Section Scroll Animations
    gsap.from(aboutTitleSplit.chars, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '.about-title',
            start: "top 80%",
        }
    });

    gsap.from('.about-note', {
        rotation: -10,
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.2)',
        scrollTrigger: {
            trigger: '.about-note',
            start: "top 80%",
        }
    });

    gsap.from('.topic-pill', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.topics-grid',
            start: "top 85%",
        }
    });

    // 7. Fetch YouTube Data
    const channelId = 'UCdmcPWN5ezGYw_WR9UXgJ2A';
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'ok' && data.items.length > 0) {
                const videos = data.items.slice(0, 4);
                const featured = videos[0];
                
                // Set Featured
                document.getElementById('featured-title').textContent = featured.title;
                document.getElementById('featured-desc').textContent = 'Latest episode streaming now on YouTube.';
                document.getElementById('featured-link').href = '#';
                document.getElementById('featured-link').onclick = (e) => { e.preventDefault(); window.openEpisode(videos, 0, document.getElementById('featured-card')); };
                
                document.getElementById('featured-card-title').textContent = featured.title;
                document.getElementById('featured-thumb').style.backgroundImage = `url('${featured.thumbnail}')`;
                
                // Add click to featured card
                document.getElementById('featured-card').onclick = () => window.openEpisode(videos, 0, document.getElementById('featured-card'));
                document.getElementById('featured-card').style.cursor = 'pointer';
                
                // Build Queue
                const queueContainer = document.getElementById('queue-container');
                queueContainer.innerHTML = ''; // clear

                videos.forEach((video, index) => {
                    const isActive = index === 0 ? 'active' : '';
                    
                    const queueItem = document.createElement('div');
                    queueItem.className = `queue-item ${isActive}`;
                    queueItem.onclick = () => window.openEpisode(videos, index, queueItem);
                    
                    queueItem.innerHTML = `
                        <div class="ep-thumb" style="background-image: url('${video.thumbnail}'); background-size: cover; background-position: center;">
                            <div class="ep-number">NEW</div>
                        </div>
                        <div class="ep-details">
                            <h4>${video.title}</h4>
                            <span class="ep-time">Watch</span>
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
                    x: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.latest-queue',
                        start: "top 80%",
                    }
                });

                ScrollTrigger.refresh();
            }
        })
        .catch(console.error);
});
