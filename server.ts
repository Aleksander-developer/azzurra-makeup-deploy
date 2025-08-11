import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';
import { LOCALE_ID } from '@angular/core';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  const supportedLocales = ['it', 'en'];
  const defaultLocale = 'it';

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // --- INIZIO MODIFICHE ---

  // 1. Servi i file statici (es. .js, .css) da ogni cartella lingua
  supportedLocales.forEach((locale) => {
    const localePath = join(browserDistFolder, locale);
    server.use(`/${locale}`, express.static(localePath, {
      maxAge: '1y',
      index: false,
    }));
  });

  // 2. Gestisci il rendering SSR per ogni lingua
  server.get('*', (req, res, next) => {
    // Determina la lingua dall'URL
    const locale = supportedLocales.find(l => req.path.startsWith(`/${l}/`)) || defaultLocale;
    
    // Se l'URL è la radice del sito, reindirizza alla lingua di default
    if (req.path === '/') {
      return res.redirect(301, `/${defaultLocale}`);
    }

    const localeBrowserDistFolder = join(browserDistFolder, locale);
    // Cambiamo il path dell'index.html in base alla lingua
    const indexHtml = join(localeBrowserDistFolder, 'index.html');

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        publicPath: localeBrowserDistFolder,
        providers: [
          // Imposta il base href e la lingua corretta per Angular
          { provide: APP_BASE_HREF, useValue: `/${locale}/` },
          { provide: LOCALE_ID, useValue: locale }
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });
  
  // --- FINE MODIFICHE ---

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
