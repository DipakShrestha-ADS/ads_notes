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

## 1. What Is Express.js

Before Express.js, if you wanted to build a web server in Node.js, you had to write a lot of boilerplate code yourself. You had to manually parse the URL, figure out which route was called, read the request body by collecting data chunks, set response headers, and so on.

Express.js removes all that complexity. It is a minimal and flexible framework built on top of Node.js that gives you the tools to create routes and handle requests with just a few lines of code.

Think of Node.js as the raw engine of a car. It is powerful but you need a lot of other parts to make it drivable. Express.js is like the steering wheel, pedals, and dashboard. It makes the engine usable and comfortable.

Express is the most popular Node.js framework in the world. Most Node.js backend tutorials and courses use Express because it is simple, well-documented, and trusted by millions of developers.

---

## 2. Setting Up an Express Project

### Step 1 - Create the project folder

```bash
mkdir day4-express-server
cd day4-express-server
```

### Step 2 - Initialize Node.js project

```bash
npm init -y
```

### Step 3 - Enable ES Modules and add start script

Open `package.json` and update it:

```json
{
  "name": "day4-express-server",
  "version": "1.0.0",
  "type": "module",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "node --watch app.js"
  }
}
```

The `"dev"` script uses `--watch` which is built into Node.js from version 18. It automatically restarts the server whenever you save a file. This is like nodemon but without installing an extra package.

### Step 4 - Install Express

```bash
npm install express
```

### Step 5 - Create your .env file

```
PORT=3000
```

### Step 6 - Install dotenv

```bash
npm install dotenv
```

---

## 3. Creating Your First Express Server

Create a file called `app.js` in your project folder:

```javascript
// Load environment variables from .env file
import 'dotenv/config';

// Import the Express library
import express from 'express';

// Create an Express application
const app = express();

// Tell Express to parse incoming JSON bodies
app.use(express.json());

// Get the port from environment variables
const PORT = process.env.PORT || 3000;

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to my Express server!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

Line by line:

- `import 'dotenv/config'` loads the `.env` file immediately. This must be the first import.
- `import express from 'express'` brings in the Express library.
- `const app = express()` creates the Express application. Think of `app` as your server object. Every route and configuration goes through this.
- `app.use(express.json())` tells Express to automatically parse the body of incoming requests as JSON. Without this, `req.body` would be `undefined` when someone sends JSON data.
- `const PORT = process.env.PORT || 3000` reads the port from `.env`. If not set, it defaults to 3000.
- `app.get('/', (req, res) => {...})` creates a route. When someone makes a GET request to `/`, this callback function runs.
- `res.send('...')` sends a plain text response back to the client.
- `app.listen(PORT, callback)` starts the server. The callback runs once the server is listening and ready.

Run the server:

```bash
npm run dev
```

Open your browser and go to `http://localhost:3000`. You will see the welcome message.

---

## 4. Understanding req and res

Every route in Express receives two objects: `req` and `res`.

### The req object (Request)

`req` represents the incoming HTTP request. It contains all the information the client sent.

| Property      | What It Contains                                  |
| ------------- | ------------------------------------------------- |
| `req.params`  | Route parameters from the URL (e.g., `:id`)       |
| `req.query`   | Query parameters from the URL (e.g., `?name=ali`) |
| `req.body`    | The request body (for POST, PUT, PATCH requests)  |
| `req.headers` | All HTTP headers from the request                 |
| `req.method`  | The HTTP method (GET, POST, etc.)                 |
| `req.url`     | The URL path that was requested                   |

### The res object (Response)

`res` represents what you send back to the client.

| Method             | What It Does                             |
| ------------------ | ---------------------------------------- |
| `res.send()`       | Sends a response (text, HTML, or object) |
| `res.json()`       | Sends a JSON response                    |
| `res.status()`     | Sets the HTTP status code                |
| `res.sendStatus()` | Sends only a status code with no body    |

---

## 5. Sending Different Types of Responses

Here are the most common ways to respond to a request:

### Sending plain text

```javascript
app.get('/hello', (req, res) => {
  // Sends a plain text response
  res.send('Hello World');
});
```

### Sending JSON

```javascript
app.get('/info', (req, res) => {
  // Sends a JSON object as the response
  res.json({
    app: 'My Backend API',
    version: '1.0',
    status: 'running'
  });
});
```

### Sending JSON with a status code

```javascript
app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'Ali' },
    { id: 2, name: 'Sita' }
  ];

  // Sends status 200 with JSON data
  // .status() sets the code, .json() sends the body
  res.status(200).json({ users: users });
});
```

Line by line:

- `res.status(200)` sets the status code to 200. You can chain this with other methods.
- `.json({ users: users })` sends the users array wrapped in an object. The key is `users` and the value is the array.

### Sending a 201 Created response

```javascript
app.post('/users', (req, res) => {
  // req.body contains the data the client sent
  const newUser = req.body;

  // In a real app, you would save to database here
  // For now, just send back what was received
  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
});
```

Line by line:

- `req.body` holds the JSON data the client sent in the request body. This only works because we added `app.use(express.json())` earlier.
- `res.status(201)` sets the status to 201, meaning "Created."
- `.json({...})` sends back a confirmation message and the created user.

---

## 6. Building Three Core Routes

Let us build three routes for a complete mini server:

```javascript
import 'dotenv/config';
import express from 'express';

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Route 1: GET / - Home page
app.get('/', (req, res) => {
  // Simply let the client know the server is running
  res.json({ message: 'Server is running' });
});

// Route 2: GET /about - About info
app.get('/about', (req, res) => {
  // Send back information about this API
  res.json({
    name: 'My First Express API',
    version: '1.0.0',
    author: 'Your Name'
  });
});

// Route 3: POST /message - Accept and echo a message
app.post('/message', (req, res) => {
  // Read the message from the request body
  const message = req.body.message;

  // Check if message was provided
  if (!message) {
    // If not, send a 400 Bad Request error
    return res.status(400).json({ error: 'Message is required' });
  }

  // If message exists, echo it back with a 200 response
  res.status(200).json({
    received: message,
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

Line by line for the POST route:

- `const message = req.body.message` reads the `message` field from the JSON body sent by the client.
- `if (!message)` checks whether the message field is missing or empty. `!message` is true when the value is `undefined`, `null`, or an empty string.
- `return res.status(400).json({...})` sends a 400 error response and stops the function from continuing. The `return` is important here because without it, Express would try to send a second response and crash.
- `new Date().toISOString()` gives the current date and time as a standard ISO string like `"2026-06-12T10:30:00.000Z"`.

---

## 7. Testing All Routes with Postman

### Testing GET /

```
Method: GET
URL: http://localhost:3000/

Expected Response:
{ "message": "Server is running" }
Status: 200
```

### Testing GET /about

```
Method: GET
URL: http://localhost:3000/about

Expected Response:
{ "name": "My First Express API", "version": "1.0.0", "author": "Your Name" }
Status: 200
```

### Testing POST /message with valid data

```
Method: POST
URL: http://localhost:3000/message

Headers:
  Content-Type: application/json

Body (raw, JSON):
{
  "message": "Hello from the client"
}

Expected Response:
{
  "received": "Hello from the client",
  "timestamp": "2026-06-12T10:30:00.000Z"
}
Status: 200
```

### Testing POST /message with missing data

```
Method: POST
URL: http://localhost:3000/message

Body: {}

Expected Response:
{ "error": "Message is required" }
Status: 400
```

---

## 8. Handling Unknown Routes (404)

Right now, if someone visits a URL you have not defined, Express sends a default error. Let us add a proper 404 handler.

Add this at the end of your file, after all other routes:

```javascript
// This runs when no other route matched the request
// It must come after all other route definitions
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.url
  });
});
```

Line by line:

- `app.use(callback)` adds middleware that runs for every request. When placed at the end, it only runs if no route above matched the request.
- `res.status(404)` sets the 404 Not Found status code.
- `req.url` contains the path that was requested, so you can tell the client exactly which route they tried to reach.

---

## 9. The Complete app.js for Day 4

```javascript
import 'dotenv/config';
import express from 'express';

const app = express();

// Allow Express to read JSON in the request body
app.use(express.json());

const PORT = process.env.PORT || 3000;

// GET / - Home
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Day 4 Express Server' });
});

// GET /about - Info
app.get('/about', (req, res) => {
  res.json({
    name: 'Day 4 API',
    version: '1.0.0',
    author: 'Student Name'
  });
});

// POST /message - Accept a message from the client
app.post('/message', (req, res) => {
  const { message } = req.body;  // Destructure message from the body

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  res.status(200).json({
    received: message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler - runs if no route matched
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.url
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

The `const { message } = req.body` line uses JavaScript destructuring. It is the same as writing `const message = req.body.message`, just shorter.

---

## Summary

Here is what you covered today:

- Express.js is a framework built on top of Node.js that makes creating servers and routes simple.
- `const app = express()` creates the Express application.
- `app.use(express.json())` enables parsing JSON from request bodies.
- `req` contains everything the client sent: params, query, body, headers.
- `res` is what you use to send back a response: `res.json()`, `res.send()`, `res.status()`.
- Always chain `res.status()` with `res.json()` to set both the status code and the response body.
- A 404 handler using `app.use()` at the end catches all unmatched routes.

---

## Practice Tasks

1. Create a new Express project from scratch.
2. Build three routes of your choice. Be creative - use your name, favorite book, or hobby as the data.
3. Add a POST route that accepts any JSON object and sends it back with a `received: true` field added.
4. Add a 404 handler at the end.
5. Test every route in Postman and verify the correct status codes are returned.

---

## Homework

- Build a simple Express app with at least three routes.
- Add one POST route that accepts JSON and returns the same data plus a `processedAt` timestamp.
- Add proper status codes to every response.
- Test all routes using Postman or Thunder Client.
