import xml.etree.ElementTree as ET
import base64
import os

tree = ET.parse('assets/hero-collage.svg')
root = tree.getroot()
defs = root.find("{http://www.w3.org/2000/svg}defs")

img_map = {
    'img1': 'collage-athens.png',
    'img2': 'collage-thinker.png',
    'img3': 'collage-parthenon.png',
    'img4': 'collage-hosts.png'
}

for elem in defs.findall("{http://www.w3.org/2000/svg}image"):
    id_attr = elem.attrib.get('id')
    href = elem.attrib.get('href', elem.attrib.get('{http://www.w3.org/1999/xlink}href'))
    
    if id_attr in img_map and href:
        # href is like data:image/png;base64,....
        header, encoded = href.split(",", 1)
        data = base64.b64decode(encoded)
        
        filename = f"assets/{img_map[id_attr]}"
        with open(filename, "wb") as f:
            f.write(data)
        print(f"Extracted {filename}")
