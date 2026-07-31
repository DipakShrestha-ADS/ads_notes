# Day 11 - Prisma ORM Basics

## What You Will Learn Today

- What an ORM is and why it is better than writing raw SQL
- How to initialize Prisma in your project
- How to configure `schema.prisma` the correct way for this course
- How to run your first database migration
- How to set up `src/db/prisma.js` with the PrismaPg adapter
- How to perform full CRUD using Prisma methods

---

## 1. What Is an ORM

ORM stands for Object-Relational Mapper. It is a tool that lets you interact with your database using your programming language instead of writing raw SQL strings.

Compare what you did on Day 10 with what Prisma does:

Without ORM (raw SQL):
```javascript
const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
const user = result.rows[0];
```

With Prisma:
```javascript
const user = await prisma.user.findUnique({ where: { id } });
```

Both do the exact same thing. But with Prisma:
- Your editor gives you autocomplete for field names
- You never write SQL strings by hand
- Typos in field names are caught before the code runs
- Migrations track every schema change automatically
- You get consistent error codes instead of database-specific ones

---

## 2. Continue the Campus Store Project

Start with the completed Level 10 checkpoint from [Day 10](<Day10-Connecting Node.js with PostgreSQL.md>). If you missed that class, open its project preview and copy that checkpoint before continuing.

Run `npx prisma generate --config prisma/prisma.config.js`, then `npx prisma migrate dev --config prisma/prisma.config.js --name create_products`.

For today’s lesson, work only with these project files:

- **Delete `database/init.sql`**: Prisma migrations now own the database structure.
- **Delete `src/db/pool.js`**: Controllers use the Prisma client instead of the raw pool.
- **Create `prisma/schema.prisma`**: Define the Product model.
- **Create `prisma/prisma.config.js`**: Point Prisma to the schema, migrations, and environment URL.
- **Create `prisma/migrations/20260731000100_create_products/migration.sql`**: Record the first reproducible schema change.
- **Create `src/db/prisma.js`**: Export one configured Prisma client.
- **Replace `src/controllers/productController.js`**: Use Prisma CRUD methods.

The detailed lesson below explains the new concept. The connected Campus Store upgrade at the end shows how these changes fit into the growing project.

## 3. Initialize Prisma

```bash
npx prisma init
```

This creates two files:
- `prisma/schema.prisma` - where you define your database models
- `prisma/prisma.config.ts` - Prisma configuration file

Rename the config file because this is a JavaScript project:

```bash
mv prisma/prisma.config.ts prisma/prisma.config.js
```

---

## 4. Configure schema.prisma

Open `prisma/schema.prisma` and replace everything with this exact configuration:

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
```

What each line means:
- `provider = "prisma-client-js"` - generate a JavaScript client
- `output = "../src/generated/prisma"` - put the generated files inside `src/generated/prisma/`
- `moduleFormat = "esm"` - generate ES module syntax, which matches `"type": "module"` in `package.json`
- `provider = "postgresql"` - the database is PostgreSQL
- No `url` in datasource - Prisma reads `DATABASE_URL` from your `.env` automatically

---

## 5. Add Your First Model

Below the datasource block in `prisma/schema.prisma`, add the `User` model:

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
  createdAt DateTime @default(now())
}
```

What the field decorators mean:
- `@id` - marks this field as the primary key
- `@default(autoincrement())` - id auto-increments: 1, 2, 3, ...
- `@unique` - no two rows can have the same email
- `@default(now())` - automatically set to the current timestamp on create

Prisma names the table `users` (lowercase, plural) from the model name `User`.

---

## 6. Run the Migration

A migration is what actually creates the table in your database. Run:

```bash
npx prisma migrate dev --config prisma/prisma.config.js --name create_users_table
```

Prisma will:
1. Compare your schema against the current database state
2. Generate a SQL migration file in `prisma/migrations/`
3. Run that migration against the database
4. Generate the Prisma client in `src/generated/prisma/`

You will see output confirming the migration ran and the client was generated.

---

## 7. Create src/db/prisma.js

This file creates the Prisma client with the PostgreSQL adapter and exports it. Every controller imports from this file.

```javascript
// src/db/prisma.js
import 'dotenv/config';

// Import PrismaClient from the generated output folder
// The path matches the output in schema.prisma: "../src/generated/prisma"
import { PrismaClient } from '../generated/prisma/client.js';

// Import the PostgreSQL adapter that connects Prisma to the pg driver
import { PrismaPg } from '@prisma/adapter-pg';

// Create the adapter using the DATABASE_URL from .env
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Create the Prisma client and attach the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;             // export so controllers can import and use it
```

---

## 8. Users Controller with Prisma

```javascript
// src/controllers/userController.js
import prisma from '../db/prisma.js';    // import the Prisma client

// GET /users - fetch all users
export async function getAllUsers(req, res) {
  try {
    // prisma.user.findMany() returns all rows from the users table as an array
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },    // newest users first
    });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /users/:id - fetch one user
export async function getUserById(req, res) {
  const id = parseInt(req.params.id);    // convert the URL string to an integer

  try {
    // findUnique finds exactly one record by a unique field (id or email)
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /users - create a user
export async function createUser(req, res) {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  try {
    // prisma.user.create() inserts a new row and returns the full created record
    const user = await prisma.user.create({
      data: { name, email },              // pass the values to insert
    });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    // Prisma error code P2002 means a unique constraint failed (duplicate email)
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
}

// PUT /users/:id - update a user
export async function updateUser(req, res) {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  try {
    // prisma.user.update() updates matching record and returns the updated version
    const user = await prisma.user.update({
      where: { id },                      // find the record to update
      data: { name, email },              // fields to change
    });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    // Prisma error code P2025 means the record to update was not found
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
}

// DELETE /users/:id - delete a user
export async function deleteUser(req, res) {
  const id = parseInt(req.params.id);

  try {
    // prisma.user.delete() removes the record and returns what was deleted
    const user = await prisma.user.delete({
      where: { id },
    });
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

## 9. User Routes

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

## 10. src/server.js

```javascript
// src/server.js
import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Day 11 - Prisma ORM working' });
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

## 11. Useful Prisma Commands

```bash
# Run a migration after adding or changing a model
npx prisma migrate dev --config prisma/prisma.config.js --name describe_what_changed

# Reset database (drops all tables and re-runs all migrations from scratch)
npx prisma migrate reset --config prisma/prisma.config.js

# Regenerate the Prisma client without creating a migration (use after minor changes)
npx prisma generate --config prisma/prisma.config.js

# Open the visual database browser in your browser
npx prisma studio --config prisma/prisma.config.js
```

---

## 12. Prisma vs Raw SQL: Quick Reference

| SQL Operation                             | Prisma Method                                        |
| ----------------------------------------- | ---------------------------------------------------- |
| `SELECT * FROM users`                     | `prisma.user.findMany()`                             |
| `SELECT * FROM users WHERE id = 1`        | `prisma.user.findUnique({ where: { id: 1 } })`       |
| `SELECT * FROM users WHERE email = '...'` | `prisma.user.findFirst({ where: { email: '...' } })` |
| `INSERT INTO users...`                    | `prisma.user.create({ data: {...} })`                |
| `UPDATE users SET...`                     | `prisma.user.update({ where: {...}, data: {...} })`  |
| `DELETE FROM users WHERE id = 1`          | `prisma.user.delete({ where: { id: 1 } })`           |
| `SELECT COUNT(*)`                         | `prisma.user.count()`                                |

---

## Summary

- Prisma is an ORM that lets you work with your database using JavaScript instead of SQL
- `npx prisma init` creates the schema file and config file
- `prisma/schema.prisma` defines your models (tables)
- `npx prisma migrate dev --config prisma/prisma.config.js --name name` applies schema changes to the database and regenerates the client
- `src/db/prisma.js` creates and exports the Prisma client using the PrismaPg adapter
- Core Prisma methods: `findMany`, `findUnique`, `findFirst`, `create`, `update`, `delete`
- Error code `P2002` = unique constraint violated, `P2025` = record not found

---

## Practice Tasks

1. Set up the full project, start the database container, and run the migration.
2. Test all five CRUD routes using Postman or Thunder Client.
3. Run `npx prisma studio --config prisma/prisma.config.js` and view the users table in the browser.
4. Add a `Product` model to `schema.prisma` with fields: `id`, `title`, `price` (Float), `createdAt`.
5. Run a new migration: `npx prisma migrate dev --config prisma/prisma.config.js --name create_products_table`.
6. Build a products controller and routes file with full CRUD.

---

## Homework

Create a `Product` model in Prisma and build a complete CRUD API for it. Products should have `title`, `price` (Float), and `description` (String, optional using `String?`) fields. Test all routes and use Prisma Studio to confirm records are saved to the database.

---

## Campus Store Storyline Project - Level 11

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 11 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 10 is your starting checkpoint. You can review it in [Day 10](<Day10-Connecting Node.js with PostgreSQL.md>).

You describe products in a Prisma schema and use Prisma Client for CRUD.

### Today’s Project Level

Run `npx prisma generate --config prisma/prisma.config.js`, then `npx prisma migrate dev --config prisma/prisma.config.js --name create_products`.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Edit | `package.json` | Add Prisma, Prisma Client, and the PostgreSQL adapter plus database scripts. |
| Regenerate | `package-lock.json` | Record the Prisma dependency tree. |
| Edit | `.gitignore` | Ignore the generated Prisma client. |
| Delete | `database/init.sql` | Prisma migrations now own the database structure. |
| Delete | `src/db/pool.js` | Controllers use the Prisma client instead of the raw pool. |
| Create | `prisma/schema.prisma` | Define the Product model. |
| Create | `prisma/prisma.config.js` | Point Prisma to the schema, migrations, and environment URL. |
| Create | `prisma/migrations/20260731000100_create_products/migration.sql` | Record the first reproducible schema change. |
| Create | `src/db/prisma.js` | Export one configured Prisma client. |
| Replace | `src/controllers/productController.js` | Use Prisma CRUD methods. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 10 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 11 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Edit `package.json`

Add Prisma, Prisma Client, and the PostgreSQL adapter plus database scripts.

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
    "@prisma/client": "^6.19.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "prisma": "^6.19.0"
  }
}
~~~

This is the complete Level 11 version of `package.json`. Add Prisma, Prisma Client, and the PostgreSQL adapter plus database scripts. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Regenerate `package-lock.json`

Do not type or edit `package-lock.json` by hand. Record the Prisma dependency tree. Run `npm install` from the `campus-store-api/` root; npm will create or refresh this exact file automatically.

#### Step 3 — Edit `.gitignore`

Ignore the generated Prisma client.

**File: `.gitignore`**

~~~text
node_modules/
.env
logs/*.log
!logs/.gitkeep
src/generated/
~~~

This is the complete Level 11 version of `.gitignore`. Ignore the generated Prisma client. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Delete `database/init.sql`

Delete `database/init.sql` from the project root. Prisma migrations now own the database structure. After deletion, confirm the path no longer appears in **View Day 11 Project**.

#### Step 5 — Delete `src/db/pool.js`

Delete `src/db/pool.js` from the project root. Controllers use the Prisma client instead of the raw pool. After deletion, confirm the path no longer appears in **View Day 11 Project**.

#### Step 6 — Create `prisma/schema.prisma`

Define the Product model.

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

model Product {
  id          Int       @id @default(autoincrement())
  title       String
  price       Float
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
~~~

This is the complete Level 11 version of `prisma/schema.prisma`. Define the Product model. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 7 — Create `prisma/prisma.config.js`

Point Prisma to the schema, migrations, and environment URL.

**File: `prisma/prisma.config.js`**

~~~javascript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'schema.prisma',
  migrations: {
    path: 'migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
~~~

This is the complete Level 11 version of `prisma/prisma.config.js`. Point Prisma to the schema, migrations, and environment URL. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 8 — Create `prisma/migrations/20260731000100_create_products/migration.sql`

Record the first reproducible schema change.

**File: `prisma/migrations/20260731000100_create_products/migration.sql`**

~~~sql
CREATE TABLE "Product" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
~~~

This is the complete Level 11 version of `prisma/migrations/20260731000100_create_products/migration.sql`. Record the first reproducible schema change. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 9 — Create `src/db/prisma.js`

Export one configured Prisma client.

**File: `src/db/prisma.js`**

~~~javascript
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
~~~

This is the complete Level 11 version of `src/db/prisma.js`. Export one configured Prisma client. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 10 — Replace `src/controllers/productController.js`

Use Prisma CRUD methods.

**File: `src/controllers/productController.js`**

~~~javascript
import prisma from '../db/prisma.js';

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
  try {
    const product = await prisma.product.create({ data: req.body });
    res.status(201).json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body,
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

This is the complete Level 11 version of `src/controllers/productController.js`. Use Prisma CRUD methods. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Open `npx prisma studio --config prisma/prisma.config.js`, create a product through the API, and confirm the row appears.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 11, your reference project has this cumulative structure:

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
│   │   ├── fileLogger.js
│   │   ├── requestLogger.js
│   │   └── requireStoreKey.js
│   ├── routes/
│   │   └── productRoutes.js
│   └── server.js
├── .env.example
├── .gitignore
├── docker-compose.yaml
├── package-lock.json
└── package.json
```

Your completed checkpoint now:

- Uses a generated type-safe query client.
- Tracks database changes through migrations.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Open `npx prisma studio --config prisma/prisma.config.js`, create a product through the API, and confirm the row appears.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Use models and migrations to keep database structure and application code synchronized.

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

Database operations work, but invalid input can still enter the system. Level 12 adds validation and consistent errors. Continue with [Day 12](<Day12-Validation and Error Handling.md>).
