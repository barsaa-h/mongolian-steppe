# ХАНИАД — THE COUGH

A ten-episode Mongolian animated horror series. It is set in Naran, a fictional northern town, in late November 1998. **EP01 «АЯГАА ХУВААЛЦ»** is a 25-minute pilot. The look is PS2-era horror, with high-resolution, detailed close-ups.

## Start here

| You want | Go to |
| --- | --- |
| The production plan, milestones and agent departments | [docs/agents/](docs/agents/README.md) → [00 master plan](docs/agents/00-production-master-plan.md) |
| Which story version is current | [SOURCES.md](artifacts/character-master/production/SOURCES.md) |
| EP01 script (v4.2) and beat sheet (v4.0) | [sources/story/](artifacts/character-master/sources/story/) |
| Characters (DNA, builds, status) | [Character Master](artifacts/character-master/README.md), [status](artifacts/character-master/production/STATUS.md) |
| EP01 location sets | [assets/maps/episode-1/](assets/maps/episode-1/README.md) |
| The full Naran town | [assets/maps/naran-city/](assets/maps/naran-city/README.md) |
| Historical plans and superseded docs | [docs/history/](docs/history/) |

## Folder map

| Folder | Contents |
| --- | --- |
| `artifacts/character-master/` | Shared MakeHuman/MPFB character system, story/world sources, production status, review boards |
| `artifacts/episode-1-cast/` | EP01 actor DNA (`dna/<id>.json`), 43 built actors, the Ganaa studies, QA |
| `assets/cast/` | Runtime GLBs: `dna/` (the new DNA cast) and the legacy 48-character roster |
| `assets/maps/` | Blender sets: `episode-1/` (café, border road, freight yard, apartment) and `naran-city/` |
| `assets/sources/` | Third-party source assets and licenses (MakeHuman, MPFB, etc.) |
| `src/`, `tests/`, `scripts/` | Three.js runtime (town, character studio, HOUR-5 film), tests, build/inspect tools |
| `docs/` | Agent plans, production notes, research, references, history |
| `episodes/` | Created by the layout agent: shot files, animatic, edit, renders (renders are git-ignored) |

## Runtime (Three.js preview)

The browser app is the T2 preview tier and a technical testbed. It is not the final renderer for close-ups.

A Three.js town with a PSX-style renderer, an animated day cycle, and a textured character.

The map opens on the restored autumn Naran Khoroolol overview: muted steppe,
worn fenced yards, Soviet apartments, soft hills, local frost and a working
valley approach. Rendering uses the earlier 720-pixel internal height with
antialiasing and restrained dithering. Orbit and daylight remain paused initially.

## 30-second cinematic

Open [http://localhost:5173/film.html](http://localhost:5173/film.html) after
`npm start`, or select **ХАНИАД · 30s FILM** on the map. The film adapts Episode 1's
HOUR 5 scene with an authored, baked Ganaa performance, Mongolian bottom subtitles
and environmental sound. There are no generated voices.
Space plays/pauses, R replays, and the timeline supports deterministic seeking.
See [the shot list and export instructions](docs/film.md).

## Cast studio

Open [http://localhost:5173/character.html](http://localhost:5173/character.html)
after `npm run build`, or use `npm run start:character` on port 5174.
The selector contains 48 on-screen characters from Episodes 1–5, with script
metadata, distinct proportions, faces, hairstyles and fitted clothing. Inspect
expressions, movement, turntables, and Ganaa's 30-second seated performance.
The **Legacy wardrobe** selection retains the original 320 outfit combinations.
Main/background selections currently share the same authored cast geometry.

The [cast roster](docs/cast.md), [character API](docs/character-production.md) and
[asset credits](docs/asset-sources.md) describe the sources and production limits.
Editable Blender sources and runtime GLBs are paired in `assets/cast/`.
Rebuild them with Blender 5.2:

```bash
blender --background --factory-startup --python scripts/build-cast.py
# Rebuild one actor:
blender --background --factory-startup --python scripts/build-cast.py -- ganaa
```

## Start working

Use Node.js 24 and npm. With nvm, run `nvm install` and `nvm use` to select
the version in `.nvmrc`.

```bash
cd /home/barsaa/mongolian-steppe
npm ci
npm start
```

Open [http://localhost:5173](http://localhost:5173). Saving a change to any
imported JavaScript module rebuilds the bundle and reloads the browser.
Source maps connect browser errors to the original files in `src/`.
Changes to `index.html` or image/model assets need a manual browser refresh.
Stop the server with Ctrl+C. If the port is busy, stop the other instance
or run `npm start -- --serve=127.0.0.1:5174`.

The development server listens on your computer only. No API keys, `.env`
file, Python, or global build tools are needed. Internet is needed for the
initial dependency installation; development and builds then use local tools.

## Commands

| Command | Purpose |
|---|---|
| `npm start` / `npm run dev` | Local server on port 5173, watch mode, source maps, and JavaScript reload |
| `npm run build` | Create the minified production bundle at `dist/bundle.js` |
| `npm test` | Run cast, skinning, film, terrain, navigation and lighting tests |
| `npm run check` | Run the tests and compile the complete scene |

Run `npm run check` before sharing changes. It overwrites the development
bundle with the production build; restart `npm start` afterward to restore
the development bundle and its reload connection.

Dependencies are pinned in `package.json` and `package-lock.json`. Use
`npm ci` for a clean, repeatable installation. Use `npm install` when
intentionally changing dependencies, and retain the updated lockfile.

## Where to edit

| File | Responsibility |
|---|---|
| `src/world.js` | Lighting, day cycle, and scene assembly |
| `src/district.js` | Naran town: khashaa yards, hospital, school, square, heating plant, cordon |
| `src/terrain.js` | Shared ground heights for rendering, roads, and movement |
| `src/winter.js` | Autumn hill ranges, valley approach, roadside sign, KamAZ, radio mast; optional roof snow |
| `src/structures.js` | Buildings |
| `src/parts.js` | Props and materials |
| `src/textures.js` | Generated textures |
| `src/character.js` | Character loading and appearance |
| `src/characterGarments.js` | Skin-weighted garment geometry |
| `src/characterAnimation.js` | Procedural pose and movement previews |
| `src/wardrobe.js` | Garment definitions, palettes, headwear, and outfit IDs |
| `src/characterOnly.js` / `character.html` | Character studio and controls |
| `src/main.js` | Camera, input, and application startup |
| `src/film.js` / `film.html` | Cinematic staging, character poses, cameras and player |
| `src/filmTimeline.js` | 30-second edit, subtitle cues and truck timing |
| `scripts/build-cast.py` | Editable cast geometry, facial shapes and baked movement/performance |
| `src/cast.js` / `assets/cast/roster.json` | Script identities, alias lookup and authored appearance profiles |
| `src/filmSound.js` | Procedural environmental soundtrack |
| `scripts/render-film.mjs` | Deterministic 24 fps MP4, SRT, sound and preview export |
| `src/psx.js` | Post-processing and PSX rendering |
| `src/mergeStatic.js` | Static geometry batching |
| `index.html` | Canvas, HUD, and page styles |
| `assets/male_casual/` | Character FBX model and texture |
| `tests/world.test.mjs` | Day/night and lighting-cycle checks |

`dist/bundle.js` is generated; edit the source files instead. To share a
production build, run `npm run build` and serve `index.html`, `dist/bundle.js`,
and `assets/` together, preserving those relative paths. The character is
loaded separately, so this project needs a web server rather than `file://`.

## Controls

- Drag to orbit; scroll to zoom.
- Enter steps into the herder. WASD runs, Shift sprints, F toggles flying, Space rises, Ctrl descends. Esc returns to the map.
- A toggles automatic orbit while you are on the map.
- 1–8 select camera views: overview, square, school, khoroolol, hospital, heating plant, cordon, yards.
- `[` and `]` scrub the day cycle; Space starts or pauses it while you are on the map.

`.editorconfig` supplies consistent indentation and line endings for editors
that support it. `.gitignore` excludes dependencies, generated builds, logs,
and local environment files. The current work remains on a local development branch.

The automated checks validate all exported cast heights, weights and driving contacts.
Use the browser inspection/export scripts for rendering and player checks after asset changes.
