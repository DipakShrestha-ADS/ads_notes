# *20-Days Node.js REST API Learning Plan*

# PHASE 1 — Learn by Building (Days 1–7)

You should already start seeing working APIs in the first few days.

---

# DAY 1 — Node.js Fundamentals for Backend

## Learn

* What backend actually does
* How Node.js works
* npm basics
* Modules
* Express introduction
* Request & response
* JSON APIs
* Environment variables

## Practical

Build:

```bash id="x4c6qg"
GET /hello
GET /about
POST /data
```

## Goal

Understand:

* how APIs receive requests
* how responses are returned

---

# DAY 2 — Express.js & Routing

## Learn

* Express app structure
* Routes
* Middleware
* Route params
* Query params
* Status codes

## Practical

Build:

```bash id="t72d3e"
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id
```

## Goal

Understand CRUD APIs.

---

# DAY 3 — PostgreSQL Integration

## Learn

* Database basics
* Tables
* Rows
* Primary keys
* Relationships

## Practical

Connect:

* Node.js + PostgreSQL

Create:

* users table
* products table

## Goal

Store real data in database.

---

# DAY 4 — ORM (Prisma Recommended)

## Learn

* Why ORM is used
* Models
* Migrations
* CRUD using ORM

## Practical

Build:

* Create user
* Update user
* Delete user
* List users

## Goal

You should stop writing fake in-memory APIs.

---

# DAY 5 — Proper Project Structure

## Learn

* Controllers
* Routes
* Services
* Middlewares
* Utilities

## Practical

Refactor previous project into clean structure.

## Goal

Avoid messy backend code.

---

# DAY 6 — Validation & Error Handling

## Learn

* Input validation
* Global error handling
* try/catch strategy
* Custom errors

## Libraries

* Zod or Joi

## Practical

Validate:

* register API
* product API

## Goal

Build safe APIs.

---

# DAY 7 — Authentication with JWT

## Learn

* Password hashing
* JWT tokens
* Login flow
* Protected routes

## Libraries

* bcrypt
* jsonwebtoken

## Practical

Build:

* Register
* Login
* Protected profile API

## Goal

You can now build secure APIs.

---

# PHASE 2 — Real Backend Engineering (Days 8–14)

This phase teaches you, how professionals structure them.

---

# DAY 8 — Authorization & Roles

## Learn

* Authentication vs authorization
* Role-based access

## Practical

Create:

* Admin
* Staff
* Customer

## Goal

Control API permissions.

---

# DAY 9 — Advanced REST APIs

## Learn

* Pagination
* Filtering
* Searching
* Sorting

## Practical

Build advanced product listing API.

## Goal

Create professional APIs.

---

# DAY 10 — File Uploads

## Learn

* Multipart form data
* File uploads
* Image validation

## Libraries

* Multer

## Practical

Upload:

* profile images
* product images

---

# DAY 11 — Security Essentials

## Learn

* CORS
* Helmet
* Rate limiting
* SQL injection basics
* API security

## Practical

Secure the whole API.

## Goal

Understand backend security basics.

---

# DAY 12 — Logging & Debugging

## Learn

* Request logging
* Error logging
* Debugging APIs

## Libraries

* Morgan
* Winston/Pino

## Practical

Create centralized logger.

---

# DAY 13 — Database Relationships & Transactions

## Learn

* One-to-many
* Many-to-many
* Transactions

## Practical

Build:

* Orders
* Order items

## Goal

Understand real business data structure.

---

# DAY 14 — API Documentation

## Learn

* Swagger/OpenAPI

## Practical

Generate API documentation.

## Goal

You can share APIs professionally.

---

# PHASE 3 — Production-Level Backend (Days 15–20)

Now moving toward real-world backend engineering.

---

# DAY 15 — Redis Caching

## Learn

* What caching is
* Redis basics
* API caching

## Practical

Cache product APIs.

---

# DAY 16 — Background Jobs & Queues

## Learn

* Why queues are needed
* Email jobs
* Async processing

## Libraries

* BullMQ

## Practical

Send welcome email in background.

---

# DAY 17 — Testing APIs

## Learn

* Unit testing
* Integration testing

## Libraries

* Jest
* Supertest

## Practical

Test auth APIs.

---

# DAY 18 — Docker Basics

## Learn

* Docker fundamentals
* Containerization

## Practical

Dockerize:

* Node.js app
* PostgreSQL

---

# DAY 19 — Deployment

## Learn

* Environment setup
* PM2 basics
* VPS/Cloud deployment

## Deploy

To:

* Render
* Railway
* VPS

---

# DAY 20 — Final Production Project

## Build Complete REST API

### Features

* JWT auth
* RBAC
* PostgreSQL
* Validation
* File uploads
* Logging
* Swagger docs
* Docker deployment
* Redis caching

---