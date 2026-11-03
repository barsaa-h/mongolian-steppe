# EP01 character voice sheets

One actor plays every role. The point of these sheets is not to invent 28
cartoon voices; it is to make each character **recognisable from the first
syllable**, keep them in the same body, and stop the small parts from sounding
like Ganaa.

Ages come from `artifacts/character-master/production/EP01-v4-CAST.md`. Script
facts are marked; everything about pitch and temperament is an artistic choice
for this production.

## How to use this

1. Read the character's **reference line** out loud before the first take of
   the session. That is the voice; do not "warm up into" something else.
2. Keep the placement in the body, not in the throat. A voice made by squeezing
   the throat will not survive 197 lines.
3. Change **pace, energy and mouth shape** before you change pitch. Pitch is
   the last resort, especially for women playing men.
4. Find the voice once per session, not once per line.
5. Swearing stays real. Do not soften profanity into a joke or a hiss.

## Principals

### Ganaa — 46, KAMAZ driver

- **Script facts:** generous, evasive; deep wrist bite on the **left** wrist;
  fever; the kitchen door.
- **Temperament:** tired, dry, used to being liked. He jokes to avoid a
  question. Under pressure he goes quiet, then sharp.
- **Placement:** low chest voice, relaxed jaw, a little gravel from cold and
  cigarettes. Unhurried. Mongolian is his home voice; Russian is correct but
  carries a Mongolian accent — that is the character, not a mistake.
- **Reference line:** «Сайн уу гэдэггүй юм уу, пизда чинь.» Then «Томуу гэнэ ээ? Хүрэлийг тэр чинь хазаад... идчихсэн шүү дээ. Ямар алных нь томуу вэ...» (protected; say it exactly).
- **Avoid:** movie-tough-guy growl; a fake Russian accent; making every line a
  punchline. His Russian should sound like a man who has used it for work for
  twenty years, not like a language exercise.
- **Intensity:** most of Ganaa is low. The shouts are in the final session and
  should sound like they cost him, not like a trained scream.

### Tsetsegmaa — 30, his wife

- **Script facts:** tired familiarity; protects Altan; practical.
- **Temperament:** organised, warm when calm, contained anger when not. She is
  the person who notices the hand first.
- **Placement:** mid-chest mezzo, forward in the mask, clear consonants. Faster
  than Ganaa in domestic scenes; she is carrying the day.
- **Reference line:** «Ганаа! Хааччихсан юм бэ? Алтан чинь өдөржин хаалга
  харлаа.»
- **Avoid:** whining; a "nagging wife" caricature; letting the anger become a
  scream before B25. The fear is in the control, not the volume.

### Altan — 3

- **Script facts:** paper crown, mittens, waits at the door, hums his song.
- **Temperament:** literal, patient in the way small children are patient,
  easily disappointed, not performing.
- **Placement:** light head voice, small mouth, short phrases. He does not
  project; he talks to one adult at a time. Record **softly and close**.
- **Reference line:** «Аав ирлээ!» and «Нөгөө дуугаа.»
- **Avoid:** "cute" sing-song; baby talk; adult-clear consonants; a fake
  cartoon child. Altan should sound like a real three-year-old who is a bit
  tired and very sure about the song.

**Pitch shifting Altan.** Do not pitch-shift by default. First try a soft,
close, relaxed read with a smaller mouth. If the result still reads as an adult
woman doing a child, you may lift it **slightly**:

```sh
# preserves duration, lifts pitch 6 %
ffmpeg -i audio/vo/EP01-VO-035.wav \
  -af "rubberband=pitch=1.06" \
  -ar 48000 -ac 1 -c:a pcm_s24le audio/vo/EP01-VO-035_pitch.wav
```

If your ffmpeg lacks `rubberband`:

```sh
ffmpeg -i audio/vo/EP01-VO-035.wav \
  -af "asetrate=48000*1.06,aresample=48000,atempo=1/1.06" \
  -ar 48000 -ac 1 -c:a pcm_s24le audio/vo/EP01-VO-035_pitch.wav
```

Run it on the finished take, never while recording. Keep the unshifted file.
Do **not** pitch the quiet ending in B23–B26, do not pitch any shout, do not go
above **1.08**, and do not use a different ratio per line. If the shift sounds
like a chipmunk or adds a metallic edge, throw it away and use the natural read.
Never pitch a line that will be lip-synced unless you re-run the checker and
lipsync on the shifted file.

### Dulmaa — 65, Tsetsegmaa's mother

- **Script facts:** practical; coats, cooking, bandage; family resemblance to
  Tsetsegmaa intended.
- **Temperament:** the person who keeps the room moving. Not sentimental. She
  has seen worse and says so with a cloth in her hand.
- **Placement:** lower than Tsetsegmaa, slower, consonants a little softer at
  the edges. More air, less projection. Same vowel colour as Tsetsegmaa so they
  read as mother and daughter.
- **Reference line:** «Наад боолтоо тайл даа. Цус нь шүүрээд байна.»
- **Avoid:** frail-old-lady quaver; a "wise grandmother" voice; slowing every
  word. She is old, not weak.

### Irina — 54, Russian epidemiologist

- **Script facts:** cassette, timestamps, envelope «Наран / жижүүр эмч»,
  satchel.
- **Temperament:** controlled, precise, already frightened and refusing to show
  it. She is used to being the most competent person in the room.
- **Placement:** dry contralto, clipped phrases, very little melody. Native
  Russian; do not "act Russian". The authority is in the pauses.
- **Reference line:** «Мне нужен ответственный. Сейчас.»
- **Avoid:** sinister villain; whispering for mystery; a fake foreign accent.
  She is a doctor, not a spy.

### Dasha — 24, Russian

- **Script facts:** "сестра, Наран"; damaged arm; "собака"; heat-seeking; bites
  Hürel and Ganaa.
- **Temperament:** hurt, cold, running on adrenaline. Short answers. The
  politeness is residual, not warm.
- **Placement:** light young voice, breathy, phrases clipped by pain. Native
  Russian. She does not project; she conserves energy.
- **Reference line:** «В Наран. К сестре.»
- **Avoid:** fragile waif; little-girl voice; sexy purr. She is injured and
  dangerous, not decorative.

### Hürel — 50s, café cook

- **Script facts:** unpaid-buuz joke; «Битгий шаа»; extra food for the road;
  killed.
- **Temperament:** warm, blunt, feeds people instead of asking questions. He
  enjoys the argument more than he admits.
- **Placement:** relaxed baritone, smile audible, Mongolian consonants full.
  Slightly higher and lighter than Ganaa so they do not blur.
- **Reference line:** «Ийм байж чи яаж амьд яваад байдаг байна аа.»
- **Avoid:** jolly Santa laugh; a saintly victim. He is a cook with a debt
  notebook and a sharp tongue.

### Sükhee — 50s, drunk relative/neighbour

- **Script facts:** teases Ganaa; opens the kitchen door handle.
- **Temperament:** loud, affectionate, tactless. Drink makes him slower and
  more honest, not incoherent.
- **Placement:** looser tenor, a little behind the beat, larger dynamics than
  the room. Slur only the edges; keep every word intelligible.
- **Reference line:** «Өө, манай хүн! Чамайг ирэхгүй нь гээд тортыг нь
  идчихдэг юм билүү гээд сууж байлаа.»
- **Avoid:** cartoon drunk; belching and giggles; losing the consonants. The
  joke has to land before the horror does.

## Supporting and one-off roles

These are short. Give each a **single** clear adjustment from your own voice,
write it down, and reuse it if the role returns.

### Nyamka — shopkeeper (50s)

- Brisk, flat, transactional; a woman who has heard every excuse.
- **Placement:** mid female voice, faster than Dulmaa, little warmth.
- **Reference:** «Өмнөхтэйгөө нийлээд нэлээд болчихож байгаа шүү.»
- **Avoid:** hag voice; sing-song shopkeeper.

### Bataa — regular, ex-heating-plant worker (50s)

- Competent, dry, not a caricature.
- **Placement:** mid baritone, even pace, practical.
- **Reference:** «Ингэж байж л чамайг ажилд авч үзье.»
- **Avoid:** simpleton; country bumpkin.

### Togoo — odd-job man (30s–40s)

- Defensive, a bit whiny, always about to be accused of something.
- **Placement:** lighter than Bataa, slightly nasal, quicker.
- **Reference:** «Мөнгөө өгдөг бол очно оо.»
- **Avoid:** full comic squeak; making him stupid.

### Tungalag — young mother (20s)

- Warm, tired, careful not to wake the baby. The cousin with the infant.
- **Placement:** light-mid female voice, soft edges, slower than Tsetsegmaa.
- **Reference:** «Энэ бага нь дөнгөж унтлаа. Өрөөнд хэвтүүлчихье. Та нар
  жаахан нам байгаарай.»
- **Avoid:** little-girl voice; a second Tsetsegmaa.

### Dispatcher — duty desk (40s)

- One line, Russian, on the phone: «У́тром перезвони́те.» Tired, bureaucratic,
  already somewhere else.
- **Placement:** flat mid voice, a little further from the mic than Irina; no
  colour, no character. If you use your Irina placement, drop the precision and
  the energy so the two do not sound like the same woman.
- **Reference:** «У́тром перезвони́те.»
- **Avoid:** making the dispatcher sinister or comic; she/he is a functionary
  closing a shift.

### Yard guard (50s) — Russian

- Irritable, mundane, cold. He does not want a problem at the end of his shift.
- **Placement:** low male voice, Russian, flat, slightly hoarse. No drama until
  the body.
- **Reference:** «Слышь, здесь ночевать нельзя.»
- **Avoid:** monster; horror-movie whisper.

### Pasha — yard loader (30s–40s) — Russian

- Big, friendly, practical; the man who tells Ganaa the strap will not survive.
- **Placement:** open chest baritone, Russian, conversational shout over a
  yard. Warmer and higher than the yard guard.
- **Reference:** «Гана, этот ремень до границы не доживёт.»
- **Avoid:** generic "Russian bear"; barking every line.

### Border officer (40s) — Russian

- Tired official at the end of a shift, fumbling for a stamp.
- **Placement:** mid male voice, flat official Russian, no colour.
- **Reference:** «Накладная где?»
- **Avoid:** KGB interrogator; making the border political.

### Bus driver (50s)

- Loud over an engine, clipped, impatient. Two lines, both practical.
- **Placement:** raised chest voice, short phrases, no melody.
- **Reference:** «Түлхээд өгөөч, нэг хоёрхон хүн! Асаад ирвэл бүгд сууна!»
- **Avoid:** radio-announcer projection; a comedy bus driver.

### Passenger (40s)

- Grumbling, cold, every-morning tired. One line.
- **Placement:** mid voice, downward inflection, no punchline.
- **Reference:** «Өглөө болгон л түлхүүлэх юм. Өнөөдөр ер нь явах нь уу?»
- **Avoid:** comic moan.

### Boy at the shop (8–10)

- Impatient, polite because he has been told to be, not shy.
- **Placement:** light child voice, forward, short. Do not use the Altan
  placement; this boy is older and louder.
- **Reference:** «Эгч ээ, талх байна уу?»
- **Avoid:** adult falsetto; baby talk.

### Seller (50s)

- Flat, tired, transactional. She has kept the bread; that is the whole line.
- **Placement:** low-mid female voice, slow, little inflection.
- **Reference:** «Нэг байна. Мөнгө чинь хаана?»
- **Avoid:** witch; martyr.

### Neighbour (40s)

- Warm, nosy, means well. Talks to Altan, not to the room.
- **Placement:** mid female voice, soft, slightly higher than Dulmaa.
- **Reference:** «Ирнэ ээ, ирнэ. Аав чинь ирэхгүй хаачихав гэж.»
- **Avoid:** gossip caricature; prying menace.

### Neighbour woman (40s)

- Tired, complaining about coal dust and a sore throat. One line.
- **Placement:** lower and slower than the other neighbour; a different woman.
- **Reference:** «Нөгөө нүүрс нь тоос л байна. Өчигдрөөс хойш хоолой
  хорсоод.»
- **Avoid:** reusing the warm neighbour exactly; this one is drier.

### Driver pushing the truck (30s–40s)

- One line of effort: «За, нэг удаа! Нэг, хоёр...!»
- **Placement:** chest voice, breath behind it, not a scream.
- **Avoid:** grunting instead of words.

### Coal delivery driver (40s)

- Blunt, busy, no patience for Togoo's cigarette.
- **Placement:** mid male voice, flat, slightly louder than indoors.
- **Reference:** «Ажил дуусгаад асуу. Эхлээд наадахыг өргөлц.»
- **Avoid:** aggression; he is just working.

### Livestock truck driver (40s–50s)

- Practical, decent, increasingly alarmed. Offers the ride and the clinic.
- **Placement:** open mid-baritone, outdoor projection, Mongolian. Calm lines
  in session 9; the B18 shouts in session 10.
- **Reference:** «Наашаа, гараа харуул. Чамайг эмнэлэгт хүргээд өгье.»
- **Avoid:** saintly Good Samaritan; panic in every line. The panic arrives
  when he sees the arm.

### Café driver (40s) — B17

- One alarmed line from the next table: «Хөөе! Юу болоод байна аа?!»
- **Placement:** mid male voice, startled, not a scream.
- **Avoid:** sounding like the livestock driver or the bus driver. Make him
  younger and drier.

### Radio announcer (40s)

- Official, flat, institutional Mongolian. The emergency bulletin.
- **Placement:** neutral mid voice, even pace, no character, no drama.
- **Reference:** «Иргэд та бүхэн ханиад, томуу төст өвчний шинж тэмдэг
  илэрвэл эмнэлгийн байгууллагад хандана уу...»
- **Avoid:** movie-trailer gravity; a smile. This is a tired public-service
  read, and that is what makes it frightening.

### Duty nurse (30s–40s)

- Tired, practical, already looking at the next patient.
- **Placement:** mid female voice, faster than Dulmaa, clinical.
- **Reference:** «Гар чинь яачихсан юм? Хэзээ гэмтсэн?»
- **Avoid:** flirt; angel-of-mercy softness.

## Quick casting matrix

| Voice family | Roles | Main separation |
| --- | --- | --- |
| Low male, warm | Ganaa, Hürel | Ganaa drier and more evasive; Hürel smiles |
| Low male, official | Yard guard, border officer | Guard is cold and bored; officer is tired and bureaucratic |
| Mid male, practical | Bataa, livestock driver, coal driver | Bataa dry; livestock driver louder and more humane; coal driver blunt |
| Light male | Togoo, café driver | Togoo defensive; café driver startled |
| Drunk male | Sükhee | Looser and louder, not incoherent |
| Female, mid | Tsetsegmaa, Nyamka, seller | Tsetsegmaa warm; Nyamka flat; seller slow |
| Female, low | Dulmaa, neighbour woman | Dulmaa grounded; neighbour woman drier |
| Female, light | Dasha, Tungalag, nurse | Dasha breathy and clipped; Tungalag warm; nurse clinical |
| Female, dry authority | Irina, dispatcher | Irina native and precise; dispatcher flat and distant |
| Child | Altan, boy | Altan 3, soft; boy 8–10, forward |
| Broadcast | Radio | Neutral, institutional |
