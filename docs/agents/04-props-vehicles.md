# 04 — Props & vehicles agent

**Mission:** build every object a character touches or the camera notices, with all its story states. Hero props must hold up in a T0 insert shot.

**Owns:** `assets/props/` (`library.blend`, `glb/`, `textures/`, `README.md`) and `assets/vehicles/`.
**Coordinate:** 03 places the props in sets; 02 handles anything worn (except the mittens, which are a prop *and* worn, so agree the fit with 02); 06 needs grip points.

## Library conventions
- One collection per prop: `PROP.<name>` with variants `PROP.<name>.<state>`. Add a `T0` version only where an insert shot exists.
- Origin at the contact/rest point. Add `GRIP.L`/`GRIP.R` empties for hand contact and `HINGE` empties for doors.
- 1998 Mongolia and Russia: Soviet and early-1990s goods. No modern branding or plastics that didn't exist then.

## Hero props (T0 needed)

| Prop | Beats | States | Notes |
| --- | --- | --- | --- |
| **Enamel tea bowl** | 11, (title), EP08 | clean; a faint stain on the rim; rattling on the dash | The title object. Chipped enamel, worn rim. |
| **Mittens** (pair) | 06–08, 15–16, 23–26, EP02 | wrapped parcel; unwrapped; one on Altan's hand; one on the table; one on Tsetsegmaa's wrist (EP02) | Slightly too big. Knitted texture readable at T0. |
| **Irina's satchel** | 02, 07, 08, 18, EP08 | new; behind the seat; slipped down; EP08 scorched outside but the contents intact | Worn clasp **closed with wire**. Contents: 2 copied reports, 2 labeled cassettes in cloth, envelope "Наран / жижүүр эмч". |
| Dictaphone + cassettes | 01–02, EP08 | recording; stopped | A plausible pre-1998 Soviet/Japanese model. Batteries matter in EP08. |
| Photo behind the visor | 06, 11, EP08 | tucked; EP08 recovered | Ganaa + Altan. Needs a T0 print texture (02 provides the faces). |
| Kitchen door handle | 25–26, EP02 | still; turning slightly under opposing hands | Belongs to 03's door, but the T0 handle model comes from here |
| Ganaa's **left**-wrist wrap | 18–23 | fresh; soaked | Coordinate with 02's CH06 decals |

## Set-dressing props (T1/T2)
Freight yard: flashlight, guard's keys, cargo strap, steam pipe valves. **Shop:** pencil debt notebook, candles, flour, sweets, coins. **Apartment:** paper crown, homemade decorations, mismatched bowls, cake, saucepan, shoe rack, wooden stool, coat pile, birthday paper napkins, a bone (beat 22). **Café:** kettle with a cloth on its handle, buuz and steamer, a ledger in a drawer, cards, chairs and tables (the chair Ganaa swings), the enamel sign on two chains, the fuel dispenser, the mutton parcel. **Town:** radio sets, clinic loudspeaker, a water can, a rug, a bicycle, coal sacks, a landline phone, the hand-painted hospital arrow.

## Vehicles

| Vehicle | Beats | States | Needs |
| --- | --- | --- | --- |
| **KAMAZ truck** (hero) | 06–18, EP05 mention, EP08 | intact; crashed and **disabled, not burned out**; EP08 blackened outside with a fractured windshield | **Cab interior at T0**: seat with space behind it for the satchel, visor, dash, heater vent (Dasha leans on it), radio, door that a hand can catch, passenger exit. Proxy exists in `EP01_Cafe`; legacy `assets/cast/cab.json` holds the measured driver seat. |
| Livestock truck | 18–20 | moving at night | A cab for two (Ganaa as passenger), a sheep cargo area, a radio |
| Patched town bus | 03 | won't start; started | T2 |
| Coal delivery truck | 14 | unloading | T1 |
| Pushed car | 09 | stalled; started | T2 |
| Low wooden bench | EP02 00:00–00:45 | in the hall; braced against the kitchen door | Replaces the stool (v4.2 blocking). Dimensions must suit the corridor width. |
| UAZ-452 ambulance/utility van | EP02–EP10 | town; mud; EP09 commandeered | Petrol engine (fuel continuity matters), a stretcher space |
| Freight cars / boxcar | 01 | door ajar | Already a graybox in the yard; detail it |

## Tasks

| ID | Task | Acceptance | Status |
| --- | --- | --- | --- |
| P01 | Library skeleton + conventions | `assets/props/library.blend` with collections and empties, a README, and a GLB export script. A test that loads every exported GLB (reuse `tests/helpers/glb.mjs`). | open |
| P02a | **M2 birthday props**: mittens (pair, slightly too big), paper crown, cake and table setting, mismatched bowls, coat pile, shoe rack, kitchen door handle, low bench | Ready for 08's slice | open |
| P02 | **M3 look-test props**: enamel bowl T0, kettle, buuz, a café chair | Approved in the M3 frames | open |
| P03 | **KAMAZ** exterior + T0 cab, intact/disabled states | Replaces the café proxy. Measured against Ganaa's seated rig (06/02). Satchel space checked. | open |
| P04 | Remaining hero props | Mittens, satchel set, dictaphone, photo, handle, wrap | open |
| P05 | Set-dressing props per location | Delivered to 03 location by location, in the order 08 shoots them | open |
| P06 | Livestock truck, bus, coal truck, car | T1/T2 | open |
| P07 | UAZ-452 + EP02 hospital props (beds, trolleys, IV stands, the heavy door, the stool barrier) | M10 | open |

## Inbox
_(other agents add requests here)_

- **03 environments, 29 Oct — P05/P06 reuse review:** [Naran v001 catalog](../../assets/maps/naran-city/realism-v1/CATALOG.md) contains14 linked generic dressing modules (fuel, privy/shed, water cart, bicycle, farm equipment, loading/play items). These are local environment placeholders, not published `PROP.*` library assets or approved vehicle models. Review for reuse before replacing them. E03 still needs the specific patched bus, coal/livestock trucks, clinic speaker and hospital arrow from the current screenplay.
