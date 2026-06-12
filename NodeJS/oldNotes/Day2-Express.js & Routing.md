# DAY 2 — Express.js & Routing

# What You Will Learn Today

Today you will learn:

* What Express.js is
* How routing works
* How backend APIs are created
* HTTP methods
* Route parameters
* Query parameters
* Middleware
* Status codes
* Building full CRUD APIs

By the end of this lesson, you will build a complete Users API.

---

# What You Will Build

You will create these APIs:

```bash
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id
```

This is called a CRUD API.

| Operation | Meaning     |
| --------- | ----------- |
| Create    | Add data    |
| Read      | Get data    |
| Update    | Edit data   |
| Delete    | Remove data |

---

# 1. What is Express.js?

## Simple Definition

Express.js is a framework for Node.js that helps build backend APIs easily.

Without Express:

* backend coding becomes difficult
* routing becomes messy
* request handling becomes harder

Express makes backend development:

* simple
* clean
* fast

---

# Real Life Example

Imagine Node.js is:

```text
Engine of a car
```

Then Express.js is:

```text
The steering + controls
```

It helps control everything easily.

---

# 2. Create New Project

## Step 1 — Create Folder

```bash
mkdir day2-express-routing
```

---

## Step 2 — Open Folder

```bash
cd day2-express-routing
```

---

## Step 3 — Initialize Node.js Project

```bash
npm init -y
```

---

# 3. Enable ES Module

Open:

```json
package.json
```

Add:

```json
"type": "module"
```

---

## Final Example

```json
{
  "name": "day2-express-routing",
  "version": "1.0.0",
  "type": "module"
}
```

---

# Why We Use `"type": "module"`

This allows modern import/export syntax.

Instead of:

```javascript
const express = require("express");
```

you can use:

```javascript
import express from "express";
```

This is modern JavaScript.

---

# 4. Install Express

```bash
npm install express
```

---

# 5. Create Main File

Create:

```bash
index.js
```

---

# 6. Create Your First Express Server

Add this code:

```javascript
import express from "express";

const app = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

# Understanding This Code Step by Step

---

## Import Express

```javascript
import express from "express";
```

This imports Express library.

---

## Create App

```javascript
const app = express();
```

This creates the Express application.

This `app` controls:

* routes
* requests
* responses
* middleware

---

## Create Port

```javascript
const PORT = 3000;
```

Port is where backend runs.

Your backend URL becomes:

```text
http://localhost:3000
```

---

## Start Server

```javascript
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

This starts backend server.

---

# 7. Run The Server

Open terminal:

```bash
node index.js
```

You should see:

```bash
Server running on port 3000
```

---

# 8. What is Routing?

## Simple Meaning

Routing means:

> “If user visits this URL, run this function.”

---

# Visual Flow

```text
User Request
     ↓
Route Matches
     ↓
Function Runs
     ↓
Response Sent
```

---

# 9. Create Your First Route

Add this above `app.listen()`:

```javascript
app.get("/", (req, res) => {
  res.send("Welcome to Express.js");
});
```

---

# Full Code

```javascript
import express from "express";

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to Express.js");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

# Test It

Visit:

```text
http://localhost:3000
```

You will see:

```text
Welcome to Express.js
```

---

# 10. Understanding Request & Response

---

# Request (`req`)

Contains information sent by client.

Example:

* body
* params
* query
* headers

---

# Response (`res`)

Used to send data back.

Example:

```javascript
res.send()
res.json()
res.status()
```

---

# 11. HTTP Methods

Backend APIs mainly use these methods.

---

# GET

Used to get data.

Example:

```javascript
app.get("/users", () => {});
```

---

# POST

Used to create data.

Example:

```javascript
app.post("/users", () => {});
```

---

# PUT

Used to update data.

Example:

```javascript
app.put("/users/:id", () => {});
```

---

# DELETE

Used to delete data.

Example:

```javascript
app.delete("/users/:id", () => {});
```

---

# 12. Create Fake Users Data

Add this above routes:

```javascript
const users = [
  {
    id: 1,
    name: "Ram"
  },
  {
    id: 2,
    name: "Hari"
  }
];
```

---

# Why Fake Data?

Right now database is not connected yet.

So we temporarily use array.

Later you will replace this with PostgreSQL database.

---

# 13. GET All Users API

Add:

```javascript
app.get("/users", (req, res) => {
  res.json(users);
});
```

---

# Why `res.json()`?

`res.json()` sends JSON response.

Most APIs return JSON.

---

# Test

Visit:

```text
http://localhost:3000/users
```

Response:

```json
[
  {
    "id": 1,
    "name": "Ram"
  },
  {
    "id": 2,
    "name": "Hari"
  }
]
```

---

# 14. Route Parameters

## What Are Route Params?

Dynamic values inside URL.

Example:

```text
/users/1
/users/2
/users/50
```

Numbers are dynamic.

---

# Visual Understanding

```text
/users/:id
```

Here:

```text
:id
```

means dynamic value.

---

# 15. GET User By ID

Add:

```javascript
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;

  const user = users.find((item) => item.id == userId);

  res.json(user);
});
```

---

# Understanding This Step by Step

---

## Step 1

Get ID from URL.

```javascript
const userId = req.params.id;
```

If URL is:

```text
/users/2
```

Then:

```javascript
userId = 2
```

---

## Step 2

Find matching user.

```javascript
users.find()
```

---

## Step 3

Return user.

```javascript
res.json(user);
```

---

# Test

Visit:

```text
http://localhost:3000/users/1
```

Response:

```json
{
  "id": 1,
  "name": "Ram"
}
```

---

# 16. Middleware

# What is Middleware?

Middleware is a function that runs before route.

---

# Visual Flow

```text
Request
   ↓
Middleware
   ↓
Route
   ↓
Response
```

---

# Middleware Can:

* modify request
* validate data
* check authentication
* log requests

---

# 17. JSON Middleware

Add this below app creation:

```javascript
app.use(express.json());
```

---

# Why This is Important

Without this:

```javascript
req.body
```

will become:

```javascript
undefined
```

This middleware converts JSON body into JavaScript object.

---

# 18. POST User API

Add:

```javascript
app.post("/users", (req, res) => {
  const newUser = req.body;

  users.push(newUser);

  res.status(201).json({
    message: "User created successfully",
    user: newUser
  });
});
```

---

# Understanding Step by Step

---

## Step 1

Receive data.

```javascript
const newUser = req.body;
```

---

## Step 2

Insert into array.

```javascript
users.push(newUser);
```

---

## Step 3

Send response.

```javascript
res.json()
```

---

# Test POST API

Use:

* Postman
* Thunder Client
* Insomnia

---

# Method

```text
POST
```

---

# URL

```text
http://localhost:3000/users
```

---

# JSON Body

```json
{
  "id": 3,
  "name": "Sita"
}
```

---

# Expected Response

```json
{
  "message": "User created successfully",
  "user": {
    "id": 3,
    "name": "Sita"
  }
}
```

---

# 19. PUT API (Update User)

Add:

```javascript
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;

  const updatedData = req.body;

  const user = users.find((item) => item.id == userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  user.name = updatedData.name;

  res.json({
    message: "User updated successfully",
    user
  });
});
```

---

# Understanding PUT Flow

---

## Step 1

Get user ID.

---

## Step 2

Get updated data.

---

## Step 3

Find user.

---

## Step 4

Update user.

---

## Step 5

Return response.

---

# 20. HTTP Status Codes

# Common Status Codes

| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 201  | Created      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not Found    |
| 500  | Server Error |

---

# Example

```javascript
res.status(404).json({
  message: "User not found"
});
```

---

# 21. DELETE API

Add:

```javascript
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  const userIndex = users.findIndex(
    (item) => item.id == userId
  );

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  users.splice(userIndex, 1);

  res.json({
    message: "User deleted successfully"
  });
});
```

---

# Understanding `splice()`

```javascript
users.splice(index, 1);
```

Means:

```text
Remove 1 item from array at given index
```

---

# 22. Query Parameters

# What Are Query Params?

Extra data sent in URL.

---

# Example

```text
/users?name=Ram
```

Here:

```text
name=Ram
```

is query parameter.

---

# 23. Create Search API

Add:

```javascript
app.get("/search", (req, res) => {
  const name = req.query.name;

  res.json({
    searchedName: name
  });
});
```

---

# Test

Visit:

```text
http://localhost:3000/search?name=Hari
```

Response:

```json
{
  "searchedName": "Hari"
}
```

---

# 24. Complete Final Code

```javascript
import express from "express";

const app = express();

const PORT = 3000;

app.use(express.json());

const users = [
  {
    id: 1,
    name: "Ram"
  },
  {
    id: 2,
    name: "Hari"
  }
];

app.get("/", (req, res) => {
  res.send("Welcome to Express.js");
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;

  const user = users.find(
    (item) => item.id == userId
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  res.json(user);
});

app.post("/users", (req, res) => {
  const newUser = req.body;

  users.push(newUser);

  res.status(201).json({
    message: "User created successfully",
    user: newUser
  });
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;

  const updatedData = req.body;

  const user = users.find(
    (item) => item.id == userId
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  user.name = updatedData.name;

  res.json({
    message: "User updated successfully",
    user
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  const userIndex = users.findIndex(
    (item) => item.id == userId
  );

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  users.splice(userIndex, 1);

  res.json({
    message: "User deleted successfully"
  });
});

app.get("/search", (req, res) => {
  const name = req.query.name;

  res.json({
    searchedName: name
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

# 25. Project Structure

```text
day2-express-routing/
│
├── node_modules/
├── package.json
├── package-lock.json
└── index.js
```

---

# 26. Common Beginner Mistakes

# Forgetting `express.json()`

Then:

```javascript
req.body
```

becomes undefined.

---

# Using Wrong HTTP Method

Example:

Using GET instead of POST.

---

# Forgetting `return`

Wrong:

```javascript
res.status(404).json({
  message: "Not found"
});

console.log("Still running");
```

Correct:

```javascript
return res.status(404).json({
  message: "Not found"
});
```

---

# Wrong Route Order

Example:

```javascript
/users/search
/users/:id
```

Sometimes dynamic route can capture wrong path.

---

# 27. Real World Understanding

Almost every backend application uses:

* routes
* requests
* responses
* CRUD operations

Today you learned the core structure of backend APIs.

This is the foundation of:

* ecommerce systems
* banking systems
* restaurant systems
* mobile app backends
* admin panels

---

# 28. Practice Tasks

# Task 1 — Product CRUD API

Create:

```bash
GET /products
GET /products/:id
POST /products
PUT /products/:id
DELETE /products/:id
```

---

# Product Structure

```json
{
  "id": 1,
  "name": "Laptop",
  "price": 50000
}
```

---

# Task 2 — Add Email Field

Update users:

```json
{
  "id": 1,
  "name": "Ram",
  "email": "ram@gmail.com"
}
```

---

# Task 3 — Build Search API

Example:

```text
/users/search?name=Ram
```

Return matching users.

---

# Task 4 — Add Validation

If name is missing:

```json
{
  "message": "Name is required"
}
```

with:

```text
400 status code
```

---

# Task 5 — Build Student CRUD API

Fields:

```json
{
  "id": 1,
  "name": "Dipak",
  "course": "Node.js"
}
```

Implement full CRUD.

---

# 29. Mini Challenge

Try creating these APIs yourself without watching notes:

```bash
GET /movies
POST /movies
DELETE /movies/:id
```

Fields:

```json
{
  "id": 1,
  "title": "Interstellar",
  "rating": 9
}
```

---

# 30. Some Important Questions

# Q1. What is Express.js?

Express.js is a Node.js framework used for building backend APIs and servers.

---

# Q2. What is Middleware?

Middleware is a function that runs between request and response.

---

# Q3. Difference Between Route Params and Query Params?

---

## Route Params

Used for identifying resource.

Example:

```text
/users/1
```

---

## Query Params

Used for filtering/searching.

Example:

```text
/users?name=Ram
```

---

# Q4. Why Use `express.json()`?

To parse JSON request body.

---

# Q5. Difference Between POST and PUT?

| POST        | PUT         |
| ----------- | ----------- |
| Create data | Update data |