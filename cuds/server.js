const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const PORT = 3000;
const RESULTS_DIR = path.join(__dirname, 'results');
const BARANGAYS = new Set([
  'BABO PANGULO', 'BABO SACAN', 'BALUBAD', 'CALZADANG BAYU', 'CAMIAS', 'CANGATBA',
  'DIAZ', 'HACIENDA DOLORES', 'INARARO', 'JALUNG', 'MANCATIAN', 'MANIBAUG LIBUTAD',
  'MANIBAUG PARALAYA', 'MANIBAUG PASIG', 'MANUALI', 'MITLA PROPER', 'PALAT', 'PIAS',
  'PIO', 'PLANAS', 'POBLACION', 'PULONG SANTOL', 'SALU', 'SAN JOSE MITLA', 'SANTA CRUZ',
  'SAPANG UWAK', 'SEPUNG BULAON', 'SEÑORA', 'VILLA MARIA'
]);

function sanitizeFolderName(name) {
  return String(name || 'UNKNOWN')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9 _-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 64) || 'UNKNOWN';
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/submit') {
    try {
      const data = await parseJsonBody(req);
      const barangayRaw = String(data.surveyValues?.barangay || data.surveyValues?.barangay || '').trim().toUpperCase();
      const barangay = BARANGAYS.has(barangayRaw) ? barangayRaw : 'OTHERS';
      const folderName = sanitizeFolderName(barangay);
      const targetDir = path.join(RESULTS_DIR, folderName);
      await ensureDir(targetDir);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `survey-${timestamp}.json`;
      const filePath = path.join(targetDir, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ success: true, path: filePath }));
    } catch (error) {
      res.writeHead(400, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, message: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Result grouping server running at http://localhost:${PORT}`);
  console.log(`Results will be written to ${RESULTS_DIR}`);
});
