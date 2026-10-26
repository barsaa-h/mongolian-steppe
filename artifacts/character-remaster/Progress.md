# Character remaster production ledger

Source: Production_Brief.md. Protected baseline: Backup/Original_Field_Guy.blend (read-only).

- Phase 0 audit: source character has 13 meshes, 11,743 triangles; face contains 29 disconnected components. No assigned armature, no shape keys, no actions. The unrelated basemesh armature is not a character rig.
- Ruling: locally rebuild the facial skin, eyes, mouth and hands before adding keys, preserving identity, clothing and old scenes. Existing disconnected face cannot provide a functioning mouth cavity or continuous deformations.
- Ruling: Blender .blend is authoritative. Exchange export must retain bones/morphs; Blender drivers and IK controls will be documented as Blender-specific, with baked demonstrations.
- Phase 0 capture: pending.
- Phase 1 body: pending.
- Phase 2 facial reconstruction: in progress.
- Phase 3 facial controls and performances: pending.
- Phase 4 hair: pending.
- Phase 5 materials: separate offline preparation in progress.
- Phase 6 clothing: retain and improve after face.
- Phase 7 body rig and expressive hands: separate script preparation in progress, no live scene writes.
- Phase 8 optional damage/zombie/cut variants: pending.
- Phases 9–12 evidence, animation tests, export validation: pending.
