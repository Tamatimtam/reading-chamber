# JavaScript Features (`js/features/`)

This directory contains standalone feature controllers, animation engines, and third-party integrations.

---

## File Inventory

* `animations.js`: GSAP animation timelines, scroll triggers, hero entrance choreography, and the interactive sneaky hopping books footer caravan.
* `book_showcase.js`: The interactive 3D book cover engine. Handles 3D tilt calculations, mouse tracking, rotation damping, and page-turning effects.
* `episode.js`: `EpisodeExperience` class managing the episode modal popup, YouTube video embed player, and book showcase mount.
* `youtube.js`: Handles fetching latest YouTube uploads via RSS-to-JSON services with local fallback caching (`FALLBACK_EPISODES`).

---

## Rules & Best Practices

1. **Animation Cleanup**: Always clean up GSAP tweens and timelines when elements are hidden, unmounted, or reset (e.g. `gsap.killTweensOf()`).
2. **Event Delegation**: Use efficient mousemove damping (e.g. `requestAnimationFrame` or GSAP quickSetter) for 3D tilt tracking.
3. **Graceful Degrade**: If GSAP or Lenis fails to load from CDN, features should degrade gracefully without throwing uncaught exceptions.
4. **Max 500 Lines**: Keep each feature module under 500 lines.
