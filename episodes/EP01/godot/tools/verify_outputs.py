"""Check capture dimensions and exact 8-second, 192-frame encodes."""
import json
import subprocess
import sys
from pathlib import Path
from PIL import Image


def main():
    path = Path(sys.argv[1])
    width, height = map(int, sys.argv[2:4])
    if path.suffix == '.png':
        with Image.open(path) as image:
            assert image.size == (width, height), (path, image.size)
            image.verify()
    else:
        result = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0',
                                 '-show_entries', 'stream=width,height,nb_frames,r_frame_rate,duration',
                                 '-of', 'json', str(path)], check=True, capture_output=True, text=True)
        stream = json.loads(result.stdout)['streams'][0]
        assert (stream['width'], stream['height']) == (width, height), stream
        assert int(stream['nb_frames']) == 192, stream
        assert stream['r_frame_rate'] == '24/1', stream
        assert abs(float(stream['duration']) - 8.0) < 0.001, stream
    print(f'OUTPUT PASS: {path.name} {width}x{height}' + (' 192 frames / 24 fps / 8 s' if path.suffix != '.png' else ''))


if __name__ == '__main__':
    main()
