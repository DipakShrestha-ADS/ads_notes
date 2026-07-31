# Day 20 - Logging and Debugging

## What You Will Learn Today

- The difference between request logs and error logs
- How to add Morgan for automatic request logging
- How to build custom logging with Winston for more control
- How to log errors with useful context, not just the message
- How to debug common backend errors by reading stack traces
- Practical debugging steps when a route is not working

---

## 1. Request Logs vs Error Logs

A request log records that something happened. An error log records that something went wrong.

Request log example:
```
GET /users 200 15ms
POST /users 201 42ms
GET /users/999 404 8ms
```

This tells you which routes were hit, what status code came back, and how long each one took. It does not tell you why something failed, just that a request happened.

Error log example:
```
[2026-07-01 10:32:15] ERROR: Cannot read properties of undefined (reading 'id')
  at getUserById (src/controllers/userController.js:22:19)
```

This tells you exactly what broke and where. You need both types of logs in a real project. Request logs help you understand traffic and performance. Error logs help you fix bugs quickly.

---

## 2. Continue the Campus Store Project

Start with the completed Level 19 checkpoint from [Day 19](<Day19-Security Essentials for Node.js APIs.md>). If you missed that class, open its project preview and copy that checkpoint before continuing.

Run `npm install` to install Morgan and Winston.

For today’s lesson, work only with these project files:

- **Create `src/config/logger.js`**: Configure console and file transports.
- **Edit `src/middlewares/errorHandler.js`**: Log method, URL, message, and stack before responding.
- **Edit `src/server.js`**: Connect Morgan output to Winston.
- **Edit `.gitignore`**: Ignore generated log files.

The detailed lesson below explains the new concept. The connected Campus Store upgrade at the end shows how these changes fit into the growing project.

## 3. Morgan - Automatic Request Logging

Morgan is the simplest way to log every incoming request automatically.

```bash
npm i morgan
```

```javascript
// src/server.js (partial)
import morgan from 'morgan';

// 'dev' format is short and colored, ideal for local development
// Example output: GET /users 200 12.345 ms
app.use(morgan('dev'));
```

Morgan supports different built-in formats:

| Format     | Example Output                                                   |
| ---------- | ---------------------------------------------------------------- |
| `dev`      | `GET /users 200 12.345 ms - 348` (colored, best for development) |
| `combined` | Apache-style detailed log, best for production log files         |
| `tiny`     | Minimal output: `GET /users 200 348 - 12.345 ms`                 |

---

## 4. Winston - Custom Logging

Morgan is great for request logs, but Winston gives you full control for custom application logs, like recording errors with timestamps and saving them to files.

```bash
npm i winston
```

```javascript
// src/config/logger.js
import winston from 'winston';

// createLogger builds a logger instance with the rules you define
const logger = winston.createLogger({
  level: 'info',   // log everything at 'info' level and more severe (warn, error)

  // format defines how each log entry is structured
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),   // add a timestamp to every log
    winston.format.printf(({ timestamp, level, message }) => {
      // Build the final log line format: [timestamp] LEVEL: message
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),

  // transports define WHERE logs are sent
  transports: [
    // Print logs to the terminal
    new winston.transports.Console(),

    // Save error-level logs specifically to their own file
    new winston.transports.File({
      filename: 'src/logs/error.log',
      level: 'error',
    }),

    // Save all logs (info and above) to a combined file
    new winston.transports.File({
      filename: 'src/logs/combined.log',
    }),
  ],
});

export default logger;
```

Use it anywhere in your app:

```javascript
import logger from '../config/logger.js';

logger.info('Server started successfully');
logger.warn('Database connection is slow');
logger.error('Failed to create user: email already exists');
```

---

## 5. Logging Errors with Context

A bare error message is not enough. Always log which route failed and what data was involved.

```javascript
// src/middlewares/errorHandler.js
import logger from '../config/logger.js';

export function errorHandler(err, req, res, next) {
  // Log detailed context: method, url, and the error message
  // This makes it much easier to trace which request caused the problem
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);

  // In development, also log the full stack trace for debugging
  if (process.env.NODE_ENV !== 'production') {
    logger.error(err.stack);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}
```

---

## 6. Reading a Stack Trace

A stack trace tells you exactly where an error happened and the chain of function calls that led there. Read it from top to bottom.

```
TypeError: Cannot read properties of undefined (reading 'id')
    at getUserById (/project/src/controllers/userController.js:22:19)
    at Layer.handle [as handle_request] (/project/node_modules/express/lib/router/layer.js:95:5)
    at next (/project/node_modules/express/lib/router/route.js:144:13)
```

- Line 1: what went wrong (`TypeError`) and why (reading `.id` on `undefined`)
- Line 2: the exact file and line number where it happened - `userController.js:22:19` means line 22, column 19
- Remaining lines: the chain of calls that led there, usually from Express internals

Always start debugging by looking at the top two lines. That tells you the file, the line, and the type of error immediately.

---

## 7. Common Backend Errors and How to Debug Them

### Cannot read properties of undefined

```javascript
// Usually happens when you access a property on something that does not exist yet
const user = await prisma.user.findUnique({ where: { id } });
console.log(user.name);   // crashes if user is null (not found)

// Fix: check if the value exists first
if (!user) {
  return res.status(404).json({ success: false, message: 'User not found' });
}
console.log(user.name);   // safe now
```

### Headers already sent

```javascript
// Happens when you send two responses in the same request
if (!user) {
  res.status(404).json({ message: 'Not found' });
  // missing return here - the function keeps running
}
res.status(200).json({ data: user });   // this line runs too and crashes

// Fix: always return after sending a response
if (!user) {
  return res.status(404).json({ message: 'Not found' });
}
res.status(200).json({ data: user });
```

### UnhandledPromiseRejection

```javascript
// Happens when an async function throws and there is no try/catch
async function getUser(req, res) {
  const user = await prisma.user.findUnique({ where: { id: 999999999999 } });
  // if this query fails, the error is unhandled
}

// Fix: always wrap async database calls in try/catch
async function getUser(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { id: 999999999999 } });
    res.json({ data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
```

### Port already in use

```
Error: listen EADDRINUSE: address already in use :::8888
```

This means another process is already running on port 8888. Stop the other process, or change your `PORT` value in `.env` temporarily. On macOS you can find and stop the process:

```bash
lsof -i :8888
kill -9 <PID>
```

---

## 8. Full server.js with Logging

```javascript
// src/server.js
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import logger from './config/logger.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Morgan logs every request to the console automatically
app.use(morgan('dev'));

app.use(express.json());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Day 20 - Logging and debugging active' });
});

// Global error handler goes last, after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
```

---

## 9. Testing Logging

Start the server and make a few requests. Watch the terminal for Morgan's colored output showing method, path, status, and response time.

Trigger an intentional error, for example by requesting a user with an id that does not exist:

```
GET http://localhost:8888/users/999999
Expected: 404 response, and an error line appears in the terminal and in src/logs/error.log
```

Check the log files after making a few requests:

```bash
cat src/logs/error.log
cat src/logs/combined.log
```

---

## Summary

- Request logs show what happened, error logs show what went wrong
- Morgan gives you automatic request logging with almost no setup
- Winston gives you full control: custom formats, log levels, and file output
- Always log errors with context: the route, method, and message, not just the raw error
- Stack traces are read top to bottom, starting with the error type and the exact file and line
- Always use try/catch around async database calls to avoid unhandled promise rejections
- Always return immediately after sending a response to avoid the headers already sent error

---

## Practice Tasks

1. Set up Morgan and Winston in your project.
2. Trigger a 404 error and confirm it appears in both the console and `src/logs/error.log`.
3. Intentionally break a route (for example remove an `await`) and read the resulting stack trace to find the exact line.
4. Fix the bug and confirm the log no longer shows the error.
5. Add a `logger.info()` call that logs every time a new user is created.

---

## Homework

Add Morgan and Winston logging to your mini project. Write down two errors you encountered while building the project so far, and describe what the stack trace told you and how you fixed each one.

---

## Campus Store Storyline Project - Level 20

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 20 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 19 is your starting checkpoint. You can review it in [Day 19](<Day19-Security Essentials for Node.js APIs.md>).

You add Morgan request logs and Winston application and error logs.

### Today’s Project Level

Run `npm install` to install Morgan and Winston.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Edit | `package.json` | Add Morgan and Winston for request and application logging. |
| Regenerate | `package-lock.json` | Record the installed logging dependency tree. |
| Create | `src/config/logger.js` | Configure console and file transports. |
| Edit | `src/middlewares/errorHandler.js` | Log method, URL, message, and stack before responding. |
| Edit | `src/server.js` | Connect Morgan output to Winston. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 19 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 20 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Edit `package.json`

Add Morgan and Winston for request and application logging.

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
    "seed": "node prisma/seed.js"
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
    "prisma": "^6.19.0"
  }
}
~~~

This is the complete Level 20 version of `package.json`. Add Morgan and Winston for request and application logging. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Regenerate `package-lock.json`

Do not type or edit `package-lock.json` by hand. Record the installed logging dependency tree. Run `npm install` from the `campus-store-api/` root; npm will create or refresh this exact file automatically.

#### Step 3 — Create `src/config/logger.js`

Configure console and file transports.

**File: `src/config/logger.js`**

~~~javascript
import path from 'node:path';
import winston from 'winston';

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join('logs', 'combined.log') }),
  ],
});

export default logger;
~~~

This is the complete Level 20 version of `src/config/logger.js`. Configure console and file transports. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Edit `src/middlewares/errorHandler.js`

Log method, URL, message, and stack before responding.

**File: `src/middlewares/errorHandler.js`**

~~~javascript
import logger from '../config/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error('Request failed', {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: err.stack,
  });
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : 'An unexpected server error occurred',
  });
}
~~~

This is the complete Level 20 version of `src/middlewares/errorHandler.js`. Log method, URL, message, and stack before responding. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 5 — Edit `src/server.js`

Connect Morgan output to Winston.

**File: `src/server.js`**

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
app.use(errorHandler);
const port = Number(process.env.PORT) || 8888;
app.listen(port, () => {
  console.log(`Campus Store API running at http://localhost:${port}`);
});
~~~

This is the complete Level 20 version of `src/server.js`. Connect Morgan output to Winston. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Call a valid route and an intentionally invalid one, then inspect `logs/combined.log` and `logs/error.log`.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 20, your reference project has this cumulative structure:

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
│   └── server.js
├── uploads/
│   └── .gitkeep
├── .env.example
├── .gitignore
├── docker-compose.yaml
├── package-lock.json
└── package.json
```

Your completed checkpoint now:

- Records structured request and error events.
- Keeps sensitive response details away from clients.
- Provides stack traces during development.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Call a valid route and an intentionally invalid one, then inspect `logs/combined.log` and `logs/error.log`.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Record enough context to reproduce failures instead of guessing what happened.

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

Logs explain failures after they happen. Level 21 adds automated tests that catch failures earlier. Continue with [Day 21](<Day21-Testing APIs with Jest and Supertest.md>).
