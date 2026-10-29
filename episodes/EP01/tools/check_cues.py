#!/usr/bin/env python3
"""Check that the production cue sheet preserves the source manifest."""
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / 'artifacts/character-master/sources/story/v4.3-timing/EP01_FULL_v4.2_DIALOGUE_RECORDING_MANIFEST.csv'
DERIVED = ROOT / 'episodes/EP01/script/EP01-cues.csv'

with SOURCE.open(encoding='utf-8', newline='') as source_file, DERIVED.open(encoding='utf-8', newline='') as derived_file:
    source = csv.DictReader(source_file)
    derived = csv.DictReader(derived_file)
    source_fields = source.fieldnames
    source_rows, derived_rows = list(source), list(derived)

assert len(source_rows) == len(derived_rows) == 197, 'expected 197 cues in both files'
assert derived.fieldnames[:len(source_fields)] == source_fields, 'source columns changed'
for index, (original, copy) in enumerate(zip(source_rows, derived_rows), 1):
    assert original['cue'] == copy['cue'] == f'EP01-VO-{index:03}', f'cue order at {index}'
    for field in source_fields:
        assert original[field].encode('utf-8') == copy[field].encode('utf-8'), f'{original["cue"]}: {field} changed'
print('OK: 197 cues in order; all original fields match UTF-8 bytes')
