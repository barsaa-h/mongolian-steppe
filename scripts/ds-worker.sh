#!/usr/bin/env bash
# Run one DeepSeek worker job (Command Code CLI) in its own git worktree.
#   scripts/ds-worker.sh <task-id> <brief.md> [effort=high] [model=deepseek/deepseek-v4.1-flash] [max-turns=400]
# The worker runs inside bubblewrap: the filesystem is read-only except its worktree,
# a private Command Code home (no MCP servers, so no Blender MCP / ElevenLabs) and /tmp.
# The worker never commits; the manager reviews `git -C <worktree> diff`.
set -euo pipefail

task=${1:?task id}; brief=${2:?brief file}; effort=${3:-high}
model=${4:-deepseek/deepseek-v4.1-flash}; turns=${5:-400}
repo=$(git -C "$(dirname "$0")/.." rev-parse --show-toplevel)
tree="$HOME/ms-workers/$task"
runs="$repo/.worker-runs/$task"
whome="$HOME/ms-workers/.ds-home"
mkdir -p "$runs" "$whome/.commandcode"

if [ ! -d "$tree" ]; then
  git -C "$repo" worktree add -q -b "worker/$task" "$tree" main
  ln -s "$repo/node_modules" "$tree/node_modules"
fi

# Private Command Code home: login + model settings, but no MCP servers.
for f in auth.json config.json providers.json; do cp "$HOME/.commandcode/$f" "$whome/.commandcode/$f"; done
echo '{"mcpServers":{}}' > "$whome/.commandcode/mcp.json"

stamp=$(date +%Y%m%d-%H%M%S)
cp "$brief" "$runs/$stamp-brief.md"
{ cat "$repo/docs/agents/workers/WORKER_RULES.md"; echo; echo "---"; echo; cat "$brief"; } > "$runs/$stamp-prompt.md"

touch "$HOME/ms-workers/.blender-v2.lock"
cd "$tree"
bwrap --ro-bind / / --dev /dev --proc /proc --tmpfs /tmp \
  --bind "$tree" "$tree" --bind "$whome" "$whome" \
  --bind "$HOME/ms-workers/.blender-v2.lock" "$HOME/ms-workers/.blender-v2.lock" \
  --setenv HOME "$whome" --chdir "$tree" --die-with-parent \
  "$HOME/.npm-global/bin/command-code" -p "$(cat "$runs/$stamp-prompt.md")" \
    -m "$model" --effort "$effort" --max-turns "$turns" \
    --yolo --tools-all --trust --skip-onboarding --no-auto-update --no-skills \
  > "$runs/$stamp-log.txt" 2>&1 || echo "-- exit $?" >> "$runs/$stamp-log.txt"

# The final message is the report.
awk '/^## Report:/{p=1} p' "$runs/$stamp-log.txt" > "$runs/$stamp-report.md"
[ -s "$runs/$stamp-report.md" ] || tail -40 "$runs/$stamp-log.txt" > "$runs/$stamp-report.md"
cat "$runs/$stamp-report.md"
echo "-- diff:"; git -C "$tree" status --short | head -50
