/* ==========================================================================
   Books Library - DOM Renderers (Cards, Category Pills & Detail Modal)
   The Reading Chamber Perpustakaan
   ========================================================================== */

export function renderCategoryPills(container, categories, allBooks, activeCategory, onSelect) {
    if (!container) return;

    container.innerHTML = categories.map(cat => {
        const count = cat.id === 'all' 
            ? allBooks.length 
            : allBooks.filter(b => b.category === cat.id).length;

        return `
            <button class="book-filter-pill ${cat.id === activeCategory ? 'active' : ''}" data-category="${cat.id}">
                ${cat.label} (${count})
            </button>
        `;
    }).join('');

    container.querySelectorAll('.book-filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.book-filter-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (typeof onSelect === 'function') {
                onSelect(btn.dataset.category || 'all');
            }
        });
    });
}

export function renderBooksGrid(grid, countLabel, filteredBooks, totalCount, onOpenModal, onReset, animate = false) {
    if (!grid) return;

    if (countLabel) {
        countLabel.innerHTML = `
            <span>Koleksi Terpilih: <strong>${filteredBooks.length}</strong> / ${totalCount} Buku</span>
            <span class="books-wip-badge">GALERI 3D</span>
        `;
    }

    if (filteredBooks.length === 0) {
        grid.innerHTML = `
            <div class="books-empty-state">
                <i class="fa-solid fa-book-open-reader"></i>
                <h3>Buku Tidak Ditemukan</h3>
                <p>Coba gunakan kata kunci lain atau pilih kategori literatur di atas.</p>
                <button class="btn-books-reset" id="btn-books-reset">Reset Pencarian &amp; Filter</button>
            </div>
        `;
        const resetBtn = document.getElementById('btn-books-reset');
        if (resetBtn && typeof onReset === 'function') {
            resetBtn.addEventListener('click', onReset);
        }
        return;
    }

    const staggers = [0, 32, 14, 42, 18, 48, 8, 26];
    const tilts = [-1.5, 1.8, -0.6, 2.0, 0, -1.2, 1.4, -1.8];
    const heights = [295, 310, 285, 315, 300, 290];
    const widths = [200, 208, 195, 205, 200];

    grid.innerHTML = filteredBooks.map((book, idx) => {
        const epCount = book.episodes.length;
        const primaryEp = book.episodes[0];
        const epLabel = primaryEp ? `EP. ${primaryEp.epNum}` : 'DISKUSI';
        const epTag = epCount > 1 ? `${epLabel} (+${epCount - 1} Ep)` : epLabel;

        const staggerY = staggers[idx % staggers.length];
        const tiltDeg = tilts[idx % tilts.length];
        const bHeight = heights[idx % heights.length];
        const bWidth = widths[idx % widths.length];
        const hasRibbon = (idx % 3 === 0);

        return `
            <article class="book-exhibit-item" id="book-${book.id}" data-id="${book.id}" 
                     style="--stagger-y: ${staggerY}px; --tilt: ${tiltDeg}deg; --w: ${bWidth}px; --h: ${bHeight}px;"
                     tabindex="0" role="button" aria-label="${book.title} oleh ${book.author}">
                
                <!-- 3D Standalone Book Construction -->
                <div class="book-3d-chassis">
                    <!-- Front Hardcover -->
                    <div class="book-cover-face" style="background-image: url('${book.coverImage}'); background-color: ${book.coverColor || '#121211'};">
                        <div class="cover-glare-overlay"></div>
                        <div class="cover-spine-crease"></div>
                        ${hasRibbon ? '<div class="book-ribbon-tail"></div>' : ''}
                    </div>

                    <!-- 3D Book Thickness (Right & Top Edges) -->
                    <div class="book-pages-side"></div>
                    <div class="book-pages-top"></div>
                    <div class="book-spine-side"></div>
                </div>

                <!-- Contact Ambient Floor Shadow -->
                <div class="book-chassis-shadow"></div>

                <!-- Floating Info Card (Reveals on Hover) -->
                <div class="book-hover-infobox">
                    <span class="hover-info-badge">${book.category.toUpperCase()}</span>
                    <h3 class="hover-info-title">${book.title}</h3>
                    <p class="hover-info-author"><i class="fa-solid fa-feather-pointed"></i> ${book.author}</p>
                    <div class="hover-info-meta">
                        <span class="hover-ep-count"><i class="fa-solid fa-headphones"></i> ${epTag}</span>
                        <span class="hover-cta-pill">Sinopsis &rarr;</span>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Attach click events & micro-interactions
    filteredBooks.forEach((book) => {
        const item = document.getElementById(`book-${book.id}`);
        if (!item) return;

        if (typeof onOpenModal === 'function') {
            item.addEventListener('click', () => onOpenModal(book));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenModal(book);
                }
            });
        }

        // 3D Mouse Parallax on Desktop
        const chassis = item.querySelector('.book-3d-chassis');
        if (chassis && window.matchMedia('(hover: hover)').matches) {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                chassis.style.transform = `rotateY(${-18 + x * 14}deg) rotateX(${6 - y * 12}deg) translateY(-22px) scale(1.08)`;
            });

            item.addEventListener('mouseleave', () => {
                chassis.style.transform = '';
            });
        }
    });

    // Re-filter entrance animation
    if (animate && typeof gsap !== 'undefined') {
        gsap.fromTo('.book-exhibit-item', 
            { y: 35, opacity: 0, scale: 0.94 },
            { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.035, ease: 'power3.out' }
        );
    }
}

export function populateBookModal(book, elements) {
    if (!book || !elements) return;

    if (elements.stage) {
        elements.stage.innerHTML = `
            <div class="modal-book-3d" style="background-image: url('${book.coverImage}'); background-color: ${book.coverColor || '#121211'};">
                <div class="book-spine-crease"></div>
            </div>
        `;
    }

    if (elements.category) elements.category.textContent = book.category;
    if (elements.title) elements.title.textContent = book.title;
    if (elements.author) {
        elements.author.innerHTML = `<i class="fa-solid fa-feather-pointed"></i> Penulis: ${book.author}`;
    }
    if (elements.desc) elements.desc.textContent = book.description;

    if (elements.epList) {
        elements.epList.innerHTML = book.episodes.map(ep => `
            <div class="modal-ep-card">
                <div class="modal-ep-thumb" style="background-image: url('${ep.thumbnail}')"></div>
                <div class="modal-ep-info">
                    <span class="modal-ep-num">EPISODE ${ep.epNum} ${ep.guest ? `&bull; ft. ${ep.guest}` : ''}</span>
                    <h4 class="modal-ep-name">${ep.title}</h4>
                </div>
                <div class="modal-ep-actions">
                    <a href="episodes.html" class="btn-modal-ep btn-modal-ep-open">
                        <span>Buka di Arsip</span> &rarr;
                    </a>
                    <a href="${ep.link}" target="_blank" class="btn-modal-ep btn-modal-ep-yt" title="Tonton di YouTube">
                        <i class="fa-brands fa-youtube"></i>
                    </a>
                </div>
            </div>
        `).join('');
    }
}
