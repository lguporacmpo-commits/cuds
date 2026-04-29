# 📱 Labor and Employment Mapping - Mobile Survey App

A modern, Progressive Web App (PWA) for collecting labor and employment survey data with automatic **Google Sheets** integration. Works on iOS, Android, and web browsers.

## ✨ Features

- ✅ **Mobile-First Design** - Optimized for iOS and Android
- ✅ **Google Sheets Integration** - Automatic data collection and storage
- ✅ **Offline Support** - Continue filling surveys without internet
- ✅ **Auto-Sync** - Automatically uploads queued data when online
- ✅ **PWA** - Install as a home screen app
- ✅ **Dark Mode** - Automatically adapts to system preferences
- ✅ **Bot Protection** - Built-in honeypot field
- ✅ **Responsive Design** - Beautiful UI on all devices
- ✅ **Fast Loading** - Service worker caching for instant load

## 🚀 Quick Start

### Option 1: Google Sheets (Recommended)

**Best for**: Cloud storage, easy data access, collaborative viewing

1. **Create Google Sheet**
   - Go to [sheets.google.com](https://sheets.google.com)
   - Create new spreadsheet
   
2. **Deploy Apps Script**
   - In Google Sheet: Tools → Script Editor
   - Copy code from `google-apps-script.js`
   - Deploy as Web App → "Anyone" access
   - Copy deployment URL

3. **Update Webhook URL**
   - Open `script.js`
   - Replace `YOUR_WEBHOOK_URL_HERE` with your deployment URL

4. **Deploy App**
   - Use Netlify, Vercel, or GitHub Pages
   - Or run locally with `npx live-server`

**→ See [QUICK_START.md](QUICK_START.md) for detailed steps**

### Option 2: Local Node Server

**Best for**: Self-hosted, on-premises deployment

```bash
# Start the result server
node server.js

# Server runs on http://localhost:3000
# Results saved to results/BARANGAY_NAME/
```

Update webhook URL in `script.js`:
```javascript
const GOOGLE_SHEETS_WEBHOOK_URL = 'http://localhost:3000/submit';
```

---

## 📋 Setup Instructions

### 1. Configure the Webhook URL
Edit `script.js` and replace the placeholder:
```javascript
const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```

### 2. Run Locally
```bash
# Using Python
python -m http.server 8000

# OR using Node
npx live-server

# Then open http://localhost:8000
```

### 3. Deploy to Production
- **Netlify**: Connect GitHub → Auto-deploy
- **Vercel**: Import project → Deploy
- **GitHub Pages**: Enable from settings
- **Traditional Hosting**: Upload files via FTP/SFTP

### 4. Install as Mobile App
**iPhone/iPad (Safari)**:
1. Open Safari and navigate to your app URL
2. Tap Share → Add to Home Screen
3. Name it "Labor Survey" or similar

**Android (Chrome)**:
1. Open Chrome and navigate to your app URL
2. Tap Menu (⋮) → Install app
3. Confirm installation

---

## 📊 Data Collection

### Survey Sections
1. **Location**: Province, City, Barangay, Address
2. **Respondent Info**: Name, Contact, Household Head
3. **Household Members** (Configurable count)
   - Demographics: Name, Age, Sex, Relationship
   - Education (if aged 10-19): School level, type, location
   - Employment (if aged 10-19): Occupation, income, work status
   - Barangay Registration

### Data Structure
Each row in Google Sheet contains:
- Survey metadata (timestamp, location, respondent)
- One household member record (multiple rows per survey)
- All education/employment details relevant to the member

---

## 🔄 Offline Functionality

The app automatically handles offline scenarios:

1. **Offline**: User fills survey → Data saved to device
2. **Online**: App detects connection → Auto-syncs all queued data
3. **No manual retry needed** - Fully automatic

Check browser console for sync status:
```javascript
// View queued submissions
JSON.parse(localStorage.getItem('surveyQueue'))

// Clear queue (admin)
clearSubmissionQueue()
```

---

## 🎨 Mobile Optimizations

✓ Touch-friendly buttons and inputs
✓ Font size 16px prevents iOS zoom
✓ Safe area insets for notch devices
✓ Optimized for both portrait and landscape
✓ Dark mode support
✓ Smooth animations (respects prefers-reduced-motion)

---

## 📁 File Structure

```
├── index.html                 # Main app interface
├── script.js                  # Form logic + Google Sheets submission
├── styles.css                 # Mobile-responsive design
├── manifest.json              # PWA configuration
├── sw.js                      # Service worker (offline cache)
├── server.js                  # Optional Node.js backend
├── google-apps-script.js      # Google Sheets backend code
├── QUICK_START.md             # 5-minute setup guide
└── SETUP_GUIDE.md             # Detailed documentation
```

---

## 🔐 Security

- ✅ **Honeypot Bot Protection**: Hidden field catches automated submissions
- ✅ **Input Sanitization**: HTML escaping prevents XSS
- ✅ **CORS Safe**: No sensitive data exposed
- ✅ **No API Keys**: Uses Google Apps Script deployments
- ✅ **Offline Cache**: Only caches static assets

---

## 🌐 Browser Support

| Browser | Support | Version |
|---------|---------|---------|
| Chrome | ✅ PWA | 80+ |
| Safari | ✅ PWA | 12.2+ |
| Firefox | ✅ PWA | 68+ |
| Edge | ✅ PWA | 80+ |
| Samsung Internet | ✅ PWA | 10+ |

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to submit" | Check webhook URL in script.js |
| Data not in Google Sheet | Verify Apps Script deployment is "Anyone" access |
| App won't install | Ensure you're using HTTPS (not HTTP) |
| Offline data not syncing | Check browser console (F12) for errors |
| No data appearing | Verify Google Sheet permissions allow the script |

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed troubleshooting.

---

## 📞 Support

**Need help?**
1. Read [QUICK_START.md](QUICK_START.md) for common questions
2. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
3. Review `google-apps-script.js` comments
4. Check browser console (F12) for error messages

---

## 📝 License

MIT License - Feel free to use and modify for your needs.

---

## 🎯 Next Steps

1. **Follow [QUICK_START.md](QUICK_START.md)** for 5-minute setup
2. **Deploy** to Netlify, Vercel, or GitHub Pages
3. **Install** as mobile app on your phone
4. **Test** with sample survey data
5. **Share** the URL with respondents

Happy surveying! 🎉

### Option 1: GitHub Pages (Recommended - Free)
1. Create a GitHub account at https://github.com
2. Create a new repository (e.g., `labor-survey-app`)
3. Upload all files from this folder to the repository
4. Go to repository Settings > Pages
5. Under "Source", select "Deploy from a branch"
6. Select "main" branch and "/ (root)" folder
7. Click Save - your site will be live at `https://yourusername.github.io/labor-survey-app`

### Option 2: Netlify (Free)
1. Go to https://netlify.com
2. Sign up for a free account
3. Drag and drop all files from this folder onto the Netlify dashboard
4. Your site will be live instantly with a random URL
5. You can customize the URL in site settings

### Option 3: Vercel (Free)
1. Go to https://vercel.com
2. Sign up for a free account
3. Click "Import Project"
4. Upload all files from this folder
5. Your site will be deployed automatically

### Option 4: Firebase Hosting (Free tier)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## Google Sheets integration
This app can send survey data to a Google Sheet through a secure webhook endpoint.

1. Create a Google Apps Script web app or backend endpoint to receive JSON data.
2. Set `GOOGLE_SHEETS_WEBHOOK_URL` in `script.js` to the deployed endpoint URL.
3. Do not store Google account credentials in client-side code. Use a server-side integration or Apps Script deployment instead.

## Project files
- `index.html`
- `styles.css`
- `script.js`
- `.github/copilot-instructions.md`
