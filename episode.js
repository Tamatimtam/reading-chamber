// Mocked Data Map: Video ID -> Episode Data
const episodeData = {
    'wgNGCtnfdng': {
        guest: { name: 'Okki Sutanto', role: 'Writer & Thinker', photo: '' },
        description: 'Membahas tentang proses menjadi dewasa yang tidak ada panduannya. Kami membawa 10 buku yang menurut kami penting untuk dibaca saat memasuki dunia kedewasaan.',
        books: [
            { title: 'The Psychology of Money', author: 'Morgan Housel', coverColor: '#2b5034' },
            { title: 'Meditations', author: 'Marcus Aurelius', coverColor: '#1a1a19' },
            { title: 'Atomic Habits', author: 'James Clear', coverColor: '#d6b345' }
        ]
    },
    'HbUO9Are2Hw': {
        guest: null,
        description: 'Tentang pilihan publik, realitas kekuasaan, dan bagaimana kita tetap bisa berharap di tengah sistem demokrasi yang tidak pernah sempurna.',
        books: [
            { title: 'Public Choice Theory', author: 'Gordon Tullock', coverColor: '#0f5de8' },
            { title: 'The Logic of Collective Action', author: 'Mancur Olson', coverColor: '#8a2b2b' }
        ]
    },
    'default': {
        guest: null,
        description: 'A deep dive into classical literature and philosophy, exploring timeless ideas and how they apply to modern life.',
        books: [
            { title: 'The Republic', author: 'Plato', coverColor: '#1a1a19' },
            { title: 'The Odyssey', author: 'Homer', coverColor: '#0f5de8' }
        ]
    }
};

class EpisodeExperience {
    constructor() {
        this.overlay = document.getElementById('episode-overlay');
        this.isOpen = false;
        this.videos = [];
        this.currentIndex = 0;
        this.isNavigating = false;
        
        this.handleKeyDown = this.handleKeyDown.bind(this);
        window.addEventListener('keydown', this.handleKeyDown);
        
        window.openEpisode = this.open.bind(this);
    }
    
    handleKeyDown(e) {
        if (!this.isOpen || this.isNavigating) return;
        if (e.key === 'ArrowRight' && this.currentIndex < this.videos.length - 1) {
            this.navigate(1);
        }
        if (e.key === 'ArrowLeft' && this.currentIndex > 0) {
            this.navigate(-1);
        }
        if (e.key === 'Escape') {
            this.close();
        }
    }

    buildDOM() {
        const videoData = this.videos[this.currentIndex];
        const videoId = videoData.link.split('v=')[1] || videoData.link.split('/').pop();
        const customData = episodeData[videoId] || episodeData['default'];
        
        const hasPrev = this.currentIndex > 0;
        const hasNext = this.currentIndex < this.videos.length - 1;

        let html = `
            <div class="ep-controls">
                <button class="ep-btn" id="ep-prev" ${!hasPrev ? 'disabled' : ''}>&larr;</button>
                <button class="ep-btn" id="ep-next" ${!hasNext ? 'disabled' : ''}>&rarr;</button>
                <button class="ep-btn" id="ep-close">&times;</button>
            </div>
            
            <div class="ep-left" id="ep-left-bg">
                <div class="ep-video-container" id="ep-video-target" style="background-image: url('${videoData.thumbnail}');"></div>
                <div class="ep-left-content">
                    <div class="ep-meta">LATEST EPISODE • AUDIO AVAILABLE</div>
                    <h1 class="ep-title">${videoData.title}</h1>
                    <button class="ep-play-audio">
                        <span class="play-icon">▶</span> Play Episode
                    </button>
                </div>
            </div>
            
            <div class="ep-right" id="ep-right-panel">
                <div class="ep-tabs">
                    <button class="ep-tab active" data-target="tab-overview">Overview</button>
                    <button class="ep-tab" data-target="tab-books">The Books</button>
                    ${customData.guest ? `<button class="ep-tab" data-target="tab-guest">Guest</button>` : ''}
                </div>
                
                <div class="ep-tab-content">
                    <!-- Overview Tab -->
                    <div class="tab-pane active" id="tab-overview">
                        <div class="overview-grid">
                            <div class="overview-text">
                                <h3 class="overview-heading">About This Episode</h3>
                                <p>${customData.description}</p>
                                
                                <div class="overview-meta-blocks">
                                    <div class="meta-block">
                                        <span class="meta-label">Released</span>
                                        <span class="meta-value">${new Date(videoData.pubDate).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</span>
                                    </div>
                                    <div class="meta-block">
                                        <span class="meta-label">Host</span>
                                        <span class="meta-value">Pram & Pras</span>
                                    </div>
                                </div>
                            </div>
                            <div class="overview-actions">
                                <h3 class="overview-heading">Listen On</h3>
                                <a href="${videoData.link}" target="_blank" class="action-btn yt-btn">
                                    <span class="btn-text">YouTube Video</span>
                                    <span class="btn-arrow">&rarr;</span>
                                </a>
                                <a href="#" class="action-btn sp-btn">
                                    <span class="btn-text">Spotify Podcast</span>
                                    <span class="btn-arrow">&rarr;</span>
                                </a>
                                <a href="#" class="action-btn apple-btn">
                                    <span class="btn-text">Apple Podcasts</span>
                                    <span class="btn-arrow">&rarr;</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Books Tab -->
                    <div class="tab-pane" id="tab-books">
                        <div class="book-titles-bar">
                            ${customData.books.map((b, i) => `<span class="book-indicator ${i === 0 ? 'active' : ''}">${b.title}</span>`).join('')}
                        </div>
                        <div class="book-showcase">
                            <!-- Book will be injected and animated via JS -->
                        </div>
                    </div>
        `;

        if (customData.guest) {
            html += `
                    <!-- Guest Tab -->
                    <div class="tab-pane" id="tab-guest">
                        <div class="guest-card">
                            <div class="guest-avatar"></div>
                            <div class="guest-info">
                                <h3>${customData.guest.name}</h3>
                                <p>${customData.guest.role}</p>
                            </div>
                        </div>
                    </div>
            `;
        }

        html += `
                </div>
            </div>
        `;

        this.overlay.innerHTML = html;
        this.attachEvents(customData);
    }

    attachEvents(customData) {
        document.getElementById('ep-close').onclick = () => this.close();
        
        const prevBtn = document.getElementById('ep-prev');
        if (prevBtn) prevBtn.onclick = () => this.navigate(-1);
        
        const nextBtn = document.getElementById('ep-next');
        if (nextBtn) nextBtn.onclick = () => this.navigate(1);
        
        // Tabs
        const tabs = this.overlay.querySelectorAll('.ep-tab');
        const panes = this.overlay.querySelectorAll('.tab-pane');
        
        tabs.forEach(tab => {
            tab.onclick = () => {
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(tab.dataset.target).classList.add('active');
            };
        });
        
        // Start Book Slideshow
        this.startBookSlideshow(customData.books);
    }
    
    startBookSlideshow(books) {
        if (this.bookTimeline) this.bookTimeline.kill();
        
        const showcase = this.overlay.querySelector('.book-showcase');
        const indicators = this.overlay.querySelectorAll('.book-indicator');
        if (!showcase || !books || books.length === 0) return;
        
        let currentIndex = 0;
        
        const showBook = (index) => {
            const book = books[index];
            
            // Update indicators
            indicators.forEach((ind, i) => {
                if (i === index) ind.classList.add('active');
                else ind.classList.remove('active');
            });
            
            // Inject Book HTML
            showcase.innerHTML = `
                <div class="book-card-hero">
                    <div class="book-cover-3d">
                        <div class="book-cover-inner">
                            <div class="book-front" style="background-color: ${book.coverColor};">
                                <div class="book-front-title">${book.title}</div>
                                <div class="book-front-author">${book.author}</div>
                            </div>
                            <div class="book-back"></div>
                            <div class="book-spine" style="background-color: #000;"></div>
                        </div>
                    </div>
                </div>
            `;
            
            const bookInner = showcase.querySelector('.book-cover-inner');
            const heroCard = showcase.querySelector('.book-card-hero');
            
            // GSAP Animation: Slide in, rotate slowly showing depth without showing the back, slide out
            this.bookTimeline = gsap.timeline({
                onComplete: () => {
                    // Only continue if the overlay is still open and we are still viewing books tab
                    const currentTab = this.overlay.querySelector('.ep-tab.active');
                    if (this.isOpen && currentTab && currentTab.dataset.target === 'tab-books') {
                        currentIndex = (currentIndex + 1) % books.length;
                        showBook(currentIndex);
                    }
                }
            });
            
            this.bookTimeline
                .fromTo(heroCard, { opacity: 0, scale: 0.8, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power4.out' }, 0)
                .fromTo(bookInner, { rotateY: -35 }, { rotateY: 35, duration: 4.5, ease: 'none' }, 0) // Slow rotation
                .to(heroCard, { opacity: 0, scale: 0.9, y: -40, duration: 1.0, ease: 'power3.inOut' }, 3.5); // Crossfade out early
        };
        
        // Wait a tiny bit for DOM to settle before animating
        setTimeout(() => {
            if (this.isOpen) showBook(currentIndex);
        }, 100);
    }

    navigate(dir) {
        if (this.isNavigating) return;
        this.isNavigating = true;
        
        this.currentIndex += dir;
        
        const content = this.overlay.querySelectorAll('.ep-left-content, .ep-right');
        const video = this.overlay.querySelector('.ep-video-container');
        const controls = this.overlay.querySelector('.ep-controls');
        
        // Slide out current content smoothly
        const tl = gsap.timeline({
            onComplete: () => {
                this.buildDOM();
                
                const newLeftContent = this.overlay.querySelector('.ep-left-content');
                const newVideo = this.overlay.querySelector('.ep-video-container');
                const newRightContent = this.overlay.querySelector('.ep-right');
                const newControls = this.overlay.querySelector('.ep-controls');
                
                // Split title for bounce effect
                const titleSplit = new SplitType(this.overlay.querySelector('.ep-title'), { types: 'words, chars' });
                
                gsap.set(titleSplit.chars, { y: 20, opacity: 0 });
                gsap.set([newLeftContent.children[0], newLeftContent.children[2], newVideo, newRightContent], { x: dir * 50, opacity: 0 });
                
                // Slide in new content with premium easing
                const inTl = gsap.timeline({ onComplete: () => this.isNavigating = false });
                
                inTl.to(newVideo, { x: 0, opacity: 1, duration: 1.0, ease: 'power4.out' }, 0)
                    .to([newLeftContent.children[0], newLeftContent.children[2]], { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, 0.1)
                    .to(titleSplit.chars, { y: 0, opacity: 1, duration: 0.8, stagger: 0.02, ease: 'back.out(1.5)' }, 0.2)
                    .to(newRightContent, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.1);
                    
                gsap.fromTo(newControls,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.6, ease: 'power2.out' }
                );
            }
        });
        
        tl.to([content, video], { x: dir * -50, opacity: 0, duration: 0.5, ease: 'power3.inOut', stagger: 0.05 }, 0)
          .to(controls, { opacity: 0, duration: 0.3, ease: 'power2.inOut' }, 0);
    }

    open(videos, index, sourceElement) {
        if (this.isOpen) return;
        this.isOpen = true;
        this.videos = videos;
        this.currentIndex = index;
        
        this.buildDOM();
        
        console.log("--- STARTING EPISODE TRANSITION ---");
        
        // Ensure sourceElement is valid and get its bounds
        if (!sourceElement) {
            console.error("No source element provided!");
            return;
        }
        const sourceRect = sourceElement.getBoundingClientRect();
        console.log("Source Element Rect:", sourceRect);
        
        // Fade in overlay base smoothly (instead of instantly snapping to black)
        gsap.to(this.overlay, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' });
        
        const leftPane = this.overlay.querySelector('.ep-left');
        const videoTarget = this.overlay.querySelector('#ep-video-target');
        const leftContent = this.overlay.querySelector('.ep-left-content');
        const rightPane = this.overlay.querySelector('.ep-right');
        const controls = this.overlay.querySelector('.ep-controls');
        
        const titleSplit = new SplitType(this.overlay.querySelector('.ep-title'), { types: 'words, chars' });
        
        // Hide overlay contents initially (keep title split hidden)
        gsap.set([videoTarget, leftContent.children[0], leftContent.children[2], rightPane, controls], { autoAlpha: 0 });
        gsap.set(titleSplit.chars, { y: 20, opacity: 0 });
        
        // Create a clone for the FLIP animation
        const clone = document.createElement('div');
        clone.style.position = 'fixed';
        clone.style.top = sourceRect.top + 'px';
        clone.style.left = sourceRect.left + 'px';
        clone.style.width = sourceRect.width + 'px';
        clone.style.height = sourceRect.height + 'px';
        clone.style.backgroundImage = `url('${videos[index].thumbnail}')`;
        clone.style.backgroundSize = 'cover';
        clone.style.backgroundPosition = 'center';
        clone.style.borderRadius = getComputedStyle(sourceElement).borderRadius || '12px';
        clone.style.zIndex = 10001; // Above overlay
        document.body.appendChild(clone);
        
        // Get target dimensions for the clone
        // We temporarily make videoTarget visible to measure it
        gsap.set(videoTarget, { autoAlpha: 1 });
        const targetRect = videoTarget.getBoundingClientRect();
        gsap.set(videoTarget, { autoAlpha: 0 }); // Hide again
        
        console.log("Target Rect for Clone:", targetRect);
        
        const tl = gsap.timeline();
        
        // Animate clone to target dimensions (slower, more premium curve)
        tl.to(clone, {
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            borderRadius: '12px',
            duration: 1.0,
            ease: 'expo.inOut',
            onComplete: () => {
                // Remove clone and show real target
                clone.remove();
                gsap.set(videoTarget, { autoAlpha: 1 });
            }
        })
        // Fade in the rest of the UI staggered with anticipation
        .to([leftContent.children[0], leftContent.children[2], rightPane, controls], {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        }, "-=0.2")
        // Title letter bounce
        .to(titleSplit.chars, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.02,
            ease: 'back.out(1.5)'
        }, "-=0.6");
        
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        
        gsap.to(this.overlay, {
            autoAlpha: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                this.overlay.innerHTML = '';
                document.body.style.overflow = '';
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.episodeExperience = new EpisodeExperience();
});
