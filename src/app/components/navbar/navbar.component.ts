// src/app/components/navbar/navbar.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common'; // <-- AGGIUNTO DOCUMENT
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // <-- AGGIUNTO Router

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    // <-- INIEZIONI AGGIUNTE -->
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) { }

  ngOnInit(): void {
    // La tua logica per lo stato di login è corretta
    this.authService.isLoggedIn$.pipe(takeUntil(this.destroy$))
      .subscribe((status: boolean) => {
        this.isLoggedIn = status;
        console.log('Stato di login aggiornato nella navbar:', this.isLoggedIn);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Reindirizza alla home dopo il logout
  }

  // <-- FUNZIONE CORRETTA E COMPLETA -->
  changeLanguage(lang: string): void {
    console.log(`Richiesta cambio lingua a: ${lang}`);
    if (isPlatformBrowser(this.platformId)) {
      const currentUrl = this.document.location.pathname;
      // Rimuove il vecchio prefisso della lingua (/it o /en)
      const pathWithoutLocale = currentUrl.replace(/^\/(it|en)/, '');
      
      // Naviga al nuovo URL completo, causando un ricaricamento della pagina
      // che permette al server di servire la versione corretta
      this.document.location.href = `/${lang}${pathWithoutLocale}`;
    }
  }
}