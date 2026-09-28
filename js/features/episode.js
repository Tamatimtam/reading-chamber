import { episodeData } from '../core/data.js';
import { BookShowcase } from './book_showcase.js';

export class EpisodeExperience {
    constructor() {
        this.overlay = document.getElementById('episode-overlay');
        this.isOpen = false;
        this.videos = [];
        this.currentIndex = 0;
        this.isNavigating = false;
        this.bookShowcase = new BookShowcase(this.overlay);
        
        this.handleKeyDown = this.handleKeyDown.bind(this);
        window.addEventListener('keydown', this.handleKeyDown);
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

        const releaseDate = videoData.pubDate && !isNaN(new Date(videoData.pubDate).getTime())
            ? new Date(videoData.pubDate).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})
            : (videoData.timeAgo || videoData.pubDate || 'Recently Released');

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
                    ${customData.books && customData.books.length > 0 ? `<button class="ep-tab" data-target="tab-books">The Books</button>` : ''}
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
                                        <span class="meta-value">${releaseDate}</span>
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
                    
                    ${customData.books && customData.books.length > 0 ? `
                    <!-- Books Tab -->
                    <div class="tab-pane" id="tab-books">
                        <div class="books-stage">
                            <!-- Left: Interactive Book Selector -->
                            <div class="books-list-panel">
                                <div class="books-panel-header">
                                    <span class="books-panel-title">BOOKS DISCUSSED</span>
                                    <span class="books-panel-count">${customData.books.length} TITLES</span>
                                </div>
                                <div class="books-nav-list" id="books-nav-list">
                                    ${customData.books.map((b, i) => `
                                        <div class="book-nav-item ${i === 0 ? 'active' : ''}" data-index="${i}">
                                            <span class="book-nav-num">${String(i + 1).padStart(2, '0')}</span>
                                            <div class="book-nav-info">
                                                <h4 class="book-nav-title">${b.title}</h4>
                                                ${b.author ? `<p class="book-nav-author">${b.author}</p>` : ''}
                                            </div>
                                            <div class="book-nav-glow" style="--book-color: ${b.coverColor || '#d6b345'}"></div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- Right: 3D Book Showcase -->
                            <div class="books-hero-panel">
                                <div class="book-showcase" id="book-showcase-target">
                                    <!-- 3D Book injected & animated via JS -->
                                </div>
                                <div class="book-stage-controls">
                                    <button class="book-ctrl-btn" id="book-ctrl-prev" title="Previous Book">&larr;</button>
                                    <div class="book-counter" id="book-counter">01 / ${String(customData.books.length).padStart(2, '0')}</div>
                                    <button class="book-ctrl-btn" id="book-ctrl-next" title="Next Book">&rarr;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    ` : ''}
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
                const target = document.getElementById(tab.dataset.target);
                if (target) target.classList.add('active');
                
                if (tab.dataset.target === 'tab-books') {
                    this.bookShowcase.showBook(this.bookShowcase.currentIndex || 0);
                } else {
                    this.bookShowcase.kill();
                }
            };
        });
        
        // Initialize Book Showcase module
        if (customData.books && customData.books.length > 0) {
            this.bookShowcase.init(customData.books);
        } else {
            this.bookShowcase.kill();
        }
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
        this.bookShowcase.kill();
        
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
