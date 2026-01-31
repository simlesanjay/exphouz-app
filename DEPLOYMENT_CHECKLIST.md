# GoDaddy Deployment Checklist

## Pre-Deployment ✓

### Local Machine
- [ ] Build app locally: `npm run build`
- [ ] Test app locally: `npm run dev`
- [ ] Push code to GitHub
- [ ] Generate NEXTAUTH_SECRET using: `openssl rand -base64 32`

### External Services Setup
- [ ] Create PostgreSQL database (GoDaddy or external)
- [ ] Get database connection string
- [ ] Set up Google OAuth credentials (https://console.cloud.google.com)
- [ ] Set up ImageKit account (https://imagekit.io)
- [ ] Configure Gmail App Password (https://myaccount.google.com/apppasswords)
- [ ] Optional: Set up LinkedIn OAuth (https://www.linkedin.com/developers/apps)

---

## GoDaddy Server Setup ✓

### Access & Basics
- [ ] SSH into GoDaddy server
- [ ] Update system: `sudo apt update && sudo apt upgrade -y`
- [ ] Install Node.js 20+
- [ ] Install Git

### Database Setup
- [ ] Install PostgreSQL (if local) OR get external database credentials
- [ ] Create database and user
- [ ] Test connection

### Project Upload
- [ ] Clone git repository OR upload via SFTP
- [ ] Navigate to project directory
- [ ] Create `.env` file with all production variables
- [ ] Run: `npm install`

### Build & Migration
- [ ] Run: `npm run build`
- [ ] Run: `npx prisma migrate deploy`

### Process Management
- [ ] Install PM2: `sudo npm install -g pm2`
- [ ] Start app: `pm2 start npm --name "exphouz" -- start`
- [ ] Enable startup: `pm2 startup && pm2 save`
- [ ] Verify running: `pm2 status`

### Web Server Setup
- [ ] Install Nginx
- [ ] Create Nginx config at `/etc/nginx/sites-available/exphouz`
- [ ] Enable site: `sudo ln -s /etc/nginx/sites-available/exphouz /etc/nginx/sites-enabled/`
- [ ] Test config: `sudo nginx -t`
- [ ] Restart Nginx: `sudo systemctl restart nginx`

### SSL Certificate
- [ ] Install Certbot: `sudo apt install -y certbot python3-certbot-nginx`
- [ ] Generate certificate: `sudo certbot --nginx -d yourdomain.com`
- [ ] Set up auto-renewal: `sudo certbot renew --dry-run`

---

## Domain & DNS ✓

- [ ] Update GoDaddy DNS A record to server IP
- [ ] Update GoDaddy DNS CNAME record for www
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Test domain: `nslookup yourdomain.com`

---

## Verification ✓

- [ ] Visit https://yourdomain.com in browser
- [ ] Check app loads without errors
- [ ] Test login functionality
- [ ] Test Google OAuth
- [ ] Test email functionality
- [ ] Check SSL certificate
- [ ] Run: `pm2 logs exphouz` to verify no errors

---

## Post-Deployment ✓

- [ ] Set up automated backups for database
- [ ] Monitor PM2 logs regularly
- [ ] Set up monitoring/alerts
- [ ] Document admin credentials
- [ ] Test disaster recovery
- [ ] Set up CI/CD for auto-deployment (optional)

---

## Environment Variables Needed

### Core (REQUIRED)
```
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

### Email (REQUIRED)
```
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
SMTP_FROM_EMAIL
```

### ImageKit (REQUIRED)
```
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
IMAGEKIT_PRIVATE_KEY
```

### Optional
```
LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET
```

---

## Troubleshooting Commands

```bash
# Check app status
pm2 status
pm2 logs exphouz --lines 100

# Check database connection
psql -U exphouz_user -d exphouz -h localhost

# Check Nginx
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log

# Check SSL
sudo certbot certificates
sudo openssl s_client -connect yourdomain.com:443

# Restart services
pm2 restart exphouz
sudo systemctl restart nginx
sudo systemctl restart postgresql
```

---

## First Time Deployment Estimated Time
- Setup: 30-45 minutes
- DNS propagation: 24-48 hours
- Total: 1-2 days

---

## Quick Links
- GoDaddy Dashboard: https://www.godaddy.com/account/
- Prisma Docs: https://www.prisma.io/docs/
- Next.js Docs: https://nextjs.org/docs
- PM2 Docs: https://pm2.keymetrics.io/docs/
- Certbot: https://certbot.eff.org/
