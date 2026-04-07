# Installed on the HOST by scripts/certbot-https.sh (not inside Docker).
# Proxies HTTPS/HTTP to the Docker frontend (default 127.0.0.1:3080).
# SERVER_NAMES and UPSTREAM_PORT are replaced by the script.

server {
    listen 80;
    listen [::]:80;
    server_name SERVER_NAMES;

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
