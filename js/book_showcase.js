/* ==========================================================================
   Book Showcase Module - 3D Gapless Book Rendering & Interactive Stage
   ========================================================================== */

export class BookShowcase {
    constructor(overlay) {
        this.overlay = overlay;
        this.books = [];
        this.currentIndex = 0;
        this.bookTimeline = null;
    }

    getDarkenedColor(colorHex, factor = 0.52) {
        if (!colorHex || typeof colorHex !== 'string') return '#181818';
        let hex = colorHex.replace('#', '').trim();
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        if (hex.length === 6) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            // Darken by factor, enforcing a minimum RGB value so it never melts into pure #000
            const darkR = Math.min(255, Math.max(25, Math.round(r * factor)));
            const darkG = Math.min(255, Math.max(25, Math.round(g * factor)));
            const darkB = Math.min(255, Math.max(25, Math.round(b * factor)));
            return `rgb(${darkR}, ${darkG}, ${darkB})`;
        }
        return '#1a1a1a';
    }

    init(books) {
        this.kill();
        this.books = books || [];
        if (this.books.length === 0) return;

        this.showcase = this.overlay.querySelector('#book-showcase-target');
        this.navItems = this.overlay.querySelectorAll('.book-nav-item');
        this.counter = this.overlay.querySelector('#book-counter');
        this.prevBtn = this.overlay.querySelector('#book-ctrl-prev');
        this.nextBtn = this.overlay.querySelector('#book-ctrl-next');

        if (!this.showcase) return;

        this.currentIndex = 0;

        // Attach click handlers to each book item in the left list
        this.navItems.forEach((item, idx) => {
            item.onclick = () => {
                if (this.currentIndex === idx) return;
                this.showBook(idx);
            };
        });

        // Prev & Next Buttons
        if (this.prevBtn) {
            this.prevBtn.onclick = () => {
                const prevIndex = (this.currentIndex - 1 + this.books.length) % this.books.length;
                this.showBook(prevIndex);
            };
        }
        if (this.nextBtn) {
            this.nextBtn.onclick = () => {
                const nextIndex = (this.currentIndex + 1) % this.books.length;
                this.showBook(nextIndex);
            };
        }

        // Render initial book immediately so DOM and 3D card are always ready
        this.showBook(0);
    }

    showBook(index) {
        this.kill();
        this.currentIndex = index;
        const book = this.books[this.currentIndex];
        if (!book) return;

        // 1. Update navigation list items & active expand state
        this.navItems.forEach((item, i) => {
            if (i === this.currentIndex) {
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });

        // 2. Update Counter
        if (this.counter) {
            this.counter.textContent = `${String(this.currentIndex + 1).padStart(2, '0')} / ${String(this.books.length).padStart(2, '0')}`;
        }

        // 3. Dynamically pick darkened color for spine & ambient glow
        const darkColor = this.getDarkenedColor(book.coverColor || '#2b5034', 0.52);
        const glowColor = book.coverColor ? `${book.coverColor}44` : 'rgba(214, 179, 69, 0.25)';

        // Spine styling: cylindrical highlight + edge bevel
        const spineStyle = `background: linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(255,255,255,0.2) 28%, rgba(0,0,0,0.12) 75%, rgba(0,0,0,0.65) 100%), ${darkColor}; border-left: 1px solid rgba(255,255,255,0.18); box-shadow: inset 1px 0 2px rgba(255,255,255,0.25), inset -2px 0 4px rgba(0,0,0,0.6);`;

        const coverStyle = book.coverImage
            ? `background-image: url('${book.coverImage}'); background-size: cover; background-position: center; border: 1px solid rgba(255,255,255,0.1);`
            : `background-color: ${book.coverColor};`;

        const titleAuthorHTML = book.coverImage
            ? ''
            : `<div class="book-front-title">${book.title}</div>
               ${book.author ? `<div class="book-front-author">${book.author}</div>` : ''}`;

        // Inject 100% Watertight 3D Geometry (Front, Back, Spine, Side Pages, Top Pages, Bottom Pages)
        this.showcase.innerHTML = `
            <div class="book-card-hero">
                <div class="book-cover-3d">
                    <div class="book-cover-inner">
                        <div class="book-front" style="${coverStyle}">
                            ${titleAuthorHTML}
                        </div>
                        <div class="book-back" style="background-color: ${darkColor};"></div>
                        <div class="book-spine" style="${spineStyle}"></div>
                        <div class="book-pages"></div>
                        <div class="book-pages-top"></div>
                        <div class="book-pages-bottom"></div>
                    </div>
                </div>
                <div class="book-ambient-glow" style="background: radial-gradient(circle, ${glowColor} 0%, transparent 70%);"></div>
            </div>
        `;

        const bookInner = this.showcase.querySelector('.book-cover-inner');
        const heroCard = this.showcase.querySelector('.book-card-hero');

        // GSAP 3D Animation: Enter, rotate smoothly showing depth and watertight spine, crossfade out
        this.bookTimeline = gsap.timeline({
            onComplete: () => {
                const currentTab = this.overlay.querySelector('.ep-tab.active');
                if (currentTab && currentTab.dataset.target === 'tab-books') {
                    const nextIndex = (this.currentIndex + 1) % this.books.length;
                    this.showBook(nextIndex);
                }
            }
        });

        this.bookTimeline
            .fromTo(heroCard, { opacity: 0, scale: 0.88, y: 35 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power4.out' }, 0)
            .fromTo(bookInner, { rotateY: -32 }, { rotateY: 28, duration: 4.6, ease: 'none' }, 0)
            .to(heroCard, { opacity: 0, scale: 0.92, y: -25, duration: 0.8, ease: 'power3.inOut' }, 3.8);
    }

    kill() {
        if (this.bookTimeline) {
            this.bookTimeline.kill();
            this.bookTimeline = null;
        }
    }
}
