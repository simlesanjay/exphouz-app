# Exphouz - Quick Deployment Summary

## 📋 What I've Created For You

I've prepared 4 comprehensive guides to help you deploy to GoDaddy:

### 1. **GODADDY_DEPLOYMENT_GUIDE.md** 📖
Complete step-by-step instructions covering:
- Server setup (Node.js, PostgreSQL)
- Project upload and configuration
- Nginx web server setup
- SSL certificate (HTTPS)
- Process management with PM2

### 2. **DEPLOYMENT_CHECKLIST.md** ✅
A checklist to track your progress:
- Pre-deployment tasks
- External services setup
- Server configuration
- Verification steps
- Troubleshooting commands

### 3. **TROUBLESHOOTING_GUIDE.md** 🔧
Solutions for 15 common issues:
- App won't start
- Database connection errors
- Nginx 502 errors
- SSL certificate problems
- Email not sending
- And more...

### 4. **.env.production.example** 🔐
Template for all environment variables needed:
- Database connection
- Authentication secrets
- Google OAuth
- Email configuration
- ImageKit storage
- With explanations for each

---

## 🚀 Quick Start (3 Steps)

### Step 1: Prepare Your GoDaddy Account
- [ ] Ensure you have VPS or Dedicated Server (NOT shared hosting)
- [ ] Get SSH access credentials
- [ ] Have your domain ready

### Step 2: Get Required Credentials
You'll need to set up accounts on:
- **Google OAuth**: https://console.cloud.google.com
- **ImageKit**: https://imagekit.io
- **Gmail App Password**: https://myaccount.google.com/apppasswords
- **PostgreSQL Database** (on server or external like AWS RDS)

### Step 3: Follow the Deployment Guide
Open `GODADDY_DEPLOYMENT_GUIDE.md` and follow the steps in order:
1. Prepare your local machine
2. Set up GoDaddy server
3. Set up database
4. Upload project
5. Configure environment
6. Set up web server
7. Get SSL certificate
8. Point domain

---

## 📦 What Each Guide Covers

| Guide | Purpose | Time |
|-------|---------|------|
| GODADDY_DEPLOYMENT_GUIDE.md | Complete setup instructions | 45-60 min |
| DEPLOYMENT_CHECKLIST.md | Track your progress | 2-5 min |
| TROUBLESHOOTING_GUIDE.md | Fix common problems | As needed |
| .env.production.example | Environment configuration | 30-45 min |

---

## 🔑 Required Environment Variables

**MUST SET:**
```
DATABASE_URL              (PostgreSQL connection)
NEXTAUTH_URL              (Your production domain)
NEXTAUTH_SECRET           (Generate: openssl rand -base64 32)
GOOGLE_CLIENT_ID          (From Google Cloud)
GOOGLE_CLIENT_SECRET      (From Google Cloud)
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD  (Gmail)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
IMAGEKIT_PRIVATE_KEY      (From ImageKit)
```

**OPTIONAL:**
```
LINKEDIN_CLIENT_ID        (LinkedIn login)
LINKEDIN_CLIENT_SECRET    (LinkedIn login)
```

---

## 📊 Deployment Architecture

```
Your Domain (GoDaddy DNS)
         ↓
   Nginx Reverse Proxy (Port 80/443)
         ↓
   Node.js App (Port 3000) - Run by PM2
         ↓
   PostgreSQL Database
         ↓
   External Services (Google, ImageKit, Gmail)
```

---

## 🛠️ Key Technologies Used

- **Next.js 16** - React framework
- **Node.js 20** - Runtime
- **PostgreSQL** - Database
- **Nginx** - Web server
- **PM2** - Process manager
- **Let's Encrypt** - SSL certificates
- **Prisma** - Database ORM

---

## ⏱️ Timeline

| Stage | Time | Notes |
|-------|------|-------|
| Setup external services | 30-45 min | Google, ImageKit, Gmail |
| GoDaddy server setup | 30 min | Node, PostgreSQL, Git |
| Project upload & config | 20 min | Upload code, set .env |
| Build & deploy | 15 min | npm install, build, PM2 |
| Nginx & SSL setup | 20 min | Web server, certificates |
| DNS update & wait | 24-48 hrs | Domain propagation |
| **TOTAL** | **1-2 days** | Mostly waiting for DNS |

---

## 🔒 Security Checklist

Before going live, ensure:
- [ ] `.env` file is NEVER committed to git
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] SSL certificate is installed (HTTPS only)
- [ ] Database password is strong
- [ ] Firewall is enabled on server
- [ ] Regular backups are set up
- [ ] Don't expose private keys in logs

---

## 📱 Deployment Methods

### Method 1: Git (RECOMMENDED)
```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/exphouz.git
cd exphouz
# ... follow guide steps
```

### Method 2: SFTP Upload
Use FileZilla or WinSCP to upload files directly

### Method 3: SCP from Windows
```powershell
scp -r "local\path" username@godaddy-ip:/var/www/
```

---

## 🔄 Update Process

After deployment, updating your app is simple:

```bash
cd /var/www/exphouz
git pull origin main
npm install
npm run build
npx prisma migrate deploy
pm2 restart exphouz
```

Or use the included script:
```bash
bash deploy.sh
```

---

## 📞 When You're Stuck

1. **Check logs**: `pm2 logs exphouz --lines 100`
2. **Read troubleshooting**: `TROUBLESHOOTING_GUIDE.md`
3. **Search error**: Google the error message
4. **Contact GoDaddy support**: If server issue
5. **Contact service providers**: Google, ImageKit, etc.

---

## 📚 Useful Commands

```bash
# Deployment
npm run build              # Build for production
npm run dev                # Development server
npm install                # Install dependencies

# PM2 (Process Manager)
pm2 start npm --name "exphouz" -- start     # Start app
pm2 status                 # Check status
pm2 logs exphouz           # View logs
pm2 restart exphouz        # Restart app
pm2 stop exphouz           # Stop app

# Database
npx prisma migrate deploy  # Run migrations
npx prisma studio         # Open database GUI
psql -U user -d db        # Connect to PostgreSQL

# Nginx
sudo systemctl restart nginx    # Restart
sudo nginx -t                   # Test config
sudo tail -f /var/log/nginx/error.log  # View errors

# System
df -h                      # Disk usage
free -h                    # Memory usage
htop                       # System monitor
```

---

## 🎯 Next Steps

1. **Read**: Open `GODADDY_DEPLOYMENT_GUIDE.md`
2. **Prepare**: Get all required credentials
3. **Follow**: Complete each step in order
4. **Verify**: Test your deployment
5. **Monitor**: Check logs regularly
6. **Update**: Keep your app up to date

---

## ✨ Good Luck!

Your app is ready to deploy. The guides are comprehensive and step-by-step. If you have questions:

1. Check the relevant guide first
2. Look in `TROUBLESHOOTING_GUIDE.md`
3. Search the error online
4. Contact support

**Happy deploying! 🚀**

---

**Last Updated**: January 31, 2026
**App Version**: 0.1.0
**Node.js Required**: 18+
**Postgres Required**: 13+
