# Vercel Deployment - Quick Checklist

## ✅ Before You Start

### Have These Ready:
- [ ] GitHub account (free at github.com)
- [ ] Vercel account (free at vercel.com)
- [ ] `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- [ ] `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, etc.
- [ ] `SMTP_PASSWORD` (Gmail)
- [ ] `DATABASE_URL` (PostgreSQL connection string)
- [ ] `NEXTAUTH_SECRET` (generated)

---

## 🎬 Deployment Steps

### Step 1: Push to GitHub
```bash
cd C:\Users\sanja\Downloads\Exphouz\Exphouz
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/exphouz.git
git branch -M main
git push -u origin main
```
**Time:** 2 minutes
**Status:** ⏳

### Step 2: Sign Up for Vercel
- Go to: https://vercel.com
- Click "Sign Up"
- Choose "GitHub"
- Authorize
**Time:** 2 minutes
**Status:** ⏳

### Step 3: Create Project
- Dashboard → "New Project"
- Select "exphouz" repository
- Click "Import"
**Time:** 1 minute
**Status:** ⏳

### Step 4: Configure Project
- Framework: Next.js (auto-detect)
- Root Directory: (leave blank)
- Environment Variables: Add all your variables
**Time:** 5 minutes
**Status:** ⏳

### Step 5: Deploy
- Click "Deploy"
- Wait 2-3 minutes
- See "Deployment Successful"
**Time:** 3 minutes
**Status:** ⏳

---

## 📋 Environment Variables to Add

Copy and paste each one into Vercel:

```
DATABASE_URL=postgresql://user:password@host:port/db
NEXTAUTH_URL=https://exphouz-xxxxx.vercel.app
NEXTAUTH_SECRET=your-generated-secret
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/xxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxx
```

---

## ✨ After Deployment

### Your App is Live at:
```
https://exphouz-yourname.vercel.app
```

### Test These:
- [ ] App loads without errors
- [ ] Can create account
- [ ] Google login works
- [ ] Can upload profile picture
- [ ] Receive password reset email
- [ ] Check HTTPS is working

### Optional: Add Custom Domain
- [ ] Connect GoDaddy domain
- [ ] Update DNS records
- [ ] Wait 24-48 hours
- [ ] Visit: https://yourdomain.com

---

## 🔄 Future Updates

Every time you make changes:

```bash
git add .
git commit -m "Your message"
git push origin main
```

Vercel automatically redeploys! ✨

---

## 🆘 If Something Goes Wrong

### Check Deployment Logs
1. Go to Vercel dashboard
2. Click current deployment
3. Click "Function Logs"
4. See error messages

### Common Issues

**Build failed?**
- Check DATABASE_URL is correct
- Check all environment variables are set
- See logs for specific error

**Database connection error?**
- Test DATABASE_URL locally
- Make sure it's PostgreSQL
- Check host/port/username/password

**App works but missing features?**
- Check all environment variables
- Restart deployment
- Check Vercel logs

---

## 📞 Get Help

- **Error in logs**: Google the error message
- **Database issues**: Check PostgreSQL provider
- **Vercel issues**: https://vercel.com/support
- **Next.js issues**: https://nextjs.org/docs

---

## 🎉 Success Checklist

- [ ] App deployed to Vercel
- [ ] All features working
- [ ] No errors in logs
- [ ] Custom domain connected (optional)
- [ ] Database connected
- [ ] Email sending works
- [ ] Image uploads work
- [ ] Google login works

---

## ⏱️ Total Time

| Step | Time |
|------|------|
| Push to GitHub | 2 min |
| Sign up Vercel | 2 min |
| Create project | 1 min |
| Add environment vars | 5 min |
| Deploy | 3 min |
| **TOTAL** | **13 minutes** ⚡ |

Plus 24-48 hours if adding custom domain

---

## 💡 Pro Tips

1. **Keep costs down**: Use free tiers for everything initially
2. **Monitor regularly**: Check Vercel logs weekly
3. **Update often**: Deploy early and often
4. **Backup database**: Set up daily backups
5. **Test before push**: Test locally first

---

## 🚀 Ready?

1. Gather your environment variables
2. Follow the 5 steps above
3. Your app is live!

**Questions?** See `VERCEL_DEPLOYMENT_GUIDE.md`
