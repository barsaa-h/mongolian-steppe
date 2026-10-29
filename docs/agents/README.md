# ХАНИАД — agent master plans

Written 29 October 2026 from the EP01 v4.0 beat sheet, the EP01 v4.2 script, the EP02 v4.0/v4.1 handoffs, the season v3 bible and the current repository.

Every agent reads **[00 — production master plan](00-production-master-plan.md)** first. Then it reads its own department plan:

| # | Department | Plan | Owns (writes) |
| --- | --- | --- | --- |
| 01 | Story & continuity | [01-story-continuity.md](01-story-continuity.md) | `docs/production/continuity/`, `episodes/*/script/` |
| 02 | Characters | [02-characters.md](02-characters.md) | `artifacts/character-master/`, `artifacts/episode-1-cast/`, `assets/cast/` |
| 03 | Environments (maps) | [03-environments.md](03-environments.md) | `assets/maps/` |
| 04 | Props & vehicles | [04-props-vehicles.md](04-props-vehicles.md) | `assets/props/`, `assets/vehicles/` |
| 05 | Look & lighting | [05-look-lighting.md](05-look-lighting.md) | `assets/look/`, `src/psx.js`, lighting collections in shot files |
| 06 | Animation & performance | [06-animation-performance.md](06-animation-performance.md) | `assets/animation/`, actor action data in shot files |
| 07 | Sound & voice | [07-sound-voice.md](07-sound-voice.md) | `assets/sound/`, `episodes/*/audio/` |
| 08 | Layout, edit & render | [08-layout-edit-render.md](08-layout-edit-render.md) | `episodes/*/shots/`, `episodes/*/edit/`, `scripts/render-*` |

Claude Code wrappers for the same agents live in `.claude/agents/khaniad-*.md`. They load these files, so **edit the plan here, not in the wrapper**.

To launch one from Claude Code, ask for it by name, e.g. "use khaniad-environments to do E02". To use one from another tool (Codex, ChatGPT), paste this README, the master plan and the department plan, then name the task ID.

**Worker CLIs (Grok, later Codex):** Claude writes a brief per task and runs it in an isolated worktree. See [workers/README.md](workers/README.md).
