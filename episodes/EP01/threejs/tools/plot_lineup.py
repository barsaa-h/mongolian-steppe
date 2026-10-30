"""CPU bone diagnostic only; GPU run replaces the required sheet with skinned meshes."""
import json
import sys
from pathlib import Path
from PIL import Image, ImageDraw

here = Path(__file__).resolve().parent.parent
data = (json.loads((here / 'out/retarget-skeletons.json').read_text()) if '--gpu' not in sys.argv
        else {'panels': [{'name': name} for name in json.loads((here / 'clips/manifest.json').read_text())['actors']['ganaa']]})
image = Image.new('RGB', (1440, 1240), '#171b23')
draw = ImageDraw.Draw(image)
for index, panel in enumerate(data['panels'] if '--gpu' not in sys.argv else []):
    ox, oy = (index % 3) * 480, (index // 3) * 310
    draw.text((ox+12, oy+10), f"{panel['name']} / CMU {panel['source']}", fill='white')
    for j, sample in enumerate(panel['samples']):
        # Three-quarter projection exposes knee/elbow bend and ankle height.
        for kind, color in [('source', '#54c3e8'), ('target', '#ffb154')]:
            points = sample[kind]
            root = points['root']
            def project(p):
                return (ox+80+j*155+95*((p[0]-root[0])*.85+(p[2]-root[2])*.53), oy+254-110*p[1])
            for a, b in data['edges']:
                draw.line((project(points[a]), project(points[b])), fill=color, width=2 if kind=='target' else 1)
            for p in points.values():
                x, y = project(p)
                draw.ellipse((x-2,y-2,x+2,y+2), fill=color)
        draw.text((ox+45+j*155, oy+275), f"{sample['time']:.2f}s", fill='#e5e5e5')
    draw.line((ox+8,oy+254,ox+472,oy+254),fill='#58606d')
draw.multiline_text((980, 955), 'CPU BONE DIAGNOSTIC\nOrange: MPFB / Cyan: CMU\n3 times per clip / world metres\nMesh, wrist skin, floor contact:\nGPU visual approval still required', fill='white', spacing=12)
path = here / 'compare/retarget_lineup.png'
if '--gpu' in sys.argv:
    image = Image.new('RGB', (1440, 1240), '#171b23')
    for index, panel in enumerate(data['panels']):
        tile = Image.open(here / f"out/lineup_{panel['name']}.png").convert('RGB').resize((480,270))
        ox, oy = (index % 3)*480, (index // 3)*310
        image.paste(tile, (ox,oy+30))
        ImageDraw.Draw(image).text((ox+8,oy+8), f"{panel['name']} / 10%, 50%, 85%", fill='white')
    ImageDraw.Draw(image).multiline_text((975,955), 'SKINNED MPFB + CYAN CMU\nNeutral matching material\nContact / wrists require inspection', fill='white', spacing=12)
else:
    image.save(here / 'compare/retarget_skeleton_lineup.png')
image.save(path)
print(f'LINEUP_WRITTEN {path} (' + ('GPU skinned mesh + CMU' if '--gpu' in sys.argv else 'CPU skeleton diagnostic, not mesh acceptance') + ')')
