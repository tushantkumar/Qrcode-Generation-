import QRCode from 'qrcode';
import { pool } from '../db/pool';
import { CreateQrCodeInput, QrCodeRecord } from '../types/qr';

const mapRow = (row: any): QrCodeRecord => ({
  id: row.id,
  purpose: row.purpose,
  title: row.title,
  description: row.description ?? undefined,
  targetUrl: row.target_url,
  amount: row.amount === null ? undefined : Number(row.amount),
  currency: row.currency ?? undefined,
  metadata: row.metadata,
  qrDataUrl: row.qr_data_url,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export async function createQrCode(input: CreateQrCodeInput): Promise<QrCodeRecord> {
  const payload = JSON.stringify({ purpose: input.purpose, title: input.title, url: input.targetUrl, amount: input.amount, currency: input.currency, metadata: input.metadata ?? {} });
  const qrDataUrl = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'M', margin: 2, width: 360 });
  const result = await pool.query(
    `INSERT INTO qr_codes (purpose, title, description, target_url, amount, currency, metadata, qr_data_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [input.purpose, input.title, input.description ?? null, input.targetUrl, input.amount ?? null, input.currency ?? null, input.metadata ?? {}, qrDataUrl]
  );
  return mapRow(result.rows[0]);
}

export async function listQrCodes(): Promise<QrCodeRecord[]> {
  const result = await pool.query('SELECT * FROM qr_codes ORDER BY created_at DESC LIMIT 50');
  return result.rows.map(mapRow);
}

export async function getQrCode(id: string): Promise<QrCodeRecord | null> {
  const result = await pool.query('SELECT * FROM qr_codes WHERE id = $1', [id]);
  return result.rowCount ? mapRow(result.rows[0]) : null;
}
