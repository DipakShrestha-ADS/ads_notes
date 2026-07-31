# Day 8 - Node.js Core Modules for Backend

## What You Will Learn Today

- What Node.js core modules are and how to use them without installing anything
- How to read and write files using the `fs` module
- How to work with file paths safely using the `path` module
- How to get system information using the `os` module
- How to use the `process` object for runtime information
- Where these modules are useful in real backend projects

---

## 1. What Are Core Modules

When you install Node.js, it comes with a set of built-in modules called core modules. You do not need to install them with npm. They are available immediately.

You import them by name:

```javascript
import fs from 'fs';       // file system - read and write files
import path from 'path';   // path - safely build file paths
import os from 'os';       // os - get operating system information
```

These modules give you tools to work with the file system, the operating system, and the Node.js runtime itself.

---

## 2. Project Setup

```bash
mkdir day8-core-modules
cd day8-core-modules
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg
npm i prisma --save-dev
npm i -D nodemon
mkdir src
```

`package.json`:

```json
{
  "name": "day8-core-modules",
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

## 3. The fs Module - Working With Files

`fs` stands for file system. This module lets you create, read, update, and delete files.

Use `fs/promises` (the Promise-based version) with `async/await` for clean modern code.

### Writing a file

```javascript
// Import the Promise-based version of fs
import { writeFile, readFile, appendFile } from 'fs/promises';

async function fileDemo() {
  // Write a file (creates it if it does not exist, overwrites if it does)
  await writeFile('notes.txt', 'Hello from Node.js!\n', 'utf8');
  // 'utf8' tells Node.js to write the content as text, not raw bytes
  console.log('File written successfully');

  // Read the file back and store content in a variable
  const content = await readFile('notes.txt', 'utf8');
  console.log('File content:', content);  // prints: Hello from Node.js!

  // Append a new line without deleting the existing content
  await appendFile('notes.txt', 'This line was added later.\n', 'utf8');
  console.log('Line appended');

  // Read the file again to see both lines
  const updated = await readFile('notes.txt', 'utf8');
  console.log('Updated content:\n', updated);
}

fileDemo();  // run the async function
```

Wrap in try/catch for production code:

```javascript
import { writeFile, readFile } from 'fs/promises';

async function safeFileRead() {
  try {
    // Try to read a file
    const data = await readFile('notes.txt', 'utf8');
    console.log('Content:', data);
  } catch (err) {
    // If file does not exist or cannot be read, this block runs
    console.error('Could not read file:', err.message);
  }
}

safeFileRead();
```

---

## 4. The path Module - Safely Building File Paths

The `path` module builds file paths in a way that works on every operating system.

On macOS and Linux, paths use `/` separators: `/Users/ali/notes.txt`
On Windows, paths use `\` separators: `C:\Users\ali\notes.txt`

If you write slashes manually, your code might break on a different OS. The `path` module handles this automatically.

### path.join

```javascript
import path from 'path';

// Combine path segments safely - slash style is handled per OS
const logPath = path.join('src', 'logs', 'app.log');
console.log(logPath);
// macOS/Linux output: src/logs/app.log
// Windows output: src\logs\app.log
```

### Getting __dirname in ES Modules

In older CommonJS files, `__dirname` gave you the current folder. In ES Modules (with `"type": "module"`), you need to recreate it:

```javascript
import { fileURLToPath } from 'url';
import path from 'path';

// import.meta.url is the URL of the current file: "file:///Users/ali/src/server.js"
// fileURLToPath converts it to a plain path: "/Users/ali/src/server.js"
const __filename = fileURLToPath(import.meta.url);

// path.dirname removes the filename and gives just the folder path
const __dirname = path.dirname(__filename);

console.log('This file is at:', __filename);
console.log('This folder is:', __dirname);

// Now use __dirname to build absolute paths
const logsFolder = path.join(__dirname, '..', 'logs');  // goes up one level, then into logs
console.log('Logs folder path:', logsFolder);
```

### Other useful path methods

```javascript
import path from 'path';

const filePath = '/Users/ali/project/src/server.js';

console.log(path.dirname(filePath));         // /Users/ali/project/src
console.log(path.basename(filePath));        // server.js
console.log(path.basename(filePath, '.js')); // server  (without extension)
console.log(path.extname(filePath));         // .js
```

---

## 5. The os Module - System Information

The `os` module gives you information about the operating system.

```javascript
import os from 'os';

// Platform: 'darwin' (macOS), 'win32' (Windows), 'linux' (Linux)
console.log('Platform:', os.platform());

// Total RAM in GB
const totalGb = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
console.log('Total RAM:', totalGb, 'GB');
// Divide by 1024 three times to convert bytes -> KB -> MB -> GB
// toFixed(2) rounds to 2 decimal places

// Free RAM currently available
const freeGb = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
console.log('Free RAM:', freeGb, 'GB');

// Number of CPU cores
console.log('CPU Cores:', os.cpus().length);
// os.cpus() returns an array with one item per core

// Current user's home directory
console.log('Home Dir:', os.homedir());  // e.g. /Users/ali
```

---

## 6. The process Object - Runtime Information

`process` is a global object in Node.js. You never need to import it - it is always available.

```javascript
// Node.js version string like "v22.12.0"
console.log('Node.js version:', process.version);

// Folder the node command was run from
console.log('Working directory:', process.cwd());

// Read environment variables (loaded from .env via dotenv)
console.log('PORT from .env:', process.env.PORT);

// How many seconds the process has been running
console.log('Uptime:', process.uptime().toFixed(2), 'seconds');

// Memory used by this Node.js process
const heapMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
console.log('Memory used:', heapMB, 'MB');
// heapUsed is in bytes, divide twice to get MB
```

### Handling graceful shutdown

```javascript
// Runs right before Node.js exits
process.on('exit', (code) => {
  console.log(`Process exiting with code: ${code}`);  // 0 = clean exit
});

// Runs when you press Ctrl+C in the terminal
process.on('SIGINT', () => {
  console.log('Stopped by user (Ctrl+C). Shutting down cleanly.');
  process.exit(0);  // 0 = success exit code
});
```

---

## 7. Practical Example: Request Logger That Writes to a File

Here is a real example combining `fs`, `path`, and `process` in a backend middleware.

Create `src/middlewares/fileLogger.js`:

```javascript
import { appendFile } from 'fs/promises';  // Promise-based file append
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build the absolute path to the log file
// path.join(__dirname, '..', '..', 'requests.log') goes up two levels to project root
const logFilePath = path.join(__dirname, '..', '..', 'requests.log');

// Middleware function that logs every request to a file
export async function fileLogger(req, res, next) {
  const timestamp = new Date().toISOString();  // current time in ISO format
  const logLine = `[${timestamp}] ${req.method} ${req.url}\n`;  // one line per request

  try {
    // Append the log line to the file (creates file if it does not exist)
    await appendFile(logFilePath, logLine, 'utf8');
  } catch (err) {
    // If file writing fails, just print to console instead of crashing
    // Never let logging break the actual API
    console.error('File logger error:', err.message);
  }

  next();  // always continue to the next middleware or route
}
```

Create `src/server.js`:

```javascript
import 'dotenv/config';
import express from 'express';
import { fileLogger } from './middlewares/fileLogger.js';

const app = express();
app.use(express.json());
app.use(fileLogger);  // log every request to requests.log file

const PORT = process.env.PORT || 8888;

// Route that returns system info using process and os
import os from 'os';

app.get('/', (req, res) => {
  res.json({
    message: 'Server is running',
    nodeVersion: process.version,              // e.g. "v22.12.0"
    platform: os.platform(),                  // e.g. "darwin"
    uptime: process.uptime().toFixed(2) + ' seconds',
    freeMemoryGB: (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
  });
});

app.listen(PORT, () => {
  console.log(`Server at http://localhost:${PORT}`);
  console.log(`Logs writing to: requests.log`);
});
```

After making a few requests, open `requests.log` in your project root. You will see every request logged with its timestamp.

---

## 8. The Final File Structure

```
day8-core-modules/
  src/
    server.js
    middlewares/
      fileLogger.js
  .env
  .gitignore
  package.json
  requests.log      <- created automatically when server runs
```

---

## Summary

Here is what you covered today:

- Core modules are built into Node.js. No npm install needed.
- `fs/promises` reads, writes, and appends to files. Use `async/await` with `try/catch`.
- `path.join()` builds file paths that work on any OS. Use `fileURLToPath(import.meta.url)` with `path.dirname()` to recreate `__dirname` in ES Module projects.
- `os` gives you system info: RAM, CPU count, platform, home directory.
- `process` is always available. It gives you Node.js version, working directory, env vars, uptime, and memory usage.
- These modules are especially useful for logging, config management, and system monitoring in backend apps.

---

## Practice Tasks

1. Create a Node.js file using the standard project setup.
2. In `src/server.js`, use `fs/promises` to write a text file with your name and course.
3. Read the file back and print its content.
4. Append a new line with today's date.
5. Print the following system info to the console: OS platform, total RAM in GB, CPU core count, and Node.js version.

---

## Homework

- Create a Node.js project with the standard setup.
- In `src/middlewares/fileLogger.js`, build a middleware that logs every request to a `.log` file.
- Use `path.join` and `__dirname` to build the path to the log file.
- In `src/server.js`, create a GET `/system` route that returns: Node.js version, OS platform, uptime, and free memory.
- Write a short answer: in what two situations in a real backend app would you use the `fs` module?

---

## Campus Store Storyline Project - Level 8

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 8 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 7 is your starting checkpoint. You can review it in [Day 7](<Day7-Project Structure for Real Backend Applications.md>).

You use Node core modules to save request logs and report system information.

### Today’s Project Level

No new package is required because these modules are built into Node.js.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Create | `src/middlewares/fileLogger.js` | Append request details to `logs/requests.log`. |
| Edit | `src/server.js` | Register the file logger and add `GET /system`. |
| Create | `logs/.gitkeep` | Keep the empty log directory in Git without committing log content. |
| Edit | `.gitignore` | Ignore generated `.log` files. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 7 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 8 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Create `src/middlewares/fileLogger.js`

Append request details to `logs/requests.log`.

**File: `src/middlewares/fileLogger.js`**

~~~javascript
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const logDirectory = path.resolve(currentDir, '../../logs');
const logFile = path.join(logDirectory, 'requests.log');

export async function fileLogger(req, res, next) {
  try {
    await mkdir(logDirectory, { recursive: true });
    await appendFile(logFile, `${new Date().toISOString()} ${req.method} ${req.originalUrl}\n`);
  } catch (error) {
    console.error('Could not write request log:', error.message);
  }
  next();
}
~~~

This is the complete Level 8 version of `src/middlewares/fileLogger.js`. Append request details to `logs/requests.log`. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Edit `src/server.js`

Register the file logger and add `GET /system`.

**File: `src/server.js`**

~~~javascript
import 'dotenv/config';
import express from 'express';
import os from 'node:os';
import productRoutes from './routes/productRoutes.js';
import { fileLogger } from './middlewares/fileLogger.js';
import { requestLogger } from './middlewares/requestLogger.js';

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(fileLogger);
app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

app.use('/products', productRoutes);
app.get('/system', (req, res) => {
  res.json({
    nodeVersion: process.version,
    platform: os.platform(),
    uptimeSeconds: Math.round(process.uptime()),
    freeMemoryBytes: os.freemem(),
  });
});

const port = Number(process.env.PORT) || 8888;
app.listen(port, () => {
  console.log(`Campus Store API running at http://localhost:${port}`);
});
~~~

This is the complete Level 8 version of `src/server.js`. Register the file logger and add `GET /system`. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 3 — Create `logs/.gitkeep`

Keep the empty log directory in Git without committing log content.

**File: `logs/.gitkeep`**

~~~text

~~~

This is the complete Level 8 version of `logs/.gitkeep`. Keep the empty log directory in Git without committing log content. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Edit `.gitignore`

Ignore generated `.log` files.

**File: `.gitignore`**

~~~text
node_modules/
.env
logs/*.log
!logs/.gitkeep
~~~

This is the complete Level 8 version of `.gitignore`. Ignore generated `.log` files. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Call two routes, open `logs/requests.log`, then call `GET /system`.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 8, your reference project has this cumulative structure:

```text
campus-store-api/
├── docs/
│   └── api-plan.md
├── logs/
│   └── .gitkeep
├── src/
│   ├── controllers/
│   │   └── productController.js
│   ├── data/
│   │   └── products.js
│   ├── middlewares/
│   │   ├── fileLogger.js
│   │   ├── requestLogger.js
│   │   └── requireStoreKey.js
│   ├── routes/
│   │   └── productRoutes.js
│   └── server.js
├── .env.example
├── .gitignore
├── package-lock.json
└── package.json
```

Your completed checkpoint now:

- Writes one log line for every request.
- Returns platform, Node version, uptime, and free memory.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Call two routes, open `logs/requests.log`, then call `GET /system`.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Use `fs`, `path`, `os`, and `process` whenever an assigned project needs local files or runtime information.

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

The API still forgets products after a restart. Level 9 prepares a PostgreSQL database. Continue with [Day 9](<Day9-Database Fundamentals and PostgreSQL Introduction.md>).
