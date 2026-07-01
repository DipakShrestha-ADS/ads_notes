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

## 2. Project Setup

```bash
mkdir day19-security
cd day19-security
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg cors helmet express-rate-limit
npm i prisma --save-dev
npm i -D nodemon
mkdir -p src/routes src/controllers src/db src/middlewares
```

`package.json`:

```json
{
  "name": "day19-security",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

`.env`:

```
PORT=8888
POSTGRES_USER=userdipak
POSTGRES_PASSWORD=user_password
POSTGRES_DB=day19_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/day19_db?schema=public"
ALLOWED_ORIGIN=http://localhost:5173
```

`ALLOWED_ORIGIN` will be used for CORS configuration below. Change it to match your actual frontend URL.

`.gitignore`:

```
node_modules/
.env
dist/
```

`docker-compose.yaml` - same as previous days.

Start the database: `podman compose up -d`

---

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
