"""Measure real encoded playback and assemble the requested visual evidence."""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
COMPARE = HERE / 'compare'
GODOT = HERE.parent / 'godot'


def motion(path):
    # Use identical 960x540 RGB decoding for both engines; measure adjacent frames, not one-second jumps.
    process = subprocess.Popen(['ffmpeg', '-v', 'error', '-threads', '2', '-i', str(path),
                                '-vf', 'scale=960:540', '-pix_fmt', 'rgb24', '-f', 'rawvideo', '-'],
                               stdout=subprocess.PIPE)
    previous = None
    differences = []
    size = 960 * 540 * 3
    while True:
        raw = process.stdout.read(size)
        if not raw:
            break
        if len(raw) != size:
            raise RuntimeError('Truncated decoded frame')
        frame = np.frombuffer(raw, dtype=np.uint8).astype(np.int16)
        if previous is not None:
            differences.append(float(np.abs(frame - previous).mean()))
        previous = frame
    if process.wait() != 0:
        raise RuntimeError('ffmpeg decode failed')
    if len(differences) != 191:
        raise RuntimeError(f'Expected 192 frames, got {len(differences) + 1}')
    return {'mean_adjacent_rgb_0_255': float(np.mean(differences)),
            'per_second': [float(np.mean([v for i, v in enumerate(differences, 1) if i // 24 == sec]))
                           for sec in range(8)], 'all_191_differences': differences}


def tile(path, label, width=640):
    image = Image.open(path).convert('RGB')
    assert image.width * 9 == image.height * 16, (path, image.size)
    result = Image.new('RGB', (width, width * 9 // 16 + 32), '#171819')
    result.paste(image.resize((width, width * 9 // 16), Image.Resampling.LANCZOS), (0, 32))
    ImageDraw.Draw(result).text((10, 10), label, fill='white')
    return result


def main():
    gpu = '--gpu' in sys.argv
    mode = 'gpu' if gpu else 'swiftshader'
    suffix = '_gpu' if gpu else ''
    timings = [json.loads(line) for line in (COMPARE / f'timings{suffix}.txt').read_text().splitlines()]
    captures = {row['step']: row for row in timings if 'secondsPerFrame' in row}
    seconds = captures[f'{mode}_1920x1080']['secondsPerFrame']
    metrics = {'method': 'Adjacent encoded RGB frames, both decoded at 960x540, mean absolute channel difference /255; no moving camera; static grain.',
               'three': motion(COMPARE / f'B23_S001_three{suffix}.mp4'),
               'godot': motion(GODOT / 'compare/B23_S001_godot.mp4')}
    metrics['ratio_to_godot'] = metrics['three']['mean_adjacent_rgb_0_255'] / metrics['godot']['mean_adjacent_rgb_0_255']
    metrics['far_above_godot'] = metrics['ratio_to_godot'] >= 2
    (COMPARE / f'motion{suffix}.json').write_text(json.dumps(metrics, indent=2) + '\n')
    lines = ['second\tthree_RGB_MAD\tgodot_RGB_MAD']
    lines.extend(f'{i}-{i+1}\t{a:.4f}\t{b:.4f}' for i, (a, b) in enumerate(zip(metrics['three']['per_second'], metrics['godot']['per_second'])))
    (COMPARE / f'motion{suffix}.tsv').write_text('\n'.join(lines) + '\n')
    board = Image.new('RGB', (1920, 784), '#171819')
    for row, shot in enumerate(['S001', 'S004']):
        paths = [(GODOT / f'inputs/blender_v0.1/still_B23_{shot}.png', f'{shot} Blender v0.1 | time/frame not supplied'),
                 (GODOT / f'compare/B23_{shot}_godot.png', f'{shot} Godot | 0.0972 s/frame (960x540, prior test)'),
                 (COMPARE / f'B23_{shot}_three.png', f'{shot} three.js {mode} | {seconds:.3f} s/frame (1920x1080 capture)')]
        for column, (path, label) in enumerate(paths):
            board.paste(tile(path, label), (column * 640, row * 392))
    board.save(COMPARE / 'compare_B23_three.png')
    strip = Image.new('RGB', (1920, 604), '#171819')
    for second in range(8):
        path = HERE / f'out/{mode}_1080/{second*24:04d}.png'
        strip.paste(tile(path, f'{second:.0f}s | frame {second*24}', 480), ((second % 4) * 480, (second // 4) * 302))
    strip.save(COMPARE / 'motion_strip.png')
    print(json.dumps({key: value for key, value in metrics.items() if key not in ['three', 'godot']}))
    print('THREE_MAD', metrics['three']['mean_adjacent_rgb_0_255'], 'PER_SECOND', metrics['three']['per_second'])
    if not metrics['far_above_godot']:
        raise RuntimeError('Motion acceptance failed: less than 2x the measured Godot baseline')


if __name__ == '__main__':
    if '--self-test' in sys.argv:
        test = HERE / 'out/metric-self-test.mp4'
        test.parent.mkdir(exist_ok=True)
        frames = b''.join(bytes([255 * (i % 2)]) * (32 * 18 * 3) for i in range(192))
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pixel_format', 'rgb24',
                        '-video_size', '32x18', '-framerate', '24', '-i', '-', '-c:v', 'libx264',
                        '-threads', '2', '-crf', '0', '-pix_fmt', 'yuv420p', str(test)],
                       input=frames, check=True)
        try:
            result = motion(test)
            assert len(result['all_191_differences']) == 191
            assert result['mean_adjacent_rgb_0_255'] > 250
            assert all(value > 250 for value in result['per_second'])
            print('METRIC_OK: synthetic alternating black/white, 191 differences, eight second bins >250/255')
        finally:
            test.unlink()
    else:
        main()
