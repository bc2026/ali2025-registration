server {
    listen 80;
    server_name canivotejc.com www.canivotejc.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name canivotejc.com www.canivotejc.com;

    ssl_certificate /etc/letsencrypt/live/canivotejc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/canivotejc.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /home/azureuser/ali2025-registration/multistep-form/build/
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
