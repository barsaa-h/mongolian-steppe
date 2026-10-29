# ХАНИАД — Character Master

The home for the **chosen MakeHuman/MPFB character system**, Episode 1 sources,
current status and remaining jobs. Updated 28 October 2026 after reading the
[shared conversation](https://chatgpt.com/share/6ae1cba6-19d0-83ec-b2e6-028640ff7590).

Keep the existing character foundation and Ganaa's approved identity. The user's
estimate is about 40% complete. We can start Episode 1 layout and acting work;
the characters and episode are not yet approved finished shots.

## Start here

1. [Source decisions](production/SOURCES.md): ten-episode season v3, Episode 1
   dialogue v2.1, what supersedes the old bible, and unresolved continuity.
2. [Character status](production/STATUS.md): the 13 existing actors, approvals,
   missing role assignments and known failures.
3. [Jobs](production/JOBS.md): the next work, in order. First prove **Ganaa,
   Hürel and Dasha in Hürel's café**.
4. [DNA workflow](DNA.md) and [generator guide](GUIDE.md): how to edit and build
   from the shared source without losing authoring topology or manual work.
5. [Episode 1 Blender environments](../../assets/maps/episode-1/README.md): current
   café, pickup road, freight yard and apartment layouts for character blocking.
6. [Full-size Naran town](../../assets/maps/naran-city/README.md): the separate
   metric town master and Episode 1 arrival/apartment neighborhood.

## Folder map

| Folder / file | What belongs here |
| --- | --- |
| `production/` | Active status, jobs, source authority, import/cleanup manifests and this organization’s verification. |
| `work/` | Manual source work and layered authoring, kept outside replaceable generated output. |
| `sources/story/` | Current ten-episode treatment, logic audit, original production-directed Act I and voice cue sheet. Only Episode 1 of Act I is current plot/dialogue. |
| `sources/world/` | Recovered World Bible, proposed maps, location/route/asset tables and regenerated town graybox. |
| `sources/planning/` | Original production-readiness plan and 44-task source backlog. |
| `sources/cafe/` | Recovered 84-second café blocking kit: GLB, source scripts, 11 shots, exact dialogue cues, sound list and integration notes. |
| `sources/provenance/` | Readable shared conversation and recovery record; regenerated files are distinguished from original downloads. |
| `sources/makehuman-core/` | Shortcut to the existing fitted graphical assets, manifests and licenses in `assets/sources/`. |
| `sources/mpfb2-2.0.18/` | Shortcut to the pinned generator dependency and its licenses. |
| `episode-1/` | Shortcut to `artifacts/episode-1-cast/`: authoritative DNA, 13 actor builds, QA and useful technical studies. |
| `scripts/`, `dna/`, `textures/` | Shared generator code, semantic controls, libraries and material layers. |
| `presets/` | Five reusable example recipes. |
| `default/`, `male/`, `heavy/`, `slim-tall/`, `child/`, `qa/` | Generated regression examples and comparison evidence. Keep these for shared-system checks. |
| `baseline/` | Older comparison stills; reference only. |
| `archive/` | Retired standalone prototypes, superseded Ganaa builds and documents saved before this organization. |

Shortcuts expose the existing files, not duplicate copies. Canonical build paths
stay unchanged so scripts and the live application keep working. Open web
galleries through the canonical URLs below; their relative imports expect them.

## Inspect and build

From the repository root, run `artifacts/character-master/launch.sh` and keep
that server running:

- [Episode 1 actors](http://127.0.0.1:5180/artifacts/episode-1-cast/)
- [Neutral lineup and profiles](http://127.0.0.1:5180/artifacts/episode-1-cast/qa/)
- [Shared-system examples](http://127.0.0.1:5180/artifacts/character-master/)

Edit `artifacts/episode-1-cast/dna/<id>.json`. Rebuild one actor from the
repository root:

```sh
blender -b --factory-startup --python-exit-code 1 -t 6 \
  --python artifacts/episode-1-cast/scripts/build_actor.py -- ganaa
```

This replaces that actor's generated folder. Store manual work outside generated
outputs; see [DNA.md](DNA.md) for required character QA and human design review.
No actor was regenerated or newly approved during this organization.

## Cleanup

29 October 2026: the LISA and standalone PS2 horror prototypes, the old ep1–ep10
graybox maps and the `man.html` prototype were deleted. They can be recovered from git tag
`snapshot/pre-cleanup-2026-10-29`. The nine superseded Ganaa builds remain in
[the archive](archive/README.md). The
[move manifest](production/organization-manifest.json) records all 405 files and
their hashes. Current actors, fit/motion studies, master examples and runtime
cast remain available.

The café is the accepted next layout test, so its graybox stays active reference
material, separate from the retired character-design prototypes.
