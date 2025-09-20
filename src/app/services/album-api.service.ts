import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, shareReplay } from 'rxjs';

export interface Album {
  id: string;
  title: string;
  description?: string;
  cover: string;
  photos: string[];
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AlbumApiService {
  private base = `${environment.apiUrl}/albums`;
  constructor(private http: HttpClient) {}

  getAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(this.base).pipe(shareReplay(1));
  }

  getAlbumById(id: string): Observable<Album> {
    return this.http.get<Album>(`${this.base}/${id}`);
  }

  createAlbum(payload: Omit<Album, 'id'>): Observable<Album> {
    const headers = new HttpHeaders({ 'x-api-key': environment.apiKey });
    return this.http.post<Album>(this.base, payload, { headers });
  }

  updateAlbum(id: string, payload: Partial<Omit<Album, 'id'>>): Observable<Album> {
    const headers = new HttpHeaders({ 'x-api-key': environment.apiKey });
    return this.http.put<Album>(`${this.base}/${id}`, payload, { headers });
  }

  deleteAlbum(id: string): Observable<void> {
    const headers = new HttpHeaders({ 'x-api-key': environment.apiKey });
    return this.http.delete<void>(`${this.base}/${id}`, { headers });
  }
}

