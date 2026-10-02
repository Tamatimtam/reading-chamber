export function initAnimations() {
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
    const tl = gsap.timeline({ paused: true });

    // Initial state
    gsap.set('.nav, .nav-immune', { y: -100, opacity: 0 });
    gsap.set(heroTitleSplit.chars, { y: 100, opacity: 0 });
    gsap.set('.hero-desc', { opacity: 0, x: -20 });
    gsap.set('.hero-bg-yellow', { scale: 0.8, opacity: 0 });
    gsap.set('.hero-buttons > *', { opacity: 0, y: 20 });
    gsap.set('.collage-item', { y: 150, opacity: 0 });

    tl.to('.nav, .nav-immune', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        delay: 0.2
    })
    .to('.hero-bg-yellow', {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out'
    }, "-=0.8")
    .to(heroTitleSplit.chars, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.02,
        ease: 'power4.out'
    }, "-=1.2")
    .to('.hero-desc', {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, "-=0.6")
    .to('.collage-item', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2, // Puppet show staggered entry
        ease: 'power4.out'
    }, "-=1.0")
    .to('.hero-buttons > *', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    }, "-=0.6");

    // 4. Parallax Collage

    // Puppet show parallax effect
    const heroScroll = {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    };

    let mm = gsap.matchMedia();
    
    mm.add("(min-width: 1024px)", () => {
        gsap.to('.collage-bg', { yPercent: 20, ease: "none", scrollTrigger: heroScroll });
        gsap.to('.collage-thinker', { yPercent: 25, ease: "none", scrollTrigger: heroScroll });
        gsap.to('.collage-hosts', { yPercent: 5, ease: "none", scrollTrigger: heroScroll });
    });

    mm.add("(max-width: 1023px)", () => {
        // Reduced parallax for mobile so elements don't fly off screen
        gsap.to('.collage-bg', { yPercent: 5, ease: "none", scrollTrigger: heroScroll });
        gsap.to('.collage-thinker', { yPercent: 10, ease: "none", scrollTrigger: heroScroll });
        gsap.to('.collage-hosts', { yPercent: 2, ease: "none", scrollTrigger: heroScroll });
    });
    // table stays static to anchor the bottom edge

    // Start loader out animation
    const initPage = () => {
        // Stop scroll until loader is done
        window.lenis.stop();
        
        gsap.to('.loader-content', {
            y: -50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.in',
            delay: 1.5
        });
        
        gsap.to('#loader', {
            yPercent: -100,
            duration: 1.2,
            ease: 'expo.inOut',
            delay: 1.8,
            onComplete: () => {
                document.getElementById('loader').style.display = 'none';
                window.lenis.start();
                tl.play(); // Play hero animation
            }
        });
    };

    if (document.readyState === 'complete') {
        initPage();
    } else {
        window.addEventListener('load', initPage);
    }

    // 5. Scroll Reveals for Latest Episode
    gsap.from('.latest-info > *', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '.latest-episode',
            start: "top 75%",
        }
    });

    gsap.from('.latest-featured-card', {
        scale: 0.9,
        y: 60,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '.latest-episode',
            start: "top 75%",
        }
    });
    
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

    // 6b. Sneaky Real Books Patrol & Hopping Animation
    const footerZone = document.getElementById('sneaky-footer-zone');
    const caravan = document.getElementById('sneaky-caravan');

    if (footerZone && caravan && typeof gsap !== 'undefined') {
        const books = caravan.querySelectorAll('.sneaky-real-book');
        const cta = document.getElementById('sneaky-reveal-cta');
        const track = document.getElementById('sneaky-books-track');

        const SNEAKY_COVERS = [
            { src: 'assets/books/ep-latest-02-why-we-are-restless.png', title: 'Why We Are Restless' },
            { src: 'assets/books/odyssey.jpg', title: 'The Odyssey' },
            { src: 'assets/books/ep-latest-07-catatan-pinggir.jpg', title: 'Catatan Pinggir' },
            { src: 'assets/books/ep-latest-05-winning.png', title: 'Winning' },
            { src: 'assets/books/ep-latest-01-menuju-dewasa.png', title: 'Menuju Dewasa' },
            { src: 'assets/books/ep-latest-03-birth-of-hedonism.png', title: 'The Birth of Hedonism' },
            { src: 'assets/books/ep-latest-04-hedonism-handbook.png', title: 'The Hedonism Handbook' },
            { src: 'assets/books/ep-latest-09-how-to-stand-up-to-a-dictator.jpg', title: 'How to Stand Up to a Dictator' },
            { src: 'assets/books/ep-latest-10-dictators-handbook.jpg', title: 'The Dictator\'s Handbook' },
            { src: 'assets/books/ep-latest-08-mr-clean-marie-muhammad.jpg', title: 'Mr. Clean' },
            { src: 'assets/books/ep-0ytdhPJoWRA-04-berserk.jpg', title: 'Berserk' },
            { src: 'assets/books/ep-0ytdhPJoWRA-05-life-of-pi.jpg', title: 'Life of Pi' }
        ];

        function randomizeCaravanCovers() {
            const shuffled = [...SNEAKY_COVERS].sort(() => 0.5 - Math.random());
            books.forEach((book, idx) => {
                const img = book.querySelector('.sbook-cover-img');
                const chosen = shuffled[idx % shuffled.length];
                if (img && chosen) {
                    img.src = chosen.src;
                    img.alt = chosen.title;
                }
            });
        }

        let isHovered = false;
        let patrolTween = null;
        let hopTweens = [];

        // Animate individual books hopping (bouncing up and landing with soft squash)
        function startHopping() {
            stopHopping();
            books.forEach((book, i) => {
                const shadow = book.querySelector('.sbook-shadow');
                const delay = i * 0.16;
                
                const bTween = gsap.to(book, {
                    y: -24,
                    rotation: i % 2 === 0 ? 8 : -8,
                    duration: 0.25,
                    ease: 'power1.out',
                    repeat: -1,
                    yoyo: true,
                    repeatDelay: 0.16,
                    delay: delay
                });
                hopTweens.push(bTween);

                if (shadow) {
                    const sTween = gsap.to(shadow, {
                        scaleX: 0.7,
                        opacity: 0.25,
                        duration: 0.25,
                        repeat: -1,
                        yoyo: true,
                        repeatDelay: 0.16,
                        delay: delay
                    });
                    hopTweens.push(sTween);
                }
            });
        }

        function stopHopping() {
            hopTweens.forEach(t => t.kill());
            hopTweens = [];
            gsap.killTweensOf(books);
        }

        // Continuous horizontal travel across footer:
        // Starts offscreen left (-380px), sneaks across, and hops offscreen right
        function startCaravanPatrol() {
            if (patrolTween) patrolTween.kill();
            stopHopping();

            // Randomize covers every time a new batch sets off
            randomizeCaravanCovers();

            // Reset books to ready state
            gsap.set(books, { y: 0, opacity: 1, scale: 1, scaleX: 1, scaleY: 1, rotation: 0 });
            const shadows = track.querySelectorAll('.sbook-shadow');
            gsap.set(shadows, { scaleX: 1, opacity: 0.6 });

            const screenW = window.innerWidth || 1200;
            const startX = -380;
            const endX = screenW + 100;
            const travelDuration = Math.max(13, screenW / 90);

            patrolTween = gsap.fromTo(caravan, 
                { x: startX },
                {
                    x: endX,
                    duration: travelDuration,
                    ease: 'none',
                    repeat: -1,
                    onRepeat: () => {
                        if (isHovered) return;
                        randomizeCaravanCovers();
                        gsap.set(books, { opacity: 1, y: 0, scale: 1 });
                    }
                }
            );

            // Re-ignite hopping loop so they always hop on every patrol run
            startHopping();
        }

        // Initialize first randomized run
        startCaravanPatrol();

        // Window resize handler for dynamic screen width
        window.addEventListener('resize', () => {
            if (!isHovered) {
                startCaravanPatrol();
            }
        });

        // Hover Event: "Caught! Run for cover!"
        track.addEventListener('mouseenter', () => {
            isHovered = true;
            if (patrolTween) patrolTween.pause();
            stopHopping();

            // 1. Shock Startle Jump
            gsap.to(books, {
                y: -36,
                scaleY: 1.22,
                scaleX: 0.9,
                rotation: (i) => [-16, 12, -18, 20][i],
                duration: 0.14,
                ease: 'power2.out',
                onComplete: () => {
                    // 2. Dive into hiding / scatter below bottom edge
                    gsap.to(books, {
                        y: 120,
                        opacity: 0,
                        rotation: (i) => [-40, 30, -50, 45][i],
                        scale: 0.5,
                        duration: 0.26,
                        stagger: 0.03,
                        ease: 'power3.in'
                    });

                    // 3. Pop out "Buka Perpustakaan" CTA
                    if (cta) {
                        gsap.fromTo(cta,
                            { y: 20, scale: 0.82, opacity: 0 },
                            { y: 0, scale: 1, opacity: 1, duration: 0.38, ease: 'back.out(2.2)', pointerEvents: 'auto' }
                        );
                    }
                }
            });
        });

        // Mouse Leave Event: Coast is clear, brand new batch comes out from offscreen!
        track.addEventListener('mouseleave', () => {
            isHovered = false;

            // Hide the CTA
            if (cta) {
                gsap.to(cta, {
                    y: 18,
                    scale: 0.88,
                    opacity: 0,
                    duration: 0.22,
                    ease: 'power2.in',
                    pointerEvents: 'none'
                });
            }

            // Immediately halt tweens and stash caravan offscreen left
            stopHopping();
            if (patrolTween) patrolTween.kill();
            gsap.set(caravan, { x: -380 });
            gsap.set(books, { opacity: 0, y: 120 });

            // Launch a fresh batch with hopping fully active after natural pause
            gsap.delayedCall(0.35, () => {
                startCaravanPatrol();
            });
        });
    }

    // 7. Page Transition Logic
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            // Check if it's an internal link
            if (href && href !== '#' && !href.startsWith('http') && anchor.target !== '_blank') {
                e.preventDefault();
                const loader = document.getElementById('loader');
                
                if (loader) {
                    loader.style.display = 'flex';
                    // Reset positions for slide down
                    gsap.set('#loader', { yPercent: -100 });
                    gsap.set('.loader-content', { y: -50, opacity: 0 });
                    
                    // Slide loader down to cover screen
                    gsap.to('#loader', {
                        yPercent: 0,
                        duration: 0.8,
                        ease: 'expo.inOut'
                    });
                    
                    // Fade content in, then navigate
                    gsap.to('.loader-content', {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        delay: 0.4,
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
