"""Composite the native Blender render into the exact requested pixel-art canvas."""
from pathlib import Path
import numpy as np
from PIL import Image

OUT=Path(__file__).parent
source=OUT/'sheet-inspection-hd.png'
im=Image.open(source).convert('RGBA')
if im.size==(1168,784):
    im=im.resize((292,196),Image.Resampling.NEAREST)
assert im.size==(292,196),im.size
im.save(OUT/'turnaround-native-rgba.png')
a=np.array(im);mask=a[:,:,3]>=128
rgb=a[:,:,:3].astype(float)
bayer=np.array([[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]],dtype=float)
dither=np.tile((bayer-7.5)*.22,(49,73))[:,:,None]
rgb=np.clip(np.round((rgb+dither)/4)*4,0,255).astype('uint8')
canvas=np.empty((196,292,3),dtype='uint8');canvas[:]=[14,14,16]
canvas[mask]=rgb[mask]
native=Image.fromarray(canvas)
native.save(OUT/'field-guy-turnaround-native.png')
large=native.resize((1168,784),Image.Resampling.NEAREST)
large.save(OUT/'field-guy-turnaround.png')
# Exact scaling, solid background, and three aligned connected silhouettes.
b=np.array(large)
assert np.array_equal(b,np.repeat(np.repeat(canvas,4,0),4,1))
assert np.array_equal(canvas[0,0],[14,14,16])
for left,right in [(10,105),(110,185),(190,280)]:
    rows,cols=np.where(mask[:,left:right]);assert len(rows)>800
    assert 5<=rows.min()<=17,(left,rows.min())
    assert 171<=rows.max()<=180,(left,rows.max())
print({'canvas':large.size,'native':native.size,'nearest_4x_verified':True,'background':'#0e0e10'})
