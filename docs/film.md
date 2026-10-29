# ХАНИАД — Тав дахь цаг

> Current Episode 1 story/acting source: [source decisions](../artifacts/character-master/production/SOURCES.md). The next production test is the recovered 84-second café layout. The 30-second HOUR 5 export below remains legacy technical evidence: its face slap/self-talk and driver staging differ from the current screenplay. It is not current Episode 1 story approval.

A 30-second excerpt from the approved Episode 1 **HOUR 5** scene. Source dialogue
and series bible are preserved in `docs/production/`. It is an excerpt from a
longer episode: Hürel and Altan are established earlier in that episode.

## Edit and performance

| Time | Picture and action |
|---|---|
| 0–1.6 | Naran approach establishing shot |
| 1.6–3 | Bandaged wrist and infection line insert |
| 3–6 | Radio excerpt; Ganaa listens |
| 6–13 | Disbelief and anger; mouth and facial movement with the approved response |
| 13–16 | Sheep crossing, braking and body reaction |
| 16–17.6 | Sheep from the driver's viewpoint |
| 17.6–21 | Hunger in Ganaa's eyes, mouth and posture |
| 21–24 | Right hand releases wheel, anticipates, strikes cheek at 22.15, recoils and returns |
| 24–28 | Resolve and Altan; gaze returns forward |
| 28–30 | Truck resumes; Naran and end title |

Dialogue is preserved. The first radio cue is explicitly labelled an excerpt,
joining the original flu-announcement phrase to its final reassurance with an
ellipsis. The full radio announcement cannot fit this short edit at a readable pace.

Ganaa's `hour-five` clip is authored in Blender and sampled at 24fps. Bone poses
and facial shapes are baked into the GLB. Blender IK controls establish palm
contact with the steering rim and cheek; constraints are not required at runtime.
`assets/cast/cab.json` is the shared cab calibration used by the Blender authoring
script, runtime truck, and contact tests. The animation mixer is the sole pose
owner. `setTime(seconds)` supplies deterministic playback and export.

## Watch and export

Run `npm start`, then open `/film.html`. Space plays/pauses; R replays. The range
control scrubs without advancing another animation clock. Map navigation remains
available. The soundtrack is procedural engine, wind, braking, bells and impact;
there are no generated voices. Speech mouth shapes are timed performance cues,
not phonetic lip sync.

Subtitles are DOM text in the player and burned into the export; an SRT is also
written. Export uses Playwright and FFmpeg as local authoring tools:

```sh
npm run build:film
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/render-film.mjs
```

Keep the local server on port 5173. `FILM_URL` can select another server URL.
The output is `output/film/khaniad-hour-five.mp4`: exactly 30 seconds, 1280×720,
24fps, H.264/AAC. Adjacent SRT, WAV and poster files accompany the MP4.

The map and film use restored autumn materials. No active snowfall is added to
this excerpt. Later screenplay scenes that explicitly require snow retain the
optional snow treatment for their own staging.
