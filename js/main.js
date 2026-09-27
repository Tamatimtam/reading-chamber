import { initAnimations } from './animations.js';
import { initYouTube } from './youtube.js';
import { EpisodeExperience } from './episode.js';

document.addEventListener("DOMContentLoaded", () => {
    window.EpisodeManager = new EpisodeExperience();
    initAnimations();
    initYouTube();
});
