"""Build restrained, deterministic character maps without modifying Blender."""
from pathlib import Path
import json
import math

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


OUT = Path(__file__).resolve().parents[1] / "Character_Textures"
OUT.mkdir(parents=True, exist_ok=True)
MAPS = {}


def grid(size):
    # PNG rows run downwards; Blender UV v runs upwards.
    u, row = np.meshgrid((np.arange(size) + .5) / size,
                         (np.arange(size) + .5) / size)
    return u, 1 - row


def gaussian(u, v, x, y, sx, sy):
    return np.exp(-.5 * (((u - x) / sx) ** 2 + ((v - y) / sy) ** 2))


def save(name, pixels, description, color_space="sRGB", uv="tile"):
    arr = np.uint8(np.clip(np.rint(pixels), 0, 255))
    image = Image.fromarray(arr)
    image.save(OUT / name)
    MAPS[name] = dict(resolution=list(image.size), channels=image.mode,
                     color_space=color_space, uv=uv, description=description)
    return image


def head():
    size = 1024
    u, v = grid(size)
    rgb = np.full((size, size, 3), (186, 153, 132), dtype=float)
    forehead = gaussian(u, v, .5, .79, .26, .14)
    cheeks = (gaussian(u, v, .24, .44, .13, .10)
              + gaussian(u, v, .76, .44, .13, .10))
    nose = gaussian(u, v, .5, .45, .065, .13)
    under_eyes = (gaussian(u, v, .325, .505, .092, .038)
                  + gaussian(u, v, .675, .505, .092, .038))
    ears = (gaussian(u, v, .06, .50, .055, .16)
            + gaussian(u, v, .94, .50, .055, .16))
    mouth_zone = gaussian(u, v, .5, .305, .16, .055)
    jaw = gaussian(u, v, .5, .18, .29, .13)
    for mask, tint in [(forehead, (2.5, 1.4, .2)), (cheeks, (2.3, -2.0, -1.4)),
                       (nose, (2.0, -1.8, -1.2)), (under_eyes, (-4.2, -3.7, -1.7)),
                       (ears, (2.3, -1.5, -.8)), (mouth_zone, (-1.8, -2.1, -.6)),
                       (jaw, (-3.4, -2.2, -.4))]:
        rgb += mask[..., None] * tint
    # Color modulation stays under one sRGB code value; there are no pore/noise decals.
    broad = .34 * np.sin(2 * np.pi * (u * 3 + v * 2))
    broad += .17 * np.cos(2 * np.pi * (u * 7 - v * 3))
    rgb += broad[..., None]
    save("Head_BaseColor.png", rgb,
         "Warm-neutral clean skin #BA9984; soft cheek/nose warmth, tired eye surrounds, "
         "muted perioral tone and restrained jaw stubble. No painted eyes or lips.", uv="head_front")
    rough = 161 - 11 * nose - 4 * forehead + 6 * cheeks + 3 * jaw
    save("Head_Roughness.png", rough,
         "Restrained 0.59-0.66 roughness; nose/forehead slightly smoother than cheeks.",
         color_space="Non-Color", uv="head_front")

    zombie = rgb * .63 + np.array((156, 158, 141)) * .37
    zombie += under_eyes[..., None] * (-3.0, -2.0, 1.0)
    save("Zombie_Head_BaseColor.png", zombie,
         "Optional muted, slightly sallow skin variant using the identical head UV. "
         "Injury/dirt remain separate RGBA decals.", uv="head_front")

    bruise = (gaussian(u, v, .25, .49, .06, .07) * .33
              + gaussian(u, v, .67, .37, .045, .08) * .20)
    dirt = (gaussian(u, v, .18, .21, .06, .07) * .24
            + gaussian(u, v, .80, .31, .035, .055) * .22)
    for name, mask, color, text in [
        ("Bruising_Decal_RGBA.png", bruise, (102, 83, 100), "Optional soft asymmetric bruise decal"),
        ("Dirt_Decal_RGBA.png", dirt, (98, 89, 70), "Optional restrained jaw/cheek dirt decal")]:
        rgba = np.zeros((size, size, 4), dtype=float)
        rgba[..., :3] = color
        rgba[..., 3] = mask * 255
        save(name, rgba, text + "; alpha blend over clean skin, never multiply the whole face.",
             uv="head_front")


def fabric(name, base, variant):
    size = 1024
    u, v = grid(size)
    rgb = np.full((size, size, 3), base, dtype=float)
    weave = .52 * np.sin(2 * np.pi * u * 192) + .38 * np.sin(2 * np.pi * v * 224)
    broad = .70 * np.sin(2 * np.pi * (2 * u + v)) + .38 * np.cos(2 * np.pi * (u - 3 * v))
    rgb += (weave + broad)[..., None]
    # These are shallow cloth tension motifs, not UV-specific painted panel seams.
    for cx, cy, length, bend, depth in variant:
        dx = (u - cx + .5) % 1 - .5
        curve = cy + bend * np.sin(dx * np.pi / length)
        dy = (v - curve + .5) % 1 - .5
        envelope = np.exp(-(dx / length) ** 6)
        shadow = np.exp(-.5 * (dy / .009) ** 2)
        ridge = np.exp(-.5 * ((dy - .013) / .012) ** 2)
        rgb += (envelope * (-depth * shadow + depth * .40 * ridge))[..., None]
    return save(name, rgb, "Low-contrast woven fabric with sparse, curved tension folds; "
                "no baked lighting, panel seams or checker patches. Seam geometry belongs to the model.")


def shearling():
    size = 512
    image = Image.new("RGB", (size, size), (216, 210, 193))
    draw = ImageDraw.Draw(image)
    rng = np.random.default_rng(28)
    # Fine overlapping crescent clusters, roughly 3-7 pixels across at native resolution.
    for y in range(-6, size + 7, 6):
        for x in range(-6, size + 7, 6):
            px, py = x + rng.uniform(-2, 2), y + rng.uniform(-2, 2)
            radius = rng.uniform(1.3, 3.1)
            start = int(rng.integers(0, 360))
            for ox in (-size, 0, size):
                for oy in (-size, 0, size):
                    box = (px + ox - radius, py + oy - radius,
                           px + ox + radius, py + oy + radius)
                    draw.arc(box, start, start + 230, fill=(207, 201, 185), width=1)
                    draw.arc((box[0], box[1] - 1, box[2], box[3] - 1),
                             start + 50, start + 170, fill=(226, 221, 207), width=1)
    image = image.filter(ImageFilter.GaussianBlur(.3))
    save("Shearling_BaseColor.png", np.array(image),
         "Cream fleece with restrained 3-7 pixel crescent curl clusters, no large shaded lumps.")


def boots():
    size = 512
    u, v = grid(size)
    rgb = np.full((size, size, 3), (75, 53, 39), dtype=float)
    grain = .65 * np.sin(2 * np.pi * (u * 51 + v * 9))
    grain += .40 * np.cos(2 * np.pi * (v * 71 - u * 11))
    rgb += grain[..., None]
    for center, length in ((.31, .27), (.37, .20), (.68, .21)):
        dx = (u - .5 + .5) % 1 - .5
        line = center + .06 * np.cos(dx * 7)
        dy = (v - line + .5) % 1 - .5
        mask = np.exp(-(dx / length) ** 6)
        crease = -3.5 * np.exp(-.5 * (dy / .006) ** 2)
        crease += 1.7 * np.exp(-.5 * ((dy - .012) / .010) ** 2)
        rgb += (mask * crease)[..., None]
    save("Boots_BaseColor.png", rgb,
         "Brown worn leather with subdued flex creases; no baked laces, sole borders or mud.")


def hair():
    size = 1024
    u, v = grid(size)
    rgb = np.full((size, size, 3), (26, 23, 21), dtype=float)
    flow = u + .045 * np.sin(2 * np.pi * v) + .018 * np.sin(4 * np.pi * v)
    broad = np.cos(2 * np.pi * (flow * 17 + .1 * np.sin(2 * np.pi * v)))
    fine = np.sin(2 * np.pi * flow * 113)
    highlights = np.maximum(broad, 0) ** 5 * (2 + 2 * np.sin(np.pi * v) ** 2)
    rgb += (1.5 * broad + .45 * fine + highlights)[..., None]
    rgb += np.sin(2 * np.pi * (flow * 7 + v))[..., None] * (1.1, .3, -.6)
    save("Hair_BaseColor.png", rgb,
         "Very dark brown-black with curved vertical growth streaks, grouped highlights, "
         "controlled warm/cool clump variation; use clump UV v along root-to-tip.", uv="hair_clump")
    rough = 178 + 8 * broad - 3 * highlights
    save("Hair_Roughness.png", rough,
         "Mostly matte 0.64-0.73 roughness, subtle clump variation to avoid plastic/wet hair.",
         color_space="Non-Color", uv="hair_clump")


def verify_and_preview():
    for name, entry in MAPS.items():
        with Image.open(OUT / name) as image:
            assert list(image.size) == entry["resolution"]
            assert image.mode == entry["channels"]
            assert np.array(image).max() > np.array(image).min(), name
    skin = np.array(Image.open(OUT / "Head_BaseColor.png"))
    assert np.all(np.abs(np.median(skin, axis=(0, 1)) - (186, 153, 132)) < 4)
    assert skin.max(axis=(0, 1))[0] - skin.min(axis=(0, 1))[0] < 15
    sheet = Image.new("RGB", (1200, 880), (32, 34, 35))
    draw = ImageDraw.Draw(sheet)
    names = ["Head_BaseColor.png", "Head_Roughness.png", "Hair_BaseColor.png", "Hair_Roughness.png",
             "Jacket_BaseColor.png", "Shearling_BaseColor.png", "Trousers_BaseColor.png", "Boots_BaseColor.png",
             "Zombie_Head_BaseColor.png", "Bruising_Decal_RGBA.png", "Dirt_Decal_RGBA.png"]
    for i, name in enumerate(names):
        col, row = i % 4, i // 4
        image = Image.open(OUT / name).convert("RGBA").resize((272, 244))
        if image.getextrema()[3][0] < 255:
            background = Image.new("RGBA", image.size, (186, 153, 132, 255))
            image = Image.alpha_composite(background, image)
        sheet.paste(image.convert("RGB"), (col * 300 + 14, row * 290 + 10))
        draw.text((col * 300 + 14, row * 290 + 261), name, fill=(229, 230, 223))
    sheet.save(OUT / "Material_Map_Contact_Sheet.jpg", quality=94)


if __name__ == "__main__":
    head()
    fabric("Jacket_BaseColor.png", (66, 78, 56),
           ((.30, .25, .20, .022, 3), (.72, .64, .17, -.030, 2.6), (.46, .83, .15, .018, 2.2)))
    fabric("Trousers_BaseColor.png", (113, 105, 93),
           ((.48, .31, .20, .019, 3), (.62, .36, .13, -.023, 2.2), (.29, .73, .16, .027, 2)))
    shearling()
    boots()
    hair()
    verify_and_preview()
    manifest = dict(
        generator="scripts/make_maps.py; Python Pillow and NumPy; deterministic",
        maps=MAPS,
        uv_contracts={
            "head_front": "Frontal projection u=.5+x/.20; v=(z-1.53)/.28; meters. "
                          "Eyes x=+/-0.035,z=1.683; mouth z=1.614. PNG rows are flipped to UV v. "
                          "Do not apply localized face zones to a cylindrical UV unwrap.",
            "tile": "Repeating local/world projection scale 2.5: one tile covers .4m; "
                    "all details deliberately subtle because these are not garment-specific UV islands.",
            "hair_clump": "Curved streaks run primarily along v; align each clump root-to-tip. "
                          "A cap using another unwrap requires rotation/remapping."},
        shader_starting_points={
            "skin": dict(roughness=.63, subsurface_weight=.045),
            "jacket": dict(roughness=.84), "shearling": dict(roughness=.95),
            "trousers": dict(roughness=.86), "boots": dict(roughness=.69),
            "hair": dict(roughness=.70)},
        resolution_decision="1024 head/hair/clothing, 512 fleece/leather. No 2048 copies: "
                            "the authored low-frequency detail contains no extra information at 2048.",
        limits=["Maps are authored color cues, not scan-derived skin or baked anatomical lighting.",
                "Material values are starting points; Blender lighting and render integration require visual QA.",
                "Fold placement is generic tiling detail; garment-specific wear needs a dedicated unwrap.",
                "Head frontal mapping can mirror face coloration onto a projected rear surface; "
                "assign a uniform skin material or separate back-of-head UV area where exposed.",
                "Clean maps contain no bruises/dirt. Decals and zombie map are optional alternate layers."])
    (OUT / "materials_manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Wrote and verified {len(MAPS)} maps, manifest and contact sheet in {OUT}")
