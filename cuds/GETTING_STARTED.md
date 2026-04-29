# 🎯 Getting Started - Start Here!

Welcome! Your Labor and Employment Mapping survey app is ready to deploy. Here's what to do next.

---

## ⚡ 5-Minute Quick Start

### Step 1: Create Google Sheet (2 min)
```
1. Open https://sheets.google.com
2. Click "+ New" → Spreadsheet
3. Name it "Labor and Employment Survey"
```

### Step 2: Deploy Google Apps Script (2 min)
```
1. In Google Sheet: Tools → Script Editor
2. Copy ALL code from google-apps-script.js file
3. Press Ctrl+S
4. Click "Deploy" → New Deployment
5. Select: Web app, Execute as: Your account, Anyone access
6. Click Deploy and copy the URL
```

### Step 3: Update Webhook URL (1 min)
```
1. Open script.js in this folder
2. Find line 8: const GOOGLE_SHEETS_WEBHOOK_URL = 'YOUR_WEBHOOK_URL_HERE';
3. Replace 'YOUR_WEBHOOK_URL_HERE' with your copied URL
4. Save
```

### Done! 🎉
- Test locally: `npx live-server`
- Deploy: Use Netlify, Vercel, or GitHub Pages
- Install on phone: Follow instructions in QUICK_START.md

---

## 📚 Documentation

| Document | Time | Purpose |
|----------|------|---------|
| **QUICK_START.md** | 5 min | Fast setup guide |
| **SETUP_GUIDE.md** | 15 min | Detailed instructions |
| **DEPLOYMENT_CHECKLIST.md** | 10 min | Verification steps |
| **DEVELOPER_GUIDE.md** | 30 min | Customization help |
| **INDEX.md** | - | Navigation guide |

---

## 🚀 Next Steps

1. **Follow QUICK_START.md** for complete setup
2. **Test locally** with `npx live-server`
3. **Deploy** to Netlify/Vercel/GitHub Pages
4. **Install** as app on your phone
5. **Share** with survey respondents

---

## ❓ Common Questions

**Q: Where do I put the webhook URL?**
A: In `script.js`, line 8, replace `'YOUR_WEBHOOK_URL_HERE'`

**Q: How do I test offline?**
A: Fill survey → Turn off WiFi → Click submit → Turn WiFi back on

**Q: How do I deploy to production?**
A: See DEPLOYMENT_CHECKLIST.md or QUICK_START.md

**Q: Can I customize this?**
A: Yes! See DEVELOPER_GUIDE.md

**Q: Is it secure?**
A: Yes, with bot protection, input sanitization, and HTTPS support

---

## 📱 What's Included

✅ Mobile PWA (install as app)
✅ Google Sheets integration
✅ Offline support
✅ Auto-sync
✅ Dark mode
✅ Responsive design
✅ Bot protection
✅ Complete documentation

---

## 🎯 Your Next Action

**→ Open and read [QUICK_START.md](QUICK_START.md) right now!**

It will guide you through the complete setup in 5 minutes.

---

**Questions?** Check INDEX.md for documentation navigation.
