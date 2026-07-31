# Day 13 - Mini Project 1: User and Product API

## What You Will Learn Today

- How to combine everything from Days 4 to 12 into one complete project
- How to build a two-module API with users and products
- How to apply the correct folder structure, Prisma, validation, and error handling together
- How relationships between models work in Prisma
- Common mistakes to watch for when building a structured backend project

---

## 1. What You Are Building

Today you build one complete backend project from scratch. It has:

- Full CRUD for users
- Full CRUD for products
- A relationship between users and products (a user can own products)
- Prisma for database operations
- Zod for validation
- Global error handling
- Clean folder structure following the course conventions

Routes you will have by the end:

```
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id

GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id
```

---

## 2. Continue the Campus Store Project

Start with the completed Level 12 checkpoint from [Day 12](<Day12-Validation and Error Handling.md>). If you missed that class, open its project preview and copy that checkpoint before continuing.

Run `npx prisma migrate dev --config prisma/prisma.config.js --name add_users_and_product_owner` and `npx prisma generate --config prisma/prisma.config.js`.

For today’s lesson, work only with these project files:

- **Replace `prisma/schema.prisma`**: Add User and the optional Product owner relationship.
- **Create `src/schemas/userSchemas.js`**: Validate user creation and updates.
- **Create `src/controllers/userController.js`**: Implement user CRUD with Prisma.
- **Create `src/routes/userRoutes.js`**: Expose the user endpoints.
- **Edit `src/controllers/productController.js`**: Accept and return the owning user.
- **Edit `src/server.js`**: Mount `/users`.

The detailed lesson below explains the new concept. The connected Campus Store upgrade at the end shows how these changes fit into the growing project.

## 3. Prisma Setup

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
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  products  Product[]              // one user can have many products
  createdAt DateTime  @default(now())
}

model Product {
  id          Int      @id @default(autoincrement())
  title       String
  price       Float
  description String?              // optional field - the ? makes it nullable
  userId      Int?                 // optional FK - product may or may not belong to a user
  user        User?    @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}
```

The `Product[]` in User and `user User?` in Product define the relationship. Prisma uses these to allow joining the two models in queries.

Run migration:

```bash
npx prisma migrate dev --config prisma/prisma.config.js --name create_users_and_products
```

---

## 4. src/db/prisma.js

```javascript
// src/db/prisma.js
import 'dotenv/config';

// Import PrismaClient from the generated output folder
import { PrismaClient } from '../generated/prisma/client.js';

// Import the PostgreSQL adapter
import { PrismaPg } from '@prisma/adapter-pg';

// Create the adapter using the DATABASE_URL from .env
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Create the Prisma client and export it
const prisma = new PrismaClient({ adapter });

export default prisma;
```

---

## 5. Validation Schemas

```javascript
// src/schemas/userSchema.js
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email('Invalid email address').optional(),
});
```

```javascript
// src/schemas/productSchema.js
import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  price: z.number().positive('Price must be greater than zero'),
  description: z.string().optional(),            // optional text field
  userId: z.number().int().positive().optional(), // optional link to a user
});

export const updateProductSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  userId: z.number().int().positive().optional(),
});
```

---

## 6. Error Handler Middleware

```javascript
// src/middlewares/errorHandler.js
export function errorHandler(err, req, res, next) {
  // Log to console so you can see the error while developing
  console.error(`[Error] ${req.method} ${req.url} - ${err.message}`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}
```

---

## 7. Users Controller

```javascript
// src/controllers/userController.js
import prisma from '../db/prisma.js';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema.js';

export async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
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
      include: { products: true },    // include this user's products in the response
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
    const user = await prisma.user.create({ data: result.data });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Email already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateUser(req, res) {
  const id = parseInt(req.params.id);
  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({ field: e.path[0], message: e.message }));
    return res.status(400).json({ success: false, errors });
  }
  try {
    const user = await prisma.user.update({ where: { id }, data: result.data });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'User not found' });
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteUser(req, res) {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'User deleted', data: user });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'User not found' });
    res.status(500).json({ success: false, message: err.message });
  }
}
```

---

## 8. Products Controller

```javascript
// src/controllers/productController.js
import prisma from '../db/prisma.js';
import { createProductSchema, updateProductSchema } from '../schemas/productSchema.js';

export async function getAllProducts(req, res) {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getProductById(req, res) {
  const id = parseInt(req.params.id);
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { user: true },    // include the owner of this product
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createProduct(req, res) {
  const result = createProductSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({ field: e.path[0], message: e.message }));
    return res.status(400).json({ success: false, errors });
  }
  try {
    const product = await prisma.product.create({ data: result.data });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateProduct(req, res) {
  const id = parseInt(req.params.id);
  const result = updateProductSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({ field: e.path[0], message: e.message }));
    return res.status(400).json({ success: false, errors });
  }
  try {
    const product = await prisma.product.update({ where: { id }, data: result.data });
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteProduct(req, res) {
  const id = parseInt(req.params.id);
  try {
    const product = await prisma.product.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Product deleted', data: product });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(500).json({ success: false, message: err.message });
  }
}
```

---

## 9. Routes

```javascript
// src/routes/userRoutes.js
import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
export default router;
```

```javascript
// src/routes/productRoutes.js
import { Router } from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = Router();
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
export default router;
```

---

## 10. src/server.js

```javascript
// src/server.js
import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());

// Mount both route modules
app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Mini Project 1 - API running' });
});

// Global error handler must be after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

## 11. Final Project Structure

Your completed project looks like this:

```
mini-project-1/
  src/
    server.js
    controllers/
      userController.js
      productController.js
    middlewares/
      errorHandler.js
    routes/
      userRoutes.js
      productRoutes.js
    db/
      prisma.js
    schemas/
      userSchema.js
      productSchema.js
    generated/
      prisma/
  prisma/
    schema.prisma
    prisma.config.js
    migrations/
  .env
  .gitignore
  docker-compose.yaml
  package.json
```

---

## 12. Common Mistakes to Watch For

Missing `await` before a Prisma call returns a Promise object instead of the actual data:

```javascript
// wrong - users is a Promise, not an array
const users = prisma.user.findMany();

// correct
const users = await prisma.user.findMany();
```

Forgetting `return` after sending a response allows the function to continue and try to send a second response:

```javascript
// wrong - sends two responses, crashes with "headers already sent"
if (!user) {
  res.status(404).json({ message: 'Not found' });
}
res.status(200).json({ data: user });

// correct - return stops the function after the first response
if (!user) {
  return res.status(404).json({ message: 'Not found' });
}
res.status(200).json({ data: user });
```

Registering the error handler before routes means errors from routes will never reach it:

```javascript
// wrong - error handler is registered before routes
app.use(errorHandler);
app.use('/users', userRoutes);

// correct - error handler goes last
app.use('/users', userRoutes);
app.use(errorHandler);
```

---

## Summary

- A structured project separates routes, controllers, schemas, middlewares, and database into clear files
- Prisma handles database queries, Zod handles validation, Express handles routing
- Always validate incoming data before touching the database
- Use a global error handler to catch and respond to all unhandled errors
- Return consistent response shapes: `{ success: true/false, data, errors? }`

---

## Practice Tasks

1. Complete the full setup: packages, `.env`, docker-compose, Prisma, migrations.
2. Test every route for both users and products with both valid and invalid data.
3. Create a product with a `userId` pointing to an existing user. Check Prisma Studio.
4. Try deleting a user that has products linked and observe the error. Think about how to handle it cleanly.
5. Run `npx prisma studio --config prisma/prisma.config.js` and browse both tables to confirm data is stored correctly.

---

## Homework

Complete any unfinished parts of the mini project and prepare to demo it next class. Make sure all 10 routes work, invalid data returns proper 400 errors with field-level messages, and the database persists data across server restarts.

---

## Campus Store Storyline Project - Level 13

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 13 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 12 is your starting checkpoint. You can review it in [Day 12](<Day12-Validation and Error Handling.md>).

You add users, connect products to their owners, and complete a structured two-module API.

### Today’s Project Level

Run `npx prisma migrate dev --config prisma/prisma.config.js --name add_users_and_product_owner` and `npx prisma generate --config prisma/prisma.config.js`.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Replace | `prisma/schema.prisma` | Add User and the optional Product owner relationship. |
| Create | `src/schemas/userSchemas.js` | Validate user creation and updates. |
| Create | `src/controllers/userController.js` | Implement user CRUD with Prisma. |
| Create | `src/routes/userRoutes.js` | Expose the user endpoints. |
| Edit | `src/controllers/productController.js` | Accept and return the owning user. |
| Edit | `src/server.js` | Mount `/users`. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 12 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 13 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Replace `prisma/schema.prisma`

Add User and the optional Product owner relationship.

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

This is the complete Level 13 version of `prisma/schema.prisma`. Add User and the optional Product owner relationship. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Create `src/schemas/userSchemas.js`

Validate user creation and updates.

**File: `src/schemas/userSchemas.js`**

~~~javascript
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
});

export const updateUserSchema = createUserSchema.partial();
~~~

This is the complete Level 13 version of `src/schemas/userSchemas.js`. Validate user creation and updates. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 3 — Create `src/controllers/userController.js`

Implement user CRUD with Prisma.

**File: `src/controllers/userController.js`**

~~~javascript
import prisma from '../db/prisma.js';
import { createUserSchema, updateUserSchema } from '../schemas/userSchemas.js';

function invalid(res, result) {
  return res.status(400).json({
    message: 'Validation failed',
    errors: result.error.flatten().fieldErrors,
  });
}

export async function getAllUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
    });
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { products: true },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) return invalid(res, result);
  try {
    const user = await prisma.user.create({ data: result.data });
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) return invalid(res, result);
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: result.data,
    });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
~~~

This is the complete Level 13 version of `src/controllers/userController.js`. Implement user CRUD with Prisma. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Create `src/routes/userRoutes.js`

Expose the user endpoints.

**File: `src/routes/userRoutes.js`**

~~~javascript
import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../controllers/userController.js';

const router = Router();
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
~~~

This is the complete Level 13 version of `src/routes/userRoutes.js`. Expose the user endpoints. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 5 — Edit `src/controllers/productController.js`

Accept and return the owning user.

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
      include: { user: { select: { id: true, name: true, email: true } } },
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

This is the complete Level 13 version of `src/controllers/productController.js`. Accept and return the owning user. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 6 — Edit `src/server.js`

Mount `/users`.

**File: `src/server.js`**

~~~javascript
import 'dotenv/config';
import express from 'express';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';

const app = express();
app.use(express.json());
app.use(requestLogger);
app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use(errorHandler);
const port = Number(process.env.PORT) || 8888;
app.listen(port, () => {
  console.log(`Campus Store API running at http://localhost:${port}`);
});
~~~

This is the complete Level 13 version of `src/server.js`. Mount `/users`. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Create a user, create a product with that `userId`, then read the product and confirm the owner is included.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 13, your reference project has this cumulative structure:

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
│   │   └── 20260731000200_add_users/
│   │       └── migration.sql
│   ├── prisma.config.js
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── productController.js
│   │   └── userController.js
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
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── schemas/
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

- Provides User and Product CRUD.
- Can assign a product to a user.
- Returns product owner information.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Create a user, create a product with that `userId`, then read the product and confirm the owner is included.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Add a second related resource and keep both modules consistent.

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

Users exist, but anyone can pretend to be any user. Level 14 adds real authentication. Continue with [Day 14](<Day14-Authentication with JWT and Password Hashing.md>).
