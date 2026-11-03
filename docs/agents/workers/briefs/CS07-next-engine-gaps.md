# Queued for CS07 after round 7 (from the L4D-in-panel-player test, 2026-11-03)
Evidence: ~/ms-workers/E08/episodes/EP01/threejs/out/l4d-cast/ (audit.json, sheet_*.jpg); adapter src/stylized/l4dCast.js works around these at load — fix at the source so the adapter becomes a no-op:
1. Skinned meshes are 4.5–7.4 % smaller than the skeleton (eye bone 5–11 cm above eyeballs, finger bones 5–10 cm off fingers). Export mesh and rig at the same scale.
2. Finger bone local axes: +X must curl toward the palm (hands.js contract).
3. Jaw weights reach the nose (Ganaa up to y 1.49 vs lip line 1.46): limit jaw weights to below the lip seam.
4. Morph amplitudes 2–9 mm (blink 3 mm): bake full-strength blink/speak/expressions; blink must fully cover the eyeball (eyes stand proud of the lids, worst on Dasha).
5. No visemes: add at least mouth_close (M/B/P), round/pucker (O/U), wide (E/I) shape keys.
6. Teeth read as fangs when the mouth opens: fix teeth mesh/texture.
7. Ganaa needs a LEFT-wrist bite wound + bandage variant (old cast had it; B17/B21 need it).
8. Clips: only idle/walk ship; add cough and the clips panels use (wave) or document world-space retarget.
