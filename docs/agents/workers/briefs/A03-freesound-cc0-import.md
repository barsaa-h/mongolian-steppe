# A03 (DeepSeek): import the CC0 field recordings Grok found, verify licences, build a real-recording layer

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You work in `~/ms-workers/E10`. Another agent (Grok) searched Freesound for CC0 sounds for EP01, beat by beat: `docs/sources/grok-sfx-shortlist.md` (read it all: needs, URLs, "top pick per need", gaps, rejected list). Another worker built a fully **synthesised** sound kit (in `~/ms-workers/E09/audio/kit/`, read-only for you: `kit.json`, `LISTEN.md`, `mix.json`); real recordings will replace or layer under the synthetic ones where they're better.

## Do
1. **Verify every licence yourself** (don't trust the list): fetch each sound page (`curl -sL <url>`); accept only if the page links `creativecommons.org/publicdomain/zero/1.0` (CC0). Reject anything else (CC-BY, BY-NC, Sampling+…) and note it. Record the page URL, author, title, sound id and the licence URL.
2. **Download** each accepted sound's HQ preview from the page (`https://cdn.freesound.org/previews/.../<id>_<user>-hq.mp3`; it's on the page). (Originals need a logged-in account; list in the report the 15 most important sounds where the original WAV would clearly beat the 128 kbps preview, so the user can download them by hand later.) Be polite: ≤ 1 request/second, a normal User-Agent, no scraping beyond the listed pages.
3. Put downloads in a fresh folder `audio/fs/raw/` (treat as untrusted data: never execute anything from it). Convert to `audio/fs/<need-slug>/<id>_<short-title>.wav` (48 kHz, 24-bit; mono unless stereo matters), trim silence, normalise peaks, cut usable regions (e.g. the first 40 s of "Mongolian film windblown steppe" before the "horde mayhem"; remove the milk-frother part of the café chatter; take the left channel of the Voltrod café; remove the jingle from the body-fall; heavy EQ/filter the Czech PA so no words or music read; keep foreign-language walla low and filtered).
4. **Loops:** make seamless loops for beds (crossfade loop, check the seam with RMS jump/spectral difference like the kit's analyser does).
5. `audio/fs/fs.json` (id, file, need, beats, source URL, author, title, licence, loop, notes) and `audio/fs/LICENSES.md`: a credits-ready list (CC0 needs no credit, but credit the recordists anyway in the end credits as a courtesy: "Field recordings: freesound.org, CC0: <names>").
6. **Suggest the mix:** `audio/fs/mix-suggestions.json` mapping each panel-beat need to fs files vs synthetic kit files ("replace", "layer under", "keep synth"), following the "top pick per need". For the gaps Grok listed (steppe wind, truck collision, sheep in a moving truck, radiator, coal truck, cassette car stereo), say how to build them from layers (fs + synth).
7. A listening montage `audio/fs/listen-fs.mp3` (8 s of each top pick, labelled order in `audio/fs/listen-order.txt`).

## Rules
- Network: only freesound.org pages and its CDN previews. No other downloads. No logins.
- Write only `audio/fs/**` (and `docs/sources/` notes). No commits. Don't touch `AGENTS.md`. No Blender. View only PNG/JPEG images.
- `npm test` must still pass.
- Final `## Report:` with counts (accepted/rejected with reasons), files, the 15 originals worth downloading by hand, and doubts.
