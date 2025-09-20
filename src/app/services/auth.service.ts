// src/app/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

const ADMIN_EMAIL = 'azzurraangius95@gmail.com';
const ADMIN_PASSWORD = 'superpassword';
const STORAGE_KEY = 'auth.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly ADMIN_EMAIL = ADMIN_EMAIL;
  private isBrowser: boolean;
  private isLoggedInSubject: BehaviorSubject<boolean>;

  isLoggedIn$;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  login(email: string, password: string): Observable<boolean> {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      if (this.isBrowser) {
        localStorage.setItem(STORAGE_KEY, 'fake-jwt-token');
      }
      this.isLoggedInSubject.next(true);
      return of(true);
    }
    return throwError(() => new Error('Credenziali non valide.'));
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.isLoggedInSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem(STORAGE_KEY);
  }
}

