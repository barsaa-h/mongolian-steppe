#!/usr/bin/env python3
"""Generate the two timed scene plans and subtitle tracks from story sources."""
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'episodes/EP01'
STORY = ROOT / 'artifacts/character-master/sources/story'
TIMING = STORY / 'v4.3-timing'


def read(path):
    with path.open(encoding='utf-8', newline='') as file:
        return list(csv.DictReader(file))


def seconds(value):
    parts = [int(part) for part in value.split(':')]
    return sum(part * 60 ** index for index, part in enumerate(reversed(parts)))


def timecode(sec):
    return f'{sec // 3600:02}:{sec // 60 % 60:02}:{sec % 60:02}:00'


def srt_time(sec):
    return f'{sec // 3600:02}:{sec // 60 % 60:02}:{sec % 60:02},000'


cues = read(TIMING / 'VOICE_EDIT_TIMELINE_v4.3.csv')
manifest = read(TIMING / 'EP01_FULL_v4.2_DIALOGUE_RECORDING_MANIFEST.csv')
beats = read(STORY / 'EP01_25min_Scene_Beats_v4.0.csv')
cameras = read(OUT / 'tools/birthday_camera_notes.csv')
# Location and working story-clock time are editorial summaries of the script and clock.
places = [
    ('Ulan-Ude freight yard', 'pre-dawn ~05:50'), ('Freight dispatch office', 'pre-dawn ~06:10'),
    ('Naran streets', 'morning'), ('Nyamka shop', 'morning'), ('Apartment', 'late morning'),
    ('Ulan-Ude freight yard', 'morning ~09:00'), ('Ulan-Ude freight yard', 'morning ~09:00'),
    ('Border and road', 'day ~13:40–14:55'), ('Naran clinic frontage', 'day'),
    ('Apartment', 'afternoon'), ('Border road / KAMAZ', 'afternoon ~15:10'),
    ('KAMAZ / roadside', 'afternoon'), ('KAMAZ', 'afternoon'), ('Naran apartment courtyard', 'late afternoon'),
    ('Hürel café', 'late afternoon ~16:05'), ('Hürel café', 'late afternoon'),
    ('Hürel café / KAMAZ', 'late afternoon ~16:35'), ('Hürel café forecourt', 'late afternoon ~16:55'),
    ('Livestock truck', 'evening'), ('Naran clinic road', 'night ~18:05'),
    *[('Apartment', 'night ~19:20–21:01')] * 6,
]
fields = ['shot', 'beat', 'scene', 'start', 'end', 'start_tc', 'end_tc', 'handle_in_frames', 'handle_out_frames', 'lens', 'tier', 'location', 'time_of_day', 'actors', 'props', 'line_ids', 'timeline_cues', 'renderer', 'status', 'approval', 'notes']
rows = []
for beat, (location, clock) in zip(beats, places):
    number = int(beat['beat'])
    actors = list(dict.fromkeys(row['speaker'] for row in manifest if int(row['beat']) == number))
    rows.append(dict(shot=f'B{number:02}_S000', beat=f'{number:02}', scene='episode target', start=beat['start'], end=beat['end'], start_tc=timecode(seconds(beat['start'])), end_tc=timecode(seconds(beat['end'])), location=location, time_of_day=clock, actors='; '.join(actors), status='planned', notes=beat['title']))

for scene, filename in [('Birthday 90s', 'birthday_90s.mn.srt'), ('Door 64s', 'door_64s.mn.srt')]:
    selected = [cue for cue in cues if cue['test'] == scene]
    subtitles = []
    for cue in selected:
        if cue['spoken_text']:
            subtitles.append(f"{len(subtitles)+1}\n{srt_time(seconds(cue['in']))} --> {srt_time(seconds(cue['out']))}\n{cue['spoken_text']}\n")
    (OUT / 'animatic' / filename).write_text('\n'.join(subtitles), encoding='utf-8')
    covered = []
    for camera in (row for row in cameras if row['scene'] == scene):
        group = [cue for cue in selected if int(camera['first_cue']) <= int(cue['cue']) <= int(camera['last_cue'])]
        assert group, camera['shot']
        covered.extend(cue['cue'] for cue in group)
        ids = []
        for cue in group:
            if not cue['spoken_text']:
                continue
            matches = [m['cue'] for m in manifest if m['beat'] == camera['beat'] and m['speaker'] == cue['speaker'] and m['exact_spoken_dialogue_from_v4.2'] == cue['spoken_text']]
            if len(matches) != 1:
                raise ValueError(f"Unmatched or ambiguous {scene} cue {cue['cue']}: {cue['spoken_text']} ({matches})")
            ids.extend(matches)
        start, end = group[0]['in'], group[-1]['out']
        rows.append(dict(shot=camera['shot'], beat=camera['beat'], scene=scene, start=start, end=end, start_tc=timecode(seconds(start)), end_tc=timecode(seconds(end)), handle_in_frames='12' if ids else '0', handle_out_frames='12' if ids else '0', lens=camera['lens'], tier=camera['tier'], location='EP01_Apartment', time_of_day='night ~20:55–21:01', actors=camera['actors'], props=camera['props'], line_ids='; '.join(ids), timeline_cues='; '.join(cue['cue'] for cue in group), renderer='eevee', status='layout-planned', notes=camera['notes']))
    assert sorted(covered, key=int) == [cue['cue'] for cue in selected], f'{scene}: cue coverage'
    scene_rows = [row for row in rows if row['scene'] == scene]
    assert seconds(scene_rows[0]['start']) == 0 and all(a['end'] == b['start'] for a, b in zip(scene_rows, scene_rows[1:])), f'{scene}: shot gaps or overlaps'
    assert scene_rows[-1]['end'] == selected[-1]['out'], f'{scene}: end'

with (OUT / 'shotlist.csv').open('w', encoding='utf-8', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=fields, lineterminator='\n')
    writer.writeheader()
    writer.writerows(rows)
