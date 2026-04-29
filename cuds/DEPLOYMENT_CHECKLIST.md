# Deployment Checklist

Use this checklist to ensure your mobile survey app is properly configured and deployed.

## Pre-Deployment

- [ ] You have chosen a backend (Google Sheets or Local Server)
- [ ] You understand the difference between the two backends
- [ ] You have Google account (for Google Sheets option)
- [ ] You have Node.js installed (for Local Server option)

## Backend Configuration

### Google Sheets Setup
- [ ] Created a new Google Sheet named "Labor and Employment Survey"
- [ ] Created Google Apps Script from the sheet
- [ ] Pasted code from `google-apps-script.js` into Apps Script editor
- [ ] Deployed as Web App with "Anyone" access
- [ ] Copied the deployment URL (format: https://script.google.com/macros/s/...)
- [ ] Updated webhook URL in `script.js` (line with GOOGLE_SHEETS_WEBHOOK_URL)
- [ ] Verified Google Sheet shows headers after first test submission

### Local Server Setup (Alternative)
- [ ] Verified Node.js is installed (`node --version`)
- [ ] Tested that `npm` is working (`npm --version`)
- [ ] Set webhook URL in `script.js` to `http://localhost:3000/submit`
- [ ] Verified `server.js` runs without errors (`node server.js`)
- [ ] Checked that `results/` folder is created

## Local Testing

- [ ] Opened app in browser (`http://localhost:8000`)
- [ ] Filled out test survey form completely
- [ ] Clicked "Generate household member entries"
- [ ] Added at least one household member
- [ ] Submitted the survey
- [ ] Saw "Survey Submitted Successfully" message
- [ ] Verified data appears in Google Sheet OR `results/` folder

### Offline Testing
- [ ] Turned off WiFi/internet
- [ ] Filled out another survey
- [ ] Submission was queued (check console for "queued" message)
- [ ] Turned WiFi back on
- [ ] Waited for auto-sync (check console for "Successfully synced")
- [ ] Verified synced data appears in backend

## Mobile Testing

### iPhone/iPad Testing
- [ ] Opened Safari on iOS device
- [ ] Navigated to `http://localhost:8000` (on same network)
- [ ] OR navigated to your deployed URL
- [ ] Form displays correctly on screen
- [ ] Can fill and submit survey
- [ ] Tapped Share → "Add to Home Screen"
- [ ] Named app appropriately
- [ ] App installed on home screen
- [ ] Launched app from home screen
- [ ] App runs in standalone mode (no browser bar)

### Android Testing
- [ ] Opened Chrome on Android device
- [ ] Navigated to your app URL
- [ ] Form displays correctly
- [ ] Can fill and submit survey
- [ ] Tapped Menu (⋮) → "Install app"
- [ ] Confirmed installation
- [ ] App installed on home screen
- [ ] Launched app from home screen
- [ ] App runs in standalone mode

## Responsive Design

- [ ] App looks good on phone (portrait)
- [ ] App looks good on phone (landscape)
- [ ] App looks good on tablet
- [ ] App looks good on desktop
- [ ] Text is readable (no zooming needed)
- [ ] Buttons are easy to tap on mobile
- [ ] Form fields expand/collapse properly

## Production Deployment

### Netlify
- [ ] Connected GitHub repository to Netlify
- [ ] Updated webhook URL to production URL
- [ ] Built successfully without errors
- [ ] Deployed to production
- [ ] Tested production URL on mobile
- [ ] Submitted test survey from production
- [ ] Data appears in backend

### Vercel
- [ ] Imported project into Vercel
- [ ] Updated webhook URL to production URL
- [ ] Deployment completed successfully
- [ ] Tested production URL on mobile
- [ ] Submitted test survey from production
- [ ] Data appears in backend

### GitHub Pages
- [ ] Pushed all files to GitHub
- [ ] Enabled GitHub Pages in repository settings
- [ ] Updated webhook URL for production
- [ ] Site built and published successfully
- [ ] Tested production URL on mobile
- [ ] Submitted test survey from production
- [ ] Data appears in backend

### Traditional Hosting
- [ ] Uploaded all files to web hosting
- [ ] Updated webhook URL for production
- [ ] Verified all files are accessible
- [ ] Tested production URL on mobile
- [ ] Submitted test survey from production
- [ ] Data appears in backend

## Performance

- [ ] App loads in under 3 seconds
- [ ] Submit button responds quickly
- [ ] No console errors (F12 → Console)
- [ ] Service worker cached assets (check Network tab)
- [ ] Offline mode works as expected

## Security

- [ ] No API keys visible in source code
- [ ] Honeypot field is hidden (not visible to users)
- [ ] No sensitive data in localStorage (check DevTools)
- [ ] HTTPS is used for production (not HTTP)
- [ ] Google Apps Script deployment is not publicly editable

## Documentation

- [ ] QUICK_START.md is accurate for your setup
- [ ] SETUP_GUIDE.md has correct instructions
- [ ] README.md reflects your configuration
- [ ] Webhook URL is documented (without actual URL in source)
- [ ] Support contact information is provided

## Final Checks

- [ ] All files are uploaded/deployed
- [ ] No broken links in documentation
- [ ] Test data has been cleaned up from backend
- [ ] Backup of Google Sheet created (if using Sheets)
- [ ] Backup of code repository created
- [ ] Team members have deployment instructions
- [ ] You have tested on actual target devices (iOS/Android)

## Going Live

- [ ] Created short URL for sharing (bit.ly, tinyurl, etc.) if needed
- [ ] Shared app link with intended users
- [ ] Collected first real submissions
- [ ] Monitored for errors in first 24 hours
- [ ] Verified data quality from real users
- [ ] Set up regular backup process for data

## Ongoing Maintenance

- [ ] Monitor backend for data accumulation
- [ ] Archive old data periodically
- [ ] Update Google Sheets pivot tables/reports if needed
- [ ] Keep app cached assets fresh (versioning in sw.js)
- [ ] Monitor for browser compatibility issues
- [ ] Collect user feedback and iterate

---

## Troubleshooting During Deployment

If you encounter issues, check:

1. **Webhook URL not configured?**
   - Open `script.js` and search for `GOOGLE_SHEETS_WEBHOOK_URL`
   - Ensure it's not set to `'YOUR_WEBHOOK_URL_HERE'`

2. **Data not appearing?**
   - Check Google Sheet has the correct permissions
   - Verify Apps Script deployment is set to "Anyone"
   - Check browser console (F12) for error messages

3. **App won't install on mobile?**
   - Ensure you're using HTTPS (not HTTP)
   - localhost will work for testing with local network access
   - Check manifest.json is accessible

4. **Offline sync not working?**
   - Open browser DevTools → Application → LocalStorage
   - Check if `surveyQueue` exists and has data
   - Try going online and waiting 30 seconds

See SETUP_GUIDE.md for more help!
