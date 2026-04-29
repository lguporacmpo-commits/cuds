# Developer Guide

This guide is for developers who want to customize or extend the Labor and Employment Mapping survey app.

## Project Structure

```
├── index.html                 # HTML structure
├── script.js                  # Main application logic (580+ lines)
├── styles.css                 # Responsive CSS (300+ lines)
├── manifest.json              # PWA configuration
├── sw.js                      # Service Worker (offline support)
├── server.js                  # Optional Node.js backend
├── google-apps-script.js      # Google Apps Script backend
├── config.js                  # Configuration file
├── icon.svg                   # PWA icon (512x512)
└── [Documentation]
    ├── README.md              # Main documentation
    ├── QUICK_START.md         # Quick setup guide
    ├── SETUP_GUIDE.md         # Detailed setup
    └── DEPLOYMENT_CHECKLIST.md
```

## Key Technologies

- **HTML5** - Semantic markup
- **Vanilla JavaScript** - No frameworks, lightweight
- **CSS3** - Mobile-first responsive design
- **PWA** - Progressive Web App standards
- **Service Workers** - Offline support and caching
- **Fetch API** - HTTP requests with no-cors mode
- **LocalStorage** - Offline queue persistence
- **Google Apps Script** - Serverless backend

## Common Customizations

### 1. Change Survey Questions

Edit the `createMemberFieldset()` function in `script.js`:

```javascript
function createMemberFieldset(index, maxDate) {
    const fieldset = document.createElement('fieldset');
    // Add your custom questions here
    fieldset.innerHTML = `
        <legend>Member ${index}</legend>
        <!-- Your custom fields -->
    `;
    return fieldset;
}
```

### 2. Add New Form Fields

Add fields to `index.html`:

```html
<label for="new-field">New Field</label>
<input type="text" id="new-field" name="newField" placeholder="..." required />
```

Then update data collection in the submit handler:

```javascript
const surveyValues = {
    // ... existing fields ...
    newField: formData.get('newField') || '',
};
```

### 3. Customize Colors

Edit `styles.css` CSS variables:

```css
:root {
  --primary-color: #2563eb;
  --primary-dark: #1d4ed8;
  --success-color: #10b981;
  /* ... */
}
```

### 4. Change Barangay List

Update the select options in `createMemberFieldset()`:

```javascript
<select name="registeredBarangay[]">
    <option value="NEW_BARANGAY_1">NEW BARANGAY 1</option>
    <option value="NEW_BARANGAY_2">NEW BARANGAY 2</option>
    <!-- Add more options -->
</select>
```

Also update the list in `server.js` if using local server:

```javascript
const BARANGAYS = new Set([
  'NEW_BARANGAY_1', 'NEW_BARANGAY_2', // ... etc
]);
```

### 5. Add Analytics

Add Google Analytics or similar:

```javascript
// In index.html, before closing </body>
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_ID');
</script>
```

### 6. Customize Error Messages

Edit error messages in `script.js`:

```javascript
// Original:
alert('Please fill out all required fields.');

// Customize to:
alert('Por favor, complete todos los campos requeridos.');
```

### 7. Add Email Notifications

Extend Google Apps Script to send emails:

```javascript
function sendNotification(email, data) {
  GmailApp.sendEmail(email, 'New Survey Submission', JSON.stringify(data));
}
```

## Advanced Customizations

### Change Submission Endpoint

Modify `submitToGoogleSheet()` function:

```javascript
async function submitToGoogleSheet(surveyValues, members, url) {
    // Your custom implementation
    // Could send to AWS Lambda, Azure Functions, etc.
}
```

### Add Database Backend

Replace Google Sheets with database:

1. Create API endpoint (Express, FastAPI, Django, etc.)
2. Update webhook URL to point to your API
3. Implement `POST /api/surveys` endpoint
4. Handle data insertion into database

Example Node.js/Express:

```javascript
app.post('/api/surveys', (req, res) => {
    const { surveyValues, members } = req.body;
    // Insert into database
    db.surveys.insert({ surveyValues, members });
    res.json({ success: true });
});
```

### Add Multi-Language Support

Create language configuration:

```javascript
const LANGUAGES = {
  en: {
    title: 'Labor and Employment Mapping',
    submit: 'Submit Survey',
  },
  tl: {
    title: 'Mapa ng Paggawa at Trabaho',
    submit: 'Ipadala ang Ulat',
  }
};
```

Then update HTML based on selected language:

```javascript
function changeLanguage(lang) {
    document.title = LANGUAGES[lang].title;
    // Update all text in UI
}
```

### Add Real-Time Dashboard

Create a separate `dashboard.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Survey Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div id="chart"></div>
    <script>
        // Fetch data from Google Sheets API
        // Display as charts and statistics
    </script>
</body>
</html>
```

## Testing

### Unit Testing

Add a test file `test.js`:

```javascript
function testEscapeHtml() {
    console.assert(escapeHtml('<div>') === '&lt;div&gt;', 'HTML escaping failed');
}

function testAgeCalculation() {
    // Test age calculation logic
}
```

Run: `node test.js`

### End-to-End Testing

Test entire flow:
1. Fill survey form
2. Submit
3. Verify data in backend
4. Test offline + sync
5. Test mobile install

### Performance Testing

Use Chrome DevTools:
1. Open DevTools → Lighthouse
2. Run Audit
3. Fix warnings
4. Check performance score

## Security Considerations

### HTTPS
- Always use HTTPS in production
- Never expose API keys in client code

### Input Validation
- Sanitize all inputs on backend
- Use Content Security Policy headers
- Validate file uploads

### Rate Limiting
- Limit submissions per IP
- Prevent brute force attacks

### Data Privacy
- Get proper consent before collecting data
- Implement data retention policies
- Allow users to delete their data

## Debugging

### Browser DevTools

```javascript
// Check offline status
console.log(navigator.onLine);

// View localStorage
console.log(localStorage.getItem('surveyQueue'));

// Check service worker
navigator.serviceWorker.getRegistrations()
```

### Network Tab (DevTools → Network)
- Monitor API calls
- Check response status
- Verify data sent

### Console (DevTools → Console)
- Look for JavaScript errors
- Check warning messages
- Run custom debugging code

## Performance Optimization

### Reduce Bundle Size
1. Minify CSS and JS
2. Compress images
3. Remove unused code

### Improve Load Time
1. Enable GZIP compression
2. Use CDN for static files
3. Cache frequently accessed resources

### Optimize Form
1. Lazy-load heavy components
2. Reduce form field validation time
3. Optimize image sizes

## Deployment to Production

### Environment Variables

Use `.env` file (not in git):

```
WEBHOOK_URL=https://your-production-url.com
ENVIRONMENT=production
```

### Build Process

1. Minify CSS and JavaScript
2. Optimize images
3. Run security checks
4. Test on target browsers

### Monitoring

Set up error tracking:
- Sentry
- Rollbar
- LogRocket

## Support for Developers

- See `script.js` comments for function documentation
- Check `config.js` for configuration options
- Review Google Apps Script in `google-apps-script.js`
- Test with `QUICK_START.md` setup

## Contributing

If you make improvements:
1. Test thoroughly on mobile
2. Verify offline functionality
3. Check browser compatibility
4. Document your changes
5. Update relevant documentation files

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Google Apps Script](https://script.google.com)
- [Web Performance](https://web.dev/performance/)
- [Mobile Best Practices](https://web.dev/mobile/)

---

Questions? Check the documentation files or review existing code comments.
