"""Joint travel in metres/second; assemble evidence only from real rendered frames."""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
COMPARE = HERE / 'compare'
GODOT = HERE.parent / 'godot'


def motion(samples):
    times = np.array([row['time'] for row in samples])
    if len(times) != 193 or not np.allclose(times, np.arange(193)/24):
        raise ValueError('Expected 24 fps joint samples including 8s endpoint')
    result = {}
    for actor in samples[0]['actors']:
        joints = {}
        for name in ['head', 'wrist.L', 'wrist.R']:
            points = np.array([row['actors'][actor][name] for row in samples])
            if points.shape != (193, 3) or not np.isfinite(points).all():
                raise ValueError('Invalid world-space joint trace')
            distances = np.linalg.norm(np.diff(points, axis=0), axis=1)
            bins = distances.reshape(8,24).sum(axis=1)
            joints[name] = {'mean_m_per_s': float(distances.sum()/8), 'per_second_m_per_s': bins.tolist()}
        result[actor] = {'joints': joints,
                         'mean_hand_head_m_per_s': float(np.mean([j['mean_m_per_s'] for j in joints.values()])),
                         'per_second_m_per_s': np.mean([j['per_second_m_per_s'] for j in joints.values()], axis=0).tolist()}
    return {'method': '24fps world-space path length of both wrists and head per second; mean over 3 joints',
            'actors': result, 'mean_all_actors_m_per_s': float(np.mean([r['mean_hand_head_m_per_s'] for r in result.values()]))}


def tile(path, label, width=640):
    image = Image.open(path).convert('RGB')
    assert image.width * 9 == image.height * 16, (path, image.size)
    result = Image.new('RGB', (width, width*9//16+32), '#171819')
    result.paste(image.resize((width,width*9//16), Image.Resampling.LANCZOS), (0,32))
    ImageDraw.Draw(result).text((10,10), label, fill='white')
    return result


def main():
    node = '--node' in sys.argv
    source = COMPARE / ('joint-motion-node.json' if node else 'joint-motion-page.json')
    trace = json.loads(source.read_text())
    metrics = motion(trace['samples'])
    metrics['source'] = trace['method']
    destination = COMPARE / ('joint-motion-node-metrics.json' if node else 'joint-motion-metrics.json')
    destination.write_text(json.dumps(metrics, indent=2)+'\n')
    print('JOINT_MOTION', json.dumps(metrics, ensure_ascii=False))
    if node:
        return
    mode = 'gpu' if '--gpu' in sys.argv else 'swiftshader'
    board = Image.new('RGB',(1920,784),'#171819')
    for row, shot in enumerate(['S001','S004']):
        paths = [(GODOT/f'inputs/blender_v0.1/still_B23_{shot}.png', f'{shot} Blender v0.1'),
                 (COMPARE/f'B23_{shot}_three.png', f'{shot} T01 prior test (time differs)'),
                 (COMPARE/f'B23_{shot}_v2.png', f'{shot} mocap v2 | t=4s | {mode}')]
        for column,(path,label) in enumerate(paths):
            board.paste(tile(path,label),(column*640,row*392))
    board.save(COMPARE/'compare_B23_v2.png')
    strip=Image.new('RGB',(1920,604),'#171819')
    for second in range(8):
        strip.paste(tile(HERE/f'out/{mode}_1080/{second*24:04d}.png',f'{second}s | frame {second*24}',480),((second%4)*480,(second//4)*302))
    strip.save(COMPARE/'B23_v2_motion_strip.png')
    print('EVIDENCE_OK: Blender | T01 | v2 S001/S004 at 4s; eight-frame v2 strip')


if __name__ == '__main__':
    if '--self-test' in sys.argv:
        samples=[{'time':i/24,'actors':{'test':{n:[i/24,0,0] for n in ['head','wrist.L','wrist.R']}}} for i in range(193)]
        result=motion(samples)
        assert abs(result['mean_all_actors_m_per_s']-1)<1e-12
        assert np.allclose(result['actors']['test']['per_second_m_per_s'], np.ones(8))
        for row in samples:
            for point in row['actors']['test'].values():
                point[0]=0
        assert motion(samples)['mean_all_actors_m_per_s']==0
        print('METRIC_OK: 1 m/s linear joints -> eight 1.0 m/s bins; still joints -> 0 m/s')
    else:
        main()
