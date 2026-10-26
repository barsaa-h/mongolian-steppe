#!/usr/bin/env sh
set -eu
repo=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
printf 'Character preview: http://127.0.0.1:5180/artifacts/character-master/\nKeep this terminal open; press Ctrl+C to stop.\n'
exec python3 -m http.server 5180 --bind 127.0.0.1 --directory "$repo"
