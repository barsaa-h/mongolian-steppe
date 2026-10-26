import copy
import json
import unittest
from pathlib import Path
from dna import FACE_CONTROLS, BODY_TARGETS, compile_dna, from_profile, generate_dna, diversity_report

ROOT=Path(__file__).resolve().parents[3]
PROFILE=json.loads((ROOT/'artifacts/episode-1-cast/recipes/ganaa.json').read_text())

class DnaTests(unittest.TestCase):
    def setUp(self):self.dna=from_profile(PROFILE)
    def test_catalogue_and_round_trip(self):
        self.assertGreaterEqual(len(FACE_CONTROLS),40)
        self.assertLessEqual(len(FACE_CONTROLS),60)
        self.assertEqual(set(self.dna['face']),set(FACE_CONTROLS))
        result=compile_dna(self.dna)
        self.assertEqual(result['base']['targets'],PROFILE['base']['targets'])
        self.assertEqual(result['scriptAge'],46)
    def test_age_and_expressions_are_not_identity(self):
        old=copy.deepcopy(self.dna);old['age']['years']=70;old['base']='elder'
        self.assertEqual(old['face'],self.dna['face'])
        self.assertNotEqual(compile_dna(old)['base']['body']['age'],compile_dna(self.dna)['base']['body']['age'])
        self.assertEqual(diversity_report([self.dna,old])['pairs'][0]['distance'],0)
    def test_invalid_controls_and_child_rules(self):
        for key,value in [('jaw_width',float('nan')),('typo_slider',.5),('eye_spacing',2)]:
            dna=copy.deepcopy(self.dna);dna['face'][key]=value
            with self.subTest(key=key),self.assertRaises(ValueError):compile_dna(dna)
        dna=copy.deepcopy(self.dna);dna['base']='child';dna['age']['years']=3
        with self.assertRaises(ValueError):compile_dna(dna)
    def test_sampler_is_deterministic_constrained_and_checks_similarity(self):
        one=generate_dna(self.dna,seed=17,id='extra-17')
        self.assertEqual(one,generate_dna(self.dna,seed=17,id='extra-17'))
        self.assertNotEqual(one['face'],self.dna['face'])
        self.assertEqual(one['script_age'],None)
        self.assertFalse(diversity_report([one,copy.deepcopy(one)])['passed'])
        two=generate_dna(self.dna,seed=18,id='extra-18',existing=[one])
        self.assertTrue(diversity_report([one,two])['passed'])
    def test_catalogue_targets_and_base_files_exist(self):
        target_root=ROOT/'assets/sources/mpfb2-2.0.18/mpfb/data/targets'
        for control in FACE_CONTROLS.values():
            for target in control['positive']+control['negative']:self.assertTrue((target_root/(target+'.target.gz')).is_file(),target)
        for pair in BODY_TARGETS.values():
            for target in pair:self.assertTrue((target_root/(target+'.target.gz')).is_file(),target)
        for path in (ROOT/'artifacts/character-master/dna/bases').glob('*.json'):compile_dna(json.loads(path.read_text()))
    def test_body_controls_reach_both_limbs_and_appearance_cannot_hide_duplicates(self):
        changed=copy.deepcopy(self.dna);changed['body']['arm_thickness']=.4
        targets=compile_dna(changed)['base']['targets']
        self.assertEqual(targets['arms/l-upperarm-scale-horiz-incr'],.4)
        self.assertEqual(targets['arms/r-upperarm-scale-horiz-incr'],.4)
        changed['hair']['color']='#eeeeee';changed['skin']['tone']=.8;changed['body']['weight']=.2
        self.assertFalse(diversity_report([self.dna,changed])['passed'])
    def test_child_cannot_use_an_age_crease_look(self):
        child=json.loads((ROOT/'artifacts/episode-1-cast/dna/altan.json').read_text())
        for look in ['weathered','tired','elder']:
            changed=copy.deepcopy(child);changed['skin']['look']=look
            with self.subTest(look=look),self.assertRaises(ValueError):compile_dna(changed)
    def test_optional_appearance_fields_do_not_change_existing_targets(self):
        original=json.loads((ROOT/'artifacts/episode-1-cast/dna/ganaa.json').read_text())
        self.assertNotIn('pupil_size', original['eyes'])
        before=compile_dna(original)['base']['targets']
        changed=copy.deepcopy(original)
        changed['eyes']['pupil_size']=1
        changed['brows']['style']='straight'
        changed['skin']['pores']=.4
        self.assertEqual(compile_dna(changed)['base']['targets'], before)
        for base in ['adult-female','adult-male']:
            dna=json.loads((ROOT/'artifacts/character-master/dna/bases'/f'{base}.json').read_text())
            self.assertTrue(all(value==0 for value in dna['face'].values()))
            self.assertEqual(dna['sex'], 'female' if 'female' in base else 'male')
            compile_dna(dna)
    def test_migration_preserves_stated_age_decade_without_inventing_exact_canon_age(self):
        for id in ['hurel','yard-guard']:
            profile=json.loads((ROOT/'artifacts/episode-1-cast/recipes'/(id+'.json')).read_text())
            dna=from_profile(profile)
            self.assertIsNone(dna['script_age'])
            self.assertGreaterEqual(dna['age']['years'],50)
            self.assertLess(dna['age']['years'],60)

if __name__=='__main__':unittest.main()
