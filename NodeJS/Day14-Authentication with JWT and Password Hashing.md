# Day 14 - Authentication with JWT and Password Hashing

## What You Will Learn Today

- What authentication is and how the login flow works step by step
- How to hash passwords using bcrypt before storing them in the database
- How to verify a password during login without storing the original
- What a JWT is, what it contains, and how it proves identity
- How to generate and verify JWT tokens in Node.js
- How to protect routes so only logged-in users can access them

---

## 1. What Is Authentication

Authentication answers the question: who are you?

When you log in to any application, you prove your identity using your email and password. The server checks if you are who you claim to be. If yes, it gives you a token, which is like a digital key card. You use that key card to access protected parts of the application.

Without authentication, anyone who knows a URL can access any data. With authentication, private data is only accessible after proving identity.

The full login flow you will build today:

1. User registers with name, email, and password
2. Password is hashed before saving - the real password is never stored
3. User logs in with email and password
4. Server verifies the password against the stored hash
5. Server creates a JWT token and sends it back to the user
6. For every protected request, the user sends the token in the request header
7. Server verifies the token and extracts the user's identity from it

---

## 2. Installing Packages

```bash
npm i bcrypt jsonwebtoken
```

| Package | Purpose |
|---|---|
| bcrypt | Hash passwords before storing them, compare passwords during login |
| jsonwebtoken | Create and verify JWT tokens |

---

## 3. Project Setup

```bash
mkdir day14-auth
cd day14-auth
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg zod bcrypt jsonwebtoken
npm i prisma --save-dev
npm i -D nodemon
mkdir -p src/routes src/controllers src/db src/middlewares src/schemas
```

`package.json`:

```json
{
  "name": "day14-auth",
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
POSTGRES_DB=day14_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/day14_db?schema=public"
JWT_SECRET=your_very_long_and_random_secret_key_change_this_in_production
```

The `JWT_SECRET` is used to sign and verify tokens. It is kept in `.env` and never committed to Git. Use a long, random string in production.

`.gitignore`:

```
node_modules/
.env
dist/
```

`docker-compose.yaml` - same as previous days. Change the port if needed.

Start the database: `podman compose up -d`

---

## 4. Prisma Setup

```bash
npx prisma init
mv prisma/prisma.config.ts prisma/prisma.config.js
```

`prisma/schema.prisma`:

```prisma
generator client {
  provider     = "prisma-client-js"
  output       = "../src/generated/prisma"
  moduleFormat = "esm"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String   // stores the hashed password, never the real one
  createdAt DateTime @default(now())
}
```

```bash
npx prisma migrate dev --name create_users_with_auth
```

Create `src/db/prisma.js` (same as Day 11).

---

## 5. Validation Schemas

```javascript
// src/schemas/authSchema.js
import { z } from 'zod';

// Schema for the registration request
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for the login request - only email and password
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
```

---

## 6. Auth Controller

```javascript
// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';

// POST /auth/register
export async function register(req, res) {
  // Step 1: validate the incoming data
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({ field: e.path[0], message: e.message }));
    return res.status(400).json({ success: false, errors });
  }

  const { name, email, password } = result.data;

  try {
    // Step 2: hash the password before saving
    // 10 is the salt rounds - higher = more secure but slower to compute
    // bcrypt.hash runs the hashing algorithm 2^10 (1024) times
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: save the user with the hashed password
    // NEVER save the original password to the database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Step 4: return the user but exclude the password field
    // Destructure to remove password from the response
    const { password: _removed, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: userWithoutPassword,
    });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /auth/login
export async function login(req, res) {
  // Step 1: validate the request
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({ field: e.path[0], message: e.message }));
    return res.status(400).json({ success: false, errors });
  }

  const { email, password } = result.data;

  try {
    // Step 2: find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Use a generic message - never say "user not found" as that reveals account info
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Step 3: compare the incoming plain text password against the stored hash
    // bcrypt.compare returns true if they match, false if not
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Step 4: create a JWT token
    // The payload is embedded in the token - never put sensitive data here
    const token = jwt.sign(
      { id: user.id, email: user.email },  // payload: data stored inside the token
      process.env.JWT_SECRET,              // secret key used to sign it
      { expiresIn: '7d' }                  // token expires after 7 days
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /auth/profile (protected route)
export async function getProfile(req, res) {
  // req.user is attached by the authenticate middleware before this runs
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        // password is deliberately not selected - never return hashed passwords
      },
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
```

---

## 7. Authentication Middleware

This middleware checks every protected request for a valid JWT token.

```javascript
// src/middlewares/auth.js
import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  // The token is sent in the Authorization header in this format:
  // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token was provided at all
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  // Remove the "Bearer " prefix to get the raw token string
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the same secret it was signed with
    // If valid, decoded contains the payload: { id, email, iat, exp }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to req so route handlers can access it
    req.user = decoded;

    next();   // token is valid, continue to the route handler
  } catch (err) {
    // jwt.verify throws if the token is expired, tampered, or invalid
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
```

---

## 8. Auth Routes

```javascript
// src/routes/authRoutes.js
import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/register', register);                    // public - no auth required
router.post('/login', login);                          // public - no auth required
router.get('/profile', authenticate, getProfile);      // protected - authenticate runs first

export default router;
```

When you add `authenticate` as middleware before `getProfile`, Express calls `authenticate` first. If the token is valid, it calls `next()` and `getProfile` runs. If not, it returns 401 and `getProfile` never runs.

---

## 9. src/server.js

```javascript
// src/server.js
import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Day 14 - Authentication working' });
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

## 10. Testing the Full Auth Flow

Step 1 - Register:
```
POST http://localhost:8888/auth/register
Body: { "name": "Alice", "email": "alice@example.com", "password": "secret123" }
Expected: 201 with user data (no password in response)
```

Step 2 - Login:
```
POST http://localhost:8888/auth/login
Body: { "email": "alice@example.com", "password": "secret123" }
Expected: 200 with token string
```

Step 3 - Access profile with token:
```
GET http://localhost:8888/auth/profile
Header: Authorization: Bearer <paste_token_here>
Expected: 200 with user data
```

Step 4 - Access profile without token:
```
GET http://localhost:8888/auth/profile
(no Authorization header)
Expected: 401 Access denied
```

Step 5 - Wrong password:
```
POST http://localhost:8888/auth/login
Body: { "email": "alice@example.com", "password": "wrongpassword" }
Expected: 401 Invalid email or password
```

---

## 11. What a JWT Looks Like

A JWT has three parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbGljZUBleGFtcGxlLmNvbSJ9.abc123
|________ header ________|             |_________ payload _________|              |signature|
```

- Header: the algorithm used to sign the token
- Payload: the data you embedded (`id`, `email`, `iat`, `exp`)
- Signature: proves the token was not tampered with after it was created

You can paste any JWT into `jwt.io` to decode and inspect it. The payload is readable by anyone, so never put passwords or sensitive data inside the token.

---

## Summary

- Passwords must be hashed with `bcrypt.hash()` before saving - never store plain text passwords
- `bcrypt.compare()` checks a plain text password against a stored hash without revealing the original
- A JWT carries user identity in a signed, verifiable package
- `jwt.sign(payload, secret, options)` creates a token
- `jwt.verify(token, secret)` checks validity and returns the decoded payload
- The `authenticate` middleware verifies the token and attaches `req.user` for route handlers
- Always use generic login error messages - never reveal which field was wrong

---

## Practice Tasks

1. Register three users and verify they appear in Prisma Studio with hashed passwords.
2. Login with a correct password and an incorrect one. Observe the difference in response.
3. Use the token from login to access the profile route.
4. Modify the token slightly in Thunder Client and observe the invalid token error.
5. Check the user record in Prisma Studio and confirm the `password` field is a bcrypt hash (starts with `$2b$`).

---

## Homework

Add authentication to the mini project from Day 13. Users should be able to register and log in. Protect the delete user and delete product routes so only authenticated users can access them. Test the full flow in Thunder Client.
