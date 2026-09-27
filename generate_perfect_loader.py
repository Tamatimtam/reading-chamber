import re

css = """
.book {
    --color: var(--color-yellow);
    --duration: 3.5s;
    width: 80px;
    height: 12px;
    position: relative;
    margin: 32px 0 0 0;
    animation: bookBounce var(--duration) ease-in-out infinite;
}

.book .spine {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 10px;
    border: 4px solid var(--color);
    border-top: none;
    border-radius: 0 0 10px 10px;
    animation: spine var(--duration) ease-in-out infinite;
    box-sizing: border-box;
}

.book .cover-left,
.book .cover-right {
    position: absolute;
    bottom: 0;
    width: 40px;
    height: 4px;
    background: var(--color);
    border-radius: 2px;
}

.book .cover-left {
    right: 50%;
    transform-origin: right center;
    animation: coverLeft var(--duration) ease-in-out infinite;
}

.book .cover-right {
    left: 50%;
    transform-origin: left center;
    animation: coverRight var(--duration) ease-in-out infinite;
}

.book .pages {
    position: absolute;
    bottom: 4px; /* sit on top of the covers */
    left: 50%;
    width: 36px;
    height: 4px;
    z-index: 10;
}

.book .page {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 36px;
    height: 4px;
    background: var(--color);
    border-radius: 2px;
    transform-origin: right center;
}

.book .page:nth-child(1) { animation: page1 var(--duration) ease-in-out infinite; }
.book .page:nth-child(2) { animation: page2 var(--duration) ease-in-out infinite; }
.book .page:nth-child(3) { animation: page3 var(--duration) ease-in-out infinite; }
.book .page:nth-child(4) { animation: page4 var(--duration) ease-in-out infinite; }
.book .page:nth-child(5) { animation: page5 var(--duration) ease-in-out infinite; }
.book .page:nth-child(6) { animation: page6 var(--duration) ease-in-out infinite; }

@keyframes bookBounce {
    0%, 10% { transform: scale(1.35) translateY(10px); }
    20%, 80% { transform: scale(1.35) translateY(0px); }
    90%, 100% { transform: scale(1.35) translateY(10px); }
}

@keyframes spine {
    0%, 10% { opacity: 0; transform: translateX(-50%) translateY(5px) scale(0.5); }
    20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1); }
    90%, 100% { opacity: 0; transform: translateX(-50%) translateY(5px) scale(0.5); }
}

@keyframes coverLeft {
    0%, 10% { transform: rotate(90deg); }
    20%, 80% { transform: rotate(0deg); }
    90%, 100% { transform: rotate(90deg); }
}

@keyframes coverRight {
    0%, 10% { transform: rotate(-90deg); }
    20%, 80% { transform: rotate(0deg); }
    90%, 100% { transform: rotate(-90deg); }
}

@keyframes page1 {
    0%, 19% { transform: rotate(180deg); opacity: 0; }
    20% { transform: rotate(180deg); opacity: 1; }
    25% { transform: rotate(180deg); }
    45% { transform: rotate(0deg); }
    80% { transform: rotate(0deg); opacity: 1; }
    81%, 100% { opacity: 0; }
}
@keyframes page2 {
    0%, 19% { transform: rotate(180deg); opacity: 0; }
    20% { transform: rotate(180deg); opacity: 1; }
    33% { transform: rotate(180deg); }
    53% { transform: rotate(0deg); }
    80% { transform: rotate(0deg); opacity: 1; }
    81%, 100% { opacity: 0; }
}
@keyframes page3 {
    0%, 19% { transform: rotate(180deg); opacity: 0; }
    20% { transform: rotate(180deg); opacity: 1; }
    41% { transform: rotate(180deg); }
    61% { transform: rotate(0deg); }
    80% { transform: rotate(0deg); opacity: 1; }
    81%, 100% { opacity: 0; }
}
@keyframes page4 {
    0%, 19% { transform: rotate(180deg); opacity: 0; }
    20% { transform: rotate(180deg); opacity: 1; }
    49% { transform: rotate(180deg); }
    69% { transform: rotate(0deg); }
    80% { transform: rotate(0deg); opacity: 1; }
    81%, 100% { opacity: 0; }
}
@keyframes page5 {
    0%, 19% { transform: rotate(180deg); opacity: 0; }
    20% { transform: rotate(180deg); opacity: 1; }
    57% { transform: rotate(180deg); }
    77% { transform: rotate(0deg); }
    80% { transform: rotate(0deg); opacity: 1; }
    81%, 100% { opacity: 0; }
}
@keyframes page6 {
    0%, 19% { transform: rotate(180deg); opacity: 0; }
    20% { transform: rotate(180deg); opacity: 1; }
    65% { transform: rotate(180deg); }
    85% { transform: rotate(0deg); } /* Wait, this exceeds 80%. Let's fix this! */
    86% { transform: rotate(0deg); opacity: 1; }
    87%, 100% { opacity: 0; }
}
"""

# Let's adjust page6 so it fits in the 20-80 window
css = css.replace("65% { transform: rotate(180deg); }\n    85% { transform: rotate(0deg); } /* Wait, this exceeds 80%. Let's fix this! */\n    86% { transform: rotate(0deg); opacity: 1; }\n    87%, 100% { opacity: 0; }", 
"57% { transform: rotate(180deg); }\n    77% { transform: rotate(0deg); }\n    80% { transform: rotate(0deg); opacity: 1; }\n    81%, 100% { opacity: 0; }")

# Actually, I'll just rewrite the python string for pages
pages_css = ""
start_pct = 22
duration = 18
step = 8

for i in range(1, 7):
    p_start = start_pct + (i-1)*step
    p_end = p_start + duration
    pages_css += f"""
@keyframes page{i} {{
    0%, 19% {{ transform: rotate(180deg); opacity: 0; }}
    20% {{ transform: rotate(180deg); opacity: 1; }}
    {p_start}% {{ transform: rotate(180deg); }}
    {p_end}% {{ transform: rotate(0deg); }}
    80% {{ transform: rotate(0deg); opacity: 1; }}
    81%, 100% {{ opacity: 0; }}
}}
"""
css = re.sub(r"@keyframes page1 \{.*\}", pages_css, css, flags=re.DOTALL)

with open("styles.css", "r") as f:
    content = f.read()

new_content = re.sub(r"\.book \{.*?(?=\.loader-title \{)", css, content, flags=re.DOTALL)

with open("styles.css", "w") as f:
    f.write(new_content)

print("Injected perfect loader CSS!")
