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

## 1. What Is the Node.js Runtime

Think of a runtime as the environment where your code runs. When you write JavaScript in a browser, the browser is the runtime. It understands JavaScript and executes it.

Node.js is a runtime that lets JavaScript execute on your computer or on a server, outside the browser.

The Node.js runtime is built on two key things:

| Component | What It Does                                                          |
| --------- | --------------------------------------------------------------------- |
| V8 Engine | Google's JavaScript engine that compiles and runs JS code             |
| libuv     | A library that handles file systems, networking, and async operations |

When you run `node app.js`, Node.js uses the V8 engine to read your JavaScript file and execute it line by line. libuv handles things like reading files from disk or making network calls without blocking the rest of your program.

---

## 2. What Is npm

npm stands for Node Package Manager.

When you install Node.js, npm is automatically installed along with it. npm does two things:

First, it is a tool you use on the command line to install packages into your project.

Second, it is a huge online registry at `https://npmjs.com` where developers publish packages. There are currently over two million packages available.

A package is a folder of code someone else wrote that you can use in your project. Instead of writing everything yourself, you install packages for common tasks.

Examples of popular packages:

| Package      | What It Does                                   |
| ------------ | ---------------------------------------------- |
| express      | Creates a web server and handles routes        |
| bcrypt       | Hashes passwords securely                      |
| dotenv       | Loads environment variables from a file        |
| jsonwebtoken | Creates and verifies JWT tokens                |
| prisma       | Connects and queries a database using a schema |

You install a package like this:

```bash
npm install express
```

This downloads the package and adds it to your project automatically.

---

## 3. Creating a Node.js Project

Before writing any code for a real backend project, you always create a proper project structure with npm.

### Step 1 - Create a new folder

```bash
mkdir day2-npm-basics
```

This creates a folder called `day2-npm-basics`.

### Step 2 - Move into the folder

```bash
cd day2-npm-basics
```

Now your terminal is inside this folder and every command you run will apply here.

### Step 3 - Initialize the project

```bash
npm init -y
```

`npm init` sets up a new Node.js project. The `-y` flag means "yes to all defaults." Without it, npm would ask you a series of questions about your project name, version, description, and more. With `-y`, it fills in default values for everything automatically.

After running this, you will see a new file called `package.json` created in your folder.

---

## 4. Understanding package.json

`package.json` is the heart of every Node.js project. It is a file written in JSON format that stores all the information about your project.

Here is what a basic `package.json` looks like after running `npm init -y`:

```json
{
  "name": "day2-npm-basics",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Let us go through each field:

- `"name"` is the name of your project. It comes from the folder name by default.
- `"version"` is the current version of your project. It starts at `1.0.0`.
- `"description"` is an optional short explanation of what your project does.
- `"main"` tells Node.js which file is the entry point of your project. This is the file that runs first.
- `"scripts"` is where you define terminal commands you can run using `npm run <name>`. The default has a `"test"` script.
- `"author"` is your name.
- `"license"` specifies how others can use your code.

### Adding a start script

You should add a `"start"` script so you can run your app with a single command:

```json
{
  "name": "day2-npm-basics",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  }
}
```

After adding this, you can start your app with:

```bash
npm start
```

Instead of typing `node app.js` every time. This is a common convention in Node.js projects.

---

## 5. Installing Packages

Once you have `package.json`, you can install packages.

### Installing Express

```bash
npm install express
```

After this command runs, two things happen:

First, a folder called `node_modules` is created. This folder contains the downloaded code for express and all of its dependencies.

Second, your `package.json` is updated automatically:

```json
{
  "name": "day2-npm-basics",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

The `"dependencies"` section now lists express and its version. This tells anyone who clones your project exactly which packages they need to install.

### Installing a development-only package

Some packages are only needed during development, not in production. You install them with `--save-dev`:

```bash
npm install nodemon --save-dev
```

nodemon is a tool that automatically restarts your Node.js server every time you save a file. You only need it while developing, not in production.

This adds a `"devDependencies"` section to your `package.json`:

```json
{
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### The package-lock.json file

When you install packages, npm also creates or updates a file called `package-lock.json`. This file records the exact version of every package installed, including all nested dependencies. It ensures that every developer on the team installs exactly the same versions.

---

## 6. The node_modules Folder

The `node_modules` folder contains all the installed packages. You should never edit anything inside this folder.

You should also never commit `node_modules` to Git. Add it to your `.gitignore` file:

```
node_modules/
```

When someone clones your project, they run `npm install` and npm reads `package.json` to install all the needed packages automatically.

---

## 7. What Are Environment Variables

Environment variables are values that live outside your code. They are stored in the operating system or in a special file, not inside your JavaScript files.

Why do we need them?

Imagine you have a database password in your code:

```javascript
// This is dangerous - never do this
const password = "mySecretPassword123";
```

If you push this code to GitHub, everyone can see your password. That is a serious security problem.

Instead, you store the password in an environment variable:

```javascript
const password = process.env.DB_PASSWORD;
```

The actual value of `DB_PASSWORD` lives in a `.env` file or the server's environment, not in your code. This keeps sensitive data secure.

Common things stored as environment variables:

- database credentials
- API keys
- JWT secret keys
- application port number
- third-party service credentials

---

## 8. Using the dotenv Package

dotenv is a package that reads a `.env` file and makes those values available to your program through `process.env`.

### Step 1 - Install dotenv

```bash
npm install dotenv
```

### Step 2 - Create a .env file

Create a file called `.env` in the root of your project. Notice there is no filename before the dot.

```
PORT=3000
APP_NAME=MyBackendApp
DB_HOST=localhost
DB_PASSWORD=supersecretpassword
```

Each line is a key-value pair. The key is the variable name and the value is what you want to store. No quotes needed.

### Step 3 - Add .env to .gitignore

```
node_modules/
.env
```

This prevents your `.env` file from being pushed to GitHub.

### Step 4 - Load dotenv in your code

Create `app.js` and write:

```javascript
// Load the dotenv package and read the .env file
import 'dotenv/config';

// Now access the values using process.env
const port = process.env.PORT;
const appName = process.env.APP_NAME;
const dbHost = process.env.DB_HOST;

// Print to verify they loaded correctly
console.log("Port:", port);
console.log("App Name:", appName);
console.log("Database Host:", dbHost);
```

Line by line:

- `import 'dotenv/config'` loads the dotenv package and automatically reads your `.env` file. After this line runs, all the variables from `.env` are available on `process.env`.
- `process.env.PORT` reads the value of `PORT` from the environment. If `.env` has `PORT=3000`, this will be the string `"3000"`.
- The `console.log` lines print the values so you can confirm they loaded.

Run the file:

```bash
node app.js
```

Output:

```
Port: 3000
App Name: MyBackendApp
Database Host: localhost
```

---

## 9. Using ES Modules in Node.js

Modern JavaScript uses `import` and `export` syntax. To enable this in Node.js, you need to tell it to use ES modules.

Open `package.json` and add `"type": "module"`:

```json
{
  "name": "day2-npm-basics",
  "version": "1.0.0",
  "type": "module",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3"
  }
}
```

With `"type": "module"`, you can use `import` statements:

```javascript
// ES Module syntax (works with "type": "module" in package.json)
import express from 'express';
import 'dotenv/config';
```

Without `"type": "module"`, you would use the older CommonJS syntax:

```javascript
// CommonJS syntax (older style)
const express = require('express');
require('dotenv').config();
```

Both work, but this course uses ES modules because it is the modern standard.

---

## 10. A Complete Day 2 Project

Put everything together in one project:

Create the folder and files:

```bash
mkdir day2-complete
cd day2-complete
npm init -y
npm install express dotenv
```

Create `.env`:

```
PORT=3000
APP_NAME=Day2App
GREETING=Hello from environment
```

Open `package.json` and add `"type": "module"` and a start script:

```json
{
  "name": "day2-complete",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3"
  }
}
```

Create `app.js`:

```javascript
// Load environment variables from .env file
import 'dotenv/config';

// Import express
import express from 'express';

// Create an express application
const app = express();

// Read the port from environment variable, or use 3000 as default
const PORT = process.env.PORT || 3000;

// Read the greeting message from environment variable
const greeting = process.env.GREETING;

// Define a simple route
app.get('/', (req, res) => {
  // Send a JSON response with the greeting and app name
  res.json({
    message: greeting,
    app: process.env.APP_NAME
  });
});

// Start the server and listen on the PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

Line by line:

- `import 'dotenv/config'` must be the very first import so environment variables are available before anything else runs.
- `import express from 'express'` brings in the express library.
- `const app = express()` creates an express application. This `app` object is how you define routes and configure the server.
- `const PORT = process.env.PORT || 3000` reads the PORT from `.env`. If it is not set, it defaults to `3000`. The `||` means "or, use this fallback."
- `app.get('/', ...)` defines a route that responds to GET requests at the root path `/`.
- `res.json({...})` sends a JSON response back to whoever made the request.
- `app.listen(PORT, ...)` starts the server on the given port. The callback function runs once the server is ready and listening.

Run it:

```bash
npm start
```

Open your browser and go to `http://localhost:3000`. You will see the JSON response.

---

## Summary

Here is what you covered today:

- The Node.js runtime is built on V8 (executes JavaScript) and libuv (handles async operations like files and networking).
- npm is the package manager for Node.js. It lets you install packages from the npm registry.
- `npm init -y` creates a `package.json` file which tracks your project's name, scripts, and dependencies.
- `npm install <package>` downloads a package into `node_modules` and adds it to your `package.json`.
- Environment variables store sensitive configuration like passwords and API keys outside of your code.
- The dotenv package reads a `.env` file and makes those values available via `process.env`.
- Adding `"type": "module"` to `package.json` enables modern `import` syntax.

---

## Practice Tasks

1. Create a new folder called `day2-practice`.
2. Run `npm init -y` inside it.
3. Add `"type": "module"` to `package.json`.
4. Install the `dotenv` package.
5. Create a `.env` file with at least four custom variables (your name, age, city, and a favorite language).
6. Create `app.js` that loads and prints all four variables.
7. Add a start script to `package.json` and run it with `npm start`.

---

## Homework

- Create a new Node.js project from scratch without using any tutorial.
- Add five environment variables including a PORT, a database name, an API key (any fake value), your name, and your course name.
- Print all five variables to the console when the app starts.
- Write a short note explaining: what happens if you delete `node_modules` and run `npm install` again?
