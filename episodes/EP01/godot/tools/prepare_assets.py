"""Copy upstream GLBs into Godot's resource root without modifying originals."""
import shutil
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parents[2]
SOURCES = {'apartment': ROOT / 'assets/maps/episode-1/glb/apartment.glb'}
SOURCES.update({name: ROOT / 'artifacts/episode-1-cast' / name / 'character.glb'
                for name in ('ganaa', 'altan', 'party-guest-01', 'party-guest-02')})


def main():
    destination = PROJECT / 'imports'
    destination.mkdir(exist_ok=True)
    for name, source in SOURCES.items():
        target = destination / f'{name}.glb'
        if not target.exists() or (source.stat().st_size, source.stat().st_mtime_ns) != (
                target.stat().st_size, target.stat().st_mtime_ns):
            shutil.copy2(source, target)
        settings = target.with_suffix('.glb.import')
        config = settings.read_text() if settings.exists() else (
            '[remap]\nimporter="scene"\ntype="PackedScene"\n\n[params]\n'
            'meshes/ensure_tangents=true\nmeshes/generate_lods=true\n')
        # Solid-color accessory meshes have no UVs; their tangents are unnecessary.
        config = config.replace('meshes/ensure_tangents=true', 'meshes/ensure_tangents=false')
        config = config.replace('meshes/generate_lods=true', 'meshes/generate_lods=false')
        if not settings.exists() or settings.read_text() != config:
            settings.write_text(config)
        print(f'{name}: {source.stat().st_size} bytes ready')


if __name__ == '__main__':
    main()
