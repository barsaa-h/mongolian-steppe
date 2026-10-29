import json
import hashlib
import sys
import struct
import unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
sys.path.insert(0, str(REPO / 'artifacts/character-master/scripts'))
from config import validate_config
from dna import compile_dna,diversity_report

class RecipeTests(unittest.TestCase):
    def setUp(self):
        self.profiles = json.loads((ROOT / 'cast.json').read_text())
        self.recipes = [json.loads((ROOT / 'recipes' / (p['id']+'.json')).read_text()) for p in self.profiles]
    def test_script_identity_age_and_coverage(self):
        canon = {p['id']:p for p in json.loads((REPO/'assets/cast/roster.json').read_text()) if 1 in p['episodes'] and p['kind'] != 'voice'}
        principals = {p['id']:p for p in self.profiles if p['category']=='principal'}
        self.assertEqual(set(principals), set(canon))
        for id,p in principals.items():
            self.assertEqual((p['name'],p['scriptAge']), (canon[id]['name'],canon[id]['age']))
        self.assertEqual(len(self.profiles),13)
        self.assertNotIn('radio', {p['id'] for p in self.profiles})
    def test_valid_local_assets_and_unique_face_recipes(self):
        for recipe in self.recipes:
            with self.subTest(id=recipe['id']):
                validate_config(recipe['base'], REPO/'assets/sources/makehuman-core', REPO/'assets/sources/mpfb2-2.0.18/mpfb/data/targets')
        faces = [json.dumps(r['base']['targets'],sort_keys=True) for r in self.recipes]
        self.assertEqual(len(set(faces)),len(faces))
    def test_toddler_and_state_continuity(self):
        by_id={p['id']:p for p in self.recipes}
        self.assertLess(by_id['altan']['base']['body']['age'],.1)
        self.assertLess(by_id['altan']['base']['height_m'],1.1)
        self.assertEqual(by_id['altan']['pimples'],0)
        self.assertGreater(by_id['party-young-man']['pimples'],0)
        self.assertEqual(by_id['hurel']['states'],['normal'])
        self.assertEqual(by_id['ganaa']['states'][0],'healthy')
        self.assertIn('fed-runner',by_id['dasha']['states'])
    def test_actor_report_talk_clip_matches_export(self):
        for profile in self.profiles:
            folder = ROOT / profile['id']
            with (folder / 'character.glb').open('rb') as glb:
                header = glb.read(20)
                document = json.loads(glb.read(struct.unpack('<I', header[12:16])[0]))
            clips = {animation.get('name') for animation in document.get('animations', [])}
            report = json.loads((folder / 'report.json').read_text())
            with self.subTest(id=profile['id']):
                self.assertEqual(report['talkCheck'], 'Talk_Check' in clips)
                self.assertEqual(set(report['clips']), clips)
                self.assertEqual(report['glbSha256'], hashlib.sha256((folder / 'character.glb').read_bytes()).hexdigest())

    def test_face_qa_reports_respect_design_approval(self):
        for profile in self.profiles:
            id = profile['id']
            dna = json.loads((ROOT / 'dna' / (id + '.json')).read_text())
            report = json.loads((ROOT / id / 'qa' / 'report.json').read_text())
            with self.subTest(id=id):
                self.assertEqual(report['humanReview'], 'approved' if dna['review'] == 'approved' else 'pending')

    def test_faces_have_individual_eyelids_and_proportions(self):
        for recipe in self.recipes:
            targets=recipe['base']['targets']
            with self.subTest(id=recipe['id']):
                self.assertTrue(any('epicanthus' in key or 'eyefold' in key for key in targets))
                self.assertTrue(any(key.startswith('mouth/') for key in targets))
                self.assertTrue(any(key.startswith('nose/') and 'scale-horiz' not in key for key in targets))
        by_id={p['id']:p for p in self.recipes}
        self.assertEqual(by_id['irina']['base']['body']['race']['caucasian'],1)
        self.assertEqual(by_id['dasha']['base']['body']['race']['caucasian'],1)
    def test_dna_is_authoritative_and_faces_pass_regional_distance_check(self):
        characters=[json.loads((ROOT/'dna'/(p['id']+'.json')).read_text()) for p in self.profiles]
        for character in characters:
            self.assertEqual(compile_dna(character),json.loads((ROOT/'recipes'/(character['id']+'.json')).read_text()))
        self.assertTrue(diversity_report(characters)['passed'])

if __name__=='__main__': unittest.main()
