// src/app/services/auth.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, delay, catchError, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable().pipe(
    shareReplay(1)
  );

  private readonly MOCK_EMAIL = 'azzurraangius95@gmail.com';
  private readonly MOCK_PASSWORD = 'AzzuBestMakeupArtist';

  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          this._isLoggedIn.next(true);
        }
      } catch (e) {
        console.error('Impossibile accedere a localStorage:', e);
        this._isLoggedIn.next(false);
      }
    }
  }

  /**
   * Simula una chiamata di login con credenziali fisse.
   * @param email L'email dell'utente.
   * @param password La password dell'utente.
   * @returns Un Observable che emette un token in caso di successo o un errore in caso di fallimento.
   */
  login(email: string, password: string): Observable<{ token: string }> {
    return of(null).pipe(
      delay(1000), // Simula un ritardo di rete
      map(() => {
        if (email === this.MOCK_EMAIL && password === this.MOCK_PASSWORD) {
          const mockToken = 'mock_jwt_token_12345';
          
          if (this.isBrowser) {
            localStorage.setItem('auth_token', mockToken);
          }
          
          this._isLoggedIn.next(true);
          console.log('Login effettuato con successo!');
          return { token: mockToken };
        } else {
          // Lancia un errore anziché restituire un Observable di errore
          throw { 
            code: 'auth/invalid-credential', 
            message: 'Credenziali non valide.' 
          };
        }
      }),
      // Sposta il catchError fuori dal map per gestirlo correttamente
      catchError(err => {
        console.error('Login fallito:', err.message);
        return throwError(() => err);
      })
    );
  }

  /**
   * Esegue il logout dell'utente.
   * Rimuove il token dal localStorage e reindirizza alla pagina di login.
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
    }
    this._isLoggedIn.next(false);
    this.router.navigate(['/login']);
    console.log('Logout effettuato con successo!');
  }

  /**
   * Restituisce lo stato di login corrente come valore booleano.
   * Questo metodo è sicuro per l'uso in tutti gli ambienti (browser e server).
   * @returns Lo stato di login corrente.
   */
  checkLoginStatus(): boolean {
    return this._isLoggedIn.getValue();
  }
}
