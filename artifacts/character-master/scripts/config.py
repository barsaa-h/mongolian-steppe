"""The small, validated interface used by agents; has no Blender dependency."""
import math
import re
from pathlib import Path

OUTPUT_MARKER = '.character-master-output'
SCULPT = Path(__file__).resolve().parents[1] / 'sculpt'

def validate_output_directory(path):
    if path.exists() and (not path.is_dir() or (any(path.iterdir()) and not (path / OUTPUT_MARKER).is_file())):
        raise ValueError('Use a new output directory or an existing character-master output; unrelated files will not be overwritten')
    return path

def validate_config(config, assets, targets):
    if not isinstance(config, dict):
        raise ValueError('Character configuration must be an object')
    fields = {'name', 'height_m', 'body', 'skin', 'hair', 'outfit', 'shoes', 'targets', 'tints',
              'face', 'asymmetry', 'age', 'eyes', 'brows', 'skin_detail', 'facial_hair', 'hair_dna', 'sculpt'}
    if set(config) - fields:
        raise ValueError(f'Unknown configuration keys: {set(config) - fields}')
    required = fields - {'tints', 'face', 'asymmetry', 'age', 'eyes', 'brows', 'skin_detail', 'facial_hair', 'hair_dna', 'sculpt'}
    if required - set(config):
        raise ValueError(f'Missing configuration keys: {required - set(config)}')
    if not isinstance(config['name'], str) or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9 _-]{0,63}', config['name']):
        raise ValueError('name must be a short plain character name')
    def number(value, low, high, label):
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not low <= value <= high:
            raise ValueError(f'{label} must be finite and between {low} and {high}')
    number(config['height_m'], .65, 2.3, 'height_m')
    body = config['body']
    expected = {'gender', 'age', 'weight', 'muscle', 'proportions', 'height', 'race'}
    if not isinstance(body, dict) or set(body) != expected:
        raise ValueError(f'body must contain exactly {sorted(expected)}')
    for key in expected - {'race'}:
        number(body[key], 0, 1, f'body.{key}')
    race = body['race']
    if not isinstance(race, dict) or set(race) != {'asian', 'african', 'caucasian'}:
        raise ValueError('body.race must contain the three upstream target families')
    for key, value in race.items():
        number(value, 0, 1, f'body.race.{key}')
    if abs(sum(race.values()) - 1) > .001:
        raise ValueError('body.race weights must sum to 1')
    for field, directory, extension in [('skin', 'skins', '.mhmat'), ('hair', 'hair', '.mhclo'), ('outfit', 'clothes', '.mhclo'), ('shoes', 'clothes', '.mhclo')]:
        value = config[field]
        if not isinstance(value, str) or not re.fullmatch(r'[a-zA-Z0-9_-]+', value):
            raise ValueError(f'{field} must be a local asset name')
        if not (assets / directory / value / (value + extension)).is_file():
            raise ValueError(f'Missing {field} asset: {value}')
    if not isinstance(config['targets'], dict):
        raise ValueError('targets must map upstream target paths to weights')
    for target, value in config['targets'].items():
        if not isinstance(target, str) or not re.fullmatch(r'[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+', target):
            raise ValueError(f'Invalid target path: {target}')
        if not (targets / (target + '.target.gz')).is_file():
            raise ValueError(f'Missing modeling target: {target}')
        number(value, 0, 1, f'targets.{target}')
    sculpt = config.get('sculpt', {})
    if not isinstance(sculpt, dict):
        raise ValueError('sculpt must map sculpt layer names to weights')
    for layer, value in sculpt.items():
        if not isinstance(layer, str) or not re.fullmatch(r'[a-z0-9][a-z0-9_-]{0,63}', layer):
            raise ValueError(f'Invalid sculpt layer name: {layer}')
        if not (SCULPT / (layer + '.target')).is_file():
            raise ValueError(f'Missing sculpt layer: {layer}')
        number(value, 0, 1, f'sculpt.{layer}')
    tints = config.get('tints', {})
    if not isinstance(tints, dict) or set(tints) - {'hair', 'outfit', 'shoes'}:
        raise ValueError('tints supports hair, outfit and shoes')
    for key, color in tints.items():
        if not isinstance(color, str) or not re.fullmatch(r'#[0-9a-fA-F]{6}', color):
            raise ValueError(f'tints.{key} must be #rrggbb')
    # Deferred import: dna.py imports this module at load time.
    from dna import validate_recipe_extras
    validate_recipe_extras(config)
    return config
