// src/app/components/navbar/navbar.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.pipe(takeUntil(this.destroy$))
      .subscribe((status: boolean) => {
        this.isLoggedIn = status;
        // Questo log non causa il loop, ma ne è un sintomo
        console.log('Stato di login aggiornato nella navbar:', this.isLoggedIn);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  changeLanguage(lang: string): void {
    console.log(`Richiesta cambio lingua a: ${lang}`);
    if (isPlatformBrowser(this.platformId)) {
      const currentUrl = this.document.location.pathname;
      const pathWithoutLocale = currentUrl.replace(/^\/(it|en)/, '');
      
      this.document.location.href = `/${lang}${pathWithoutLocale}`;
    }
  }
}
