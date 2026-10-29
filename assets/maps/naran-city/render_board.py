"""Compose the actual Blender renders into a review board; requires Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root=Path(__file__).resolve().parent/'previews'
font_path='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(font_path,23);title=ImageFont.truetype(font_path,34)
board=Image.new('RGB',(1840,1360),'#18201e');draw=ImageDraw.Draw(board)
draw.text((24,20),'NARAN — DEVELOPMENT PASS 2',font=title,fill='#f2ede0')
draw.text((24,70),'3.3 × 3.0 km town layout / Episode 1 arrival and apartment priority',font=font,fill='#b8c2b8')
views=[('town-overview','Town layout'),('residential-quarter','Residential expansion'),('market-street','Market frontage'),('ganaa-entrance','Ganaa’s entrance / exterior')]
for i,(slug,label) in enumerate(views):
    im=Image.open(root/(slug+'.png')).convert('RGB');assert im.size==(1600,1000),im.size
    im=im.resize((880,550),Image.Resampling.LANCZOS);x=24+(i%2)*912;y=120+(i//2)*596
    board.paste(im,(x,y));draw.text((x,y+558),label,font=font,fill='#f2ede0')
draw.text((24,1320),'Exterior development / artistic layout choices / interiors and runtime integration pending',font=font,fill='#b8c2b8')
board.save(root/'development-board.jpg',quality=92)
print('Development review board saved.')
