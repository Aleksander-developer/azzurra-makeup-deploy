// src/app/services/reviews.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interfaccia per la struttura di una singola recensione
export interface Review {
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl: string;
    isVerified: boolean;
  };
  starRating: 'FIVE' | 'FOUR' | 'THREE' | 'TWO' | 'ONE';
  comment: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
  starRatingNumber: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private apiUrl = `${environment.apiUrl}/reviews`; 

  constructor(private http: HttpClient) { }

  getReviews(): Observable<Review[]> {
    return this.http.get<any[]>(this.apiUrl).pipe( // Riceve un array di 'any' da Google
      map(reviews => reviews.map(review => ({
        ...review,
        // Converte la stringa del rating in un numero
        starRatingNumber: this.convertStarRatingToNumber(review.starRating)
      }))),
      catchError(error => {
        console.error('Errore durante il recupero delle recensioni:', error);
        return of([]); // Restituisce un array vuoto in caso di errore
      })
    );
  }

  private convertStarRatingToNumber(starRating: string): number {
    switch (starRating) {
      case 'ONE_STAR': return 1;
      case 'TWO_STARS': return 2;
      case 'THREE_STARS': return 3;
      case 'FOUR_STARS': return 4;
      case 'FIVE_STARS': return 5;
      default: return 0;
    }
  }
}