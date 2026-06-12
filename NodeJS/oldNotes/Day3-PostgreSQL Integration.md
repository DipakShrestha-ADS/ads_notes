# DAY 3 — PostgreSQL Integration (Containerized with Docker/Podman)

# Introduction

Welcome to Day 3

Today you will connect your Node.js backend with a **real PostgreSQL database running inside a container**.

This is how many real companies run databases during development.

Instead of installing PostgreSQL directly into your system, you will:

* run PostgreSQL inside Docker or Podman
* connect Node.js to the container
* create tables
* build real APIs with database

This approach is:

* cleaner
* easier to manage
* portable
* professional
* beginner friendly

---

# What You Will Learn Today

## Topics

* What database is
* What PostgreSQL is
* What containers are
* Docker basics
* Podman basics
* Running PostgreSQL container
* Connecting Node.js with PostgreSQL
* Tables
* Rows
* Primary keys
* Relationships
* CRUD operations

---

# What is Containerization?

Containerization means:

```text id="d5j5xk"
running applications inside isolated environments
```

Instead of installing PostgreSQL directly into your computer:

```text id="8nk9jm"
Install PostgreSQL globally ❌
```

You run it inside a container:

```text id="o8a0h1"
Run PostgreSQL inside container ✅
```

---

# Why Containers Are Amazing

Without containers:

* dependency conflicts
* different machine setups
* difficult cleanup
* version mismatch

With containers:

* same environment everywhere
* easy setup
* easy deletion
* professional workflow

---

# Docker vs Podman

Both can run containers.

| Docker            | Podman      |
| ----------------- | ----------- |
| Most popular      | More secure |
| Beginner friendly | Daemonless  |
| Huge ecosystem    | Lightweight |

Good news 🎉

Commands are almost identical.

---

# Install Docker or Podman

## Docker

Download:

[Docker Desktop](https://www.docker.com/products/docker-desktop/?utm_source=chatgpt.com)

---

## Podman

Download:

[Podman Official Website](https://podman.io/getting-started/installation?utm_source=chatgpt.com)

---

# Verify Installation

## Docker

```bash id="i3rxj4"
docker --version
```

---

## Podman

```bash id="z3k5lv"
podman --version
```

---

# Understanding PostgreSQL Container

Instead of:

```text id="r9kzxp"
installing PostgreSQL manually
```

You will run:

```text id="s5if5v"
PostgreSQL as a container
```

Visual flow:

```text id="jlwm9v"
Container Engine
      ↓
PostgreSQL Container
      ↓
Node.js Backend
```

---

# Create Project Folder

```bash id="z2o8hy"
mkdir day3-postgresql-container
```

---

# Move into Folder

```bash id="0fdx9l"
cd day3-postgresql-container
```

---

# Initialize Node.js Project

```bash id="rsk5we"
npm init -y
```

---

# Install Required Packages

```bash id="o0m3mr"
npm install express pg dotenv
```

---

# Update package.json

Add:

```json id="fq4h6d"
"type": "module"
```

Example:

```json id="z1fy4g"
{
  "name": "day3-postgresql-container",
  "version": "1.0.0",
  "type": "module"
}
```

---

# Folder Structure

```text id="4kt0m8"
day3-postgresql-container
│
├── node_modules
├── package.json
├── .env
├── db.js
├── index.js
└── docker-compose.yml
```

---

# What is docker-compose.yml?

This file helps run multiple containers easily.

Instead of writing huge commands every time:

```text id="f9f3nl"
One file controls everything ✅
```

---

# Create PostgreSQL Container

# docker-compose.yml

```yaml id="dcmjpj"
version: "3.9"

services:
  postgres:
    image: postgres:17
    container_name: learning_postgres

    restart: always

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: learning_db

    ports:
      - "5432:5432"

    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

# Understanding This File

# image

```yaml id="qlx6ya"
image: postgres:17
```

Downloads PostgreSQL version 17.

---

# container_name

```yaml id="09gwdh"
container_name: learning_postgres
```

Custom container name.

---

# environment

```yaml id="x5o9ru"
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
```

Initial database configuration.

---

# ports

```yaml id="3e0v1f"
"5432:5432"
```

Meaning:

```text id="j0u9im"
computer_port : container_port
```

So Node.js can access PostgreSQL.

---

# volumes

```yaml id="j0y1qz"
postgres_data
```

Prevents database data loss after container restart.

Without volume:

```text id="1g9h0f"
container deleted → all data deleted ❌
```

With volume:

```text id="kgjlwm"
data stays safe ✅
```

---

# Start PostgreSQL Container

## Docker

```bash id="z3z7n0"
docker compose up -d
```

---

## Podman

```bash id="7rzv4r"
podman compose up -d
```

---

# Check Running Containers

## Docker

```bash id="e67v7e"
docker ps
```

---

## Podman

```bash id="7z8mr0"
podman ps
```

You should see:

```text id="4dyhwm"
learning_postgres
```

---

# Create Environment Variables

# .env

```env id="y0d2gn"
PORT=3000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=learning_db
DB_PASSWORD=postgres
DB_PORT=5432
```

---

# Connect Node.js with PostgreSQL

# db.js

```js id="u0b5ea"
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool;
```

---

# Test Database Connection

# index.js

```js id="s9v9mo"
import express from "express";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      database_time: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

# Run Node.js Server

```bash id="4yl5d4"
node index.js
```

Visit:

```text id="fj7f2q"
http://localhost:3000
```

If successful:

```json id="yv98v8"
{
  "success": true,
  "database_time": {
    "now": "..."
  }
}
```

---

# Access PostgreSQL Container Terminal

Sometimes you need direct database access.

---

# Docker

```bash id="p3u0im"
docker exec -it learning_postgres psql -U postgres -d learning_db
```

---

# Podman

```bash id="3c0dht"
podman exec -it learning_postgres psql -U postgres -d learning_db
```

---

# Create users Table

Inside PostgreSQL terminal:

```sql id="4k1r9o"
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);
```

---

# Insert Sample Data

```sql id="6y77y7"
INSERT INTO users(name, email)
VALUES
('Ram', 'ram@gmail.com'),
('Hari', 'hari@gmail.com');
```

---

# View Data

```sql id="0g1xtv"
SELECT * FROM users;
```

---

# Build Real APIs

# GET All Users

```js id="2m7d9k"
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users"
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});
```

---

# Create User API

```js id="9r3nxm"
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      `
      INSERT INTO users(name, email)
      VALUES($1, $2)
      RETURNING *
      `,
      [name, email]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
});
```

---

# Understanding Parameterized Queries

```sql id="gqz6ny"
VALUES($1, $2)
```

This protects against:

# SQL Injection

Never do this ❌

```js id="bz44uh"
`SELECT * FROM users WHERE email='${email}'`
```

Always do this ✅

```js id="n6n68l"
"SELECT * FROM users WHERE email=$1"
```

---

# Get Single User

```js id="n0d3d0"
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
});
```

---

# Update User

```js id="i1m9bc"
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET name = $1, email = $2
      WHERE id = $3
      RETURNING *
      `,
      [name, email, id]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
});
```

---

# Delete User

```js id="ycrzvc"
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM users WHERE id = $1",
      [id]
    );

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
});
```

---

# Create products Table

```sql id="up0myb"
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    price NUMERIC(10,2),
    user_id INTEGER REFERENCES users(id)
);
```

---

# Relationship Visualization

```text id="n1q0wy"
One User
    ↓
Many Products
```

---

# Insert Products

```sql id="xj7v9j"
INSERT INTO products(title, price, user_id)
VALUES
('Laptop', 1200, 1),
('Mouse', 50, 1);
```

---

# JOIN Example

```sql id="wlng6k"
SELECT
products.title,
products.price,
users.name
FROM products
JOIN users
ON users.id = products.user_id;
```

---

# Why Containerized Databases Are Better

# Easy Cleanup

Delete everything:

## Docker

```bash id="qhyh0q"
docker compose down
```

---

## Podman

```bash id="kvczkr"
podman compose down
```

---

# Remove Everything Including Data

## Docker

```bash id="me6ksd"
docker compose down -v
```

---

## Podman

```bash id="yvj3vr"
podman compose down -v
```

---

# Common Beginner Errors

# 1. Port Already Used

Error:

```text id="ik4cgf"
port 5432 already in use
```

Fix:

Stop local PostgreSQL service or change port.

Example:

```yaml id="e6r44p"
"5433:5432"
```

Then update `.env`

```env id="znf3wo"
DB_PORT=5433
```

---

# 2. Container Not Running

Error:

```text id="vvdr2d"
connection refused
```

Fix:

Check:

```bash id="mbyxv6"
docker ps
```

or

```bash id="f2g3q1"
podman ps
```

---

# 3. Wrong Credentials

Error:

```text id="mjlwm8"
password authentication failed
```

Fix:

Check:

```yaml id="u5hkm5"
POSTGRES_USER
POSTGRES_PASSWORD
```

and `.env`

---

# Real Industry Understanding

Today you learned a very professional workflow:

```text id="wyg5a5"
Node.js Backend
      ↓
Containerized PostgreSQL
      ↓
Persistent Database Storage
```

This setup is used in:

* backend teams
* cloud systems
* CI/CD pipelines
* microservices
* production environments

---

# Practice Tasks

# Task 1

Run PostgreSQL container yourself.

---

# Task 2

Create:

```text id="lczw52"
school_db
```

inside container.

---

# Task 3

Create:

```text id="ykm8qo"
students table
```

Fields:

* id
* name
* age
* course

---

# Task 4

Build APIs:

* GET students
* POST student
* UPDATE student
* DELETE student

---

# Task 5

Create:

```text id="olz3dd"
courses table
```

---

# Task 6

Create relationship between:

```text id="z5hj3g"
students ↔ courses
```

---

# Bonus Challenge 🚀

Try containerizing the Node.js backend too.

Hint:

Create:

```text id="9s9qmn"
Dockerfile
```

Then run:

```text id="w0k7gj"
Node.js + PostgreSQL together
```

inside containers.

---

# What You Completed Today 🎉

Today you learned:

* PostgreSQL basics
* Docker basics
* Podman basics
* Containerized databases
* Node.js + PostgreSQL connection
* CRUD APIs
* Relationships
* JOIN queries
* Professional backend workflow
