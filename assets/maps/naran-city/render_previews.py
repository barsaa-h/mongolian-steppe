import bpy
from pathlib import Path
root=Path(bpy.data.filepath).parent/'previews'
s=bpy.data.scenes['NARAN_City'];bpy.context.window.scene=s
s.render.resolution_x=1600;s.render.resolution_y=1000;s.render.resolution_percentage=100
for cam,slug in [('Naran.Apartment','episode1-apartments'),('Naran.GanaaEntrance','ganaa-entrance'),('Naran.Center','civic-center'),('Naran.Residential','residential-quarter'),('Naran.Market','market-street'),('Naran.Overview','town-overview')]:
 s.camera=bpy.data.objects[cam];s.render.filepath=str(root/(slug+'.png'));bpy.ops.render.render(write_still=True)
print('CITY_PASS2_RENDERED 6 views')
