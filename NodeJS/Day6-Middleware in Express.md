# Day 6 - Middleware in Express

## What You Will Learn Today

- What middleware is and how it fits into the request-response cycle
- The different types of middleware in Express
- How to write your own custom middleware functions
- How to apply middleware globally and to specific routes only
- How to build a logger middleware from scratch
- How to check custom headers or conditions using middleware
- How middleware execution order matters

---

## 1. What Is Middleware

Middleware is code that runs between receiving a request and sending a response.

Think of it like a security checkpoint at an airport. When you arrive (the request comes in), you do not go straight to the gate (the route handler). You pass through check-in, then security, then passport control. Each step is a middleware. Each one does its job and passes you forward. If something is wrong, they stop you right there.

In Express, a middleware is a function with three parameters: `req`, `res`, and `next`.

```javascript
// This is the basic shape of every middleware function
function myMiddleware(req, res, next) {
  // do something here - log, validate, check headers, etc.
  next(); // call next() to hand control to the next middleware or route
}
```

- `req` is the incoming request object
- `res` is the response object
- `next` is a function you call to continue to the next step

If you do not call `next()` and also do not send a response, the request hangs forever and the client gets no reply.

---

## 2. The Middleware Flow

```
Client sends Request
       |
       v
   Middleware 1  (e.g., logger)
       |
  calls next()
       |
       v
   Middleware 2  (e.g., JSON parser)
       |
  calls next()
       |
       v
   Route Handler  (e.g., GET /users)
       |
       v
Client receives Response
```

Every middleware runs in the order it was registered. The first `app.use()` runs first. If every middleware calls `next()`, the request reaches the route handler which sends the final response.

---

## 3. Setting Up the Project

```bash
mkdir day6-middleware
cd day6-middleware
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg
npm i prisma --save-dev
npm i -D nodemon
mkdir src
mkdir src/middlewares
```

`package.json`:

```json
{
  "name": "day6-middleware",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

`.env`:

```
PORT=8888
```

`.gitignore`:

```
node_modules/
.env
dist/
```

---

## 4. Writing a Logger Middleware

Create `src/middlewares/logger.js`:

```javascript
// This function runs for every incoming request
// It logs the time, method, and URL to the terminal
export function logger(req, res, next) {
  // Get the current date/time in ISO format: "2026-06-12T10:30:00.000Z"
  const time = new Date().toISOString();

  // Print a formatted log line to the terminal
  // Example output: [2026-06-12T10:30:00Z] GET /users
  console.log(`[${time}] ${req.method} ${req.url}`);

  // Call next() to pass control to the next middleware or route handler
  // Without this, the request would stop here and never get a response
  next();
}
```

---

## 5. Middleware Order Matters

The order you register middleware with `app.use()` is the order it runs. This is critical.

Create `src/server.js`:

```javascript
import 'dotenv/config';
import express from 'express';
import { logger } from './middlewares/logger.js';  // import our custom logger

const app = express();
app.use(express.json());   // built-in: parse JSON bodies

const PORT = process.env.PORT || 8888;

// Register logger - runs for EVERY request because it's before all routes
app.use(logger);

app.get('/first', (req, res) => {
  res.json({ message: 'first route' });
});

app.get('/second', (req, res) => {
  res.json({ message: 'second route' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

When you call `GET /first`, your terminal will show:

```
[2026-06-12T10:30:00Z] GET /first
```

Every request is logged because `app.use(logger)` is global.

---

## 6. A Request Timestamp Middleware

You can attach custom data to the `req` object inside middleware. That data is then available to every route handler that runs after it.

Add to `src/middlewares/logger.js`:

```javascript
// This middleware adds a requestTime property to the req object
// Any route handler that runs after this can use req.requestTime
export function addTimestamp(req, res, next) {
  // Attach the timestamp directly to the request object
  req.requestTime = new Date().toISOString();  // custom property added to req
  next();  // continue to next middleware or route
}
```

In `src/server.js`, use it:

```javascript
import { logger, addTimestamp } from './middlewares/logger.js';

app.use(logger);         // runs first for every request
app.use(addTimestamp);   // runs second for every request

app.get('/time', (req, res) => {
  // req.requestTime was added by addTimestamp middleware above
  res.json({
    message: 'Request received',
    time: req.requestTime   // reads the value set by middleware
  });
});
```

---

## 7. A Header Checker Middleware

Sometimes you want to check if a specific header is present before allowing access to a route.

Create `src/middlewares/requireApiKey.js`:

```javascript
// This middleware checks for a custom API key header
// If the header is missing or wrong, it blocks the request
export function requireApiKey(req, res, next) {
  // req.headers holds all HTTP headers from the client
  // Header names are always lowercase
  const apiKey = req.headers['x-api-key'];

  // If the header is completely missing
  if (!apiKey) {
    // 401 Unauthorized - return stops the function here
    return res.status(401).json({ error: 'API key required. Send it as x-api-key header.' });
  }

  // If the header exists but has the wrong value
  if (apiKey !== 'secret-123') {
    // 403 Forbidden - they provided a key but it is not valid
    return res.status(403).json({ error: 'Invalid API key.' });
  }

  // Key is correct - allow the request to continue
  next();
}
```

---

## 8. Route-Level Middleware

You can apply middleware to specific routes instead of all routes. Pass it as an argument between the path and the handler:

```javascript
import { requireApiKey } from './middlewares/requireApiKey.js';

// Anyone can reach this route - no middleware
app.get('/public', (req, res) => {
  res.json({ message: 'This route is open to everyone' });
});

// Only requests with a valid x-api-key header reach the handler
// requireApiKey runs first - if it calls next(), the handler below runs
app.get('/protected', requireApiKey, (req, res) => {
  res.json({ message: 'You passed the API key check!' });
});
```

---

## 9. Error-Handling Middleware

A special type of middleware handles errors. It has four parameters. The first is always `err`.

```javascript
// Normal route that intentionally throws an error for demonstration
app.get('/error-test', (req, res, next) => {
  try {
    // Simulate something going wrong
    throw new Error('Something broke on the server!');
  } catch (err) {
    // Pass the error to Express using next(err)
    // This skips all remaining normal middleware and routes
    next(err);
  }
});

// Error handler middleware - MUST have exactly 4 parameters
// Express recognizes it as an error handler because of the 4th parameter (next)
// Place this AFTER all routes and normal middleware
app.use((err, req, res, next) => {
  console.error('Error caught:', err.message);  // log the error in terminal

  // Send a 500 response with the error details
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});
```

---

## 10. Complete src/server.js

```javascript
import 'dotenv/config';
import express from 'express';
import { logger, addTimestamp } from './middlewares/logger.js';
import { requireApiKey } from './middlewares/requireApiKey.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8888;

// Global middleware - runs for every request, in this order:
app.use(logger);        // 1. log each request
app.use(addTimestamp);  // 2. attach requestTime to req

// Public route - no auth needed
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome',
    requestedAt: req.requestTime  // set by addTimestamp middleware
  });
});

// Protected route - requires valid x-api-key header
app.get('/secure', requireApiKey, (req, res) => {
  res.json({
    secret: 'Protected data here',
    requestedAt: req.requestTime
  });
});

// Test route that throws an error
app.get('/error-test', (req, res, next) => {
  try {
    throw new Error('Test error!');
  } catch (err) {
    next(err);  // forward to error handler
  }
});

// Error handler - must be last, must have 4 parameters
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

Your final file structure:

```
day6-middleware/
  src/
    server.js
    middlewares/
      logger.js
      requireApiKey.js
  .env
  .gitignore
  package.json
```

---

## 11. Testing Middleware with Postman

### Test public route (no key needed)

```
GET http://localhost:8888/
Expected: 200, message + requestedAt timestamp
```

### Test protected route without API key

```
GET http://localhost:8888/secure
Expected: 401, "API key required"
```

### Test protected route with wrong API key

```
GET http://localhost:8888/secure
Headers: x-api-key: wrongkey
Expected: 403, "Invalid API key"
```

### Test protected route with correct API key

```
GET http://localhost:8888/secure
Headers: x-api-key: secret-123
Expected: 200, secret data + timestamp
```

---

## Summary

Here is what you covered today:

- Middleware is a function that runs between receiving a request and sending a response.
- Every middleware receives `req`, `res`, and `next`. Call `next()` to continue, or send a response to stop.
- `app.use(middleware)` applies it globally. Passing it as a route argument applies it to only that route.
- Middleware runs in the exact order you register it. Order matters a lot.
- You can add custom properties to `req` inside middleware and read them in any route handler that comes after.
- Error-handling middleware has four parameters (`err, req, res, next`) and must be registered last.

---

## Practice Tasks

1. Build a new Express project with the full standard setup from Day 2.
2. Create `src/middlewares/logger.js` with a logger that logs method, URL, and timestamp.
3. Create a second middleware that checks if a `token` query parameter exists. If it is missing, return a 400 error.
4. Apply the logger globally and the token-checker to one specific route only.
5. Test the token route with and without the query parameter.

---

## Homework

- Create two custom middlewares in `src/middlewares/`:
  - One for logging the request method and URL with a timestamp.
  - One that checks for a custom query parameter. If missing, return 400 with a helpful message.
- Apply the logger globally and the query-checker only to two specific routes.
- Test all routes and note what gets logged in your terminal for each request.

---

## 1. What Is Middleware

Middleware is code that runs between receiving a request and sending a response.

Think of it as a security checkpoint at an airport. When you arrive at the airport (the request comes in), you do not go straight to the gate (the route handler). You pass through check-in, then security, then passport control. Each of those steps is a middleware. Each one does its job and then lets you continue forward. If something is wrong, they stop you right there.

In Express, a middleware is simply a function with three parameters: `req`, `res`, and `next`.

```javascript
function myMiddleware(req, res, next) {
  // do something here
  next(); // pass control to the next middleware or route
}
```

- `req` is the request object
- `res` is the response object
- `next` is a function you call to move to the next step in the chain

If you do not call `next()`, the request will hang forever. The server will receive the request but never respond.

---

## 2. The Middleware Flow

This is how the request-response cycle works with middleware:

```
Client sends Request
       |
       v
   Middleware 1  (e.g., logger)
       |
       v
   Middleware 2  (e.g., JSON parser)
       |
       v
   Middleware 3  (e.g., auth checker)
       |
       v
   Route Handler  (e.g., GET /users)
       |
       v
Client receives Response
```

Every middleware runs in order. The first one registered runs first. If every middleware calls `next()`, the request eventually reaches the route handler. The route handler sends the response.

---

## 3. Types of Middleware in Express

| Type                      | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| Built-in middleware       | Comes with Express. Example: `express.json()`          |
| Third-party middleware    | Installed via npm. Example: `morgan`, `cors`, `helmet` |
| Custom middleware         | You write it yourself                                  |
| Route-level middleware    | Applied only to specific routes                        |
| Error-handling middleware | Handles errors, has 4 parameters                       |

---

## 4. Built-in Middleware

You have already used one built-in middleware:

```javascript
app.use(express.json());
```

This middleware reads the incoming request body and parses it as JSON, making it available at `req.body`.

Another built-in middleware is `express.urlencoded()`, which parses form data:

```javascript
// Parses URL-encoded form submissions (from HTML forms)
app.use(express.urlencoded({ extended: true }));
```

And `express.static()` serves static files like HTML, CSS, and images:

```javascript
// Serve all files from the "public" folder
app.use(express.static('public'));
```

---

## 5. Writing Your First Custom Middleware

Let us write a logger middleware. A logger records information about every incoming request.

```javascript
// Custom logger middleware
// This runs for every incoming request
function logger(req, res, next) {
  // Get current date and time
  const time = new Date().toISOString();

  // Log the method and URL of the request
  console.log(`[${time}] ${req.method} ${req.url}`);

  // Call next() to pass control to the next middleware or route
  next();
}

// Apply the logger globally using app.use()
// This means it runs for EVERY request
app.use(logger);
```

Line by line:

- `function logger(req, res, next)` defines the middleware function with the three required parameters.
- `const time = new Date().toISOString()` gets the current timestamp in ISO format.
- `console.log(...)` prints a line like `[2026-06-12T10:30:00Z] GET /users` to your terminal for every request.
- `next()` tells Express to move to the next middleware or the route handler. Without this, the request would stop here.
- `app.use(logger)` registers the middleware globally. Every request that hits your server will pass through this logger first.

---

## 6. Middleware Order Matters

Middleware runs in the order it is registered. This is critical to understand.

```javascript
import express from 'express';
const app = express();

// This runs first for every request
app.use((req, res, next) => {
  console.log('Step 1: Request arrived');
  next();
});

// This runs second
app.use((req, res, next) => {
  console.log('Step 2: Processing');
  next();
});

// This runs for GET /hello
app.get('/hello', (req, res) => {
  console.log('Step 3: Route handler running');
  res.json({ message: 'Hello!' });
});
```

When a client sends `GET /hello`, the terminal output will be:

```
Step 1: Request arrived
Step 2: Processing
Step 3: Route handler running
```

If you reverse the order of the first two `app.use()` calls, the output changes accordingly.

---

## 7. A Header Checker Middleware

Sometimes you want to check if a specific header is present before allowing access to a route. This is a common pattern used in API keys or simple access control.

```javascript
// This middleware checks if a custom header is present
function requireApiKey(req, res, next) {
  // Look for the 'x-api-key' header in the request
  const apiKey = req.headers['x-api-key'];

  // If the header is missing, reject the request
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required. Send it in the x-api-key header.' });
  }

  // Optional: check if it matches a specific value
  if (apiKey !== 'my-secret-key-123') {
    return res.status(403).json({ error: 'Invalid API key.' });
  }

  // If the key is correct, allow the request to continue
  next();
}
```

Line by line:

- `req.headers['x-api-key']` reads the value of the `x-api-key` header from the request. Header names are always lowercase.
- `if (!apiKey)` checks if the header was missing entirely.
- `return res.status(401).json({...})` sends a 401 Unauthorized response and stops the middleware chain. The `return` is important here.
- The second `if` checks the actual value. 403 Forbidden means you know who they are but they do not have permission.
- If both checks pass, `next()` lets the request continue to the route.

---

## 8. Route-Level Middleware

You can apply middleware to specific routes instead of all routes. Pass the middleware function as a second argument to the route.

```javascript
// GET /public - No middleware, anyone can access
app.get('/public', (req, res) => {
  res.json({ message: 'This is a public route' });
});

// GET /protected - Only works if the API key is correct
app.get('/protected', requireApiKey, (req, res) => {
  res.json({ message: 'You have access to the protected route' });
});

// GET /admin - Also requires API key
app.get('/admin', requireApiKey, (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});
```

Line by line:

- `app.get('/public', (req, res) => {...})` has only one handler. No middleware.
- `app.get('/protected', requireApiKey, (req, res) => {...})` runs the `requireApiKey` middleware first. If it calls `next()`, the route handler runs. If it sends a response, the route handler never runs.
- You can pass multiple middleware functions this way. Express runs them in the order you list them.

---

## 9. Middleware That Modifies the Request

Middleware can add data to the `req` object and that data will be available in all following middleware and route handlers.

```javascript
// This middleware adds a timestamp to every request object
function addTimestamp(req, res, next) {
  // Add a new property to the req object
  req.requestTime = new Date().toISOString();
  next();
}

app.use(addTimestamp);

app.get('/time', (req, res) => {
  // Access the timestamp added by the middleware
  res.json({
    message: 'Request received',
    time: req.requestTime
  });
});
```

Line by line:

- `req.requestTime = new Date().toISOString()` adds a custom property to the request object.
- Since `app.use(addTimestamp)` is global, every request object will have `requestTime` added to it.
- In the route handler, `req.requestTime` gives you the value that was set by the middleware.

This pattern is very common. Authentication middleware, for example, decodes the user token and attaches the user object to `req.user` so every route handler can access the logged-in user.

---

## 10. Error-Handling Middleware

A special type of middleware handles errors. It has four parameters instead of three. The extra first parameter is `err`.

```javascript
// Normal route that might throw an error
app.get('/risky', (req, res, next) => {
  try {
    // Simulate an error
    throw new Error('Something went wrong!');
  } catch (err) {
    // Pass the error to the error handler using next(err)
    next(err);
  }
});

// Error-handling middleware
// It MUST have exactly 4 parameters: err, req, res, next
// Express recognizes it as an error handler because of the 4th parameter
app.use((err, req, res, next) => {
  // Log the error for debugging
  console.error('Error:', err.message);

  // Send a 500 response with the error message
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});
```

Line by line:

- `next(err)` passes the error object to Express. Express will skip all regular middleware and route handlers and go directly to the error-handling middleware.
- `(err, req, res, next)` - the presence of four parameters tells Express this is an error handler, not a regular middleware.
- `err.message` contains the error description.
- `console.error(...)` prints it in red in the terminal (Node.js uses red for errors automatically).

---

## 11. Putting It All Together

Here is a complete example with multiple middleware types:

```javascript
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 1. Logger middleware (global)
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
});

// 2. Request time middleware (global)
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();  // Add timestamp to request
  next();
});

// 3. API Key middleware (used on specific routes)
function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key) {
    return res.status(401).json({ error: 'API key required' });
  }
  if (key !== 'secret-123') {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  next();
}

// Public route - no key needed
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    requestedAt: req.requestTime  // Comes from middleware 2
  });
});

// Protected route - requires API key header
app.get('/secure-data', requireApiKey, (req, res) => {
  res.json({
    secret: 'This is protected data',
    requestedAt: req.requestTime
  });
});

// Error handler (must be last)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

## 12. Testing Middleware with Postman

### Testing the public route

```
Method: GET
URL: http://localhost:3000/

Expected: Welcome message with requestedAt timestamp, status 200
```

### Testing the protected route without API key

```
Method: GET
URL: http://localhost:3000/secure-data

Expected: 401 error - API key required
```

### Testing the protected route with wrong API key

```
Method: GET
URL: http://localhost:3000/secure-data
Headers: x-api-key: wrong-key

Expected: 403 error - Invalid API key
```

### Testing the protected route with correct API key

```
Method: GET
URL: http://localhost:3000/secure-data
Headers: x-api-key: secret-123

Expected: 200 with the secret data
```

---

## Summary

Here is what you covered today:

- Middleware is a function that runs between receiving a request and sending a response.
- Every middleware function receives `req`, `res`, and `next`. You must call `next()` to continue or send a response to stop.
- `app.use(middleware)` applies middleware globally. Passing it as an argument to a route applies it only to that route.
- Middleware runs in the exact order you register it.
- You can attach custom properties to `req` inside middleware and read them in later handlers.
- Error-handling middleware has four parameters: `err, req, res, next`. It must come last in your file.

---

## Practice Tasks

1. Build a new Express project with at least two custom middlewares.
2. Write a logger middleware that logs: method, URL, and time for every request.
3. Write a middleware that checks if a query parameter called `token` exists. If it does not, return a 400 error.
4. Apply the token-checking middleware only to one specific route.
5. Test the token-checking route both with and without the query parameter.

---

## Homework

- Create two custom middlewares:
  - One for logging the request method and URL with a timestamp.
  - One for checking if a custom query parameter exists. If it is missing, return a 400 error with a helpful message.
- Apply the logging middleware globally and the query-checking middleware only to two specific routes.
- Test all routes and take note of what gets logged in the terminal.
