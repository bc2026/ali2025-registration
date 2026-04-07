#!/usr/bin/env bash
# Host TLS with Let's Encrypt (Certbot) + nginx reverse proxy → Docker frontend.
#
# Prerequisites:
#   - DNS A/AAAA for your domain points at this machine.
#   - Docker stack is up (frontend published on UPSTREAM_PORT, default 3080).
#   - Ports 80 and 443 free on the HOST (not used by another service).
#
# Usage (Ubuntu/Debian EC2 typical):
#   sudo ./scripts/certbot-https.sh canivotenj.com you@example.com
#
# Environment:
#   EMAIL=user@example.com     if not passed as second argument
#   UPSTREAM_PORT=3080         where docker-compose publishes the app nginx
#   INCLUDE_WWW=0              set to skip requesting www.<domain> cert
#   CERTBOT_DRY_RUN=1          Let's Encrypt staging / dry-run only
#   SKIP_INSTALL=1             assume nginx+certbot already installed
#
set -euo pipefail

if [[ "${EUID:-0}" -ne 0 ]]; then
  echo "Run as root (e.g. sudo $0 ...)."
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOMAIN="${1:-}"
EMAIL="${EMAIL:-${2:-}}"
UPSTREAM_PORT="${UPSTREAM_PORT:-3080}"
INCLUDE_WWW="${INCLUDE_WWW:-1}"
CERTBOT_DRY_RUN="${CERTBOT_DRY_RUN:-0}"

if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
  echo "Usage: sudo $0 <domain> <email>"
  echo "   or: sudo EMAIL=you@x.com $0 <domain>"
  exit 1
fi

SERVER_NAMES="$DOMAIN"
if [[ "$INCLUDE_WWW" == "1" ]]; then
  SERVER_NAMES="$DOMAIN www.$DOMAIN"
fi

TPL="$ROOT/docker/nginx-host/canivotenj.nginx.conf.tpl"
if [[ ! -f "$TPL" ]]; then
  echo "Missing template: $TPL"
  exit 1
fi

TMP_CONF="$(mktemp)"
sed -e "s#SERVER_NAMES#${SERVER_NAMES}#g" -e "s#UPSTREAM_PORT#${UPSTREAM_PORT}#g" "$TPL" >"$TMP_CONF"

install_packages() {
  if [[ "${SKIP_INSTALL:-0}" == "1" ]]; then
    return
  fi
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update -y
    DEBIAN_FRONTEND=noninteractive apt-get install -y nginx certbot python3-certbot-nginx
  elif command -v dnf >/dev/null 2>&1; then
    dnf install -y nginx certbot python3-certbot-nginx
  elif command -v yum >/dev/null 2>&1; then
    yum install -y nginx certbot python3-certbot-nginx
  else
    echo "No apt-get, dnf, or yum found. Install nginx, certbot, and certbot nginx plugin, then re-run with SKIP_INSTALL=1."
    exit 1
  fi
}

install_packages

if ! curl -sf "http://127.0.0.1:${UPSTREAM_PORT}/" >/dev/null; then
  echo "WARN: http://127.0.0.1:${UPSTREAM_PORT}/ did not respond. Start Docker first (./scripts/canivotenj-docker.sh). Continuing anyway."
fi

if [[ -d /etc/nginx/sites-available ]]; then
  CONF_DST="/etc/nginx/sites-available/canivotenj.conf"
  install -m 0644 "$TMP_CONF" "$CONF_DST"
  ln -sf "$CONF_DST" /etc/nginx/sites-enabled/canivotenj.conf
  if [[ -f /etc/nginx/sites-enabled/default ]]; then
    echo "Note: /etc/nginx/sites-enabled/default still exists. If port 80 is wrong, disable it:"
    echo "  sudo rm /etc/nginx/sites-enabled/default && sudo nginx -t && sudo systemctl reload nginx"
  fi
else
  install -m 0644 "$TMP_CONF" /etc/nginx/conf.d/canivotenj.conf
fi
rm -f "$TMP_CONF"

nginx -t
systemctl enable --now nginx 2>/dev/null || true
systemctl reload nginx 2>/dev/null || systemctl restart nginx

CERTBOT_ARGS=(
  --nginx
  --non-interactive
  --agree-tos
  -m "$EMAIL"
  --redirect
)
if [[ "$CERTBOT_DRY_RUN" == "1" ]]; then
  CERTBOT_ARGS+=(--dry-run)
fi
CERTBOT_ARGS+=(-d "$DOMAIN")
if [[ "$INCLUDE_WWW" == "1" ]]; then
  CERTBOT_ARGS+=(-d "www.$DOMAIN")
fi

echo "Requesting certificate for: ${SERVER_NAMES}"
certbot "${CERTBOT_ARGS[@]}"

nginx -t
systemctl reload nginx 2>/dev/null || systemctl restart nginx

echo ""
echo "Done. HTTPS should be live at https://${DOMAIN}"
echo "Renewal: certbot ships a timer on Ubuntu (systemctl list-timers | grep certbot). Test with:"
echo "  sudo certbot renew --dry-run"
echo "Add to CORS on the API if needed:"
echo "  CORS_ORIGINS=https://${DOMAIN},https://www.${DOMAIN}"
