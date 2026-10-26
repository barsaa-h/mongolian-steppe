#!/usr/bin/env sh
set -eu
repo=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
printf 'Episode 1 cast: http://127.0.0.1:5180/artifacts/episode-1-cast/\nKeep this terminal open; Ctrl+C stops the preview.\n'
exec python3 -m http.server 5180 --bind 127.0.0.1 --directory "$repo"
