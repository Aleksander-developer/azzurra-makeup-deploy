import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PortfolioItem } from '../pages/portfolio/portfolio-item.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  // L'URL del backend viene letto dal file di ambiente
  private apiUrl = `${environment.apiUrl}/api/portfolio`;

  constructor(private http: HttpClient) { }

  // Ottiene tutti gli elementi del portfolio dal backend
  getPortfolioItems(): Observable<PortfolioItem[]> {
    return this.http.get<PortfolioItem[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Ottiene un singolo elemento per ID
  getPortfolioItemById(id: string): Observable<PortfolioItem> {
    return this.http.get<PortfolioItem>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Aggiunge un nuovo elemento (lo useremo per l'admin)
  addPortfolioItem(formData: FormData): Observable<PortfolioItem> {
    return this.http.post<PortfolioItem>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Aggiorna un elemento esistente (per l'admin)
  updatePortfolioItem(id: string, formData: FormData): Observable<PortfolioItem> {
    return this.http.put<PortfolioItem>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Elimina un elemento (per l'admin)
  deletePortfolioItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Errore API:', error);
    return throwError(() => new Error('Qualcosa è andato storto; riprova più tardi.'));
  }
}