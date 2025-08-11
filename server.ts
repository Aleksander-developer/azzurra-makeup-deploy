import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';
import { LOCALE_ID } from '@angular/core';

// Funzione principale dell'app Express
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  console.log('📁 Percorso cartella browser:', browserDistFolder);

  // Lingue supportate (dal tuo angular.json)
  const supportedLocales = ['it', 'en'];
  const defaultLocale = 'it';

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');

  // Per ogni lingua, servi i file statici dalla sua cartella specifica (es. /browser/it, /browser/en)
  supportedLocales.forEach((locale) => {
    const localePath = join(browserDistFolder, locale);
    server.use(`/${locale}`, express.static(localePath, {
      maxAge: '1y',
    }));
  });

  // Gestione del rendering SSR per ogni lingua
  supportedLocales.forEach((locale) => {
    const localePath = join(browserDistFolder, locale);
    const indexHtml = join(localePath, 'index.html');

    // Intercetta tutte le richieste per una lingua specifica (es. /it/* o /en/*)
    server.get(`/${locale}/*`, (req, res, next) => {
      console.log(`🔄 Rendering SSR per la richiesta: ${req.originalUrl}`);
      commonEngine
        .render({
          bootstrap: AppServerModule,
          documentFilePath: indexHtml,
          url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
          publicPath: localePath,
          providers: [
            { provide: APP_BASE_HREF, useValue: `/${locale}/` },
            { provide: LOCALE_ID, useValue: locale }
          ],
        })
        .then((html) => res.send(html))
        .catch((err) => next(err));
    });
  });

  // Redirect dalla radice (/) alla lingua di default (/it)
  // QUESTO RISOLVE LA PAGINA BIANCA
  server.get('/', (req, res) => {
    console.log(`↩️ Redirect da / a /${defaultLocale}${req.originalUrl}`);
    res.redirect(301, `/${defaultLocale}${req.originalUrl}`);
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`✅ Server SSR multilingua avviato su http://localhost:${port}`);
  });
}

run();