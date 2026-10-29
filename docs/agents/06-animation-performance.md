# 06 — Animation & performance agent

**Mission:** make people behave like real people. That means ordinary work, banter, waiting and avoidance, and then the infected sprint-and-stop, which is fast and wrong. The performance must carry what the script refuses to say out loud.

**Owns:** `assets/animation/` (a reusable action library, mocap/reference notes) and the actor actions inside shot files (`<shot>_<actor>_v###`).
**Inputs:** 02's published rigs (shared 137-bone rig, face shape keys), 03's `ANCHOR.*` marks, 04's `GRIP`/`HINGE` empties, 07's scratch dialogue, 08's camera and timing.

## Order of work (user decision: animation first)
1. **Body first, without voices:** blocking, timing to the subtitle holds of the v4.3 timeline, physical contacts, props, doors, vehicles, attacks.
2. **The user records the voices** (M7). Shots are retimed to the real takes.
3. **Face and lip-sync last** (M8), on the real audio. Never lip-sync to synthetic or estimated durations. Before M8, mouths stay neutral or get a generic "talking" cycle, at most.

## Performance rules from the scripts
- **Ganaa:** quick, convivial, deflecting. When afraid he speaks fewer words. He never narrates his symptoms. In the sheep beat (19) his gaze is caught by the sheep's throat, then by his own reflection, and he looks away: **no slap, no self-talk**. In beats 24–25 the audience must not be able to tell appetite from resistance.
- **Altan (3):** short, concrete actions. She waits at the door, and her arm movements are a toddler's, not a small adult's.
- **Tsetsegmaa:** efficient, always mid-task. She interrupts because she's busy.
- **Dasha:** stillness that grows abnormal. She drifts toward heat, steam and food, then the hand that brings it.
- **Infected motion** (v3 rules): an abnormal sprint lasting about 2–3 minutes of story time, an abrupt stop, then a drift toward heat. Attacks are brief and messy, not a prolonged show of gore. No zombie shamble.
- **`[SILENCE]`** beats are performance: hold them, don't fill them.

## Tasks

| ID | Task | Acceptance | Status |
| --- | --- | --- | --- |
| A01 | **Base action library** | Idle-breathing (sitting and standing), walk (normal, tired, feverish), sit down/stand up, reach and take, pass an object, look-at with eye leads, kneel (beat 23), carry a child (Tsetsegmaa and Altan), coat on/off. Every action works on Base M, F and C. | open |
| A02 | **Face & lip sync** (M8, after the user's recordings) | Mongolian and Russian viseme sets from 02's CH09, driven by the user's recorded lines (e.g. via Rhubarb or a phoneme pass). Plus blinks, micro-saccades, swallowing, the beat-26 "unnatural inhale". | open |
| A03 | **Café performance (M4)**, beats 15–17 | Banter blocking around the kitchen threshold, Hürel pouring and wrapping buuz, Dasha's drift toward the steam and Hürel's throat, the attack (fast, kept short), the chair swing, the run to the truck, the wrist bite at the door. No mesh penetration in the required views. Seek/replay deterministic. | open |
| A04 | **Infected motion set** | Yard runner sprint across gravel, the stop, the drift to the steam pipe; Dasha's attack; the "Standing" idle near heat (needed from EP02 on) | open |
| A05 | **Truck performance** | Driving (reuse the Ganaa driver/grip studies), Dasha as passenger leaning on the heater, the shared bowl hand-off, eating the mutton at unnatural speed, Ganaa as a livestock-truck passenger | open |
| A06 | **Birthday ending**, beats 21–26 (**M2 first**: the 90 s birthday + 64 s door body blocking) | Flinching away from Dulmaa, the bone crack, giving the mittens and singing, lifting the bitten hand away from Altan's fingers, the sideways shove into the kitchen, bracing the door, Sükhee pushing it, the handle turning. Timed to the [v4.3 timeline](../../artifacts/character-master/sources/story/v4.3-timing/VOICE_EDIT_TIMELINE_v4.3.csv) holds now; retimed to the user's takes later. The bitten hand is the **left**; the right is the "good hand". | open |
| A07 | **Town life** for T2 | Short loops for the bus push, rug shaking, the water can, coal sacks and market bargaining. Crowd variation by offset and mirroring, not by unique clips. | open |
| A08 | **EP02 opening** (M10) | Ganaa's lunge and bite on Sükhee's upper arm, the escape down the stairs, Tsetsegmaa carrying Altan, Tungalag with the infant | open |

## Rules
- Contact first: hands hit `GRIP` points and feet stay planted. Keep checks for penetration and foot sliding in the tests.
- Keep identity shape keys and expression keys separate (see DNA.md). Never sculpt identity into an action.
- Use reference video (shot by the user or of the agent's own blocking) for every hero beat. Store notes in `assets/animation/reference/`.

## Inbox
_(other agents add requests here)_
