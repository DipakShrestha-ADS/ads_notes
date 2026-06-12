# Day 4 — ORM with Prisma (Recommended)

## 🎯 Today's Goal

Yesterday, you connected Node.js with PostgreSQL and wrote SQL queries manually.

Today, you will learn how professional developers interact with databases using an ORM.

By the end of this lesson, you will be able to:

- Understand what an ORM is
- Create Prisma models
- Generate database tables using migrations
- Perform CRUD operations using Prisma
- Build APIs connected to a real PostgreSQL database

---

# What Is an ORM?

ORM stands for:

**Object Relational Mapping**

Sounds complicated, but the idea is simple.

Instead of writing SQL manually:

```sql
SELECT * FROM users;
```

You can write:

```javascript
const users = await prisma.user.findMany();
```

Prisma converts it into SQL automatically.

---

# Real Life Analogy

Imagine you are ordering food.

### Without ORM

You must speak directly to the chef:

```sql
SELECT * FROM users;
INSERT INTO users ...
UPDATE users ...
```

You need to know SQL language.

---

### With ORM

You speak to a waiter:

```javascript
prisma.user.findMany()
```

The waiter talks to the chef for you.

The waiter = ORM

The chef = Database

---

# Why Use ORM?

Without ORM:

```javascript
const result = await pool.query(
  "SELECT * FROM users WHERE id = $1",
  [id]
);
```

With Prisma:

```javascript
const user = await prisma.user.findUnique({
  where: {
    id: id
  }
});
```

Much cleaner and easier to read.

---

# Benefits of Prisma

### 1. Cleaner Code

Instead of SQL everywhere:

```javascript
SELECT * FROM users
```

Use:

```javascript
prisma.user.findMany()
```

---

### 2. Auto Completion

When writing:

```javascript
prisma.user.
```

VS Code automatically suggests:

```text
findMany
findUnique
create
update
delete
```

This increases development speed.

---

### 3. Type Safety

Prisma knows your database structure.

If a field doesn't exist:

```javascript
nameee
```

Prisma immediately warns you.

---

### 4. Easier Maintenance

Large applications become easier to manage.

---

# Today's Project

You will create a simple User Management API.

Features:

```text
Create User
Get Users
Get User By ID
Update User
Delete User
```

Database:

```text
PostgreSQL
```

ORM:

```text
Prisma
```

---

# Project Structure

```text
day4-prisma-api/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── db/
│   │   └── prisma.js
│   │
│   ├── routes/
│   │   └── user.routes.js
│   │
│   └── server.js
│
├── .env
├── package.json
```

---

# Step 1 — Create Project

```bash
mkdir day4-prisma-api

cd day4-prisma-api

npm init -y
```

---

# Step 2 — Install Packages

```bash
npm install express prisma @prisma/client

npm install -D nodemon
```

---

# Step 3 — Update package.json

Because we are using ES Modules:

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js"
  }
}
```

---

# Step 4 — Initialize Prisma

Run:

```bash
npx prisma init
```

Prisma creates:

```text
prisma/
 └── schema.prisma

.env
```

---

# Step 5 — Configure Database Connection

Open:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/day4db"
```

Example:

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/day4db"
```

---

# Understanding DATABASE_URL

```text
postgresql://username:password@host:port/database
```

Example:

```text
postgresql://postgres:123456@localhost:5432/day4db
```

| Part      | Meaning         |
| --------- | --------------- |
| postgres  | Username        |
| 123456    | Password        |
| localhost | Database Server |
| 5432      | PostgreSQL Port |
| day4db    | Database Name   |

---

# Step 6 — Configure Prisma Schema

Open:

```text
prisma/schema.prisma
```

Default:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

# Step 7 — Create User Model

Add:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

---

# Understanding the Model

```prisma
id Int @id @default(autoincrement())
```

Means:

```text
Primary Key
Auto Increment
```

Example:

```text
1
2
3
4
```

Generated automatically.

---

```prisma
email String @unique
```

Means:

```text
No duplicate emails allowed
```

Valid:

```text
john@gmail.com
alex@gmail.com
```

Invalid:

```text
john@gmail.com
john@gmail.com
```

---

# What Is Migration?

Migration means:

> "Convert model changes into actual database tables."

Prisma Model:

```prisma
model User
```

↓

Migration

↓

PostgreSQL Table

---

# Step 8 — Run Migration

Create database tables:

```bash
npx prisma migrate dev --name create_user_table
```

Output:

```text
Migration created
Prisma Client generated
```

---

# What Happened?

Prisma created:

```sql
CREATE TABLE users
```

automatically.

You wrote:

```prisma
model User
```

Prisma wrote SQL for you.

---

# Step 9 — Open Prisma Studio

Prisma provides a visual database viewer.

Run:

```bash
npx prisma studio
```

Browser opens:

```text
http://localhost:5555
```

You can:

✅ View data

✅ Add data

✅ Edit data

✅ Delete data

Without SQL.

---

# Step 10 — Create Prisma Client

Create:

```text
src/db/prisma.js
```

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

---

# Why Prisma Client?

Prisma Client is the tool that lets Node.js talk to PostgreSQL.

```javascript
prisma.user.findMany()
```

Without it:

```text
Node.js ❌ Database
```

With it:

```text
Node.js → Prisma → PostgreSQL
```

---

# Step 11 — Create Express Server

```text
src/server.js
```

```javascript
import express from "express";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use("/users", userRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

# Step 12 — Create User Routes

```text
src/routes/user.routes.js
```

```javascript
import express from "express";
import prisma from "../db/prisma.js";

const router = express.Router();

export default router;
```

---

# CREATE User

## Endpoint

```http
POST /users
```

---

## Code

```javascript
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email
      }
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
```

---

## Request

```json
{
  "name": "John",
  "email": "john@gmail.com"
}
```

---

## Response

```json
{
  "id": 1,
  "name": "John",
  "email": "john@gmail.com"
}
```

---

# Understanding create()

```javascript
await prisma.user.create()
```

Means:

```text
Insert new record into database
```

Equivalent SQL:

```sql
INSERT INTO users
```

---

# GET All Users

## Endpoint

```http
GET /users
```

---

## Code

```javascript
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
```

---

# Understanding findMany()

```javascript
prisma.user.findMany()
```

Means:

```text
Fetch all rows
```

Equivalent SQL:

```sql
SELECT * FROM users;
```

---

# GET User By ID

## Endpoint

```http
GET /users/:id
```

---

## Code

```javascript
router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id)
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
```

---

# Understanding findUnique()

```javascript
findUnique()
```

Fetch exactly one record.

Equivalent SQL:

```sql
SELECT * FROM users
WHERE id = 1;
```

---

# UPDATE User

## Endpoint

```http
PUT /users/:id
```

---

## Code

```javascript
router.put("/:id", async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        name,
        email
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
```

---

# Understanding update()

Equivalent SQL:

```sql
UPDATE users
SET name='John Updated'
WHERE id=1;
```

Prisma version:

```javascript
prisma.user.update()
```

---

# DELETE User

## Endpoint

```http
DELETE /users/:id
```

---

## Code

```javascript
router.delete("/:id", async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: Number(req.params.id)
      }
    });

    res.json({
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
```

---

# Understanding delete()

Equivalent SQL:

```sql
DELETE FROM users
WHERE id = 1;
```

Prisma version:

```javascript
prisma.user.delete()
```

---

# CRUD Summary

| Operation | Prisma       |
| --------- | ------------ |
| Create    | create()     |
| Read All  | findMany()   |
| Read One  | findUnique() |
| Update    | update()     |
| Delete    | delete()     |

---

# Testing APIs Using Postman

## Create User

```http
POST /users
```

Body:

```json
{
  "name": "Ram",
  "email": "ram@gmail.com"
}
```

---

## Get All Users

```http
GET /users
```

---

## Get User By ID

```http
GET /users/1
```

---

## Update User

```http
PUT /users/1
```

```json
{
  "name": "Ram Updated",
  "email": "ram.updated@gmail.com"
}
```

---

## Delete User

```http
DELETE /users/1
```

---

# Prisma Commands Cheat Sheet

## Initialize Prisma

```bash
npx prisma init
```

---

## Create Migration

```bash
npx prisma migrate dev --name migration_name
```

---

## Open Prisma Studio

```bash
npx prisma studio
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

# Common Errors and Fixes

## Error: Database Connection Failed

Check:

```env
DATABASE_URL
```

Make sure:

```text
username
password
database name
```

are correct.

---

## Error: Port 5432 Refused

Check PostgreSQL service is running.

---

## Error: Unique Constraint Failed

Example:

```text
Email already exists
```

Because:

```prisma
email @unique
```

does not allow duplicates.

---

# What You Learned Today

You can now:

✅ Use Prisma ORM

✅ Create models

✅ Create migrations

✅ Generate database tables

✅ Connect Node.js with PostgreSQL using Prisma

✅ Perform CRUD operations

✅ Use Prisma Studio

✅ Build real database-backed APIs

---

# Practice Tasks

## Task 1 — Create Product Model

Create a new Prisma model:

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  price       Float
  createdAt   DateTime @default(now())
}
```

Run migration and verify it appears in Prisma Studio.

---

## Task 2 — Product CRUD APIs

Create:

```http
POST /products
GET /products
GET /products/:id
PUT /products/:id
DELETE /products/:id
```

using Prisma.

---

## Task 3 — Add More Fields to User

Modify User model:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  age       Int
  phone     String
  createdAt DateTime @default(now())
}
```

Run a new migration.

---

## Task 4 — Find User By Email

Create API:

```http
GET /users/email/:email
```

Use:

```javascript
findUnique()
```

to fetch a user by email.

---

## Task 5 — Mini Challenge

Build a complete **Employee Management API**.

Database table:

```text
Employee
```

Fields:

```text
id
name
email
department
salary
createdAt
```

Implement full CRUD operations using Prisma and PostgreSQL.

---

# End of Day 4

Today you replaced manual SQL queries with Prisma ORM and started building APIs that work with a real PostgreSQL database efficiently. Tomorrow, you will learn how to organize the project properly using Controllers, Routes, Services, Middlewares, and Utilities so the codebase stays clean as the application grows.
