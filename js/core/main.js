import { initAnimations } from '../features/animations.js';
import { initYouTube } from '../features/youtube.js';
import { EpisodeExperience } from '../features/episode.js';

document.addEventListener("DOMContentLoaded", () => {
    window.EpisodeManager = new EpisodeExperience();
    initAnimations();
    initYouTube();
});
