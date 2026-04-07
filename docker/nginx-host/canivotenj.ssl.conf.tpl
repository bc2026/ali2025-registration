# Phase 2: TLS + HTTP→HTTPS (keep /.well-known on :80 for renewals).

server {
    listen 80;
    listen [::]:80;
    server_name SERVER_NAMES;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
        default_type "text/plain";
        allow all;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name SERVER_NAMES;

    ssl_certificate     /etc/letsencrypt/live/CERT_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/CERT_NAME/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://127.0.0.1:UPSTREAM_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
