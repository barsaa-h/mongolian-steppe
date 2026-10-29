from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parent.parent
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def sheet(items,name,cols,size,title,crop=None):
    w,h=size;rows=(len(items)+cols-1)//cols
    out=Image.new('RGB',(cols*w,62+rows*(h+34)),(25,29,33));draw=ImageDraw.Draw(out)
    draw.text((18,16),title,fill=(231,233,227),font=ImageFont.truetype(FONT,23))
    for i,(label,path) in enumerate(items):
        im=Image.open(ROOT/path).convert('RGB')
        if crop:im=im.crop(crop)
        im=im.resize((w,h),Image.Resampling.LANCZOS)
        x=(i%cols)*w;y=62+(i//cols)*(h+34)
        out.paste(im,(x,y));draw.text((x+12,y+h+7),label,fill=(220,225,218),font=ImageFont.truetype(FONT,17))
    out.save(ROOT/name,quality=94)
    assert out.width==cols*w

def stills():
    items=[(f'{stage} / {view}',f'Comparisons/{prefix}_{view}.png') for stage,prefix in [('Original','Before'),('Rebuilt','After')] for view in ['Front','Side','ThreeQuarter']]
    sheet(items,'Comparisons/Before_After_Contact_Sheet.jpg',3,(384,576),'Original outfit / Early-PS2 rebuild — matched neutral lighting')
    sheet([('Original','Comparisons/Before_Face_720p.png'),('Rebuilt','Comparisons/After_Face_720p.png')],'Comparisons/Face_Before_After.jpg',2,(640,360),'Face reconstruction — matched camera and light')
    emotions=['Neutral','Sadness','Fear','Anger','Shock','Grief','Pain','Subtle Smile','Exhaustion','Vacant Zombie']
    sheet([(s,'Expressions/'+s.replace(' ','_')+'_720p.png') for s in emotions],'Expressions/Expression_Contact_Sheet.jpg',5,(280,348),'Ten restrained facial poses',crop=(350,0,930,720))
    names=['Cold Exterior','Overhead Interior','Dark Side','Restrained Warm']
    sheet([(s,'Lighting_Tests/'+s.replace(' ','_')+'_720p.png') for s in names],'Lighting_Tests/Lighting_Contact_Sheet.jpg',2,(640,360),'Lighting tests — the same painted model')

def movies():
    for job,label in [('dialogue','Silent facial speech-shape study'),('body','Body blocking — steps, reach, grip, breathing')]:
        sheet([(f'{(n-1)/12:.2f} s',f'Animation_Tests/{job}_frames/{n:04d}.png') for n in [1,7,13,19,25,31,37,48]],f'Animation_Tests/{job}_Filmstrip.jpg',4,(320,180),label)

if __name__=='__main__':
    import sys
    if len(sys.argv)>1 and sys.argv[1]=='movies':movies()
    else:stills()
