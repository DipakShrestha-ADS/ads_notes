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

## 4. Project Setup

```bash
mkdir day21-testing
cd day21-testing
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg zod
npm i prisma --save-dev
npm i -D nodemon jest supertest
mkdir -p src/routes src/controllers src/db src/middlewares src/schemas tests
```

`package.json`:

```json
{
  "name": "day21-testing",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "node --experimental-vm-modules node_modules/.bin/jest --runInBand"
  }
}
```

The `test` script uses `--experimental-vm-modules` because Jest needs this flag to work with ES modules (`"type": "module"`). `--runInBand` runs tests one at a time instead of in parallel, which avoids conflicts when multiple tests touch the same database table.

`.env`:

```
PORT=8888
POSTGRES_USER=userdipak
POSTGRES_PASSWORD=user_password
POSTGRES_DB=day21_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/day21_db?schema=public"
```

`.gitignore`:

```
node_modules/
.env
dist/
```

`docker-compose.yaml` - same as previous days.

Start the database: `podman compose up -d`

---

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
