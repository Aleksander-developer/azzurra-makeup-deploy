
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable, shareReplay } from 'rxjs';

export interface Album {
  id: string;
  title: string;
  description?: string;
  cover: string;
  photos: string[];
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AlbumApiService {
  private base = `${environment.apiUrl}/albums`;

  constructor(private http: HttpClient) {}

  /** Recupera tutti gli album (ordinati per "order" se disponibile) */
  getAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(this.base).pipe(
      map(list => [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))),
      shareReplay(1)
    );
  }

  /** Recupera un singolo album per ID */
  getAlbumById(id: string): Observable<Album> {
    return this.http.get<Album>(`${this.base}/${id}`);
  }

  /** Crea un nuovo album */
  createAlbum(payload: Omit<Album, 'id'>): Observable<Album> {
    const headers = new HttpHeaders({ 'x-api-key': environment.apiKey });
    return this.http.post<Album>(this.base, payload, { headers });
  }

  /** Aggiorna un album (può essere parziale, incluso il campo "order") */
  updateAlbum(id: string, payload: Partial<Omit<Album, 'id'>>): Observable<Album> {
    const headers = new HttpHeaders({ 'x-api-key': environment.apiKey });
    return this.http.put<Album>(`${this.base}/${id}`, payload, { headers });
  }

  /** Elimina un album per ID */
  deleteAlbum(id: string): Observable<void> {
    const headers = new HttpHeaders({ 'x-api-key': environment.apiKey });
    return this.http.delete<void>(`${this.base}/${id}`, { headers });
  }

  /** 🔹 Riordina gli album (allinea al backend: body { order: string[] }) */
  reorderAlbums(order: string[]): Observable<Album[]> {
    const headers = new HttpHeaders({ 'x-api-key': environment.apiKey });
    return this.http.patch<Album[]>(`${this.base}/reorder`, { order }, { headers });
  }
}

