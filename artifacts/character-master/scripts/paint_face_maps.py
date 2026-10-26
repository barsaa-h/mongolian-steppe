"""Paint UV-locked eye, brow and skin maps. Does not move islands or replace the CC0 sources."""
import math
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT.parents[1] / 'assets/sources/makehuman-core'
OUT = ROOT / 'textures'
EYE_COLORS = {
    'brown': (92, 52, 28),
    'brownlight': (128, 78, 40),
    'blue': (62, 96, 128),
    'bluegreen': (58, 112, 108),
    'grey': (96, 102, 108),
    'green': (62, 108, 64),
}


def clamp(value):
    return max(0, min(255, int(value)))


def mix(a, b, t):
    return tuple(clamp(a[i] * (1 - t) + b[i] * t) for i in range(len(a)))


def eye_centers(image):
    pixels = image.load()
    width, height = image.size
    dark = []
    for y in range(0, height, 2):
        for x in range(0, width, 2):
            red, green, blue, alpha = pixels[x, y]
            if alpha > 200 and red + green + blue < 70:
                dark.append((x, y))
    left = [point for point in dark if point[0] < width / 2]
    right = [point for point in dark if point[0] >= width / 2]
    def center(points):
        return (sum(point[0] for point in points) / len(points), sum(point[1] for point in points) / len(points))
    return center(left), center(right)


def iris_radius(image, center):
    pixels = image.load()
    cx, cy = center
    radius = 8
    while radius < 180:
        red, green, blue, _alpha = pixels[int(cx + radius), int(cy)]
        if red + green + blue > 420 and abs(red - green) < 40:
            return radius - 2
        radius += 1
    return 70


def paint_eyes():
    source = Image.open(ASSETS / 'eyes/materials/brown_eye.png').convert('RGBA')
    centers = eye_centers(source)
    radius = iris_radius(source, centers[0])
    width, height = source.size
    OUT.joinpath('eyes').mkdir(parents=True, exist_ok=True)
    normal = Image.new('RGB', (width, height), (128, 128, 255))
    normal_pixels = normal.load()
    for name, iris in EYE_COLORS.items():
        image = source.copy()
        pixels = image.load()
        background = pixels[8, 8]
        for y in range(height):
            for x in range(width):
                red, green, blue, alpha = pixels[x, y]
                # Remove only the stock blue corner disk. Leave the photographed sclera alone.
                if blue > red + 25 and blue > 140 and x > width * .84 and y > height * .84:
                    pixels[x, y] = background
                    continue
                nearest = min(centers, key=lambda point: (point[0] - x) ** 2 + (point[1] - y) ** 2)
                distance = math.hypot(x - nearest[0], y - nearest[1])
                if distance < radius * 0.2:
                    pixels[x, y] = (10, 8, 8, 255)
                elif distance < radius * 0.96:
                    angle = math.atan2(y - nearest[1], x - nearest[0])
                    fiber = 0.72 + 0.28 * abs(math.sin(distance * 0.85 + angle * 13))
                    limbus = max(0, (distance - radius * 0.8) / (radius * 0.16))
                    color = mix((24, 14, 10), iris, fiber * (1 - limbus * 0.75))
                    pixels[x, y] = (*color, 255)
                if distance < radius * 0.42:
                    falloff = max(0, 1 - distance / (radius * 1.15))
                    nx = 128 + int(38 * (x - nearest[0]) / radius * falloff)
                    ny = 128 - int(38 * (y - nearest[1]) / radius * falloff)
                    normal_pixels[x, y] = (clamp(nx), clamp(ny), 255)
        # Soft baked catchlight. It has to read without a sharp specular lobe.
        draw = ImageDraw.Draw(image, 'RGBA')
        for center in centers:
            highlight = (center[0] - radius * 0.28, center[1] - radius * 0.32)
            draw.ellipse((highlight[0] - radius * 0.16, highlight[1] - radius * 0.10, highlight[0] + radius * 0.16, highlight[1] + radius * 0.10), fill=(255, 250, 244, 90))
        image.filter(ImageFilter.GaussianBlur(0.4)).save(OUT / 'eyes' / f'{name}.png')
    normal.save(OUT / 'eyes' / 'normal.png')
    return {'centers': centers, 'radius': radius}


def brow_spines(source):
    pixels = source.load()
    width, height = source.size
    bands = [(0.24, 0.414), (0.509, 0.682)]
    spines = []
    for low, high in bands:
        y0, y1 = int((1 - high) * height), int((1 - low) * height)
        spine = []
        for x in range(int(0.03 * width), int(0.96 * width)):
            best, best_alpha = None, 0
            for y in range(y0, y1):
                alpha = pixels[x, y][3]
                if alpha > best_alpha:
                    best, best_alpha = y, alpha
            if best is not None and best_alpha > 20:
                spine.append((x, best, best_alpha))
        spines.append(spine)
    return spines


def paint_brows():
    source = Image.open(ASSETS / 'eyebrows/eyebrow001/eyebrow001.png').convert('RGBA')
    spines = brow_spines(source)
    styles = {
        'straight': (0.0, 140, 2.4, 0.9),
        'soft': (0.06, 90, 1.5, 0.7),
        'arched': (0.14, 120, 1.7, 0.8),
        'heavy': (0.02, 180, 3.1, 1.0),
        'sparse': (-0.02, 55, 1.3, 0.62),
    }
    OUT.joinpath('brows').mkdir(parents=True, exist_ok=True)
    width, height = source.size
    for name, (arch, count, width_scale, strength) in styles.items():
        image = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image, 'RGBA')
        rng = random.Random(name)
        for spine in spines:
            if len(spine) < 8:
                continue
            head_x = spine[0][0]
            tail_x = spine[-1][0]
            span = max(1, tail_x - head_x)
            band = []
            for point in spine[::3]:
                along = (point[0] - head_x) / span
                lift = math.sin(along * math.pi) * arch * 28
                band.append((point[0], point[1] - lift))
            for point, along in ((item, index / max(1, len(band) - 1)) for index, item in enumerate(band)):
                spread = width_scale * (3.2 * (1 - along) + 0.7)
                draw.ellipse((point[0] - spread, point[1] - spread * 0.55, point[0] + spread, point[1] + spread * 0.55), fill=(32, 24, 20, int(70 * strength * (1 - along * 0.65))))
            for _stroke in range(count):
                start = rng.randrange(0, len(spine) - 4)
                length = rng.randint(8, 22)
                points = []
                for step in range(length):
                    point = spine[min(len(spine) - 1, start + step)]
                    along = (point[0] - head_x) / span
                    lift = math.sin(along * math.pi) * arch * 28
                    offset = rng.uniform(-1.6, 1.6) * width_scale * (1.2 - along)
                    points.append((point[0], point[1] - lift + offset))
                taper = 1 - (spine[min(len(spine) - 1, start)][0] - head_x) / span
                alpha = int(170 * strength * (0.35 + 0.65 * taper))
                draw.line(points, fill=(24, 18, 14, alpha), width=1)
        image = image.filter(ImageFilter.GaussianBlur(0.7))
        image.save(OUT / 'brows' / f'{name}.png')
    return len(spines)


def face_mask(image):
    pixels = image.load()
    width, height = image.size
    background = pixels[2, 2]
    mask = Image.new('L', (width, height), 0)
    mask_pixels = mask.load()
    for y in range(height):
        for x in range(int(width * 0.55), width):
            color = pixels[x, y][:3]
            if sum(abs(color[channel] - background[channel]) for channel in range(3)) > 22:
                mask_pixels[x, y] = 255
    # Keep the large head island. Drop the small mouth and nail islands below it.
    bbox = mask.getbbox()
    if not bbox:
        raise RuntimeError('Face island not found')
    return mask, bbox


def paint_skin():
    OUT.joinpath('skin').mkdir(parents=True, exist_ok=True)
    shared_mask = None
    for folder in sorted((ASSETS / 'skins').iterdir()):
        if not folder.is_dir():
            continue
        sources = list(folder.glob('*.png'))
        if not sources:
            continue
        image = Image.open(sources[0]).convert('RGB')
        mask, bbox = face_mask(image)
        if shared_mask is None:
            shared_mask = mask
            mask.save(OUT / 'skin' / 'head_mask.png')
            paint_face_overlays(image, mask, bbox)
        sharp = ImageEnhance.Sharpness(image).enhance(1.12)
        face = Image.composite(sharp, image, mask.filter(ImageFilter.GaussianBlur(1.2)))
        pixels = face.load()
        mask_pixels = mask.load()
        if 'middleage' in folder.name or 'old_' in folder.name:
            warm_cheeks(pixels, mask_pixels, bbox, amount=7 if 'middleage' in folder.name else 10)
        face.save(OUT / 'skin' / f'{folder.name}_albedo.png')
        paint_normal_and_roughness(face, mask, folder.name, bbox)
    return True


def warm_cheeks(pixels, mask_pixels, bbox, amount):
    x0, y0, x1, y1 = bbox
    width, height = mask_pixels.size if hasattr(mask_pixels, 'size') else (x1, y1)
    # PixelAccess has no size. The mask image bounds are the loops below.
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    rx, ry = (x1 - x0) * 0.22, (y1 - y0) * 0.16
    for y in range(max(0, int(cy - ry)), int(cy + ry)):
        for side in (-1, 1):
            for x in range(int(cx + side * rx * 0.4), int(cx + side * rx * 1.5)):
                if x < 0 or y < 0 or x >= x1 or y >= y1:
                    continue
                try:
                    covered = mask_pixels[x, y]
                except IndexError:
                    continue
                if covered < 8:
                    continue
                dx = (x - (cx + side * rx)) / rx
                dy = (y - cy) / ry
                falloff = max(0, 1 - dx * dx - dy * dy)
                if falloff <= 0:
                    continue
                red, green, blue = pixels[x, y]
                pixels[x, y] = (clamp(red + amount * falloff), clamp(green + amount * 0.25 * falloff), clamp(blue - amount * 0.35 * falloff))


def paint_face_overlays(image, mask, bbox):
    pixels = image.load()
    mask_pixels = mask.load()
    x0, y0, x1, y1 = bbox
    dark = []
    for y in range(y0, (y0 + y1) // 2):
        for x in range(x0, x1):
            if mask_pixels[x, y] < 200:
                continue
            red, green, blue = pixels[x, y]
            if red + green + blue < 280 and blue + 10 < red:
                dark.append((x, y))
    if not dark:
        return
    left = [point for point in dark if point[0] < (x0 + x1) / 2]
    right = [point for point in dark if point[0] >= (x0 + x1) / 2]
    overlay = Image.new('RGBA', image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, 'RGBA')
    for group in (left, right):
        if not group:
            continue
        cx = sum(point[0] for point in group) / len(group)
        cy = sum(point[1] for point in group) / len(group)
        direction = -1 if cx < (x0 + x1) / 2 else 1
        for row in range(3):
            start = (cx + direction * 18, cy - 6 + row * 4)
            end = (cx + direction * 58, cy + 8 + row * 5)
            draw.line((start, end), fill=(90, 62, 52, 70), width=1)
        draw.arc((cx - 36, cy + 28, cx + 10, cy + 90), 20, 140, fill=(80, 56, 48, 50), width=1)
    cheek = Image.new('L', image.size, 0)
    cheek_draw = ImageDraw.Draw(cheek)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    rx, ry = (x1 - x0) * 0.16, (y1 - y0) * 0.1
    for side in (-1, 1):
        cheek_draw.ellipse((cx + side * rx * 1.15 - rx, cy - ry, cx + side * rx * 1.15 + rx, cy + ry), fill=180)
    cheek_draw.ellipse((cx - rx * 0.35, cy - ry * 0.2, cx + rx * 0.35, cy + ry * 1.3), fill=120)
    cheek.filter(ImageFilter.GaussianBlur(18)).save(OUT / 'skin' / 'cheek_mask.png')
    overlay.filter(ImageFilter.GaussianBlur(0.6)).save(OUT / 'skin' / 'age_lines.png')


def paint_normal_and_roughness(image, mask, name, bbox):
    gray = image.convert('L')
    blurred = gray.filter(ImageFilter.GaussianBlur(1.1))
    width, height = image.size
    normal = Image.new('RGB', (width, height), (128, 128, 255))
    rough = Image.new('L', (width, height), 214)
    source = blurred.load()
    mask_pixels = mask.load()
    normal_pixels = normal.load()
    rough_pixels = rough.load()
    x0, y0, x1, y1 = bbox
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    for y in range(1, height - 1):
        for x in range(1, width - 1):
            covered = mask_pixels[x, y]
            if covered < 8 and not (x1 * 0.2 < x < width * 0.5):
                continue
            dx = int(source[x + 1, y]) - int(source[x - 1, y])
            dy = int(source[x, y + 1]) - int(source[x, y - 1])
            strength = 1.8 if covered else 0.45
            normal_pixels[x, y] = (clamp(128 - dx * strength), clamp(128 + dy * strength), 255)
            if covered:
                nose = math.hypot((x - cx) / max(1, (x1 - x0) * 0.2), (y - cy) / max(1, (y1 - y0) * 0.16))
                rough_pixels[x, y] = clamp(168 + min(nose, 1) * 48)
    normal.save(OUT / 'skin' / f'{name}_normal.png')
    rough.save(OUT / 'skin' / f'{name}_roughness.png')


def main():
    eyes = paint_eyes()
    brows = paint_brows()
    paint_skin()
    print('FACE_MAPS_OK', {'eyeRadius': eyes['radius'], 'browSpines': brows})


if __name__ == '__main__':
    main()
