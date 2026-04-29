# Quick Start - Mobile App Deployment

Follow these steps to deploy your survey app and connect it to Google Sheets.

## 5-Minute Setup

### 1. Create Google Sheet (2 min)
```
1. Open https://sheets.google.com
2. Click "+ New" → Spreadsheet
3. Name it "Labor and Employment Survey"
4. Keep sheet name as "Sheet1"
```

### 2. Create Google Apps Script (2 min)
```
1. In Google Sheet, click Tools → Script Editor
2. Delete all existing code
3. Copy and paste ALL code from google-apps-script.js (in this project)
4. Press Ctrl+S to save
```

### 3. Deploy & Get URL (1 min)
```
1. Click "Deploy" button → New Deployment
2. Select Type: "Web app"
3. Execute as: Your account
4. Who has access: "Anyone"
5. Click "Deploy"
6. Copy the deployment URL (looks like: https://script.google.com/macros/s/ABC123/exec)
```

### 4. Update Webhook URL (<1 min)
```
1. Open script.js in this project
2. Find line: const GOOGLE_SHEETS_WEBHOOK_URL = 'YOUR_WEBHOOK_URL_HERE';
3. Replace YOUR_WEBHOOK_URL_HERE with your copied URL
4. Save the file
```

### 5. Test Locally
```bash
npx live-server
# Then open http://localhost:8080 in your browser
```

---

## Deploy to Production

### Option A: Netlify (Recommended)
```bash
1. Create account at netlify.com
2. Click "New site from Git" or drag-and-drop folder
3. Deploy automatically
4. Your app gets a public URL
```

### Option B: Vercel
```bash
1. Create account at vercel.com
2. Import this repository
3. Click Deploy
4. Get your production URL
```

### Option C: GitHub Pages
```bash
1. Push to GitHub
2. Go to Settings → Pages
3. Select "main" branch as source
4. Your site is live at username.github.io/repo-name
```

---

## Access on Mobile

### iPhone/iPad (Safari)
```
1. Open Safari
2. Navigate to your app URL
3. Tap Share button
4. Tap "Add to Home Screen"
5. Name it "Survey" or similar
6. Tap "Add"
```

### Android (Chrome)
```
1. Open Chrome
2. Navigate to your app URL
3. Tap Menu (three dots)
4. Tap "Install app" or "Add to Home Screen"
5. Tap "Install"
```

---

## Verify It Works

1. **Test Survey**: Fill out a test survey on mobile
2. **Check Google Sheet**: Go to your Google Sheet
3. **See Data**: Data should appear as new rows
4. **Test Offline**: Turn off WiFi, fill another survey, turn WiFi back on
5. **Check Sync**: Data should sync automatically

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Failed to submit" error | Check webhook URL in script.js |
| Data not in Google Sheet | Verify Apps Script deployment is "Anyone" |
| App doesn't install | Use HTTPS (not HTTP) |
| Offline data not syncing | Check browser console for errors |

---

## File Checklist

- ✅ `index.html` - Main app
- ✅ `script.js` - Updated with YOUR webhook URL
- ✅ `styles.css` - Mobile optimized
- ✅ `manifest.json` - PWA config
- ✅ `sw.js` - Service worker
- ✅ `google-apps-script.js` - Backend (for reference)

---

## Support

If you need help:
1. Check the SETUP_GUIDE.md file for detailed instructions
2. Review the google-apps-script.js comments
3. Check browser console (F12) for error messages
4. Verify Google Sheet permissions

Enjoy your mobile survey app! 🎉
