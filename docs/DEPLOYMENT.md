# Aesthetic Aroma — Production Deployment Guide

This guide describes how to deploy the Aesthetic Aroma platform to a production Linux (Ubuntu 22.04 / 24.04 LTS) server with MySQL, Gunicorn, Nginx, and SSL encryption.

---

## 🏛️ Architecture Overview

```
                      ┌───────────────────────────────────────────┐
                      │             Incoming HTTPS (443)          │
                      └─────────────────────┬─────────────────────┘
                                            │
                                            ▼
                           ┌─────────────────────────────────┐
                           │          Nginx Reverse Proxy     │
                           └────────┬────────────────┬───────┘
                                    │                │
            /api/* and /admin/*     │                │  Static Assets & Frontend
                                    ▼                ▼
                     ┌──────────────────────┐  ┌───────────────────────┐
                     │   Gunicorn WSGI      │  │  Vite Production SPA  │
                     │   (127.0.0.1:8000)   │  │  (/var/www/frontend)  │
                     └──────────┬───────────┘  └───────────────────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │    MySQL 9+ Server   │
                     │  (utf8mb4 / InnoDB)  │
                     └──────────────────────┘
```

---

## 🛠️ Step 1: System Packages & Dependencies

Update the server and install prerequisites:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv python3-dev \
    build-essential libssl-dev libffi-dev \
    mysql-server default-libmysqlclient-dev pkg-config \
    nginx curl git certbot python3-certbot-nginx
```

Install Node.js (LTS version 20 or 22) for building the frontend:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## 🗄️ Step 2: Configure MySQL Database

1. Secure MySQL installation:
   ```bash
   sudo mysql_secure_installation
   ```

2. Create database and dedicated user:
   ```sql
   sudo mysql -u root -p

   CREATE DATABASE aesthetic_aroma CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'aroma_user'@'localhost' IDENTIFIED BY 'StrongProductionPassword!2026';
   GRANT ALL PRIVILEGES ON aesthetic_aroma.* TO 'aroma_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

---

## ⚙️ Step 3: Configure Backend

1. Clone or place the codebase in `/var/www/aesthetic_aroma`:
   ```bash
   sudo mkdir -p /var/www/aesthetic_aroma
   sudo chown -R $USER:$USER /var/www/aesthetic_aroma
   ```

2. Create and activate a Python virtual environment:
   ```bash
   cd /var/www/aesthetic_aroma/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install gunicorn mysqlclient
   ```

3. Configure `/var/www/aesthetic_aroma/backend/.env`:
   ```ini
   DJANGO_SECRET_KEY=generate-a-strong-random-50-char-key-here
   DEBUG=False
   ALLOWED_HOSTS=aestheticaroma.com,www.aestheticaroma.com,127.0.0.1

   DB_ENGINE=mysql
   DB_NAME=aesthetic_aroma
   DB_USER=aroma_user
   DB_PASSWORD=StrongProductionPassword!2026
   DB_HOST=127.0.0.1
   DB_PORT=3306

   CORS_ALLOWED_ORIGINS=https://aestheticaroma.com,https://www.aestheticaroma.com

   # Production Razorpay Credentials (Optional)
   # RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
   # RAZORPAY_KEY_SECRET=yyyyyyyyyyyyyyyy
   ```

4. Run migrations, collect static assets, and seed initial data:
   ```bash
   python3 manage.py migrate
   python3 manage.py collectstatic --noinput
   python3 manage.py seed_demo_data
   ```

5. Verify deployment settings:
   ```bash
   python3 manage.py check --deploy
   ```

---

## 🚀 Step 4: Systemd Service for Gunicorn

Create a systemd service file at `/etc/systemd/system/aesthetic_aroma.service`:

```ini
[Unit]
Description=Gunicorn daemon for Aesthetic Aroma Django Backend
After=network.target mysql.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/aesthetic_aroma/backend
ExecStart=/var/www/aesthetic_aroma/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind 127.0.0.1:8000 \
          --access-logfile /var/log/gunicorn/access.log \
          --error-logfile /var/log/gunicorn/error.log \
          config.wsgi:application

Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo mkdir -p /var/log/gunicorn
sudo chown -R www-data:www-data /var/log/gunicorn
sudo systemctl daemon-reload
sudo systemctl enable aesthetic_aroma
sudo systemctl start aesthetic_aroma
sudo systemctl status aesthetic_aroma
```

---

## 🎨 Step 5: Build Frontend

1. Navigate to the frontend directory:
   ```bash
   cd /var/www/aesthetic_aroma/frontend
   ```

2. Configure `/var/www/aesthetic_aroma/frontend/.env`:
   ```ini
   VITE_API_BASE_URL=https://aestheticaroma.com/api/v1
   ```

3. Install dependencies and compile the production bundle:
   ```bash
   npm install
   npm run build
   ```
   *The optimized static assets will be output to `/var/www/aesthetic_aroma/frontend/dist`.*

---

## 🌐 Step 6: Configure Nginx Reverse Proxy

Create an Nginx configuration file at `/etc/nginx/sites-available/aesthetic_aroma`:

```nginx
server {
    listen 80;
    server_name aestheticaroma.com www.aestheticaroma.com;

    # Maximum upload size for menu items and gallery images
    client_max_body_size 25M;

    # Frontend Single-Page App (SPA)
    root /var/www/aesthetic_aroma/frontend/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend Django Media files
    location /media/ {
        alias /var/www/aesthetic_aroma/backend/media/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Backend Django Static files (Admin CSS/JS)
    location /django_static/ {
        alias /var/www/aesthetic_aroma/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Backend API and Admin Proxy
    location ~ ^/(api|django-admin)/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the configuration and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/aesthetic_aroma /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Step 7: Secure with SSL (Let's Encrypt)

Obtain and configure free auto-renewing SSL certificates:

```bash
sudo certbot --nginx -d aestheticaroma.com -d www.aestheticaroma.com
```

Certbot will automatically install the certificate, enable HTTPS redirection, and configure HTTP/2.

---

## 🩺 Step 8: Health Checks & Maintenance

- **Check Backend Logs:** `sudo journalctl -u aesthetic_aroma -f`
- **Check Nginx Access/Error Logs:** `sudo tail -f /var/log/nginx/error.log`
- **Restart Application:** `sudo systemctl restart aesthetic_aroma`
