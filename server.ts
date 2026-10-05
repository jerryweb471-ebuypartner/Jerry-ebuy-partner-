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

  // Connected SSE clients (for real-time Admin notifications)
  const sseClients = new Set<express.Response>();

  app.get('/api/live-stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.add(res);

    // Send connection established handshake
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);

    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  const broadcastToAdmins = (data: any) => {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(payload);
      } catch (e) {
        sseClients.delete(client);
      }
    }
  };

  // Endpoint for Client Registration from Client Interface
  app.post('/api/clients/register', (req, res) => {
    const { user, wallet, password } = req.body;
    if (!user || !user.email) {
      return res.status(400).json({ success: false, error: 'User details required' });
    }

    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || user.ipAddress || '104.28.192.44';

    const enhancedUser = {
      ...user,
      ipAddress: clientIp.includes('::') || clientIp === '127.0.0.1' ? (user.ipAddress || '104.28.192.44') : clientIp,
      registrationIp: clientIp.includes('::') || clientIp === '127.0.0.1' ? (user.registrationIp || '104.28.192.44') : clientIp,
      isRealClient: true,
      emailVerified: true,
      creditScore: user.creditScore ?? 100,
      createdAt: user.createdAt || new Date().toISOString(),
    };

    const storage = getStorage() || {};
    const existingUsers: any[] = Array.isArray(storage.users) ? storage.users : [];
    
    // Deduplicate by email
    const cleanEmail = enhancedUser.email.toLowerCase().trim();
    const filteredUsers = existingUsers.filter((u: any) => (u.email || '').toLowerCase().trim() !== cleanEmail);
    const updatedUsers = [enhancedUser, ...filteredUsers];

    // Ensure Master Admin Jerry is always in list
    if (!updatedUsers.some((u: any) => u.email === 'jerryhun47@gmail.com')) {
      updatedUsers.push({
        id: 'USR-ADMIN-01',
        name: 'Jerry (Chief Administrator)',
        email: 'jerryhun47@gmail.com',
        role: 'admin',
        level: 10,
        creditScore: 100,
        currency: 'USD',
        currencySymbol: '$',
      });
    }

    storage.users = updatedUsers;

    if (wallet) {
      storage.wallets = { ...(storage.wallets || {}), [enhancedUser.id]: wallet };
    }

    if (password) {
      storage.passwords = { ...(storage.passwords || {}), [cleanEmail]: password };
    }

    storage.updatedAt = new Date().toISOString();
    saveStorage(storage);

    // Broadcast in real-time to all connected Admin consoles
    broadcastToAdmins({
      type: 'NEW_CLIENT_REGISTERED',
      user: enhancedUser,
      wallet,
      timestamp: new Date().toISOString(),
    });

    console.log(`[Server Storage] Real-Time Client Registered: ${enhancedUser.name} (${enhancedUser.email}) from IP: ${enhancedUser.ipAddress}`);
    res.json({ success: true, user: enhancedUser });
  });

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
