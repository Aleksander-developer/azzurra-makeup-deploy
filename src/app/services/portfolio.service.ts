import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Non serve più HttpHeaders
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PortfolioItem } from '../pages/portfolio/portfolio-item.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = `${environment.apiUrl}/portfolio`;
  // La gestione degli header viene completamente rimossa

  constructor(private http: HttpClient) { }

  // Tutte le chiamate ora sono più semplici, senza opzioni per gli header
  getPortfolioItems(): Observable<PortfolioItem[]> {
    return this.http.get<PortfolioItem[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getPortfolioItemById(id: string): Observable<PortfolioItem> {
    return this.http.get<PortfolioItem>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addPortfolioItem(formData: FormData): Observable<PortfolioItem> {
    return this.http.post<PortfolioItem>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  updatePortfolioItem(id: string, formData: FormData): Observable<PortfolioItem> {
    return this.http.put<PortfolioItem>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

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