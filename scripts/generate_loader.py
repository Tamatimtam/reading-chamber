import sys

css = """
.book {
    --color: var(--color-yellow);
    --duration: 6.8s;
    width: 32px;
    height: 12px;
    position: relative;
    margin: 32px 0 0 0;
    zoom: 1.5;
}

.book .inner {
    width: 32px;
    height: 12px;
    position: relative;
    transform-origin: 2px 2px;
    transform: rotateZ(-90deg);
    animation: book var(--duration) ease infinite;
}

.book .inner .left,
.book .inner .right {
    width: 60px;
    height: 4px;
    top: 0;
    border-radius: 2px;
    background: var(--color);
    position: absolute;
}
.book .inner .left {
    right: 28px;
    transform-origin: 58px 2px;
    transform: rotateZ(90deg);
    animation: left var(--duration) ease infinite;
}
.book .inner .right {
    left: 28px;
    transform-origin: 2px 2px;
    transform: rotateZ(-90deg);
    animation: right var(--duration) ease infinite;
}
.book .inner .middle {
    width: 32px;
    height: 12px;
    border: 4px solid var(--color);
    border-top: 0;
    border-radius: 0 0 9px 9px;
    transform: translateY(2px);
    box-sizing: border-box;
}
.book ul {
    margin: 0;
    padding: 0;
    list-style: none;
    position: absolute;
    left: 50%;
    top: 0;
}
.book ul li {
    height: 4px;
    border-radius: 2px;
    transform-origin: 100% 2px;
    width: 48px;
    right: 0;
    top: -10px;
    position: absolute;
    background: var(--color);
    transform: rotateZ(0deg) translateX(-18px);
    animation-duration: var(--duration);
    animation-timing-function: ease;
    animation-iteration-count: infinite;
}
"""

for i in range(1, 19):
    css += f".book ul li:nth-child({i}) {{ animation-name: page-{i}; }}\n"

for i in range(1, 19):
    delay = 1.94 + (i * 2.22)
    css += f"@keyframes page-{i} {{ {delay}% {{ transform: rotateZ(0deg) translateX(-18px); }} {delay + 8.6}% {{ transform: rotateZ(118deg) translateX(-18px); }} {delay + 58.6}% {{ transform: rotateZ(118deg) translateX(-18px); }} {delay + 67.2}% {{ transform: rotateZ(0deg) translateX(-18px); }} }}\n"

css += """
@keyframes left { 4% { transform: rotateZ(90deg); } 10% { transform: rotateZ(0deg); } 40% { transform: rotateZ(0deg); } 46% { transform: rotateZ(90deg); } 54% { transform: rotateZ(90deg); } 60% { transform: rotateZ(0deg); } 90% { transform: rotateZ(0deg); } 96% { transform: rotateZ(90deg); } }
@keyframes right { 4% { transform: rotateZ(-90deg); } 10% { transform: rotateZ(0deg); } 40% { transform: rotateZ(0deg); } 46% { transform: rotateZ(-90deg); } 54% { transform: rotateZ(-90deg); } 60% { transform: rotateZ(0deg); } 90% { transform: rotateZ(0deg); } 96% { transform: rotateZ(-90deg); } }
@keyframes book { 4% { transform: rotateZ(-90deg); } 10% { transform: rotateZ(0deg); transform-origin: 2px 2px; } 40% { transform: rotateZ(0deg); transform-origin: 2px 2px; } 40.01% { transform-origin: 30px 2px; } 46% { transform: rotateZ(90deg); } 54% { transform: rotateZ(90deg); } 60% { transform: rotateZ(0deg); transform-origin: 30px 2px; } 90% { transform: rotateZ(0deg); transform-origin: 30px 2px; } 90.01% { transform-origin: 2px 2px; } 96% { transform: rotateZ(-90deg); } }
"""

# Now write to file
with open("styles.css", "r") as f:
    content = f.read()

# Replace everything from .book-loader down (except .loader-title)
import re
new_content = re.sub(r"\.book-loader \{.*?(?=\.loader-title \{)", css, content, flags=re.DOTALL)

with open("styles.css", "w") as f:
    f.write(new_content)

print("Updated CSS!")
