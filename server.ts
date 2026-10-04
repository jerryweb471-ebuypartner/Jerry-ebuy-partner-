import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const DATA_FILE = path.join(__dirname, 'server_storage.json');

  app.use(express.json({ limit: '50mb' }));

  // Helper to read storage file safely
  const getStorage = () => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('[Server Storage] Error reading storage file:', e);
    }
    return null;
  };

  // Helper to write storage file safely
  const saveStorage = (data: any) => {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('[Server Storage] Error saving storage file:', e);
      return false;
    }
  };

  // API Routes for backend persistent storage
  app.get('/api/storage', (req, res) => {
    const data = getStorage();
    if (data) {
      res.json({ success: true, data });
    } else {
      res.json({ success: false, data: null });
    }
  });

  app.post('/api/storage', (req, res) => {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid payload' });
    }
    const current = getStorage() || {};
    const merged = { ...current, ...body, updatedAt: new Date().toISOString() };
    const saved = saveStorage(merged);
    res.json({ success: saved, message: 'Saved to backend storage file successfully' });
  });

  app.get('/api/storage/:key', (req, res) => {
    const storage = getStorage() || {};
    const key = req.params.key;
    res.json({ success: true, data: storage[key] ?? null });
  });

  app.post('/api/storage/:key', (req, res) => {
    const key = req.params.key;
    const { data } = req.body;
    const storage = getStorage() || {};
    storage[key] = data;
    storage.updatedAt = new Date().toISOString();
    const saved = saveStorage(storage);
    res.json({ success: saved, key });
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexora Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
