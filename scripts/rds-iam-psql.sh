#!/usr/bin/env bash
# Interactive psql to RDS / Aurora using IAM DB authentication (short-lived token).
#
#   export RDSHOST=your-cluster.cluster-xxxx.us-east-1.rds.amazonaws.com
#   export AWS_REGION=us-east-1   # optional, default us-east-1
#   export RDS_USER=postgres      # optional
#   export RDS_DB=postgres        # optional — use your app DB name if different
#   export RDS_PORT=5432          # optional
#   ./scripts/rds-iam-psql.sh
#
# Requires: aws CLI v2, configured credentials (env, profile, or instance role), psql.
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

export PGPASSWORD="$TOKEN"
exec psql "host=$RDSHOST port=$RDS_PORT dbname=$RDS_DB user=$RDS_USER sslmode=require"
