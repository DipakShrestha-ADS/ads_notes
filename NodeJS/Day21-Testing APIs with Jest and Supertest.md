# Day 21 - Testing APIs with Jest and Supertest

## What You Will Learn Today

- Why automated testing matters for backend projects
- The difference between unit tests and integration tests
- How to install and configure Jest for a Node.js project
- How to use Supertest to send requests to your Express app in tests
- How to write tests for a health check route and for user routes
- How to run tests and read the results

---

## 1. Why Testing Matters

Right now, you test your API by opening Postman, sending a request, and looking at the response with your own eyes. That works, but it does not scale. Every time you change one line of code, you would need to manually retest every single route to make sure nothing broke.

Automated tests are code that tests your code. You write the test once. From then on, you run it in seconds and it tells you immediately if something is broken, without you needing to open Postman and click through routes by hand.

Think of it like a checklist a pilot runs before every flight. The pilot does not personally re-inspect every wire and bolt each time. They run through a fixed checklist that catches known problems quickly and reliably.

---

## 2. Unit Tests vs Integration Tests

Unit test: tests one small piece of code in isolation, like a single function.

```javascript
// Testing a plain function with no database or network involved
function add(a, b) {
  return a + b;
}
// Unit test: does add(2, 3) return 5?
```

Integration test: tests multiple pieces working together, like a full API route including the database.

```javascript
// Testing a full request: Express route -> controller -> Prisma -> database -> response
// Does POST /users actually create a user and return 201?
```

This course focuses on integration tests for your API routes, since that is what matters most for verifying your backend actually works end to end.

---

## 3. Installing Jest and Supertest

```bash
npm i -D jest supertest
```

| Package   | Purpose                                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| jest      | The test runner - runs your test files and reports pass/fail results                                              |
| supertest | Sends real HTTP requests to your Express app inside a test, without needing the server actually running on a port |

---

## 4. Continue the Campus Store Project

Start with the completed Level 20 checkpoint from [Day 20](<Day20-Logging and Debugging.md>). If you missed that class, open its project preview and copy that checkpoint before continuing.

Run `npm install`, then run `npm test`.

For today’s lesson, work only with these project files:

- **Create `src/app.js`**: Configure and export Express without calling `listen`.
- **Replace `src/server.js`**: Import the configured app and start the network listener.
- **Create `tests/health.test.js`**: Test the health route, unknown routes, and security headers.
- **Edit `package.json`**: Add the Jest test command.

The detailed lesson below explains the new concept. The connected Campus Store upgrade at the end shows how these changes fit into the growing project.

## 5. Splitting server.js and app.js

To test your Express app with Supertest, the app needs to be exported without immediately calling `.listen()`. Split your code into two files.

```javascript
// src/app.js
import express from 'express';
import userRoutes from './routes/userRoutes.js';

// Build and configure the Express app here, but do not start listening
const app = express();

app.use(express.json());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Export the app so tests can import it directly
export default app;
```

```javascript
// src/server.js
import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 8888;

// server.js is only responsible for starting the server
// This file is never imported by tests
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

This separation is the standard pattern for testable Express apps. `app.js` defines behavior, `server.js` starts the actual server.

---

## 6. Writing a Health Check Test

Start with the simplest possible test to confirm Jest and Supertest are wired up correctly.

```javascript
// tests/health.test.js
import request from 'supertest';
import app from '../src/app.js';

// describe groups related tests together under one label
describe('Health check route', () => {
  // test (or it) defines one individual test case
  test('GET / should return 200 and a message', async () => {
    // request(app) sends a request directly to your Express app, no real server needed
    const response = await request(app).get('/');

    // expect() checks that a value matches what you expect
    expect(response.status).toBe(200);              // status code must be 200
    expect(response.body.message).toBeDefined();     // response body must have a message field
  });
});
```

---

## 7. Writing Tests for User Routes

```javascript
// tests/user.test.js
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/db/prisma.js';

// beforeAll runs once before any test in this file starts
beforeAll(async () => {
  // Clear the users table so tests always start from a known, empty state
  await prisma.user.deleteMany();
});

// afterAll runs once after every test in this file has finished
afterAll(async () => {
  // Disconnect Prisma so Jest can exit cleanly instead of hanging
  await prisma.$disconnect();
});

describe('User routes', () => {
  test('POST /users should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Alice', email: 'alice@example.com' });   // request body

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe('Alice');
    expect(response.body.data.email).toBe('alice@example.com');
  });

  test('POST /users should reject a request missing the email field', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Bob' });    // missing email on purpose

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('GET /users should return an array containing the created user', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test('GET /users/:id should return 404 for a user that does not exist', async () => {
    const response = await request(app).get('/users/999999');

    expect(response.status).toBe(404);
  });

  test('PUT /users/:id should update an existing user', async () => {
    // First create a user to update
    const createResponse = await request(app)
      .post('/users')
      .send({ name: 'Carol', email: 'carol@example.com' });

    const userId = createResponse.body.data.id;

    // Now update that same user
    const updateResponse = await request(app)
      .put(`/users/${userId}`)
      .send({ name: 'Carol Updated', email: 'carol@example.com' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.name).toBe('Carol Updated');
  });

  test('DELETE /users/:id should delete an existing user', async () => {
    const createResponse = await request(app)
      .post('/users')
      .send({ name: 'David', email: 'david@example.com' });

    const userId = createResponse.body.data.id;

    const deleteResponse = await request(app).delete(`/users/${userId}`);

    expect(deleteResponse.status).toBe(200);

    // Confirm the user is really gone by trying to fetch it again
    const getResponse = await request(app).get(`/users/${userId}`);
    expect(getResponse.status).toBe(404);
  });
});
```

---

## 8. Running the Tests

```bash
npm test
```

Jest output looks like this when everything passes:

```
PASS  tests/health.test.js
PASS  tests/user.test.js
  User routes
    ✓ POST /users should create a new user (45ms)
    ✓ POST /users should reject a request missing the email field (12ms)
    ✓ GET /users should return an array containing the created user (18ms)
    ✓ GET /users/:id should return 404 for a user that does not exist (10ms)
    ✓ PUT /users/:id should update an existing user (30ms)
    ✓ DELETE /users/:id should delete an existing user (28ms)

Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
```

If a test fails, Jest shows exactly which `expect()` line failed and what value it received instead:

```
FAIL  tests/user.test.js
  ✕ POST /users should create a new user (20ms)

    expect(received).toBe(expected)

    Expected: 201
    Received: 500
```

This tells you the test expected status 201 but actually got 500, meaning something crashed on the server side. Check your terminal logs for the actual error.

---

## 9. Common Jest Matchers

| Matcher              | Checks                                       |
| -------------------- | -------------------------------------------- |
| `toBe(value)`        | Exact equality, good for numbers and strings |
| `toEqual(value)`     | Deep equality, good for objects and arrays   |
| `toBeDefined()`      | Value is not `undefined`                     |
| `toBeNull()`         | Value is exactly `null`                      |
| `toBeGreaterThan(n)` | Number is greater than `n`                   |
| `toContain(item)`    | Array or string contains `item`              |
| `toHaveLength(n)`    | Array or string has exact length `n`         |

---

## Summary

- Automated tests catch bugs quickly without manually retesting every route by hand
- Unit tests check one function in isolation, integration tests check full routes end to end
- Split your app into `app.js` (exports the configured app) and `server.js` (starts listening)
- `supertest` lets you send requests directly to your app object inside a test, no live server needed
- `beforeAll` and `afterAll` set up and clean up test data around your test suite
- Run tests with `npm test` and read failed `expect()` output carefully to find the bug

---

## Practice Tasks

1. Set up Jest and Supertest, and split your project into `app.js` and `server.js`.
2. Write and run the health check test.
3. Write all six user route tests shown above and confirm they pass.
4. Intentionally break something (like removing a validation check) and watch a test fail.
5. Fix the bug and confirm all tests pass again.

---

## Homework

Write at least three tests for your mini project. Cover one success case, one validation failure case, and one not-found case. Run `npm test` and paste the output showing all tests passing.

---

## Campus Store Storyline Project - Level 21

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 21 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 20 is your starting checkpoint. You can review it in [Day 20](<Day20-Logging and Debugging.md>).

You separate Express configuration from network startup and test the app with Jest and Supertest.

### Today’s Project Level

Run `npm install`, then run `npm test`.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Edit | `package.json` | Add Jest, Supertest, and the test command. |
| Regenerate | `package-lock.json` | Record the installed test dependency tree. |
| Edit | `.gitignore` | Ignore generated test coverage. |
| Create | `src/app.js` | Configure and export Express without calling `listen`. |
| Replace | `src/server.js` | Import the configured app and start the network listener. |
| Create | `tests/health.test.js` | Test the health route, unknown routes, and security headers. |
| Edit | `package.json` | Add the Jest test command. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 20 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 21 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Edit `package.json`

Add Jest, Supertest, and the test command.

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
    "dev": "nodemon src/server.js",
    "db:generate": "prisma generate --config prisma/prisma.config.js",
    "db:migrate": "prisma migrate dev --config prisma/prisma.config.js",
    "db:studio": "prisma studio --config prisma/prisma.config.js",
    "seed": "node prisma/seed.js",
    "test": "npm run db:generate && NODE_OPTIONS=--experimental-vm-modules jest --runInBand"
  },
  "dependencies": {
    "dotenv": "^16.6.1",
    "express": "^5.1.0",
    "pg": "^8.16.3",
    "@prisma/adapter-pg": "^6.19.0",
    "@prisma/client": "^6.19.0",
    "zod": "^4.1.12",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^2.0.2",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1",
    "cors": "^2.8.5",
    "helmet": "^8.1.0",
    "express-rate-limit": "^8.1.0",
    "morgan": "^1.10.1",
    "winston": "^3.18.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "prisma": "^6.19.0",
    "jest": "^30.2.0",
    "supertest": "^7.1.4"
  }
}
~~~

This is the complete Level 21 version of `package.json`. Add Jest, Supertest, and the test command. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Regenerate `package-lock.json`

Do not type or edit `package-lock.json` by hand. Record the installed test dependency tree. Run `npm install` from the `campus-store-api/` root; npm will create or refresh this exact file automatically.

#### Step 3 — Edit `.gitignore`

Ignore generated test coverage.

**File: `.gitignore`**

~~~text
node_modules/
.env
logs/*.log
!logs/.gitkeep
src/generated/
uploads/*
!uploads/.gitkeep
coverage/
~~~

This is the complete Level 21 version of `.gitignore`. Ignore generated test coverage. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Create `src/app.js`

Configure and export Express without calling `listen`.

**File: `src/app.js`**

~~~javascript
import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import logger from './config/logger.js';
import { swaggerDocument } from './config/swagger.js';
import { authLimiter, corsMiddleware, generalLimiter } from './config/security.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());
const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use(helmet());
app.use(corsMiddleware);
app.use(generalLimiter);
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use('/uploads', express.static(path.resolve(currentDir, '../uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

app.use('/auth', authLimiter, authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);
export default app;
~~~

This is the complete Level 21 version of `src/app.js`. Configure and export Express without calling `listen`. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 5 — Replace `src/server.js`

Import the configured app and start the network listener.

**File: `src/server.js`**

~~~javascript
import 'dotenv/config';
import app from './app.js';

const port = Number(process.env.PORT) || 8888;
app.listen(port, () => {
  console.log(`Campus Store API running at http://localhost:${port}`);
});
~~~

This is the complete Level 21 version of `src/server.js`. Import the configured app and start the network listener. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 6 — Create `tests/health.test.js`

Test the health route, unknown routes, and security headers.

**File: `tests/health.test.js`**

~~~javascript
import request from 'supertest';
import app from '../src/app.js';

describe('Campus Store public API', () => {
  test('GET / returns the health message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/Campus Store API/);
  });

  test('an unknown route returns 404 JSON', async () => {
    const response = await request(app).get('/does-not-exist');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });

  test('Helmet adds a content security policy header', async () => {
    const response = await request(app).get('/');
    expect(response.headers['content-security-policy']).toBeDefined();
  });
});
~~~

This is the complete Level 21 version of `tests/health.test.js`. Test the health route, unknown routes, and security headers. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 7 — Edit `package.json`

Add the Jest test command.

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
    "dev": "nodemon src/server.js",
    "db:generate": "prisma generate --config prisma/prisma.config.js",
    "db:migrate": "prisma migrate dev --config prisma/prisma.config.js",
    "db:studio": "prisma studio --config prisma/prisma.config.js",
    "seed": "node prisma/seed.js",
    "test": "npm run db:generate && NODE_OPTIONS=--experimental-vm-modules jest --runInBand"
  },
  "dependencies": {
    "dotenv": "^16.6.1",
    "express": "^5.1.0",
    "pg": "^8.16.3",
    "@prisma/adapter-pg": "^6.19.0",
    "@prisma/client": "^6.19.0",
    "zod": "^4.1.12",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^2.0.2",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1",
    "cors": "^2.8.5",
    "helmet": "^8.1.0",
    "express-rate-limit": "^8.1.0",
    "morgan": "^1.10.1",
    "winston": "^3.18.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "prisma": "^6.19.0",
    "jest": "^30.2.0",
    "supertest": "^7.1.4"
  }
}
~~~

This is the complete Level 21 version of `package.json`. Add the Jest test command. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Run `npm test`. Every health, 404, and security test should pass.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 21, your reference project has this cumulative structure:

```text
campus-store-api/
├── docs/
│   ├── api-plan.md
│   └── data-model.md
├── logs/
│   └── .gitkeep
├── prisma/
│   ├── migrations/
│   │   ├── 20260731000100_create_products/
│   │   │   └── migration.sql
│   │   ├── 20260731000200_add_users/
│   │   │   └── migration.sql
│   │   ├── 20260731000300_add_authentication/
│   │   │   └── migration.sql
│   │   ├── 20260731000400_add_roles/
│   │   │   └── migration.sql
│   │   ├── 20260731000500_add_category/
│   │   │   └── migration.sql
│   │   └── 20260731000600_add_product_image/
│   │       └── migration.sql
│   ├── prisma.config.js
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   │   ├── logger.js
│   │   ├── security.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── data/
│   │   └── products.js
│   ├── db/
│   │   └── prisma.js
│   ├── middlewares/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   ├── fileLogger.js
│   │   ├── requestLogger.js
│   │   ├── requireStoreKey.js
│   │   └── uploadProductImage.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── schemas/
│   │   ├── authSchemas.js
│   │   ├── productSchemas.js
│   │   └── userSchemas.js
│   ├── app.js
│   └── server.js
├── tests/
│   └── health.test.js
├── uploads/
│   └── .gitkeep
├── .env.example
├── .gitignore
├── docker-compose.yaml
├── package-lock.json
└── package.json
```

Your completed checkpoint now:

- Keeps `src/server.js` as the entry point.
- Runs API integration tests without opening port `8888`.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Run `npm test`. Every health, 404, and security test should pass.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Test behavior through HTTP without manually opening Postman for every change.

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

Tests prove behavior on your machine, but setup can still differ elsewhere. Level 22 containerizes the full stack. Continue with [Day 22](<Day22-Docker Basics for Node.js Projects.md>).
