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
        
        window.openEpisode = this.open.bind(this);
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
                        <p>${customData.description}</p>
                    </div>
                    
                    <!-- Books Tab -->
                    <div class="tab-pane" id="tab-books">
                        <div class="books-container">
        `;

        customData.books.forEach(book => {
            html += `
                <div class="book-card">
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
                    <div class="book-details">
                        <h4>${book.title}</h4>
                        <p>${book.author}</p>
                    </div>
                </div>
            `;
        });

        html += `
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
        this.attachEvents();
    }

    attachEvents() {
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
        
        // 3D Mouse Tracking for books
        const bookCards = this.overlay.querySelectorAll('.book-card');
        bookCards.forEach(card => {
            const inner = card.querySelector('.book-cover-inner');
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(inner, { rotateY: x * 20, rotateX: -y * 20, duration: 0.5, ease: 'power1.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(inner, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
            });
        });
    }

    navigate(dir) {
        this.currentIndex += dir;
        
        // Simple fade transition for content replacement
        gsap.to(this.overlay, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                this.buildDOM();
                gsap.to(this.overlay, { opacity: 1, duration: 0.3 });
            }
        });
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
        
        // Hide overlay contents initially
        gsap.set([videoTarget, leftContent, rightPane, controls], { autoAlpha: 0 });
        
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
        
        // Animate clone to target dimensions
        tl.to(clone, {
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            borderRadius: '12px',
            duration: 0.8,
            ease: 'power4.inOut',
            onComplete: () => {
                // Remove clone and show real target
                clone.remove();
                gsap.set(videoTarget, { autoAlpha: 1 });
            }
        })
        // Fade in the rest of the UI staggered
        .to([leftContent, rightPane, controls], {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        }, "-=0.3");
        
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
