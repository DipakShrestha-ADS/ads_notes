# Day 5 - CRUD API Basics with Express

## What You Will Learn Today

- What CRUD stands for and how it maps to HTTP methods
- How to design routes for full CRUD operations
- How to use route parameters to target specific records
- How to work with in-memory data before adding a real database
- How to return correct status codes for each operation
- How to test a complete CRUD API using Postman

---

## 1. What Is CRUD

CRUD is an acronym that represents the four basic operations on any data:

| Letter | Operation | HTTP Method  | What It Does              |
| ------ | --------- | ------------ | ------------------------- |
| C      | Create    | POST         | Add a new record          |
| R      | Read      | GET          | Get one or many records   |
| U      | Update    | PUT or PATCH | Modify an existing record |
| D      | Delete    | DELETE       | Remove a record           |

Every application you build involves CRUD. A blog lets you create, read, update, and delete posts. A user system lets you register, view profiles, update details, and delete accounts. Today you build the full CRUD pattern using a JavaScript array as temporary storage.

---

## 2. Setting Up the Project

```bash
mkdir day5-crud-api
cd day5-crud-api
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg
npm i prisma --save-dev
npm i -D nodemon
mkdir src
```

Update `package.json`:

```json
{
  "name": "day5-crud-api",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

Create `.env`:

```
PORT=8888
```

Create `.gitignore`:

```
node_modules/
.env
dist/
```

---

## 3. The In-Memory Data Array

An in-memory array is a JavaScript array that acts as a temporary database. The data only lives while the server is running. When you restart the server, everything resets.

Create `src/server.js` and start with this:

```javascript
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());  // enable reading JSON from request bodies

const PORT = process.env.PORT || 8888;

// This array is our temporary database
// In a real project, this data will come from PostgreSQL
let users = [
  { id: 1, name: 'Ali Raza', email: 'ali@example.com', age: 25 },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', age: 22 },
  { id: 3, name: 'Sita Karki', email: 'sita@example.com', age: 28 }
];

// nextId tracks the ID to use for the next new user
// Since we already have IDs 1, 2, 3 - the next one is 4
let nextId = 4;
```

---

## 4. Building Each CRUD Route

### GET /users - Read All

```javascript
// GET /users - returns the full list of users
app.get('/users', (req, res) => {
  // status 200 = OK (success, data returned)
  res.status(200).json({
    count: users.length,  // total number of users in the array
    users: users          // the actual array of user objects
  });
});
```

### GET /users/:id - Read One

```javascript
// GET /users/:id - returns a single user by their ID
app.get('/users/:id', (req, res) => {
  // req.params.id comes from the URL as a STRING like "2"
  // parseInt converts it to a number 2 so we can compare with user.id
  const id = parseInt(req.params.id);

  // find() searches the array and returns the first match
  // If no match is found, it returns undefined
  const user = users.find(u => u.id === id);

  // If user is undefined (not found), return 404 Not Found
  if (!user) {
    return res.status(404).json({ error: `User with id ${id} not found` });
  }

  // User was found - return it with status 200
  res.status(200).json(user);
});
```

### POST /users - Create

```javascript
// POST /users - creates a new user from the request body
app.post('/users', (req, res) => {
  // Destructure the fields we expect from the request body
  const { name, email, age } = req.body;

  // Validate required fields
  // If name or email is missing, reject with 400 Bad Request
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Build the new user object
  const newUser = {
    id: nextId,        // use current nextId value
    name,              // shorthand for name: name
    email,             // shorthand for email: email
    age: age || null   // age is optional; use null if not provided
  };

  nextId++;             // increment so the next user gets a different ID
  users.push(newUser);  // add the new user to the array

  // status 201 = Created (use this when a new resource is made)
  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
});
```

### PUT /users/:id - Update (Replace Whole Record)

```javascript
// PUT /users/:id - replaces all fields of an existing user
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // findIndex returns the array position (0, 1, 2...)
  // Returns -1 if no match is found
  const index = users.findIndex(u => u.id === id);

  // If index is -1, the user does not exist
  if (index === -1) {
    return res.status(404).json({ error: `User with id ${id} not found` });
  }

  const { name, email, age } = req.body;

  // Validate required fields (same as POST)
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Replace the user at this index with new data
  // We keep the same id so it does not change
  users[index] = {
    id: id,          // keep the original id
    name,            // use new name from body
    email,           // use new email from body
    age: age || null
  };

  res.status(200).json({
    message: 'User updated successfully',
    user: users[index]  // return the updated user
  });
});
```

### DELETE /users/:id - Delete

```javascript
// DELETE /users/:id - removes a user from the array
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `User with id ${id} not found` });
  }

  // splice(index, 1) removes exactly 1 element starting at position 'index'
  users.splice(index, 1);

  res.status(200).json({ message: `User with id ${id} deleted successfully` });
});
```

---

## 5. The Complete src/server.js

```javascript
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8888;

// Temporary in-memory database
let users = [
  { id: 1, name: 'Ali Raza', email: 'ali@example.com', age: 25 },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', age: 22 },
  { id: 3, name: 'Sita Karki', email: 'sita@example.com', age: 28 }
];
let nextId = 4;

// READ ALL
app.get('/users', (req, res) => {
  res.status(200).json({ count: users.length, users });
});

// READ ONE
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);        // convert URL string to number
  const user = users.find(u => u.id === id); // search array
  if (!user) return res.status(404).json({ error: `User ${id} not found` });
  res.status(200).json(user);
});

// CREATE
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const newUser = { id: nextId++, name, email, age: age || null };
  // nextId++ uses current value (e.g. 4) then increments to 5
  users.push(newUser);
  res.status(201).json({ message: 'User created', user: newUser });
});

// UPDATE
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id); // -1 if not found
  if (index === -1) return res.status(404).json({ error: `User ${id} not found` });
  const { name, email, age } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  users[index] = { id, name, email, age: age || null };
  res.status(200).json({ message: 'User updated', user: users[index] });
});

// DELETE
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: `User ${id} not found` });
  users.splice(index, 1);  // remove 1 element at this position
  res.status(200).json({ message: `User ${id} deleted` });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`CRUD server running at http://localhost:${PORT}`);
});
```

---

## 6. Testing in Postman

### Get all users

```
Method: GET
URL: http://localhost:8888/users
Expected: all 3 users, status 200
```

### Get one user

```
Method: GET
URL: http://localhost:8888/users/2
Expected: Priya Sharma, status 200
```

### Get a user that does not exist

```
Method: GET
URL: http://localhost:8888/users/99
Expected: 404 error message
```

### Create a new user

```
Method: POST
URL: http://localhost:8888/users
Headers: Content-Type: application/json
Body: { "name": "Ramesh", "email": "ramesh@example.com", "age": 30 }
Expected: 201 with the new user object
```

### Update a user

```
Method: PUT
URL: http://localhost:8888/users/1
Headers: Content-Type: application/json
Body: { "name": "Ali Updated", "email": "ali.new@example.com", "age": 26 }
Expected: 200 with updated user
```

### Delete a user

```
Method: DELETE
URL: http://localhost:8888/users/3
Expected: 200 with deletion message
```

---

## Summary

Here is what you covered today:

- CRUD stands for Create, Read, Update, Delete. These are the four operations on any dataset.
- GET reads data, POST creates data, PUT replaces data, DELETE removes data.
- `req.params.id` comes from the URL as a string. Always use `parseInt()` to convert it to a number.
- `find()` returns the matching object or `undefined`. `findIndex()` returns the position or `-1`.
- Always use `return` before sending an error response so the function stops there.
- Use status 201 for POST (created), 200 for GET/PUT/DELETE (success), 400 for bad input, 404 for not found.

---

## Practice Tasks

1. Create a fresh CRUD project using the standard setup from Day 2.
2. Build a CRUD API for `products` instead of users.
3. Each product should have: `id`, `name`, `price`, `category`, and `inStock` (true or false).
4. Pre-populate the array with at least 5 products.
5. Build all 5 routes: GET all, GET one, POST, PUT, DELETE.
6. Test every route in Postman and confirm the correct status codes.

---

## Homework

- Build CRUD APIs for a `products` array.
- Each product should have id, name, price, category, and inStock (true or false).
- Add at least five sample product records.
- Make sure that if you try to get or delete a product that does not exist, you get a 404 with a clear message.

---

## 1. What Is CRUD

CRUD is an acronym that represents the four basic operations you can perform on any data:

| Letter | Operation | HTTP Method  | What It Does                 |
| ------ | --------- | ------------ | ---------------------------- |
| C      | Create    | POST         | Add a new record             |
| R      | Read      | GET          | Retrieve one or many records |
| U      | Update    | PUT or PATCH | Modify an existing record    |
| D      | Delete    | DELETE       | Remove a record              |

Every application you build involves CRUD in some form. A blog lets you create, read, update, and delete posts. A user management system lets you create accounts, read profiles, update details, and delete users.

Today you will build a complete CRUD API for users, using a simple JavaScript array to store the data temporarily. There is no database yet. You are learning the patterns first.

---

## 2. In-Memory Data Storage

An in-memory array is just a JavaScript array that lives in your server's memory. When the server restarts, the data resets. It is not permanent, but it is perfect for learning the CRUD pattern before connecting a real database.

Here is the users array you will work with:

```javascript
// This is our temporary in-memory storage
// It acts like a database for now
let users = [
  { id: 1, name: 'Ali Raza', email: 'ali@example.com', age: 25 },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', age: 22 },
  { id: 3, name: 'Sita Karki', email: 'sita@example.com', age: 28 }
];

// This will be used to generate the next user ID
let nextId = 4;
```

Line by line:

- `let users = [...]` creates an array of user objects. Each user has an `id`, `name`, `email`, and `age`.
- `let nextId = 4` keeps track of the next ID to assign. Since we already have IDs 1, 2, and 3, the next one is 4. Each time you create a user, you will use this and then increment it.

---

## 3. Setting Up the Project

Create a new project:

```bash
mkdir day5-crud-api
cd day5-crud-api
npm init -y
npm install express dotenv
```

Update `package.json`:

```json
{
  "name": "day5-crud-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node app.js",
    "dev": "node --watch app.js"
  }
}
```

Create `.env`:

```
PORT=3000
```

---

## 4. Building Each CRUD Route

Create `app.js` and start with the setup:

```javascript
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// In-memory users array
let users = [
  { id: 1, name: 'Ali Raza', email: 'ali@example.com', age: 25 },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', age: 22 },
  { id: 3, name: 'Sita Karki', email: 'sita@example.com', age: 28 }
];

let nextId = 4;
```

---

### Route 1: GET /users - Get All Users

```javascript
// GET /users - Returns the full list of users
app.get('/users', (req, res) => {
  // Send all users with status 200
  res.status(200).json({
    count: users.length,  // Total number of users in the array
    users: users          // The users array itself
  });
});
```

Line by line:

- `users.length` counts how many users are in the array. This is a useful detail to include in list responses.
- `users: users` sends the entire array. In modern JavaScript, you can shorten this to just `users` when the key and variable name are the same: `res.status(200).json({ count: users.length, users })`.

---

### Route 2: GET /users/:id - Get One User

```javascript
// GET /users/:id - Returns a single user by their ID
app.get('/users/:id', (req, res) => {
  // Convert the URL parameter from string to number
  const id = parseInt(req.params.id);

  // Search the array for a user with matching id
  const user = users.find(u => u.id === id);

  // If no user was found, return 404
  if (!user) {
    return res.status(404).json({ error: `User with id ${id} not found` });
  }

  // If found, return the user
  res.status(200).json(user);
});
```

Line by line:

- `req.params.id` reads the `:id` value from the URL. If the URL is `/users/2`, this gives you the string `"2"`.
- `parseInt(req.params.id)` converts the string `"2"` into the number `2`. This is important because your array has numeric IDs, and comparing `"2" === 2` would be false.
- `users.find(u => u.id === id)` searches through the array and returns the first user whose `id` matches. If no match is found, `find` returns `undefined`.
- `if (!user)` checks if the result is `undefined`, meaning no user was found.
- `return res.status(404).json({...})` sends a 404 and stops the function. The `return` prevents the code below from running.

---

### Route 3: POST /users - Create a New User

```javascript
// POST /users - Creates a new user
app.post('/users', (req, res) => {
  // Extract fields from the request body
  const { name, email, age } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Create the new user object with an auto-generated ID
  const newUser = {
    id: nextId,    // Assign the current nextId value
    name,          // Shorthand for name: name
    email,         // Shorthand for email: email
    age: age || null  // Age is optional; use null if not provided
  };

  // Increment nextId so the next user gets a different ID
  nextId++;

  // Add the new user to the array
  users.push(newUser);

  // Return 201 Created with the new user
  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
});
```

Line by line:

- `const { name, email, age } = req.body` uses destructuring to pull three fields out of the request body. This is cleaner than writing `req.body.name`, `req.body.email` separately.
- `if (!name || !email)` checks that both name and email were provided. The `||` means "or" - if either one is missing, the validation fails.
- `id: nextId` assigns the current value of `nextId` to the new user.
- `name,` is shorthand for `name: name`. When the key and variable have the same name, you only need to write it once.
- `age: age || null` means: use the provided age, but if age was not sent, use `null`.
- `nextId++` increments the counter by 1. The next user will get ID 5, then 6, and so on.
- `users.push(newUser)` adds the new user object to the end of the array.

---

### Route 4: PUT /users/:id - Update a User

```javascript
// PUT /users/:id - Replaces all fields of a user
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // Find the index (position) of the user in the array
  const index = users.findIndex(u => u.id === id);

  // If index is -1, the user was not found
  if (index === -1) {
    return res.status(404).json({ error: `User with id ${id} not found` });
  }

  // Get the new data from the request body
  const { name, email, age } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Replace the old user with the new data
  // We keep the original id so it does not change
  users[index] = {
    id: id,      // Keep the same id
    name,        // Use new name
    email,       // Use new email
    age: age || null
  };

  // Return the updated user
  res.status(200).json({
    message: 'User updated successfully',
    user: users[index]
  });
});
```

Line by line:

- `users.findIndex(u => u.id === id)` finds the position (index) of the user in the array. If found, it returns a number like `0`, `1`, or `2`. If not found, it returns `-1`.
- `if (index === -1)` checks if the user was not found.
- `users[index] = {...}` replaces the entire user object at that position with new data. This is a full replacement, which is what PUT is supposed to do.
- We keep `id: id` to make sure the user's ID does not change during the update.

---

### Route 5: DELETE /users/:id - Delete a User

```javascript
// DELETE /users/:id - Removes a user from the array
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // Find the index of the user to delete
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `User with id ${id} not found` });
  }

  // Remove the user at the found index
  // splice(index, 1) removes exactly 1 element starting from index
  users.splice(index, 1);

  // Return 200 with a success message
  // No user data returned since it was deleted
  res.status(200).json({ message: `User with id ${id} deleted successfully` });
});
```

Line by line:

- `users.splice(index, 1)` removes one element from the array at the given position. After this, the user is gone from the in-memory array.
- The response returns 200 with a confirmation message. Some APIs return 204 (No Content) for deletes, but returning a message with 200 is also acceptable and more user-friendly.

---

## 5. The Complete app.js

```javascript
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

let users = [
  { id: 1, name: 'Ali Raza', email: 'ali@example.com', age: 25 },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', age: 22 },
  { id: 3, name: 'Sita Karki', email: 'sita@example.com', age: 28 }
];

let nextId = 4;

// Get all users
app.get('/users', (req, res) => {
  res.status(200).json({ count: users.length, users });
});

// Get one user by ID
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: `User ${id} not found` });
  res.status(200).json(user);
});

// Create a new user
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const newUser = { id: nextId++, name, email, age: age || null };
  users.push(newUser);
  res.status(201).json({ message: 'User created', user: newUser });
});

// Update a user
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: `User ${id} not found` });

  const { name, email, age } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  users[index] = { id, name, email, age: age || null };
  res.status(200).json({ message: 'User updated', user: users[index] });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: `User ${id} not found` });
  users.splice(index, 1);
  res.status(200).json({ message: `User ${id} deleted` });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`CRUD server running at http://localhost:${PORT}`);
});
```

Note: `{ id: nextId++, name, email, age: age || null }` uses `nextId++` which uses the current value first and then increments it. This is a concise way to assign and increment at the same time.

---

## 6. Testing the CRUD API in Postman

### Get all users

```
Method: GET
URL: http://localhost:3000/users

Expected: All 3 users, status 200
```

### Get one user

```
Method: GET
URL: http://localhost:3000/users/2

Expected: Priya Sharma's data, status 200
```

### Get non-existent user

```
Method: GET
URL: http://localhost:3000/users/99

Expected: 404 error with message
```

### Create a new user

```
Method: POST
URL: http://localhost:3000/users
Body: { "name": "Ramesh", "email": "ramesh@example.com", "age": 30 }

Expected: 201 with the new user
```

### Update a user

```
Method: PUT
URL: http://localhost:3000/users/1
Body: { "name": "Ali Updated", "email": "ali.updated@example.com", "age": 26 }

Expected: 200 with updated user
```

### Delete a user

```
Method: DELETE
URL: http://localhost:3000/users/3

Expected: 200 with deletion message
```

---

## Summary

Here is what you covered today:

- CRUD stands for Create, Read, Update, Delete. These are the four fundamental operations on any dataset.
- GET retrieves data, POST creates data, PUT replaces data, DELETE removes data.
- Route parameters like `:id` let you target specific records by their identifier.
- `parseInt(req.params.id)` converts the URL string to a number for comparison.
- `find()` returns the matching object. `findIndex()` returns its position in the array. Both return a falsy value (`undefined` or `-1`) when nothing matches.
- Always validate required fields and return appropriate error status codes like 400 and 404 when something is wrong.

---

## Practice Tasks

1. Create a fresh CRUD API for `products` instead of users.
2. Each product should have: `id`, `name`, `price`, and `category`.
3. Pre-populate the array with at least 5 products.
4. Build all 5 routes: GET all, GET one, POST, PUT, DELETE.
5. Test every route in Postman and verify the correct status codes.

---

## Homework

- Build CRUD APIs for a `products` array.
- Each product should have id, name, price, category, and inStock (true or false).
- Add at least five sample product records.
- Make sure that if someone tries to get or delete a product that does not exist, they get a 404 with a clear message.
