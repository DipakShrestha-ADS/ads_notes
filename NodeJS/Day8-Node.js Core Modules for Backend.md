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

## 1. What Are Core Modules

When you install Node.js, it comes with a set of built-in modules called core modules. You do not need to install them with npm. They are already there, ready to use.

You import them by name, just like any other module:

```javascript
// Import the file system module
import fs from 'fs';

// Import the path module
import path from 'path';

// Import the os module
import os from 'os';
```

These modules give you tools to work with the file system, the operating system, and the Node.js runtime itself.

---

## 2. The fs Module - Working With Files

`fs` stands for file system. This module lets you create, read, update, and delete files on your computer or server.

There are two ways to use most `fs` functions: synchronous (blocking) and asynchronous (non-blocking). In Node.js, the asynchronous version is almost always preferred because it does not block other code from running.

### Reading a file

First, let us say you have a file called `notes.txt` with some text in it. Here is how to read it:

```javascript
import fs from 'fs';

// Read the file asynchronously
// 'utf8' tells Node.js to decode the file as text, not raw bytes
fs.readFile('notes.txt', 'utf8', (err, data) => {
  // If something went wrong (file not found, no permission, etc.)
  if (err) {
    console.error('Error reading file:', err.message);
    return;
  }

  // If successful, data contains the file content as a string
  console.log('File content:', data);
});

console.log('This line runs BEFORE the file is read because readFile is async');
```

Line by line:

- `fs.readFile('notes.txt', 'utf8', callback)` reads the file. The first argument is the file path. `'utf8'` tells Node to return the content as a human-readable string instead of a raw Buffer.
- The callback function runs when reading is done. Node.js always passes errors as the first argument of callbacks. If `err` is not null, something went wrong.
- `data` contains the full text content of the file.
- The `console.log` at the bottom runs immediately, before the file is even opened. This shows that `readFile` is non-blocking.

### Writing a file

```javascript
import fs from 'fs';

// The content to write
const content = 'Hello from Node.js!\nThis was written by the fs module.';

// Write to a file (creates it if it does not exist, overwrites if it does)
fs.writeFile('output.txt', content, 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err.message);
    return;
  }

  console.log('File written successfully!');
});
```

Line by line:

- `fs.writeFile('output.txt', content, 'utf8', callback)` writes the string `content` into `output.txt`.
- If the file does not exist, it is created. If it already exists, it is completely overwritten.
- `'utf8'` specifies the encoding so the text is written correctly.
- The callback only receives `err`. There is no data because you are writing, not reading.

### Appending to a file

If you want to add text to an existing file without deleting what is already there:

```javascript
import fs from 'fs';

// Add a new line to the file without erasing the existing content
fs.appendFile('output.txt', '\nThis line was appended.', 'utf8', (err) => {
  if (err) {
    console.error('Error appending:', err.message);
    return;
  }

  console.log('Line appended successfully!');
});
```

- `fs.appendFile` works exactly like `writeFile` but adds to the end instead of replacing.
- The `\n` at the beginning adds a newline before the appended text.

### Checking if a file exists

```javascript
import fs from 'fs';

// Check if a file exists before trying to read it
fs.access('output.txt', fs.constants.F_OK, (err) => {
  if (err) {
    // err means the file does NOT exist
    console.log('File does not exist');
  } else {
    // No error means the file exists
    console.log('File exists');
  }
});
```

- `fs.access` checks if the file exists and whether you have permission to access it.
- `fs.constants.F_OK` is a flag that checks for existence only.

### Using the Promise-based version of fs

Node.js also provides `fs/promises` which returns Promises instead of using callbacks. This is cleaner with async/await:

```javascript
// Import the Promise-based version
import { readFile, writeFile } from 'fs/promises';

async function handleFile() {
  try {
    // Write a file
    await writeFile('example.txt', 'This is async/await file writing!', 'utf8');
    console.log('File written');

    // Read the file back
    const content = await readFile('example.txt', 'utf8');
    console.log('File content:', content);
  } catch (err) {
    // If any error occurs, it is caught here
    console.error('File error:', err.message);
  }
}

handleFile();
```

Line by line:

- `import { readFile, writeFile } from 'fs/promises'` imports the async versions.
- `await writeFile(...)` writes the file and waits for it to finish before moving on.
- `await readFile(...)` reads it back. The result is stored in `content`.
- `try/catch` handles errors cleanly. If either operation fails, the catch block runs.

This style is recommended in modern Node.js code because it is more readable.

---

## 3. The path Module - Working With File Paths

The `path` module helps you create and manipulate file paths in a way that works across all operating systems.

On macOS and Linux, paths use forward slashes: `/users/ali/notes.txt`

On Windows, paths use backslashes: `C:\Users\ali\notes.txt`

If you manually write slashes in your code, it might break on a different operating system. The `path` module handles this automatically.

### path.join

`path.join` combines parts of a path together using the correct separator for your OS:

```javascript
import path from 'path';

// Combine path parts safely
const filePath = path.join('data', 'users', 'profile.json');

console.log(filePath);
// On macOS/Linux: data/users/profile.json
// On Windows: data\users\profile.json
```

- `path.join('data', 'users', 'profile.json')` joins three segments into one path.
- You never need to manually add slashes.

### path.resolve

`path.resolve` creates an absolute path by starting from the current directory:

```javascript
import path from 'path';

// Get absolute path of a file relative to the current directory
const absolutePath = path.resolve('data', 'users.json');

console.log(absolutePath);
// Something like: /Users/ali/projects/day8/data/users.json
```

- `path.resolve` is like `path.join` but always returns an absolute path starting from the current working directory.

### path.dirname and path.basename

```javascript
import path from 'path';

const filePath = '/Users/ali/projects/day8/app.js';

// Get the directory containing the file
console.log(path.dirname(filePath));
// Output: /Users/ali/projects/day8

// Get just the filename
console.log(path.basename(filePath));
// Output: app.js

// Get the filename without the extension
console.log(path.basename(filePath, '.js'));
// Output: app

// Get just the extension
console.log(path.extname(filePath));
// Output: .js
```

Line by line:

- `path.dirname(filePath)` returns everything up to the last `/`. It gives you the folder the file lives in.
- `path.basename(filePath)` returns just the filename including the extension.
- `path.basename(filePath, '.js')` removes the given extension from the returned filename.
- `path.extname(filePath)` returns only the file extension including the dot.

### Using __dirname equivalent in ES Modules

In older CommonJS files, `__dirname` gave you the current directory path. In ES Modules (with `"type": "module"` in package.json), `__dirname` is not available. Here is the modern replacement:

```javascript
import { fileURLToPath } from 'url';
import path from 'path';

// __filename is the full path to this file
const __filename = fileURLToPath(import.meta.url);

// __dirname is the folder this file is in
const __dirname = path.dirname(__filename);

console.log('Current file:', __filename);
console.log('Current folder:', __dirname);

// Now you can use __dirname to build paths
const dataFolder = path.join(__dirname, 'data');
console.log('Data folder:', dataFolder);
```

Line by line:

- `import.meta.url` gives you the URL of the current file (e.g., `file:///Users/ali/app.js`).
- `fileURLToPath(import.meta.url)` converts that URL to a plain file system path.
- `path.dirname(__filename)` extracts the folder from the full file path.
- Now `__dirname` works just like in CommonJS projects.

---

## 4. The os Module - System Information

The `os` module gives you information about the operating system and machine that Node.js is running on.

```javascript
import os from 'os';

// Get the platform (win32, darwin, linux)
console.log('Platform:', os.platform());

// Get the OS version details
console.log('OS Type:', os.type());

// Get the computer's hostname (the name of the machine)
console.log('Hostname:', os.hostname());

// Get total RAM in bytes, converted to GB
const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
console.log('Total RAM:', totalRAM, 'GB');

// Get currently available (free) RAM
const freeRAM = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
console.log('Free RAM:', freeRAM, 'GB');

// Get number of CPU cores
console.log('CPU Cores:', os.cpus().length);

// Get the home directory of the current user
console.log('Home Directory:', os.homedir());
```

Line by line:

- `os.platform()` returns a string like `'darwin'` for macOS, `'win32'` for Windows, `'linux'` for Linux.
- `os.type()` returns a fuller OS name like `'Darwin'` or `'Linux'`.
- `os.hostname()` returns the machine's network name.
- `os.totalmem()` returns total RAM in bytes. Dividing by `1024` three times converts bytes to gigabytes.
- `.toFixed(2)` rounds the number to 2 decimal places.
- `os.cpus()` returns an array where each item represents one CPU core. `.length` counts them.
- `os.homedir()` returns the current user's home folder path.

---

## 5. The process Object - Runtime Information

`process` is a global object in Node.js. It does not need to be imported. It gives you information about the currently running Node.js process.

```javascript
// Print the Node.js version
console.log('Node.js version:', process.version);

// Print the current working directory
console.log('Working directory:', process.cwd());

// Print all environment variables
// (not recommended to print in production, shows passwords etc.)
console.log('PORT env variable:', process.env.PORT);

// Print how long the process has been running (in seconds)
console.log('Uptime:', process.uptime().toFixed(2), 'seconds');

// Print memory usage
const mem = process.memoryUsage();
const usedMB = (mem.heapUsed / 1024 / 1024).toFixed(2);
console.log('Memory used:', usedMB, 'MB');
```

Line by line:

- `process.version` shows the Node.js version string.
- `process.cwd()` returns the current working directory from which the script was run. `cwd` stands for "current working directory."
- `process.env.PORT` reads the `PORT` environment variable. All env vars are accessible through `process.env`.
- `process.uptime()` returns how many seconds the Node.js process has been running.
- `process.memoryUsage()` returns an object with memory statistics. `heapUsed` is how much heap memory is being used. Dividing by `1024` twice converts bytes to megabytes.

### Handling process exit

```javascript
// Listen for when the process is about to exit
process.on('exit', (code) => {
  // This runs right before Node.js shuts down
  console.log(`Process exiting with code: ${code}`);
});

// Listen for Ctrl+C in the terminal
process.on('SIGINT', () => {
  console.log('Server stopped by user (Ctrl+C)');
  // Exit cleanly with code 0
  process.exit(0);
});
```

Line by line:

- `process.on('exit', callback)` registers a listener. When the Node.js process is about to shut down, this runs.
- `process.on('SIGINT', callback)` listens for the Ctrl+C signal from the terminal. This is useful for running cleanup code when you stop the server.
- `process.exit(0)` manually stops the process. Code `0` means success.

---

## 6. Practical Use in a Backend App

Let us combine these modules in a small practical example: a simple request logger that writes logs to a file.

```javascript
import 'dotenv/config';
import express from 'express';
import { appendFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Build the path to the log file, relative to the current folder
const logFilePath = path.join(__dirname, 'requests.log');

// Middleware that writes every request to a log file
async function fileLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${req.method} ${req.url}\n`;

  try {
    // Append the log entry to the log file
    await appendFile(logFilePath, logEntry, 'utf8');
  } catch (err) {
    // If logging fails, just print to console instead of crashing the app
    console.error('Could not write to log file:', err.message);
  }

  // Always continue to the next middleware regardless of logging success
  next();
}

// Apply file logging globally
app.use(fileLogger);

app.get('/', (req, res) => {
  res.json({
    message: 'Server is running',
    nodeVersion: process.version,
    platform: process.platform,
    uptime: process.uptime().toFixed(2) + ' seconds'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Logs will be saved to: ${logFilePath}`);
});
```

Line by line for the middleware:

- `const logEntry = \`...\`` creates the log string with timestamp, method, and URL.
- `await appendFile(logFilePath, logEntry, 'utf8')` appends the log entry to the file. If the file does not exist yet, it creates it.
- The `try/catch` ensures that even if file logging fails, the request still continues. Never let logging break your actual API.
- `next()` is called outside the try/catch so it always runs.

The GET `/` route shows how `process` gives useful runtime information that you can include in API responses.

---

## Summary

Here is what you covered today:

- Core modules come built into Node.js and do not need to be installed.
- The `fs` module reads, writes, and appends to files. Use `fs/promises` with async/await for modern code.
- The `path` module joins and manipulates file paths in a way that works on all operating systems.
- In ES Module projects, use `fileURLToPath(import.meta.url)` and `path.dirname()` to recreate `__dirname`.
- The `os` module gives system information like RAM, CPU cores, platform, and hostname.
- The `process` object is always available without importing. It provides the Node.js version, environment variables, uptime, and memory usage.
- These modules are especially useful for logging, reading config files, serving static files, and running system checks.

---

## Practice Tasks

1. Create a file called `student-info.txt` using the `fs` module. Write your name, age, and course name into it.
2. Read the file back and print the contents to the console.
3. Append a new line to the file with today's date.
4. Use the `path` module to construct the path to the file using `path.join`.
5. Print system information to the console: OS platform, total RAM, number of CPU cores, and the current Node.js version.

---

## Homework

- Create a Node.js file that does the following:
  - Uses `path.join` and `__dirname` to build a file path.
  - Writes student information (name, course, date) to that file.
  - Reads the file back and prints it.
  - Prints system info using the `os` and `process` modules.
- Write a short note: in what situation in a real backend app would you use the `fs` module? Give two examples.
