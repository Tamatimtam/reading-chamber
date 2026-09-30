/* ==========================================================================
   Episodes Archive - DOM Renderers (Spotlight & Grid Cards)
   ========================================================================== */

export function renderSpotlightCard(spotlight, container, episodeExperience, allEpisodes) {
    if (!spotlight || !container) return;

    const releaseDate = spotlight.pubDate && !isNaN(new Date(spotlight.pubDate).getTime())
        ? new Date(spotlight.pubDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'September 2026';

    const custom = spotlight.custom || {};
    const books = custom.books || [];

    // Build mini books avatar preview
    let booksPreviewHtml = '';
    if (books.length > 0) {
        const previewCovers = books.slice(0, 4).map(b => `
            <div class="stack-book-thumb" style="background-image: url('${b.coverImage || 'assets/books/odyssey.jpg'}'); background-color: ${b.coverColor || '#121211'}" title="${b.title}"></div>
        `).join('');

        booksPreviewHtml = `
            <div class="spotlight-books-preview">
                <div class="books-avatar-stack">
                    ${previewCovers}
                </div>
                <span class="stack-count-badge">
                    <i class="fa-solid fa-book-open"></i> ${books.length} Buku Dibahas di Episode Ini
                </span>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="archive-spotlight" id="featured-spotlight-card">
            <div class="spotlight-glow"></div>
            
            <div class="spotlight-info">
                <div class="spotlight-meta-line">
                    <span class="spotlight-kicker">LATEST RELEASE // EP. ${spotlight.epNum}</span>
                    ${custom.guest ? `
                        <span class="spotlight-guest">
                            <i class="fa-solid fa-user"></i> ft. ${custom.guest.name} <span class="guest-role-sub">(${custom.guest.role})</span>
                        </span>
                    ` : ''}
                    <span class="spotlight-date">
                        <i class="fa-regular fa-calendar"></i> ${releaseDate}
                    </span>
                </div>

                <h2 class="spotlight-title">${spotlight.title}</h2>
                <p class="spotlight-desc">${custom.description || 'Simak perbincangan mendalam di episode terbaru The Reading Chamber.'}</p>

                ${booksPreviewHtml}

                <div class="spotlight-actions">
                    <button class="btn-spotlight-enter" id="spotlight-enter-btn">
                        <i class="fa-solid fa-play"></i> Masuk Chamber (${books.length} Buku 3D) &rarr;
                    </button>
                    <a href="${spotlight.link}" target="_blank" class="btn-spotlight-yt">
                        <i class="fa-brands fa-youtube"></i> Tonton di YouTube
                    </a>
                </div>
            </div>

            <div class="spotlight-visual" id="spotlight-visual-trigger">
                <div class="spotlight-thumb" id="spotlight-thumb-el" style="background-image: url('${spotlight.thumbnail}')"></div>
                <div class="spotlight-overlay-play">
                    <div class="spotlight-play-pill">
                        <i class="fa-solid fa-play"></i> BUKA CHAMBER
                    </div>
                </div>
            </div>
        </div>
    `;

    const openSpotlightChamber = () => {
        const thumbEl = document.getElementById('spotlight-thumb-el') || container;
        episodeExperience.open(allEpisodes, 0, thumbEl);
    };

    const enterBtn = document.getElementById('spotlight-enter-btn');
    const visualTrigger = document.getElementById('spotlight-visual-trigger');
    if (enterBtn) enterBtn.onclick = openSpotlightChamber;
    if (visualTrigger) visualTrigger.onclick = openSpotlightChamber;
}

export function renderEpisodesGrid(filteredEpisodes, allEpisodes, gridContainer, countLabel, episodeExperience, onReset, animateCards = false) {
    if (!gridContainer) return;

    if (countLabel) {
        countLabel.textContent = `Menampilkan ${filteredEpisodes.length} Dari ${allEpisodes.length} Episode`;
    }

    if (filteredEpisodes.length === 0) {
        gridContainer.innerHTML = `
            <div class="archive-empty-state">
                <div class="empty-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
                <h3 class="empty-title">Tidak Ada Episode Ditemukan</h3>
                <p class="empty-desc">Coba gunakan kata kunci lain atau pilih kategori topik di atas.</p>
                <button class="btn-reset-filters" id="btn-reset-filters">Reset Semua Filter & Pencarian</button>
            </div>
        `;
        const resetBtn = document.getElementById('btn-reset-filters');
        if (resetBtn && typeof onReset === 'function') {
            resetBtn.onclick = onReset;
        }
        return;
    }

    gridContainer.innerHTML = filteredEpisodes.map((ep, index) => {
        const releaseDate = ep.pubDate && !isNaN(new Date(ep.pubDate).getTime())
            ? new Date(ep.pubDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'Episode Chamber';

        const custom = ep.custom || {};
        const books = custom.books || [];

        // Mini shelf
        let shelfHtml = '';
        if (books.length > 0) {
            const bookThumbs = books.slice(0, 3).map(b => `
                <div class="mini-book-thumb" style="background-image: url('${b.coverImage || 'assets/books/odyssey.jpg'}'); background-color: ${b.coverColor || '#121211'}" title="${b.title}"></div>
            `).join('');

            shelfHtml = `
                <div class="shelf-left">
                    <div class="shelf-thumbs">${bookThumbs}</div>
                    <span class="shelf-books-label">
                        <i class="fa-solid fa-book-open"></i> ${books.length} Buku
                    </span>
                </div>
            `;
        } else {
            shelfHtml = `<span class="no-books-label"><i class="fa-regular fa-comments"></i> Diskusi Terbuka & Eksplorasi Ide</span>`;
        }

        // Excerpt
        const excerpt = custom.description 
            ? custom.description.split('\n')[0] 
            : 'Eksplorasi literatur, gagasan, dan percakapan bermakna di The Reading Chamber.';

        return `
            <article class="ep-card" id="ep-card-${ep.id}" data-index="${index}">
                <div class="ep-card-media" data-ep-index="${index}">
                    <div class="ep-card-thumb" style="background-image: url('${ep.thumbnail}')"></div>
                    <div class="ep-card-badges">
                        <span class="ep-num-pill">EP. ${ep.epNum}</span>
                        <span class="ep-date-pill">${releaseDate}</span>
                    </div>
                    <div class="ep-card-play-overlay">
                        <div class="ep-card-play-btn">
                            <i class="fa-solid fa-play"></i> Masuk Chamber
                        </div>
                    </div>
                </div>

                <div class="ep-card-body">
                    ${custom.guest ? `
                        <div class="ep-guest-text">
                            <i class="fa-solid fa-user"></i> ft. ${custom.guest.name}
                        </div>
                    ` : ''}
                    <h3 class="ep-card-title">${ep.title}</h3>
                    <p class="ep-card-excerpt">${excerpt}</p>

                    <div class="ep-card-books-shelf">
                        ${shelfHtml}
                    </div>
                </div>

                <div class="ep-card-footer">
                    <button class="btn-card-enter">
                        <span>Buka Chamber</span> &rarr;
                    </button>
                    <a href="${ep.link}" target="_blank" class="btn-card-yt" title="Tonton di YouTube" aria-label="YouTube Link">
                        <i class="fa-brands fa-youtube"></i>
                    </a>
                </div>
            </article>
        `;
    }).join('');

    // Attach click handlers to cards
    filteredEpisodes.forEach((ep, index) => {
        const card = document.getElementById(`ep-card-${ep.id}`);
        if (!card) return;

        const mediaThumb = card.querySelector('.ep-card-thumb');
        const mediaWrap = card.querySelector('.ep-card-media');
        const enterBtn = card.querySelector('.btn-card-enter');
        const titleEl = card.querySelector('.ep-card-title');

        const launchEpisode = (e) => {
            if (e.target.closest('.btn-card-yt')) return;
            episodeExperience.open(filteredEpisodes, index, mediaThumb || card);
        };

        if (mediaWrap) mediaWrap.onclick = launchEpisode;
        if (enterBtn) enterBtn.onclick = launchEpisode;
        if (titleEl) titleEl.onclick = launchEpisode;
    });

    // Re-filter animation (only when triggered by filter/search change)
    if (animateCards && typeof gsap !== 'undefined') {
        gsap.fromTo('.ep-card', 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out' }
        );
    }
}
