"""Generate responsive poster previews without altering original JPEGs. Requires Pillow."""
from pathlib import Path
from PIL import Image
import re
root=Path(__file__).resolve().parents[1]
source=(root/'design.html').read_text()
paths=sorted(set(re.findall(r'data-full-src="(images/[^"/]+\.jpg)"',source)))
for src in paths:
    original=root/src
    with Image.open(original) as im:
        for width in (480,960):
            output=root/'images/previews'/f'{original.stem}-{width}.webp'
            output.parent.mkdir(parents=True,exist_ok=True)
            preview=im.copy()
            preview.thumbnail((width,10000),Image.Resampling.LANCZOS)
            preview.save(output,'WEBP',quality=83,method=6)
print(f'Generated {len(paths)*2} previews. Original images unchanged.')
