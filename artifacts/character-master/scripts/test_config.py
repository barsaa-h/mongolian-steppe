import copy
import math
import unittest
import tempfile
from pathlib import Path
from config import validate_config, validate_output_directory, OUTPUT_MARKER
from dna import validate_recipe_extras, recipe_targets

ASSETS = Path(__file__).resolve().parents[3] / 'assets/sources/makehuman-core'
TARGETS = Path(__file__).resolve().parents[3] / 'assets/sources/mpfb2-2.0.18/mpfb/data/targets'
BASE = {'name':'Default','height_m':1.7,'body':{'gender':0,'age':.5,'weight':.5,'muscle':.4,'proportions':.5,'height':.5,'race':{'asian':1,'african':0,'caucasian':0}},'skin':'young_asian_female','hair':'short02','outfit':'male_casualsuit01','shoes':'shoes02','targets':{}}
EXTRAS = {'face':{'jaw_width':.4,'eye_tilt':.1,'chin_projection':.25},'asymmetry':{'eye_tilt':.05},'age':{'eye_bags_left':.2,'eye_bags_right':.18},'eyes':{'color':'grey','catchlight':.5},'brows':{'style':'arched','thickness':1.3},'skin_detail':{'ruddiness':.3,'freckles':12},'facial_hair':{'style':'stubble','coverage':.2}}

class ConfigTest(unittest.TestCase):
 def test_valid_config_and_named_target(self):
  c=copy.deepcopy(BASE);c['targets']={'nose/nose-volume-incr':.35}
  self.assertEqual(validate_config(c,ASSETS,TARGETS),c)
 def test_recipe_extras_accept_full_override_set(self):
  c=copy.deepcopy(BASE);c.update(copy.deepcopy(EXTRAS))
  self.assertEqual(validate_config(c,ASSETS,TARGETS),c)
 def test_recipe_extras_are_optional(self):
  self.assertEqual(validate_config(copy.deepcopy(BASE),ASSETS,TARGETS),copy.deepcopy(BASE))
 def test_recipe_extras_reject_bad_values(self):
  cases=[
   lambda c:c.update(face={'missing_control':.5}),
   lambda c:c.update(face={'jaw_width':2}),
   lambda c:c.update(face={'head_round':-.5}),
   lambda c:c.update(face={'eye_tilt':.1},asymmetry={'eye_tilt':-2}),
   lambda c:c.update(face={'eye_tilt':.1},asymmetry={'eye_tilt':.3}),
   lambda c:c.update(asymmetry={'eye_tilt':.05}),
   lambda c:c.update(face={'eye_size':.2},asymmetry={'jaw_width':.05}),
   lambda c:c.update(age={'made_up_feature':.5}),
   lambda c:c.update(age={'head_age':3}),
   lambda c:c.update(eyes={'color':'pink'}),
   lambda c:c.update(eyes={'catchlight':1.5}),
   lambda c:c.update(eyes={'sclera_tint':'white'}),
   lambda c:c.update(brows={'style':'feathered'}),
   lambda c:c.update(brows={'thickness':5}),
   lambda c:c.update(skin_detail={'asset':'young_asian_male'}),
   lambda c:c.update(skin_detail={'pores':2}),
   lambda c:c.update(skin_detail={'freckles':12.5}),
   lambda c:c.update(facial_hair={'style':'beard'}),
   lambda c:c.update(facial_hair={'coverage':-.1}),
  ]
  for modify in cases:
   c=copy.deepcopy(BASE);modify(c)
   with self.subTest(case=modify),self.assertRaises(ValueError):validate_config(c,ASSETS,TARGETS)
 def test_recipe_targets_compile_face_asymmetry_and_age(self):
  c=copy.deepcopy(BASE);c.update(copy.deepcopy(EXTRAS))
  targets=recipe_targets(c)
  self.assertEqual(targets['chin/chin-bones-incr'],.4)
  self.assertEqual(targets['eyes/l-eye-corner2-up'],.1)
  self.assertEqual(targets['eyes/r-eye-corner2-up'],round(.1+.05,6))
  self.assertEqual(targets['eyes/l-eye-bag-incr'],.2)
  self.assertIn('mouth/mouth-upperlip-middle-down',targets)
 def test_recipe_targets_empty_without_face_fields(self):
  self.assertEqual(recipe_targets(copy.deepcopy(BASE)),{})
 def test_bad_numeric_values(self):
  for field,value in [('age',-1),('gender',2),('weight',math.nan),('muscle',True)]:
   c=copy.deepcopy(BASE);c['body'][field]=value
   with self.subTest(field=field),self.assertRaises(ValueError):validate_config(c,ASSETS,TARGETS)
 def test_paths_unknown_assets_and_targets(self):
  for field,value in [('outfit','../LISA'),('skin','/tmp/x'),('hair','missing-hair')]:
   c=copy.deepcopy(BASE);c[field]=value
   with self.subTest(field=field),self.assertRaises(ValueError):validate_config(c,ASSETS,TARGETS)
  c=copy.deepcopy(BASE);c['targets']={'../nose/nose-volume-incr':.5}
  with self.assertRaises(ValueError):validate_config(c,ASSETS,TARGETS)
 def test_race_sum_height_and_unknown_keys(self):
  for modify in [lambda c:c.update(height_m=0),lambda c:c['body']['race'].update(asian=.5),lambda c:c.update(heigth=1.7),lambda c:c['body'].update(wieght=.5)]:
   c=copy.deepcopy(BASE);modify(c)
   with self.assertRaises(ValueError):validate_config(c,ASSETS,TARGETS)
 def test_unrelated_output_directory_is_protected(self):
  with tempfile.TemporaryDirectory() as directory:
   path=Path(directory);(path/'notes.txt').write_text('keep me')
   with self.assertRaises(ValueError):validate_output_directory(path)
   (path/OUTPUT_MARKER).write_text('character-master-v1\n')
   self.assertEqual(validate_output_directory(path),path)
   self.assertEqual((path/'notes.txt').read_text(),'keep me')

if __name__=='__main__':unittest.main()
