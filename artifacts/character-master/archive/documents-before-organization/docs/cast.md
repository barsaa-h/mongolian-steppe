# ХАНИАД — Episodes 1–5 cast

The roster covers the complete cleaned dialogue master, Episodes 1–5: **48 on-screen character profiles and two voice roles**. Each named on-screen person and individual dialogue speaker has one canonical identity. Specific unnamed speakers remain separate unless the script establishes they are the same person.

Sources: [cleaned dialogue master](/home/barsaa/Downloads/KHANIAD_Dialogue_Master_Clean_Episodes_1-5.md) and [series bible v0.2](/home/barsaa/Downloads/ХАНИАД-THE-COUGH-Series-Bible-v0.2-15-89-min.md). The dialogue master controls individual scene appearances and role labels; the bible supplies full names, relationships, Anu’s age, Narantuya’s age, and Saruul’s gender where the master omits them. The setting is Mongolia and the Russian border, autumn 1998.

## Data contract

[roster.json](/home/barsaa/mongolian-steppe/assets/cast/roster.json) is the single source used by the asset builder and [cast.js](/home/barsaa/mongolian-steppe/src/cast.js). `CAST` exports the records. `getCastMember(id)` accepts a stable ASCII ID or an exact documented alias and throws for an unknown identity. Alias lookup is case-sensitive.

- `name`: Cyrillic display name; anonymous people have descriptive role labels, not invented personal names.
- `episodes`: episodes in which the actor is seen **or heard**. Oyun’s Episode 3 telephone dialogue and Lkhagva’s Episode 2 telephone dialogue reuse the existing identity. Mentioning someone does not add an appearance.
- `age`: exact stated age in years, otherwise `null`. A decade such as “30s” is preserved in `sourceNotes` without inventing an exact age. Newborns use `0`.
- `kind`: `adultMale`, `adultFemale`, `teenMale`, `teenFemale`, `child`, `infant`, or `voice`. Erdene and Jargal are 19 and 20: young adults. Altan is a toddler, not a teenager. `infant` does not imply a gender.
- `height`: standing character height in project units. The existing adult male is about 1.5; these adults range from 1.36 to 1.64. Altan is 0.76, the unnamed coughing boy 1.02, newborn swaddle profiles 0.43–0.44. These are art direction, not historical measurements.
- `build`: `[shoulderWidthMultiplier, torsoDepthMultiplier]`, relative to the builder’s base proportions. Height is controlled separately. Narantsetseg’s larger torso depth suggests late pregnancy; it is not a maternity anatomy simulation.
- `face`: `width`, `jaw`, `nose`, `eyeSpacing`, `cheekbone`, `brow`, each a dimensionless multiplier near 1. Distinct facial proportions, height, build, hair and clothing silhouettes identify characters independently of color.
- `skin`, `hair`, `colors.cloth`, `colors.trousers`, `colors.trim`: opaque six-digit RGB colors. These are authored visual choices, not source facts.
- `hairStyle`: `short`, `receding`, `bun`, `bob`, `braid`, `cap`, `bald`, or `long`. Outfit families: `jacket`, `coat`, `deel`, `medical`, `nurse`, `suit`, `tracksuit`, `school`, `uniform`, `dress`, `apron`, `swaddle`.
- `props`: staging cues. A model/exporter may support only some cues; the field does not claim every prop is modeled or animated.
- `relationships`: readable `other-id:relationship` strings. References to mentioned-only family members provide story context without creating models.
- `behavior`: a source-grounded acting cue, not a claim that an animation clip exists.
- `sourceNotes`: provenance, explicit age ranges, uncertain facts, and production interpretations.
- `infection`: `true` means bite exposure or an infected state is established during Episodes 1–5. `false` means **not established**, including unknown outcomes and people killed in attacks; it does not certify health. It is not a timeline state or a license to tint every shot red.

`voice` entries have height 0 and build `[0, 0]`. Their placeholder materials are never rendered or exported as bodies. The Minister is phone-only. `radio` is a broadcast-role bucket covering health, weather and the school radio, not a claim that one actor voices every broadcast. The governor’s own Episode 3 broadcast belongs to `lkhagva`.

## Roster

“—” means no exact age is given. An episode marked below may contain voice-only use, as documented above.

| ID | Display name / role | Episodes | Exact age | Profile | Hair / clothing | Shape (height; shoulder × depth) |
| --- | --- | --- | --- | --- | --- | --- |
| `yard-guard` | Төмөр замын харуул | 1 | — | adultMale | cap / uniform | 1.49; 1.02 × 1.06 |
| `irina` | Ирина Ковалева | 1 | 54 | adultFemale | bob / coat | 1.45; 0.88 × 0.90 |
| `ganaa` | Ганаа | 1 | 46 | adultMale | receding / jacket | 1.53; 1.16 × 1.18 |
| `dasha` | Даша | 1 | 24 | adultFemale | long / coat | 1.46; 0.85 × 0.84 |
| `hurel` | Хүрэл | 1 | — | adultMale | short / apron | 1.46; 1.18 × 1.25 |
| `tsetsegmaa` | Цэцэгмаа | 1, 2 | 30 | adultFemale | braid / dress | 1.44; 0.98 × 1.00 |
| `dulmaa` | Дулмаа | 1 | 65 | adultFemale | bun / deel | 1.36; 1.04 × 1.11 |
| `sukhee` | Сүхээ | 1 | — | adultMale | short / jacket | 1.50; 1.12 × 1.21 |
| `altan` | Алтан | 1 | 3 | child | bob / dress | 0.76; 0.82 × 0.90 |
| `oyun` | Оюун | 2, 3 | 38 | adultFemale | bun / medical | 1.46; 0.92 × 0.91 |
| `bolor` | Болор | 2 | — | adultFemale | bun / nurse | 1.48; 1.02 × 1.04 |
| `narantsetseg` | Наранцэцэг | 2 | — | adultFemale | braid / dress | 1.44; 1.00 × 1.22 |
| `dagva` | Дагва | 2 | — | adultMale | receding / jacket | 1.51; 0.98 × 0.94 |
| `tsolmon` | Цолмон эмч | 2 | — | adultMale | receding / medical | 1.52; 0.96 × 1.02 |
| `myagmar` | Мягмар | 2 | 20 | adultFemale | braid / dress | 1.41; 0.87 × 0.89 |
| `naran` | Наран | 2 | 0 | infant | bald / swaddle | 0.44; 0.88 × 0.93 |
| `myagmar-newborn` | Мягмарын нярай | 2 | 0 | infant | bald / swaddle | 0.43; 0.87 × 0.92 |
| `lkhagva` | Лхагвасүрэн «Лхагва» | 2, 3 | 58 | adultMale | receding / suit | 1.49; 1.10 × 1.18 |
| `enkhee` | Энхээ | 3 | — | adultMale | short / suit | 1.61; 1.22 × 1.10 |
| `sarantuya` | Сарантуяа | 3 | — | adultFemale | bun / suit | 1.47; 0.90 × 0.94 |
| `dashnyam` | Дашням | 3 | — | adultMale | receding / suit | 1.47; 1.17 × 1.28 |
| `chinbat` | Чинбат | 3 | — | adultMale | short / suit | 1.54; 1.18 × 1.20 |
| `lodoi` | Лодой | 3 | — | adultMale | cap / uniform | 1.50; 0.98 × 1.04 |
| `batu` | Бат | 3 | — | adultMale | short / suit | 1.64; 1.27 × 1.15 |
| `uyanga` | Уянга | 3 | 25 | adultFemale | bob / coat | 1.43; 0.88 × 1.03 |
| `banquet-waiter` | Зоогийн зөөгч | 3 | — | adultMale | short / suit | 1.50; 0.88 × 0.86 |
| `citizen-1` | Талбайн иргэн 1 | 3 | — | adultMale | cap / coat | 1.51; 1.05 × 1.04 |
| `citizen-2` | Талбайн иргэн 2 | 3 | — | adultFemale | braid / deel | 1.39; 0.99 × 1.09 |
| `citizen-3` | Талбайн иргэн 3 | 3 | — | adultMale | cap / jacket | 1.57; 0.93 × 0.91 |
| `helipad-parent` | Нисдэг тэрэгний талбайн эцэг эх | 3 | — | adultFemale | braid / coat | 1.42; 0.93 × 1.01 |
| `anu` | Анударь «Ану» | 4 | 16 | teenFemale | bob / school | 1.36; 0.83 × 0.83 |
| `nomin` | Номин | 4 | — | teenFemale | braid / school | 1.35; 0.90 × 0.85 |
| `bat-erdene` | Бат-Эрдэнэ багш | 4 | 45 | adultMale | short / tracksuit | 1.59; 1.18 × 1.03 |
| `gantsetseg` | Ганцэцэг захирал | 4 | 60 | adultFemale | bun / suit | 1.40; 0.99 × 1.03 |
| `baasaa` | Баясаа багш | 4 | — | adultFemale | braid / dress | 1.45; 0.88 × 0.90 |
| `munkh` | Мөнх | 4 | 15 | teenMale | short / jacket | 1.31; 0.77 × 0.76 |
| `temuujin` | Тэмүүжин | 4 | — | teenMale | short / school | 1.40; 0.98 × 0.90 |
| `saruul` | Саруул | 4 | 16 | teenFemale | braid / school | 1.37; 0.87 × 0.82 |
| `erdene` | Эрдэнэ | 5 | 19 | adultMale | cap / uniform | 1.48; 0.90 × 0.87 |
| `bayar` | Баяр дэслэгч | 5 | 35 | adultMale | cap / uniform | 1.55; 1.12 × 1.13 |
| `jargal` | Жаргал | 5 | 20 | adultMale | cap / uniform | 1.51; 0.95 × 0.91 |
| `cordon-mother-meat` | Хориг дээр мах санал болгосон эх | 5 | — | adultFemale | braid / deel | 1.42; 1.04 × 1.09 |
| `cordon-mother-smoke` | Ханиалгасан хүүгийн эх | 5 | — | adultFemale | braid / coat | 1.40; 0.96 × 1.02 |
| `cordon-coughing-boy` | Хориг дээрх ханиалгасан хүү | 5 | — | child | cap / coat | 1.02; 0.80 × 0.81 |
| `cordon-bitten-man` | Хориг дээр хазуулснаа нуусан хүн | 5 | — | adultMale | receding / jacket | 1.52; 0.95 × 0.95 |
| `cordon-father` | Бөгжөө өгсөн эцэг | 5 | — | adultMale | short / coat | 1.56; 1.09 × 1.08 |
| `cordon-woman` | Элсэн уутны дэргэдэх эмэгтэй | 5 | — | adultFemale | braid / coat | 1.46; 1.06 × 1.05 |
| `narantuya` | Нарантуяа | 5 | 27 | adultFemale | braid / deel | 1.49; 0.99 × 0.94 |
| `minister` | Сайд — утасны дуу | 3 | — | voice | bald / suit | voice only |
| `radio` | Радиогийн нэвтрүүлэгч | 1, 2, 4 | — | voice | bald / suit | voice only |

## Identity and coverage decisions

`lkhagva` includes ЗАСАГ ДАРГА, ЛХАГВА and the bible’s full Lkhagvasuren; `gantsetseg` includes ЗАХИРАЛ ГАНЦЭЦЭГ and ЗАХИРАЛ; `baasaa` includes БАГШ БАЯСАА and БАЯСАА. The Latin stage direction “Baasaa” and Cyrillic “Баясаа” are one teacher. Enkhee and Batu are separate bodyguards. Sarantuya, the secretary, and Narantuya, the archer, are separate people.

The three balcony citizens, helipad parent, two cordon mothers, bitten man, ring-offering father, and sandbag woman remain distinct: the master never identifies them as the same people. Their unspecified genders or exact appearances are casting choices, recorded as such. The unnamed coughing boy and Myagmar’s newborn receive child/infant profiles because their bodies drive a specific scene. The banquet waiter receives a separate staging profile. Collective **БҮГД** at the birthday is the existing party group singing, not another person.

Tsogt, Sarnai, Dorj and Bold do not appear on screen or speak in Episodes 1–5. Dr. Bayarsaikhan exists only on the helicopter list and in conversation. Dasha’s sister, the governor’s absent son and unnamed political associates are not new assets. References to them in relationships or source notes do not imply a modeled appearance. The crying baby heard at the end of Episode 1 is unidentified and **cannot be Naran**, who is born in Episode 2.

## Limits

This is character production data, not a set of scanned likenesses or a declaration that the geometry is photorealistic. Except for explicit cues such as ages, bun, tracksuit, apron, bandages and paper crown, facial proportions, garment cuts, hair and palettes are original art direction. Unspecified exact ages remain unknown.

The roster individualizes named people, speaking roles and the specific staging roles above. It does not invent identities for forty party guests, nine nursery infants, anonymous teachers and mothers, 200 pupils, 600 refugees or background infected. Crowd casting should reuse suitable adult/teen/child profiles rather than turn those counts into claimed individual actors. The father’s unnamed wife and two children and the sandbag woman’s three children belong to those background groups; their identities are not established.

Infection is restricted to this five-episode window. Anu’s Episode 12 bite and Batu’s Episode 9 bite do not make them infected in these assets. A cough alone does not establish infection: Nomin, Munkh and the cordon boy have stove-smoke coughs. Eaten/killed does not mean a person turns. Outcomes after a cut are left unresolved unless a source states them.

[cast.test.mjs](/home/barsaa/mongolian-steppe/tests/cast.test.mjs) checks canonical aliases, the named child ages, distinct unnamed speakers, mentioned-only exclusions, voice-only roles, infection evidence and usable profile dimensions/materials. Asset appearance, rigging, prop rendering, export integrity and browser presentation require their own visual and technical checks.
