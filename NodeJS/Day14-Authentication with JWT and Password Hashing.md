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

| Package      | Purpose                                                            |
| ------------ | ------------------------------------------------------------------ |
| bcrypt       | Hash passwords before storing them, compare passwords during login |
| jsonwebtoken | Create and verify JWT tokens                                       |

---

## 3. Continue the Campus Store Project

Start with the completed Level 13 checkpoint from [Day 13](<Day13-Mini Project 1 User and Product API.md>). If you missed that class, open its project preview and copy that checkpoint before continuing.

Run `npm install`, migrate with `add_authentication`, and restart the server.

For today’s lesson, work only with these project files:

- **Replace `prisma/schema.prisma`**: Add the hashed password field to User.
- **Create `src/schemas/authSchemas.js`**: Validate registration and login bodies.
- **Create `src/controllers/authController.js`**: Register users, compare passwords, issue tokens, and return profiles.
- **Create `src/middlewares/authenticate.js`**: Verify bearer tokens and attach the user identity.
- **Create `src/routes/authRoutes.js`**: Expose register, login, and profile endpoints.
- **Edit `.env.example`**: Document `JWT_SECRET`.

The detailed lesson below explains the new concept. The connected Campus Store upgrade at the end shows how these changes fit into the growing project.

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
  url      = env("DATABASE_URL")
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
npx prisma migrate dev --config prisma/prisma.config.js --name create_users_with_auth
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

---

## Campus Store Storyline Project - Level 14

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 14 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 13 is your starting checkpoint. You can review it in [Day 13](<Day13-Mini Project 1 User and Product API.md>).

You hash passwords, issue JWTs, and add a protected profile route.

### Today’s Project Level

Run `npm install`, migrate with `add_authentication`, and restart the server.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Edit | `package.json` | Add bcrypt and JSON Web Token for secure identity handling. |
| Regenerate | `package-lock.json` | Record the authentication dependency tree. |
| Replace | `prisma/schema.prisma` | Add the hashed password field to User. |
| Create | `src/schemas/authSchemas.js` | Validate registration and login bodies. |
| Create | `src/controllers/authController.js` | Register users, compare passwords, issue tokens, and return profiles. |
| Create | `src/middlewares/authenticate.js` | Verify bearer tokens and attach the user identity. |
| Create | `src/routes/authRoutes.js` | Expose register, login, and profile endpoints. |
| Edit | `.env.example` | Document `JWT_SECRET`. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 13 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 14 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Edit `package.json`

Add bcrypt and JSON Web Token for secure identity handling.

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
    "db:studio": "prisma studio --config prisma/prisma.config.js"
  },
  "dependencies": {
    "dotenv": "^16.6.1",
    "express": "^5.1.0",
    "pg": "^8.16.3",
    "@prisma/adapter-pg": "^6.19.0",
    "@prisma/client": "^6.19.0",
    "zod": "^4.1.12",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "prisma": "^6.19.0"
  }
}
~~~

This is the complete Level 14 version of `package.json`. Add bcrypt and JSON Web Token for secure identity handling. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Regenerate `package-lock.json`

Do not type or edit `package-lock.json` by hand. Record the authentication dependency tree. Run `npm install` from the `campus-store-api/` root; npm will create or refresh this exact file automatically.

#### Step 3 — Replace `prisma/schema.prisma`

Add the hashed password field to User.

**File: `prisma/schema.prisma`**

~~~prisma
generator client {
  provider     = "prisma-client-js"
  output       = "../src/generated/prisma"
  moduleFormat = "esm"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Product {
  id          Int       @id @default(autoincrement())
  title       String
  price       Float
  description String?
  userId      Int?
  user        User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
~~~

This is the complete Level 14 version of `prisma/schema.prisma`. Add the hashed password field to User. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Create `src/schemas/authSchemas.js`

Validate registration and login bodies.

**File: `src/schemas/authSchemas.js`**

~~~javascript
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
~~~

This is the complete Level 14 version of `src/schemas/authSchemas.js`. Validate registration and login bodies. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 5 — Create `src/controllers/authController.js`

Register users, compare passwords, issue tokens, and return profiles.

**File: `src/controllers/authController.js`**

~~~javascript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';
import { loginSchema, registerSchema } from '../schemas/authSchemas.js';

function tokenFor(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
}

export async function register(req, res, next) {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Validation failed', errors: result.error.flatten().fieldErrors });
  }
  try {
    const existing = await prisma.user.findUnique({ where: { email: result.data.email } });
    if (existing) return res.status(409).json({ message: 'Email is already registered' });
    const password = await bcrypt.hash(result.data.password, 12);
    const user = await prisma.user.create({
      data: { ...result.data, password },
      select: { id: true, name: true, email: true, role: true },
    });
    res.status(201).json({ data: user, token: tokenFor(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ message: 'Invalid login body' });
  try {
    const user = await prisma.user.findUnique({ where: { email: result.data.email } });
    const valid = user && await bcrypt.compare(result.data.password, user.password);
    if (!valid) return res.status(401).json({ message: 'Email or password is incorrect' });
    res.json({ token: tokenFor(user) });
  } catch (error) {
    next(error);
  }
}

export async function profile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}
~~~

This is the complete Level 14 version of `src/controllers/authController.js`. Register users, compare passwords, issue tokens, and return profiles. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 6 — Create `src/middlewares/authenticate.js`

Verify bearer tokens and attach the user identity.

**File: `src/middlewares/authenticate.js`**

~~~javascript
import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const [scheme, token] = (req.get('authorization') || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Bearer token required' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
}
~~~

This is the complete Level 14 version of `src/middlewares/authenticate.js`. Verify bearer tokens and attach the user identity. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 7 — Create `src/routes/authRoutes.js`

Expose register, login, and profile endpoints.

**File: `src/routes/authRoutes.js`**

~~~javascript
import { Router } from 'express';
import { login, profile, register } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, profile);

export default router;
~~~

This is the complete Level 14 version of `src/routes/authRoutes.js`. Expose register, login, and profile endpoints. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 8 — Edit `.env.example`

Document `JWT_SECRET`.

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
~~~

This is the complete Level 14 version of `.env.example`. Document `JWT_SECRET`. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Register, log in, copy the token, then request `/auth/profile` with `Authorization: Bearer <token>`.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 14, your reference project has this cumulative structure:

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
│   │   └── 20260731000300_add_authentication/
│   │       └── migration.sql
│   ├── prisma.config.js
│   └── schema.prisma
├── src/
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
│   │   ├── errorHandler.js
│   │   ├── fileLogger.js
│   │   ├── requestLogger.js
│   │   └── requireStoreKey.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── schemas/
│   │   ├── authSchemas.js
│   │   ├── productSchemas.js
│   │   └── userSchemas.js
│   └── server.js
├── .env.example
├── .gitignore
├── docker-compose.yaml
├── package-lock.json
└── package.json
```

Your completed checkpoint now:

- Never stores plain-text passwords.
- Returns a token after login.
- Protects `GET /auth/profile`.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Register, log in, copy the token, then request `/auth/profile` with `Authorization: Bearer <token>`.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Add identity whenever an assigned project must know who is making a request.

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

A valid token proves identity, but it does not decide permissions. Level 15 adds roles. Continue with [Day 15](<Day15-Authorization and Role-Based Access Control.md>).
