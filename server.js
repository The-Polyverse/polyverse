import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import serverStatic from 'serve-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer(isProd = process.env.NODE_ENV === 'production') {
  const app = express();
  let vite;
  
  if (isProd) {
    app.use(serverStatic(path.resolve(__dirname, './dist/client'), {
      index: false,
    }));
  } else {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: __dirname,
      appType: 'custom',
    });
    
    app.use(vite.middlewares);
  }

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const template = isProd
        ? fs.readFileSync(path.resolve(__dirname, './dist/client/index.html'), 'utf-8')
        : await vite.transformIndexHtml(
            url,
            fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8')
          );

      const { render } = isProd
        ? await import('./dist/server/entry-server.js')
        : await vite.ssrLoadModule('/src/entry-server.tsx');
      
      const appHtml = await render(url, template);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(appHtml);
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e);
      next(e);
    }
  });
  
  app.listen(3000);
}

createServer();
