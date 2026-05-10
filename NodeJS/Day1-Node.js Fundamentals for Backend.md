# DAY 1 — Node.js Fundamentals for Backend

# 1. What is Backend?

When you open an app like:

* Instagram
* Facebook
* Food delivery apps
* Banking apps

there are two major parts:

| Part     | Meaning                                    |
| -------- | ------------------------------------------ |
| Frontend | What users see                             |
| Backend  | The server logic running behind the scenes |

---

## Backend Responsibilities

Backend usually handles:

* Receiving requests
* Processing data
* Database operations
* Authentication
* Returning responses

---

## Example Flow

Suppose a user clicks:

```text
Login Button
```

The frontend sends:

```http
POST /login
```

Backend will:

1. Receive email/password
2. Check database
3. Verify password
4. Generate token
5. Send response back

---

# 2. What is Node.js?

## Definition

Node.js allows JavaScript to run outside the browser.

Normally JavaScript runs only in browsers.

With Node.js:

* we can build servers
* APIs
* backend systems
* realtime apps

---

# Why Node.js is Popular

## 1. Same Language Everywhere

Frontend:

```js
JavaScript
```

Backend:

```js
JavaScript
```

Developers do not need to learn another backend language immediately.

---

## 2. Fast Development

Node.js is excellent for:

* REST APIs
* realtime apps
* chat systems
* dashboards
* streaming

---

## 3. Huge Ecosystem

npm has millions of packages.

Example:

* Express
* JWT
* bcrypt
* Prisma
* Socket.io

---

# 3. Install Node.js

Download from:

[Node.js Official Website](https://nodejs.org)

---

## Verify Installation

Run:

```bash
node -v
```

Example:

```bash
v22.0.0
```

Check npm:

```bash
npm -v
```

---

# 4. What is npm?

npm = Node Package Manager

It helps install libraries/packages.

---

## Example

Install Express:

```bash
npm install express
```

---

## Why Packages Are Used

Instead of building everything manually:

* authentication
* validation
* database drivers

we use packages.

This speeds up development.

---

# 5. Create First Node.js Project

---

## Step 1 — Create Folder

```bash
mkdir backend-course
```

Move inside:

```bash
cd backend-course
```

---

## Step 2 — Initialize Project

```bash
npm init -y
```

---

## What This Creates

```text
package.json
```

---

## package.json Purpose

It stores:

* project name
* version
* dependencies
* scripts

Example:

```json
{
  "name": "backend-course",
  "version": "1.0.0"
}
```

---

# 6. What are Modules?

Modules help split code into smaller reusable files.

---

# Example Without Modules

Everything inside one file becomes messy.

Bad practice:

```js
// everything in one file
```

---

# Example With Modules

```text
app.js
math.js
user.js
```

Much cleaner and maintainable.

---

# 7. CommonJS Modules

Node.js traditionally uses:

```js
require()
```

and

```js
module.exports
```

---

# Example

## math.js

```js
function add(a, b) {
  return a + b;
}

module.exports = add;
```

---

## app.js

```js
const add = require("./math");

console.log(add(2, 3));
```

---

## Output

```bash
5
```

---

# Explanation

## In math.js

We exported the function:

```js
module.exports = add;
```

Meaning:

> “Other files can use this function.”

---

## In app.js

We imported it:

```js
require("./math")
```

Meaning:

> “Load code from math.js.”

---

# 8. What is Express.js?

Node.js alone can create servers.

But it becomes difficult.

Express.js makes backend development easier.

---

# Install Express

```bash
npm install express
```

---

# 9. Create First Server

## index.js

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
```

---

# Understanding the Code

---

## 1. Import Express

```js
const express = require("express");
```

Loads Express package.

---

## 2. Create App

```js
const app = express();
```

Creates Express application.

---

## 3. Create Route

```js
app.get("/", (req, res) => {
  res.send("Server Running");
});
```

This means:

When user visits:

```text
/
```

using GET request,

send response:

```text
Server Running
```

---

## 4. Start Server

```js
app.listen(3000)
```

Runs server on port 3000.

---

# 10. What is a Port?

A port is like a door for communication.

Example:

```text
localhost:3000
```

* localhost = your machine
* 3000 = server port

---

# 11. Run the Server

```bash
node index.js
```

Open browser:

```text
http://localhost:3000
```

Output:

```text
Server Running
```

---

# 12. Understanding APIs

API = communication bridge between frontend and backend.

---

# Example

Frontend asks:

```http
GET /products
```

Backend responds:

```json
[
  {
    "id": 1,
    "name": "Pizza"
  }
]
```

---

# 13. HTTP Methods

| Method | Purpose     |
| ------ | ----------- |
| GET    | Read data   |
| POST   | Create data |
| PUT    | Update data |
| DELETE | Remove data |

---

# 14. Request & Response

---

# Request

Data sent by client.

Example:

```http
GET /hello
```

---

# Response

Data returned by server.

Example:

```json
{
  "message": "Hello"
}
```

---

# 15. JSON Basics

JSON = JavaScript Object Notation

Used for API communication.

---

# Example JSON

```json
{
  "name": "Dipak",
  "age": 22
}
```

---

# Why JSON is Used

Because:

* lightweight
* readable
* easy for frontend/backend

---

# 16. Create Practical APIs

Now build the APIs from the lesson plan. 

---

# Complete Example

## index.js

```js
const express = require("express");

const app = express();

app.use(express.json());

/*
GET /hello
*/
app.get("/hello", (req, res) => {
  res.json({
    message: "Hello Student"
  });
});

/*
GET /about
*/
app.get("/about", (req, res) => {
  res.json({
    app: "Backend Course API",
    version: "1.0.0"
  });
});

/*
POST /data
*/
app.post("/data", (req, res) => {

  console.log(req.body);

  res.json({
    message: "Data received successfully",
    receivedData: req.body
  });

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

# Deep Explanation of This Example

---

# 1. express.json()

```js
app.use(express.json());
```

This middleware converts incoming JSON into JavaScript object.

Without this:

```js
req.body
```

will be undefined.

---

# Example

Incoming request:

```json
{
  "name": "Dipak"
}
```

After parsing:

```js
req.body.name
```

becomes:

```js
"Dipak"
```

---

# 2. GET /hello

```js
app.get("/hello")
```

This route handles GET requests.

---

# Response

```json
{
  "message": "Hello Student"
}
```

---

# 3. GET /about

Returns application information.

Good example of simple informational API.

---

# 4. POST /data

This accepts data from client.

---

# Example Request

```json
{
  "name": "Ram",
  "age": 20
}
```

---

# req.body

```js
req.body
```

contains incoming JSON data.

---

# Response Returned

```json
{
  "message": "Data received successfully",
  "receivedData": {
    "name": "Ram",
    "age": 20
  }
}
```

---

# 17. Testing APIs Using Postman

Download:

[Postman Official Website](https://www.postman.com?utm_source=chatgpt.com)

---

# Test GET Request

Method:

```text
GET
```

URL:

```text
http://localhost:3000/hello
```

---

# Test POST Request

Method:

```text
POST
```

URL:

```text
http://localhost:3000/data
```

Body → JSON:

```json
{
  "name": "Dipak",
  "course": "Node.js"
}
```

---

# 18. Environment Variables

Never hardcode sensitive values.

Bad:

```js
const password = "123456";
```

---

# Use .env File

Install dotenv:

```bash
npm install dotenv
```

---

# Create .env

```env
PORT=3000
```

---

# Use in Code

```js
require("dotenv").config();

const PORT = process.env.PORT;
```

---

# Final Example

```js
require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
```

---

# Why Environment Variables Matter

Used for:

* database password
* JWT secret
* API keys
* server configs

Important for security.

---

# 19. Important Beginner Mistakes

---

## 1. Forgetting express.json()

Result:

```js
req.body = undefined
```

---

## 2. Wrong Port

If port already used:

```text
EADDRINUSE
```

Change port.

---

## 3. Forgetting to Restart Server

After changing code:

```bash
CTRL + C
node index.js
```

---

# 20. Recommended Folder Structure (Simple)

```text
backend-course/
│
├── node_modules/
├── package.json
├── package-lock.json
├── .env
└── index.js
```

---

# 21. Summary of Day 1

Students should now understand:

* What backend does
* What Node.js is
* npm basics
* Modules
* Express basics
* APIs
* Request/response
* JSON handling
* Environment variables

---

# DAY 1 Practical Tasks

These tasks are very important. You should complete all of them.

---

# Task 1 — Create Basic Server

Create an Express server that runs on:

```text
PORT 4000
```

Expected output:

```text
Server started
```

---

# Task 2 — Create APIs

Build these routes:

| Method | Route    |
| ------ | -------- |
| GET    | /        |
| GET    | /student |
| GET    | /course  |

Return JSON response from each route.

---

# Task 3 — Build POST API

Create:

```http
POST /register
```

Accept:

```json
{
  "name": "",
  "email": ""
}
```

Return:

```json
{
  "message": "Registration successful"
}
```

along with received data.

---

# Task 4 — Practice req.body

Print incoming request data in console.

Example:

```js
console.log(req.body);
```

Understand what data arrives from client.

---

# Task 5 — Use Environment Variables

Create:

```env
PORT=5000
```

Use:

```js
process.env.PORT
```

instead of hardcoded port.

---

# Task 6 — Create Separate Module

Create:

## math.js

with:

* add()
* subtract()

functions.

Import them into:

```text
index.js
```

and test them.

---

# Task 7 — Build Mini Information API

Create APIs for:

```http
GET /about
GET /contact
GET /services
```

Return proper JSON data.

---

# Bonus Challenge

Build:

```http
POST /sum
```

Input:

```json
{
  "a": 10,
  "b": 20
}
```

Return:

```json
{
  "result": 30
}
```

This helps you understand:

* req.body
* POST APIs
* JSON handling
* server responses

---

# End Goal of Day 1

By the end of Day 1, you should confidently:

* create Node.js projects
* install packages
* run Express server
* build APIs
* handle JSON requests
* send JSON responses
* use environment variables
* understand request/response cycle
