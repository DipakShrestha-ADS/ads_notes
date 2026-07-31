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

## 2. Continue the Campus Store Project

Start with the completed Level 14 checkpoint from [Day 14](<Day14-Authentication with JWT and Password Hashing.md>). If you missed that class, open its project preview and copy that checkpoint before continuing.

Run the role migration, generate Prisma Client, then run `npm run seed`.

For today’s lesson, work only with these project files:

- **Replace `prisma/schema.prisma`**: Add the Role enum and User role field.
- **Edit `src/controllers/authController.js`**: Include the role in JWTs and profile responses.
- **Create `src/middlewares/authorize.js`**: Allow only listed roles to continue.
- **Edit `src/routes/productRoutes.js`**: Require ADMIN for create, update, and delete.
- **Create `prisma/seed.js`**: Create a repeatable development administrator account.

The detailed lesson below explains the new concept. The connected Campus Store upgrade at the end shows how these changes fit into the growing project.

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
  url      = env("DATABASE_URL")
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
npx prisma migrate dev --config prisma/prisma.config.js --name add_role_to_user
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
npx prisma studio --config prisma/prisma.config.js
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

---

## Campus Store Storyline Project - Level 15

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 15 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 14 is your starting checkpoint. You can review it in [Day 14](<Day14-Authentication with JWT and Password Hashing.md>).

You add CUSTOMER and ADMIN roles and protect product-changing routes.

### Today’s Project Level

Run the role migration, generate Prisma Client, then run `npm run seed`.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Edit | `package.json` | Add the repeatable database seed command. |
| Replace | `prisma/schema.prisma` | Add the Role enum and User role field. |
| Edit | `src/controllers/authController.js` | Include the role in JWTs and profile responses. |
| Create | `src/middlewares/authorize.js` | Allow only listed roles to continue. |
| Edit | `src/routes/productRoutes.js` | Require ADMIN for create, update, and delete. |
| Create | `prisma/seed.js` | Create a repeatable development administrator account. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 14 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 15 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Edit `package.json`

Add the repeatable database seed command.

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
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "prisma": "^6.19.0"
  }
}
~~~

This is the complete Level 15 version of `package.json`. Add the repeatable database seed command. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Replace `prisma/schema.prisma`

Add the Role enum and User role field.

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

enum Role {
  CUSTOMER
  ADMIN
}

model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String
  role      Role      @default(CUSTOMER)
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

This is the complete Level 15 version of `prisma/schema.prisma`. Add the Role enum and User role field. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 3 — Edit `src/controllers/authController.js`

Include the role in JWTs and profile responses.

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

This is the complete Level 15 version of `src/controllers/authController.js`. Include the role in JWTs and profile responses. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Create `src/middlewares/authorize.js`

Allow only listed roles to continue.

**File: `src/middlewares/authorize.js`**

~~~javascript
export function authorize(...allowedRoles) {
  return function requireAllowedRole(req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission for this action' });
    }
    next();
  };
}
~~~

This is the complete Level 15 version of `src/middlewares/authorize.js`. Allow only listed roles to continue. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 5 — Edit `src/routes/productRoutes.js`

Require ADMIN for create, update, and delete.

**File: `src/routes/productRoutes.js`**

~~~javascript
import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/productController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize('ADMIN'), createProduct);
router.put('/:id', authenticate, authorize('ADMIN'), updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteProduct);

export default router;
~~~

This is the complete Level 15 version of `src/routes/productRoutes.js`. Require ADMIN for create, update, and delete. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 6 — Create `prisma/seed.js`

Create a repeatable development administrator account.

**File: `prisma/seed.js`**

~~~javascript
import bcrypt from 'bcrypt';
import prisma from '../src/db/prisma.js';

const password = await bcrypt.hash('Admin123!', 12);
await prisma.user.upsert({
  where: { email: 'admin@campus.test' },
  update: { role: 'ADMIN' },
  create: {
    name: 'Campus Administrator',
    email: 'admin@campus.test',
    password,
    role: 'ADMIN',
  },
});

await prisma.$disconnect();
console.log('Development administrator is ready.');
~~~

This is the complete Level 15 version of `prisma/seed.js`. Create a repeatable development administrator account. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Try to create a product with a CUSTOMER token, then repeat with an ADMIN token.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 15, your reference project has this cumulative structure:

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
│   │   └── 20260731000400_add_roles/
│   │       └── migration.sql
│   ├── prisma.config.js
│   ├── schema.prisma
│   └── seed.js
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
│   │   ├── authorize.js
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

- Allows everyone to browse products.
- Allows only administrators to change products.
- Returns `403` for authenticated users without permission.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Try to create a product with a CUSTOMER token, then repeat with an ADMIN token.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Create permission rules that match the responsibilities in an assigned system.

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

The catalogue is protected, but a large list is difficult to browse. Level 16 adds professional query features. Continue with [Day 16](<Day16-Advanced REST API Features.md>).
