#!/usr/bin/env bash
# Builds the character-detail test variant.
# Produces bundle-test.js and test-style.html. Never touches the shipped files.
set -euo pipefail
cd "$(dirname "$0")"

exec npm run build:test
