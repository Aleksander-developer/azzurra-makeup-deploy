// src/app/services/cloudinary.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface CloudinarySignature {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  folder: string;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudinaryUrl = `https://api.cloudinary.com/v1_1`;

  constructor(private http: HttpClient) {}

  private async getSignature(): Promise<CloudinarySignature> {
    return await firstValueFrom(
      this.http.get<CloudinarySignature>(`${environment.apiUrl}/cloudinary/signature`)
    );
  }

  async uploadImage(file: File): Promise<string> {
    const sigData = await this.getSignature();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sigData.apiKey);
    formData.append('timestamp', sigData.timestamp.toString());
    formData.append('signature', sigData.signature);
    formData.append('folder', sigData.folder);

    const url = `${this.cloudinaryUrl}/${sigData.cloudName}/image/upload`;
    const response: any = await firstValueFrom(this.http.post(url, formData));

    return response.secure_url;
  }
}

