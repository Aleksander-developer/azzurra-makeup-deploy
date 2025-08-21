import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { join } from 'node:path';
import { LOCALE_ID } from '@angular/core';
import {AppServerModule} from './src/main.server';

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/azzurra-makeup-deploy/browser');

  const commonEngine = new CommonEngine();
  server.set('view engine', 'html');
  server.set('views', distFolder);

  const supportedLocales = ['it', 'en'];
  const defaultLocale = 'it';

  // --- REGOLA CORRETTA PER GLI ASSET ---
  // Gli asset non sono tradotti, quindi li serviamo direttamente dalla cartella comune
  server.use('/assets', express.static(join(distFolder, 'assets'), {
    maxAge: '1y',
    index: false
  }));

  // Gestisci anche richieste tipo /it/assets/... o /en/assets/...
  supportedLocales.forEach((locale) => {
    server.use(`/${locale}/assets`, express.static(join(distFolder, 'assets'), {
      maxAge: '1y',
      index: false
    }));
  });

  // Redirect intelligente basato sulla lingua del browser
  server.get('/', (req, res) => {
    const acceptLanguageHeader = req.headers['accept-language'];
    let preferredLocale = defaultLocale;

    if (acceptLanguageHeader) {
      const browserLangs = acceptLanguageHeader.split(',').map(lang => lang.split(';')[0].toLowerCase().slice(0, 2));
      const foundLang = browserLangs.find(lang => supportedLocales.includes(lang));
      if (foundLang) {
        preferredLocale = foundLang;
      }
    }
    
    res.redirect(301, `/${preferredLocale}`);
  });

  // Servi gli asset specifici della lingua (es. /it/main.js)
  supportedLocales.forEach((locale) => {
    server.use(`/${locale}`, express.static(join(distFolder, locale), {
      maxAge: '1y',
    }));
  });

  // Gestisci il rendering SSR per ogni lingua
  supportedLocales.forEach((locale) => {
    server.get(`/${locale}/*`, (req, res, next) => {
      const { protocol, originalUrl, headers } = req;
      const indexHtml = join(distFolder, locale, 'index.html');

      commonEngine
        .render({
          bootstrap: AppServerModule,
          documentFilePath: indexHtml,
          url: `${protocol}://${headers.host}${originalUrl}`,
          publicPath: join(distFolder, locale),
          providers: [
            { provide: APP_BASE_HREF, useValue: `/${locale}/` },
            { provide: LOCALE_ID, useValue: locale },
          ],
        })
        .then((html) => res.send(html))
        .catch((err) => next(err));
    });
  });
  
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
