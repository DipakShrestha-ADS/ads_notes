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

## Campus Store Storyline Project - Level 5

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 5 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 4 is your starting checkpoint. You can review it in [Day 4](<Day4-Express.js Introduction and First Server.md>).

You add products and let a client create, read, update, and delete them.

### Today’s Project Level

No new package is required.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Replace | `src/server.js` | Add the product array and all five CRUD route handlers. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 4 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 5 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Replace `src/server.js`

Add the product array and all five CRUD route handlers.

**File: `src/server.js`**

~~~javascript
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

const products = [
  { id: 1, title: 'Notebook', price: 4.5 },
  { id: 2, title: 'Campus Hoodie', price: 28 },
];
let nextId = 3;

app.get('/', (req, res) => res.json({ message: 'Campus Store API is running' }));
app.get('/products', (req, res) => res.json({ data: products }));
app.get('/products/:id', (req, res) => {
  const product = products.find(item => item.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ data: product });
});
app.post('/products', (req, res) => {
  const { title, price } = req.body;
  if (!title || typeof price !== 'number') return res.status(400).json({ message: 'title and numeric price are required' });
  const product = { id: nextId++, title, price };
  products.push(product);
  res.status(201).json({ data: product });
});
app.put('/products/:id', (req, res) => {
  const product = products.find(item => item.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const { title, price } = req.body;
  if (!title || typeof price !== 'number') return res.status(400).json({ message: 'title and numeric price are required' });
  product.title = title;
  product.price = price;
  res.json({ data: product });
});
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  products.splice(index, 1);
  res.status(204).send();
});

const port = Number(process.env.PORT) || 8888;
app.listen(port, () => console.log(`Campus Store API running at http://localhost:${port}`));
~~~

This is the complete Level 5 version of `src/server.js`. Add the product array and all five CRUD route handlers. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Test `GET /products`, `POST /products`, `GET /products/:id`, `PUT /products/:id`, and `DELETE /products/:id`.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 5, your reference project has this cumulative structure:

```text
campus-store-api/
├── docs/
│   └── api-plan.md
├── src/
│   └── server.js
├── .env.example
├── .gitignore
├── package-lock.json
└── package.json
```

Your completed checkpoint now:

- Lists and reads products.
- Creates products with `201 Created`.
- Updates and deletes products.
- Returns `404` for missing product IDs.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Test `GET /products`, `POST /products`, `GET /products/:id`, `PUT /products/:id`, and `DELETE /products/:id`.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Apply the same CRUD pattern to books, courses, posts, tasks, jobs, vehicles, or another main resource.

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

CRUD works, but every request reaches a route without common checks. Level 6 introduces middleware. Continue with [Day 6](<Day6-Middleware in Express.md>).
