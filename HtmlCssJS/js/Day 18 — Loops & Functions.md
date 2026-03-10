
# Day 18 — Loops & Functions

Today, you will learn how to **repeat tasks efficiently using loops** and **organize code using functions**.  
We will also cover **scope**, which determines where variables are accessible.

---

# 1. Loops

Loops are used to **repeat a block of code** multiple times.

---

## 1.1 `for` Loop

- Repeats code a known number of times  

### Syntax

```javascript
for(initialization; condition; increment) {
  // code to run
}
````

### Example

```javascript id="for_example"
for(let i = 1; i <= 5; i++) {
  console.log("Iteration:", i);
}
```

* Prints 1 to 5 in console

---

## 1.2 `while` Loop

* Repeats **as long as condition is true**

### Syntax

```javascript
while(condition) {
  // code to run
}
```

### Example

```javascript id="while_example"
let i = 1;
while(i <= 5) {
  console.log("Iteration:", i);
  i++; // increment to avoid infinite loop
}
```

---

## 1.3 `do while` Loop

* Executes **at least once**, then checks condition

### Syntax

```javascript
do {
  // code to run
} while(condition);
```

### Example

```javascript id="do_while_example"
let i = 1;
do {
  console.log("Iteration:", i);
  i++;
} while(i <= 5);
```

---

# 2. Functions

Functions allow us to **reuse code** by grouping statements.

---

## 2.1 Function Declaration

```javascript id="function_declaration"
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Dipak"); // Hello, Dipak!
```

---

## 2.2 Function Expression

* Function stored in a **variable**

```javascript id="function_expression"
const greet = function(name) {
  console.log("Hello, " + name + "!");
};

greet("Dipak");
```

---

## 2.3 Arrow Functions

* Shorter syntax for functions (ES6)

```javascript id="arrow_function"
const greet = (name) => {
  console.log("Hello, " + name + "!");
};

greet("Dipak");
```

* Single parameter & single line:

```javascript id="arrow_short"
const square = x => x * x;
console.log(square(5)); // 25
```

---

## 2.4 Parameters & Return Values

* Functions can take **input (parameters)** and **output (return values)**

```javascript id="function_return"
function add(a, b) {
  return a + b;
}

let result = add(5, 3);
console.log(result); // 8
```

---

# 3. Scope

Scope defines **where a variable can be accessed**.

---

## 3.1 Global Scope

* Declared **outside any function**
* Accessible anywhere

```javascript id="global_scope"
let globalVar = "I am global";

function test() {
  console.log(globalVar); // Accessible here
}

console.log(globalVar); // Accessible here too
```

---

## 3.2 Local Scope

* Declared **inside a function**
* Accessible **only inside that function**

```javascript id="local_scope"
function test() {
  let localVar = "I am local";
  console.log(localVar); // Works
}

console.log(localVar); // Error: not defined
```

---

# Complete Example: Loops & Functions

```html id="js_day18_complete"
<!DOCTYPE html>
<html>
<head>
  <title>Loops & Functions</title>
</head>
<body>

<h1>Loops & Functions Example</h1>

<script>
// For loop
for(let i = 1; i <= 5; i++) {
  console.log("For loop iteration:", i);
}

// While loop
let j = 1;
while(j <= 5) {
  console.log("While loop iteration:", j);
  j++;
}

// Do-while loop
let k = 1;
do {
  console.log("Do-while iteration:", k);
  k++;
} while(k <= 5);

// Function declaration
function greet(name) {
  console.log("Hello, " + name + "!");
}
greet("Dipak");

// Function expression
const add = function(a, b) {
  return a + b;
};
console.log("Sum:", add(5, 3));

// Arrow function
const multiply = (x, y) => x * y;
console.log("Multiply:", multiply(4, 6));

// Scope demonstration
let globalVar = "I am global";
function showScope() {
  let localVar = "I am local";
  console.log(globalVar); // accessible
  console.log(localVar);  // accessible
}
showScope();
console.log(globalVar); // accessible
// console.log(localVar); // Error: not accessible
</script>

</body>
</html>
```

---

# Summary of Day 18

You learned:

- ✔ How to use **loops**: `for`, `while`, `do-while`
- ✔ How to create **functions** (declaration, expression, arrow)
- ✔ How to pass **parameters** and get **return values**
- ✔ Scope: **global** vs **local**

---

# Practice Tasks

### Task 1

Use a **for loop** to print numbers 1 to 10.

---

### Task 2

Use a **while loop** to print even numbers less than 20.

---

### Task 3

Use a **do-while loop** to print numbers 1 to 5.

---

### Task 4

Create a function to **add two numbers** and return the result.

---

### Task 5

Create an **arrow function** to square a number.

---

### Task 6

Write a function that takes a **name parameter** and prints a greeting.

---

### Task 7

Demonstrate **global variable** inside and outside a function.

---

### Task 8

Demonstrate **local variable** inside a function and try to access it outside.

---

### Task 9

Use a **loop inside a function** to print multiplication table of a number.

---

### Task 10

## Create a **function expression** to calculate factorial of a number.
