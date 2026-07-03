# QR Code Generation Platform

A production-ready QR code generation web application built with Angular, Node.js/Express, and PostgreSQL. Users can create QR codes for registration, payment, event, and custom workflows.

## Features

- Angular home page with a clear **Create QR Code** call to action.
- Reactive form for purpose, title, destination URL, optional description, amount, and currency.
- Node.js API with validation, rate limiting, security headers, CORS, compression, structured error responses, and QR PNG data URL generation.
- PostgreSQL persistence for generated QR codes and metadata.
- Docker Compose database for local development.

## Quick start

```bash
cp .env.example backend/.env
docker compose up -d postgres
npm run install:all
npm run build --prefix backend
npm run db:migrate --prefix backend
npm run dev
```

- Frontend: http://localhost:4200
- Backend health check: http://localhost:3000/health

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

- Use managed PostgreSQL with encrypted connections and regular backups.
- Set `CORS_ORIGIN` to the deployed frontend origin.
- Run behind HTTPS and a reverse proxy or container ingress.
- Store secrets in a secret manager rather than committing `.env` files.
