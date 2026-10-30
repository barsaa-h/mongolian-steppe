"""Exercise failure isolation without starting Godot or generating pretend captures."""
import csv
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]


def main():
    (PROJECT / 'out').mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='runner-test-', dir=PROJECT / 'out') as temporary:
        folder = Path(temporary)
        shutil.copy2(PROJECT / 'render.sh', folder / 'render.sh')
        # Python checks fail on deliberately absent inputs; no rendered output is fabricated.
        shutil.copytree(PROJECT / 'tools', folder / 'tools')
        stub = folder / 'godot-fails'
        stub.write_text('#!/usr/bin/env bash\nprintf "%s\\n" "$*" >> "$CALL_LOG"\nexit 7\n')
        stub.chmod(0o755)
        env = dict(os.environ, GODOT=str(stub), CALL_LOG=str(folder / 'calls.txt'))
        result = subprocess.run(['bash', str(folder / 'render.sh')], env=env,
                                capture_output=True, text=True, timeout=30)
        assert result.returncode == 1, result.stdout + result.stderr
        calls = (folder / 'calls.txt').read_text().splitlines()
        assert len(calls) == 9, calls
        assert sum('--write-movie' in line for line in calls) == 4, calls
        assert sum('--still=4.0' in line for line in calls) == 2, calls
        assert any('--rendering-method mobile' in line for line in calls), calls
        assert any('--rendering-driver opengl3' in line for line in calls), calls
        with (folder / 'compare/timings.txt').open() as handle:
            timings = {row['step']: row for row in csv.DictReader(handle, delimiter='\t')}
        for step in ('still_S001', 'still_S004', 'forward_1080p', 'forward_540p',
                     'mobile_540p', 'opengl3_540p'):
            assert timings[step]['exit_code'] == '7', timings
            assert (folder / f'compare/logs/{step}.log').exists()
        assert timings['comparison']['exit_code'] != '0', timings
        assert timings['encode_opengl3_540p']['exit_code'] == 'skipped', timings
        print('RUNNER SELF-TEST PASS: 9 stub Godot jobs attempted despite failures;')
        print('2 stills + 4 renderer/resolution clips logged and timed; comparison attempted; exit 1')


if __name__ == '__main__':
    main()
