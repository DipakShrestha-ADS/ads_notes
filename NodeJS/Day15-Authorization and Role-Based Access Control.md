# Day 15 - Authorization and Role-Based Access Control

## What You Will Learn Today

- The difference between authentication and authorization
- How to add a role field to the User model in Prisma
- How to include the role in the JWT token
- How to build middleware that checks user roles
- How to protect admin-only routes using role checks
- How to check resource ownership instead of just role

---

## 1. Authentication vs Authorization

These two words are often confused. The distinction is simple:

Authentication: proving who you are.
- Example: logging in with email and password

Authorization: checking what you are allowed to do.
- Example: only admins can delete users

On Day 14 you built authentication - the login flow and JWT. Today you build authorization - checking what a logged-in user is permitted to do.

After authentication, you know who the user is. Authorization is the next question: can this particular user perform this particular action?

Status codes for each:
- `401 Unauthorized` - not authenticated (no valid token)
- `403 Forbidden` - authenticated but not authorized (valid token, but wrong role)

---

## 2. Project Setup

```bash
mkdir day15-authorization
cd day15-authorization
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg zod bcrypt jsonwebtoken
npm i prisma --save-dev
npm i -D nodemon
mkdir -p src/routes src/controllers src/db src/middlewares src/schemas
```

`package.json`:

```json
{
  "name": "day15-authorization",
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
POSTGRES_DB=day15_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/day15_db?schema=public"
JWT_SECRET=your_very_long_and_random_secret_key_change_this_in_production
```

`.gitignore`:

```
node_modules/
.env
dist/
```

`docker-compose.yaml` - same as previous days.

Start the database: `podman compose up -d`

---

## 3. Prisma Setup with Role Enum

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

enum Role {
  USER
  ADMIN
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)    // every new user gets the USER role by default
  createdAt DateTime @default(now())
}
```

Two additions from Day 14:
- `enum Role` defines the allowed role values
- `role Role @default(USER)` adds the role field with a default of `USER`

```bash
npx prisma migrate dev --name add_role_to_user
```

Create `src/db/prisma.js` (same as Day 11).

---

## 4. Update the JWT Payload to Include Role

When generating the token during login, include the role. This way the middleware can check the role from the token without making a database query.

```javascript
// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';

export async function register(req, res) {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({ field: e.path[0], message: e.message }));
    return res.status(400).json({ success: false, errors });
  }

  const { name, email, password } = result.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const { password: _removed, ...userWithoutPassword } = user;
    res.status(201).json({ success: true, message: 'Account created', data: userWithoutPassword });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Email already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function login(req, res) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({ field: e.path[0], message: e.message }));
    return res.status(400).json({ success: false, errors });
  }

  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    // Include role in the JWT payload so middleware can check it without a DB query
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
```

---

## 5. Authentication Middleware (from Day 14)

```javascript
// src/middlewares/auth.js
import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify and decode the token - decoded now includes: { id, email, role, iat, exp }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;    // attach the full decoded payload to req
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
```

---

## 6. Authorization Middleware

The `authorize` function is a factory - it takes allowed roles as arguments and returns a middleware function.

```javascript
// src/middlewares/authorize.js

// authorize(...allowedRoles) returns a middleware function
// Usage: authorize('ADMIN') or authorize('ADMIN', 'USER')
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    // req.user was set by the authenticate middleware - it must run first
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // Check if the user's role is in the list of allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        // 403 Forbidden = authenticated but not permitted
        message: 'You do not have permission to perform this action',
      });
    }

    next();   // role is allowed, continue to the route handler
  };
}
```

---

## 7. Applying Authorization to Routes

```javascript
// src/routes/userRoutes.js
import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

// Public routes - no authentication needed
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);              // open registration

// Authenticated route - any logged-in user can update
router.put('/:id', authenticate, updateUser);

// Admin-only route - authenticate first, then check for ADMIN role
// If token is missing -> 401. If role is not ADMIN -> 403. If ADMIN -> runs deleteUser.
router.delete('/:id', authenticate, authorize('ADMIN'), deleteUser);

export default router;
```

The order matters. `authenticate` must always run before `authorize` because `authorize` reads `req.user` which is set by `authenticate`.

---

## 8. Creating an Admin User

New users always get the `USER` role. To create an admin, you can use Prisma Studio or a seed script.

### Using Prisma Studio

```bash
npx prisma studio
```

Find the user, click the `role` field, change it from `USER` to `ADMIN`, and save.

### Using a Seed Script

```javascript
// prisma/seed.js
import prisma from '../src/db/prisma.js';
import bcrypt from 'bcrypt';

async function seed() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // upsert creates the record if it does not exist, updates it if it does
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},                    // if already exists, do nothing
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',               // set role explicitly to ADMIN
    },
  });

  console.log('Admin user created: admin@example.com / admin123');
  await prisma.$disconnect();
}

seed();
```

Run it once:

```bash
node prisma/seed.js
```

---

## 9. Users Controller with Role Awareness

```javascript
// src/controllers/userController.js
import prisma from '../db/prisma.js';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema.js';

export async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true,
        role: true, createdAt: true,
        // password excluded intentionally
      },
    });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getUserById(req, res) {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createUser(req, res) {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({ field: e.path[0], message: e.message }));
    return res.status(400).json({ success: false, errors });
  }
  try {
    const user = await prisma.user.create({
      data: result.data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Email already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateUser(req, res) {
  const id = parseInt(req.params.id);

  // Ownership check: a user can only update their own account (unless they are ADMIN)
  if (req.user.id !== id && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own account',
    });
  }

  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({ field: e.path[0], message: e.message }));
    return res.status(400).json({ success: false, errors });
  }
  try {
    const user = await prisma.user.update({
      where: { id },
      data: result.data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'User not found' });
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteUser(req, res) {
  // This route is protected by authorize('ADMIN') in the routes file
  // Only ADMIN users ever reach this function
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'User not found' });
    res.status(500).json({ success: false, message: err.message });
  }
}
```

---

## 10. src/server.js

```javascript
// src/server.js
import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Day 15 - Authorization working' });
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

## 11. Testing Role-Based Access

Step 1 - Create a regular user:
```
POST /auth/register
{ "name": "Bob", "email": "bob@example.com", "password": "bob123" }
```

Step 2 - Create the admin user:
```bash
node prisma/seed.js
```

Step 3 - Login as Bob, get his token.

Step 4 - Try to delete a user using Bob's token:
```
DELETE /users/1
Authorization: Bearer <bob_token>
Expected: 403 - You do not have permission to perform this action
```

Step 5 - Login as admin (`admin@example.com` / `admin123`), get admin token.

Step 6 - Delete a user using admin token:
```
DELETE /users/1
Authorization: Bearer <admin_token>
Expected: 200 - User deleted
```

Step 7 - Try to update another user's account as Bob:
```
PUT /users/1
Authorization: Bearer <bob_token>  (Bob's id is 2, not 1)
Expected: 403 - You can only update your own account
```

---

## Summary

- Authentication is proving who you are. Authorization is checking what you can do.
- Add a `role` field using a Prisma enum to define allowed values cleanly
- Include the role in the JWT payload to avoid extra database lookups on every request
- `authenticate` verifies the token and sets `req.user`
- `authorize(...roles)` checks `req.user.role` against the allowed roles
- Always use `authenticate` before `authorize` - they work as a pair
- `401 Unauthorized` = no valid token. `403 Forbidden` = valid token but wrong role.
- Ownership checks compare `req.user.id` with the resource's owner ID

---

## Practice Tasks

1. Set up the project, run migrations, and create the admin user using the seed script.
2. Test the delete route as a regular user (expect 403) and as admin (expect 200).
3. Add `authorize('ADMIN')` to the product delete route as well.
4. Try updating a different user's account with your own token (expect 403).
5. Login as admin and update any user's account (expect 200, admins can do anything).

---

## Homework

Add role-based authorization to the mini project from Day 13. Regular users can create and read. Only admins can delete. Test both scenarios with different JWT tokens and verify the correct 401 and 403 responses appear.
