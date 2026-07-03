export type QrPurpose = 'registration' | 'payment' | 'event' | 'custom';

export interface CreateQrCodeInput {
  purpose: QrPurpose;
  title: string;
  description?: string;
  targetUrl: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface QrCodeRecord extends CreateQrCodeInput {
  id: string;
  qrDataUrl: string;
  createdAt: string;
  updatedAt: string;
}
