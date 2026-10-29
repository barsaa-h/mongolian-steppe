#!/usr/bin/env bash
# Run one Grok worker job in its own git worktree.
#   scripts/grok-worker.sh <task-id> <brief.md> [light|standard|heavy]
# light    = docs, checks, research      (effort medium, 40 turns)
# standard = code or Blender scripting   (effort high, 120 turns)
# heavy    = hard multi-file problems    (effort xhigh, 200 turns)
# The worker never commits; the manager reviews `git -C <worktree> diff`.
set -euo pipefail

task=${1:?task id}; brief=${2:?brief file}; profile=${3:-standard}
repo=$(git -C "$(dirname "$0")/.." rev-parse --show-toplevel)
tree="$HOME/ms-workers/$task"
runs="$repo/.worker-runs/$task"
mkdir -p "$runs"

case $profile in
  light)    effort=medium; turns=40 ;;
  standard) effort=high;   turns=120 ;;
  heavy)    effort=xhigh;  turns=200 ;;
  *) echo "unknown profile: $profile" >&2; exit 2 ;;
esac

if [ ! -d "$tree" ]; then
  git -C "$repo" worktree add -q -b "worker/$task" "$tree" main
  ln -s "$repo/node_modules" "$tree/node_modules"
  # Workers get no live-Blender or paid MCP servers (keeps context small too).
  mkdir -p "$tree/.grok"
  printf '%s\n' '[mcp_servers.blender]' 'command = "true"' 'enabled = false' \
    '[mcp_servers.elevenlabs]' 'url = "http://127.0.0.1:9"' 'enabled = false' \
    > "$tree/.grok/config.toml"
fi

stamp=$(date +%Y%m%d-%H%M%S)
cp "$brief" "$runs/$stamp-brief.md"

GROK_CLAUDE_MCPS_ENABLED=0 GROK_CURSOR_MCPS_ENABLED=0 grok -p "$(cat "$brief")" \
  --cwd "$tree" \
  -m grok-4.7 --effort "$effort" --max-turns "$turns" \
  --sandbox workspace --permission-mode bypassPermissions \
  --no-subagents \
  --rules "$(cat "$repo/docs/agents/workers/WORKER_RULES.md")" \
  --deny 'MCPTool(blender__*)' --deny 'MCPTool(elevenlabs__*)' \
  --deny 'Bash(git commit*)' --deny 'Bash(git push*)' --deny 'Bash(git add*)' \
  --deny 'Bash(git checkout*)' --deny 'Bash(git switch*)' --deny 'Bash(git reset*)' \
  --deny 'Bash(git rebase*)' --deny 'Bash(sudo*)' --deny 'Bash(rm -rf*)' \
  --output-format json > "$runs/$stamp-result.json" 2> "$runs/$stamp-stderr.log" || true

python3 - "$runs/$stamp-result.json" <<'EOF'
import json, sys
try:
    d = json.load(open(sys.argv[1]))
except Exception as e:
    sys.exit(f"no JSON result ({e}); see stderr log")
r = d.get("result")
u = r if isinstance(r, dict) else d
print(u.get("text") or r)
print(f"\n-- turns={u.get('num_turns')} cost_usd={u.get('total_cost_usd')} input_tokens={u.get('usage',{}).get('input_tokens')}")
EOF
echo "-- diff:"; git -C "$tree" status --short | head -50
