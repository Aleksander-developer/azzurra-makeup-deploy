// src/app/pages/chi-sono/chi-sono.component.ts
import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chi-sono',
  templateUrl: './chi-sono.component.html',
  styleUrls: ['./chi-sono.component.scss']
})
export class ChiSonoComponent implements OnInit {

  constructor(
    private seoService: SeoService,
    private router: Router,
    @Inject(LOCALE_ID) public localeId: string
  ) { }

  ngOnInit(): void {
    this.setSeoTags();
  }

  private setSeoTags() {
    const pageUrl = this.router.url;

    // Usa il tag $localize solo per la stringa sorgente (italiana).
    // La traduzione inglese sarà fornita nel file .xlf.
    this.seoService.updateMetaTags(
      $localize`:@@chiSonoMetaTitle:Chi sono - Azzurra Makeup Artist Roma`,
      $localize`:@@chiSonoMetaDescription:Scopri chi sono, la mia esperienza come make-up artist a Roma e la mia passione per il trucco.`
    );

    // Aggiorna i tag hreflang
    this.seoService.updateHreflangTags(this.localeId, pageUrl);
  }
}