import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import qrRoutes from './routes/qr.routes';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'qr-generator-api' }));
app.use('/api/qr-codes', qrRoutes);
app.use(errorHandler);
