# DAY 1 — Node.js Fundamentals for Backend

- Phase 1 — Learn by Building
- Goal: Start building APIs immediately and understand how backend works in real life.

---

# What You Will Learn Today

By the end of Day 1, you will understand:

* What backend actually does
* What Node.js is
* npm basics
* Modules
* Express.js introduction
* Request & response
* JSON APIs
* Environment variables

And most importantly:

✅ You will build their first real APIs today.

---

# 1. Understanding Backend

Before learning Node.js, first understand:

> What is backend?

Imagine a food delivery app.

When user clicks:

```text
Order Food
```

many things happen behind the scenes.

Backend handles:

* saving orders
* checking users
* talking to database
* processing payment
* sending responses

---

# Real World Flow

```text
User → Frontend → Backend → Database
```

---

# Example

User clicks login.

Frontend sends:

```http
POST /login
```

Backend:

1. receives email/password
2. checks database
3. verifies password
4. creates token
5. sends response

---

# Simple Analogy

Think like a restaurant.

| Real World | Backend World |
| ---------- | ------------- |
| Customer   | Frontend      |
| Waiter     | API           |
| Kitchen    | Backend       |
| Storage    | Database      |

Frontend shows UI.

Backend does actual work.

---

# 2. What is Node.js?

Normally JavaScript runs only in browser.

Example:

```js
alert("Hello");
```

works in browser only.

But Node.js allows JavaScript to run outside browser.

That means JavaScript can now:

* create servers
* build APIs
* connect databases
* handle files
* create backend systems

---

# Why Node.js Became Popular

---

# 1. Same Language Everywhere

Frontend:

```js
JavaScript
```

Backend:

```js
JavaScript
```

You do not need to learn another language immediately.

---

# 2. Fast Development

Node.js is excellent for:

* REST APIs
* realtime apps
* chat apps
* dashboards
* streaming

---

# 3. Huge Package Ecosystem

Node.js has npm.

npm contains millions of packages.

Example:

* Express
* bcrypt
* jsonwebtoken
* Prisma
* dotenv

---

# 3. Install Node.js

Download:

[Node.js Official Website](https://nodejs.org?utm_source=chatgpt.com)

Install LTS version.

---

# Verify Installation

Open terminal:

```bash
node -v
```

Example output:

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

Used to:

* install packages
* manage dependencies
* run scripts

---

# Example

Install Express:

```bash
npm install express
```

---

# Why Packages Matter

Without packages:

you must build everything manually.

Example:

* authentication system
* password hashing
* database connection
* validation

Packages save huge development time.

---

# 5. Create First Node.js Project

Now let’s build our first backend project.

---

# Step 1 — Create Folder

```bash
mkdir backend-course
```

Move inside:

```bash
cd backend-course
```

---

# Step 2 — Initialize Node.js Project

```bash
npm init -y
```

This creates:

```text
package.json
```

---

# What is package.json?

This is the heart of Node.js project.

It stores:

* project name
* dependencies
* scripts
* version

Example:

```json
{
  "name": "backend-course",
  "version": "1.0.0"
}
```

---

# 6. Enable ES Module Syntax

According to updated project instruction, we will use:

```json
"type": "module"
```

inside package.json. 

---

# Update package.json

```json
{
  "name": "backend-course",
  "version": "1.0.0",
  "type": "module"
}
```

---

# Why?

This allows modern syntax:

```js
import
export
```

instead of:

```js
require
module.exports
```

This is modern JavaScript style.

---

# 7. Understanding Modules

Modules help split code into smaller files.

Without modules:

```text
everything in one file
```

becomes messy.

With modules:

```text
math.js
user.js
product.js
```

code becomes clean.

---

# Real Life Analogy

Think of modules like school subjects.

Instead of:

```text
all subjects inside one notebook
```

we separate:

* Math notebook
* Science notebook
* English notebook

Backend uses same idea.

---

# 8. Export & Import Example

---

# math.js

```js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

---

# index.js

```js
import { add, subtract } from "./math.js";

console.log(add(10, 5));

console.log(subtract(20, 5));
```

---

# Output

```bash
15
15
```

---

# Understanding This Example

---

# export

```js
export function add()
```

means:

> “Other files can use this function.”

---

# import

```js
import { add } from "./math.js";
```

means:

> “Bring add function from math.js.”

---

# Important Note

When using ES modules:

always include:

```js
.js
```

Example:

```js
"./math.js"
```

NOT:

```js
"./math"
```

---

# 9. What is Express.js?

Node.js can create servers directly.

But it becomes difficult quickly.

Express.js makes backend development much easier.

---

# Install Express

```bash
npm install express
```

---

# 10. Create First Server

---

# index.js

```js
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
```

---

# Understanding This Code Step by Step

---

# Step 1 — Import Express

```js
import express from "express";
```

Loads Express package.

---

# Step 2 — Create App

```js
const app = express();
```

Creates Express application.

Think like:

```text
creating backend machine
```

---

# Step 3 — Create Route

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

# Step 4 — Start Server

```js
app.listen(3000)
```

Runs backend on port 3000.

---

# 11. What is a Port?

A port is like a room number or door.

Example:

```text
localhost:3000
```

| Part      | Meaning       |
| --------- | ------------- |
| localhost | your computer |
| 3000      | backend port  |

---

# 12. Run the Server

Open terminal:

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

🎉 Congratulations.

You built your first backend server.

---

# 13. Understanding APIs

API = communication bridge.

Frontend and backend communicate using APIs.

---

# Example

Frontend requests:

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

# Real Analogy

API works like waiter in restaurant.

Customer does not enter kitchen directly.

Waiter handles communication.

---

# 14. HTTP Methods

These are the most important methods.

| Method | Purpose     |
| ------ | ----------- |
| GET    | Read data   |
| POST   | Create data |
| PUT    | Update data |
| DELETE | Remove data |

---

# Example

| Action      | Method |
| ----------- | ------ |
| Get users   | GET    |
| Create user | POST   |
| Update user | PUT    |
| Delete user | DELETE |

---

# 15. Request & Response

---

# Request

Data sent by client.

Example:

```http
GET /hello
```

---

# Response

Data returned by backend.

Example:

```json
{
  "message": "Hello"
}
```

---

# Backend Life Cycle

```text
Request comes in
↓
Backend processes
↓
Response goes back
```

This cycle is extremely important.

---

# 16. Understanding JSON

JSON = JavaScript Object Notation

Used everywhere in backend APIs.

---

# Example JSON

```json
{
  "name": "Dipak",
  "age": 22
}
```

---

# Why JSON is Popular

Because it is:

* lightweight
* readable
* easy to transfer
* frontend friendly

---

# 17. Build Real APIs

Now build actual APIs from lesson plan. 

---

# Final Example

## index.js

```js
import express from "express";

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

# express.json()

```js
app.use(express.json());
```

This middleware converts incoming JSON into JavaScript object.

Without this:

```js
req.body
```

will become:

```js
undefined
```

---

# Example

Incoming request:

```json
{
  "name": "Dipak"
}
```

becomes:

```js
req.body.name
```

which gives:

```js
"Dipak"
```

---

# GET /hello

```js
app.get("/hello")
```

Handles GET request.

Response:

```json
{
  "message": "Hello Student"
}
```

---

# GET /about

Returns application information.

Very common in APIs.

---

# POST /data

Accepts data from client.

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

# 18. Testing APIs Using Postman

Download:

[Postman Official Website](https://www.postman.com?utm_source=chatgpt.com)

---

# Test GET API

Method:

```text
GET
```

URL:

```text
http://localhost:3000/hello
```

---

# Test POST API

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

# 19. Environment Variables

Never hardcode sensitive values.

Bad example:

```js
const password = "123456";
```

---

# Install dotenv

```bash
npm install dotenv
```

---

# Create .env

```env
PORT=3000
```

---

# Use Environment Variable

## index.js

```js
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
```
## NOTE: if env failed to load
- Create .vscode/launch.json file
- Add the below code to launch.json
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program (Native .env)",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/index.js",
            "runtimeArgs": [
                "--env-file=.env"
            ]
        }
    ]
}

```

---

# Why Environment Variables Matter

Used for:

* database password
* JWT secret
* API keys
* production configuration

Very important for security.

---

# 20. Important Beginner Mistakes

---

# 1. Forgetting express.json()

Problem:

```js
req.body = undefined
```

---

# 2. Wrong Port

Error:

```text
EADDRINUSE
```

means another app already uses that port.

---

# 3. Forgetting .js in Import

Wrong:

```js
import add from "./math";
```

Correct:

```js
import add from "./math.js";
```

---

# 4. Forgetting to Restart Server

After changing code:

```bash
CTRL + C
node index.js
```

---

# 21. Recommended Beginner Folder Structure

```text
backend-course/
│
├── node_modules/
├── package.json
├── package-lock.json
├── .env
├── index.js
└── math.js
```

---

# 22. Day 1 Summary

Today you learned:

* Backend fundamentals
* Node.js basics
* npm
* Modules
* Import/export
* Express basics
* APIs
* JSON
* Request/response
* Environment variables

Most importantly:

✅ You built working APIs on Day 1.

---

# DAY 1 Practical Tasks

These tasks are extremely important.

You should complete all tasks themselves.

---

# Task 1 — Create Basic Server

Create Express server on:

```text
PORT 4000
```

Expected response:

```text
Server Started
```

---

# Task 2 — Build APIs

Create these APIs:

| Method | Route    |
| ------ | -------- |
| GET    | /        |
| GET    | /student |
| GET    | /course  |

Return proper JSON response.

---

# Task 3 — Create POST API

Build:

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

instead of hardcoded value.

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

using:

```js
import
export
```

syntax.

---

# Task 7 — Build Information APIs

Create:

```http
GET /about
GET /contact
GET /services
```

Return proper JSON responses.

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