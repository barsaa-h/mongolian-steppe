import copy
import math
import unittest
import tempfile
from pathlib import Path
from config import validate_config, validate_output_directory, OUTPUT_MARKER

ASSETS = Path(__file__).resolve().parents[3] / 'assets/sources/makehuman-core'
TARGETS = Path(__file__).resolve().parents[3] / 'assets/sources/mpfb2-2.0.18/mpfb/data/targets'
BASE = {'name':'Default','height_m':1.7,'body':{'gender':0,'age':.5,'weight':.5,'muscle':.4,'proportions':.5,'height':.5,'race':{'asian':1,'african':0,'caucasian':0}},'skin':'young_asian_female','hair':'short02','outfit':'male_casualsuit01','shoes':'shoes02','targets':{}}

class ConfigTest(unittest.TestCase):
 def test_valid_config_and_named_target(self):
  c=copy.deepcopy(BASE);c['targets']={'nose/nose-volume-incr':.35}
  self.assertEqual(validate_config(c,ASSETS,TARGETS),c)
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
