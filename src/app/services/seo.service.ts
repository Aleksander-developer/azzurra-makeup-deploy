import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private titleService: Title,
    private metaService: Meta
  ) {}

  /**
   * Imposta titolo e meta description, più eventuali altri tag
   */
  updateMetaTags(
    title: string,
    description: string,
    tags: { [key: string]: string } = {}
  ): void {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });

    for (const key of Object.keys(tags)) {
      this.metaService.updateTag({ name: key, content: tags[key] });
    }
  }

  /**
   * Aggiorna i tag OpenGraph base (social sharing)
   */
  updateOpenGraph(
    title: string,
    description: string,
    imageUrl: string,
    url?: string
  ): void {
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    if (url) {
      this.metaService.updateTag({ property: 'og:url', content: url });
    }
  }

  /**
   * Aggiorna i tag hreflang per il multilingua (utile se hai /it e /en)
   */
  updateHreflangTags(currentLocale: string, pageUrl: string): void {
    const availableLocales = ['it', 'en'];

    // Rimuovi eventuali tag precedenti
    this.metaService.removeTag("name='hreflang'");

    for (const locale of availableLocales) {
      const href = pageUrl.replace(`/${currentLocale}`, `/${locale}`);
      this.metaService.addTag({
        name: 'hreflang',
        content: locale,
      });
      this.metaService.addTag({
        name: 'alternate',
        content: href
      });
    }
  }
}

