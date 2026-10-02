/* ==========================================================================
   Books Library - Main Application Controller
   The Reading Chamber Perpustakaan
   ========================================================================== */

import { BOOKS_DATABASE, BOOK_CATEGORIES } from './books_data.js';
import { renderCategoryPills, renderBooksGrid, populateBookModal } from './books_renderer.js';

class BooksApp {
    constructor() {
        this.books = [...BOOKS_DATABASE];
        this.filteredBooks = [...this.books];
        this.activeCategory = 'all';
        this.searchQuery = '';
        this.sortBy = 'default';
        this.activeBook = null;

        this.init();
    }

    init() {
        this.setupLenis();
        this.setupPageTransition();
        this.renderPills();
        this.renderGrid(false);
        this.setupSearchAndControls();
        this.setupModal();
        this.prepareEntranceStates();
        this.dismissLoader();

        // Check hash for direct book linking (e.g. #book-1)
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const target = this.books.find(b => b.id === hash || b.title.toLowerCase().includes(decodeURIComponent(hash).toLowerCase()));
            if (target) {
                setTimeout(() => this.openBookModal(target), 800);
            }
        }
    }

    setupLenis() {
        if (typeof Lenis === 'undefined') return;

        window.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });

        function raf(time) {
            window.lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            window.lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                window.lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    renderPills() {
        const container = document.getElementById('books-categories-bar');
        renderCategoryPills(container, BOOK_CATEGORIES, this.books, this.activeCategory, (selectedCategory) => {
            this.activeCategory = selectedCategory;
            this.applyFilters(true);
        });
    }

    renderGrid(animate = false) {
        const grid = document.getElementById('books-grid');
        const countLabel = document.getElementById('books-count-label');
        renderBooksGrid(
            grid,
            countLabel,
            this.filteredBooks,
            this.books.length,
            (book) => this.openBookModal(book),
            () => this.resetFilters(),
            animate
        );
    }

    setupSearchAndControls() {
        const searchInput = document.getElementById('books-search-input');
        const clearBtn = document.getElementById('books-search-clear');
        const sortSelect = document.getElementById('books-sort-select');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                if (clearBtn) {
                    clearBtn.style.display = this.searchQuery.length > 0 ? 'block' : 'none';
                }
                this.applyFilters(true);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                this.searchQuery = '';
                clearBtn.style.display = 'none';
                this.applyFilters(true);
                if (searchInput) searchInput.focus();
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFilters(true);
            });
        }
    }

    resetFilters() {
        const searchInput = document.getElementById('books-search-input');
        const clearBtn = document.getElementById('books-search-clear');
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        this.searchQuery = '';
        this.activeCategory = 'all';
        this.sortBy = 'default';
        const sortSelect = document.getElementById('books-sort-select');
        if (sortSelect) sortSelect.value = 'default';

        this.renderPills();
        this.applyFilters(true);
    }

    applyFilters(animate = true) {
        this.filteredBooks = this.books.filter(book => {
            const matchesCat = this.activeCategory === 'all' || book.category === this.activeCategory;
            if (!matchesCat) return false;

            if (!this.searchQuery) return true;
            const q = this.searchQuery;
            return book.title.toLowerCase().includes(q) 
                || (book.author || '').toLowerCase().includes(q) 
                || (book.description || '').toLowerCase().includes(q);
        });

        if (this.sortBy === 'title-asc') {
            this.filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
        } else if (this.sortBy === 'author-asc') {
            this.filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
        } else if (this.sortBy === 'episodes-desc') {
            this.filteredBooks.sort((a, b) => b.episodes.length - a.episodes.length);
        } else {
            this.filteredBooks.sort((a, b) => {
                const epA = a.episodes[0] ? a.episodes[0].epNum : 0;
                const epB = b.episodes[0] ? b.episodes[0].epNum : 0;
                return epB - epA;
            });
        }

        this.renderGrid(animate);
    }

    setupModal() {
        const backdrop = document.getElementById('book-detail-modal');
        const closeBtn = document.getElementById('modal-close-btn');

        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) this.closeBookModal();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeBookModal());
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeBookModal();
        });
    }

    openBookModal(book) {
        this.activeBook = book;
        const modal = document.getElementById('book-detail-modal');
        const card = document.getElementById('modal-card-box');
        if (!modal || !card) return;

        populateBookModal(book, {
            stage: document.getElementById('modal-stage-mount'),
            category: document.getElementById('modal-badge-cat'),
            title: document.getElementById('modal-book-title'),
            author: document.getElementById('modal-book-author'),
            desc: document.getElementById('modal-book-desc'),
            epList: document.getElementById('modal-episodes-list')
        });

        modal.style.display = 'flex';

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
            gsap.fromTo(card, { scale: 0.9, y: 40, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.5)' });
        }
    }

    closeBookModal() {
        const modal = document.getElementById('book-detail-modal');
        const card = document.getElementById('modal-card-box');
        if (!modal) return;

        if (typeof gsap !== 'undefined' && card) {
            gsap.to(card, { scale: 0.95, y: 20, opacity: 0, duration: 0.2, ease: 'power2.in' });
            gsap.to(modal, {
                opacity: 0,
                duration: 0.25,
                delay: 0.05,
                ease: 'power2.in',
                onComplete: () => {
                    modal.style.display = 'none';
                    this.activeBook = null;
                }
            });
        } else {
            modal.style.display = 'none';
            this.activeBook = null;
        }
    }

    prepareEntranceStates() {
        if (typeof gsap === 'undefined') return;
        gsap.set('.nav, .nav-immune', { y: -100, autoAlpha: 0 });
        gsap.set('.books-tag-kicker', { y: 25, scale: 0.85, autoAlpha: 0 });
        gsap.set('.books-title .line', { y: 40, autoAlpha: 0 });
        gsap.set('.books-description', { y: 25, autoAlpha: 0 });
        gsap.set('.books-controls-bar', { y: 30, autoAlpha: 0 });
        gsap.set('.books-grid-header', { autoAlpha: 0 });
        gsap.set('.book-exhibit-item, .book-card', { y: 45, scale: 0.94, autoAlpha: 0 });
    }

    dismissLoader() {
        const loader = document.getElementById('loader');
        if (!loader || typeof gsap === 'undefined') {
            if (loader) loader.style.display = 'none';
            this.playEntranceAnimation();
            return;
        }

        gsap.to('.loader-content', {
            y: -50,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.in',
            delay: 0.8
        });

        gsap.to('#loader', {
            yPercent: -100,
            duration: 0.9,
            ease: 'expo.inOut',
            delay: 1.0,
            onComplete: () => {
                loader.style.display = 'none';
                this.playEntranceAnimation();
            }
        });
    }

    playEntranceAnimation() {
        if (typeof gsap === 'undefined') return;

        const tl = gsap.timeline();
        tl.to('.nav, .nav-immune', { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power4.out' })
          .to('.books-tag-kicker', { y: 0, scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(2)' }, "-=0.4")
          .to('.books-title .line', { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: 'back.out(1.8)' }, "-=0.4")
          .to('.books-description', { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }, "-=0.3")
          .to('.books-controls-bar', { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, "-=0.3")
          .to('.books-grid-header', { autoAlpha: 1, duration: 0.4 }, "-=0.3")
          .to('.book-exhibit-item, .book-card', { y: 0, autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.035, ease: 'power3.out' }, "-=0.25");
    }

    setupPageTransition() {
        document.querySelectorAll('a').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('http') && anchor.target !== '_blank') {
                    e.preventDefault();
                    const loader = document.getElementById('loader');

                    if (loader && typeof gsap !== 'undefined') {
                        loader.style.display = 'flex';
                        gsap.set('#loader', { yPercent: -100 });
                        gsap.set('.loader-content', { y: -50, opacity: 0 });

                        gsap.to('#loader', { yPercent: 0, duration: 0.7, ease: 'expo.inOut' });
                        gsap.to('.loader-content', {
                            y: 0,
                            opacity: 1,
                            duration: 0.4,
                            delay: 0.3,
                            ease: 'power3.out',
                            onComplete: () => { window.location.href = href; }
                        });
                    } else {
                        window.location.href = href;
                    }
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BooksApp();
});
