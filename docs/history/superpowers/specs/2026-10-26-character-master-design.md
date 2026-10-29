# Agent-editable character master

> Historical implementation plan/specification. Current source authority, chosen design, Episode 1 status and remaining work are in [Character Master](../../../../artifacts/character-master/README.md). Its [jobs](../../../../artifacts/character-master/production/JOBS.md) now prioritize the café test; completed boxes here describe the original implementation scope, not finished-shot approval.

The user wants the painted early-PS2 character quality of the LISA study, with
a clean neck, real hands and separate clothing, and a reusable default that an
agent can turn into fat, thin, tall, male, female and child characters. The user
explicitly clarified that no customization UI is needed: the agent is the operator.

## Approach

Use MakeHuman/MPFB's CC0 core mesh, body targets, rig and fitted assets. Keep the
LISA derivative as a visual reference. The inspected LISA study has one connected
mesh, no morphs, a dressed surface rather than a complete body, and only 21 joints.
Splitting its material regions cannot reconstruct the missing body or provide a
good universal template. The existing pistachio CC0 bodies have fingers and rigs
but featureless heads, so they would require substantial new facial modeling.

This is an implementation choice by the assistant: reuse an established sculpted
body library and its fitting tools, with a thin, documented agent-facing build
script. Keep third-party tooling and asset licenses separate from exported game
assets. No server, account, subscription or runtime UI.

## Contract

- JSON describes identity, age, build, height, appearance, assets and optional
  additional modeling targets. Validate values and file names before building.
- Generate an editable packed `.blend`, a skinned `.glb`, preview and report.
- Preserve the complete body in the authoring file. Neck skin joins the torso;
  clothes, shoes, hair, eyes and other accessories remain separate mesh objects.
- Use proper skin textures and existing anatomical face/hand topology. No
  stretching a painted dress into an unclothed body. No generated texture changes
  are needed to establish the reusable base.
- Refit the rig and garments after body changes. Child presets use the library's
  sculpted age targets and modest default clothes, not uniform adult scaling.
- Demonstrate default, male, heavy, slim/tall and child configurations. Include
  a small pose check with bent elbows/knees and finger motion.
- Match the established painted rendering direction using diffuse textures,
  restrained specularity and neutral inspection light. Do not promise pixel-exact
  SH2 art or arbitrary clothes fitting every possible extreme without adjustment.
- Keep the original LISA files, existing cast and town unchanged.

## Verification

Test invalid configurations, named targets/assets, complete body retention,
separate garment objects, finger bones, normalized weights, packed textures,
skinned GLB load, and finite deformation in a real browser. Render and inspect
the default face/neck, hands, clothing boundaries and representative proportions.
Document actual limits and the agent regeneration workflow.
