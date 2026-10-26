"""Agent-facing character DNA; pure data validation, compilation and casting checks."""
import copy
import hashlib
import json
import math
import random
import re
from pathlib import Path
from config import validate_config

ROOT=Path(__file__).resolve().parents[1]
REPO=ROOT.parents[1]
FACE_CONTROLS=json.loads((ROOT/'dna/controls.json').read_text())
AGE_TARGETS={'head_age':'head/head-age-incr','eye_bags_left':'eyes/l-eye-bag-incr','eye_bags_right':'eyes/r-eye-bag-incr','sagging':'neck/neck-double-incr','lip_thinning':'mouth/mouth-upperlip-volume-decr','brow_droop':'eyebrows/eyebrows-trans-down'}
BODY_TARGETS={'shoulders':('torso/measure-shoulder-dist-decr','torso/measure-shoulder-dist-incr'),'chest':('torso/measure-bust-circ-decr','torso/measure-bust-circ-incr'),'belly':('torso/measure-waist-circ-decr','torso/measure-waist-circ-incr'),'hips':('hip/hip-scale-horiz-decr','hip/hip-scale-horiz-incr'),'arm_thickness':('arms/l-upperarm-scale-horiz-decr','arms/l-upperarm-scale-horiz-incr'),'leg_thickness':('legs/l-upperleg-scale-horiz-decr','legs/l-upperleg-scale-horiz-incr'),'posture':('head/head-angle-in','head/head-angle-out')}
PALETTES=json.loads((ROOT/'dna/palettes.json').read_text())
EYE_FIELDS={'color','iris_scale','sclera_tint'}
EYE_OPTIONAL={'pupil_size','limbal_darkness','veins','catchlight','wetness','lash_density'}
BROW_FIELDS={'thickness','color','greying'}
BROW_OPTIONAL={'style','head_thickness','tail_thickness','arch','tail_length','density','thickness_asymmetry'}
SKIN_FIELDS={'asset','tone','ruddiness','freckles','pimples','look','detail'}
SKIN_OPTIONAL={'undertone','pores','oiliness','age_lines'}
BROW_STYLES={'straight','soft','arched','heavy','sparse'}
EYE_DEFAULTS={'pupil_size':1,'limbal_darkness':.5,'veins':.3,'catchlight':.32,'wetness':.2,'lash_density':0}
BROW_DEFAULTS={'style':'straight','head_thickness':1,'tail_thickness':1,'arch':0,'tail_length':1,'density':1,'thickness_asymmetry':0}
SKIN_DEFAULTS={'undertone':0,'pores':.35,'oiliness':.16,'age_lines':0}

def resolve_appearance(dna):
    return {'eyes':{**EYE_DEFAULTS,**dna['eyes']},'brows':{**BROW_DEFAULTS,**dna['brows']},'skin':{**SKIN_DEFAULTS,**dna['skin']}}

# Optional low-level recipe fields; ranges mirror the full DNA validation above.
RECIPE_APPEARANCE_FIELDS={'eyes':EYE_FIELDS|EYE_OPTIONAL,'brows':BROW_FIELDS|BROW_OPTIONAL,'facial_hair':{'style','coverage','greying'},'skin_detail':(SKIN_FIELDS-{'asset'})|SKIN_OPTIONAL,'hair_dna':{'volume','length'}}
RECIPE_APPEARANCE_RANGES={'eyes':{'iris_scale':(.7,1.3),'pupil_size':(.6,1.4),'limbal_darkness':(0,1),'veins':(0,1),'catchlight':(0,1),'wetness':(0,1),'lash_density':(0,1)},'brows':{'thickness':(.3,1.5),'greying':(0,1),'head_thickness':(.4,1.6),'tail_thickness':(.2,1.4),'arch':(-1,1),'tail_length':(.7,1.3),'density':(0,1),'thickness_asymmetry':(-.25,.25)},'skin_detail':{'tone':(.7,1.3),'ruddiness':(0,1),'detail':(0,.3),'freckles':(0,100),'pimples':(0,30),'undertone':(-1,1),'pores':(0,1),'oiliness':(0,1),'age_lines':(0,1)},'facial_hair':{'coverage':(0,1),'greying':(0,1)},'hair_dna':{'volume':(.7,1.4),'length':(.5,1.5)}}
RECIPE_APPEARANCE_INTS={'skin_detail':{'freckles','pimples'}}
RECIPE_APPEARANCE_ENUMS={'eyes':{'color':['brown','brownlight','blue','bluegreen','grey','green']},'brows':{'style':BROW_STYLES},'skin_detail':{'look':['adult','young','toddler','weathered','tired','elder']},'facial_hair':{'style':['none','stubble']}}
RECIPE_APPEARANCE_COLORS={'eyes':{'sclera_tint'},'brows':{'color'}}

def validate_recipe_extras(config):
    """Validate the optional recipe face/asymmetry/age/appearance overrides; absent fields keep the previous look."""
    face=config.get('face') or {}
    if not isinstance(face,dict):raise ValueError('face must map named controls to weights')
    if set(face)-set(FACE_CONTROLS):raise ValueError(f'Unknown face controls: {sorted(set(face)-set(FACE_CONTROLS))}')
    for name,value in face.items():finite(value,-1 if FACE_CONTROLS[name]['negative'] else 0,1,'face.'+name)
    asymmetry=config.get('asymmetry') or {}
    if not isinstance(asymmetry,dict):raise ValueError('asymmetry must map paired controls to right-side offsets')
    paired={n for n,c in FACE_CONTROLS.items() if len(c['positive'])==2}
    if set(asymmetry)-paired:raise ValueError(f'Asymmetry supports only paired face controls: {sorted(set(asymmetry)-paired)}')
    if set(asymmetry)-set(face):raise ValueError(f'Asymmetry needs its base face control: {sorted(set(asymmetry)-set(face))}')
    for name,value in asymmetry.items():
        finite(value,-.25,.25,'asymmetry.'+name)
        finite(face[name]+value,-1,1,'right face.'+name)
    age=config.get('age') or {}
    if not isinstance(age,dict) or set(age)-set(AGE_TARGETS):raise ValueError(f'age supports only {sorted(AGE_TARGETS)}')
    for name,value in age.items():finite(value,0,1,'age.'+name)
    for field,allowed in RECIPE_APPEARANCE_FIELDS.items():
        override=config.get(field) or {}
        if not isinstance(override,dict):raise ValueError(field+' must be an object')
        if set(override)-allowed:raise ValueError(f'Unknown {field} fields: {sorted(set(override)-allowed)}')
        for name,value in override.items():
            if name in RECIPE_APPEARANCE_RANGES.get(field,()):finite(value,*RECIPE_APPEARANCE_RANGES[field][name],field+'.'+name)
            if name in RECIPE_APPEARANCE_INTS.get(field,()) and not isinstance(value,int):raise ValueError(f'{field}.{name} must be an integer count')
            if name in RECIPE_APPEARANCE_ENUMS.get(field,()) and value not in RECIPE_APPEARANCE_ENUMS[field][name]:raise ValueError(f'Unknown {field}.{name}: {value}')
            if name in RECIPE_APPEARANCE_COLORS.get(field,()) and (not isinstance(value,str) or not re.fullmatch(r'#[0-9a-fA-F]{6}',value)):raise ValueError(f'Invalid color {field}.{name}')
    return config

def recipe_targets(config):
    """Compile the optional recipe face/asymmetry/age fields into additive upstream targets."""
    face=config.get('face') or {};asymmetry=config.get('asymmetry') or {};age=config.get('age') or {}
    if not (face or age):return {}
    targets={}
    def add(path,value):
        if value>0:targets[path]=round(min(1,targets.get(path,0)+value),6)
    for name,value in face.items():
        control=FACE_CONTROLS[name]
        for i in range(len(control['positive'])):
            side=value+(asymmetry.get(name,0) if i else 0)
            paths=control['positive'] if side>=0 else control['negative']
            if paths:add(paths[i],abs(side))
    for name,path in AGE_TARGETS.items():add(path,age.get(name,0))
    targets.update({'mouth/mouth-upperlip-middle-down':.1,'mouth/mouth-lowerlip-middle-up':.12})
    return targets

def finite(value,low,high,label):
    if isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) or not low<=value<=high:raise ValueError(f'{label}: expected finite {low}..{high}')

def age_value(years):
    # MakeHuman: 1..25 years occupy the first half, 25..90 the second.
    return (years-1)/48 if years<=25 else .5+(years-25)/130

def fingerprint(dna):
    return hashlib.sha256(json.dumps(dna,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()

def validate_dna(dna):
    expected={'schema_version','id','name','episode','category','script_age','source','base','sex','ancestry_preset','casting','seed','face','asymmetry','age','body','skin','hair','brows','eyes','facial_hair','clothing','signature_traits','face_design','states','review'}
    if not isinstance(dna,dict) or set(dna)!=expected:raise ValueError(f'DNA fields must be exactly {sorted(expected)}')
    if dna['schema_version']!=1 or not isinstance(dna['id'],str) or not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,63}',dna['id']):raise ValueError('Invalid DNA version/id')
    if dna['ancestry_preset'] not in PALETTES or dna['sex'] not in ['male','female']:raise ValueError('Unknown art palette or sex baseline')
    if set(dna['face'])!=set(FACE_CONTROLS):raise ValueError('A full face vector with all named controls is required')
    for name,value in dna['face'].items():finite(value,-1 if FACE_CONTROLS[name]['negative'] else 0,1,'face.'+name)
    paired={n for n,c in FACE_CONTROLS.items() if len(c['positive'])==2}
    if set(dna['asymmetry'])!=paired:raise ValueError('Asymmetry must specify each paired face control')
    for name,value in dna['asymmetry'].items():
        finite(value,-.25,.25,'asymmetry.'+name)
        finite(dna['face'][name]+value,-1,1,'right face.'+name)
    age=dna['age'];finite(age['years'],2,90,'age.years')
    if set(age)!= {'years','features'} or set(age['features'])!=set(AGE_TARGETS):raise ValueError('Unknown or incomplete age features')
    for name,value in age['features'].items():finite(value,0,1,'age.features.'+name)
    base='child' if age['years']<=8 else 'elder' if age['years']>=60 else 'adult'
    if dna['base']!=base:raise ValueError('Base must match child (2–8), adult (9–59), or elder (60–90)')
    body=dna['body'];expected_body={'height_m','weight','muscle','proportions','height',*BODY_TARGETS}
    if set(body)!=expected_body:raise ValueError('Unknown or incomplete body fields')
    finite(body['height_m'],.65,2.3,'height_m')
    for name,value in body.items():
        if name!='height_m':finite(value,-1 if name in BODY_TARGETS else 0,1,'body.'+name)
    for section,fields in [('hair',{'asset','style','color','greying','length','volume'}),('facial_hair',{'style','coverage','greying'}),('clothing',{'asset','shoes','wardrobe','top_color','bottom_color','accent_color'})]:
        if set(dna[section])!=fields:raise ValueError('Unknown or incomplete '+section+' fields')
    for section,required,optional in [('skin',SKIN_FIELDS,SKIN_OPTIONAL),('brows',BROW_FIELDS,BROW_OPTIONAL),('eyes',EYE_FIELDS,EYE_OPTIONAL)]:
        found=set(dna[section])
        if not required<=found<=required|optional:raise ValueError('Unknown or incomplete '+section+' fields')
    for section,name,lo,hi in [('skin','tone',.7,1.3),('skin','ruddiness',0,1),('skin','detail',0,.3),('skin','freckles',0,100),('skin','pimples',0,30),('skin','undertone',-1,1),('skin','pores',0,1),('skin','oiliness',0,1),('skin','age_lines',0,1),('hair','greying',0,1),('hair','length',.5,1.5),('hair','volume',.7,1.4),('brows','thickness',.3,1.5),('brows','greying',0,1),('brows','head_thickness',.4,1.6),('brows','tail_thickness',.2,1.4),('brows','arch',-1,1),('brows','tail_length',.7,1.3),('brows','density',0,1),('brows','thickness_asymmetry',-.25,.25),('eyes','iris_scale',.7,1.3),('eyes','pupil_size',.6,1.4),('eyes','limbal_darkness',0,1),('eyes','veins',0,1),('eyes','catchlight',0,1),('eyes','wetness',0,1),('eyes','lash_density',0,1),('facial_hair','coverage',0,1),('facial_hair','greying',0,1)]:
        if name in dna[section]:finite(dna[section][name],lo,hi,section+'.'+name)
    if 'style' in dna['brows'] and dna['brows']['style'] not in BROW_STYLES:raise ValueError('Unknown brow style')
    if dna['eyes']['color'] not in ['brown','brownlight','blue','bluegreen','grey','green']:raise ValueError('Unknown eye asset')
    for section,name in [('hair','color'),('brows','color'),('eyes','sclera_tint'),('clothing','top_color'),('clothing','bottom_color'),('clothing','accent_color')]:
        if not isinstance(dna[section][name],str) or not re.fullmatch(r'#[0-9a-fA-F]{6}',dna[section][name]):raise ValueError('Invalid color '+section+'.'+name)
    for name in ['freckles','pimples']:
        if not isinstance(dna['skin'][name],int):raise ValueError('skin.'+name+' must be an integer count')
    if dna['facial_hair']['style'] not in ['none','stubble']:raise ValueError('Facial hair supports none or stubble')
    if dna['skin']['look'] not in ['adult','young','toddler','weathered','tired','elder']:raise ValueError('Unknown skin look')
    if base=='child' and (dna['skin']['look'] not in ['toddler','young'] or dna['skin']['asset'].startswith(('old_','middleage_')) or dna['skin']['pimples'] or any(age['features'].values()) or dna['facial_hair']['style']!='none' or dna['brows']['thickness']>.8):raise ValueError('Child baseline excludes adult age/acne/stubble/heavy brows')
    if not isinstance(dna['signature_traits'],list) or not 2<=len(dna['signature_traits'])<=3 or not all(isinstance(v,str) and v for v in dna['signature_traits']):raise ValueError('Two or three signature traits required')
    if dna['review'] not in ['draft','approved']:raise ValueError('Review must be draft or approved by the human')
    return dna

def compile_dna(dna):
    validate_dna(dna)
    targets={}
    def add(path,value):
        if value>0:targets[path]=round(min(1,targets.get(path,0)+value),6)
    for name,control in FACE_CONTROLS.items():
        for i in range(len(control['positive'])):
            value=dna['face'][name]+(dna['asymmetry'].get(name,0) if i else 0)
            paths=control['positive'] if value>=0 else control['negative']
            if paths:add(paths[i],abs(value))
    for name,path in AGE_TARGETS.items():add(path,dna['age']['features'][name])
    targets.update({'mouth/mouth-upperlip-middle-down':.1,'mouth/mouth-lowerlip-middle-up':.12})
    for name,(negative,positive) in BODY_TARGETS.items():
        value=dna['body'][name];path=positive if value>=0 else negative;add(path,abs(value))
        if path.startswith(('arms/l-','legs/l-')):add(path.replace('/l-','/r-'),abs(value))
    body={k:dna['body'][k] for k in ['weight','muscle','proportions','height']}
    body.update(gender=1 if dna['sex']=='male' else 0,age=age_value(dna['age']['years']),race=PALETTES[dna['ancestry_preset']]['macro'].copy())
    base={'name':dna['id'],'height_m':dna['body']['height_m'],'body':body,'skin':dna['skin']['asset'],'hair':dna['hair']['asset'],'outfit':dna['clothing']['asset'],'shoes':dna['clothing']['shoes'],'targets':targets}
    validate_config(base,REPO/'assets/sources/makehuman-core',REPO/'assets/sources/mpfb2-2.0.18/mpfb/data/targets')
    return {'id':dna['id'],'name':dna['name'],'episode':dna['episode'],'category':dna['category'],'scriptAge':dna['script_age'],'ageNote':dna['source']['facts'],'casting':dna['casting'],'wardrobe':dna['clothing']['wardrobe'],'hairstyle':dna['hair']['style'],'skinLook':dna['skin']['look'],'pimples':dna['skin']['pimples'],'topColor':dna['clothing']['top_color'],'bottomColor':dna['clothing']['bottom_color'],'hairColor':dna['hair']['color'],'accentColor':dna['clothing']['accent_color'],'base':base,'states':dna['states'],'faceDesign':dna['face_design'],'dnaHash':fingerprint(dna)}

def from_profile(profile):
    base=profile['base'];targets=base['targets'];face={};asymmetry={};used=set()
    for name,control in FACE_CONTROLS.items():
        values=[]
        for i in range(len(control['positive'])):
            positive=control['positive'][i];negative=control['negative'][i] if control['negative'] else None
            values.append(targets.get(positive,0)-targets.get(negative,0));used.update([positive,negative])
        face[name]=values[0]
        if len(values)==2:asymmetry[name]=round(values[1]-values[0],6)
    features={k:targets.get(v,0) if k in {'head_age','eye_bags_left','eye_bags_right'} else 0 for k,v in AGE_TARGETS.items()};used.update(AGE_TARGETS.values())
    used.update(['mouth/mouth-upperlip-middle-down','mouth/mouth-lowerlip-middle-up'])
    if set(targets)-used:raise ValueError('Unmapped old face controls: '+str(set(targets)-used))
    macro_age=base['body']['age'];years=profile['scriptAge'] or round(1+48*macro_age if macro_age<=.5 else 25+(macro_age-.5)*130)
    decade=re.search(r'\b([2-8]0)s\b',profile['ageNote'])
    if profile['scriptAge'] is None and decade:years=int(decade.group(1))+5
    child=years<=8;sex='male' if base['body']['gender']>.5 else 'female'
    if child:features={k:0 for k in AGE_TARGETS}
    note=profile.get('faceDesign','Individual anatomy, proportion and skin detail')
    traits=[p.strip() for p in note.split(',')[:3]]
    if len(traits)<2:traits=[note,'Individual eyelids and nose']
    dna={'schema_version':1,'id':profile['id'],'name':profile['name'],'episode':profile['episode'],'category':profile['category'],'script_age':profile['scriptAge'],'source':{'facts':profile['ageNote'],'references':['research/appearance-notes.md']},'base':'child' if child else 'elder' if years>=60 else 'adult','sex':sex,'ancestry_preset':'slavic' if base['body']['race']['caucasian']>.5 else 'buryat-inspired' if profile['id']=='yard-guard' else 'mongolian','casting':profile['casting'],'seed':int(hashlib.sha256(profile['id'].encode()).hexdigest()[:8],16),'face':face,'asymmetry':asymmetry,'age':{'years':years,'features':features},'body':{k:base[k] if k=='height_m' else base['body'][k] if k in base['body'] else 0 for k in ['height_m','weight','muscle','proportions','height',*BODY_TARGETS]},'skin':{'asset':base['skin'],'tone':1,'ruddiness':0,'freckles':0,'pimples':profile['pimples'],'look':profile['skinLook'],'detail':.06},'hair':{'asset':base['hair'],'style':profile['hairstyle'],'color':profile['hairColor'],'greying':0,'length':1,'volume':1},'brows':{'thickness':.5 if child else .68 if sex=='female' else 1,'color':'#51483b' if years>=60 else '#30251f','greying':.35 if years>=60 else 0},'eyes':{'color':'grey' if profile['id']=='irina' else 'bluegreen' if profile['id']=='dasha' else 'brown','iris_scale':1,'sclera_tint':'#f0eadf'},'facial_hair':{'style':'stubble' if profile['id']=='ganaa' else 'none','coverage':.16 if profile['id']=='ganaa' else 0,'greying':.2 if profile['id']=='ganaa' else 0},'clothing':{'asset':base['outfit'],'shoes':base['shoes'],'wardrobe':profile['wardrobe'],'top_color':profile['topColor'],'bottom_color':profile['bottomColor'],'accent_color':profile['accentColor']},'signature_traits':traits,'face_design':note,'states':profile['states'],'review':'draft'}
    female=sex=='female'
    dna['eyes'].update(pupil_size=1,limbal_darkness=.5,veins=.25 if female else .3,catchlight=.34,wetness=.2,lash_density=0)
    dna['brows'].update(style='soft' if female else 'straight',head_thickness=.9 if female else 1.05,tail_thickness=.58 if female else .72,arch=.18 if female else 0,tail_length=1,density=.78 if female else .9,thickness_asymmetry=0)
    dna['skin'].update(undertone=.04 if female else 0,pores=.32 if female else .36,oiliness=.18 if female else .14,age_lines=0)
    return validate_dna(dna)

def diversity_report(characters,threshold=.055):
    pairs=[];groups=sorted({c['group'] for c in FACE_CONTROLS.values()})
    for i,left in enumerate(characters):
        for right in characters[i+1:]:
            distances={g:math.sqrt(sum((left['face'][n]-right['face'][n])**2 for n,c in FACE_CONTROLS.items() if c['group']==g)/sum(c['group']==g for c in FACE_CONTROLS.values())) for g in groups}
            distance=math.sqrt(sum(v*v for v in distances.values())/len(groups))
            pairs.append({'a':left['id'],'b':right['id'],'distance':round(distance,6),'groups':{k:round(v,6) for k,v in distances.items()},'tooClose':distance<threshold,'changeGroups':sorted(groups,key=distances.get)[:3]})
    return {'passed':all(not p['tooClose'] for p in pairs),'threshold':threshold,'controls':len(FACE_CONTROLS),'metric':'Equal-weight RMS by face region; excludes age, ancestry, skin, hair and clothing','pairs':sorted(pairs,key=lambda p:p['distance']),'baseCounts':{b:sum(d['base']==b for d in characters) for b in ['child','adult','elder']},'ageRange':[min(d['age']['years'] for d in characters),max(d['age']['years'] for d in characters)],'heightRangeM':[min(d['body']['height_m'] for d in characters),max(d['body']['height_m'] for d in characters)],'weightRange':[min(d['body']['weight'] for d in characters),max(d['body']['weight'] for d in characters)]}

def generate_dna(template,*,seed,id,existing=()):
    rng=random.Random(seed)
    palette=PALETTES[template['ancestry_preset']]
    for attempt in range(64):
        result=copy.deepcopy(template);result.update(id=id,name=id,category='background',script_age=None,seed=seed,review='draft')
        result['source']={'facts':'Generated background draft; age and appearance are art direction.','references':[]}
        result['states']=['normal']
        for name,c in FACE_CONTROLS.items():
            center=palette['face_center'].get(name,template['face'][name]*.35)
            result['face'][name]=round(max(-.7,min(.7,rng.gauss(center,palette['spread'][c['group']]))),3) if c['negative'] else 0
        shape=rng.choice([n for n,c in FACE_CONTROLS.items() if not c['negative']]);result['face'][shape]=round(rng.uniform(.35,.8),3)
        for name in result['asymmetry']:result['asymmetry'][name]=round(rng.uniform(-.035,.035),3)
        strongest=sorted(result['face'],key=lambda n:abs(result['face'][n]),reverse=True)
        result['signature_traits']=[f'{n.replace("_"," ")} ({result["face"][n]:+.2f})' for n in strongest[:3]]
        result['face_design']='Generated draft; inspect the neutral lineup and profiles before approval.'
        if result['base']=='child':
            result['age']['features']={k:0 for k in AGE_TARGETS};result['skin'].update(pimples=0,look='toddler');result['facial_hair'].update(style='none',coverage=0)
        compile_dna(result)
        if not existing or all(not p['tooClose'] for p in diversity_report([*existing,result])['pairs'] if result['id'] in [p['a'],p['b']]):return result
    raise ValueError('No sufficiently distinct draft found; revise the permitted face ranges')

if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser(description=__doc__);sub=parser.add_subparsers(dest='command',required=True)
    p=sub.add_parser('compile');p.add_argument('dna',type=Path);p.add_argument('output',type=Path)
    p=sub.add_parser('draft');p.add_argument('template',type=Path);p.add_argument('output',type=Path);p.add_argument('--id',required=True);p.add_argument('--seed',type=int,required=True);p.add_argument('--against',type=Path)
    p=sub.add_parser('report');p.add_argument('directory',type=Path);p.add_argument('output',type=Path)
    args=parser.parse_args()
    if args.command=='compile':result=compile_dna(json.loads(args.dna.read_text()))
    elif args.command=='draft':result=generate_dna(json.loads(args.template.read_text()),seed=args.seed,id=args.id,existing=[json.loads(p.read_text()) for p in args.against.glob('*.json')] if args.against else ())
    else:result=diversity_report([validate_dna(json.loads(p.read_text())) for p in sorted(args.directory.glob('*.json'))])
    args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    if args.command=='report' and not result['passed']:raise SystemExit('Faces too close; inspect the report before building')
