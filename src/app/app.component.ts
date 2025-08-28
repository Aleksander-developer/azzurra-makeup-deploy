import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Azzurra Angius Makeup Artist';
  showScrollButton: boolean = false;
  scrollButtonBottom: number = 30;
  isButtonOverFooter: boolean = false;
  private routerSubscription: Subscription | undefined;

  @ViewChild('footerRef') footerRef!: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // Imposta la lingua di default. Verrà aggiornata dinamicamente.
      this.document.documentElement.lang = 'it';
    }
  }

  ngOnInit(): void {
    console.log('Env attuale:', environment);

    if (isPlatformBrowser(this.platformId)) {
      // Sottoscrizione agli eventi del router
      this.routerSubscription = this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        // Scrolla in cima ad ogni cambio pagina
        window.scrollTo(0, 0);
        
        // AGGIUNTO: Aggiorna i tag hreflang per il SEO
        this.updateHreflangTags(event.urlAfterRedirects);
      });
    }
  }

  ngOnDestroy(): void {
    // Rimuovi la sottoscrizione per evitare memory leak
    this.routerSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.listen('window', 'scroll', () => this.onWindowScroll());
      this.renderer.listen('window', 'resize', () => this.updateScrollButtonPosition());
      this.updateScrollButtonPosition();
    }
  }

  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.showScrollButton = scrollY > 100;
      this.updateScrollButtonPosition();
    }
  }

  updateScrollButtonPosition(): void {
    if (!this.footerRef?.nativeElement || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const footerEl = this.footerRef.nativeElement as HTMLElement;
    const footerRect = footerEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const defaultButtonMargin = 30;

    if (footerRect.top < viewportHeight) {
      const visibleFooterHeight = viewportHeight - footerRect.top;
      this.scrollButtonBottom = Math.max(defaultButtonMargin, visibleFooterHeight + 10);
      this.isButtonOverFooter = true;
    } else {
      this.scrollButtonBottom = defaultButtonMargin;
      this.isButtonOverFooter = false;
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  // --- LOGICA HREFLANG AGGIUNTA QUI ---
  private updateHreflangTags(currentUrl: string): void {
    this.removeExistingHreflangTags();

    const head = this.document.getElementsByTagName('head')[0];
    const origin = this.document.location.origin;

    const pathWithoutLocale = currentUrl.replace(/^\/(it|en)/, '');

    // Crea il link per l'italiano
    const linkIt = this.document.createElement('link');
    linkIt.setAttribute('rel', 'alternate');
    linkIt.setAttribute('hreflang', 'it');
    linkIt.setAttribute('href', `${origin}/it${pathWithoutLocale}`);
    head.appendChild(linkIt);

    // Crea il link per l'inglese
    const linkEn = this.document.createElement('link');
    linkEn.setAttribute('rel', 'alternate');
    linkEn.setAttribute('hreflang', 'en');
    linkEn.setAttribute('href', `${origin}/en${pathWithoutLocale}`);
    head.appendChild(linkEn);
    
    // Crea il link x-default
    const linkXDefault = this.document.createElement('link');
    linkXDefault.setAttribute('rel', 'alternate');
    linkXDefault.setAttribute('hreflang', 'x-default');
    linkXDefault.setAttribute('href', `${origin}/it${pathWithoutLocale}`);
    head.appendChild(linkXDefault);

    // Aggiorna dinamicamente la lingua del tag <html>
    const currentLang = currentUrl.startsWith('/en') ? 'en' : 'it';
    this.document.documentElement.lang = currentLang;
  }

  private removeExistingHreflangTags(): void {
    const existingLinks = this.document.querySelectorAll('link[rel="alternate"]');
    existingLinks.forEach(link => link.remove());
  }
}
