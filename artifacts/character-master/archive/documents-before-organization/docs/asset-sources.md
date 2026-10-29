# Character source assets

Acquired from the authors' official download links on 2026-10-24. Original archives and model files are preserved unchanged under `assets/sources/`; the existing male archive remains under `assets/male_casual/`. These are editable source/reference assets, not additional runtime characters.

| Source | Local files | Permission | Status |
| --- | --- | --- | --- |
| [Vinrax PSX Female Secretary](https://vinrax.itch.io/psx-secretary-character) | `assets/sources/vinrax-female/female_secretary.fbx`, `secretary_tex.png`, original `female_secretary.zip` | Use in projects with **Vinrax credit required** | Acquired; adopted female source matching the existing Vinrax male style |
| [VadaCross PSX Rigged Character](https://vadacross.itch.io/psx-rigged-character) | `assets/sources/vadacross-psx-character/PSX Characters Blender File.blend`, `PSX Character.fbx`, `BaseSkin.png` | Free personal/commercial use; attribution optional | Acquired; native Blender source and finger rig reference |
| [pistachio Human Basemeshes](https://opengameart.org/content/human-basemeshes) | `assets/sources/opengameart-human-basemeshes/Human Basemeshes.blend`, original `Human Basemeshes.zip` | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Acquired; male and female native Blender basemeshes |
| [Quaternius Ultimate Modular Women Pack](https://quaternius.com/packs/ultimatemodularwomen.html) | Source links in `assets/sources/quaternius-modular-women/download-index.json`; **no model downloaded** | Official page states [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Google Drive download quota exceeded |
| [Vinrax PSX Casual Male](https://vinrax.itch.io/psx-casual-male-character) | Existing `assets/male_casual/male_casual.fbx`, `man_tex.png`, `male_casual.zip` | Use in projects with **Vinrax credit required** | Pre-existing asset; archive contents inspected without changes |

## Credits to retain

**PSX Casual Male Character and PSX Female Secretary Character by Vinrax.**

Optional acknowledgements: **PSX Rigged Character by VadaCross; Human Basemeshes by pistachio.** Quaternius should only be listed as an asset contributor after adopting downloaded files from that pack.

Each acquired source folder includes `SOURCE-LICENSE.txt` with the official URL and permission summary. The original Vinrax and OpenGameArt archives contain no separate bundled license, so the author's published source-page terms are recorded alongside them. No payment or login was needed for acquired files.

## File inspection

All acquired FBX and Blender files were opened/imported with Blender 5.2.2 LTS in a separate background process, with embedded scripts disabled. ZIP entries were checked for absolute paths and parent traversal before extraction. Source files were not resaved.

- **Vinrax female:** `character_secretary`, 932 triangles, 488 imported vertices, 28-bone `Armature`, no animation actions. The published vertex count is 476; Blender's FBX import splits some vertices. Texture is supplied separately as `secretary_tex.png`.
- **VadaCross:** `BaseManArms` body and `BaseManHead`, 399 native base vertices / 755 base triangles, 64-bone `BaseManBodyRig`. Mirrored exported geometry has 1,510 triangles. The rig includes three bones per finger and two per thumb, 28 finger bones total. The native file contains sample arm/T-pose actions, while the official page explicitly says no animations included; these actions are not treated as a production animation pack.
- **Human Basemeshes:** female 581 vertices / 1,158 triangles; male 578 vertices / 1,152 triangles; separate 59-bone rigs. Subdivision modifiers are present. The author describes these as sculpting/topology starting points rather than fully animation-optimized meshes. Blender 5.2.2 reports an invalid legacy shape key and removes it in memory while opening; the downloaded original remains intact.

SHA-256 hashes and byte sizes of every downloaded model, texture and archive are in `assets/sources/file-manifest.json`.

## Quaternius blocker

The official page links to [this public Google Drive folder](https://drive.google.com/drive/folders/1720N9IGyQHXYvtvZJzazhxtTTlz-y2Vf). Folder listings were accessible and exposed native `.blend` sources for all 10 characters, an all-together scene, humanoid rig alternatives, and `Animations.fbx`. Actual downloads returned an HTTP 200 HTML error titled **Google Drive - Quota exceeded**. Its message says too many users recently viewed/downloaded the file and access can take up to 24 hours to recover.

Confirmed on the all-together source, humanoid all-together source, regular Adventurer/Casual sources, humanoid Adventurer source, animation FBX, bundled license, and usage instructions. Both standard official download endpoint domains returned the same error. No HTML error was saved with a model filename. The download index retains the official file URLs for a later retry; `DOWNLOAD-BLOCKED.txt` records the full error. No quota bypass or third-party substitute was used. The advertised 24 animations could not be inspected.
