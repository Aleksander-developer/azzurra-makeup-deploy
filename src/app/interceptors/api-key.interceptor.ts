// src/app/api-key.interceptor.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {

  private platformId = inject(PLATFORM_ID);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Esegui questo codice solo nel browser
    if (isPlatformBrowser(this.platformId)) {
      // La tua chiave API. NOTA: In un'app reale, questa dovrebbe venire da una variabile d'ambiente
      const apiKey = 'azzu-best-makeup-artist-241217dic'; // <-- INSERISCI QUI LA TUA VERA API KEY

      // Clona la richiesta e aggiungi il nuovo header
      const authReq = req.clone({
        headers: req.headers.set('x-api-key', apiKey)
      });

      // Invia la richiesta clonata con l'header
      return next.handle(authReq);
    }
    
    // Se sei sul server, non fare nulla e lascia passare la richiesta originale
    return next.handle(req);
  }
}