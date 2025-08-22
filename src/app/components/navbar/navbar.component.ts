import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService, // Changed to public to be accessible in the template if needed
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) { }

  ngOnInit(): void {
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
    this.router.navigate(['/']);
  }

  changeLanguage(lang: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentUrl = this.document.location.pathname;
      const pathWithoutLocale = currentUrl.replace(/^\/(it|en)/, '');
      this.document.location.href = `/${lang}${pathWithoutLocale || '/'}`;
    }
  }
}