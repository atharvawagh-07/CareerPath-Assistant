import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/src/routes/api.ts';
import { ensureDbReady } from './server/src/db/client.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB schema and verify seeding on startup
  ensureDbReady().catch(err => console.error('[Server] Database initialization notice:', err));

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Mount API routes
  app.use('/api', apiRouter);

  // Vite middleware for development / static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] CareerPath backend & Vite frontend running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Server] Fatal error during startup:', err);
});
