// src/app/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'token';
  private loggedIn$: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
    this.isLoggedIn$ = this.loggedIn$.asObservable();
  }

  private hasToken(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        if (response.token && this.isBrowser) {
          localStorage.setItem(this.tokenKey, response.token);
          this.loggedIn$.next(true);
        }
      })
    );
  }

  register(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/register`, { email, password }).pipe(
      tap(response => {
        if (response.token && this.isBrowser) {
          localStorage.setItem(this.tokenKey, response.token);
          this.loggedIn$.next(true);
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
    }
    this.loggedIn$.next(false);
  }

  isLoggedInSync(): boolean {
    return this.loggedIn$.getValue();
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }
}
