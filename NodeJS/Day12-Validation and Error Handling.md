# Day 12 - Validation and Error Handling

## What You Will Learn Today

- Why validating incoming data is essential for every API
- How to use Zod to define and validate request schemas
- How to return field-level error messages when validation fails
- How to handle errors properly inside controller functions
- How to build a global error handling middleware
- How to return consistent error responses across the whole API

---

## 1. Why Validation Matters

Every request that comes into your API carries data from the outside world. That data could be:

- Missing a required field
- An email without the `@` symbol
- A negative number where a positive price is expected
- An empty string where a name is required
- A string where a number is expected

Without validation, those bad values go straight into your database. Once corrupted data is in the database, it is hard to clean up and causes bugs everywhere.

Validation means checking that incoming data matches your rules before you process it or touch the database.

---

## 2. Installing Zod

Zod is a schema validation library. You define the shape of valid data once, and Zod checks incoming data against that definition automatically.

```bash
npm i zod
```

No changes to your other packages are needed.

---

## 3. Project Setup

```bash
mkdir day12-validation
cd day12-validation
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg zod
npm i prisma --save-dev
npm i -D nodemon
mkdir -p src/routes src/controllers src/db src/middlewares src/schemas
```

`package.json`:

```json
{
  "name": "day12-validation",
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
POSTGRES_DB=day12_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/day12_db?schema=public"
```

`.gitignore`:

```
node_modules/
.env
dist/
```

`docker-compose.yaml` - same as previous days.

Start the database: `podman compose up -d`

Prisma setup:

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
  createdAt DateTime @default(now())
}
```

Run migration:

```bash
npx prisma migrate dev --name create_users_table
```

Create `src/db/prisma.js` (same as Day 11).

---

## 4. Writing Zod Schemas

A Zod schema describes what valid data looks like. Create a separate folder for these.

```javascript
// src/schemas/userSchema.js
import { z } from 'zod';    // import the z builder from Zod

// Schema for creating a user - defines what a valid request body looks like
export const createUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')    // minimum length rule
    .max(100, 'Name cannot exceed 100 characters'),   // maximum length rule

  email: z.string()
    .email('Please provide a valid email address'),   // must match email format
});

// Schema for updating a user - all fields are optional
// partial() makes every field in the schema optional automatically
export const updateUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .optional(),                                      // not required for update

  email: z.string()
    .email('Please provide a valid email address')
    .optional(),
});
```

---

## 5. Using safeParse in Controllers

`safeParse` checks the data and returns a result object. It never throws an error.

```javascript
// src/controllers/userController.js
import prisma from '../db/prisma.js';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema.js';

// GET /users
export async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /users/:id
export async function getUserById(req, res) {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /users
export async function createUser(req, res) {
  // safeParse returns { success: true, data: {...} } or { success: false, error: {...} }
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    // result.error.errors is an array of all validation problems found
    // Map them to a readable format: which field failed and why
    const errors = result.error.errors.map(e => ({
      field: e.path[0],     // the field name that failed (e.g. "name", "email")
      message: e.message,   // the error message from your schema rule
    }));
    return res.status(400).json({ success: false, errors });
  }

  // result.data contains the validated values - use these, not req.body directly
  const { name, email } = result.data;

  try {
    const user = await prisma.user.create({ data: { name, email } });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
}

// PUT /users/:id
export async function updateUser(req, res) {
  const id = parseInt(req.params.id);
  const result = updateUserSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map(e => ({
      field: e.path[0],
      message: e.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: result.data,   // only updates the fields that were actually sent
    });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
}

// DELETE /users/:id
export async function deleteUser(req, res) {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'User deleted', data: user });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
}
```

---

## 6. Global Error Handling Middleware

Instead of handling every error in every controller, you can create one central error handler. This catches any error that was not handled explicitly.

```javascript
// src/middlewares/errorHandler.js

// Express identifies this as an error handler because it has four parameters
// The first parameter MUST be named err (or similar error variable)
// This middleware must be registered LAST in server.js, after all routes
export function errorHandler(err, req, res, next) {
  // Log the error to the server console for debugging
  console.error(`[Error] ${req.method} ${req.url} - ${err.message}`);

  // Use the error's statusCode if set, otherwise default to 500
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong',
  });
}
```

---

## 7. Using next(err) to Pass Errors to the Handler

When you want the global error handler to respond, call `next(err)` instead of writing `res.status(500)` manually:

```javascript
// src/controllers/userController.js (alternative approach for one function)
export async function getUserById(req, res, next) {
  // Add 'next' as the third parameter when using next(err)
  const id = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;              // attach the status code to the error
      return next(err);                  // pass to global error handler
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);                           // pass any unhandled error to the global handler
  }
}
```

---

## 8. Registering the Error Handler in server.js

```javascript
// src/server.js
import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Day 12 - Validation and error handling working' });
});

// Register the error handler AFTER all routes
// Express only sends errors here when next(err) is called
app.use(errorHandler);

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

## 9. Routes File

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

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
```

---

## 10. Testing Validation

Test these requests in Postman or Thunder Client:

Missing name field:
```
POST /users
Body: { "email": "bob@example.com" }
Expected: 400 with errors: [{ field: "name", message: "Required" }]
```

Invalid email format:
```
POST /users
Body: { "name": "Bob", "email": "not-an-email" }
Expected: 400 with errors: [{ field: "email", message: "Please provide a valid email address" }]
```

Name too short:
```
POST /users
Body: { "name": "A", "email": "a@example.com" }
Expected: 400 with errors: [{ field: "name", message: "Name must be at least 2 characters" }]
```

Valid request:
```
POST /users
Body: { "name": "Bob", "email": "bob@example.com" }
Expected: 201 with the created user
```

---

## Summary

- Never trust incoming data - always validate before processing it
- Zod lets you define a schema and check request data against it in one call
- `schema.safeParse(data)` returns `{ success: true, data }` or `{ success: false, error }`
- Use `result.data` after validation, not `req.body` directly
- Return 400 with field-level error messages when validation fails
- A global error handler with four parameters catches unhandled errors
- Register the global error handler as the last `app.use()` in `server.js`

---

## Practice Tasks

1. Set up the full project and test all CRUD routes work with validation active.
2. Test sending invalid data and confirm the error messages appear correctly.
3. Send a request with two invalid fields at the same time and confirm both errors appear.
4. Create a Zod schema for a `Product` model with `title` (required), `price` (positive number), and `description` (optional string).
5. Apply validation to product create and update routes.

---

## Homework

Add Zod validation to your products CRUD API from Day 11. Test each rule: missing title, negative price, and wrong data type. Add the global error handler to your server and confirm that Prisma errors also return a clean JSON response instead of crashing.
