#!/usr/bin/env node
/**
 * ╔═══════════════════════════════════════════╗
 * ║   JARVIS — IdoBooking Site Builder        ║
 * ║   Local Development Server                ║
 * ╚═══════════════════════════════════════════╝
 *
 * Uruchomienie: node server.js
 * Dashboard:    http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE = __dirname;

// MIME types
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/plain; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  let url = req.url.split('?')[0];

  // ═══ ROUTES ═══

  // Dashboard
  if (url === '/' || url === '/index.html') {
    return serveFile(res, path.join(BASE, 'dashboard', 'index.html'));
  }

  // Page Builder
  if (url === '/builder' || url === '/builder.html') {
    return serveFile(res, path.join(BASE, 'dashboard', 'builder.html'));
  }

  // ═══ API ENDPOINTS ═══

  // CSS Layers
  if (url === '/api/css/layer1') {
    return serveFile(res, path.join(BASE, 'library', 'css', 'layer1-traps.css'));
  }
  if (url === '/api/css/layer2') {
    return serveFile(res, path.join(BASE, 'library', 'css', 'layer2-components.css'));
  }

  // JS
  if (url === '/api/js/base') {
    return serveFile(res, path.join(BASE, 'library', 'js', 'ido-base.js'));
  }

  // Data
  if (url === '/api/clients') {
    return serveFile(res, path.join(BASE, 'data', 'clients.json'));
  }
  if (url === '/api/palettes') {
    return serveFile(res, path.join(BASE, 'data', 'palettes.json'));
  }
  if (url === '/api/fonts') {
    return serveFile(res, path.join(BASE, 'data', 'fonts.json'));
  }
  if (url === '/api/components') {
    return serveFile(res, path.join(BASE, 'library', 'templates', 'component-templates.json'));
  }

  // Client list (folder-based)
  if (url === '/api/client-folders') {
    try {
      const clientsDir = path.join(BASE, 'clients');
      const folders = fs.readdirSync(clientsDir).filter(f =>
        fs.statSync(path.join(clientsDir, f)).isDirectory()
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(folders));
    } catch(e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Status / health check
  if (url === '/api/status') {
    const status = {
      name: 'JARVIS',
      version: '1.0.0',
      status: 'running',
      clients: 0,
      components: 0,
    };
    try {
      const clientsDir = path.join(BASE, 'clients');
      status.clients = fs.readdirSync(clientsDir).filter(f =>
        fs.statSync(path.join(clientsDir, f)).isDirectory()
      ).length;
    } catch(e) {}
    try {
      const tpl = JSON.parse(fs.readFileSync(path.join(BASE, 'library', 'templates', 'component-templates.json'), 'utf-8'));
      status.components = Object.keys(tpl).length;
    } catch(e) {}
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status, null, 2));
    return;
  }

  // ═══ STATIC FILES ═══
  const filePath = path.join(BASE, url);
  const safePath = path.resolve(filePath);
  if (!safePath.startsWith(path.resolve(BASE))) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  serveFile(res, safePath);
});

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + path.basename(filePath));
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}

server.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════════╗');
  console.log('  ║         J A R V I S   v1.0                ║');
  console.log('  ║   IdoBooking Site Builder                 ║');
  console.log('  ╠═══════════════════════════════════════════╣');
  console.log(`  ║   Dashboard:  http://localhost:${PORT}        ║`);
  console.log(`  ║   API Status: http://localhost:${PORT}/api/status ║`);
  console.log('  ╚═══════════════════════════════════════════╝');
  console.log('');
  console.log('  Ctrl+C aby zatrzymać serwer');
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`  Port ${PORT} jest zajęty! Zamknij inne procesy lub zmień port.`);
    process.exit(1);
  }
  console.error('  Server error:', err);
});
