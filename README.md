# QR Code Generation Platform

A local-first QR code generation web application built with Angular and Node.js/Express. Users can create QR codes for registration, payment, event, and custom workflows without Docker or an external database.

## Features

- Angular home page with a clear **Create QR Code** call to action.
- Reactive form for purpose, title, destination URL, optional description, amount, and currency.
- Node.js API with validation, rate limiting, security headers, CORS, compression, structured error responses, and QR PNG data URL generation.
- File-based local persistence in `backend/data/qr-codes.json`.
- No Docker or PostgreSQL required for local development.

## Quick start

```bash
npm run install:all
npm run dev
```

- Frontend: http://localhost:4200
- Backend health check: http://localhost:3000/health

The backend creates `backend/data/qr-codes.json` automatically when you create or list QR codes. To store data somewhere else, set `DATA_DIR` before starting the backend:

```bash
DATA_DIR=/absolute/path/to/data npm run dev --prefix backend
```

## API

### Create QR code

`POST /api/qr-codes`

```json
{
  "purpose": "registration",
  "title": "Conference Registration",
  "description": "Scan to register",
  "targetUrl": "https://example.com/register"
}
```

For payment QR codes, include `amount` and a three-letter `currency`.

### List QR codes

`GET /api/qr-codes`

Returns the latest 50 generated QR codes.

## Production notes

- Set `DATA_DIR` to a persistent writable directory if you deploy the API.
- Set `CORS_ORIGIN` to the deployed frontend origin.
- Run behind HTTPS and a reverse proxy.
- For high-volume or multi-instance deployments, replace the file store with a managed database.
