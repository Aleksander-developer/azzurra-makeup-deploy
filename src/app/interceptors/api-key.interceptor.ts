// src/app/interceptors/api-key.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // La tua chiave API. NOTA: In un'app reale, questa dovrebbe venire da una variabile d'ambiente
    const apiKey = 'azzu-best-makeup-artist-241217dic';

    // Clona la richiesta e aggiungi il nuovo header
    const authReq = req.clone({
      headers: req.headers.set('x-api-key', apiKey)
    });

    // Invia la richiesta clonata con l'header
    return next.handle(authReq);
  }
}