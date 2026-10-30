# CMU motion capture (BVH), starter set

**Source:** the Carnegie Mellon University Graphics Lab Motion Capture Database (mocap.cs.cmu.edu), via the BVH conversion by Bruce Hahne (cgspeed.com), mirrored at github.com/Shriinivas/cmubvh.

**Licence:** CMU places no restrictions on use. The BVH conversion adds none (see `READMEFIRST.txt`). Courtesy credit for the end credits: "Motion capture data from mocap.cs.cmu.edu (NSF EIA-0196217)".

**Format:** BVH, 120 fps, CMU skeleton (Hips root, Y-up, inches-ish scale). Retarget it to our 137-bone MPFB rig before use.

| Clip | What it is | Use in ХАНИАД |
|---|---|---|
| 22_03 / 23_03 | A sits with face in hands; B kneels and comforts | Ganaa kneeling at child height |
| 22_13 / 23_13 | A passes a soda to B; both drink | the mitten hand-over |
| 22_10 / 23_10 | Sheltering a younger child from harm | Tsetsegmaa pulls Altan |
| 22_01 / 23_01 | Pulling someone up | pulling |
| 22_12 | Stumbling into someone | the infected bump |
| 18_08 / 19_08 | Conversation, explaining with hand gestures | guests talking |
| 18_12 | Friends meet; one sits, one joins | guests sitting |
| 13_09 | Drinking a soda | a guest sipping |
| 13_14 | Laughing | a guest laughing |
| 137_26 | Normal coffee mug | a guest with a cup |
| 137_28 / 113_21 / 111_28 | Normal wait / standing still | idles |
| 137_32 / 137_33 | Old man wait / walk | older characters |
| 136_20 / 137_29 | Normal walk | walking |
| 120_22 | "Zombie" | reference only: the infected must not look like movie zombies |
| 86_15 | Walking, sitting, hand motions | sitting talkers |
| 13_04 | Sitting, chin in hand | waiting |

`cmu-mocap-index-text.txt` lists all 2,500+ clips. Add more with the same download pattern (see `docs/agents/workers/briefs/M01-mocap-retarget-b23.md`).
