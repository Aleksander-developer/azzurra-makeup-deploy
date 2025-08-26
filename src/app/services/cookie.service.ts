// src/app/services/cookie.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  setConsent() {
    localStorage.setItem('cookie-consent', 'true');
  }

  hasConsent(): boolean {
    return localStorage.getItem('cookie-consent') === 'true';
  }

  // Qui puoi aggiungere metodi per attivare o disattivare specifici script (es. Google Analytics)
  enableAnalytics() {
    // Esempio di come potresti attivare Google Analytics
    if (this.hasConsent()) {
      // Inserisci qui lo script o il metodo per attivare GA
      console.log('Google Analytics enabled');
    }
  }
}