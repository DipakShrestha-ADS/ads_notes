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

## 2. Project Setup

```bash
mkdir day11-prisma-basics
cd day11-prisma-basics
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg
npm i prisma --save-dev
npm i -D nodemon
mkdir -p src/routes src/controllers src/db src/middlewares
```

`package.json`:

```json
{
  "name": "day11-prisma-basics",
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
POSTGRES_DB=day11_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/day11_db?schema=public"
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
npx prisma migrate dev --name create_users_table
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
npx prisma migrate dev --name describe_what_changed

# Reset database (drops all tables and re-runs all migrations from scratch)
npx prisma migrate reset

# Regenerate the Prisma client without creating a migration (use after minor changes)
npx prisma generate

# Open the visual database browser in your browser
npx prisma studio
```

---

## 12. Prisma vs Raw SQL: Quick Reference

| SQL Operation | Prisma Method |
|---|---|
| `SELECT * FROM users` | `prisma.user.findMany()` |
| `SELECT * FROM users WHERE id = 1` | `prisma.user.findUnique({ where: { id: 1 } })` |
| `SELECT * FROM users WHERE email = '...'` | `prisma.user.findFirst({ where: { email: '...' } })` |
| `INSERT INTO users...` | `prisma.user.create({ data: {...} })` |
| `UPDATE users SET...` | `prisma.user.update({ where: {...}, data: {...} })` |
| `DELETE FROM users WHERE id = 1` | `prisma.user.delete({ where: { id: 1 } })` |
| `SELECT COUNT(*)` | `prisma.user.count()` |

---

## Summary

- Prisma is an ORM that lets you work with your database using JavaScript instead of SQL
- `npx prisma init` creates the schema file and config file
- `prisma/schema.prisma` defines your models (tables)
- `npx prisma migrate dev --name name` applies schema changes to the database and regenerates the client
- `src/db/prisma.js` creates and exports the Prisma client using the PrismaPg adapter
- Core Prisma methods: `findMany`, `findUnique`, `findFirst`, `create`, `update`, `delete`
- Error code `P2002` = unique constraint violated, `P2025` = record not found

---

## Practice Tasks

1. Set up the full project, start the database container, and run the migration.
2. Test all five CRUD routes using Postman or Thunder Client.
3. Run `npx prisma studio` and view the users table in the browser.
4. Add a `Product` model to `schema.prisma` with fields: `id`, `title`, `price` (Float), `createdAt`.
5. Run a new migration: `npx prisma migrate dev --name create_products_table`.
6. Build a products controller and routes file with full CRUD.

---

## Homework

Create a `Product` model in Prisma and build a complete CRUD API for it. Products should have `title`, `price` (Float), and `description` (String, optional using `String?`) fields. Test all routes and use Prisma Studio to confirm records are saved to the database.
