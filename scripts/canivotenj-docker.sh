#!/usr/bin/env bash
# Automate Docker: default stack = Postgres + API + nginx on ONE host (docker-compose.yml).
# Usage:
#   ./scripts/canivotenj-docker.sh              # same as "local" / "server"
#   ./scripts/canivotenj-docker.sh server      # Postgres in Docker on this machine (recommended for EC2)
#   ./scripts/canivotenj-docker.sh rds         # API+frontend only; DATABASE_URL → RDS/Aurora (.env.aws)
#   IAM auth helpers: npm run rds:psql | npm run rds:url (see env.rds-iam.example)
#   WITH_SHEETS=1 ./scripts/canivotenj-docker.sh server
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if docker compose version >/dev/null 2>&1; then
  dc() { docker compose "$@"; }
elif command -v docker-compose >/dev/null 2>&1; then
  dc() { docker-compose "$@"; }
else
  echo "Install Docker Compose (docker compose plugin or docker-compose binary)."
  exit 1
fi

MODE="${1:-server}"
if [[ "$MODE" == "local" ]]; then MODE=server; fi
WITH_SHEETS="${WITH_SHEETS:-0}"

ensure_env() {
  if [[ "$MODE" == "rds" ]]; then
    if [[ ! -f .env.aws ]]; then
      cp env.aws.example .env.aws
      echo "Created .env.aws from env.aws.example — set DB_HOST, DB_USER, DB_PASSWORD, and review CORS_ORIGINS."
    fi
  else
    if [[ ! -f .env.docker ]]; then
      cp env.docker.example .env.docker
      echo "Created .env.docker — Postgres runs in Docker on this host with API + frontend."
    fi
  fi
}

compose_cmd() {
  if [[ "$MODE" == "rds" ]]; then
    local files=( -f docker-compose.rds.yml )
    if [[ "$WITH_SHEETS" == "1" ]]; then
      files+=( -f docker-compose.rds.sheets.yml )
    fi
    dc "${files[@]}" "$@"
  else
    local files=( -f docker-compose.yml )
    if [[ "$WITH_SHEETS" == "1" ]]; then
      files+=( -f docker-compose.sheets.yml )
    fi
    dc "${files[@]}" "$@"
  fi
}

ensure_env

if [[ "$WITH_SHEETS" == "1" ]]; then
  if [[ ! -f backend/secret_key.json ]]; then
    echo "ERROR: WITH_SHEETS=1 requires backend/secret_key.json (Google service account)."
    exit 1
  fi
  echo "Sheets: ensure the spreadsheet has a tab named Sheet2 (columns filled by append)."
fi

compose_cmd up -d --build

if [[ "$MODE" != "rds" ]]; then
  echo "Waiting for Postgres..."
  for _ in $(seq 1 60); do
    if compose_cmd exec -T postgres pg_isready -U admin -d voter_db >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
fi

echo "Applying Prisma migrations (requires DATABASE_URL in .env.docker / .env.aws)..."
if ! compose_cmd exec -T backend npx prisma migrate deploy; then
  echo ""
  echo "migrate deploy failed (often P3005 if the DB already had tables). Baselining nj_voter_roll..."
  compose_cmd exec -T backend npx prisma db execute \
    --file prisma/migrations/20260406180000_init_nj_voter_roll/migration.sql \
    --schema prisma/schema.prisma
  compose_cmd exec -T backend sh -c 'npx prisma migrate resolve --applied 20260406180000_init_nj_voter_roll || true'
  compose_cmd exec -T backend npx prisma migrate deploy
fi

echo ""
echo "canivotenj — stack is up."
echo "  Frontend (nginx): http://localhost:3080"
echo "  Backend API:      http://localhost:5002"
if [[ "$MODE" != "rds" ]]; then
  echo "  Postgres:         Docker network only (same server as API). Admin: docker compose -f docker-compose.yml exec postgres psql -U admin -d voter_db"
fi
echo ""
echo "Load NJ voter xlsx (optional, from repo on host with DATABASE_URL):"
echo "  npm run data:import"
echo ""
echo "HTTPS (host nginx + Let's Encrypt): on the server, after DNS points here:"
echo "  sudo ./scripts/certbot-https.sh --check yourdomain.com"
echo "  sudo ./scripts/certbot-https.sh yourdomain.com you@email.com"
echo ""
echo "AWS EC2 (your notes): ssh bhag-aws  OR  ssh -i bhag-key.pem ubuntu@ec2-44-201-99-56.compute-1.amazonaws.com"
