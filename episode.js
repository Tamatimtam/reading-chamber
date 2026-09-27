// Mocked Data Map: Video ID -> Episode Data (Including Books and Guest)
const episodeData = {
    // Ep 50 - Jadi Dewasa Nggak Ada Buku Panduannya
    'wgNGCtnfdng': {
        guest: {
            name: 'Okki Sutanto',
            role: 'Writer & Thinker',
            photo: ''
        },
        books: [
            {
                title: 'The Psychology of Money',
                author: 'Morgan Housel',
                coverColor: '#2b5034'
            },
            {
                title: 'Meditations',
                author: 'Marcus Aurelius',
                coverColor: '#1a1a19'
            },
            {
                title: 'Atomic Habits',
                author: 'James Clear',
                coverColor: '#d6b345'
            }
        ]
    },
    // Ep 49 - Kenapa Demokrasi Tidak Akan Pernah Sempurna
    'HbUO9Are2Hw': {
        guest: null,
        books: [
            {
                title: 'Public Choice Theory',
                author: 'Gordon Tullock',
                coverColor: '#0f5de8'
            },
            {
                title: 'The Logic of Collective Action',
                author: 'Mancur Olson',
                coverColor: '#8a2b2b'
            }
        ]
    },
    // Default fallback
    'default': {
        guest: null,
        books: [
            {
                title: 'The Republic',
                author: 'Plato',
                coverColor: '#1a1a19'
            },
            {
                title: 'Crime and Punishment',
                author: 'Fyodor Dostoevsky',
                coverColor: '#4f1616'
            },
            {
                title: 'The Odyssey',
                author: 'Homer',
                coverColor: '#0f5de8'
            }
        ]
    }
};

class EpisodeExperience {
    constructor() {
        this.overlay = document.getElementById('episode-overlay');
        this.isOpen = false;
        this.setupGlobals();
    }

    setupGlobals() {
        // Expose open function globally so index.js can call it
        window.openEpisode = this.open.bind(this);
    }

    buildDOM(videoData, customData) {
        // 1. Build Hero
        let html = `
            <button class="ep-close" id="ep-close">&times;</button>
            <div class="ep-hero">
                <div class="ep-hero-bg" style="background-image: url('${videoData.thumbnail}');"></div>
                <div class="ep-hero-content">
                    <div class="ep-meta">
                        <span>LATEST EPISODE</span>
                        <span>•</span>
                        <span>AUDIO AVAILABLE</span>
                    </div>
                    <h1 class="ep-title">${videoData.title}</h1>
                    <button class="ep-play-audio">
                        <span class="play-icon">▶</span>
                        Play Episode
                    </button>
                </div>
            </div>
            
            <div class="ep-books-section">
                <h2 class="ep-books-title">The Books We Discussed</h2>
                <div class="book-list">
        `;

        // 2. Build Books
        customData.books.forEach((book, i) => {
            html += `
                <div class="book-item" data-index="${i}">
                    <div class="book-info">
                        <div class="book-title">${book.title}</div>
                        <div class="book-author">${book.author}</div>
                    </div>
                    <div class="book-cover-3d">
                        <div class="book-cover-inner">
                            <div class="book-front" style="background-color: ${book.coverColor};"></div>
                            <div class="book-back"></div>
                            <div class="book-spine" style="background-color: ${this.darkenColor(book.coverColor)};"></div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
        `;

        // 3. Build Guest if exists
        if (customData.guest) {
            html += `
                <div class="ep-guest">
                    <div class="guest-photo"></div>
                    <div class="guest-info">
                        <h3>${customData.guest.name}</h3>
                        <p>${customData.guest.role}</p>
                        <a href="#" class="btn btn-primary">View Socials &rarr;</a>
                    </div>
                </div>
            `;
        }

        html += `</div>`; // Close books section
        this.overlay.innerHTML = html;
        
        // Setup Close
        document.getElementById('ep-close').onclick = () => this.close();
        
        // Setup Book 3D Interactions
        this.setupBookInteractions();
    }
    
    setupBookInteractions() {
        const items = this.overlay.querySelectorAll('.book-item');
        
        items.forEach(item => {
            const cover = item.querySelector('.book-cover-3d');
            const inner = item.querySelector('.book-cover-inner');
            
            // GSAP hover choreo
            item.addEventListener('mouseenter', () => {
                gsap.to(cover, {
                    opacity: 1,
                    rotateY: -30,
                    rotateX: 10,
                    x: -20,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(cover, {
                    opacity: 0,
                    rotateY: -20,
                    rotateX: 10,
                    x: 0,
                    duration: 0.5,
                    ease: 'power2.in'
                });
            });
            
            // Subtle cursor tracking
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                gsap.to(inner, {
                    rotateY: x * 20,
                    rotateX: -y * 20,
                    duration: 0.5,
                    ease: 'power1.out'
                });
            });
        });
    }

    open(videoData, sourceElement) {
        if (this.isOpen) return;
        this.isOpen = true;
        
        const videoId = videoData.link.split('v=')[1] || videoData.link.split('/').pop();
        const customData = episodeData[videoId] || episodeData['default'];
        
        this.buildDOM(videoData, customData);
        
        // Transition FLIP logic
        const sourceRect = sourceElement.getBoundingClientRect();
        
        gsap.set(this.overlay, { autoAlpha: 1 });
        
        const heroBg = this.overlay.querySelector('.ep-hero-bg');
        const heroContent = this.overlay.querySelector('.ep-hero-content');
        const books = gsap.utils.toArray(this.overlay.querySelectorAll('.book-item'));
        const closeBtn = this.overlay.querySelector('.ep-close');
        
        // Start heroBg at source dimensions
        gsap.set(heroBg, {
            position: 'fixed',
            top: sourceRect.top,
            left: sourceRect.left,
            width: sourceRect.width,
            height: sourceRect.height,
            borderRadius: '12px'
        });
        
        gsap.set([heroContent, closeBtn, ...books], { autoAlpha: 0, y: 50 });
        
        const tl = gsap.timeline();
        
        tl.to(heroBg, {
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            borderRadius: '0px',
            duration: 0.8,
            ease: 'power4.inOut',
            onComplete: () => {
                gsap.set(heroBg, { position: 'absolute' });
            }
        })
        .to([heroContent, closeBtn], {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        }, "-=0.2")
        .to(books, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.2)'
        }, "-=0.4");
        
        // Prevent body scroll (background)
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

    darkenColor(color) {
        // Very basic mock darken for spine
        return color; 
    }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    window.episodeExperience = new EpisodeExperience();
});
