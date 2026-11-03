# EP01 living-panel stills — review

Two render rounds completed (full 26-beat pass, then targeted camera/rig fixes
and re-renders). One still per panel at mid-time, 960×540, SwiftShader WebGL.
Contact sheets: `out/panels/<BEAT>/contact.jpg`; overview: `out/panels/EP01-all.jpg`.

## What was fixed in round 2

- **Lighting bug (sets/loadSet.js).** A time-gated GLB light rig (`glbLights.times`)
  was left on at raw physical intensity for the other time variant. B08's `late`
  rig was a full-frame beige washout; the gated lights are now hidden and the
  authored golden rig tuned (exposure/fill).
- **Cafe `late_afternoon` rig** bounce/fill were blowing Hürel out to a white
  silhouette; retuned and the forecourt given a fill.
- **Livestock `night` rig** cab was unlit; added a cab fill and used the windshield
  camera for the cab singles.
- **Seated cab actors.** The controller only lowers a pelvis to a seat; cab actors
  at y=0 were under the seat. B11–B13 actors now sit on the cab floor (y=1.28),
  which makes them visible.
- **Cameras**: B02 (face coverage), B03 (bus/kiosk), B05 (kitchen/doorway),
  B06 P09, B09 P03/P06, B10 table, B11–B13 cab, B15–B17 cafe/forecourt,
  B19 cab, B26 corridor, B17 forecourt moved to the driver-door side.
- **Placement**: actors nudged out of furniture/curbs on the apartment table,
  cafe, border, market, hospital queue; birthday-table actors seated at the table.
- **FX**: exterior panels carry `fog` + `breath`; steam on the freight-yard pipe;
  smoke/snow/flicker from the notes where present.

## Per-beat remaining issues (honest)

- **B01** — reads well. The burst inserts (P07/P09/P16) are mostly dark ballast
  with a small beam; the runner is a silhouette by design.
- **B02** — faces read after the rebuild; P10 is a spool insert.
- **B03** — bus singles (P02–P04) frame the bus side, not the passenger's face;
  kiosk singles (P07/P09) show the shelves and the seller is hidden by the
  counter. P12 rug-shaker is dark.
- **B04** — reads well.
- **B05** — reads after the camera pass; P09 is a young face, P11/P14 doorway.
- **B06** — P07/P08 are over-the-shoulder backs; the yard is very white.
- **B07** — **weakest coverage**: nearly every panel is behind Ganaa/Irina
  (backs). Reads as blocking, not as dialogue faces.
- **B08** — clear golden-hour after the rig fix; some panels are wide.
- **B09** — reads; P06 frames the car, not the driver's face.
- **B10** — readable birthday table, but several shots are wide/backs and the
  candles are still hot. P05/P08 are close on the back of a head.
- **B11** — reads: driver/passenger/bowl/photo inserts all visible.
- **B12** — cab reads; the burst strips are profile inserts.
- **B13** — cab reads.
- **B14** — reads; P05/P07/P09/P10 are backs while people cross the forecourt.
- **B15** — readable, but the room is wide and some singles show the other
  speaker; Hürel/Ganaa are small in frame.
- **B16** — reads; the Dasha attack panels (P12/P15/P17) are dark right-side
  coverage; P15 is a dark profile.
- **B17** — cafe half reads; the forecourt now shows Ganaa at the driver door and
  Dasha arriving. **The bite panels P17/P18 are a shoulder/back read — the left
  wrist itself is not legible.** P25 mirror is dark.
- **B18** — forecourt/fire sequence reads.
- **B19** — cab singles all use the windshield view (repeat framing, silhouette
  only); P07 sheep-throat insert was replaced by the road-wide because the
  original insert rendered as a blown white blob.
- **B20** — **the hospital sign reads mirrored from the road side** (a set/texture
  issue; needs a re-export or a sign-node rotation). Truck-side dialogue panels
  (P07/P09/P10) are dark; the queue is thin but present.
- **B21** — reads well.
- **B22** — reads; **P15_he_follows is a wall close-up**.
- **B23** — reads; many frames are the back of Altan's head at the table.
- **B24** — reads; P09_tsetsegmaa_sees is a dark doorway.
- **B25** — reads after moving the cameras into the kitchen; P09_no_lock is a
  blurry macro of the latch plate rather than a clean insert.
- **B26** — reads: Tsetsegmaa and Altan are visible, the one mitten is up, the
  latch insert and the cut to black are present.

## Not changed / known limits

- No motion: these are held panels. The `stills_B01-B03.mp4` uses one still per
  panel as a held frame, with the sound kit, English subtitle burn-in and the
  title card.
- Faces are the low-poly Vinrax-based cast and will be replaced; no face polish
  was attempted. The panel data references role ids.
- B07's back-heavy coverage and B20's mirrored sign are the two largest known
  visual defects left.
