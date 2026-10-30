"""Make the two-shot Blender/Godot sheet using real captures only."""
import csv
import sys
from pathlib import Path
from PIL import Image, ImageDraw

PROJECT = Path(__file__).resolve().parents[1]
CELL = (960, 540)
HEADER = 50


def compose(rows):
    sheet = Image.new('RGB', (CELL[0] * 2, (CELL[1] + HEADER) * len(rows)), '#17191d')
    draw = ImageDraw.Draw(sheet)
    for row, cells in enumerate(rows):
        for col, (image, label) in enumerate(cells):
            x, y = col * CELL[0], row * (CELL[1] + HEADER)
            draw.text((x + 16, y + 16), label, fill='white')
            sheet.paste(image.convert('RGB').resize(CELL, Image.Resampling.LANCZOS), (x, y + HEADER))
    return sheet


def main():
    if sys.argv[1:] == ['--self-test']:
        red, blue = Image.new('RGB', CELL, 'red'), Image.new('RGB', CELL, 'blue')
        result = compose([[(red, 'Blender'), (blue, 'Godot')]] * 2)
        assert result.size == (1920, 1180)
        assert result.getpixel((0, HEADER)) == (255, 0, 0)
        assert result.getpixel((960, HEADER)) == (0, 0, 255)
        print('COMPARE SELF-TEST PASS: two labelled rows, reference left, Godot right')
        return
    timing = 'timing pending'
    with (PROJECT / 'compare/timings.txt').open() as handle:
        for row in csv.DictReader(handle, delimiter='\t'):
            if row['step'] == 'forward_1080p' and row['exit_code'] == '0':
                timing = f"{float(row['seconds']) / 192:.4f} s/frame (clip wall / 192)"
    rows = []
    for shot in ('S001', 'S004'):
        reference = PROJECT / f'inputs/blender_v0.1/still_B23_{shot}.png'
        capture = PROJECT / f'compare/B23_{shot}_godot.png'
        with Image.open(reference) as blender, Image.open(capture) as godot:
            assert godot.size == (1920, 1080), f'{capture}: wrong size {godot.size}'
            rows.append([(blender.copy(), f'B23 {shot} | Blender v0.1 | time/frame not supplied'),
                         (godot.copy(), f'B23 {shot} | Godot Forward+ | {timing}')])
    destination = PROJECT / 'compare/compare_B23.png'
    compose(rows).save(destination)
    print(f'COMPARISON saved: {destination}')


if __name__ == '__main__':
    main()
