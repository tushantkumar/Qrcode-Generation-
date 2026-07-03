import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type QrPurpose = 'registration' | 'payment' | 'event' | 'custom';
export interface QrCode { id: string; purpose: QrPurpose; title: string; description?: string; targetUrl: string; amount?: number; currency?: string; qrDataUrl: string; createdAt: string; }
export interface CreateQrCodeRequest { purpose: QrPurpose; title: string; description?: string; targetUrl: string; amount?: number; currency?: string; metadata?: Record<string, unknown>; }

@Injectable({ providedIn: 'root' })
export class QrApiService {
  private readonly http = inject(HttpClient);
  create(payload: CreateQrCodeRequest): Observable<QrCode> { return this.http.post<{ data: QrCode }>(`${environment.apiUrl}/qr-codes`, payload).pipe(map((r) => r.data)); }
  list(): Observable<QrCode[]> { return this.http.get<{ data: QrCode[] }>(`${environment.apiUrl}/qr-codes`).pipe(map((r) => r.data)); }
}
