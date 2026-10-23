# НАРАН ХОРООЛОЛ — PSX

A Three.js town with a PSX-style renderer, an animated day cycle, and a textured character.

## Character studio

Run `npm run start:character` and open
[http://localhost:5174/character.html](http://localhost:5174/character.html).
The studio has a refined face texture, full-resolution close-ups, a turntable,
idle/walk/wave previews, and 320 outfit combinations from ten garment
silhouettes, eight palettes, and four headwear choices. Main-character and
background modes share the same rig and use different texture/garment detail.
Export an outfit JSON to retain its stable selection ID.

See [the character guide](docs/character-production.md) for the reusable API,
asset provenance, and the limits of this base character.

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
| `npm test` | Run the day-cycle regression tests with Node's built-in test runner |
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
| `src/world.js` | World layout, lighting, and the day cycle |
| `src/structures.js` | Buildings |
| `src/parts.js` | Props and materials |
| `src/textures.js` | Generated textures |
| `src/character.js` | Character loading and appearance |
| `src/characterGarments.js` | Skin-weighted garment geometry |
| `src/characterAnimation.js` | Procedural pose and movement previews |
| `src/wardrobe.js` | Garment definitions, palettes, headwear, and outfit IDs |
| `src/characterOnly.js` / `character.html` | Character studio and controls |
| `src/main.js` | Camera, input, and application startup |
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
- A toggles automatic orbit.
- 1–5 select camera views.
- Left/right arrows scrub the day cycle; Space pauses it.

`.editorconfig` supplies consistent indentation and line endings for editors
that support it. `.gitignore` excludes dependencies, generated builds, logs,
and local environment files. This folder has no Git history yet; initialize
a repository if you want versioned recovery of your work.

The automated checks do not validate WebGL rendering or character assets in
a browser. Check the scene visually after changing rendering or assets.
