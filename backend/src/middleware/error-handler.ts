import { ErrorRequestHandler } from 'express';
import { HttpError } from '../utils/http-error';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ error: { message: error.message, statusCode: error.statusCode } });
    return;
  }
  console.error(error);
  res.status(500).json({ error: { message: 'Internal server error', statusCode: 500 } });
};
