"""One background renderer at a time to bound memory use on the workstation."""
import subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
for job in ['horror','body','dialogue','expressions']:
    with (ROOT/(job+'-render.log')).open('w') as log:
        result=subprocess.run(['/home/barsaa/.local/bin/blender','-b',str(ROOT/'PS2_Character_Master.blend'),'-t','12','-P',str(ROOT/'scripts/render_delivery.py'),'--',job],stdout=log,stderr=subprocess.STDOUT)
    print(job,result.returncode,flush=True)
    if result.returncode:raise SystemExit(result.returncode)
