import path from 'path';
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3000),
  CORS_ORIGIN: Joi.string().default('http://localhost:4200'),
  QR_BASE_URL: Joi.string().uri().default('http://localhost:4200/register'),
  DATA_DIR: Joi.string().default(path.resolve(process.cwd(), 'data'))
}).unknown(true);

const { value, error } = schema.validate(process.env, { abortEarly: false });
if (error) throw new Error(`Invalid environment: ${error.message}`);

export const env = {
  nodeEnv: value.NODE_ENV as string,
  port: Number(value.PORT),
  corsOrigin: (value.CORS_ORIGIN as string).split(',').map((origin) => origin.trim()),
  qrBaseUrl: value.QR_BASE_URL as string,
  dataDir: value.DATA_DIR as string
};
