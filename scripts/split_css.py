import os
import re

os.makedirs('css', exist_ok=True)

with open('styles.css', 'r') as f:
    content = f.read()

# Define section headers
sections = {
    'base': r'(:root.*?)(?=\/\* Nav \*\/)',
    'nav': r'(\/\* Nav \*\/.*?)(?=\/\* Hero Section \*\/)',
    'hero': r'(\/\* Hero Section \*\/.*?)(?=\/\* Latest Episode \*\/)',
    'latest_episode': r'(\/\* Latest Episode \*\/.*?)(?=\/\* About Section \*\/)',
    'about': r'(\/\* About Section \*\/.*?)(?=\/\* Loader \*\/)',
    'loader': r'(\/\* Loader \*\/.*)'
}

for name, regex in sections.items():
    match = re.search(regex, content, re.DOTALL)
    if match:
        filename = f"css/{name}.css"
        with open(filename, 'w') as f:
            f.write(match.group(1).strip() + "\n")
        print(f"Created {filename}")

# Create new styles.css
with open('styles.css', 'w') as f:
    f.write("""@import url('css/base.css');
@import url('css/nav.css');
@import url('css/hero.css');
@import url('css/latest_episode.css');
@import url('css/about.css');
@import url('css/loader.css');
""")
    
print("Updated styles.css with imports.")
