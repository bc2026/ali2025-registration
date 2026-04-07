#!/usr/bin/env bash
# Print a postgresql:// URL with a fresh IAM auth token (URL-encoded for Prisma/psql).
# Tokens expire in about 15 minutes — use for one-off CLI commands (migrate, import), not a long-running API.
#
#   export RDSHOST=...
#   ./scripts/rds-iam-database-url.sh
#   # then:
#   export DATABASE_URL="$(./scripts/rds-iam-database-url.sh)"
#   npx prisma migrate deploy
#
set -euo pipefail

: "${RDSHOST:?Set RDSHOST to your RDS or Aurora cluster/instance endpoint}"

RDS_USER="${RDS_USER:-postgres}"
RDS_PORT="${RDS_PORT:-5432}"
RDS_DB="${RDS_DB:-postgres}"
AWS_REGION="${AWS_REGION:-us-east-1}"

TOKEN="$(aws rds generate-db-auth-token \
  --hostname "$RDSHOST" \
  --port "$RDS_PORT" \
  --username "$RDS_USER" \
  --region "$AWS_REGION")"

ENC="$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$TOKEN")"
USER_ENC="$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$RDS_USER")"

echo "postgresql://${USER_ENC}:${ENC}@${RDSHOST}:${RDS_PORT}/${RDS_DB}?sslmode=require"
