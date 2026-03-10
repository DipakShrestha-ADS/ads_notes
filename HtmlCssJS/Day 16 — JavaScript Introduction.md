
# Day 16 — JavaScript Introduction

Today, you will learn the **basics of JavaScript (JS)**, including variables, data types, and simple debugging techniques.

---

# 1. What is JavaScript?

- JavaScript is a **programming language** used to make websites **interactive**.  
- Can be used to:
  - Change HTML content dynamically  
  - Respond to user actions (clicks, input)  
  - Validate forms  
  - Create animations and games  

---

# 2. Linking JavaScript

JavaScript can be included in an HTML file in **two main ways**:

---

## 2.1 Inline JS

```html id="inline_js"
<button onclick="alert('Hello World!')">Click Me</button>
````

* Quick but **not recommended** for large code
* Used directly inside HTML tags

---

## 2.2 Internal JS (in `<script>` tag)

```html id="internal_js"
<!DOCTYPE html>
<html>
<head>
  <title>Internal JS</title>
</head>
<body>
  <h1 id="demo">Hello!</h1>
  <script>
    document.getElementById("demo").innerText = "Hello JavaScript!";
  </script>
</body>
</html>
```

---

## 2.3 External JS (separate `.js` file)

```html id="external_js_html"
<script src="script.js"></script>
```

```javascript id="external_js_file"
// script.js
console.log("External JS is working!");
```

* Keeps **HTML clean**
* Easy to maintain

---

# 3. Debugging: Browser Console

* Open console: **F12** or **Ctrl+Shift+I** → Console tab
* Use `console.log()` to **print messages**:

```javascript id="console_log_example"
let name = "Dipak";
console.log("Name is:", name);
```

* Helps **track errors and values**

---

# 4. Variables

Variables store **data that can change**.

---

## 4.1 `var`

* Old way to declare variables
* Function scoped

```javascript id="var_example"
var age = 20;
console.log(age); // Output: 20
```

---

## 4.2 `let`

* Modern way to declare variables
* Block scoped (inside `{}` only)

```javascript id="let_example"
let score = 95;
console.log(score);
```

---

## 4.3 `const`

* Constant value, **cannot be changed**
* Block scoped

```javascript id="const_example"
const pi = 3.14159;
console.log(pi);
```

---

# 5. Data Types

### 5.1 String

* Text enclosed in quotes

```javascript id="string_example"
let name = "Dipak";
console.log("Name:", name);
```

---

### 5.2 Number

* Integers or decimals

```javascript id="number_example"
let age = 20;
let price = 99.99;
console.log(age, price);
```

---

### 5.3 Boolean

* True or False

```javascript id="boolean_example"
let isStudent = true;
console.log(isStudent);
```

---

### 5.4 Null

* Represents **no value**

```javascript id="null_example"
let data = null;
console.log(data); // null
```

---

### 5.5 Undefined

* Variable declared but **not assigned**

```javascript id="undefined_example"
let info;
console.log(info); // undefined
```

---

# Complete Example: JS Introduction

```html id="js_intro_complete"
<!DOCTYPE html>
<html>
<head>
  <title>JS Basics</title>
</head>
<body>

<h1 id="greeting">Hello!</h1>
<button id="btn">Click Me</button>

<script>
// Variables
let name = "Dipak";
const pi = 3.14159;
var age = 20;

// Data types
let isStudent = true;
let data = null;
let info;

console.log("Name:", name);
console.log("Age:", age);
console.log("Pi:", pi);
console.log("Is Student:", isStudent);
console.log("Data:", data);
console.log("Info:", info);

// Button click
document.getElementById("btn").onclick = function() {
  document.getElementById("greeting").innerText = "Hello JavaScript!";
}
</script>

</body>
</html>
```

---

# Summary of Day 16

You learned:

- ✔ What JavaScript is and how to **link it**
- ✔ Debugging with **browser console**
- ✔ Variables: `var`, `let`, `const`
- ✔ Data types: String, Number, Boolean, Null, Undefined

---

# Practice Tasks

### Task 1

Create a variable `username` and print it to console.

---

### Task 2

Create a `const` for `pi` and try to change it (observe error).

---

### Task 3

Use `let` to store your age and print it.

---

### Task 4

Declare a variable without assigning value and print it (`undefined`).

---

### Task 5

Declare a variable and assign `null`.

---

### Task 6

Create a button that changes text on click using JS.

---

### Task 7

Print a string, number, and boolean using `console.log()`.

---

### Task 8

Use internal JS to modify an HTML element content.

---

### Task 9

Link an external JS file and print a message.

---

### Task 10

## Experiment with all 3 variable types (`var`, `let`, `const`) and see differences in scope.
