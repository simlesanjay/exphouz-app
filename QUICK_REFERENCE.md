# 🚀 Quick Reference Card - GoDaddy Deployment

## 📋 Files Created

| File | Purpose |
|------|---------|
| `STEP_BY_STEP_GUIDE.md` | **START HERE** - Visual step-by-step instructions |
| `GODADDY_DEPLOYMENT_GUIDE.md` | Complete technical deployment guide |
| `DEPLOYMENT_CHECKLIST.md` | Checklist to track your progress |
| `TROUBLESHOOTING_GUIDE.md` | Solutions for common issues |
| `DEPLOYMENT_SUMMARY.md` | Overview and quick reference |
| `.env.production.example` | Template for environment variables |
| `deploy.sh` | Automated deployment script |

---

## ⚡ Quick Command Reference

### Server Connection
```bash
ssh username@your-godaddy-ip                 # Connect to server
scp -r local_path username@ip:/remote/path   # Upload files
```

### Node.js & npm
```bash
node -v                                      # Check Node version
npm -v                                       # Check npm version
npm install                                  # Install dependencies
npm run build                                # Build for production
npm run dev                                  # Development server
```

### Database
```bash
npx prisma migrate deploy                    # Run migrations
npx prisma studio                            # Database GUI
psql -U user -d database                     # PostgreSQL CLI
```

### PM2 (Process Manager)
```bash
pm2 start npm --name "exphouz" -- start      # Start app
pm2 status                                   # Check status
pm2 logs exphouz                             # View logs
pm2 restart exphouz                          # Restart app
pm2 stop exphouz                             # Stop app
pm2 delete exphouz                           # Remove from PM2
```

### Nginx (Web Server)
```bash
sudo systemctl start nginx                   # Start
sudo systemctl restart nginx                 # Restart
sudo systemctl stop nginx                    # Stop
sudo nginx -t                                # Test config
sudo tail -f /var/log/nginx/error.log        # View errors
```

### SSL (Certificates)
```bash
sudo certbot --nginx -d yourdomain.com       # Generate cert
sudo certbot renew --dry-run                 # Test renewal
sudo certbot certificates                    # List certs
```

### System Info
```bash
df -h                                        # Disk usage
free -h                                      # Memory usage
ps aux                                       # Running processes
top -b -n 1                                  # System monitor
```

---

## 🔐 Required Credentials Checklist

Before starting, gather these:

```
□ GoDaddy SSH username & password
□ GoDaddy server IP address
□ Domain name (already registered)

External Services:
□ Google OAuth Client ID
□ Google OAuth Client Secret
□ ImageKit Public Key
□ ImageKit Private Key
□ ImageKit URL Endpoint
□ Gmail App Password (16 characters)

Generated Values:
□ Database password (strong, unique)
□ NEXTAUTH_SECRET (from: openssl rand -base64 32)
□ Domain: yourdomain.com
```

---

## 📌 Environment Variables Quick Copy

Save this template for your `.env` file:

```
# Copy paste and fill in YOUR values
DATABASE_URL="postgresql://exphouz_user:PASSWORD@localhost:5432/exphouz"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="YOUR-GENERATED-SECRET"
GOOGLE_CLIENT_ID="YOUR-ID"
GOOGLE_CLIENT_SECRET="YOUR-SECRET"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="YOUR-16-CHAR-GMAIL-PASSWORD"
SMTP_FROM_EMAIL="Exphouz <no-reply@exphouz.com>"
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="YOUR-KEY"
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/YOUR-ID"
IMAGEKIT_PRIVATE_KEY="YOUR-KEY"
```

---

## 🎯 Deployment Steps Summary

1. **Gather Credentials** (30-45 min)
   - Google OAuth
   - ImageKit
   - Gmail App Password
   - Generate NEXTAUTH_SECRET

2. **Setup Server** (30 min)
   - SSH into GoDaddy
   - Install Node.js, PostgreSQL, nginx
   - Create database

3. **Upload & Configure** (20 min)
   - Clone/upload project
   - Create .env file
   - Install dependencies

4. **Launch** (10 min)
   - Build app
   - Start with PM2
   - Verify running

5. **Configure Web Server** (20 min)
   - Setup Nginx
   - Get SSL certificate
   - Test HTTPS

6. **Point Domain** (24-48 hours)
   - Update GoDaddy DNS
   - Wait for propagation
   - Verify live

**Total Time: 1-2 days** (mostly DNS waiting)

---

## 🚨 Common Issues (Quick Fixes)

| Issue | Quick Fix |
|-------|-----------|
| App won't start | `pm2 logs exphouz` to see error |
| Database error | Check DATABASE_URL in .env |
| 502 Bad Gateway | `pm2 status` - app not running |
| SSL not working | `sudo certbot certificates` |
| Domain not found | DNS not propagated, wait 24-48 hrs |
| Email not sending | Check SMTP credentials in .env |
| Can't upload images | Verify ImageKit keys in .env |

---

## 📞 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **PM2 Docs**: https://pm2.keymetrics.io
- **Nginx Docs**: https://nginx.org/en/docs
- **Certbot**: https://certbot.eff.org
- **GoDaddy Help**: https://www.godaddy.com/help

---

## 🔄 Update Workflow

After deployment, to push updates:

```bash
# Local machine
git add .
git commit -m "Update message"
git push origin main

# GoDaddy server
cd /var/www/exphouz
git pull origin main
npm install
npm run build
npx prisma migrate deploy
pm2 restart exphouz
```

Or use the script:
```bash
bash deploy.sh
```

---

## 🆘 Emergency Troubleshooting

**App crashed?**
```bash
pm2 restart exphouz
pm2 logs exphouz --lines 100
```

**Out of disk space?**
```bash
df -h
npm cache clean --force
```

**Server slow?**
```bash
top -b -n 1
free -h
```

**Need to revert?**
```bash
git reset --hard HEAD~1
npm run build
pm2 restart exphouz
```

---

## 📊 System Requirements

- **CPU**: 1+ cores
- **RAM**: 1+ GB (2+ recommended)
- **Disk**: 5+ GB
- **OS**: Ubuntu 20.04+ recommended
- **Node.js**: 18+ (20+ recommended)
- **PostgreSQL**: 13+

---

## 🎓 Learning Resources

**If you want to understand more:**

1. Next.js Tutorial: https://nextjs.org/learn
2. PM2 Tutorial: https://pm2.keymetrics.io/docs/tutorials/using-pm2-with-next-js
3. Nginx Basics: https://nginx.org/en/docs/beginners_guide.html
4. SSL Certificates: https://certbot.eff.org/instructions
5. Prisma Migration: https://www.prisma.io/docs/concepts/components/prisma-migrate

---

## ✅ Pre-Deployment Checklist

- [ ] Read `STEP_BY_STEP_GUIDE.md`
- [ ] Gathered all credentials
- [ ] Generated NEXTAUTH_SECRET
- [ ] Created `.env.production.example` template
- [ ] Pushed code to GitHub
- [ ] Built app locally: `npm run build`
- [ ] Tested locally: `npm run dev`
- [ ] Reviewed environment variables
- [ ] Ready for GoDaddy setup

---

## 🎉 Success Indicators

After deployment, verify:

- ✅ https://yourdomain.com loads
- ✅ No 502 errors
- ✅ Can create account
- ✅ Can log in with Google
- ✅ Can upload profile picture
- ✅ Receive password reset email
- ✅ HTTPS shows padlock icon
- ✅ `pm2 status` shows app running

---

## 💡 Pro Tips

1. **Keep backups**: Regular database backups
2. **Monitor logs**: Check `pm2 logs exphouz` daily
3. **Update regularly**: Keep Node.js and packages updated
4. **Use strong passwords**: For database and admin
5. **Set up alerts**: Monitor disk space and memory
6. **Document everything**: Keep credentials secure
7. **Test on mobile**: Don't assume desktop works everywhere

---

**You've got everything you need! Start with `STEP_BY_STEP_GUIDE.md` 🚀**

Last updated: January 31, 2026
