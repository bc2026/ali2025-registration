#!/usr/bin/env bash
# Host TLS with Let's Encrypt + nginx → Docker frontend on UPSTREAM_PORT.
#
# Uses certbot **webroot** (not --nginx) so /.well-known is served from this host and is NOT
# proxied to Docker — fixes "CA failed to verify temporary nginx configuration" when location /
# was proxy-only.
#
# Usage:
#   sudo ./scripts/certbot-https.sh --check canivotenj.com    # DNS / connectivity hints only
#   sudo ./scripts/certbot-https.sh canivotenj.com you@example.com
#
# Environment:
#   EMAIL=…              if not passed as second argument
#   UPSTREAM_PORT=3080
#   INCLUDE_WWW=0        if www.<domain> has no DNS (otherwise validation fails for www)
#   CERTBOT_DRY_RUN=1
#   SKIP_INSTALL=1
#   SKIP_PREFLIGHT=1
#
set -euo pipefail

if [[ "${EUID:-0}" -ne 0 ]]; then
  echo "Run as root (e.g. sudo $0 ...)."
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ "${1:-}" == "--check" ]]; then
  shift
  DOMAIN="${1:-}"
  [[ -n "$DOMAIN" ]] || { echo "Usage: sudo $0 --check <domain>"; exit 1; }
  echo "=== Checks for Let's Encrypt HTTP-01 (port 80 must work from the internet) ==="
  echo ""
  echo "From your laptop (or phone off Wi‑Fi):"
  echo "  curl -sI \"http://${DOMAIN}/.well-known/acme-challenge/ping\" | head -5"
  echo "You want HTTP/1.1 404 from nginx (or 200) — not connection timeout."
  echo ""
  echo "AWS EC2: inbound rules need TCP 80 (and 443 after TLS) from 0.0.0.0/0 (or LE IPs)."
  echo "Ensure nothing else binds :80 (docker run -p 80:… on the host will block host nginx)."
  echo ""
  echo "Cloudflare / CDN: use DNS only (grey cloud) for the hostname until the cert is issued,"
  echo "or disable “Always Use HTTPS” / edge redirects that send HTTP-01 to HTTPS (challenge 404s on https)."
  echo ""
  if command -v dig >/dev/null 2>&1; then
    echo "dig +short A ${DOMAIN}"
    dig +short A "$DOMAIN" | sed 's/^/  /'
    echo "dig +short AAAA ${DOMAIN}"
    dig +short AAAA "$DOMAIN" | sed 's/^/  /'
    echo "dig +short A www.${DOMAIN}"
    dig +short A "www.$DOMAIN" | sed 's/^/  /'
  fi
  echo ""
  if command -v curl >/dev/null 2>&1; then
    PUB=$(curl -4 -sS --max-time 4 https://checkip.amazonaws.com 2>/dev/null || true)
    [[ -n "$PUB" ]] && echo "This instance’s public IPv4 (checkip.amazonaws.com): $PUB"
  fi
  exit 0
fi

DOMAIN="${1:-}"
EMAIL="${EMAIL:-${2:-}}"
UPSTREAM_PORT="${UPSTREAM_PORT:-3080}"
INCLUDE_WWW="${INCLUDE_WWW:-1}"
CERTBOT_DRY_RUN="${CERTBOT_DRY_RUN:-0}"
SKIP_PREFLIGHT="${SKIP_PREFLIGHT:-0}"

if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
  echo "Usage: sudo $0 <domain> <email>"
  echo "       sudo $0 --check <domain>"
  exit 1
fi

SERVER_NAMES="$DOMAIN"
if [[ "$INCLUDE_WWW" == "1" ]]; then
  SERVER_NAMES="$DOMAIN www.$DOMAIN"
fi

CERT_NAME="$DOMAIN"

TPL_HTTP="$ROOT/docker/nginx-host/canivotenj.nginx.conf.tpl"
TPL_SSL="$ROOT/docker/nginx-host/canivotenj.ssl.conf.tpl"
if [[ ! -f "$TPL_HTTP" || ! -f "$TPL_SSL" ]]; then
  echo "Missing nginx templates under docker/nginx-host/"
  exit 1
fi

web_user() {
  if id www-data &>/dev/null; then echo www-data
  elif id nginx &>/dev/null; then echo nginx
  else echo root
  fi
}

install_packages() {
  if [[ "${SKIP_INSTALL:-0}" == "1" ]]; then
    return
  fi
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update -y
    DEBIAN_FRONTEND=noninteractive apt-get install -y nginx certbot
  elif command -v dnf >/dev/null 2>&1; then
    dnf install -y nginx certbot
  elif command -v yum >/dev/null 2>&1; then
    yum install -y nginx certbot
  else
    echo "No apt-get, dnf, or yum found. Install nginx and certbot, then SKIP_INSTALL=1."
    exit 1
  fi
}

write_http_config() {
  local tmp
  tmp="$(mktemp)"
  sed -e "s#SERVER_NAMES#${SERVER_NAMES}#g" -e "s#UPSTREAM_PORT#${UPSTREAM_PORT}#g" "$TPL_HTTP" >"$tmp"
  if [[ -d /etc/nginx/sites-available ]]; then
    install -m 0644 "$tmp" /etc/nginx/sites-available/canivotenj.conf
    ln -sf /etc/nginx/sites-available/canivotenj.conf /etc/nginx/sites-enabled/canivotenj.conf
    if [[ -f /etc/nginx/sites-enabled/default ]]; then
      echo "Disabling default site so port 80 serves ${DOMAIN} (not the default welcome page)."
      rm -f /etc/nginx/sites-enabled/default
    fi
  else
    install -m 0644 "$tmp" /etc/nginx/conf.d/canivotenj.conf
  fi
  rm -f "$tmp"
}

write_ssl_config() {
  local tmp
  tmp="$(mktemp)"
  sed -e "s#SERVER_NAMES#${SERVER_NAMES}#g" \
      -e "s#UPSTREAM_PORT#${UPSTREAM_PORT}#g" \
      -e "s#CERT_NAME#${CERT_NAME}#g" \
      "$TPL_SSL" >"$tmp"
  if [[ -d /etc/nginx/sites-available ]]; then
    install -m 0644 "$tmp" /etc/nginx/sites-available/canivotenj.conf
  else
    install -m 0644 "$tmp" /etc/nginx/conf.d/canivotenj.conf
  fi
  rm -f "$tmp"
}

install_packages

mkdir -p /var/www/certbot/.well-known/acme-challenge
U="$(web_user)"
chown -R "$U:$U" /var/www/certbot

write_http_config

nginx -t
systemctl enable --now nginx 2>/dev/null || true
systemctl reload nginx 2>/dev/null || systemctl restart nginx

if [[ "$SKIP_PREFLIGHT" != "1" ]]; then
  echo ""
  echo "=== Pre-flight ==="
  "$0" --check "$DOMAIN"
  echo "=================="
  echo ""
fi

if ! curl -sf "http://127.0.0.1:${UPSTREAM_PORT}/" >/dev/null; then
  echo "WARN: Docker app not responding on http://127.0.0.1:${UPSTREAM_PORT}/ — HTTPS will still work; fix compose later."
fi

# Old failed runs may leave renewal configs that force authenticator=nginx (wrong for this script).
for R in "/etc/letsencrypt/renewal/${DOMAIN}.conf" "/etc/letsencrypt/renewal/${DOMAIN}-0001.conf"; do
  if [[ -f "$R" ]] && grep -qE 'authenticator\s*=\s*nginx' "$R"; then
    BAK="${R}.bak.before-webroot.$(date +%s)"
    echo "Moving aside nginx-based renewal file so certbot uses webroot: $R -> $BAK"
    mv "$R" "$BAK"
  fi
done

echo "le-webroot-selftest" >/var/www/certbot/.well-known/acme-challenge/le-webroot-selftest
chmod 644 /var/www/certbot/.well-known/acme-challenge/le-webroot-selftest
CODE=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: ${DOMAIN}" "http://127.0.0.1/.well-known/acme-challenge/le-webroot-selftest" || true)
if [[ "$CODE" != "200" ]]; then
  echo "ERROR: Host nginx must return 200 for http://$DOMAIN/.well-known/acme-challenge/* on port 80."
  echo "Got HTTP $CODE from 127.0.0.1 with Host: $DOMAIN — fix nginx server_name / default_server / includes, then re-run."
  exit 1
fi

CB=(certonly --webroot -w /var/www/certbot --preferred-challenges http --non-interactive --agree-tos -m "$EMAIL")
[[ "$CERTBOT_DRY_RUN" == "1" ]] && CB+=(--dry-run)
CB+=(-d "$DOMAIN")
if [[ "$INCLUDE_WWW" == "1" ]]; then
  CB+=(-d "www.$DOMAIN")
fi

echo "Requesting certificate via **webroot** (not nginx plugin) for: ${SERVER_NAMES}"
echo "Certbot output should show authenticator: webroot — if it says nginx, pull latest repo and re-run."
certbot "${CB[@]}"

write_ssl_config

nginx -t
systemctl reload nginx 2>/dev/null || systemctl restart nginx

echo ""
echo "Done. Try: https://${DOMAIN}"
echo "Renewal: certbot renew uses the same webroot. Test: sudo certbot renew --dry-run"
echo "CORS on API: CORS_ORIGINS=https://${DOMAIN},https://www.${DOMAIN}"
