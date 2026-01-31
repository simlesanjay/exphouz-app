# GoDaddy Deployment - Step-by-Step Visual Guide

## 📍 You Are Here: Ready to Deploy

```
┌─────────────────────────────────────────────────────────┐
│  YOUR EXPHOUZ APP DEPLOYMENT PROCESS                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ✅ Step 0: Preparation (You have all guides now)     │
│  ⏭️  Step 1: Get External Credentials                 │
│  ⏭️  Step 2: Set up GoDaddy Server                    │
│  ⏭️  Step 3: Upload & Configure Your App             │
│  ⏭️  Step 4: Launch Your App                          │
│  ⏭️  Step 5: Configure Domain & SSL                  │
│  ⏭️  Step 6: Go Live!                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Step 1️⃣  Get External Credentials (30-45 minutes)

### 1A: Google OAuth
**Why?** Enable users to log in with their Google account

**Steps:**
1. Go to: https://console.cloud.google.com
2. Create a new project
3. Search for "Google+ API" and enable it
4. Go to "Credentials" → Create OAuth 2.0 credentials
5. Select "Web application"
6. Add these URIs to "Authorized redirect URIs":
   ```
   https://yourdomain.com
   https://yourdomain.com/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
7. Copy and save:
   - `Client ID` → `GOOGLE_CLIENT_ID`
   - `Client Secret` → `GOOGLE_CLIENT_SECRET`

### 1B: ImageKit
**Why?** Store and serve user-uploaded images

**QUICKEST WAY - Use Direct Link:**
1. Go directly to: https://imagekit.io/dashboard/developer/api-keys
2. You'll see your three API keys immediately:
   - **Public Key** → Copy to `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
   - **Private Key** → Copy to `IMAGEKIT_PRIVATE_KEY`
   - **URL Endpoint** → Copy to `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`

**If direct link doesn't work:**
1. Go to: https://imagekit.io
2. Sign up/Login to your account
3. In the **left sidebar**, look for "**Developers**" section
4. Click "**API Keys**" (NOT "Settings" → "Images")
5. You'll see the three keys - copy each one

**IMPORTANT:**
- Don't go to Settings → Images (that's the wrong page)
- Always go to "Developers" → "API Keys" section
- Public Key starts with: `public_`
- Private Key starts with: `private_`
- URL Endpoint looks like: `https://ik.imagekit.io/your_account_id`

### 1C: Gmail App Password
**Why?** Send password reset and notification emails

**Steps:**
1. Enable 2-Factor Authentication on your Gmail account (if not already enabled)
2. Go to: https://myaccount.google.com/apppasswords
   - **Direct link** - opens straight to App Passwords page
3. If you see dropdowns at the top:
   - Select "Mail" from first dropdown
   - Select "Windows Computer" (or your device type) from second dropdown
   - Click "Generate"
4. If you don't see dropdowns:
   - Just click the "Generate app password" button
   - Or you might see "Create app password"
5. Google will show a 16-character password:
   ```
   xxxx xxxx xxxx xxxx
   ```
6. Copy this password → Save as `SMTP_PASSWORD`
7. Set these values:
   - `SMTP_USER` = your email (e.g., your-email@gmail.com)
   - `SMTP_HOST` = smtp.gmail.com
   - `SMTP_PORT` = 587

**If the page looks different:**
- Make sure you're logged in to Gmail
- 2-Factor Authentication must be enabled first
- Try: https://myaccount.google.com/apppasswords (direct link)
- If still not working, you may need to set up App Password differently for your Google account

### 1D: Generate NEXTAUTH_SECRET
**Why?** Secure encryption key for authentication

**Steps:**
```powershell
# In Windows PowerShell, run:
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```
Or use: https://generate-secret.vercel.app/

**Save this value as `NEXTAUTH_SECRET`**

---

## Step 2️⃣  Set Up GoDaddy Server (30 minutes)

### 2A: Connect to Server
```bash
# Open PuTTY or terminal and SSH:
ssh username@your-godaddy-ip

# You'll be prompted for password
# Enter the SSH password from GoDaddy
```

### 2B: Update System
```bash
sudo apt update
sudo apt upgrade -y
```

### 2C: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # Verify (should show v20+)
npm -v   # Verify
```

### 2D: Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql

# In the psql shell, paste:
CREATE DATABASE exphouz;
CREATE USER exphouz_user WITH PASSWORD 'ChooseAStrongPassword123!';
ALTER ROLE exphouz_user SET client_encoding TO 'utf8';
ALTER ROLE exphouz_user SET default_transaction_isolation TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE exphouz TO exphouz_user;
\q
```

### 2E: Install Other Tools
```bash
sudo apt install -y git nginx

# Install PM2 (app manager)
sudo npm install -g pm2
```

---

## Step 3️⃣  Upload & Configure Your App (20 minutes)

### 3A: Upload Project to Server

**Option 1: Using Git (Recommended)**
```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/exphouz.git
cd exphouz
```

**Option 2: Using SFTP**
- Use FileZilla or WinSCP to upload `c:\Users\sanja\Downloads\Exphouz\Exphouz` to `/var/www/exphouz`

### 3B: Create .env File
```bash
cd /var/www/exphouz
sudo nano .env
```

Paste this (with YOUR actual values):
```
DATABASE_URL="postgresql://exphouz_user:ChooseAStrongPassword123!@localhost:5432/exphouz"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-generated-secret-from-step-1D"
GOOGLE_CLIENT_ID="from-step-1A"
GOOGLE_CLIENT_SECRET="from-step-1A"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="from-step-1C"
SMTP_FROM_EMAIL="Exphouz <no-reply@exphouz.com>"
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="from-step-1B"
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="from-step-1B"
IMAGEKIT_PRIVATE_KEY="from-step-1B"
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

### 3C: Install Dependencies
```bash
cd /var/www/exphouz
npm install
```

### 3D: Run Database Setup
```bash
npx prisma migrate deploy
```

### 3E: Build for Production
```bash
npm run build
```

---

## Step 4️⃣  Launch Your App (10 minutes)

### 4A: Start with PM2
```bash
cd /var/www/exphouz
pm2 start npm --name "exphouz" -- start
pm2 startup
pm2 save

# Verify it's running
pm2 status
pm2 logs exphouz  # View logs (Ctrl+C to exit)
```

### 4B: Test Locally on Server
```bash
curl http://localhost:3000
# You should see HTML content (no error)
```

---

## Step 5️⃣  Configure Web Server & SSL (20 minutes)

### 5A: Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/exphouz
```

Paste (replace `yourdomain.com`):
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

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

### 5B: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/exphouz /etc/nginx/sites-enabled/
sudo nginx -t  # Test (should say OK)
sudo systemctl restart nginx
```

### 5C: Set Up SSL Certificate
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Follow the prompts, choose "Redirect HTTP to HTTPS"
```

---

## Step 6️⃣  Point Domain to Your Server (24-48 hours)

### 6A: Update GoDaddy DNS
1. Log in to GoDaddy Account
2. Go to "My Products" → Select your domain
3. Click "Manage DNS"
4. Find the "A" record pointing to your old host
5. Click Edit:
   - Change "Points to" to your GoDaddy server IP
   - Delete any www CNAME records
6. Click Save
7. **Wait 24-48 hours for DNS to propagate**

### 6B: Verify DNS (Optional)
```bash
# Check if DNS updated (on your local machine)
nslookup yourdomain.com
# Should show your server IP
```

### 6C: Test Your Site
After DNS propagates:
1. Open browser
2. Visit: `https://yourdomain.com`
3. You should see your Exphouz app!

---

## 🎉 You're Done!

```
┌──────────────────────────────────────────────┐
│  ✅ YOUR APP IS NOW LIVE!                   │
├──────────────────────────────────────────────┤
│                                              │
│  🌐 Visit: https://yourdomain.com           │
│  📧 Send yourself a test email              │
│  🔐 Test Google login                       │
│  📱 Test on mobile                          │
│                                              │
│  💡 Keep an eye on logs:                    │
│     pm2 logs exphouz                        │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 📋 Post-Deployment Tasks

- [ ] Test all features thoroughly
- [ ] Monitor logs for errors: `pm2 logs exphouz`
- [ ] Set up automated backups of database
- [ ] Set up monitoring alerts
- [ ] Document admin credentials
- [ ] Test on different browsers/devices

---

## 🆘 Troubleshooting

If something goes wrong, check:

1. **App won't start?**
   ```bash
   pm2 logs exphouz --lines 50
   ```

2. **Can't access domain?**
   ```bash
   nslookup yourdomain.com
   # Check DNS propagated
   ```

3. **Email not sending?**
   ```bash
   pm2 logs exphouz | grep -i email
   ```

4. **More help?**
   Read `TROUBLESHOOTING_GUIDE.md`

---

## 🔄 How to Update Your App

After deployment, to push updates:

```bash
# On your local machine
git add .
git commit -m "Your update message"
git push origin main

# On GoDaddy server
cd /var/www/exphouz
git pull origin main
npm install
npm run build
pm2 restart exphouz
```

---

## 📚 Quick Reference

| Command | Purpose |
|---------|---------|
| `pm2 status` | Check if app running |
| `pm2 logs exphouz` | View app logs |
| `pm2 restart exphouz` | Restart app |
| `sudo systemctl restart nginx` | Restart web server |
| `sudo certbot renew --dry-run` | Test SSL renewal |
| `df -h` | Check disk space |
| `free -h` | Check memory |

---

**Estimated Total Time: 1-2 days** (mostly DNS propagation)

Good luck! 🚀
