# GoDaddy Deployment - Troubleshooting Guide

## Common Issues & Solutions

---

## 1. App Won't Start / Port 3000 Not Responding

### Problem
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

### Solutions
```bash
# Check if app is actually running
pm2 status

# View logs to see the error
pm2 logs exphouz --lines 50

# Check if port is in use
sudo lsof -i :3000

# Try restarting
pm2 restart exphouz

# If still failing, check environment variables
cat .env | grep DATABASE_URL

# Try starting manually to see errors
npm start
```

---

## 2. Database Connection Error

### Problem
```
error: password authentication failed for user "exphouz_user"
```

### Solutions
```bash
# Check database is running
sudo systemctl status postgresql

# Test connection manually
psql -U exphouz_user -d exphouz -h localhost
# Enter your password when prompted

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Reset database password
sudo -u postgres psql
ALTER USER exphouz_user WITH PASSWORD 'new-password';
\q

# Update .env with new password and restart
pm2 restart exphouz
```

---

## 3. Nginx Returns 502 Bad Gateway

### Problem
Your domain shows `502 Bad Gateway` error

### Solutions
```bash
# Check Nginx config
sudo nginx -t

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx

# Make sure app is running on port 3000
pm2 status
pm2 logs exphouz --lines 20

# Check if Nginx can reach the app
curl http://127.0.0.1:3000

# Verify Nginx config has correct upstream
sudo cat /etc/nginx/sites-available/exphouz | grep upstream
```

---

## 4. SSL Certificate Issues / HTTPS Not Working

### Problem
Browser shows "Not Secure" or certificate error

### Solutions
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal

# Check certificate validity
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# If certificate expired, regenerate
sudo certbot --nginx -d yourdomain.com --force-renewal

# Restart Nginx
sudo systemctl restart nginx
```

---

## 5. Domain Not Found / DNS Issues

### Problem
```
nslookup: can't find yourdomain.com: Non-existent domain
```

### Solutions
```bash
# Check DNS propagation
nslookup yourdomain.com
# Should show your server IP

# Check GoDaddy DNS settings
# 1. Go to GoDaddy Dashboard
# 2. Select your domain
# 3. Check A Record points to your server IP
# 4. Check CNAME record for www

# If recently changed, DNS may need time to propagate (24-48 hours)

# Force flush DNS cache (if not propagating)
sudo systemctl restart systemd-resolved
```

---

## 6. Build Fails / npm install Error

### Problem
```
npm ERR! npm ERR! code E403 forbidden
```

### Solutions
```bash
# Clear cache and retry
npm cache clean --force
npm install

# Check npm version
npm -v

# Update npm if old
npm install -g npm@latest

# Check disk space
df -h
# If full, clean up old files

# Try installing specific package that failed
npm install package-name
```

---

## 7. Prisma Migration Failed

### Problem
```
Error: Migration already exists
```

### Solutions
```bash
# Check migration status
npx prisma migrate status

# List all migrations
npx prisma migrate list

# If database is corrupted, reset (WARNING: loses data!)
npx prisma migrate reset --force

# For production, do manual migration
npx prisma migrate deploy --preview-feature
```

---

## 8. Email Not Sending

### Problem
Password reset emails or notifications not received

### Solutions
```bash
# Check SMTP configuration in .env
cat .env | grep SMTP

# Verify Gmail App Password is correct (not regular password)
# 1. Go to https://myaccount.google.com/apppasswords
# 2. Generate new App Password if needed
# 3. Update SMTP_PASSWORD in .env

# Check app logs for email errors
pm2 logs exphouz | grep -i email

# Verify SMTP credentials manually
openssl s_client -connect smtp.gmail.com:587 -starttls smtp

# Restart app after updating .env
pm2 restart exphouz
```

---

## 9. Image Upload / ImageKit Not Working

### Problem
Images not uploading or showing as broken

### Solutions
```bash
# Check ImageKit credentials in .env
cat .env | grep IMAGEKIT

# Verify credentials are correct
# 1. Go to ImageKit dashboard
# 2. Check API Keys in Settings
# 3. Copy fresh keys

# Check app logs
pm2 logs exphouz | grep -i imagekit

# Test ImageKit connection
curl "https://ik.imagekit.io/YOUR_ACCOUNT_ID/" 

# Restart app with correct credentials
pm2 restart exphouz
```

---

## 10. Google OAuth Not Working

### Problem
"Google login not working" or redirect URI mismatch error

### Solutions
```bash
# Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
cat .env | grep GOOGLE

# Go to Google Cloud Console
# https://console.cloud.google.com/apis/credentials

# Check Authorized redirect URIs include:
# - https://yourdomain.com/api/auth/callback/google
# - https://yourdomain.com

# Verify NEXTAUTH_URL is correct in .env
cat .env | grep NEXTAUTH_URL

# Restart app
pm2 restart exphouz
```

---

## 11. High Memory Usage / App Crashes

### Problem
Server crashes or becomes unresponsive

### Solutions
```bash
# Check memory usage
free -h

# Check what's using memory
ps aux --sort=-%mem | head -10

# Check app memory
pm2 logs exphouz --lines 50

# Increase PM2 memory limit
pm2 start npm --name "exphouz" --max-memory-restart 500M -- start

# Optimize database queries
# Review database migrations and indexes
npx prisma studio

# Clear PM2 logs (they can accumulate)
pm2 flush
```

---

## 12. SSH Connection Issues

### Problem
Can't connect to GoDaddy server via SSH

### Solutions
```powershell
# From Windows PowerShell:

# Check connectivity
Test-NetConnection -ComputerName your-server-ip -Port 22

# Try SSH with verbose output
ssh -vvv username@your-server-ip

# If key authentication fails, use password
ssh -o PubkeyAuthentication=no username@your-server-ip

# On Windows, use PuTTY or MobaXterm as GUI alternative
```

---

## 13. Slow Website / Performance Issues

### Problem
Website loads slowly

### Solutions
```bash
# Check server resources
top -b -n 1 | head -20

# Check if app is CPU-bound
pm2 monit

# Check Nginx cache headers
curl -I https://yourdomain.com | grep -i cache

# Enable gzip compression in Nginx
# Add to /etc/nginx/sites-available/exphouz:
# gzip on;
# gzip_types text/plain text/css application/json;

# Check database queries
npx prisma studio

# Optimize Next.js build
npm run build

# Restart services
pm2 restart exphouz
sudo systemctl restart nginx
```

---

## 14. Disk Space Full

### Problem
```
No space left on device
```

### Solutions
```bash
# Check disk usage
df -h

# Find large directories
du -sh /* | sort -rh | head -10

# Clean package manager cache
sudo apt clean
sudo apt autoclean

# Clean npm cache
npm cache clean --force

# Clean old PM2 logs
pm2 flush

# Clean old database backups (if applicable)
rm -rf /path/to/old/backups/*

# If /var/log is full
sudo journalctl --vacuum=100M
```

---

## 15. Git Pull Fails / Permission Denied

### Problem
```
Permission denied (publickey)
fatal: Could not read from remote repository
```

### Solutions
```bash
# Check SSH key exists
ls ~/.ssh/id_rsa

# If not, generate new SSH key
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa

# Add public key to GitHub/GitLab
cat ~/.ssh/id_rsa.pub
# Copy and add to your Git provider

# Test connection
ssh -T git@github.com

# Retry pull
git pull origin main
```

---

## Quick Debug Commands

```bash
# Everything at once
echo "=== System ===" && uname -a && \
echo "=== Node ===" && node -v && npm -v && \
echo "=== App Status ===" && pm2 status && \
echo "=== Recent Logs ===" && pm2 logs exphouz --lines 20 && \
echo "=== Database ===" && psql -U exphouz_user -d exphouz -c "SELECT NOW();" && \
echo "=== Nginx ===" && sudo nginx -t && \
echo "=== Disk ===" && df -h && \
echo "=== Memory ===" && free -h
```

---

## Getting Help

If you're stuck:

1. Check logs: `pm2 logs exphouz --lines 100`
2. Run diagnostics: Use the command above
3. Search error message on: Google, Stack Overflow, GitHub Issues
4. Check documentation: 
   - Next.js: https://nextjs.org/docs/
   - Prisma: https://www.prisma.io/docs/
   - PM2: https://pm2.keymetrics.io/docs/
5. Contact GoDaddy support if server issue

---

**Last Updated: January 31, 2026**
