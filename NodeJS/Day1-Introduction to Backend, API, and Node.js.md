# Day 1 - Introduction to Backend, API, and Node.js

## What You Will Learn Today

- What backend development is and what it actually does for an application
- How a client and server communicate with each other
- What a request and response look like
- What an API is and why it matters
- What Node.js is and why it runs JavaScript outside the browser
- How to install Node.js and npm
- How to run your very first Node.js program

---

## 1. What Is Backend Development

When you open Instagram and see your feed, that is frontend. It is what you see on the screen.

But behind that screen, something else is working. When you tap the like button, a request goes to a server, the server updates the count in a database, and then sends back a response to your screen.

That invisible part is the backend.

Think of a restaurant. The customer sits at the table and looks at the menu. That is the frontend. The kitchen where the food is actually prepared is the backend. The customer never goes into the kitchen. The kitchen just does the work and sends the food out.

Backend is responsible for:

- storing and managing data in a database
- handling user accounts and authentication
- running business logic like calculations and rules
- communicating with other services
- sending data back to the frontend

---

## 2. What Is a Client and What Is a Server

A client is any device or app that makes a request. Your phone, browser, or desktop app is a client.

A server is a computer that receives that request, does some work, and sends back a response. The server is always running and waiting for requests.

```
Client (browser or app)  -->  Request  -->  Server
Server                   -->  Response -->  Client
```

Real example:

You type `google.com` in your browser. Your browser is the client. It sends a request to Google's servers. Google's server finds the page and sends it back. Your browser shows the result.

---

## 3. What Is a Request and What Is a Response

A request is when the client asks for something. A response is what the server sends back.

Every request has:

- a method (like GET or POST)
- a URL (the address of the resource)
- optional headers (extra information)
- optional body (data sent with the request)

Every response has:

- a status code (like 200 for success, 404 for not found)
- headers
- a body (the actual data sent back, usually JSON)

Example of a login flow:

```
Client sends:
  POST /login
  Body: { email: "ali@example.com", password: "12345" }

Server checks the email and password in the database.

Server sends back:
  Status: 200 OK
  Body: { token: "some-generated-token" }
```

---

## 4. What Is an API

API stands for Application Programming Interface.

An API is a way for two programs to talk to each other. It is a set of rules that defines how requests should be made and what responses will be returned.

Think of an API like a waiter in a restaurant. You do not go into the kitchen yourself. You tell the waiter what you want. The waiter goes to the kitchen, picks up your order, and brings it back to you. The waiter is the API. It connects you (the client) with the kitchen (the server or database).

Example:

A weather app on your phone does not store weather data itself. It calls an API from a weather service. The weather service sends back the current weather data. The app just displays it.

```
Weather App  -->  GET https://api.weather.com/city/kathmandu  -->  Weather Server
Weather Server sends back --> { temp: 22, condition: "cloudy" }
Weather App shows the result on screen.
```

This is how almost every app you use works today.

---

## 5. What Is Node.js

JavaScript was originally made to run only in web browsers. You could use it to make buttons clickable, show popups, or validate forms. But it could not create servers or work with databases.

Node.js changed that.

Node.js is a runtime environment that lets JavaScript run outside the browser, directly on your computer or server. It was created by Ryan Dahl in 2009.

With Node.js, JavaScript can now:

- create HTTP servers
- read and write files
- connect to databases like PostgreSQL or MongoDB
- build complete backend systems and APIs

Think of it this way. A car engine alone cannot do anything useful. You need the whole car around it. Node.js is like the rest of the car built around the JavaScript engine. It gives JavaScript the tools it needs to work on a server.

---

## 6. Why Use Node.js for Backend

There are many backend languages. Python, Java, Go, PHP. Why do we choose Node.js?

| Reason           | What It Means                                           |
| ---------------- | ------------------------------------------------------- |
| Same language    | You already know JavaScript from the frontend           |
| Fast development | Express.js and npm make building APIs quick             |
| Non-blocking     | Node.js can handle many requests at the same time       |
| Huge ecosystem   | npm has millions of packages ready to use               |
| Great for APIs   | Node.js is widely used for REST APIs and real-time apps |

If you already know JavaScript, Node.js is the most natural path into backend development.

---

## 7. How Node.js Works Behind the Scenes

Node.js uses something called an event loop. This is how it handles many requests at the same time without creating a new thread for each one.

Normal languages like Java create a new thread for each user request. If you have 1000 users, you need 1000 threads. This uses a lot of memory.

Node.js handles things differently. It uses a single thread with an event loop. When a request comes in and needs to wait (like waiting for a database), Node.js does not block. It moves on to the next request and comes back when the waiting is done.

This makes Node.js very efficient for apps that handle many small, fast requests like REST APIs.

---

## 8. Installing Node.js and npm

### Step 1 - Go to the official Node.js website

Open your browser and go to:

```
https://nodejs.org
```

### Step 2 - Download the LTS version

LTS means Long Term Support. It is the stable version recommended for most users. Click the LTS button and download the installer for your operating system.

### Step 3 - Run the installer

Follow the installation steps. On Windows, run the `.msi` file. On macOS, run the `.pkg` file. On Linux, use your package manager.

### Step 4 - Verify installation

After installation, open your terminal or command prompt and run:

```bash
node --version
```

You should see something like:

```
v22.12.0
```

Then check npm:

```bash
npm --version
```

You should see something like:

```
10.9.0
```

npm is installed automatically along with Node.js. npm stands for Node Package Manager. It lets you install thousands of ready-made packages into your project.

---

## 9. Running Your First Node.js Program

### Step 1 - Create a folder for your work

```bash
mkdir day1-intro
cd day1-intro
```

`mkdir` creates a new folder. `cd` moves into that folder.

### Step 2 - Create a file called app.js

You can create this file in your code editor. Just make a new file named `app.js` inside the `day1-intro` folder.

### Step 3 - Write your first code

Open `app.js` and type:

```javascript
// This prints a message to the terminal
console.log("Hello from Node.js");

// This prints your name
console.log("My name is Ali");

// This prints the current date
console.log("Today is:", new Date().toDateString());
```

Line by line explanation:

- `console.log(...)` prints whatever you put inside the parentheses to the terminal
- The first line prints the text "Hello from Node.js"
- The second line prints your name - change "Ali" to your own name
- The third line prints today's date using JavaScript's built-in `Date` object
- `new Date()` creates the current date and time
- `.toDateString()` formats it as a readable string like "Thu Jun 12 2026"

### Step 4 - Run the file

In your terminal, make sure you are inside the `day1-intro` folder. Then run:

```bash
node app.js
```

You will see:

```
Hello from Node.js
My name is Ali
Today is: Thu Jun 12 2026
```

That is your first Node.js program running.

---

## 10. Understanding How Node.js Differs from Browser JavaScript

When JavaScript runs in a browser, it has access to things like `document`, `window`, and `alert`. These are browser-specific features.

When JavaScript runs in Node.js, there is no browser. So `document` and `window` do not exist.

But Node.js gives you different tools:

```javascript
// This works in Node.js
console.log(process.version);  // Shows the Node.js version you are using

// This works in Node.js
console.log(__filename);  // Shows the full path of the current file

// This does NOT work in Node.js (browser only)
// document.getElementById("title")
```

Line by line:

- `process` is a global object in Node.js. It gives you information about the running process.
- `process.version` returns the version of Node.js currently running.
- `__filename` is a special variable in Node.js that holds the full file path of the current file.
- The last line is commented out because `document` does not exist in Node.js.

---

## 11. A Complete First Program

Let us write a slightly more complete program that shows what Node.js can do right from day one:

```javascript
// Print a welcome message to the terminal
console.log("Welcome to Node.js Backend Course");

// Store your own information in variables
const yourName = "Priya";  // change this to your own name
const courseName = "Node.js REST API Development"; // the course you are in
const today = new Date().toDateString(); // gets today's date as readable text

// Print each value with a label
// console.log can take multiple values separated by commas
console.log("Name:", yourName);       // prints: Name: Priya
console.log("Course:", courseName);   // prints: Course: Node.js REST API Development
console.log("Date:", today);          // prints: Date: Thu Jun 12 2026

// process.version is a built-in Node.js value - no need to calculate it
console.log("Running on Node.js version:", process.version);
```

Look at each line:

- `const yourName = "Priya"` stores your name in a variable. Change `"Priya"` to your own name.
- `const today = new Date().toDateString()` calls JavaScript's built-in `Date` object and formats it as a readable string.
- `console.log("Name:", yourName)` prints the label `Name:` followed by the value of `yourName`. The comma between them adds a space automatically.
- `process.version` is available in every Node.js program without importing anything. It tells you which version of Node.js is running.

---

## Summary

Here is what you covered today:

- Backend is the invisible part of an app that handles data, logic, and communication.
- A client sends a request. A server receives it, does work, and sends back a response.
- An API is the set of rules that defines how two programs communicate. Think of it as a waiter between the client and the server.
- Node.js lets JavaScript run outside the browser so you can use it to build servers and APIs.
- npm is the package manager that comes with Node.js. It lets you install ready-made libraries.
- You run a Node.js file with the command `node filename.js` in the terminal.

---

## Practice Tasks

1. Create a folder called `day1-practice`.
2. Inside it, create a file called `app.js`.
3. Write code that prints:
   - your full name
   - your course name
   - today's date
   - the Node.js version using `process.version`
4. Run the file with `node app.js` and check the output in your terminal.
5. Write short notes in your own words: what is backend, what is an API, what is Node.js.

---

## Homework

- In your own words, write a paragraph about what happens when you log into any website or app. Describe the client, server, request, and response involved.
- Create a second Node.js file that prints 5 interesting facts about yourself using `console.log`.
- Starting from Day 2, every project will use a specific folder structure and package setup. Read ahead so you know what is coming.
