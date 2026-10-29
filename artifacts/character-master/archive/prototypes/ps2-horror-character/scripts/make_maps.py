"""Deterministic painted diffuse maps for the early-PS2 character; no Blender edits.

The maps currently packed in the blend were repainted in Blender (stronger sockets,
dirtier cloth, pale fog palette). Running this file overwrites Textures/*.png
with the quieter versions below. Copy Textures/pre_sh2_2001 aside first.
"""
from pathlib import Path
import json

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


OUT = Path(__file__).resolve().parents[1] / "Textures"
OUT.mkdir(parents=True, exist_ok=True)
MAPS = {}
SIZE = 512


def grid():
    u, row = np.meshgrid((np.arange(SIZE) + .5) / SIZE,
                         (np.arange(SIZE) + .5) / SIZE)
    return u, 1 - row


def soft(u, v, x, y, sx, sy):
    return np.exp(-.5 * (((u - x) / sx) ** 2 + ((v - y) / sy) ** 2))


def save(name, pixels, description, uv="tile"):
    pixels = np.uint8(np.clip(np.rint(pixels), 0, 255))
    image = Image.fromarray(pixels)
    image.save(OUT / name)
    MAPS[name] = dict(size=list(image.size), mode=image.mode,
                     color_space="sRGB", uv=uv, description=description)


def head():
    u, v = grid()
    rgb = np.full((SIZE, SIZE, 3), (183, 154, 135), dtype=float)

    def tint(mask, color):
        rgb[:] += mask[..., None] * color

    def pair(x, z, sx, sz):
        return soft(u, v, .5 - x / .2, (z - 1.53) / .28, sx / .2, sz / .28) + soft(
            u, v, .5 + x / .2, (z - 1.53) / .28, sx / .2, sz / .28)

    # Broad painted form transitions; deliberately no pores or photographic skin detail.
    tint(soft(u, v, .5, .78, .24, .15), (3, 2, 0))
    tint(pair(.063, 1.693, .016, .028), (-7, -7, -6))
    tint(pair(.034, 1.691, .018, .010), (-6, -6, -5))
    tint(pair(.035, 1.672, .016, .0075), (-8, -10, -8))
    tint(pair(.034, 1.677, .017, .0035), (-3, -3, -2))
    tint(pair(.049, 1.651, .017, .015), (1.5, -2.3, -2))
    tint(pair(.054, 1.630, .015, .011), (-7, -6, -4))
    tint(pair(.073, 1.664, .010, .025), (2, -1, -1))
    # Bridge side planes and nostril wings support the protruding polygon nose.
    tint(pair(.010, 1.659, .0048, .019), (-5, -5, -4))
    tint(soft(u, v, .5, (1.665 - 1.53) / .28, .026, .061), (4, 3, 1))
    tint(soft(u, v, .5, (1.649 - 1.53) / .28, .050, .029), (1.5, -1.5, -1.5))
    tint(pair(.010, 1.639, .0045, .003), (-10, -9, -7))
    tint(soft(u, v, .5, (1.635 - 1.53) / .28, .035, .010), (-4, -4, -3))
    # Lip tone surrounds the geometry; no static black opening is painted onto skin.
    tint(soft(u, v, .5, (1.619 - 1.53) / .28, .108, .015), (-6, -8, -6))
    tint(soft(u, v, .5, (1.610 - 1.53) / .28, .098, .013), (1, -3, -2))
    tint(pair(.024, 1.6145, .004, .005), (-6, -6, -4))
    tint(soft(u, v, .5, (1.598 - 1.53) / .28, .12, .016), (-3, -3, -2))
    tint(soft(u, v, .5, (1.582 - 1.53) / .28, .16, .022), (2, 1, 0))
    tint(soft(u, v, .5, (1.561 - 1.53) / .28, .30, .035), (-7, -6, -3))
    tint(pair(.060, 1.584, .016, .022), (-6, -5, -3))
    save("Head_Diffuse.png", rgb,
         "Warm-neutral #B79A87 with painted socket, nasal-side/nostril-wing, cheek, "
         "lip-surround and jaw shading. No painted eyeballs or mouth cavity.", "head_front")

    zombie = .62 * rgb + .38 * np.array((151, 153, 139))
    zombie += pair(.035, 1.672, .018, .009)[..., None] * (-4, -3, 1)
    save("Zombie_Head_Diffuse.png", zombie,
         "Optional subdued sallow skin; clean master diffuse remains intact.", "head_front")
    bruise = .37 * soft(u, v, .26, .49, .065, .060) + .22 * soft(u, v, .70, .36, .042, .075)
    dirt = .31 * soft(u, v, .19, .21, .065, .055) + .23 * soft(u, v, .79, .31, .037, .065)
    # One controlled mouth-corner mark and short run; optional, never baked into clean skin.
    blood = .55 * soft(u, v, .626, .295, .014, .016)
    blood += .43 * soft(u, v, .638, .252, .008, .033)
    blood += .28 * soft(u, v, .631, .207, .006, .017)
    for name, mask, color, text in [
        ("BruiseDecalRGBA.png", bruise, (95, 75, 89), "Soft asymmetric bruise"),
        ("DirtDecalRGBA.png", dirt, (87, 80, 64), "Restrained cheek/jaw dirt"),
        ("BloodDecalRGBA.png", np.minimum(blood, .75), (93, 33, 29), "Painted dried blood at one mouth corner")]:
        rgba = np.zeros((SIZE, SIZE, 4), dtype=float)
        rgba[..., :3] = color
        rgba[..., 3] = mask * 255
        save(name, rgba, text + "; optional alpha-over layer.", "head_front")


def fabric(name, base, folds, seams):
    u, v = grid()
    rgb = np.full((SIZE, SIZE, 3), base, dtype=float)
    # Broad hand-painted cloth variation, not random blocks or micro-weave.
    broad = .65 * np.sin(2 * np.pi * (2 * u + v)) + .35 * np.cos(2 * np.pi * (u - 3 * v))
    rgb += broad[..., None]
    for cx, cy, length, bend, depth in folds:
        dx = (u - cx + .5) % 1 - .5
        curve = cy + bend * np.sin(dx * np.pi / length)
        dy = (v - curve + .5) % 1 - .5
        fade = np.exp(-(dx / length) ** 6)
        shadow = np.exp(-.5 * (dy / .011) ** 2)
        ridge = np.exp(-.5 * ((dy - .016) / .015) ** 2)
        rgb += (fade * (-depth * shadow + depth * .40 * ridge))[..., None]
    for x in seams:
        dx = (u - x + .5) % 1 - .5
        shadow = -2 * np.exp(-.5 * (dx / .0035) ** 2)
        edge = 1.0 * np.exp(-.5 * ((dx - .006) / .004) ** 2)
        rgb += (shadow + edge)[..., None]
    save(name, rgb, "Painted cloth: broad quiet variation, curved fold shading, subdued narrow panel lines. "
         "No random noise, checker patches or photographic weave.")


def fleece():
    image = Image.new("RGB", (SIZE, SIZE), (213, 209, 194))
    draw = ImageDraw.Draw(image)
    rng = np.random.default_rng(28)
    for y in range(-6, SIZE + 7, 6):
        for x in range(-6, SIZE + 7, 6):
            px, py = x + rng.uniform(-2, 2), y + rng.uniform(-2, 2)
            radius = rng.uniform(1.3, 3.0)
            angle = int(rng.integers(0, 360))
            for ox in (-SIZE, 0, SIZE):
                for oy in (-SIZE, 0, SIZE):
                    box = (px + ox - radius, py + oy - radius, px + ox + radius, py + oy + radius)
                    draw.arc(box, angle, angle + 235, fill=(202, 198, 183), width=1)
                    draw.arc((box[0], box[1] - 1, box[2], box[3] - 1),
                             angle + 50, angle + 170, fill=(224, 220, 207), width=1)
    save("Fleece_Diffuse.png", np.array(image.filter(ImageFilter.GaussianBlur(.28))),
         "Painted cream fleece with fine crescent curls 3-6 pixels across; no shaded popcorn lumps.")


def hair():
    u, v = grid()
    flow = u + .043 * np.sin(2 * np.pi * v) + .012 * np.sin(4 * np.pi * v)
    rgb = np.full((SIZE, SIZE, 3), (26, 23, 21), dtype=float)
    clump = np.cos(2 * np.pi * (11 * flow + .12 * np.sin(2 * np.pi * v)))
    secondary = .45 * np.sin(2 * np.pi * 43 * flow)
    highlights = np.maximum(clump, 0) ** 4 * (2.5 + np.sin(np.pi * v) ** 2)
    rgb += (1.5 * clump + secondary + highlights)[..., None]
    rgb += np.sin(2 * np.pi * (5 * flow + v))[..., None] * (1, .3, -.5)
    save("Hair_Diffuse.png", rgb,
         "Dark brown-black with grouped curved directional streaks and quiet warm/cool variation; "
         "no simulated individual hairs.", "hair_clump")


def boots():
    u, v = grid()
    rgb = np.full((SIZE, SIZE, 3), (76, 54, 40), dtype=float)
    rgb += (.6 * np.sin(2 * np.pi * (u + 2 * v)))[..., None]
    for center, length in ((.30, .27), (.37, .20), (.68, .21)):
        dx = (u - .5 + .5) % 1 - .5
        curve = center + .05 * np.cos(dx * 7)
        dy = (v - curve + .5) % 1 - .5
        mask = np.exp(-(dx / length) ** 6)
        shadow = -4 * np.exp(-.5 * (dy / .009) ** 2)
        edge = 2 * np.exp(-.5 * ((dy - .014) / .011) ** 2)
        rgb += (mask * (shadow + edge))[..., None]
    save("Boots_Diffuse.png", rgb, "Subdued brown leather with a few painted flex folds; no PBR grain or baked laces.")


def verify_and_preview():
    for name, metadata in MAPS.items():
        with Image.open(OUT / name) as image:
            assert image.size == (SIZE, SIZE), name
            assert image.mode == metadata["mode"], name
            pixels = np.array(image)
            assert pixels.max() > pixels.min(), name
    skin = np.array(Image.open(OUT / "Head_Diffuse.png"))
    assert np.all(np.abs(np.median(skin, axis=(0, 1)) - (183, 154, 135)) < 8)
    assert skin[..., 0].max() - skin[..., 0].min() < 40
    assert not any("Roughness" in name or "Normal" in name for name in MAPS)
    sheet = Image.new("RGB", (1000, 800), (32, 34, 35))
    draw = ImageDraw.Draw(sheet)
    for i, name in enumerate(MAPS):
        x, y = (i % 4) * 250, (i // 4) * 265
        image = Image.open(OUT / name).convert("RGBA").resize((230, 230))
        if "RGBA" in name:
            image = Image.alpha_composite(Image.new("RGBA", image.size, (183, 154, 135, 255)), image)
        sheet.paste(image.convert("RGB"), (x + 10, y + 8))
        draw.text((x + 10, y + 242), name, fill=(229, 230, 223))
    sheet.save(OUT / "Texture_Contact_Sheet.jpg", quality=94)


if __name__ == "__main__":
    head()
    fabric("Jacket_Diffuse.png", (66, 77, 57),
           ((.30, .25, .20, .022, 5.0), (.72, .64, .17, -.030, 4.2), (.46, .83, .15, .018, 3.6)), (.17, .83))
    fabric("Trousers_Diffuse.png", (112, 105, 94),
           ((.48, .31, .20, .019, 4.5), (.62, .37, .13, -.023, 3.5), (.29, .73, .16, .027, 3.2)), (.12,))
    fleece()
    hair()
    boots()
    verify_and_preview()
    manifest = dict(
        generator="scripts/make_maps.py; deterministic Pillow/NumPy offline generation",
        art_direction="Painted diffuse, original 2001 early-PS2 psychological horror technique. "
                      "No modern pore/normal/roughness/subsurface maps. All maps 512px.",
        textures=MAPS,
        uv_contracts={
            "head_front": "u=.5+x/.20, v=(z-1.53)/.28; meters. PNG top row is high v. "
                          "Eyes x=+/- .034,z=1.684; mouth z=1.6145. Same contract on zombie and decals.",
            "tile": "Repeating projection at 2.5 per meter, one tile spans .4m. "
                    "Fold/panel painting is generic; do not treat as a packed garment atlas.",
            "hair_clump": "Align UV v with clump root-to-tip; curved streaks run along v."},
        material_notes="Feed sRGB diffuse to simple material base color. Matte values may be constant "
                       "(skin .75, cloth .9, hair .82, boots .8); no subsurface required. "
                       "Alpha-over optional decals only; clean maps contain no injury/dirt.",
        resolution_reason="512 is enough for these broad painted features; no expression benefit from duplicated 1024 maps.",
        limits=["Painted shadows support form and can be visible under opposing strong illumination.",
                "Frontal UV projection needs a separate uniform skin material/UV region for exposed rear head/neck.",
                "Generic tile fold/seam placement is not tailored to individual UV garment islands.",
                "Texture validation does not establish rendered character quality; Blender integration needs visual QA."])
    (OUT / "texture_manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Verified {len(MAPS)} diffuse/decal maps at {SIZE}px; {OUT}")
