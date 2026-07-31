# Day 4 - Express.js Introduction and First Server

## What You Will Learn Today

- What Express.js is and why you need it
- How to install Express and set up a project
- How to create your first Express server in `src/server.js`
- What `req` and `res` objects are and what they contain
- How to send text, JSON, and status codes in responses
- How to accept JSON data from incoming requests
- How to test your server with Postman or Thunder Client

---

## 1. What Is Express.js

Before Express.js, building a web server in plain Node.js required a lot of manual work. You had to parse the URL yourself, figure out the route manually, collect the request body piece by piece, set response headers by hand, and so on.

Express.js removes all of that. It is a minimal and flexible framework built on top of Node.js that gives you clean tools to define routes and handle requests with just a few lines.

Think of Node.js as the raw engine of a car. It is powerful but you need a lot of other parts to make it drivable. Express.js is like the steering wheel, pedals, and dashboard. It makes the engine useful and comfortable.

Express is the most popular Node.js framework in the world. Almost every Node.js backend course and job you will find uses Express.

---

## 2. Setting Up a Day 4 Project

Follow the standard project setup from Day 2.

### Step 1 - Create and initialize the project

```bash
mkdir day4-express-server
cd day4-express-server
npm init -y
```

### Step 2 - Install packages

```bash
npm i express dotenv pg @prisma/client @prisma/adapter-pg
npm i prisma --save-dev
npm i -D nodemon
```

### Step 3 - Update package.json

Open `package.json` and update:

```json
{
  "name": "day4-express-server",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

### Step 4 - Create .env

```
PORT=8888
POSTGRES_USER=userdipak
POSTGRES_PASSWORD=user_password
POSTGRES_DB=student_record
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/student_record?schema=public"
```

### Step 5 - Create .gitignore

```
node_modules/
.env
dist/
```

### Step 6 - Create the src folder

```bash
mkdir src
```

---

## 3. Creating Your First Express Server

Create `src/server.js` and write:

```javascript
// ALWAYS import dotenv first so env vars are available to everything below
import 'dotenv/config';

// Import the express framework
import express from 'express';

// Create the Express application - this 'app' object is your server
const app = express();

// Tell Express to automatically parse JSON in incoming request bodies
// Without this, req.body will be undefined for POST/PUT requests
app.use(express.json());

// Read PORT from .env file, fall back to 8888 if not set
const PORT = process.env.PORT || 8888;

// Define a route: when someone visits GET /, run this function
app.get('/', (req, res) => {
  // res.send sends a plain text response
  res.send('Welcome to my Express server!');
});

// Start the server and listen on the PORT for incoming requests
app.listen(PORT, () => {
  // This callback runs once when the server is ready
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

Run the server:

```bash
npm run dev
```

Open your browser at `http://localhost:8888`. You will see the welcome text.

---

## 4. Understanding req and res

Every route handler in Express receives two objects: `req` and `res`.

`req` (request) holds everything the client sent to your server:

| Property      | What It Contains                                  |
| ------------- | ------------------------------------------------- |
| `req.params`  | Route parameters from the URL (e.g., `:id`)       |
| `req.query`   | Query parameters from the URL (e.g., `?name=ali`) |
| `req.body`    | The request body (for POST, PUT, PATCH requests)  |
| `req.headers` | All HTTP headers from the request                 |
| `req.method`  | The HTTP method (GET, POST, etc.)                 |
| `req.url`     | The URL path that was requested                   |

`res` (response) is what you use to send something back:

| Method             | What It Does                                 |
| ------------------ | -------------------------------------------- |
| `res.send()`       | Sends text or data as a response             |
| `res.json()`       | Sends a JSON response                        |
| `res.status()`     | Sets the HTTP status code (chain with .json) |
| `res.sendStatus()` | Sends only a status code with no body        |

---

## 5. Sending Different Types of Responses

### Sending plain text

```javascript
// GET /hello - sends back a plain text string
app.get('/hello', (req, res) => {
  res.send('Hello World');  // content type becomes text/html automatically
});
```

### Sending JSON

```javascript
// GET /info - sends back a JSON object
app.get('/info', (req, res) => {
  // res.json sets Content-Type to application/json automatically
  res.json({
    app: 'My Backend API',
    version: '1.0',
    status: 'running'
  });
});
```

### Sending JSON with a specific status code

```javascript
// GET /users - sends back a list with status 200
app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'Ali' },
    { id: 2, name: 'Sita' }
  ];

  // Chain .status() with .json() to set both status code and body
  res.status(200).json({ users: users });  // 200 = OK, this is the default anyway
});
```

### Sending a 201 Created for new resource

```javascript
// POST /users - receives data and creates a new user
app.post('/users', (req, res) => {
  // req.body contains the JSON data the client sent
  // This only works because of app.use(express.json()) at the top
  const newUser = req.body;

  // status 201 = Created (use this instead of 200 when something new was made)
  res.status(201).json({
    message: 'User created successfully',
    user: newUser   // echo back what was received
  });
});
```

---

## 6. Building the Three Routes from the Lesson Plan

Update `src/server.js` with all three routes:

```javascript
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());   // enable JSON body parsing for all routes

const PORT = process.env.PORT || 8888;

// Route 1: GET / - home route, confirms server is alive
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });  // always return JSON, not plain text
});

// Route 2: GET /about - returns information about this API
app.get('/about', (req, res) => {
  res.json({
    name: 'My First Express API',
    version: '1.0.0',
    author: 'Your Name'   // replace with your name
  });
});

// Route 3: POST /message - accepts a JSON body and echoes it back
app.post('/message', (req, res) => {
  const message = req.body.message;   // read 'message' field from the request body

  // Validate: if message is missing, reject with 400 Bad Request
  if (!message) {
    // 'return' stops the function here so the code below does not run
    return res.status(400).json({ error: 'Message is required' });
  }

  // If message exists, send it back with a timestamp
  res.status(200).json({
    received: message,
    timestamp: new Date().toISOString()   // ISO format: "2026-06-12T10:30:00.000Z"
  });
});

// 404 handler: runs when no route above matched the URL
// MUST be the last app.use() in the file
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.url    // tells the client which path they tried to reach
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

## 7. Testing All Routes in Postman

### Test GET /

```
Method: GET
URL: http://localhost:8888/

Expected response: { "message": "Server is running" }
Expected status: 200
```

### Test GET /about

```
Method: GET
URL: http://localhost:8888/about

Expected response: { "name": "My First Express API", ... }
Expected status: 200
```

### Test POST /message with valid data

```
Method: POST
URL: http://localhost:8888/message

Headers: Content-Type: application/json

Body (raw, JSON):
{
  "message": "Hello from Postman"
}

Expected response: { "received": "Hello from Postman", "timestamp": "..." }
Expected status: 200
```

### Test POST /message with missing data

```
Method: POST
URL: http://localhost:8888/message
Body: {}

Expected response: { "error": "Message is required" }
Expected status: 400
```

### Test a route that does not exist

```
Method: GET
URL: http://localhost:8888/xyz

Expected response: { "error": "Route not found", "path": "/xyz" }
Expected status: 404
```

---

## Summary

Here is what you covered today:

- Express.js is a framework built on top of Node.js that makes creating servers and routes simple.
- `const app = express()` creates the Express application. All routes and config go through `app`.
- `app.use(express.json())` enables reading JSON from request bodies. Always put this near the top.
- `req` contains everything the client sent: params, query, body, headers.
- `res` is how you send a response. Chain `.status()` before `.json()` to set both status and body.
- A 404 handler using `app.use()` at the very end catches unmatched routes.
- Every project entry point is `src/server.js`. Run it with `npm run dev`.

---

## Practice Tasks

1. Create a new Express project using the full setup from Day 2.
2. Build three routes of your choice. Use your own name, hobby, or interests as the data.
3. Add one POST route that accepts any JSON object and sends it back with a `received: true` field added.
4. Add a 404 handler at the bottom.
5. Test every route in Postman. Verify the correct status codes appear for each one.

---

## Homework

- Build a simple Express app with at least three routes in `src/server.js`.
- Add one POST route that accepts JSON and returns the same data plus a `processedAt` timestamp.
- Add proper status codes to every response.
- Test all routes using Postman or Thunder Client.

---

## Campus Store Storyline Project - Level 4

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 4 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 3 is your starting checkpoint. You can review it in [Day 3](<Day3-HTTP Fundamentals and REST API Concepts.md>).

You open the Campus Store API counter and accept the first HTTP requests.

### Today’s Project Level

Run `npm install` if you did not complete Level 2.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Edit | `package.json` | Add Express as today’s only new runtime dependency. |
| Regenerate | `package-lock.json` | Record the installed Express dependency tree. |
| Replace | `src/server.js` | Create the Express application, JSON parser, routes, and listener. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 3 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 4 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Edit `package.json`

Add Express as today’s only new runtime dependency.

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
    "dotenv": "^16.6.1",
    "express": "^5.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
~~~

This is the complete Level 4 version of `package.json`. Add Express as today’s only new runtime dependency. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Regenerate `package-lock.json`

Do not type or edit `package-lock.json` by hand. Record the installed Express dependency tree. Run `npm install` from the `campus-store-api/` root; npm will create or refresh this exact file automatically.

#### Step 3 — Replace `src/server.js`

Create the Express application, JSON parser, routes, and listener.

**File: `src/server.js`**

~~~javascript
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

app.get('/about', (req, res) => {
  res.json({ name: 'Campus Store API', purpose: 'Manage campus products' });
});

app.post('/messages', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'message is required' });
  res.status(201).json({ received: message });
});

const port = Number(process.env.PORT) || 8888;
app.listen(port, () => console.log(`Campus Store API running at http://localhost:${port}`));
~~~

This is the complete Level 4 version of `src/server.js`. Create the Express application, JSON parser, routes, and listener. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Run `npm run dev`, open `http://localhost:8888`, and test `POST /messages` in Postman or Thunder Client.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 4, your reference project has this cumulative structure:

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

- `GET /` confirms the API is running.
- `GET /about` explains the Campus Store.
- `POST /messages` accepts a JSON message.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Run `npm run dev`, open `http://localhost:8888`, and test `POST /messages` in Postman or Thunder Client.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Create a health route and simple JSON routes for any assigned backend.

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

The server responds, but it cannot manage store data. Level 5 adds complete product CRUD. Continue with [Day 5](<Day5-CRUD API Basics with Express.md>).
