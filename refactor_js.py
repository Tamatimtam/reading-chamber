import os
import re

with open('script.js', 'r') as f:
    script_content = f.read()

with open('episode.js', 'r') as f:
    episode_content = f.read()

# 1. js/data.js
data_js = re.search(r'const episodeData = \{.*?\n\};\n', episode_content, re.DOTALL).group(0)
with open('js/data.js', 'w') as f:
    f.write(f"export {data_js}")

# 2. js/youtube.js
yt_match = re.search(r'// 7\. Fetch YouTube Data.*', script_content, re.DOTALL)
yt_code = yt_match.group(0)
yt_code = yt_code.replace("window.openEpisode(videos, index", "window.EpisodeManager.open(videos, index")
yt_code = yt_code.replace("window.openEpisode(videos, 0", "window.EpisodeManager.open(videos, 0")

with open('js/youtube.js', 'w') as f:
    f.write("""export function initYouTube() {
""" + "\n".join(["    " + line for line in yt_code.split('\n')]) + """
}
""")

# 3. js/episode.js
episode_class = re.search(r'class EpisodeExperience \{.*', episode_content, re.DOTALL).group(0)
# Fix the bind and exports
episode_class = episode_class.replace("window.openEpisode = this.open.bind(this);", "")

with open('js/episode.js', 'w') as f:
    f.write("import { episodeData } from './data.js';\n\n")
    f.write("export " + episode_class)

# 4. js/animations.js
anim_code = script_content.replace(yt_match.group(0), "")
# Remove DOMContentLoaded wrapper
anim_code = re.sub(r'^document\.addEventListener\("DOMContentLoaded", \(\) => \{\n', '', anim_code)
anim_code = re.sub(r'\}\);$', '', anim_code.strip())

with open('js/animations.js', 'w') as f:
    f.write("""export function initAnimations() {
""" + anim_code + """
}
""")

# 5. js/main.js
with open('js/main.js', 'w') as f:
    f.write("""import { initAnimations } from './animations.js';
import { initYouTube } from './youtube.js';
import { EpisodeExperience } from './episode.js';

document.addEventListener("DOMContentLoaded", () => {
    window.EpisodeManager = new EpisodeExperience();
    initAnimations();
    initYouTube();
});
""")

print("Refactored JS into modules!")
