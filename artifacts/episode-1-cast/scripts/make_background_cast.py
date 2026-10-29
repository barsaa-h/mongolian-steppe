"""Generate full draft DNA for EP01 v4.0 background people: late party guests, town ensemble and children.

Faces are seeded random drafts from the shared palette, rejected if too close to anyone in the pool;
roles and counts come from the v4.0 beat sheet, looks are artistic. Re-running overwrites only these ids.
    python3 artifacts/episode-1-cast/scripts/make_background_cast.py
"""
import json
import random
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT.parent / 'character-master/scripts'))
from dna import generate_dna, validate_dna

DNA = ROOT / 'dna'
SOURCE = 'artifacts/character-master/sources/story/EP01_AyaGaa_Huvaalts_25min_Beat_Sheet_v4.0.md'
EYE_TYPES = {
    'monolid': dict(upper_lid_fold=.75, inner_lid_fold=.55, eye_opening=-.25, eye_tilt=.1),
    'hooded': dict(upper_lid_fold=.6, inner_lid_fold=.3, eye_opening=-.15, eye_tilt=-.1),
    'almond': dict(upper_lid_fold=.1, inner_lid_fold=.35, eye_opening=0, eye_tilt=.2),
    'deepset': dict(eye_depth=-.5, upper_lid_fold=-.2, inner_lid_fold=.1, eye_opening=-.05),
    'upturned': dict(eye_tilt=.4, upper_lid_fold=.35, inner_lid_fold=.4),
    'downturned': dict(eye_tilt=-.35, upper_lid_fold=.3, eye_opening=-.1),
    'puffy': dict(upper_lid_fold=.5, eye_opening=-.2, lower_lid_height=.3),
}
# id: (sex, years, role fact, wardrobe)
PEOPLE = {
    **{f'party-guest-{n:02}': (sex, years, 'Late party guest at Altan\'s birthday (v4.0 beats 21-26: 12-18 visible late guests).', 'guest')
       for n, (sex, years) in enumerate([('M', 34), ('F', 41), ('M', 62), ('F', 28), ('M', 47), ('F', 57),
                                         ('M', 25), ('F', 36), ('M', 53), ('F', 70)], 1)},
    'town-cougher': ('F', 60, 'Neighbor coughing from stove smoke (beat 09).', 'coat'),
    'town-flu-joker': ('M', 45, 'Neighbor who jokes about flu while asking after the birthday (beat 09).', 'coat'),
    'town-young-worker': ('M', 20, 'Young worker complaining the hospital wants people to phone first (beat 09).', 'coat'),
    'town-water-woman': ('F', 42, 'Woman hauling a water can (beat 03).', 'coat'),
    'town-rug-shaker': ('F', 52, 'Someone shaking a rug from a balcony (beat 03).', 'coat'),
    'town-clinic-father': ('M', 36, 'Tired father among families waiting at the clinic (beat 20).', 'coat'),
    'kid-puddle-girl': ('F', 6, 'Child dodging a puddle (beat 03).', 'toddler-dress'),
    'kid-puddle-boy': ('M', 8, 'Child dodging a puddle (beat 03).', 'coat'),
    'kid-teaser': ('M', 7, 'Child who makes fun of Altan waiting for her father (beat 14).', 'coat'),
}
HAIR = {'M': [('short01', 'short'), ('short02', 'short'), ('short04', 'receding')],
        'F': [('long01', 'long'), ('braid01', 'long'), ('ponytail01', 'ponytail')]}  # bob01/02 sweep over an eye
# female_casualsuit01/02 and male_worksuit01 are T-shirt outfits with a modern logo: wrong for November 1998.
OUTFIT = {'M': ['male_casualsuit01', 'male_casualsuit03'],  # 02/04 carry a logo, 06 is a T-shirt
          'F': ['female_elegantsuit01']}
COLORS = ['#3b4250', '#5a4a3c', '#4b5a3d', '#6b3a3a', '#2e3a4a', '#5b4a63', '#4d3b2c', '#3a3f36', '#7a5a3a', '#2f3f5a']

templates = {sex: json.loads((DNA / name).read_text()) for sex, name in
             [('M', 'ganaa.json'), ('F', 'tsetsegmaa.json'), ('C', 'altan.json')]}
existing = [json.loads(p.read_text()) for p in sorted(DNA.glob('*.json')) if p.stem not in PEOPLE]

for cast_id, (sex, years, fact, wardrobe) in PEOPLE.items():
    rng = random.Random(cast_id)
    child = years <= 8
    template = dict(templates['C' if child else sex])
    template['sex'] = 'male' if sex == 'M' else 'female'
    dna = generate_dna(template, seed=sum(map(ord, cast_id)) * 104729, id=cast_id, existing=existing)
    dna.update(name=cast_id, category='background', script_age=None)
    dna['source'] = {'facts': fact + ' Age and look are artistic.', 'references': [SOURCE]}
    eye = rng.choice(['almond', 'upturned']) if child else rng.choice(list(EYE_TYPES))
    if child:
        # Children's faces are less defined than adults': half-strength variation on a rounded head.
        for key, control_value in dna['face'].items():
            dna['face'][key] = round(control_value * .5, 3)
        dna['face'].update(head_round=.35, head_square=0, head_oval=0, head_rectangular=0)
    else:
        dna['face'].update(EYE_TYPES[eye])
    for key in dna['asymmetry']:
        if abs(dna['face'][key] + dna['asymmetry'][key]) > 1:
            dna['asymmetry'][key] = 0
    dna['base'] = 'child' if child else 'elder' if years >= 60 else 'adult'
    aged = max(0, (years - 35) / 40)
    dna['age'] = {'years': years, 'features': {} if child else dict(
        head_age=round(min(.5, aged * .8), 2), eye_bags_left=round(.1 + aged * .4, 2), eye_bags_right=round(.09 + aged * .38, 2),
        sagging=round(aged * .3, 2), lip_thinning=round(aged * .3, 2), brow_droop=0)}
    if child:
        dna['age']['features'] = {k: 0 for k in templates['C']['age']['features']}
        dna['body'].update(height_m=round(.95 + (years - 3) * .065, 2), weight=round(rng.uniform(.4, .55), 2))
        dna['skin'].update(asset='young_asian_' + ('male' if sex == 'M' else 'female'), look='young', ruddiness=round(rng.uniform(.35, .6), 2), pimples=0)
        dna['brows'].update(color='#1d1814', thickness=.5, lift=.08, style='soft', greying=0)
        dna['sculpt'] = {'base-c': 1}
        hair = ('short02', 'short') if sex == 'M' else ('ponytail01', 'ponytail')
        dna['facial_hair'] = {'style': 'none', 'coverage': 0, 'greying': 0}
        outfit = 'female_elegantsuit01' if sex == 'F' else 'male_casualsuit01'
    else:
        dna['body'].update(height_m=round(rng.uniform(1.64, 1.78) if sex == 'M' else rng.uniform(1.52, 1.64), 2),
                           weight=round(rng.uniform(.35, .8), 2), muscle=round(rng.uniform(.25, .6), 2))
        stage = 'young' if years < 30 else 'middleage' if years < 55 else 'old'
        dna['skin'].update(asset=f'{stage}_asian_' + ('male' if sex == 'M' else 'female'),
                           look='elder' if years >= 60 else rng.choice(['adult', 'weathered', 'tired']),
                           ruddiness=round(rng.uniform(.05, .45), 2), pimples=2 if years < 26 else 0)
        grey = round(max(0, (years - 40) / 40), 2)
        dna['brows'].update(color=rng.choice(['#15110e', '#1d1814', '#241d18']), greying=grey, lift=round(rng.uniform(.09, .15), 2),
                            style=rng.choice(['heavy', 'straight', 'sparse']) if sex == 'M' else rng.choice(['soft', 'arched']),
                            thickness=round(rng.uniform(1.0, 1.35) if sex == 'M' else rng.uniform(.75, 1.0), 2))
        dna['sculpt'] = {'base-m' if sex == 'M' else 'base-f': 1}
        hair = rng.choice(HAIR[sex])
        beard = sex == 'M' and rng.random() < .5
        dna['facial_hair'] = {'style': 'stubble', 'coverage': round(rng.uniform(.2, .5), 2), 'greying': grey} if beard else {'style': 'none', 'coverage': 0, 'greying': 0}
        outfit = 'male_casualsuit05' if wardrobe == 'coat' else rng.choice(OUTFIT[sex])  # 05 is the jacket the padded coat needs
    dna['hair'].update(asset=hair[0], style=hair[1], color='#120e0c' if years < 45 else '#2a2622', greying=0 if child else round(max(0, (years - 38) / 45), 2), length=1, volume=1)
    dna['clothing'].update(asset=outfit, wardrobe=wardrobe, top_color=rng.choice(COLORS), bottom_color='#2a2a2c', accent_color=rng.choice(COLORS))
    traits = sorted(dna['face'], key=lambda n: abs(dna['face'][n]), reverse=True)[:2]
    dna['signature_traits'] = [f'{eye} eyes'] + [t.replace('_', ' ') for t in traits]
    dna['face_design'] = f'Background draft for EP01 v4.0; eye type {eye}; wardrobe {wardrobe}.'
    dna['states'] = ['normal']
    validate_dna(dna)
    (DNA / f'{cast_id}.json').write_text(json.dumps(dna, ensure_ascii=False, indent=2) + '\n')
    existing.append(dna)
    print(cast_id, sex, years, eye, hair[0], wardrobe)
