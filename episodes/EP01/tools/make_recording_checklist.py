#!/usr/bin/env python3
"""Build the recording checklist from the current cue table."""
import csv
from collections import Counter
from pathlib import Path

EPISODE = Path(__file__).resolve().parents[1]
SOURCE = EPISODE / 'script' / 'EP01-cues.csv'
OUTPUT = EPISODE / 'audio' / 'kit' / 'recording-checklist.csv'
FIELDS = ['session', 'actor_id', 'cue', 'beat', 'language', 'line', 'direction',
          'intensity', 'layering', 'done', 'take_file']
UNASSIGNED = {'ДИСПЕТЧЕР': 'dispatcher', 'РАДИО': 'radio', 'СҮХЭЭ': 'sukhee'}

with SOURCE.open(encoding='utf-8', newline='') as file:
    source = list(csv.DictReader(file))

sessions = {}
rows = []
for cue in source:
    actor = cue['actor_id'] or UNASSIGNED[cue['speaker']]
    sessions.setdefault(actor, len(sessions) + 1)
    direction = cue['actor_direction_from_source']
    text = direction.lower()
    intensity = ('panic' if any(word in text for word in ('gasping', "can't get enough air", 'screaming', 'shouting')) and 'not screaming' not in text
                 else 'tense' if any(word in text for word in ('urgent', 'uncertainty', 'struggling', 'hoarse', 'broken breath', 'sharper', 'irritated'))
                 else 'calm')
    layering = 'yes' if any(word in text for word in ('gasping', "can't get enough air", 'shouting', 'screaming')) and 'not screaming' not in text else ''
    rows.append(dict(session=f'{sessions[actor]:02}', actor_id=actor, cue=cue['cue'],
                     beat=cue['beat'], language=cue['language'],
                     line=cue['exact_spoken_dialogue_from_v4.2'], direction=direction,
                     intensity=intensity, layering=layering, done='', take_file=''))
rows.sort(key=lambda row: (row['session'], row['beat'], row['cue']))

source_lines = {row['cue']: row['exact_spoken_dialogue_from_v4.2'].encode('utf-8') for row in source}
assert len(source) == 197 and len(source_lines) == 197, 'Expected 197 unique source cues'
assert Counter(row['cue'] for row in rows) == Counter(source_lines.keys()), 'Cue coverage differs'
assert all(row['line'].encode('utf-8') == source_lines[row['cue']] for row in rows), 'Dialogue differs'
with OUTPUT.open('w', encoding='utf-8', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=FIELDS, lineterminator='\n')
    writer.writeheader()
    writer.writerows(rows)
with OUTPUT.open(encoding='utf-8', newline='') as file:
    saved = list(csv.DictReader(file))
assert Counter(row['cue'] for row in saved) == Counter(source_lines.keys())
assert all(row['line'].encode('utf-8') == source_lines[row['cue']] for row in saved)
print(f'OK: {len(saved)} unique cues, each dialogue field byte-identical to source; {len(sessions)} sessions')
