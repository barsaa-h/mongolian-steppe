"""Paint UV-locked eye, brow and skin maps. Does not move islands or replace the CC0 sources."""
import math
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT.parents[1] / 'assets/sources/makehuman-core'
OUT = ROOT / 'textures'
EYE_COLORS = {
    'brown': (62, 36, 21),  # dark brown, close to the references' near-black irises
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
                if distance < radius * 0.38:
                    # Indoor pupils are over a third of the iris; smaller read as an unnatural pinpoint stare.
                    pixels[x, y] = (10, 8, 8, 255)
                elif distance < radius * 0.96:
                    angle = math.atan2(y - nearest[1], x - nearest[0])
                    fiber = 0.72 + 0.28 * abs(math.sin(distance * 0.85 + angle * 13))
                    limbus = max(0, (distance - radius * 0.8) / (radius * 0.16))
                    color = mix((24, 14, 10), iris, fiber * (1 - limbus * 0.75))
                    pixels[x, y] = (*color, 255)
                elif radius * 1.04 < distance < radius * 2.9:
                    # The photographed sclera is mid-grey (~150) and read grey on screen. Paint a warm white and keep
                    # only the photo's relative light and dark variation.
                    variation = max(.82, min(1.04, (red + green + blue) / 450))
                    pixels[x, y] = (clamp(238 * variation), clamp(232 * variation), clamp(222 * variation), alpha)
                if distance < radius * 0.42:
                    falloff = max(0, 1 - distance / (radius * 1.15))
                    nx = 128 + int(38 * (x - nearest[0]) / radius * falloff)
                    ny = 128 - int(38 * (y - nearest[1]) / radius * falloff)
                    normal_pixels[x, y] = (clamp(nx), clamp(ny), 255)
        # aim_irises maps the visible cap by surface normal, so texture position here is gaze-relative direction:
        # shade the upper eyeball (under the lid) and the corners, which a real-time render will not occlude.
        for y in range(height):
            for x in range(width):
                red, green, blue, alpha = pixels[x, y]
                nearest = min(centers, key=lambda point: (point[0] - x) ** 2 + (point[1] - y) ** 2)
                above = (nearest[1] - y) / radius
                side = abs(x - nearest[0]) / radius
                lid = min(1, max(0, (above - 0.5) / 1.0))
                corner = min(1, max(0, (side - 1.3) / 1.4))
                shade = 1 - 0.3 * lid * lid * (3 - 2 * lid) - 0.1 * corner
                warm = 0.12 * corner
                if math.hypot(x - nearest[0], y - nearest[1]) > radius * 2.9:
                    continue  # outside the eyeball; leave the backdrop alone
                pixels[x, y] = (clamp(red * shade * (1 + warm)), clamp(green * shade), clamp(blue * shade * (1 - warm)), alpha)
        # Fine red veins running in from the corners, strongest at the sides like a real eye.
        draw = ImageDraw.Draw(image, 'RGBA')
        rng = random.Random(name)
        for center in centers:
            for _vein in range(14):
                side = rng.choice((-1, 1))
                angle = rng.gauss(0, .55) + (0 if side > 0 else math.pi)
                distance = radius * rng.uniform(2.0, 2.5)
                points = []
                for step in range(7):
                    t = step / 6
                    reach = distance - (distance - radius * rng.uniform(1.5, 1.9)) * t
                    angle += rng.gauss(0, .06)
                    points.append((center[0] + math.cos(angle) * reach, center[1] + math.sin(angle) * reach))
                draw.line(points, fill=(176, 70, 64, int(rng.uniform(14, 34))), width=1)
        # Soft baked catchlight. It has to read without a sharp specular lobe.
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


def brow_bands(size):
    """Rasterise the eyebrow card's own UV strip; the painted hair must fill the card, not a thin line inside it."""
    obj = (ASSETS / 'eyebrows/eyebrow001/eyebrow001.obj').read_text().splitlines()
    uvs = [tuple(map(float, line.split()[1:3])) for line in obj if line.startswith('vt ')]
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    for line in obj:
        if line.startswith('f '):
            corners = [uvs[int(item.split('/')[1]) - 1] for item in line.split()[1:]]
            draw.polygon([(u * size, (1 - v) * size) for u, v in corners], fill=255)
    pixels = mask.load()
    bands = []
    for top, bottom in ((0, size // 2), (size // 2, size)):
        columns = {}
        for x in range(size):
            rows = [y for y in range(top, bottom) if pixels[x, y]]
            if len(rows) > 1:
                columns[x] = ((min(rows) + max(rows)) / 2, (max(rows) - min(rows)) / 2)
        xs = sorted(columns)
        edge = max(1, len(xs) // 7)
        # The head of the brow is the wide end of the card.
        if sum(columns[x][1] for x in xs[-edge:]) > sum(columns[x][1] for x in xs[:edge]):
            xs.reverse()
        bands.append([(x, *columns[x]) for x in xs])
    return mask, bands


def paint_brows():
    size = 1024
    mask, bands = brow_bands(size)
    # hairs per brow, share of the card height covered at the head, underlay strength, darkness
    styles = {
        'straight': (1700, 0.80, 0.55, 1.0),
        'heavy': (2500, 0.92, 0.75, 1.0),
        'soft': (1150, 0.62, 0.38, 0.85),
        'arched': (1300, 0.68, 0.45, 0.9),
        'sparse': (650, 0.58, 0.18, 0.75),
    }
    OUT.joinpath('brows').mkdir(parents=True, exist_ok=True)
    edge = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
    for name, (count, fill, underlay, strength) in styles.items():
        image = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        base = Image.new('L', (size, size), 0)
        base_draw = ImageDraw.Draw(base)
        draw = ImageDraw.Draw(image, 'RGBA')
        rng = random.Random(name)
        for band in bands:
            n = len(band)
            def at(along):
                return band[min(n - 1, int(along * (n - 1)))]
            def cover(along):
                # Full at the head, tapering to a fine tail.
                return fill * (1 - 0.45 * along ** 1.4)
            for index in range(0, n, 2):
                x, center, half = band[index]
                along = index / (n - 1)
                reach = half * cover(along)
                base_draw.line(((x, center - reach * 0.8), (x, center + reach * 0.7)), fill=int(255 * underlay * (1 - 0.6 * along)))
            for _hair in range(count):
                # More hairs at the head; the last fifth thins out.
                along = rng.random() ** 1.25
                if along > 0.82 and rng.random() < (along - 0.82) * 3:
                    continue
                x, center, half = at(along)
                ahead = at(min(1, along + 0.03))
                behind = at(max(0, along - 0.03))
                tx, ty = ahead[0] - behind[0], ahead[1] - behind[1]
                norm = math.hypot(tx, ty) or 1
                tx, ty = tx / norm, ty / norm
                across = max(-1, min(1, rng.gauss(0, 0.45)))
                root = (x + rng.uniform(-1, 1), center + across * half * cover(along))
                # Head hairs rise steeply; body hairs lie along the brow; lower hairs angle up, upper hairs lie flat.
                angle = math.radians(68 * max(0, 1 - along / 0.22) + 14 + across * 10 + rng.gauss(0, 6))
                up = (ty, -tx) if tx > 0 else (-ty, tx)
                dx = tx * math.cos(angle) + up[0] * math.sin(angle)
                dy = ty * math.cos(angle) + up[1] * math.sin(angle)
                length = max(5, half * rng.uniform(0.7, 1.25) * (1.15 - 0.4 * along))
                bend = rng.uniform(-0.12, 0.12)
                mid = (root[0] + dx * length * 0.5 - dy * length * bend, root[1] + dy * length * 0.5 + dx * length * bend)
                tip = (root[0] + dx * length, root[1] + dy * length)
                shade = clamp(rng.uniform(26, 62) / strength)
                alpha = int(rng.uniform(150, 235) * strength * (1 - 0.35 * along))
                draw.line((root, mid), fill=(shade, shade - 4, shade - 7, alpha), width=2)
                draw.line((mid, tip), fill=(shade + 10, shade + 6, shade + 2, alpha // 2), width=1)
        base = base.filter(ImageFilter.GaussianBlur(3))
        under = Image.new('RGBA', (size, size), (40, 34, 30, 0))
        under.putalpha(Image.composite(base, Image.new('L', (size, size), 0), mask))
        under.alpha_composite(image.filter(ImageFilter.GaussianBlur(0.45)))
        alpha = Image.composite(under.getchannel('A'), Image.new('L', (size, size), 0), edge)
        under.putalpha(alpha)
        under.save(OUT / 'brows' / f'{name}.png')
    return len(bands)


def paint_lashes():
    """Lash card texture: roots along the bottom edge (v=0), tips at the top; dense, short, slightly curved."""
    width, height = 512, 96
    image = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image, 'RGBA')
    rng = random.Random('lashes')
    for _hair in range(220):
        x = rng.uniform(4, width - 4)
        length = rng.uniform(.55, 1.0) * (height - 6)
        lean = rng.uniform(-.25, .25) * length
        points = []
        for step in range(6):
            t = step / 5
            points.append((x + lean * t * t, height - 1 - length * t))
        alpha = int(rng.uniform(170, 240))
        draw.line(points[:4], fill=(18, 14, 12, alpha), width=2)
        draw.line(points[3:], fill=(18, 14, 12, alpha // 2), width=1)
    OUT.joinpath('eyes').mkdir(parents=True, exist_ok=True)
    image.filter(ImageFilter.GaussianBlur(.4)).save(OUT / 'eyes' / 'lashes.png')


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
    paint_lashes()
    paint_skin()
    print('FACE_MAPS_OK', {'eyeRadius': eyes['radius'], 'browSpines': brows})


if __name__ == '__main__':
    main()
