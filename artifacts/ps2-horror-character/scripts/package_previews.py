"""Validate every rendered frame, encode silent MP4s, and record delivery evidence."""
import json,subprocess,hashlib
from pathlib import Path
from PIL import Image
import contact_sheets
ROOT=Path(__file__).resolve().parent.parent
movies={}
for job,label in [('dialogue','Dialogue_Silent_720p.mp4'),('body','Full_Body_720p.mp4')]:
    folder=ROOT/'Animation_Tests'/(job+'_frames')
    paths=sorted(folder.glob('*.png'));assert len(paths)==48,(job,len(paths))
    for i,path in enumerate(paths,1):
        assert path.name==f'{i:04d}.png'
        with Image.open(path) as im:
            im.load();assert im.size==(1280,720),(path,im.size)
    output=ROOT/'Animation_Tests'/label
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate','12','-i',str(folder/'%04d.png'),'-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(output)],check=True)
    info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(output)],text=True))
    video=next(s for s in info['streams'] if s['codec_type']=='video')
    assert (video['width'],video['height'],int(video['nb_frames']))==(1280,720,48)
    assert abs(float(info['format']['duration'])-4.)<.01
    assert not any(s['codec_type']=='audio' for s in info['streams'])
    movies[job]={'path':str(output.relative_to(ROOT)),'frames':48,'fps':12,'source_fps':24,'duration_seconds':4,'resolution':[1280,720],'audio':False}
contact_sheets.stills();contact_sheets.movies()
manifest={'master':'PS2_Character_Master.blend','master_sha256':hashlib.sha256((ROOT/'PS2_Character_Master.blend').read_bytes()).hexdigest(),'movies':movies,'preview_validation':'Decoded every source PNG; ffprobe confirmed both H.264 files, 48 frames, 4 seconds and 1280x720.','visual_acceptance':'See Delivery_Acceptance.md for human-visible frame review and remaining artistic limitations.'}
(ROOT/'Delivery_Manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps(movies,indent=2))
