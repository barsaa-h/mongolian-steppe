#!/usr/bin/env bash
# Run one Codex worker job in its own git worktree.
#   scripts/codex-worker.sh <task-id> <brief.md> [low|medium|high] [model]
# Default: gpt-6.1-terra at medium effort (the user's pick: fast and efficient).
# The worker never commits; the manager reviews `git -C <worktree> diff`.
set -euo pipefail

task=${1:?task id}; brief=${2:?brief file}; effort=${3:-medium}; model=${4:-gpt-6.1-terra}
repo=$(git -C "$(dirname "$0")/.." rev-parse --show-toplevel)
tree="$HOME/ms-workers/$task"
runs="$repo/.worker-runs/$task"
mkdir -p "$runs"

if [ ! -d "$tree" ]; then
  git -C "$repo" worktree add -q -b "worker/$task" "$tree" main
  ln -s "$repo/node_modules" "$tree/node_modules"
fi

stamp=$(date +%Y%m%d-%H%M%S)
cp "$brief" "$runs/$stamp-brief.md"

# Rules first, then the brief. workspace-write: writes only inside the worktree.
{ cat "$repo/docs/agents/workers/WORKER_RULES.md"; echo; echo "---"; echo; cat "$brief"; } |
codex exec - \
  -C "$tree" -m "$model" -c model_reasoning_effort="\"$effort\"" \
  -s workspace-write --skip-git-repo-check \
  -c mcp_servers.blender.enabled=false \
  -o "$runs/$stamp-report.md" > "$runs/$stamp-log.txt" 2>&1 || true

cat "$runs/$stamp-report.md" 2>/dev/null || tail -20 "$runs/$stamp-log.txt"
echo; grep -A1 "tokens used" "$runs/$stamp-log.txt" | tail -1 | sed 's/^/-- tokens used: /'
echo "-- diff:"; git -C "$tree" status --short | head -50
