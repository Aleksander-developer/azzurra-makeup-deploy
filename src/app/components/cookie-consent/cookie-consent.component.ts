// src/app/components/cookie-consent/cookie-consent.component.ts
import { Component, OnInit } from '@angular/core';
import { CookieService } from '../../services/cookie.service';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {
  showBanner = false;

  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
    if (!this.cookieService.hasConsent()) {
      this.showBanner = true;
    }
  }

  acceptConsent() {
    this.cookieService.setConsent();
    this.showBanner = false;
    // Puoi chiamare altri metodi qui, come abilitare Google Analytics
    this.cookieService.enableAnalytics();
  }
}