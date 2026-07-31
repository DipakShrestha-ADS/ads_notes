# Day 9 - Database Fundamentals and PostgreSQL Introduction

## What You Will Learn Today

- Why applications need a database instead of in-memory arrays
- The difference between SQL and NoSQL databases
- What PostgreSQL is and why this course uses it
- How tables, rows, and columns are structured
- What primary keys and foreign keys are
- How relationships between tables work
- How to start your PostgreSQL database using Podman

---

## 1. Why You Need a Database

Right now your APIs store data in JavaScript arrays. Every time you restart the server, that data disappears. A database solves this by storing data permanently on disk.

Think of a database like a filing cabinet in an office. A paper form comes in, and instead of leaving it on someone's desk where it can get lost, it goes into a labeled folder inside a cabinet. Next week, next month, or next year you can open that cabinet and find the exact record you need.

Without a database:
- All data is lost when the server restarts
- You cannot share data between multiple server instances
- You cannot search, sort, or filter large datasets efficiently

With a database:
- Data persists even after server restarts
- Multiple server instances read and write to the same data
- You can query millions of records quickly

---

## 2. SQL vs NoSQL

There are two main types of databases.

| Feature        | SQL (Relational)                   | NoSQL (Non-Relational)        |
| -------------- | ---------------------------------- | ----------------------------- |
| Data format    | Tables with rows and columns       | Documents, key-value, graphs  |
| Structure      | Fixed schema (defined upfront)     | Flexible schema               |
| Examples       | PostgreSQL, MySQL, SQLite          | MongoDB, Redis, DynamoDB      |
| Best for       | Structured data with relationships | Flexible or unstructured data |
| Query language | SQL                                | Varies by database            |

This course uses PostgreSQL because:
- It is free and open source
- It handles complex relationships well
- Prisma (which you will use from Day 11) works best with PostgreSQL
- It is used widely in real production systems

---

## 3. Tables, Rows, and Columns

A database is made up of tables. Think of a table like a spreadsheet.

A `users` table might look like this:

| id  | name  | email             | created_at |
| --- | ----- | ----------------- | ---------- |
| 1   | Alice | alice@example.com | 2025-01-01 |
| 2   | Bob   | bob@example.com   | 2025-01-02 |
| 3   | Carol | carol@example.com | 2025-01-03 |

- A column is a field type: `id`, `name`, `email`, `created_at`
- A row is one record: one specific user
- The table holds all records of that type

You usually have one table per entity: `users`, `products`, `orders`, `courses`.

---

## 4. Primary Key and Foreign Key

### Primary Key

A primary key is a column that uniquely identifies each row. No two rows can have the same primary key value.

In the table above, `id` is the primary key. User with `id = 2` is always Bob. You never confuse Bob with Alice because they have different IDs.

The primary key is usually an auto-incrementing integer (`id`).

### Foreign Key

A foreign key links one table to another.

Imagine an `orders` table:

| id  | user_id | product    | total |
| --- | ------- | ---------- | ----- |
| 1   | 2       | Laptop     | 1200  |
| 2   | 1       | Phone      | 600   |
| 3   | 2       | Headphones | 150   |

`user_id` in the `orders` table is a foreign key that points to the `id` column in the `users` table. Order number 1 belongs to user 2, which is Bob.

This is how you connect related data across tables without repeating the same user information in every order row.

---

## 5. Relationships

Databases have three main relationship types.

### One-to-Many

One user can have many orders, but each order belongs to exactly one user.

```
users              orders
------             ------
id (PK) -------->  user_id (FK)
name               product
email              total
```

This is the most common relationship.

### One-to-One

One user has exactly one profile, and that profile belongs to exactly one user.

```
users              profiles
------             --------
id (PK) -------->  user_id (FK, unique)
name               bio
email              avatar_url
```

### Many-to-Many

A learner can be enrolled in many courses, and a course can have many learners.

This requires a join table in the middle:

```
learners      enrollments       courses
--------      -----------       -------
id (PK) <---  student_id        id (PK)
name          course_id  --->   title
email                           description
```

---

## 6. Designing a Simple Data Model

Before writing code, sketch out your tables.

Example for an API with users and products:

```
users
  id          INT       PRIMARY KEY  AUTO INCREMENT
  name        VARCHAR(100)   NOT NULL
  email       VARCHAR(150)   UNIQUE NOT NULL
  created_at  TIMESTAMP      DEFAULT NOW()

products
  id          INT       PRIMARY KEY  AUTO INCREMENT
  title       VARCHAR(200)   NOT NULL
  price       DECIMAL(10, 2)
  user_id     INT            FOREIGN KEY -> users.id
  created_at  TIMESTAMP      DEFAULT NOW()
```

This design says one user can own many products.

---

## 7. Setting Up PostgreSQL with Podman

You will use Podman with a `docker-compose.yaml` file to run PostgreSQL in a container. You do not need to install PostgreSQL directly on your machine.

### Step 1: Create the project folder

```bash
mkdir day9-postgres-intro
cd day9-postgres-intro
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg
npm i prisma --save-dev
npm i -D nodemon
mkdir src
```

### Step 2: Update package.json

Open `package.json` and update it:

```json
{
  "name": "day9-postgres-intro",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

### Step 3: Create .env

```
PORT=8888
POSTGRES_USER=userdipak
POSTGRES_PASSWORD=user_password
POSTGRES_DB=day9_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/day9_db?schema=public"
```

### Step 4: Create .gitignore

```
node_modules/
.env
dist/
```

### Step 5: Create docker-compose.yaml

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

The `${VARIABLE}` syntax reads values from your `.env` file automatically when Podman starts the container.

### Step 6: Start the database container

```bash
# Start PostgreSQL in the background using Podman
podman compose up -d
```

To see startup logs instead:

```bash
podman compose up
```

To stop the container:

```bash
podman compose down
```

After `podman compose up -d` runs successfully, PostgreSQL is ready to accept connections on port 5555.

---

## 8. Viewing the Database

After Day 11 when you set up Prisma, you can use `npx prisma studio --config prisma/prisma.config.js` to view your tables visually in a browser. If you want to connect manually right now, you can use a tool like TablePlus, pgAdmin, or DBeaver with these settings:

- Host: `localhost`
- Port: `5555`
- User: `userdipak`
- Password: `user_password`
- Database: `day9_db`

---

## Summary

- A database stores data permanently, unlike in-memory arrays that reset on restart
- SQL databases use tables with rows and columns
- PostgreSQL is a powerful, free, open-source SQL database
- Every table should have a primary key (usually `id`)
- Foreign keys connect rows across different tables
- Relationships are one-to-many, one-to-one, or many-to-many
- You run PostgreSQL in a container using `podman compose up -d`

---

## Practice Tasks

1. Create the project folder, install all packages, and set up `.env`, `.gitignore`, and `docker-compose.yaml`.
2. Start the PostgreSQL container with `podman compose up -d` and confirm it starts without errors.
3. On paper or in a text file, design tables for a library management system with books, authors, and borrowers.
4. Identify the primary keys and foreign keys in your design.
5. Write out one one-to-many and one many-to-many relationship from your design.

---

## Homework

Design a database schema for a course management system. Include a `users` table, a `courses` table, and an `enrollments` table that connects users and courses. Write out the column names, data types, and which columns are primary keys and foreign keys.

---

## Campus Store Storyline Project - Level 9

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 9 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 8 is your starting checkpoint. You can review it in [Day 8](<Day8-Node.js Core Modules for Backend.md>).

You model users and products and start PostgreSQL in a Podman container.

### Today’s Project Level

Run `podman compose up -d` to start PostgreSQL.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Create | `docker-compose.yaml` | Define the PostgreSQL service and persistent volume. |
| Create | `docs/data-model.md` | Document User and Product tables and their relationship. |
| Edit | `.env.example` | Add PostgreSQL variables and `DATABASE_URL`. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 8 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 9 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Create `docker-compose.yaml`

Define the PostgreSQL service and persistent volume.

**File: `docker-compose.yaml`**

~~~yaml
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
~~~

This is the complete Level 9 version of `docker-compose.yaml`. Define the PostgreSQL service and persistent volume. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Create `docs/data-model.md`

Document User and Product tables and their relationship.

**File: `docs/data-model.md`**

~~~markdown
# Campus Store Data Model

## User

Each user has an ID, name, unique email, and timestamps.

## Product

Each product has an ID, title, price, optional description, optional owner, and timestamps.

## Relationship

One User can own many Products. A Product can have one owner. The Product table stores `userId` as its foreign key.
~~~

This is the complete Level 9 version of `docs/data-model.md`. Document User and Product tables and their relationship. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 3 — Edit `.env.example`

Add PostgreSQL variables and `DATABASE_URL`.

**File: `.env.example`**

~~~properties
# Copy this file to .env, then replace every example value.
PORT=8888
STORE_NAME="Campus Store"
STORE_KEY=campus-secret
POSTGRES_USER=campus_user
POSTGRES_PASSWORD=campus_password
POSTGRES_DB=campus_store
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://campus_user:campus_password@localhost:5555/campus_store?schema=public"
~~~

This is the complete Level 9 version of `.env.example`. Add PostgreSQL variables and `DATABASE_URL`. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Run `podman compose ps`. The `postgres` service should be running.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 9, your reference project has this cumulative structure:

```text
campus-store-api/
├── docs/
│   ├── api-plan.md
│   └── data-model.md
├── logs/
│   └── .gitkeep
├── src/
│   ├── controllers/
│   │   └── productController.js
│   ├── data/
│   │   └── products.js
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

- Runs PostgreSQL on host port `5555`.
- Preserves database data in a named volume.
- Documents how a user can own many products.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Run `podman compose ps`. The `postgres` service should be running.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Convert real project objects into tables, columns, keys, and relationships.

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

The database is available, but the API still reads its array. Level 10 connects Node.js with raw SQL. Continue with [Day 10](<Day10-Connecting Node.js with PostgreSQL.md>).
