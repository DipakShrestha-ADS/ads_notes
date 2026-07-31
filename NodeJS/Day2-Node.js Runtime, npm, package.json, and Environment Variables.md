# Day 2 - Node.js Runtime, npm, package.json, and Environment Variables

## What You Will Learn Today

- What the Node.js runtime actually is and how it works
- What npm is and what it does for you
- How to create a Node.js project properly using `npm init`
- What `package.json` is and why every project needs it
- How to install the exact packages used in this course
- What environment variables are and why they are important
- How to use a `.env` file to manage configuration
- How to use nodemon so your server restarts automatically
- How to set up a proper `.gitignore` file

---

## 1. What Is the Node.js Runtime

Think of a runtime as the environment where your code runs. When you write JavaScript in a browser, the browser is the runtime. It understands JavaScript and executes it.

Node.js is a runtime that lets JavaScript execute on your computer or on a server, outside the browser.

The Node.js runtime is built on two key things:

| Component | What It Does                                                          |
| --------- | --------------------------------------------------------------------- |
| V8 Engine | Google's JavaScript engine that compiles and runs JS code             |
| libuv     | A library that handles file systems, networking, and async operations |

When you run `node src/server.js`, Node.js uses the V8 engine to read your JavaScript file and execute it. libuv handles things like reading files from disk or making network calls without blocking the rest of your program.

---

## 2. What Is npm

npm stands for Node Package Manager.

When you install Node.js, npm is automatically installed alongside it. npm does two things.

First, it is the command-line tool you use to install packages into your project.

Second, it is a huge online registry at `https://npmjs.com` where developers publish reusable code. There are currently over two million packages available.

A package is a folder of code someone else wrote that you can use in your own project. Instead of building everything yourself, you install packages for common tasks.

---

## 3. Setting Up a New Project

From Day 2 onwards, every project in this course follows the same setup steps. Learn these steps well because you will repeat them for every project.

### Step 1 - Create the project folder

```bash
# Create a new folder for today's project
mkdir day2-setup-practice

# Move into that folder
cd day2-setup-practice
```

### Step 2 - Initialize the project

```bash
# Create package.json with default values
npm init -y
```

The `-y` flag skips all the questions and fills in defaults. After this, you will see `package.json` in your folder.

### Step 3 - Install all required packages

Every Node.js backend project in this course uses this exact set of packages. Run both commands:

```bash
# Production packages (needed when the app runs)
npm i express dotenv pg @prisma/client @prisma/adapter-pg
```

```bash
# Development packages (only needed while you are coding)
npm i prisma --save-dev
npm i -D nodemon
```

What each package does:

| Package              | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| `express`            | Web framework for building APIs and routes               |
| `dotenv`             | Reads `.env` file and loads values into `process.env`    |
| `pg`                 | PostgreSQL driver so Node.js can connect to a database   |
| `@prisma/client`     | Auto-generated Prisma client for database queries        |
| `@prisma/adapter-pg` | Connects Prisma to PostgreSQL using the `pg` driver      |
| `prisma`             | CLI tool for migrations and schema management            |
| `nodemon`            | Watches your files and restarts the server when you save |

### Step 4 - Update package.json

Open `package.json` and make it look exactly like this:

```json
{
  "name": "day2-setup-practice",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

These are the important fields:

- `"type": "module"` enables the modern `import`/`export` syntax. Without this, you would have to use the older `require()` syntax.
- `"main": "src/server.js"` tells Node.js the entry point of your project is `src/server.js`, not `app.js`.
- `"start"` runs the production server using `node`.
- `"dev"` runs the development server using `nodemon`, which restarts automatically every time you save a file.

### Step 5 - Create the src folder and server.js

All your source code lives inside a `src` folder. Create it and the main file:

```bash
# Create the src folder
mkdir src

# Create the main server file
touch src/server.js
```

---

## 4. Understanding package.json

`package.json` is the heart of every Node.js project. It stores:

- the project name and version
- which packages are installed (dependencies)
- the scripts you can run
- project settings like `"type": "module"`

After installing all packages, your `package.json` will look like this:

```json
{
  "name": "day2-setup-practice",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "@prisma/adapter-pg": "^1.0.0",
    "@prisma/client": "^6.0.0",
    "dotenv": "^16.0.0",
    "express": "^4.18.0",
    "pg": "^8.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "prisma": "^6.0.0"
  }
}
```

The `"dependencies"` section lists packages needed when the app runs. The `"devDependencies"` section lists packages only needed during development.

---

## 5. The node_modules Folder

When you install packages, npm creates a `node_modules` folder. This contains all the downloaded package code.

Never edit anything inside `node_modules`.

Never commit `node_modules` to Git. It is huge and can always be recreated by running `npm install`.

---

## 6. The .gitignore File

Create a `.gitignore` file in your project root. This tells Git which files to ignore and never track.

Create a new file called `.gitignore` (no extension, just `.gitignore`) and add:

```
# Ignore all installed packages (can be recreated with npm install)
node_modules/

# Ignore environment variables file (contains passwords and secrets)
.env

# Ignore build output if any
dist/
```

The most important one is `.env`. Your `.env` file contains database passwords and secret keys. If you accidentally push it to GitHub, anyone can see your credentials. Always include it in `.gitignore`.

---

## 7. What Are Environment Variables

Environment variables are configuration values stored outside your code. They are not written inside your JavaScript files.

Why do you need them?

Imagine you hard-code your database password directly in your code:

```javascript
// DO NOT do this - this is dangerous
const password = "mySecretPassword123";
```

If you push that code to GitHub, everyone can see your password. That is a serious security problem.

Instead, you store the password in an environment variable:

```javascript
// Safe way - the actual value lives in .env, not here
const password = process.env.DB_PASSWORD;
```

The actual value only lives in the `.env` file on your local machine and on your server. It never goes into Git.

---

## 8. Creating the .env File

Create a `.env` file in your project root (same level as `package.json`). Use this exact format for every project:

```
PORT=8888
POSTGRES_USER=userdipak
POSTGRES_PASSWORD=user_password
POSTGRES_DB=student_record
POSTGRES_HOST=localhost
POSTGRES_PORT=5555

# DATABASE_URL format: postgresql://user:password@host:port/databaseName?schema=public
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/student_record?schema=public"
```

Change `userdipak`, `user_password`, and `student_record` to your actual database credentials.

Each line is a key-value pair. The key is the variable name. The value is what you want to store.

The `DATABASE_URL` combines all the individual database values into one connection string that Prisma and other tools understand.

---

## 9. Using dotenv in Your Code

The `dotenv` package reads the `.env` file and makes all the values available through `process.env`.

Open `src/server.js` and write:

```javascript
// This MUST be the very first import in your file
// It reads .env and loads all values into process.env
import 'dotenv/config';

// Now you can read any value from .env using process.env
const port = process.env.PORT;               // reads PORT=8888 from .env
const dbHost = process.env.POSTGRES_HOST;    // reads POSTGRES_HOST=localhost
const dbName = process.env.POSTGRES_DB;      // reads POSTGRES_DB=student_record

// Print them to verify they loaded correctly
console.log("Port:", port);        // Port: 8888
console.log("DB Host:", dbHost);   // DB Host: localhost
console.log("DB Name:", dbName);   // DB Name: student_record
```

Run the file:

```bash
npm run dev
```

You should see your values printed to the terminal. If you see `undefined`, it means `dotenv/config` was not imported first, or the variable name has a typo.

---

## 10. nodemon - Auto-Restart the Server

nodemon watches your JavaScript files. When you save any file, it automatically restarts your server. This saves you from manually stopping and restarting every time you make a change.

You already set it up in `package.json`:

```json
"dev": "nodemon src/server.js"
```

Run it with:

```bash
npm run dev
```

You will see a message like:

```
[nodemon] starting `node src/server.js`
Port: 8888
DB Host: localhost
```

Now make a change to `src/server.js` and save it. nodemon will automatically restart and print the output again.

---

## 11. A Complete Day 2 Project

Here is a complete example using everything from today.

Your file structure should look like this:

```
day2-setup-practice/
  src/
    server.js
  .env
  .gitignore
  package.json
```

Your `.env`:

```
PORT=8888
POSTGRES_USER=userdipak
POSTGRES_PASSWORD=user_password
POSTGRES_DB=student_record
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/student_record?schema=public"
```

Your `src/server.js`:

```javascript
// Load all .env values first - always the first import
import 'dotenv/config';

// Import express library
import express from 'express';

// Create the Express application
const app = express();

// Tell Express to parse JSON bodies
app.use(express.json());

// Read the port from .env (PORT=8888), fallback to 8888 if not set
const PORT = process.env.PORT || 8888;

// Define a simple test route
app.get('/', (req, res) => {
  // Send back a JSON response showing the server is running
  res.json({
    message: 'Server is running',          // status message
    port: PORT,                            // which port is active
    database: process.env.POSTGRES_DB     // which database is configured
  });
});

// Start the server and listen on the PORT
app.listen(PORT, () => {
  // This message prints once when the server starts
  console.log(`Server running at http://localhost:${PORT}`);
});
```

Run with:

```bash
npm run dev
```

Open your browser at `http://localhost:8888`. You will see the JSON response.

---

## Summary

Here is what you covered today:

- The Node.js runtime is built on V8 (executes JavaScript) and libuv (handles async operations).
- `npm init -y` creates a `package.json` file that tracks everything about your project.
- Every project installs the same core packages: `express`, `dotenv`, `pg`, `@prisma/client`, `@prisma/adapter-pg`, `prisma`, and `nodemon`.
- `"type": "module"` in `package.json` enables modern `import` syntax.
- The entry point for every project is `src/server.js`, not `app.js`.
- Environment variables keep secrets like database passwords out of your code. Store them in `.env`.
- `.gitignore` prevents `node_modules/` and `.env` from being committed to Git.
- nodemon automatically restarts your server when you save a file. Run it with `npm run dev`.

---

## Practice Tasks

1. Create a new folder called `day2-practice`.
2. Follow all setup steps from this lesson: `npm init -y`, install packages, update `package.json`.
3. Create `.env` with the correct format and fill in your own values.
4. Create `.gitignore` with `node_modules/` and `.env` entries.
5. Create `src/server.js` that loads dotenv and prints all your `.env` values.
6. Run `npm run dev` and verify nodemon starts and prints the values.

---

## Homework

- Create a new Node.js project from scratch without looking at these notes.
- Add all five database variables to `.env` plus a `PORT` and a custom `APP_NAME`.
- Print all seven variables to the console when `src/server.js` starts.
- Add a `.gitignore` and verify `node_modules` is in it.
- Write a short note answering: what happens if you delete `node_modules` and run `npm install` again?

---

## Campus Store Storyline Project - Level 2

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 2 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 1 is your starting checkpoint. You can review it in [Day 1](<Day1-Introduction to Backend, API, and Node.js.md>).

You move the practice script into the official backend structure and add configuration through npm and environment variables.

### Today’s Project Level

Run `npm install`, then copy `.env.example` to `.env`.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Delete | `app.js` | The Day 1 practice entry point is replaced by the course-standard entry point. |
| Create | `package.json` | Define ES modules and the start and development commands. |
| Generate | `package-lock.json` | Lock the exact dependency versions after running `npm install`. |
| Create | `.env.example` | Document the environment values without committing real secrets. |
| Create | `.gitignore` | Keep installed dependencies and real environment secrets out of Git. |
| Create | `src/server.js` | Load and print the Campus Store configuration. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 1 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 2 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Delete `app.js`

Delete `app.js` from the project root. The Day 1 practice entry point is replaced by the course-standard entry point. After deletion, confirm the path no longer appears in **View Day 2 Project**.

#### Step 2 — Create `package.json`

Define ES modules and the start and development commands.

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
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "dotenv": "^16.6.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
~~~

This is the complete Level 2 version of `package.json`. Define ES modules and the start and development commands. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 3 — Generate `package-lock.json`

Do not type or edit `package-lock.json` by hand. Lock the exact dependency versions after running `npm install`. Run `npm install` from the `campus-store-api/` root; npm will create or refresh this exact file automatically.

#### Step 4 — Create `.env.example`

Document the environment values without committing real secrets.

**File: `.env.example`**

~~~properties
# Copy this file to .env, then replace every example value.
PORT=8888
STORE_NAME="Campus Store"
~~~

This is the complete Level 2 version of `.env.example`. Document the environment values without committing real secrets. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 5 — Create `.gitignore`

Keep installed dependencies and real environment secrets out of Git.

**File: `.gitignore`**

~~~text
node_modules/
.env
~~~

This is the complete Level 2 version of `.gitignore`. Keep installed dependencies and real environment secrets out of Git. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 6 — Create `src/server.js`

Load and print the Campus Store configuration.

**File: `src/server.js`**

~~~javascript
import 'dotenv/config';

const port = Number(process.env.PORT) || 8888;
const storeName = process.env.STORE_NAME || 'Campus Store';

console.log(`${storeName} project configuration loaded.`);
console.log(`The future API will use port ${port}.`);
~~~

This is the complete Level 2 version of `src/server.js`. Load and print the Campus Store configuration. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Run `npm start`. You should see the store name and port `8888` in the terminal.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 2, your reference project has this cumulative structure:

```text
campus-store-api/
├── src/
│   └── server.js
├── .env.example
├── .gitignore
├── package-lock.json
└── package.json
```

Your completed checkpoint now:

- Uses ES module syntax.
- Reads `PORT` and `STORE_NAME` from `.env`.
- Runs through `npm start` or `npm run dev`.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Run `npm start`. You should see the store name and port `8888` in the terminal.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Create a repeatable foundation that any assigned backend project can use.

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

The project has a foundation, but it does not yet have an API design. Level 3 plans the routes before coding them. Continue with [Day 3](<Day3-HTTP Fundamentals and REST API Concepts.md>).
