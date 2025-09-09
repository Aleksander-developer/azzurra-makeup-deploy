// server.ts (SSR Angular + Proxy)
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { join } from 'node:path';
import { LOCALE_ID } from '@angular/core';
import { AppServerModule } from './src/main.server';

import {
  createProxyMiddleware,
  Options,
  RequestHandler
} from 'http-proxy-middleware';
import { Request, Response } from 'express';
import { IncomingMessage } from 'http';
import { ClientRequest } from 'node:http';

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/azzurra-makeup-deploy/browser');

  const commonEngine = new CommonEngine();
  server.set('view engine', 'html');
  server.set('views', distFolder);

  // URL backend
  const BACKEND_URL =
    process.env['NODE_ENV'] === 'production'
      ? 'https://azzurra-makeup-be-1046780610179.europe-west1.run.app'
      : 'http://localhost:8080';

  // Proxy frontend → backend
server.use(
  '/b-api',
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: { '^/b-api': '' },
    onProxyReq: (proxyReq: ClientRequest, req: Request, res: Response) => {
      console.log('[Proxy] →', proxyReq.getHeader('host'), proxyReq.path);
    },
    onError: (err: any, req: Request, res: Response) => {
      console.error('[Proxy Error]', err);
    }
  } as any) // 👈 qui forziamo a any solo questo blocco
);


  const supportedLocales = ['it', 'en'];
  const defaultLocale = 'it';

  // Assets non localizzati
  server.use(
    '/assets',
    express.static(join(distFolder, 'assets'), { maxAge: '1y', index: false })
  );

  supportedLocales.forEach((locale) => {
    server.use(
      `/${locale}/assets`,
      express.static(join(distFolder, 'assets'), { maxAge: '1y', index: false })
    );
  });

  // Redirect lingua
  server.get('/', (req, res) => {
    const acceptLanguageHeader = req.headers['accept-language'];
    let preferredLocale = defaultLocale;

    if (acceptLanguageHeader) {
      const browserLangs = acceptLanguageHeader
        .split(',')
        .map((lang) => lang.split(';')[0].toLowerCase().slice(0, 2));
      const foundLang = browserLangs.find((lang) =>
        supportedLocales.includes(lang)
      );
      if (foundLang) preferredLocale = foundLang;
    }

    res.redirect(301, `/${preferredLocale}`);
  });

  // Asset specifici per lingua (es. /it/main.js)
  supportedLocales.forEach((locale) => {
    server.use(
      `/${locale}`,
      express.static(join(distFolder, locale), { maxAge: '1y' })
    );
  });

  // SSR per ogni lingua
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
            { provide: LOCALE_ID, useValue: locale }
          ]
        })
        .then((html) => res.send(html))
        .catch((err) => next(err));
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4201;
  const server = app();
  server.listen(port, () => {
    console.log(`✅ Node Express server listening on http://localhost:${port}`);
  });
}

run();