# Exphouz - GoDaddy Deployment Guide

## Prerequisites

Before starting, ensure you have:
1. ✅ GoDaddy VPS or Dedicated Server (NOT shared hosting)
2. ✅ SSH access to your server
3. ✅ PostgreSQL database (or database hosting like AWS RDS, DigitalOcean)
4. ✅ A domain name pointed to your GoDaddy server
5. ✅ SSL certificate (Let's Encrypt - free)

---

## Step 1: Prepare Your Local Machine

### 1.1 Generate Production NEXTAUTH_SECRET
Run this command locally:
```powershell
# Install openssl if not available, or use online generator
# https://generate-secret.vercel.app/
# OR on WSL/Git Bash:
openssl rand -base64 32
```

Save the output - you'll need it later.

### 1.2 Build Your Project Locally
```powershell
cd "C:\Users\sanja\Downloads\Exphouz\Exphouz"
& "C:\Program Files\nodejs\npm.cmd" run build
```

---

## Step 2: Set Up Your GoDaddy Server

### 2.1 Connect via SSH
```bash
ssh username@your-godaddy-server-ip
# Or use PuTTY/MobaXterm on Windows
```

### 2.2 Update System
```bash
sudo apt update
sudo apt upgrade -y
```

### 2.3 Install Node.js and npm
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### 2.4 Install Git
```bash
sudo apt install -y git
```

---

## Step 3: Set Up Database

### Option A: PostgreSQL on GoDaddy Server (Recommended for VPS)
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

In PostgreSQL shell:
```sql
CREATE DATABASE exphouz;
CREATE USER exphouz_user WITH PASSWORD 'your-strong-password-here';
ALTER ROLE exphouz_user SET client_encoding TO 'utf8';
ALTER ROLE exphouz_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE exphouz_user SET default_transaction_deferrable TO on;
ALTER ROLE exphouz_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE exphouz TO exphouz_user;
\q
```

### Option B: External Database (AWS RDS, DigitalOcean, etc.)
- Create a PostgreSQL database
- Get connection string: `postgresql://user:password@host:5432/exphouz`

---

## Step 4: Upload Your Project

### Method 1: Using Git (RECOMMENDED)
```bash
# On your GoDaddy server
cd /var/www  # or another suitable directory
git clone https://github.com/YOUR_USERNAME/exphouz.git
cd exphouz
```

### Method 2: Using SFTP
1. Use FileZilla or WinSCP
2. Upload entire project to `/var/www/exphouz`
3. SSH in and navigate to the directory

### Method 3: Using SCP from Windows
```powershell
# From your local machine PowerShell
scp -r "C:\Users\sanja\Downloads\Exphouz\Exphouz" username@godaddy-ip:/var/www/
```

---

## Step 5: Install Dependencies & Configure

```bash
cd /var/www/exphouz

# Install dependencies
npm install

# Create production .env file
sudo nano .env
```

Paste these values (replace with YOUR actual values):
```
# Database
DATABASE_URL="postgresql://exphouz_user:your-strong-password@localhost:5432/exphouz"

# Next.js & Auth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-generated-secret-from-step-1"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# LinkedIn OAuth (optional)
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM_EMAIL="Exphouz <no-reply@exphouz.com>"

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-account-id"
IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## Step 6: Run Prisma Migrations

```bash
cd /var/www/exphouz
npx prisma migrate deploy
# If first time, use:
npx prisma migrate dev --name init
```

---

## Step 7: Build for Production

```bash
cd /var/www/exphouz
npm run build
```

Wait for build to complete. You should see:
```
✓ Compiled successfully
```

---

## Step 8: Set Up Process Manager (PM2)

PM2 keeps your app running after SSH disconnect.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start your app
pm2 start npm --name "exphouz" -- start

# Make it start on server reboot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs exphouz
```

---

## Step 9: Set Up Web Server (Nginx)

### 9.1 Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 9.2 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/exphouz
```

Paste this configuration (replace `yourdomain.com`):
```nginx
upstream exphouz_app {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 20M;

    location / {
        proxy_pass http://exphouz_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

### 9.3 Enable the Site
```bash
sudo ln -s /etc/nginx/sites-available/exphouz /etc/nginx/sites-enabled/
sudo nginx -t  # Test config
sudo systemctl restart nginx
```

---

## Step 10: Set Up SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts and choose "Redirect HTTP to HTTPS"

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## Step 11: Update GoDaddy DNS

1. Go to GoDaddy Account → DNS Settings
2. Point your domain to your server IP:
   - **A Record**: `yourdomain.com` → `your-server-ip`
   - **CNAME Record**: `www` → `yourdomain.com`

Wait 24-48 hours for DNS to propagate.

---

## Step 12: Verify Deployment

```bash
# Check app is running
pm2 status

# Check logs
pm2 logs exphouz

# Test locally on server
curl http://localhost:3000

# Visit in browser
https://yourdomain.com
```

---

## Troubleshooting

### App not starting?
```bash
pm2 logs exphouz --lines 100
```

### Database connection error?
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Test connection
psql -U exphouz_user -d exphouz -h localhost
```

### Nginx not working?
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

### SSL certificate issues?
```bash
sudo certbot certificates
sudo certbot renew --force-renewal
```

---

## Updating Your App

```bash
cd /var/www/exphouz

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart app
pm2 restart exphouz
```

---

## Useful Commands

```bash
# View all PM2 apps
pm2 list

# View app logs
pm2 logs exphouz

# Stop app
pm2 stop exphouz

# Restart app
pm2 restart exphouz

# Restart Nginx
sudo systemctl restart nginx

# Check server resources
free -h
df -h

# Tail Nginx error log
sudo tail -f /var/log/nginx/error.log
```

---

## Security Tips

1. ✅ Use strong passwords for database
2. ✅ Keep `NEXTAUTH_SECRET` private
3. ✅ Never commit `.env` to git
4. ✅ Use HTTPS always
5. ✅ Enable firewall: `sudo ufw enable`
6. ✅ Regular backups of database and files

---

**Need help with any step? Let me know!**
