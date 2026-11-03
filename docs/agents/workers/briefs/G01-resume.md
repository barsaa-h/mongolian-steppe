# RESUME

Your previous run of this job was killed by a session restart at about 21:54 before you could report. **Inspect what you already built in this worktree first** (files, latest versions, logs under `.cache/`, previews), keep it, continue numbering from where you stopped, and finish the job. Only view PNG/JPEG images. The full brief follows.

# G01 (DeepSeek): title card, end credits and episode graphics

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue in `~/ms-workers/E09` (panels, subtitles, `edit.mjs`, sound kit, lip-sync are yours). Series: **ХАНИАД** (Mongolian horror, 1998). Episode 1: **«АЯГАА ХУВААЛЦ»** (English: *Share the Bowl*). Story: `artifacts/character-master/sources/story/EP01_AyaGaa_Huvaalts_25min_Beat_Sheet_v4.0.md` (beat 02 ends: "the spinning tape spool cuts to a turning market bicycle wheel in Naran. **Title card** over ordinary sound, not over a dramatic explosion.").

## Build (Silent Hill 2-era restraint: plain type, darkness, grain; techniques only, never its assets or logo style copy)
1. **Title card** (B02→B03 transition): «ХАНИАД» series title and «АЯГАА ХУВААЛЦ» episode title (+ small «1-р анги» / "Episode 1"), 4–6 s, over picture or black (two variants), with a slow fade/drift and film grain; fonts: only fonts installed locally with Cyrillic incl. **Ө Ү** (check `fc-list :lang=mn`), license OK for video (e.g. DejaVu, Liberation, Noto if present). Typography decisions: weight, tracking, size, placement, a subtle imperfection (print-like), no glow/chrome/trailer clichés. Make 3 design options → `out/graphics/title-options.jpg`, then pick one and explain why.
2. **End credits** (~40 s, roll or cards): written/directed/voices by the creator (placeholder `[ҮЙЛДВЭРЛЭГЧ]`, the user fills names), cast list as voiced roles from `artifacts/character-master/production/EP01-v4-CAST.md` (role names in Mongolian with Latin transliteration), "Sound and music: original, made for this episode", a notice that this is fiction, the year 2026, a dedication line placeholder. Mongolian first, English second. Black background, grain, quiet.
3. **Location/time captions** if the panels use them (e.g. «Улаан-Үд, 1998 оны 11-р сар» / «Наран»): a consistent small caption style + `captions.json` keyed to panel ids (pick only beats where orientation matters: B01, B03, B08 border, B15 café, B19 Naran arrival), Mongolian + English.
4. Integrate into `edit.mjs`: inserts the title card at the B02→B03 cut, credits at the end, captions as burn-in overlays (ASS or rendered PNG overlays), all optional flags; a dry-run render `out/master/dryrun_titles.mp4` (B02 end → title → B03 start with placeholder frames, plus the credits) and grabbed frames `out/graphics/*.png` (look at every one).
5. `tools/graphics-check.mjs`: every glyph used is in the chosen font (no tofu), title/credit durations, safe-area margins (5 % action-safe), the protected story facts untouched.

## Rules
- Write only `episodes/EP01/graphics/**`, `episodes/EP01/threejs/tools/{edit,graphics-check}.mjs` (+ tests), `out/graphics/**`, `out/master/**`. No commits. Don't touch `AGENTS.md`. No Blender. View only PNG/JPEG images.
- `npm test` must pass.
- Final `## Report:` with files, commands + output, evidence, and what still looks wrong.
