/**
 * Configuration File for Labor and Employment Mapping Survey App
 * 
 * Use this file to easily configure the app without editing script.js
 * 
 * BACKEND OPTIONS:
 * 1. GOOGLE_SHEETS - Cloud storage (recommended for easy access)
 * 2. LOCAL_SERVER - Self-hosted Node.js server
 */

// ============================================
// SELECT YOUR BACKEND (uncomment one)
// ============================================

// Option 1: Google Sheets Backend (RECOMMENDED)
const CONFIG = {
  BACKEND: 'GOOGLE_SHEETS',
  WEBHOOK_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec',
  // Replace YOUR_DEPLOYMENT_ID_HERE with your actual deployment ID from Google Apps Script
};

// Option 2: Local Node Server Backend
// const CONFIG = {
//   BACKEND: 'LOCAL_SERVER',
//   WEBHOOK_URL: 'http://localhost:3000/submit',
// };

// Option 3: Custom Server
// const CONFIG = {
//   BACKEND: 'CUSTOM',
//   WEBHOOK_URL: 'https://your-server.com/api/surveys',
// };

// ============================================
// OPTIONAL: CUSTOMIZE APP APPEARANCE
// ============================================

export const APP_CONFIG = {
  // Backend Configuration
  backend: CONFIG.BACKEND,
  webhookUrl: CONFIG.WEBHOOK_URL,

  // App Title & Description
  title: 'Labor and Employment Mapping',
  description: 'Help us understand labor market conditions, employment trends, and youth education/employment status in your area.',

  // Auto-sync Settings (for offline queue)
  autoSync: true,
  syncInterval: 30000, // Check for pending submissions every 30 seconds

  // Form Validation
  validateEmail: false,
  validatePhone: true,

  // UI Settings
  showSuccessAnimation: true,
  formSubmitTimeout: 10000, // 10 seconds before timeout
};

/**
 * SETUP INSTRUCTIONS
 * 
 * 1. Choose your backend (Google Sheets is recommended)
 * 2. Get your webhook URL:
 *    - For Google Sheets: Deploy Apps Script and copy the URL
 *    - For Local Server: Run "node server.js" and use http://localhost:3000/submit
 * 3. Replace the URL in this config file
 * 4. The app will automatically use this configuration
 * 
 * See QUICK_START.md for detailed setup instructions
 */
