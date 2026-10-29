"""Render all matching head/expression checks and assemble the cast QA report."""
import concurrent.futures
import html
import json
import subprocess
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageOps

ROOT=Path(__file__).resolve().parents[1]
REPO=ROOT.parents[1]
profiles=json.loads((ROOT/'cast.json').read_text())
output=ROOT/'qa';output.mkdir(exist_ok=True)

def build(profile):
    id=profile['id']
    with (ROOT/'build-logs'/(id+'-qa.log')).open('w') as log:
        subprocess.run(['blender','-b','--factory-startup','--python-exit-code','1','-t','4','--python',str(REPO/'artifacts/character-master/scripts/qa_actor.py'),'--',str(ROOT/id)],cwd=REPO,stdout=log,stderr=subprocess.STDOUT,check=True)
    print('QA',id,flush=True)

if __name__=='__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:list(pool.map(build,profiles))
    font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17)
    small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',12)
    lineup=Image.new('RGB',(1024,304*((len(profiles)+3)//4)),(24,28,28));draw=ImageDraw.Draw(lineup)
    cards=[];reports=[]
    expressions=['smile','frown','blink','viseme_A','viseme_E','viseme_O','viseme_M']
    for i,profile in enumerate(profiles):
        id=profile['id'];x=(i%4)*256;y=(i//4)*304
        photo=Image.open(ROOT/id/'qa/front.png').convert('RGB').resize((256,256),Image.Resampling.LANCZOS)
        label_font=font
        for size in range(17,9,-1):
            label_font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',size)
            if draw.textlength(profile['name'],font=label_font)<=236:break
        lineup.paste(photo,(x,y));draw.text((x+10,y+261),profile['name'],font=label_font,fill=(225,224,215));draw.text((x+10,y+285),id,font=small,fill=(163,173,165))
        report=json.loads((ROOT/id/'qa/report.json').read_text());assert report['passed'];reports.append({'id':id,**report})
        def image(name):return f'<a href="../{id}/qa/{name}.png"><img loading="lazy" alt="{html.escape(profile["name"])} · {name}" src="../{id}/qa/{name}.png"></a>'
        cards.append(f'<article><h2>{html.escape(profile["name"])}</h2><p>{html.escape(profile["faceDesign"])}</p><div class="views">'+''.join(image(n) for n in ['front','three-quarter','profile'])+'</div><details><summary>Expressions and mouth shapes</summary><div class="expressions">'+''.join(image(n) for n in expressions)+f'</div></details><p><a href="../dna/{id}.json">DNA</a> · <a href="../{id}/Character-Master.blend">Blender source</a></p></article>')
    lineup.save(output/'lineup.png');ImageOps.grayscale(lineup).save(output/'lineup-grayscale.png')
    diversity=json.loads((ROOT/'diversity-report.json').read_text());assert diversity['passed']
    rows=''.join(f'<tr><td>{p["a"]}</td><td>{p["b"]}</td><td>{p["distance"]:.4f}</td><td>{", ".join(p["changeGroups"])}</td></tr>' for p in diversity['pairs'][:10])
    document='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Character DNA · Face QA</title><style>:root{color-scheme:dark;font:15px system-ui;background:#161c1b;color:#e0e3da}body{max-width:1200px;margin:auto;padding:28px}a{color:#c4d4b6}h1{font:36px Georgia,serif}p{line-height:1.6;color:#b9c5b7}img{width:100%;display:block}article{border-top:1px solid #465345;padding:22px 0}.views{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.expressions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}summary{padding:20px 0;cursor:pointer}table{border-collapse:collapse;width:100%;font-size:12px}th,td{text-align:left;padding:8px;border-bottom:1px solid #465345}.scroll{overflow:auto}.lineups{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media(max-width:650px){body{padding:16px}.lineups{grid-template-columns:1fr}.expressions{grid-template-columns:repeat(2,minmax(0,1fr))}}</style><header><a href="../">← Cast inspector</a><h1>Faces without costume</h1><p>All 13 characters use the same matte materials and framing, with hair and clothing hidden. Identity shapes remain visible. The grayscale lineup removes the remaining color cues. Click an image for full resolution.</p><p>These are saved technical checks. Consult each DNA and its approval record for design status; film-shot approval is separate.</p></header><div class="lineups"><a href="lineup.png"><img alt="Matching-material bald head lineup" src="lineup.png"></a><a href="lineup-grayscale.png"><img alt="Grayscale matching-material bald head lineup" src="lineup-grayscale.png"></a></div><h2>Closest face parameter pairs</h2><p>Distances use equal weight per facial region and exclude age, ancestry, skin, hair and clothing. This catches duplicated recipes; visual inspection is also required.</p><div class="scroll"><table><thead><tr><th>Character</th><th>Nearest character</th><th>Distance</th><th>Most similar regions</th></tr></thead><tbody>'''+rows+'''</tbody></table></div><p><a href="../diversity-report.json">Complete diversity report and age/body spread</a> · <a href="report.json">Native expression checks</a></p>'''+''.join(cards)+'''</html>'''
    (output/'index.html').write_text(document)
    (output/'report.json').write_text(json.dumps({'passed':True,'characters':reports,'diversityPassed':True,'humanReview':'pending'},indent=2)+'\n')
    print('CAST_DNA_QA_OK',len(reports),flush=True)
