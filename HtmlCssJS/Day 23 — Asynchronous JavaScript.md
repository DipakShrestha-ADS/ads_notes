
# Day 23 — Asynchronous JavaScript

Today, you will learn how JavaScript **handles tasks that take time**, like API calls or timers, without blocking the rest of the code.  
We will explore **callbacks, promises, Fetch API, async/await**, and **error handling**.

---

# 1. Callbacks

- A **callback** is a function passed as an argument to another function, executed later.

```javascript id="callback_example"
function greet(name, callback) {
  console.log("Hello " + name);
  callback();
}

function sayGoodbye() {
  console.log("Goodbye!");
}

greet("Dipak", sayGoodbye);
````

* Output:

```
Hello Dipak
Goodbye!
```

---

# 2. Promises

* A **Promise** represents a **future value** (pending, fulfilled, rejected)
* Helps **avoid callback hell**

### Example

```javascript id="promise_example"
let promise = new Promise((resolve, reject) => {
  let success = true;
  if(success) {
    resolve("Task completed successfully");
  } else {
    reject("Task failed");
  }
});

promise.then(result => console.log(result))
       .catch(error => console.log(error));
```

* `then()` executes when resolved
* `catch()` executes when rejected

---

# 3. Fetch API

* Used to **make HTTP requests**
* Returns a **Promise**

### Example: Fetch JSON Data

```javascript id="fetch_example"
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then(response => response.json()) // convert response to JSON
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));
```

---

# 4. Async / Await

* **Async functions** allow writing asynchronous code **like synchronous code**

```javascript id="async_await_example"
async function getUser() {
  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    let data = await response.json();
    console.log(data);
  } catch(error) {
    console.error("Error:", error);
  }
}

getUser();
```

* `await` pauses execution until **Promise resolves**
* `try/catch` handles errors

---

# 5. Error Handling

* Always handle asynchronous errors to prevent crashes

### Example with Promises

```javascript id="error_handling_promise"
let promise = new Promise((resolve, reject) => {
  reject("Something went wrong");
});

promise.then(result => console.log(result))
       .catch(error => console.log("Error:", error));
```

### Example with Async/Await

```javascript id="error_handling_async"
async function test() {
  try {
    let response = await fetch("invalid_url");
    let data = await response.json();
  } catch(error) {
    console.log("Caught error:", error);
  }
}

test();
```

---

# Complete Example: Asynchronous JavaScript

```html id="js_day23_complete"
<!DOCTYPE html>
<html>
<head>
  <title>Asynchronous JS</title>
</head>
<body>

<h1>Asynchronous JavaScript Example</h1>
<button id="btn">Fetch User</button>

<script>
// Callback example
function greet(name, callback) {
  console.log("Hello " + name);
  callback();
}

function sayGoodbye() {
  console.log("Goodbye!");
}

greet("Dipak", sayGoodbye);

// Promise example
let promise = new Promise((resolve, reject) => {
  let success = true;
  if(success) resolve("Promise resolved!");
  else reject("Promise rejected!");
});

promise.then(result => console.log(result))
       .catch(error => console.log(error));

// Fetch API and Async/Await
document.getElementById("btn").addEventListener("click", async function() {
  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    let user = await response.json();
    console.log("Fetched User:", user);
  } catch(error) {
    console.error("Error fetching user:", error);
  }
});
</script>

</body>
</html>
```

---

# Summary of Day 23

You learned:

- ✔ Callbacks: basic asynchronous function execution
- ✔ Promises: `then` / `catch` for handling async tasks
- ✔ Fetch API: retrieving data from APIs
- ✔ Async/Await: modern way to write asynchronous code
- ✔ Error handling: preventing runtime issues in async code

---

# Practice Tasks

### Task 1

Create a callback function that prints a message after 2 seconds.

---

### Task 2

Write a promise that resolves with "Success" and logs the result.

---

### Task 3

Use `fetch` to get JSON data from an API and log it.

---

### Task 4

Write an async function that fetches user data and logs it.

---

### Task 5

Handle errors in a promise using `catch`.

---

### Task 6

Handle errors in an async function using `try/catch`.

---

### Task 7

Chain multiple `then` to process a promise result.

---

### Task 8

Simulate an API call using `setTimeout` wrapped in a promise.

---

### Task 9

Fetch multiple users using `Promise.all` (optional advanced task).

---

### Task 10

## Combine a callback and a promise to print messages in sequence.
