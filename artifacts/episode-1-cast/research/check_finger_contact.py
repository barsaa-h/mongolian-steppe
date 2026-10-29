"""Research diagnostic for the held driving pose, not a continuous collision test."""
import bpy,math,json
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
cab=json.loads((Path(__file__).resolve().parents[3] / 'assets/cast/cab.json').read_text())
angle=cab['wheelTilt']; offset=Vector(cab['wheelCenter'])-Vector(cab['driverOrigin']); center=Vector((offset.x,-offset.z,offset.y)); r=cab['wheelRadius']; tube=.025
verts=[]
for j in range(6):
 v=j*2*math.pi/5
 for i in range(17):
  u=i*2*math.pi/16
  x=(r+tube*math.cos(v))*math.cos(u);y=(r+tube*math.cos(v))*math.sin(u);z=tube*math.sin(v)
  verts.append(center+Vector((x,-(y*math.sin(angle)+z*math.cos(angle)),y*math.cos(angle)-z*math.sin(angle))))
faces=[]
for j in range(1,6):
 for i in range(1,17):
  a=17*j+i-1;b=17*(j-1)+i-1;c=17*(j-1)+i;d=17*j+i
  faces.extend([(a,b,d),(b,c,d)])
wheel=BVHTree.FromPolygons(verts,faces,all_triangles=True)
test=BVHTree.FromPolygons([Vector((-.1,-.1,0)),Vector((.1,-.1,0)),Vector((0,.1,0))],[(0,1,2)])
test2=BVHTree.FromPolygons([Vector((0,-.05,-.1)),Vector((0,-.05,.1)),Vector((0,.05,0))],[(0,1,2)])
assert test.overlap(test2)
rig=bpy.data.objects['Character.Rig'];rig.animation_data.action=bpy.data.actions['Driving_Block'];bpy.context.scene.frame_set(13)
out={}
for side in ('L','R'):
 obj=bpy.data.objects['Hands.'+side];ev=obj.evaluated_get(bpy.context.evaluated_depsgraph_get());mesh=ev.to_mesh();world=[ev.matrix_world@v.co for v in mesh.vertices]
 tris=[]
 mesh.calc_loop_triangles()
 for t in mesh.loop_triangles:tris.append(tuple(t.vertices))
 hand=BVHTree.FromPolygons(world,tris,all_triangles=True)
 contact={}
 for i in range(1,6):
  names={g.index for g in obj.vertex_groups if g.name.startswith('finger%d-'%i) and g.name.endswith('.'+side)}
  points=[world[v.index] for v in obj.data.vertices if any(g.group in names and g.weight>.5 for g in v.groups)]
  d=[wheel.find_nearest(p)[3] for p in points]
  contact[str(i)]={'vertices':len(points),'nearestM':min(d) if d else None,'within5mm':sum(x<.005 for x in d)}
 out[side]={'triangleIntersectionPairs':len(hand.overlap(wheel)),'fingers':contact};ev.to_mesh_clear()
print('WHEEL_MESH_DIAGNOSTIC',json.dumps(out))
