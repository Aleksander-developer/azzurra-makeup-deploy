// src/app/services/seo.service.ts

import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private titleService: Title,
    private metaService: Meta,
  ) { }

  /**
   * Imposta i meta tag SEO per una pagina
   * @param title Il titolo della pagina
   * @param description La descrizione della pagina
   * @param tags Altri meta tag personalizzati (es. keywords, og:...)
   */
  updateMetaTags(title: string, description: string, tags: { [key: string]: string } = {}) {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });

    // Aggiorna o aggiungi altri meta tag
    for (const key in tags) {
      if (tags.hasOwnProperty(key)) {
        this.metaService.updateTag({ name: key, content: tags[key] });
      }
    }
  }

  /**
   * Aggiorna i tag hreflang per il multilingua
   * @param currentLocale L'ID della lingua corrente (es. 'it', 'en')
   * @param pageUrl L'URL della pagina corrente
   */
  updateHreflangTags(currentLocale: string, pageUrl: string) {
    const availableLocales = ['it', 'en']; // Lista delle lingue supportate
    
    // Rimuovi i tag hreflang esistenti
    this.metaService.removeTag('rel=alternate');
    
    for (const locale of availableLocales) {
      if (locale !== currentLocale) {
        const alternateUrl = pageUrl.replace(`/${currentLocale}`, `/${locale}`);
        this.metaService.addTag({ 
          rel: 'alternate', 
          hreflang: locale, 
          href: window.location.origin + alternateUrl 
        });
      }
    }
  }
}