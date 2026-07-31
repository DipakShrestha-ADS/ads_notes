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

## 3. Continue the Campus Store Project

Start with the completed Level 11 checkpoint from [Day 11](<Day11-Prisma ORM Basics.md>). If you missed that class, open its project preview and copy that checkpoint before continuing.

Run `npm install` to install Zod from this checkpoint.

For today’s lesson, work only with these project files:

- **Create `src/schemas/productSchemas.js`**: Define create and update validation rules.
- **Create `src/middlewares/errorHandler.js`**: Convert unexpected failures into safe JSON responses.
- **Replace `src/controllers/productController.js`**: Validate input before calling Prisma and forward unexpected errors.
- **Edit `src/server.js`**: Register the error handler after every route.

The detailed lesson below explains the new concept. The connected Campus Store upgrade at the end shows how these changes fit into the growing project.

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

---

## Campus Store Storyline Project - Level 12

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 12 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 11 is your starting checkpoint. You can review it in [Day 11](<Day11-Prisma ORM Basics.md>).

You validate product input with Zod and send errors through one global handler.

### Today’s Project Level

Run `npm install` to install Zod from this checkpoint.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Edit | `package.json` | Add Zod as today’s input-validation dependency. |
| Regenerate | `package-lock.json` | Record the installed Zod dependency. |
| Create | `src/schemas/productSchemas.js` | Define create and update validation rules. |
| Create | `src/middlewares/errorHandler.js` | Convert unexpected failures into safe JSON responses. |
| Replace | `src/controllers/productController.js` | Validate input before calling Prisma and forward unexpected errors. |
| Edit | `src/server.js` | Register the error handler after every route. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 11 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 12 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Edit `package.json`

Add Zod as today’s input-validation dependency.

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
    "zod": "^4.1.12"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "prisma": "^6.19.0"
  }
}
~~~

This is the complete Level 12 version of `package.json`. Add Zod as today’s input-validation dependency. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Regenerate `package-lock.json`

Do not type or edit `package-lock.json` by hand. Record the installed Zod dependency. Run `npm install` from the `campus-store-api/` root; npm will create or refresh this exact file automatically.

#### Step 3 — Create `src/schemas/productSchemas.js`

Define create and update validation rules.

**File: `src/schemas/productSchemas.js`**

~~~javascript
import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().trim().min(2, 'Title must contain at least 2 characters'),
  price: z.number().positive('Price must be greater than zero'),
  description: z.string().trim().optional(),
  category: z.string().trim().min(2).optional(),
  userId: z.number().int().positive().nullable().optional(),
});

export const updateProductSchema = createProductSchema.partial();
~~~

This is the complete Level 12 version of `src/schemas/productSchemas.js`. Define create and update validation rules. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Create `src/middlewares/errorHandler.js`

Convert unexpected failures into safe JSON responses.

**File: `src/middlewares/errorHandler.js`**

~~~javascript
export function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : 'An unexpected server error occurred',
  });
}
~~~

This is the complete Level 12 version of `src/middlewares/errorHandler.js`. Convert unexpected failures into safe JSON responses. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 5 — Replace `src/controllers/productController.js`

Validate input before calling Prisma and forward unexpected errors.

**File: `src/controllers/productController.js`**

~~~javascript
import prisma from '../db/prisma.js';
import { createProductSchema, updateProductSchema } from '../schemas/productSchemas.js';

function validationFailure(res, result) {
  return res.status(400).json({
    message: 'Validation failed',
    errors: result.error.flatten().fieldErrors,
  });
}

export async function getAllProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  const result = createProductSchema.safeParse(req.body);
  if (!result.success) return validationFailure(res, result);
  try {
    const product = await prisma.product.create({ data: result.data });
    res.status(201).json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  const result = updateProductSchema.safeParse(req.body);
  if (!result.success) return validationFailure(res, result);
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: result.data,
    });
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
~~~

This is the complete Level 12 version of `src/controllers/productController.js`. Validate input before calling Prisma and forward unexpected errors. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 6 — Edit `src/server.js`

Register the error handler after every route.

**File: `src/server.js`**

~~~javascript
import 'dotenv/config';
import express from 'express';
import productRoutes from './routes/productRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';

const app = express();
app.use(express.json());
app.use(requestLogger);
app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

app.use('/products', productRoutes);
app.use(errorHandler);
const port = Number(process.env.PORT) || 8888;
app.listen(port, () => {
  console.log(`Campus Store API running at http://localhost:${port}`);
});
~~~

This is the complete Level 12 version of `src/server.js`. Register the error handler after every route. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Send a product with an empty title and negative price. Expect `400` with field errors.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 12, your reference project has this cumulative structure:

```text
campus-store-api/
├── docs/
│   ├── api-plan.md
│   └── data-model.md
├── logs/
│   └── .gitkeep
├── prisma/
│   ├── migrations/
│   │   └── 20260731000100_create_products/
│   │       └── migration.sql
│   ├── prisma.config.js
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   └── productController.js
│   ├── data/
│   │   └── products.js
│   ├── db/
│   │   └── prisma.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   ├── fileLogger.js
│   │   ├── requestLogger.js
│   │   └── requireStoreKey.js
│   ├── routes/
│   │   └── productRoutes.js
│   ├── schemas/
│   │   └── productSchemas.js
│   └── server.js
├── .env.example
├── .gitignore
├── docker-compose.yaml
├── package-lock.json
└── package.json
```

Your completed checkpoint now:

- Rejects missing titles and non-positive prices.
- Returns field-level validation details.
- Prevents internal error details from leaking to clients.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Send a product with an empty title and negative price. Expect `400` with field errors.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Define clear input rules for every create and update operation in an assigned project.

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

Products are safe, but the store has no persistent users. Level 13 completes the first two-module milestone. Continue with [Day 13](<Day13-Mini Project 1 User and Product API.md>).
