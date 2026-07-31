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

## Campus Store Storyline Project - Level 6

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 6 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 5 is your starting checkpoint. You can review it in [Day 5](<Day5-CRUD API Basics with Express.md>).

You add middleware that logs every request and protects a temporary manager report.

### Today’s Project Level

No new package is required.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Edit | `.env.example` | Document the temporary store key used by the protected middleware. |
| Create | `src/middlewares/requestLogger.js` | Log the time, method, and URL for every request. |
| Create | `src/middlewares/requireStoreKey.js` | Check the `x-store-key` header on the protected report route. |
| Replace | `src/server.js` | Register middleware in the correct order and add `GET /admin/report`. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 5 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 6 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Edit `.env.example`

Document the temporary store key used by the protected middleware.

**File: `.env.example`**

~~~properties
# Copy this file to .env, then replace every example value.
PORT=8888
STORE_NAME="Campus Store"
STORE_KEY=campus-secret
~~~

This is the complete Level 6 version of `.env.example`. Document the temporary store key used by the protected middleware. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Create `src/middlewares/requestLogger.js`

Log the time, method, and URL for every request.

**File: `src/middlewares/requestLogger.js`**

~~~javascript
export function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
}
~~~

This is the complete Level 6 version of `src/middlewares/requestLogger.js`. Log the time, method, and URL for every request. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 3 — Create `src/middlewares/requireStoreKey.js`

Check the `x-store-key` header on the protected report route.

**File: `src/middlewares/requireStoreKey.js`**

~~~javascript
export function requireStoreKey(req, res, next) {
  const providedKey = req.get('x-store-key');
  const expectedKey = process.env.STORE_KEY || 'campus-secret';

  if (providedKey !== expectedKey) {
    return res.status(401).json({ message: 'A valid store key is required' });
  }

  next();
}
~~~

This is the complete Level 6 version of `src/middlewares/requireStoreKey.js`. Check the `x-store-key` header on the protected report route. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Replace `src/server.js`

Register middleware in the correct order and add `GET /admin/report`.

**File: `src/server.js`**

~~~javascript
import 'dotenv/config';
import express from 'express';
import { requestLogger } from './middlewares/requestLogger.js';
import { requireStoreKey } from './middlewares/requireStoreKey.js';

const app = express();
app.use(express.json());
app.use(requestLogger);

const products = [
  { id: 1, title: 'Notebook', price: 4.5 },
  { id: 2, title: 'Campus Hoodie', price: 28 },
];
let nextId = 3;

app.get('/admin/report', requireStoreKey, (req, res) => {
  res.json({ productCount: products.length, status: 'private manager report' });
});

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

This is the complete Level 6 version of `src/server.js`. Register middleware in the correct order and add `GET /admin/report`. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Call `GET /admin/report` without a header, then repeat with `x-store-key: campus-secret`.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 6, your reference project has this cumulative structure:

```text
campus-store-api/
├── docs/
│   └── api-plan.md
├── src/
│   ├── middlewares/
│   │   ├── requestLogger.js
│   │   └── requireStoreKey.js
│   └── server.js
├── .env.example
├── .gitignore
├── package-lock.json
└── package.json
```

Your completed checkpoint now:

- Logs all requests.
- Rejects a missing or incorrect store key with `401`.
- Allows the correct key to reach the report route.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Call `GET /admin/report` without a header, then repeat with `x-store-key: campus-secret`.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Use middleware for work that must happen before many routes, such as logging, authentication, validation, or permissions.

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

Features work, but `src/server.js` is becoming crowded. Level 7 separates responsibilities into folders. Continue with [Day 7](<Day7-Project Structure for Real Backend Applications.md>).
