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

## 2. Project Setup

```bash
mkdir day20-logging
cd day20-logging
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg morgan winston
npm i prisma --save-dev
npm i -D nodemon
mkdir -p src/routes src/controllers src/db src/middlewares src/config src/logs
```

`package.json`:

```json
{
  "name": "day20-logging",
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
POSTGRES_USER=userdipak
POSTGRES_PASSWORD=user_password
POSTGRES_DB=day20_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/day20_db?schema=public"
```

`.gitignore`:

```
node_modules/
.env
dist/
src/logs/*.log
```

The last line ignores generated log files so they never get committed to Git.

`docker-compose.yaml` - same as previous days.

Start the database: `podman compose up -d`

---

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
