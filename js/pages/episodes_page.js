/* ==========================================================================
   Episodes Archive - Main Application Controller
   ========================================================================== */

import { EpisodeExperience } from '../features/episode.js';
import { buildEpisodeArchive, fetchLiveEpisodes } from './episodes_data.js';
import { renderSpotlightCard, renderEpisodesGrid } from './episodes_renderer.js';

class EpisodesArchiveApp {
    constructor() {
        this.allEpisodes = [];
        this.filteredEpisodes = [];
        this.activeFilter = 'all';
        this.searchQuery = '';
        this.sortBy = 'newest';
        this.titleSplit = null;
        this.episodeExperience = new EpisodeExperience();
        window.EpisodeManager = this.episodeExperience;

        this.init();
    }

    async init() {
        this.setupLenis();
        this.setupPageTransition();
        this.allEpisodes = buildEpisodeArchive();
        this.filteredEpisodes = [...this.allEpisodes];

        const spotlightContainer = document.getElementById('archive-spotlight-mount');
        renderSpotlightCard(this.allEpisodes[0], spotlightContainer, this.episodeExperience, this.allEpisodes);

        // Initial render without card stagger yet (master entrance timeline will orchestrate it)
        this.renderCurrentGrid(false);
        this.setupControls();
        this.prepareEntranceStates();
        this.dismissLoader();

        // Background live YouTube fetch
        fetchLiveEpisodes((fetchedEps) => {
            const existingIds = new Set(this.allEpisodes.map(e => e.id));
            let hasNew = false;
            fetchedEps.forEach(fe => {
                if (!existingIds.has(fe.id)) {
                    this.allEpisodes.unshift(fe);
                    hasNew = true;
                }
            });
            if (hasNew) {
                this.applyFiltersAndSort(true);
            }
        });
    }

    renderCurrentGrid(animate = false) {
        const grid = document.getElementById('episodes-grid');
        const countLabel = document.getElementById('grid-result-count');
        renderEpisodesGrid(
            this.filteredEpisodes,
            this.allEpisodes,
            grid,
            countLabel,
            this.episodeExperience,
            () => this.resetFilters(),
            animate
        );
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

    setupControls() {
        // Search Input
        const searchInput = document.getElementById('archive-search-input');
        const clearBtn = document.getElementById('search-clear-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                if (clearBtn) {
                    clearBtn.style.display = this.searchQuery.length > 0 ? 'block' : 'none';
                }
                this.applyFiltersAndSort(true);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                this.searchQuery = '';
                clearBtn.style.display = 'none';
                this.applyFiltersAndSort(true);
                if (searchInput) searchInput.focus();
            });
        }

        // Tag Filter Pills
        const filterPills = document.querySelectorAll('.filter-pill');
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.activeFilter = pill.dataset.filter || 'all';
                this.applyFiltersAndSort(true);
            });
        });

        // Sort Select
        const sortSelect = document.getElementById('sort-episodes');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFiltersAndSort(true);
            });
        }

        // Surprise Me Button
        const surpriseBtn = document.getElementById('btn-surprise-me');
        if (surpriseBtn) {
            surpriseBtn.addEventListener('click', () => {
                this.handleSurpriseMe();
            });
        }
    }

    applyFiltersAndSort(animate = true) {
        this.filteredEpisodes = this.allEpisodes.filter(ep => {
            let matchesCategory = false;
            if (this.activeFilter === 'all') {
                matchesCategory = true;
            } else if (this.activeFilter === 'guest') {
                matchesCategory = !!(ep.custom && ep.custom.guest);
            } else {
                matchesCategory = ep.tags.includes(this.activeFilter);
            }

            if (!matchesCategory) return false;

            if (!this.searchQuery) return true;

            const q = this.searchQuery;
            const titleMatch = ep.title.toLowerCase().includes(q);
            const descMatch = (ep.custom.description || '').toLowerCase().includes(q);
            const guestMatch = ep.custom.guest && ep.custom.guest.name.toLowerCase().includes(q);
            const bookMatch = ep.custom.books && ep.custom.books.some(b => 
                (b.title || '').toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q)
            );

            return titleMatch || descMatch || guestMatch || bookMatch;
        });

        if (this.sortBy === 'newest') {
            this.filteredEpisodes.sort((a, b) => b.epNum - a.epNum);
        } else if (this.sortBy === 'oldest') {
            this.filteredEpisodes.sort((a, b) => a.epNum - b.epNum);
        } else if (this.sortBy === 'books') {
            this.filteredEpisodes.sort((a, b) => b.bookCount - a.bookCount);
        }

        this.renderCurrentGrid(animate);
    }

    resetFilters() {
        this.activeFilter = 'all';
        this.searchQuery = '';
        this.sortBy = 'newest';

        const searchInput = document.getElementById('archive-search-input');
        if (searchInput) searchInput.value = '';

        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) clearBtn.style.display = 'none';

        const filterPills = document.querySelectorAll('.filter-pill');
        filterPills.forEach(p => {
            if (p.dataset.filter === 'all') p.classList.add('active');
            else p.classList.remove('active');
        });

        const sortSelect = document.getElementById('sort-episodes');
        if (sortSelect) sortSelect.value = 'newest';

        this.applyFiltersAndSort(true);
    }

    handleSurpriseMe() {
        if (this.filteredEpisodes.length === 0) {
            this.resetFilters();
        }

        const randomIndex = Math.floor(Math.random() * this.filteredEpisodes.length);
        const randomEp = this.filteredEpisodes[randomIndex];
        const card = document.getElementById(`ep-card-${randomEp.id}`);

        if (card) {
            if (window.lenis) {
                window.lenis.scrollTo(card, { offset: -120, duration: 1.2 });
            } else {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            card.classList.remove('highlighted-surprise');
            void card.offsetWidth;
            card.classList.add('highlighted-surprise');

            setTimeout(() => {
                const thumb = card.querySelector('.ep-card-thumb') || card;
                this.episodeExperience.open(this.filteredEpisodes, randomIndex, thumb);
            }, 850);
        }
    }

    prepareEntranceStates() {
        if (typeof gsap === 'undefined') return;

        // Split text for title
        if (typeof SplitType !== 'undefined') {
            this.titleSplit = new SplitType('.archive-title .line', { types: 'words, chars' });
        }

        // Hide all elements initially before the loader slides up
        gsap.set('.nav, .nav-immune', { y: -100, autoAlpha: 0 });
        gsap.set('.archive-tag-kicker', { y: 25, scale: 0.85, autoAlpha: 0 });

        if (this.titleSplit && this.titleSplit.chars) {
            gsap.set(this.titleSplit.chars, { y: 60, autoAlpha: 0, rotate: 6 });
        } else {
            gsap.set('.archive-title', { y: 40, autoAlpha: 0 });
        }

        gsap.set('.archive-description', { y: 25, autoAlpha: 0 });
        gsap.set('#featured-spotlight-card', { y: 50, scale: 0.94, autoAlpha: 0 });
        gsap.set('.archive-controls-bar', { y: 30, autoAlpha: 0 });
        gsap.set('.episodes-grid-header', { autoAlpha: 0 });
        gsap.set('.ep-card', { y: 45, scale: 0.96, autoAlpha: 0 });
    }

    playMasterEntranceAnimation() {
        if (typeof gsap === 'undefined') return;

        const tl = gsap.timeline();

        // 1. Navigation slide down
        tl.to('.nav, .nav-immune', {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power4.out'
        })
        // 2. Tag kicker pops in with energetic spring
        .to('.archive-tag-kicker', {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.6,
            ease: 'back.out(2.2)'
        }, "-=0.4");

        // 3. Bebas Neue Title characters bounce up sequentially
        if (this.titleSplit && this.titleSplit.chars) {
            tl.to(this.titleSplit.chars, {
                y: 0,
                autoAlpha: 1,
                rotate: 0,
                duration: 0.65,
                stagger: 0.02,
                ease: 'back.out(1.8)'
            }, "-=0.45");
        } else {
            tl.to('.archive-title', {
                y: 0,
                autoAlpha: 1,
                duration: 0.7,
                ease: 'power4.out'
            }, "-=0.4");
        }

        // 4. Description subtitle fades in
        tl.to('.archive-description', {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: 'power3.out'
        }, "-=0.35")

        // 5. Spotlight Featured Card scales into place
        .to('#featured-spotlight-card', {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.85,
            ease: 'expo.out'
        }, "-=0.3")

        // 6. Sticky controls bar drops in
        .to('.archive-controls-bar', {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: 'power3.out'
        }, "-=0.45")

        // 7. Results count header
        .to('.episodes-grid-header', {
            autoAlpha: 1,
            duration: 0.4
        }, "-=0.35")

        // 8. Grid cards cascade in one by one like cards dealt on a table
        .to('.ep-card', {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.07,
            ease: 'power3.out'
        }, "-=0.3");
    }

    dismissLoader() {
        const loader = document.getElementById('loader');
        if (!loader || typeof gsap === 'undefined') {
            if (loader) loader.style.display = 'none';
            this.playMasterEntranceAnimation();
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
                this.playMasterEntranceAnimation();
            }
        });
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

                        gsap.to('#loader', {
                            yPercent: 0,
                            duration: 0.7,
                            ease: 'expo.inOut'
                        });

                        gsap.to('.loader-content', {
                            y: 0,
                            opacity: 1,
                            duration: 0.4,
                            delay: 0.3,
                            ease: 'power3.out',
                            onComplete: () => {
                                window.location.href = href;
                            }
                        });
                    } else {
                        window.location.href = href;
                    }
                }
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new EpisodesArchiveApp();
});
