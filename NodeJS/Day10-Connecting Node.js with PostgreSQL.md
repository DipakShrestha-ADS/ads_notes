# Day 10 - Connecting Node.js with PostgreSQL

## What You Will Learn Today

- How to connect a Node.js app directly to PostgreSQL using the `pg` package
- How to create a reusable database connection pool
- How to run basic SQL queries: SELECT, INSERT, UPDATE, DELETE
- How to build API routes that read and write from the database
- How to protect your queries from SQL injection

---

## 1. The pg Package

The `pg` package is the official PostgreSQL client for Node.js. It lets your Node.js code talk directly to a PostgreSQL database by sending raw SQL queries.

You already installed it in the standard package setup:

```bash
npm i express dotenv pg @prisma/client @prisma/adapter-pg
```

The `pg` package gives you a `Pool` class. A pool manages a group of database connections. Your app reuses these connections instead of opening and closing a new connection for every single request, which is much more efficient.

---

## 2. Project Setup

```bash
mkdir day10-postgres-connect
cd day10-postgres-connect
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg
npm i prisma --save-dev
npm i -D nodemon
mkdir -p src/routes src/controllers src/db src/middlewares
```

`package.json`:

```json
{
  "name": "day10-postgres-connect",
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
POSTGRES_DB=day10_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/day10_db?schema=public"
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

## 3. Creating the Database Connection File

Create one file that sets up the PostgreSQL connection pool. All your controllers will import from this file.

```javascript
// src/db/db.js
import 'dotenv/config';            // load .env before reading process.env
import pg from 'pg';               // import the full pg module

const { Pool } = pg;               // pull Pool out from the pg module

// Create a pool using the DATABASE_URL from .env
// Pool manages multiple connections and reuses them efficiently
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection once when this file is first imported
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Database connection failed:', err.message));

export default pool;               // export the pool for use in controllers
```

---

## 4. Creating the Users Table

Before running queries, you need to create the table. Create a setup script that you run once:

```javascript
// src/db/setup.js
import pool from './db.js';       // import the connection pool

async function createTables() {
  // SQL to create the users table if it does not already exist
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(100)  NOT NULL,
      email      VARCHAR(150)  UNIQUE NOT NULL,
      created_at TIMESTAMP     DEFAULT NOW()
    );
  `;
  // SERIAL = auto-incrementing integer (1, 2, 3, ...)
  // PRIMARY KEY = unique identifier for each row
  // VARCHAR(100) = text up to 100 characters
  // UNIQUE = no two rows can have the same email
  // NOT NULL = this field cannot be empty
  // DEFAULT NOW() = automatically set to the current timestamp

  try {
    await pool.query(sql);          // run the SQL against the database
    console.log('users table created successfully');
  } catch (err) {
    console.error('Error creating table:', err.message);
  } finally {
    await pool.end();               // close all connections when done
  }
}

createTables();
```

Run it once:

```bash
node src/db/setup.js
```

---

## 5. Users Controller

Now write the controller functions that perform CRUD using SQL queries.

```javascript
// src/controllers/userController.js
import pool from '../db/db.js';    // import the database pool

// GET /users - fetch all users
export async function getAllUsers(req, res) {
  try {
    // Run SELECT query and get the result
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    // result.rows is an array of objects, one per row
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /users/:id - fetch one user by ID
export async function getUserById(req, res) {
  const { id } = req.params;        // get the :id from the URL

  try {
    // Use $1 as a placeholder - NEVER put user input directly in the SQL string
    // This prevents SQL injection (explained below)
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
    // result.rows[0] is the first (and only) matching row
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /users - create a new user
export async function createUser(req, res) {
  const { name, email } = req.body; // get values from the request body

  if (!name || !email) {
    // Return early if required fields are missing
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  try {
    // Insert a new row and return the created record
    // RETURNING * tells PostgreSQL to send back the inserted row
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
      // $1 is replaced by name, $2 is replaced by email
    );

    res.status(201).json({ success: true, data: result.rows[0] });
    // 201 Created is the correct status code when a new resource is created
  } catch (err) {
    // PostgreSQL error code 23505 means a unique constraint was violated (duplicate email)
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
}

// PUT /users/:id - update a user
export async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    // Update the row where id matches and return the updated row
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// DELETE /users/:id - delete a user
export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    // Delete the row and return what was deleted
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
```

---

## 6. User Routes

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

// Map each URL pattern and HTTP method to a controller function
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
```

---

## 7. src/server.js

```javascript
// src/server.js
import 'dotenv/config';            // load .env before anything else
import express from 'express';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Parse JSON request bodies - required for POST and PUT requests
app.use(express.json());

// Mount user routes - all routes inside userRoutes.js are prefixed with /users
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Day 10 - PostgreSQL connection working' });
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

## 8. Testing the API

Start the server:

```bash
npm run dev
```

Test with Thunder Client or Postman:

```
GET    http://localhost:8888/users
GET    http://localhost:8888/users/1
POST   http://localhost:8888/users       body: { "name": "Alice", "email": "alice@example.com" }
PUT    http://localhost:8888/users/1     body: { "name": "Alice Smith", "email": "alice@example.com" }
DELETE http://localhost:8888/users/1
```

---

## 9. SQL Injection and Parameterized Queries

SQL injection is one of the most common security vulnerabilities in web applications. It happens when user input is included directly in a SQL string.

Here is why it is dangerous:

```javascript
// WRONG - never do this
const id = req.params.id;   // attacker sends: "1; DROP TABLE users"
pool.query(`SELECT * FROM users WHERE id = ${id}`);
// This runs: SELECT * FROM users WHERE id = 1; DROP TABLE users
// The DROP TABLE runs and deletes all your data
```

Always use parameterized queries with `$1`, `$2` placeholders:

```javascript
// CORRECT - always do this
pool.query('SELECT * FROM users WHERE id = $1', [id]);
// The pg driver treats the value as data, not as SQL code
// No matter what the attacker sends, it cannot be executed as SQL
```

Every query in this course uses parameterized placeholders. This is not optional.

---

## Summary

- The `pg` package connects Node.js to PostgreSQL
- Use a `Pool` instead of a single `Client` for efficient connection management
- `result.rows` contains the query results as an array of plain objects
- `RETURNING *` in INSERT, UPDATE, and DELETE sends back the affected row
- Always use `$1`, `$2` placeholders in queries to prevent SQL injection
- PostgreSQL error code `23505` means a unique constraint was violated

---

## Practice Tasks

1. Set up the full project, start the PostgreSQL container, and run the setup script.
2. Test all five CRUD routes using Postman or Thunder Client.
3. Try inserting two users with the same email and observe the error response.
4. Create a `products` table with columns: `id`, `title`, `price`, `created_at`.
5. Write a products controller and routes file for full CRUD.

---

## Homework

Build a complete CRUD API connected to PostgreSQL for a `products` table. Products should have `title`, `price`, and `description` fields. Test all routes and verify data persists in the database across server restarts.
