#!/usr/bin/env bash
# Fix P3005 / missing nj_voter_roll on a Postgres that already had other tables (e.g. legacy voters).
#
# 1) Creates nj_voter_roll via SQL (idempotent IF NOT EXISTS)
# 2) Marks the migration as applied so `migrate deploy` works going forward
#
#   export DATABASE_URL="postgresql://..."
#   ./scripts/prisma-baseline.sh
#
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Set DATABASE_URL (same as Prisma / .env.docker)."
  exit 1
fi

SQL="$ROOT/prisma/migrations/20260406180000_init_nj_voter_roll/migration.sql"
MIGRATION_NAME="20260406180000_init_nj_voter_roll"

echo "→ prisma db execute ($SQL)"
npx prisma db execute --file "$SQL" --schema prisma/schema.prisma

echo "→ prisma migrate resolve --applied $MIGRATION_NAME"
set +e
npx prisma migrate resolve --applied "$MIGRATION_NAME"
RES=$?
set -e
if [[ "$RES" -ne 0 ]]; then
  echo "   (resolve exited $RES — often means this migration was already recorded; continuing)"
fi

echo "→ prisma migrate deploy"
npx prisma migrate deploy

echo "Baseline complete. You can run: npm run data:import"
