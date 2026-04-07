#!/usr/bin/env bash
# Automate local Docker (Postgres + API + nginx frontend) or RDS-backed API + frontend.
# Usage:
#   ./scripts/canivotenj-docker.sh local          # default: docker-compose.yml
#   ./scripts/canivotenj-docker.sh rds              # docker-compose.rds.yml → your RDS
#   WITH_SHEETS=1 ./scripts/canivotenj-docker.sh local   # mount secret_key.json for Sheet2
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

MODE="${1:-local}"
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
      echo "Created .env.docker from env.docker.example."
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

echo ""
echo "canivotenj — stack is up."
echo "  Frontend (nginx): http://localhost:3080"
echo "  Backend API:      http://localhost:5002"
echo ""
echo "Load voter data (optional, from repo root CSV example):"
echo "  docker compose -f docker-compose.yml exec -T postgres psql -U admin -d voter_db -c \"COPY voters(first_name,last_name,street_no,street_name,residence_city,residence_zip,dob,party,district) FROM STDIN WITH (FORMAT csv, HEADER true);\" < your_export.csv"
echo "Or run SQL: docker/postgres/migrations/add_party_district.sql on RDS if columns are missing."
echo ""
echo "AWS EC2 (your notes): ssh bhag-aws  OR  ssh -i bhag-key.pem ubuntu@ec2-44-201-99-56.compute-1.amazonaws.com"
