---

# **JavaScript Basics for React – Day 1 Notes**

## **1. Variables in JavaScript (`let`, `const`)**

JavaScript lets you store data inside variables.
Modern JavaScript mainly uses **let** and **const**.

### **🔹 let**

Use when the value can change later.
Block-scoped (lives inside `{ }`).

**Example:**

```js
let age = 25;     // create variable using let
age = 26;         // updating value is allowed
```

### **🔹 const**

Use when the value should **not** change.
Also block-scoped.

**Example:**

```js
const PI = 3.14;  // constant value
// PI = 3.15;     // ❌ Error: const cannot be reassigned
```

---

## **2. Template Literals**

Template literals allow inserting variables inside strings using **backticks (`)**.

**Example:**

```js
const name = "Dipak";
const score = 95;

const message = `Hello ${name}, your score is ${score}`;
console.log(message);
// Output: Hello Dipak, your score is 95
```

---

## **3. Arrow Functions**

Arrow functions are shorter and more modern.

### **Basic Form**

```js
const greet = () => "Hello";
```

### **With Parameters**

```js
const add = (a, b) => {
  return a + b;
};
```

Clean, simple, and widely used in React.

---

## **4. Destructuring Objects & Arrays**

Destructuring extracts values easily.

### **🔹 Object Destructuring**

```js
const person = {
  name: "Dipak",
  age: 26,
  country: "Nepal"
};

const { name, age } = person;

console.log(name); // Dipak
console.log(age);  // 26
```

### **🔹 Array Destructuring**

```js
const numbers = [10, 20, 30];

const [first, second] = numbers;

console.log(first);  // 10
console.log(second); // 20
```

---

## **5. Default Parameters**

Assign default values to function parameters.

**Example:**

```js
const greet = (name = "Guest") => {
  return `Hello ${name}`;
};

console.log(greet());       // Hello Guest
console.log(greet("Dipak")); // Hello Dipak
```

---

## **6. Rest & Spread Operators (`...`)**

The three dots have two powerful uses.

---

### **🔹 Rest Operator**

Collects arguments into an array.

```js
const sumAll = (...numbers) => {
  return numbers.reduce((total, n) => total + n, 0);
};

console.log(sumAll(1, 2, 3)); // 6
```

---

### **🔹 Spread Operator**

Expands arrays or objects.

#### **Array Example**

```js
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];

console.log(arr2); // [1, 2, 3, 4, 5]
```

#### **Object Example**

```js
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };

console.log(obj2); // { a: 1, b: 2, c: 3 }
```

---

## **7. Hands-On Exercises**

### **Exercise 1: Calculate Sum Using Rest + Spread**

**Solution:**

```js
const calcSum = (...numbers) => {
  return numbers.reduce((total, num) => total + num, 0);
};

const values = [10, 20, 30];

console.log(calcSum(...values)); 
// Output: 60
```

---

### **Exercise 2: Merge and Destructure Objects**

**Solution:**

```js
const objA = { name: "Dipak", age: 26 };
const objB = { country: "Nepal", hobby: "Football" };

// Merge objects
const merged = { ...objA, ...objB };
console.log(merged);

// Destructure
const { name, country } = merged;

console.log(name);     // Dipak
console.log(country);  // Nepal
```

---

## **Bonus Tasks with Solutions**

---

### **1️⃣ Task: Sum Numbers Using Rest + Spread**

**Solution:**

```js
function sumNumbers(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

const arr = [10, 20, 30, 40];
console.log(sumNumbers(...arr));  // 100
```

**Explanation:**

* `...numbers` → collects inputs
* `...arr` → spreads array
* `reduce` → adds all values

---

### **2️⃣ Task: Merge & Destructure Objects**

**Solution:**

```js
const person = { name: "Dipak", age: 25 };
const job = { role: "Developer", company: "TechCorp" };

const combined = { ...person, ...job };

const { name, role, company } = combined;

console.log(combined);
console.log(name, role, company);
```

---

# **Day 1: Core JavaScript Hands-On Tasks**

### **Task 1 – Variables & Template Literals**

Create two variables `firstName` and `lastName` and combine them using template literals.

---

### **Task 2 – let and const Scope**

Create a `let` and `const` variable inside `{}` and try to access them outside.
Observe errors.

---

### **Task 3 – Arrow Function Simple**

Write a function:

```js
const greet = (name) => `Hello, ${name}!`;
```

---

### **Task 4 – Arrow Function With Multiple Parameters**

```js
const multiply = (a, b) => a * b;
```

---

### **Task 5 – Object Destructuring**

Create an object and destructure `name` and `country`.

---

### **Task 6 – Array Destructuring**

Destructure `[10, 20, 30, 40]` to get first two values.

---

### **Task 7 – Default Parameters**

Create function:

```js
function sayHello(name = "Guest") { ... }
```

---

### **Task 8 – Rest Operator (Sum of Numbers)**

Write:

```js
function sumAll(...numbers) { ... }
```

---

### **Task 9 – Spread Operator: Arrays**

Merge `[1,2,3]` and `[4,5]`.

---

### **Task 10 – Merge & Destructure Objects**

Merge `{a:1,b:2}` and `{c:3,d:4}`, then destructure `a` and `d`.

---