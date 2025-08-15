import 'zone.js/node';
import express, { Request, Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

// Percorsi base
const DIST_FOLDER = join(process.cwd(), 'dist/azzurra-makeup-deploy');
const BROWSER_FOLDER = join(DIST_FOLDER, 'browser');

// Funzione helper per capire la lingua
function getLocaleFromUrl(url: string): 'it' | 'en' {
  if (url.startsWith('/en')) return 'en';
  return 'it'; // default
}

async function bootstrap() {
  const app = express();

  // File statici (browser)
  app.use(express.static(BROWSER_FOLDER, {
    maxAge: '1y',
    index: false
  }));

  // SSR per tutte le route
  app.get('*', async (req: Request, res: Response) => {
    try {
      const locale = getLocaleFromUrl(req.url);
      const serverMainPath = join(DIST_FOLDER, 'server', locale, 'main.js');

      if (!existsSync(serverMainPath)) {
        res.status(404).send(`SSR file not found for locale ${locale}`);
        return;
      }

      const { app: angularApp } = await import(serverMainPath);
      angularApp(req, res);
    } catch (err) {
      console.error('SSR rendering error:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  // Porta
  const port = process.env ['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`✅ SSR server listening on http://localhost:${port}`);
  });
}

bootstrap();
