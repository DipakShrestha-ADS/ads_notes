---

# ⭐️ Day 2: Advanced JavaScript Concepts (FULL NOTES)

---

## 1. **this keyword & Function Binding**

### 👉 What is `this`?

`this` refers to the object that is currently executing the code.

| Where used           | What `this` refers to     |
| -------------------- | ------------------------- |
| inside object method | the object                |
| outside any object   | global object             |
| in event handlers    | the HTML element          |
| in arrow functions   | ❌ no own `this` (lexical) |

---

### 🧠 Example (with comments)

```js
const user = {
  name: "Dipak",
  greet: function() {
    console.log("Hello " + this.name); // this refers to user object
  }
};

user.greet(); // Hello Dipak
```

---

### ⚠️ Problem: Losing `this`

```js
const person = {
  name: "John",
  show() {
    console.log(this.name);
  }
};

const showMethod = person.show;
showMethod(); // undefined (this is lost)
```

---

### 💡 Fix with `.bind()`

```js
const fixedShow = person.show.bind(person);
fixedShow(); // John
```

---

### ✔️ 10 Tasks: this & Binding

* Create object with name and method using this.
* Call method from another variable and see undefined.
* Fix with .bind().
* Create two objects and use same method via .bind().
* Use this inside a click handler.
* Log this inside strict mode.
* Convert normal function to arrow and compare.
* Create nested object and log this.
* Use .call() to borrow method.
* Use .apply() to borrow method.

---

## 2. **Modules: import & export**

Used to split code into reusable files.

### 👉 Export Example (`module1.js`)

```js
export const PI = 3.14;

export function area(r){
  return PI * r * r;
}
```

### 👉 Import Example (`app.js`)

```js
import { area } from './module1.js';

console.log(area(5));
```

---

### ✔️ 10 Tasks: Modules

* Export a variable.
* Export a function.
* Import a function.
* Export default.
* Import default.
* Export multiple variables.
* Rename module on import.
* Export a class.
* Export an object.
* Import everything using `*`.

---

## 3. **Classes and Inheritance**

### 🧠 What is a Class?

A class is a **blueprint** for creating objects.

### 🔥 Example: Class

```js
class Car {
  constructor(brand, color) {
    this.brand = brand;
    this.color = color;
  }

  start() {
    console.log(`${this.brand} started...`);
  }
}

const car1 = new Car("Toyota", "Red");
car1.start();
```

---

### 🧬 What is Inheritance?

One class **inherits** features from another.

### Example:

```js
class Vehicle {
  constructor(type) {
    this.type = type;
  }
  move() {
    console.log(`${this.type} is moving`);
  }
}

class Car extends Vehicle {
  constructor(brand, color) {
    super("Car");
    this.brand = brand;
    this.color = color;
  }
  horn() {
    console.log(`${this.brand} says Beep Beep!`);
  }
}

const myCar = new Car("Tesla", "Blue");
myCar.move();
myCar.horn();
```

---

### ⭐ Terminology

| Term        | Meaning                 |
| ----------- | ----------------------- |
| Class       | Blueprint               |
| Object      | Instance                |
| Constructor | Setup                   |
| Method      | Function inside class   |
| Property    | Object data             |
| extends     | Inherit                 |
| super()     | Call parent constructor |

---

### ✅ Overriding (Very Important)

Child class replaces parent method.

```js
class Animal {
  speak() {
    console.log("Animal makes a sound");
  }
}

class Dog extends Animal {
  speak() {
    console.log("Dog barks: Woof Woof!");
  }
}

class Cat extends Animal {
  speak() {
    console.log("Cat meows: Meow Meow!");
  }
}
```

---

### Using `super()` inside overriding

```js
class Vehicle {
  start() {
    console.log("Vehicle starting...");
  }
}

class Car extends Vehicle {
  start() {
    super.start();
    console.log("Car engine: Vroom Vroom!");
  }
}
```

---

### ✔️ 10 Tasks: Classes & Inheritance

* Create class Vehicle.
* Add constructor.
* Add drive() method.
* Extend class Bike.
* Override drive().
* Create class Student.
* Add marks property.
* Extend with Programmer class.
* Use super().
* Create multiple child classes.

---

## 4. **Promises and Async/Await**

### ❓ Why Promises?

To handle asynchronous tasks without callback hell.

---

### 🌟 Basic Promise Example

```js
const orderPizza = new Promise((resolve, reject) => {
  const ingredientsAvailable = true;

  if (ingredientsAvailable) resolve("Pizza is ready 🍕");
  else reject("Sorry, no ingredients 😢");
});

orderPizza
  .then(msg => console.log(msg))
  .catch(err => console.log(err))
  .finally(() => console.log("Order process finished"));
```

---

### ⚡ Async / Await Example

```js
function getUser() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ name: "Dipak", age: 26 }), 2000);
  });
}

async function showUser() {
  const user = await getUser();
  console.log(user);
}

showUser();
```

---

### Error Handling with Async/Await

```js
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Something failed:", error);
  }
}
```

---

### ✔️ 10 Tasks: Promises & Async/Await

* Create a resolving promise.
* Create a rejecting promise.
* Use `.then()`.
* Use `.catch()`.
* Convert to async/await.
* Wait 2 seconds using a Promise.
* Create a function returning a Promise.
* Chain promises.
* Use await inside async.
* Use multiple awaits.

---

## 5. **Synchronous vs Asynchronous**

### ✅ Synchronous

Runs line-by-line, blocking.

```js
console.log("A");
console.log("B");
console.log("C");
```

---

### ✅ Asynchronous

Does NOT block.

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 2000);

console.log("C");
```

---

### 🧩 Quick Comparison

| Feature   | Synchronous  | Asynchronous |
| --------- | ------------ | ------------ |
| Execution | sequential   | non-blocking |
| Waiting   | Yes          | No           |
| Best for  | simple tasks | API, timers  |
| Uses      | main thread  | Web APIs     |

---

## Callback Function

### Easy Definition:

**A callback is a function passed to another function to run later.**

```js
function greet(name) {
  console.log("Hello " + name);
}

function processUser(callback) {
  const userName = "Dipak";
  callback(userName);
}

processUser(greet);
```

---

## ✔️ 10 Tasks: try/catch

* Try undefined function.
* Divide by zero.
* Custom error message.
* Throw error.
* Function with try/catch.
* Multiple catch messages.
* Use finally.
* Try JSON.parse with invalid JSON.
* Log error name.
* try/catch in async function.

---

## ⭐ HANDS–ON SOLUTIONS

### Create module and import

**math.js**

```js
export function add(a,b){
  return a+b;
}
```

**main.js**

```js
import { add } from "./math.js";

console.log(add(5,10)); // 15
```

---

### async/await mock API example

```js
function fakeFetch(){
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ message: "Hello from API" });
    }, 1000);
  });
}

async function loadData(){
  const result = await fakeFetch();
  console.log(result.message);
}

loadData();
```

---

## ✅ Day 2 — 10 Real-World Example Tasks

1. `this` inside an object method
2. Losing `this` in UI event — fix with `.bind()`
3. Module: export config
4. Module: utility functions
5. Class Product
6. Inheritance: FoodProduct extends Product
7. Promise: return settings after 2 sec
8. async/await: fetchUsers mock
9. try/catch: handle random API failure
10. Combine everything into mini app flow

---