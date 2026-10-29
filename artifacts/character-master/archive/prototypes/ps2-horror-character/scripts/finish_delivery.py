import subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
blender='/home/barsaa/.local/bin/blender'
for job in ['body','horror']:
    with (ROOT/(job+'-render.log')).open('w') as log:
        subprocess.run([blender,'-b',str(ROOT/'PS2_Character_Master.blend'),'-t','12','-P',str(ROOT/'scripts/render_delivery.py'),'--',job],stdout=log,stderr=subprocess.STDOUT,check=True)
    print(job,'complete',flush=True)
subprocess.run([blender,'-b',str(ROOT/'PS2_Character_Master.blend'),'-t','4','-P',str(ROOT/'scripts/verify_project.py')],check=True)
subprocess.run(['python3',str(ROOT/'scripts/package_previews.py')],check=True)
print('DELIVERY_PACKAGED',flush=True)
