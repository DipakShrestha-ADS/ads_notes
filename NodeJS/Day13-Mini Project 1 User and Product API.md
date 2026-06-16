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

## 2. Project Setup

```bash
mkdir mini-project-1
cd mini-project-1
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg zod
npm i prisma --save-dev
npm i -D nodemon
mkdir -p src/routes src/controllers src/db src/middlewares src/schemas
```

`package.json`:

```json
{
  "name": "mini-project-1",
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
POSTGRES_DB=mini_project_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/mini_project_db?schema=public"
```

`.gitignore`:

```
node_modules/
.env
dist/
```

`docker-compose.yaml`:

```yaml
services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Start the database:

```bash
podman compose up -d
```

---

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
npx prisma migrate dev --name create_users_and_products
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
5. Run `npx prisma studio` and browse both tables to confirm data is stored correctly.

---

## Homework

Complete any unfinished parts of the mini project and prepare to demo it next class. Make sure all 10 routes work, invalid data returns proper 400 errors with field-level messages, and the database persists data across server restarts.
