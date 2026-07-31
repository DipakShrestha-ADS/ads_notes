# Campus Store API

This project is the cumulative reference implementation for the 25-day Node.js REST API course.

## Run locally

1. Copy `.env.example` to `.env`.
2. Run `npm install`.
3. Start PostgreSQL with `podman compose up -d postgres`.
4. Run `npm run db:migrate` and `npm run db:generate`.
5. Run `npm run seed`.
6. Start the API with `npm run dev`.

## Main routes

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile`
- `GET /products`
- `POST /products` for administrators
- `POST /products/:id/image` for administrators
- `GET /orders` for the authenticated user
- `POST /orders` for the authenticated user
- `GET /api-docs`

## Verify

Run `npm test`, open Swagger UI, and complete one register, login, browse, and order flow.

## Adapt the reference

Keep the architecture and replace Product and Order with the main resource and transaction from your assigned project.
