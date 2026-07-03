import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import QRCode from 'qrcode';
import { env } from '../config/env';
import { CreateQrCodeInput, QrCodeRecord } from '../types/qr';

const dataFile = path.join(env.dataDir, 'qr-codes.json');
let writeQueue = Promise.resolve();

async function ensureDataFile(): Promise<void> {
  await mkdir(env.dataDir, { recursive: true });
  try {
    await readFile(dataFile, 'utf8');
  } catch (error: any) {
    if (error.code !== 'ENOENT') throw error;
    await writeFile(dataFile, '[]', 'utf8');
  }
}

async function readQrCodes(): Promise<QrCodeRecord[]> {
  await ensureDataFile();
  const contents = await readFile(dataFile, 'utf8');
  return JSON.parse(contents) as QrCodeRecord[];
}

async function writeQrCodes(records: QrCodeRecord[]): Promise<void> {
  await ensureDataFile();
  await writeFile(dataFile, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
}

function enqueueWrite<T>(operation: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(operation, operation);
  writeQueue = next.then(() => undefined, () => undefined);
  return next;
}

export async function createQrCode(input: CreateQrCodeInput): Promise<QrCodeRecord> {
  const payload = JSON.stringify({ purpose: input.purpose, title: input.title, url: input.targetUrl, amount: input.amount, currency: input.currency, metadata: input.metadata ?? {} });
  const qrDataUrl = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'M', margin: 2, width: 360 });
  const now = new Date().toISOString();

  const record: QrCodeRecord = {
    id: randomUUID(),
    purpose: input.purpose,
    title: input.title,
    description: input.description || undefined,
    targetUrl: input.targetUrl,
    amount: input.amount,
    currency: input.currency,
    metadata: input.metadata ?? {},
    qrDataUrl,
    createdAt: now,
    updatedAt: now
  };

  return enqueueWrite(async () => {
    const records = await readQrCodes();
    records.unshift(record);
    await writeQrCodes(records);
    return record;
  });
}

export async function listQrCodes(): Promise<QrCodeRecord[]> {
  const records = await readQrCodes();
  return records.slice(0, 50);
}

export async function getQrCode(id: string): Promise<QrCodeRecord | null> {
  const records = await readQrCodes();
  return records.find((record) => record.id === id) ?? null;
}
