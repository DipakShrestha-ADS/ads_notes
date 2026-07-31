# Day 19 - Security Essentials for Node.js APIs

## What You Will Learn Today

- What CORS is and how to configure it correctly
- How Helmet protects your API with secure HTTP headers
- How to add rate limiting to prevent abuse
- Safe handling of environment variables and secrets
- A refresher on SQL injection and how Prisma already protects you
- A checklist of basic security practices for every API you build

---

## 1. Why Backend Security Matters

Your API is a public door into your data. Every route you expose is something an attacker can try to abuse. Security is not something you add at the very end. It should be part of how you build from day one.

Think about a house. Locking the front door is not enough if the windows are open, the back door has no lock, and you keep spare keys under the doormat. Backend security is the same. You need multiple layers of protection, not just one.

Today covers four practical layers: CORS, Helmet, rate limiting, and environment variable safety.

---

## 2. Continue the Campus Store Project

Start with the completed Level 18 checkpoint from [Day 18](<Day18-API Documentation with Swagger.md>). If you missed that class, open its project preview and copy that checkpoint before continuing.

Run `npm install` to install Helmet, CORS, and Express Rate Limit.

For today’s lesson, work only with these project files:

- **Create `src/config/security.js`**: Build the shared CORS and rate-limit configuration.
- **Edit `src/server.js`**: Register Helmet, CORS, general limits, and stricter authentication limits.
- **Edit `.env.example`**: Document `ALLOWED_ORIGIN`.

The detailed lesson below explains the new concept. The connected Campus Store upgrade at the end shows how these changes fit into the growing project.

## 3. CORS - Cross-Origin Resource Sharing

By default, browsers block a webpage running on one origin (like `http://localhost:5173`) from making requests to an API running on a different origin (like `http://localhost:8888`). This is a browser security rule called the same-origin policy.

CORS is how your server explicitly tells browsers which other origins are allowed to talk to it.

```bash
npm i cors
```

```javascript
// src/server.js (partial)
import cors from 'cors';

// Without any options, cors() allows every origin - fine for learning, risky for production
app.use(cors());
```

For production, restrict CORS to only the origins you trust:

```javascript
// src/server.js (partial) - safer configuration
import cors from 'cors';

const corsOptions = {
  // Only allow requests from the origin defined in .env
  origin: process.env.ALLOWED_ORIGIN,

  // Allow these HTTP methods from the browser
  methods: ['GET', 'POST', 'PUT', 'DELETE'],

  // Allow the browser to send cookies or authorization headers
  credentials: true,
};

app.use(cors(corsOptions));
```

Without CORS configured correctly, your frontend running on a different port will get a browser error like "blocked by CORS policy" even though the API itself works fine when tested with Postman. Postman does not enforce CORS because it is not a browser.

---

## 4. Helmet - Secure HTTP Headers

Helmet sets a group of HTTP response headers that protect against common attacks like clickjacking and content sniffing.

```bash
npm i helmet
```

```javascript
// src/server.js (partial)
import helmet from 'helmet';

// Adding helmet() is a single line that applies many security headers at once
app.use(helmet());
```

Some of what Helmet does automatically:

| Header                            | Protection                                                               |
| --------------------------------- | ------------------------------------------------------------------------ |
| `X-Content-Type-Options: nosniff` | Stops browsers from guessing file types, preventing certain attacks      |
| `X-Frame-Options: DENY`           | Prevents your site from being embedded in a hidden iframe (clickjacking) |
| `Strict-Transport-Security`       | Forces browsers to use HTTPS instead of HTTP                             |

You do not need to understand every header in detail. Just remember: always call `app.use(helmet())` early in your middleware stack for every project.

---

## 5. Rate Limiting

Rate limiting stops one client from sending too many requests in a short time. Without it, someone could hammer your login route with thousands of password guesses per second, or overload your server with repeated requests.

```bash
npm i express-rate-limit
```

```javascript
// src/middlewares/rateLimiter.js
import rateLimit from 'express-rate-limit';

// General limiter for the whole API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes, measured in milliseconds
  max: 100,                   // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
  },
  standardHeaders: true,      // return rate limit info in RateLimit-* headers
  legacyHeaders: false,       // disable the older X-RateLimit-* headers
});

// Stricter limiter specifically for the login route to prevent brute force attacks
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                     // only 5 login attempts per 15 minutes per IP
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
});
```

Apply the general limiter to the whole app, and the strict limiter only to sensitive routes:

```javascript
// src/server.js (partial)
import { generalLimiter } from './middlewares/rateLimiter.js';

app.use(generalLimiter);   // applies to every route
```

```javascript
// src/routes/authRoutes.js (partial)
import { loginLimiter } from '../middlewares/rateLimiter.js';

// loginLimiter runs only on this specific route, on top of the general limiter
router.post('/login', loginLimiter, login);
```

---

## 6. Safe Environment Variable Handling

Environment variables hold secrets like database passwords and JWT keys. A few rules to always follow:

Never commit `.env` to Git. Confirm it is listed in `.gitignore`:

```
node_modules/
.env
dist/
```

Never hardcode secrets directly in your code:

```javascript
// wrong - secret is visible to anyone who reads the code
const token = jwt.sign(payload, 'my-secret-key-12345');

// correct - secret comes from .env, which is never committed
const token = jwt.sign(payload, process.env.JWT_SECRET);
```

Never log full environment variables to the console in production:

```javascript
// wrong - prints every secret to your logs
console.log(process.env);

// correct - log only what you need, and never log secrets
console.log('Server starting on port', process.env.PORT);
```

Use different `.env` values for development and production. A production database password should never be the same as your local development one.

---

## 7. SQL Injection Refresher

You already covered this on Day 10, but it belongs in your security checklist. SQL injection happens when user input is inserted directly into a SQL query string.

```javascript
// dangerous - never build SQL by joining strings with user input
pool.query(`SELECT * FROM users WHERE email = '${email}'`);
```

Using Prisma (from Day 11 onward), this risk is handled for you automatically because Prisma always uses parameterized queries internally, even when you write `where: { email }`. This is one of the reasons this course teaches Prisma. If you ever use the raw `pg` package directly, always use `$1`, `$2` placeholders as shown on Day 10, never string interpolation.

---

## 8. Putting It All Together in server.js

```javascript
// src/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import { generalLimiter } from './middlewares/rateLimiter.js';

const app = express();

// Security middleware should be registered early, before your routes
app.use(helmet());                                       // secure HTTP headers

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true,
}));                                                      // restrict allowed origins

app.use(generalLimiter);                                  // limit request rate per IP

app.use(express.json());                                  // parse JSON bodies

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Day 19 - Security essentials active' });
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

The order matters. Security middleware like `helmet`, `cors`, and rate limiting should run before your route logic, so bad requests are blocked as early as possible.

---

## 9. Testing Security Features

Test CORS by opening your browser console on a different origin and calling `fetch()` against your API. If `ALLOWED_ORIGIN` does not match, you will see a CORS error in the browser console.

Test rate limiting by sending the login request more than 5 times quickly:

```
POST http://localhost:8888/auth/login (repeat 6 times quickly)
Expected on the 6th attempt: 429 Too Many Requests
Message: "Too many login attempts. Please try again in 15 minutes."
```

Test Helmet headers using curl:

```bash
curl -I http://localhost:8888/
```

Look for headers like `X-Content-Type-Options` and `X-Frame-Options` in the response.

---

## Summary

- CORS controls which origins are allowed to call your API from a browser
- Helmet adds a set of secure HTTP headers with a single line of code
- Rate limiting prevents abuse by capping how many requests one IP can send
- Use a stricter rate limit specifically on sensitive routes like login
- Never commit `.env`, never hardcode secrets, never log secrets to the console
- Prisma already protects you from SQL injection through parameterized queries

---

## Practice Tasks

1. Set up the project and add helmet, cors, and rate limiting to your server.
2. Test the general rate limiter by sending more than 100 requests quickly (lower the max temporarily to test faster, like max: 5).
3. Add a stricter rate limiter to your login route and test it triggers after 5 attempts.
4. Use curl or your browser dev tools to confirm Helmet headers are present in responses.
5. Review your `.env` file and confirm no secrets are hardcoded anywhere in your code.

---

## Homework

Add at least three security improvements to your mini project: Helmet, CORS restricted to a specific origin, and rate limiting on your login and register routes. Test that all three are active and working as expected.

---

## Campus Store Storyline Project - Level 19

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 19 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 18 is your starting checkpoint. You can review it in [Day 18](<Day18-API Documentation with Swagger.md>).

You add security headers, restricted CORS, and request rate limits.

### Today’s Project Level

Run `npm install` to install Helmet, CORS, and Express Rate Limit.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Edit | `package.json` | Add Helmet, CORS, and Express Rate Limit. |
| Regenerate | `package-lock.json` | Record the installed security dependency tree. |
| Create | `src/config/security.js` | Build the shared CORS and rate-limit configuration. |
| Edit | `src/server.js` | Register Helmet, CORS, general limits, and stricter authentication limits. |
| Edit | `.env.example` | Document `ALLOWED_ORIGIN`. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 18 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 19 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Edit `package.json`

Add Helmet, CORS, and Express Rate Limit.

**File: `package.json`**

~~~json
{
  "name": "campus-store-api",
  "version": "1.0.0",
  "private": true,
  "description": "Cumulative Campus Store API course project",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "db:generate": "prisma generate --config prisma/prisma.config.js",
    "db:migrate": "prisma migrate dev --config prisma/prisma.config.js",
    "db:studio": "prisma studio --config prisma/prisma.config.js",
    "seed": "node prisma/seed.js"
  },
  "dependencies": {
    "dotenv": "^16.6.1",
    "express": "^5.1.0",
    "pg": "^8.16.3",
    "@prisma/adapter-pg": "^6.19.0",
    "@prisma/client": "^6.19.0",
    "zod": "^4.1.12",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^2.0.2",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1",
    "cors": "^2.8.5",
    "helmet": "^8.1.0",
    "express-rate-limit": "^8.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "prisma": "^6.19.0"
  }
}
~~~

This is the complete Level 19 version of `package.json`. Add Helmet, CORS, and Express Rate Limit. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Regenerate `package-lock.json`

Do not type or edit `package-lock.json` by hand. Record the installed security dependency tree. Run `npm install` from the `campus-store-api/` root; npm will create or refresh this exact file automatically.

#### Step 3 — Create `src/config/security.js`

Build the shared CORS and rate-limit configuration.

**File: `src/config/security.js`**

~~~javascript
import cors from 'cors';
import rateLimit from 'express-rate-limit';

export const corsMiddleware = cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});
~~~

This is the complete Level 19 version of `src/config/security.js`. Build the shared CORS and rate-limit configuration. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Edit `src/server.js`

Register Helmet, CORS, general limits, and stricter authentication limits.

**File: `src/server.js`**

~~~javascript
import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger.js';
import { authLimiter, corsMiddleware, generalLimiter } from './config/security.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());
const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use(helmet());
app.use(corsMiddleware);
app.use(generalLimiter);
app.use('/uploads', express.static(path.resolve(currentDir, '../uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

app.use('/auth', authLimiter, authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use(errorHandler);
const port = Number(process.env.PORT) || 8888;
app.listen(port, () => {
  console.log(`Campus Store API running at http://localhost:${port}`);
});
~~~

This is the complete Level 19 version of `src/server.js`. Register Helmet, CORS, general limits, and stricter authentication limits. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 5 — Edit `.env.example`

Document `ALLOWED_ORIGIN`.

**File: `.env.example`**

~~~properties
# Copy this file to .env, then replace every example value.
PORT=8888
STORE_NAME="Campus Store"
STORE_KEY=campus-secret
POSTGRES_USER=campus_user
POSTGRES_PASSWORD=campus_password
POSTGRES_DB=campus_store
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://campus_user:campus_password@localhost:5555/campus_store?schema=public"
JWT_SECRET=replace_this_with_a_long_random_secret
ALLOWED_ORIGIN=http://localhost:5173
NODE_ENV=development
~~~

This is the complete Level 19 version of `.env.example`. Document `ALLOWED_ORIGIN`. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Inspect response headers, test an unapproved browser origin, and exceed the authentication request limit.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 19, your reference project has this cumulative structure:

```text
campus-store-api/
├── docs/
│   ├── api-plan.md
│   └── data-model.md
├── logs/
│   └── .gitkeep
├── prisma/
│   ├── migrations/
│   │   ├── 20260731000100_create_products/
│   │   │   └── migration.sql
│   │   ├── 20260731000200_add_users/
│   │   │   └── migration.sql
│   │   ├── 20260731000300_add_authentication/
│   │   │   └── migration.sql
│   │   ├── 20260731000400_add_roles/
│   │   │   └── migration.sql
│   │   ├── 20260731000500_add_category/
│   │   │   └── migration.sql
│   │   └── 20260731000600_add_product_image/
│   │       └── migration.sql
│   ├── prisma.config.js
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   │   ├── security.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── data/
│   │   └── products.js
│   ├── db/
│   │   └── prisma.js
│   ├── middlewares/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   ├── fileLogger.js
│   │   ├── requestLogger.js
│   │   ├── requireStoreKey.js
│   │   └── uploadProductImage.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── schemas/
│   │   ├── authSchemas.js
│   │   ├── productSchemas.js
│   │   └── userSchemas.js
│   └── server.js
├── uploads/
│   └── .gitkeep
├── .env.example
├── .gitignore
├── docker-compose.yaml
├── package-lock.json
└── package.json
```

Your completed checkpoint now:

- Adds defensive HTTP headers.
- Allows only the configured frontend origin.
- Slows repeated authentication attacks.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Inspect response headers, test an unapproved browser origin, and exceed the authentication request limit.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Apply a minimum security baseline before publishing any assigned project.

Keep the architecture and replace the Campus Store nouns with the nouns from your assigned project:

| Example project | Campus Store `Product` becomes | Campus Store `User` becomes | Campus Store `Order` becomes |
| --- | --- | --- | --- |
| Library API | Book | Member | Borrowing |
| Course API | Course | Learner | Enrollment |
| Blog API | Post | Author | Comment or Subscription |
| Job Portal API | Job | Applicant | Application |
| Vehicle Rental API | Vehicle | Customer | Booking |

For your own project:

1. Write the name of your main resource.
2. Write the person or role that uses the system.
3. Write the transaction or relationship connecting them.
4. Apply today’s file structure and request flow using those names.
5. Test the same success, invalid-input, and missing-resource situations shown in the Campus Store reference.

### Next Level

The API blocks common abuse, but diagnosing real failures still needs durable logs. Level 20 adds structured logging. Continue with [Day 20](<Day20-Logging and Debugging.md>).
