"""Assemble the cast's browser renders into a named production contact sheet."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json
ROOT=Path(__file__).resolve().parents[1]
actors=[a for a in json.loads((ROOT/'assets/cast/roster.json').read_text()) if a['kind']!='voice']
fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(fontpath,15);title=ImageFont.truetype(fontpath,32);small=ImageFont.truetype(fontpath,12)
cellw,cellh=240,300
sheet=Image.new('RGB',(cellw*8,130+cellh*6),(16,21,27));draw=ImageDraw.Draw(sheet)
draw.text((32,25),'ХАНИАД · НАРАН · EPISODES 1–5',font=title,fill='#e4d4b5')
draw.text((32,78),'48 on-screen character designs · editable Blender sources and rigged GLBs',font=font,fill='#a4aeb7')
for i,a in enumerate(actors):
 image=Image.open(ROOT/f'output/cast/{a["id"]}.png').convert('RGB')
 width,height=image.size
 image=image.crop((int(width*.27),int(height*.09),int(width*.73),int(height*.94)))
 image.thumbnail((cellw-16,cellh-52),Image.Resampling.LANCZOS)
 x=(i%8)*cellw;y=130+(i//8)*cellh
 sheet.paste(image,(x+(cellw-image.width)//2,y))
 name=a['name']
 while draw.textlength(name,font=font)>cellw-16:name=name[:-2]+'…'
 draw.text((x+8,y+cellh-46),name,font=font,fill='#e2d9c8')
 age='Newborn' if a['age']==0 else f"Age {a['age']}" if a['age'] is not None else 'Age unspecified'
 draw.text((x+8,y+cellh-24),age+' · Ep '+','.join(map(str,a['episodes'])),font=small,fill='#8c9aa8')
sheet.save(ROOT/'output/cast/cast-lineup.jpg',quality=94)
print(ROOT/'output/cast/cast-lineup.jpg')
