"""Proposed fix for compose_atlas.py: sanitize the cloth/shoe/boot normal rects.

The Cycles cloth-normal bake leaves texels that point INTO the surface (z < 0) where rays missed
or hit a back face, plus rainbow noise at island borders. With normalScale 0.2 in three.js the xy
shrink but z stays negative, so those texels shade black: the 'holes' on Ganaa's jacket and the
vertical streaks on Altan's skirt.

  python3 sane_normals.py <normal_in.png> <normal_out.png>
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

RECTS = {'cloth.top': (0.760, 0.690, 0.992, 0.984), 'cloth.bottom': (0.760, 0.430, 0.992, 0.680),
         'shoes': (0.760, 0.290, 0.992, 0.420), 'boot': (0.760, 0.100, 0.900, 0.190)}
MAX_TILT_XY = 0.6          # |xy| cap after clean-up: tilt <= ~37 deg, z >= 0.8


def fill(a, m, iters=64):
    a = a.copy(); m = m.copy()
    for _ in range(iters):
        if m.all():
            break
        acc = np.zeros_like(a); n = np.zeros(m.shape, np.float32)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
            mm = np.roll(np.roll(m, dy, 0), dx, 1); aa = np.roll(np.roll(a, dy, 0), dx, 1)
            acc += aa * mm[..., None]; n += mm
        grow = (~m) & (n > 0)
        a[grow] = acc[grow] / n[grow][:, None]; m = m | grow
    return a


def sanitize(reg):
    """reg: HxWx3 float 0..1 tangent-space normal texels. Returns cleaned texels."""
    med = np.asarray(Image.fromarray((np.clip(reg, 0, 1) * 255).astype(np.uint8))
                     .filter(ImageFilter.MedianFilter(9))).astype(np.float32) / 255
    v = reg * 2 - 1; vm = med * 2 - 1
    bad = (v[..., 2] < 0.35) | (np.abs(v - vm).sum(-1) > 0.9)     # inward/grazing, or a lone spike
    v = fill(v, ~bad, 64)
    xy = np.linalg.norm(v[..., :2], axis=-1, keepdims=True)
    v[..., :2] *= np.minimum(1.0, MAX_TILT_XY / np.maximum(xy, 1e-6))
    v[..., 2] = np.maximum(v[..., 2], 0.0)
    v /= np.maximum(np.linalg.norm(v, axis=-1, keepdims=True), 1e-6)
    return np.clip(v * 0.5 + 0.5, 0, 1), float(bad.mean())


def sanitize_atlas(nrm):
    S = nrm.shape[0]
    for name, (x0, y0, x1, y1) in RECTS.items():
        ys = slice(int((1 - y1) * S), int((1 - y0) * S)); xs = slice(int(x0 * S), int(x1 * S))
        nrm[ys, xs], frac = sanitize(nrm[ys, xs])
        print(f'  {name:12s} bad normals replaced: {frac:.2%}')
    return nrm


if __name__ == '__main__':
    a = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(np.float32) / 255
    out = sanitize_atlas(a.copy())
    Image.fromarray((out * 255).round().astype(np.uint8)).save(sys.argv[2])
