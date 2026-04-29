# Mobile Survey App with Google Sheets Integration

A mobile-friendly Progressive Web App (PWA) for labor and employment mapping surveys with automatic Google Sheets data storage.

## Features

✅ **Mobile-Optimized** - Works on iOS and Android  
✅ **Offline Support** - Continue filling surveys without internet, auto-sync when online  
✅ **Google Sheets Integration** - Automatic data collection and storage  
✅ **Bot Protection** - Built-in honeypot field  
✅ **Responsive Design** - Beautiful UI on all screen sizes  
✅ **Service Worker** - Fast loading and offline capability  

## Setup Instructions

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Labor and Employment Survey"
3. Keep the first sheet as is (it will be auto-populated with headers)

### Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Tools** → **Script Editor**
2. Clear any existing code and copy the entire content from `google-apps-script.js`
3. Save the script with Ctrl+S
4. Click **Deploy** → **New Deployment**
   - Select **Type**: "Web app"
   - Select **Execute as**: Your Google account
   - Select **Who has access**: "Anyone"
5. Click **Deploy**
6. You'll see a "New deployment" dialog. Click the copy icon to copy the deployment URL
7. The URL will look like: `https://script.google.com/macros/s/DEPLOYMENT_ID/exec`

### Step 3: Update the Webhook URL

1. Open `script.js` in the project
2. Find the line: `const GOOGLE_SHEETS_WEBHOOK_URL = 'YOUR_WEBHOOK_URL_HERE';`
3. Replace `'YOUR_WEBHOOK_URL_HERE'` with your deployment URL from Step 2
4. Save the file

### Step 4: Deploy the Mobile App

#### Option A: Local Testing with Live Server
```bash
# Install live-server if you don't have it
npm install -g live-server

# Run from the project directory
live-server
```

#### Option B: Deploy to Web Hosting
- Upload all files to your hosting provider (Netlify, Vercel, GitHub Pages, etc.)
- The app will work as a PWA on mobile browsers

### Step 5: Access on Mobile

1. **iPhone/iPad**: Open Safari, go to your app URL → Click Share → Add to Home Screen
2. **Android**: Open Chrome, go to your app URL → Menu (three dots) → Add to Home Screen

## How It Works

### Data Collection Flow

```
User fills form
    ↓
Validates honeypot (bot protection)
    ↓
Generates household member entries
    ↓
Submits to Google Sheets via webhook
    ↓
Offline? Saves to device storage, syncs when online
    ↓
Shows success message
```

### Offline Mode

- When offline, survey data is saved to the device
- Once online, the app automatically syncs all pending submissions
- A visual indicator shows sync status

## Features

### Household Member Data
- Name, relationship, date of birth
- Automatic age calculation
- Youth status classification (ISY/OSY)
- Education details for In-School Youth
- Employment details for Out-of-School Youth
- Income and work status

### Barangay Selection
- Pre-populated list of barangays
- "Others" option with custom input
- Required field validation

### Mobile Optimizations
- Touch-friendly buttons and inputs
- Optimized font sizes
- Responsive grid layout
- Smooth scrolling and animations
- Full-screen support on home screen

## Troubleshooting

### "Failed to submit survey" error
- Check internet connection
- Verify the webhook URL is correct
- Ensure Google Apps Script deployment is set to "Anyone" access
- Check Google Sheet has the script attached

### Data not appearing in Google Sheet
- Verify the sheet is shared with your account
- Check that Apps Script execution permissions are correct
- Click "Deploy" again in Apps Script to refresh

### App not installing as PWA
- Ensure you're using HTTPS (or localhost for testing)
- Check manifest.json is accessible
- Try clearing browser cache

## File Structure

```
├── index.html              # Main HTML structure
├── script.js               # Form logic and submission
├── styles.css              # Mobile-optimized styles
├── sw.js                   # Service worker for offline
├── manifest.json           # PWA manifest
├── google-apps-script.js   # Google Sheets backend
└── server.js               # Optional Node.js server
```

## Security

- ✅ Honeypot field prevents bot submissions
- ✅ Input sanitization and escaping
- ✅ CORS-safe submission method
- ✅ No sensitive data stored locally
- ✅ Service Worker caches only static assets

## Browser Support

- Chrome/Edge 80+
- Safari 12.2+ (iOS 12.2+)
- Firefox 68+
- Samsung Internet 10+

## License

MIT License - feel free to use and modify
