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

    gsap.to('.collage-bg', { yPercent: 20, ease: "none", scrollTrigger: heroScroll });
    gsap.to('.collage-thinker', { yPercent: 25, ease: "none", scrollTrigger: heroScroll });
    gsap.to('.collage-hosts', { yPercent: 5, ease: "none", scrollTrigger: heroScroll });
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
