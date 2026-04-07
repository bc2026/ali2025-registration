#!/usr/bin/env bash
# Deploy from your laptop to EC2: update code on the server and rebuild Docker.
#
# Prereqs: deploy.env (copy from deploy.env.example), SSH access, Docker on EC2,
#          remote directory is already a git clone (for DEPLOY_METHOD=git).
#
# Usage:
#   ./scripts/deploy-ec2.sh
#   EC2_HOST=x EC2_USER=ubuntu EC2_KEY=~/key.pem ./scripts/deploy-ec2.sh
#   DEPLOY_METHOD=rsync ./scripts/deploy-ec2.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -f "$ROOT/deploy.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/deploy.env"
  set +a
fi

EC2_HOST="${EC2_HOST:-}"
EC2_USER="${EC2_USER:-ubuntu}"
EC2_KEY="${EC2_KEY:-}"
EC2_PATH="${EC2_PATH:-/home/ubuntu/ali2025-registration}"
DEPLOY_METHOD="${DEPLOY_METHOD:-git}"
GIT_BRANCH="${GIT_BRANCH:-main}"
DOCKER_MODE="${DOCKER_MODE:-server}"
WITH_SHEETS="${WITH_SHEETS:-0}"

if [[ -z "$EC2_HOST" ]]; then
  echo "Set EC2_HOST (e.g. in deploy.env — copy deploy.env.example)."
  exit 1
fi

ssh_base=(ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new)
if [[ -n "$EC2_KEY" ]]; then
  if [[ ! -f "$EC2_KEY" ]]; then
    echo "EC2_KEY file not found: $EC2_KEY"
    exit 1
  fi
  ssh_base+=(-i "$EC2_KEY")
fi

SSH=( "${ssh_base[@]}" "${EC2_USER}@${EC2_HOST}" )

echo "→ ${EC2_USER}@${EC2_HOST}:${EC2_PATH}  method=${DEPLOY_METHOD}  branch=${GIT_BRANCH}  docker=${DOCKER_MODE}"

remote_exec() {
  "${SSH[@]}" "$@"
}

if ! remote_exec "test -d $(printf %q "$EC2_PATH")"; then
  echo "Remote directory missing: $EC2_PATH"
  echo "Create it and clone the repo there (see deploy.env.example)."
  exit 1
fi

deploy_git() {
  local remote_env
  remote_env=$(printf 'EC2_PATH=%q GIT_BRANCH=%q WITH_SHEETS=%q DOCKER_MODE=%q' \
    "$EC2_PATH" "$GIT_BRANCH" "$WITH_SHEETS" "$DOCKER_MODE")
  "${SSH[@]}" "$remote_env bash -s" <<'REMOTE'
set -euo pipefail
cd "$EC2_PATH"
if [[ ! -d .git ]]; then
  echo "Not a git repository: $EC2_PATH"
  exit 1
fi
git fetch origin
git checkout "$GIT_BRANCH"
git pull origin "$GIT_BRANCH"
export WITH_SHEETS
bash scripts/canivotenj-docker.sh "$DOCKER_MODE"
REMOTE
}

deploy_rsync() {
  if ! command -v rsync >/dev/null 2>&1; then
    echo "rsync not installed locally."
    exit 1
  fi
  local rsh
  if [[ -n "$EC2_KEY" ]]; then
    rsh="ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new -i $(printf %q "$EC2_KEY")"
  else
    rsh="ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new"
  fi
  # No --delete: avoids wiping server-only files if excludes ever miss.
  rsync -avz \
    -e "$rsh" \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude 'frontend/node_modules' \
    --exclude 'frontend/build' \
    --exclude '.env.docker' \
    --exclude '.env.aws' \
    --exclude 'backend/secret_key.json' \
    --exclude 'deploy.env' \
    --exclude '*.log' \
    --exclude '.DS_Store' \
    "$ROOT/" "${EC2_USER}@${EC2_HOST}:${EC2_PATH}/"

  local remote_env
  remote_env=$(printf 'EC2_PATH=%q WITH_SHEETS=%q DOCKER_MODE=%q' \
    "$EC2_PATH" "$WITH_SHEETS" "$DOCKER_MODE")
  "${SSH[@]}" "$remote_env bash -s" <<'REMOTE'
set -euo pipefail
cd "$EC2_PATH"
export WITH_SHEETS
bash scripts/canivotenj-docker.sh "$DOCKER_MODE"
REMOTE
}

case "$DEPLOY_METHOD" in
  git)   deploy_git ;;
  rsync) deploy_rsync ;;
  *)
    echo "DEPLOY_METHOD must be git or rsync (got: $DEPLOY_METHOD)"
    exit 1
    ;;
esac

echo "Deploy finished."
