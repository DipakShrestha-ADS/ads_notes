# ⭐️ Day 2: Advanced JavaScript Concepts (FULL NOTES)

## 1. this keyword & Function Binding

👉 What is this?

this refers to the object that is currently executing the code.

Key rules:

Where used | What this refers to
--- | ---
inside object method | that object
outside any object | global object
in event handlers | the element
arrow functions | does NOT have its own this

🧠 Example (with per-line comments)

```js
const user = {
  name: "Dipak",
  greet: function() {
    console.log("Hello " + this.name); // this refers to user object
  }
}
user.greet(); // Hello Dipak
```

⚠️ Problem: losing "this"

```js
const person = {
  name: "John",
  show() {
    console.log(this.name);
  }
}
const showMethod = person.show;
showMethod(); // undefined because 'this' is lost
```

💡 Fix with .bind()

```js
const fixedShow = person.show.bind(person); // bind person to this
fixedShow(); // John
```

✔️ 10 Tasks: this & binding

1. Create object with name and method using this.

2. Call method from another variable and see undefined.

3. Fix with .bind().

4. Create two objects and use the same method with .bind().

5. Use this inside a click handler (browser).

6. Write function in strict mode and log this.

7. Convert normal function to arrow and see difference.

8. Create object with nested object and log this.

9. Use .call() to borrow method.

10. Use .apply() to borrow method.

## 2. Modules: import & export

Used to split code into multiple files.

👉 Export

module1.js

```js
export const PI = 3.14; // export a variable
export function area(r){
  return PI * r * r; // area of circle
}
```

👉 Import

app.js

```js
import { area } from './module1.js';  // import function
console.log(area(5));
```

✔️ 10 Tasks: Modules

1. Export a variable.

2. Export a function.

3. Import a function.

4. Export default.

5. Import default.

6. Export multiple variables.

7. Rename module on import.

8. Export class.

9. Export an object.

10. Import everything using *.

## 3. Classes and Inheritance

Think of OOP (Object-Oriented Programming) like describing real-world things using objects.

Example:

* A Car has properties (color, model)

* A Car can do actions (start, stop)

This is exactly what OOP tries to model in code.

🧠 What is a Class?

A class is like a blueprint or design for creating objects.

Example:

* A “Car” class describes what every car will have (properties, methods)

* But the actual cars are created from that blueprint (objects)

🔥 Example

```js
// Creating a Car class (blueprint)
class Car {
  
  // constructor runs when we create a new Car
  constructor(brand, color) {
    this.brand = brand;   // property
    this.color = color;   // property
  }
  
  // method (action)
  start() {
    console.log(`${this.brand} started...`);
  }
}
// creating an object (instance)
const car1 = new Car("Toyota", "Red");
// using the object
car1.start();  // Toyota started...
```

🌍 Real-world explanation

Think of class as:

* Architecture drawing of a house

Think of objects (instances) as:

* Real built houses based on that drawing

🧬 What is Inheritance?

Inheritance means one class can “inherit” properties and methods of another class.

Example:

* A Vehicle class

* A Car class can inherit Vehicle features

* So Car automatically gets Vehicle functionality

🔥 Example of Inheritance

```js
// Parent class (base class)
class Vehicle {
  constructor(type) {
    this.type = type;
  }
  move() {
    console.log(`${this.type} is moving`);
  }
}
// Child class (derived class)
class Car extends Vehicle {
  constructor(brand, color) {
    super("Car"); // calls parent constructor
    this.brand = brand;
    this.color = color;
  }
  horn() {
    console.log(`${this.brand} says Beep Beep!`);
  }
}
const myCar = new Car("Tesla", "Blue");
myCar.move();   // Car is moving
myCar.horn();   // Tesla says Beep Beep!
```

🧩 Why Inheritance Matters?

✔ Avoid repeating code\
✔ Keep code organized\
✔ Let child classes reuse parent logic

🚗 Real-world thinking

Vehicle (Parent)

* moves

* stops

Car (Child)

* moves

* stops

* PLUS: plays music, horn, doors

Bike (Another child)

* moves

* stops

* PLUS: handle bars

⭐ OOP Terminology in Simple English

Term | Meaning
--- | ---
Class | Blueprint
Object | Product from blueprint
Constructor | Setup when object is created
Method | Function inside class
Property | Data inside class
extends | Inherit features
super() | Call parent constructor

👉 Define class:

```js
class Animal {
  constructor(name){
    this.name = name; // set property
  }
  speak(){
    console.log(`${this.name} makes sound`);
  }
}
```

👉 Inheritance

```js
class Dog extends Animal {
  speak(){
    console.log(`${this.name} barks`);
  }
}
const d = new Dog("Tommy");
d.speak(); // Tommy barks
```

✅ What is Overriding?

Method overriding happens when a child class (subclass) provides its own version of a method that already exists in the parent class (superclass).

👉 Same method name\
👉 Same parameters (mostly)\
👉 Defined again in child class\
👉 Child method REPLACES parent's method

🎯 Why do we use overriding?

To change, extend, or customize how something behaves specifically for the child class.

Example:\
Animal → speak()\
Dog → speak() behaves differently\
Cat → speak() behaves differently

This allows polymorphism (many forms).

🧠 Real-life analogy

A general "Employee" has a method work().\
A "Developer" also has work(), but work is different (coding).\
A "Designer" also has work(), but work is different (designing).

Same method name → different behavior based on the object.

🧩 Simple Example with Comments

```js
// Parent class
class Animal {
  speak() {
    console.log("Animal makes a sound");
  }
}
// Child class
class Dog extends Animal {
  // Overriding the speak() method
  speak() {
    console.log("Dog barks: Woof Woof!");
  }
}
// Another child class
class Cat extends Animal {
  // Overriding again with different behavior
  speak() {
    console.log("Cat meows: Meow Meow!");
  }
}
// Creating objects
const genericAnimal = new Animal();
const dog = new Dog();
const cat = new Cat();
genericAnimal.speak(); // Output: Animal makes a sound
dog.speak();           // Output: Dog barks: Woof Woof!
cat.speak();           // Output: Cat meows: Meow Meow!
```

✔️ Explanation

* Dog and Cat both override the parent's speak() method.

* They use the same method name, but the behavior changes.

* This allows each object to behave differently even with the same method name.

⭐ Using super (to call parent method)

If you want the child method to use parent logic + add its own:

```js
class Vehicle {
  start() {
    console.log("Vehicle starting...");
  }
}
class Car extends Vehicle {
  start() {
    super.start(); // Calls parent version
    console.log("Car engine: Vroom Vroom!");
  }
}
const car = new Car();
car.start();
```

Output:

Vehicle starting...

Car engine: Vroom Vroom!

💡 When do we use overriding?

* To specialize behavior in child classes

* To provide different implementations for the same method

* In frameworks (React, Express, OOP systems)

* For polymorphism → same method name, different output

🎉 Super simple definition

Overriding means writing a new version of a parent class method inside the child class.

✔️ 10 Tasks: Classes & Inheritance

1. Create class Vehicle.

2. Add constructor.

3. Add method drive().

4. Extend class Bike.

5. Override drive().

6. Create class Student.

7. Add marks property.

8. Inherit class Programmer.

9. Call parent method using super().

10. Create multiple child classes.

## 4. Promises and Async/Await

❓ Why do we need Promises?

JavaScript is single-threaded, but many operations take time (API calls, reading files, database queries).\
These are called asynchronous operations.

Old way:

```js
setTimeout(function(){
  doSomething(function(){
     doSomethingElse(function(){
        doFinal()
     })
  })
})
```

👉 Result: callback hell\
👉 Hard to read\
👉 Hard to debug

🌟 Promises

A Promise represents a value that will be available in the future (success or failure).

Think of it like ordering food at a restaurant:

* You place order = task started

* You wait = pending

* You get food = resolved

* Kitchen failed = rejected

👍 Basic Promise Example

```js
// create a promise
const orderPizza = new Promise((resolve, reject) => {
    const ingredientsAvailable = true  
    if (ingredientsAvailable) {
        resolve("Pizza is ready 🍕")
    } else {
        reject("Sorry, no ingredients 😢")
    }
})
// consume the promise
orderPizza
    .then(message => {
        console.log(message) // Pizza is ready 🍕
    })
    .catch(error => {
        console.log(error) // if ingredients were false
    })
    .finally(() => {
        console.log("Order process finished")
    })
```

💡 What is then/catch/finally?

keyword | meaning
--- | ---
then | success
catch | failure
finally | always runs

⚡ Async / Await

Async/await makes promises look like synchronous code (much easier to read)

🔥 Example using async/await

```js
// promise
function getUser() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ name: "Dipak", age: 26 })
        }, 2000)
    })
}
// async function
async function showUser() {
    const user = await getUser()  
    console.log(user) 
}
showUser()
```

⭐ Output

{ name: 'Dipak', age: 26 }

⏳ Why await?

⏳ It waits until promise finishes before moving forward\
🔥 Cleaner than .then() chain

Old way:

getUser().then(...)

New way:

await getUser()

⚠ Error Handling (Async/Await)

```js
async function fetchData() {
    try {
        const response = await fetch("https://api.example.com")
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.log("Something failed:", error)
    }
}
```

🌍 Real-World Example

Fetching products from API:

```js
async function loadProducts() {
    try {
        const res = await fetch("https://fakestoreapi.com/products")
        const products = await res.json()
        console.log("Loaded products:", products)
    } catch (err) {
        console.log("Server error", err)
    }
}
loadProducts()
```

🧠 Result of learning this:

You can now:\
✔ build APIs\
✔ fetch data\
✔ use backend endpoints\
✔ handle real async operations

🔥 When should I use async/await?

Use async/await when:\
✔ calling APIs\
✔ database calls\
✔ reading files\
✔ network operations

⭐ Key Difference

Promises | Async/Await
--- | ---
uses .then() | uses try/catch
nested | flat
less readable | more readable
older style | modern way

🧩 One Simple Explanation:

Promises = I promise I will give you something later.\
Async/Await = Wait until I give it to you.

💥 Perfect 1-line definitions

Promise = An object that represents a future value.\
Async = A function that returns a promise.\
Await = Pause until promise resolves.

🎯 Real world analogy

Promise:\
“I’ll send you that document later.”

Await:\
You reply — “Ok, I’ll wait.”

👍 Small task (practice)

Task

Create a function that:

* waits 2 seconds

* then prints “Data received”

Example solution:

```js
function getData(){
    return new Promise(resolve=>{
        setTimeout(()=> resolve("Data received"),2000)
    })
}
async function show(){
    const msg = await getData()
    console.log(msg)
}
show()
```

Promise example

```js
const getData = () => {
  return new Promise((resolve, reject) => {
    resolve("Data received"); // resolve success
  });
};
getData().then(result => {
  console.log(result); 
});
```

Async–await

```js
async function load(){
  const result = await getData(); // wait
  console.log(result);
}
load();
```

✅ 1. What is Synchronous in JavaScript?

Synchronous = one after another, blocking.\
Each line waits for the previous line to finish.

👉 Single-threaded execution\
👉 Code runs step-by-step\
👉 Nothing else runs until current task completes

Example (Synchronous):

```js
console.log("A");
console.log("B");
console.log("C");
```

Output:

A

B

C

Everything waits for the previous operation.

⚠️ Problem with synchronous code

If a task takes a long time, everything else stops.

Example:

```js
function longTask() {
  for (let i = 0; i < 1_000_000_000; i++) {}
}
console.log("Start");
longTask(); // blocks everything
console.log("End");
```

Output:

Start

(3 seconds freeze)

End

The UI or program "freezes" until the task completes.

✅ 2. What is Asynchronous in JavaScript?

Asynchronous = doesn't wait.\
JavaScript continues executing other code while waiting for a slow task to finish.

👉 Does NOT block\
👉 Task runs in background using browser APIs / Node APIs\
👉 When done, callback/promise/async gets executed

Example (Asynchronous):

```js
console.log("A");
setTimeout(() => {
  console.log("B");
}, 2000);
console.log("C");
```

Output:

A

C

B

C prints before B, because setTimeout is asynchronous.

🧠 Why asynchronous exists?

Because some tasks are slow:

* API requests

* Reading files

* Database calls

* Timers

* Network requests

* Heavy computations

JavaScript cannot wait for them, otherwise the whole app freezes.

🏡 Real-life analogy

Synchronous

You stand in line at a counter.\
You wait until it's your turn.\
You do nothing else.

Asynchronous

You take a token number.\
You sit and do other things.\
When your number is called, you go to the counter.

🔥 Real Examples of Synchronous vs Asynchronous

✔️ Synchronous example:

```js
console.log("Step 1");
console.log("Step 2");
console.log("Step 3");
```

✔️ Asynchronous example with callback:

```js
console.log("Fetching data...");
setTimeout(() => {
  console.log("Data received!");
}, 2000);
console.log("Continue with other work...");
```

✔️ Asynchronous example with Promise:

```js
fetch("https://api.example.com/users")
  .then(res => res.json())
  .then(data => console.log(data));
console.log("Fetch started...");
```

✔️ Asynchronous example with async/await:

```js
async function getUser() {
  const res = await fetch("https://api.example.com/user");
  const user = await res.json();
  console.log(user);
}
getUser();
console.log("Waiting for data...");
```

🧩 Quick Comparison Table

Feature | Synchronous | Asynchronous
--- | --- | ---
Execution | One-by-one | Non-blocking
Waiting | Yes, blocks thread | No waiting
Best for | Simple tasks | Slow tasks, network, timers
JavaScript behavior | Default mode | Uses Web APIs, event loop
Example | console.log | setTimeout, fetch

🎉 1-line summary

Synchronous operations block the thread; asynchronous operations allow JavaScript to run other tasks while waiting for something to finish.

👉 Callback Function

A callback function is simply a function passed into another function as an argument and executed later.

📌 Easy way to explain (in plain words)

Think of a callback like giving someone your phone number and saying:

“Call me when the work is finished.”

You don’t know when the work will finish, but when it finishes, they call you back.

👉 In JavaScript terms

You pass a function into another function, and that function gets called after something happens.

```js
function greet(name) {
  console.log("Hello " + name);
}
function processUser(callback) {
  const userName = "Dipak";
  callback(userName);
}
processUser(greet);  // greet gets called later
```

Output:

Hello Dipak

📌 Why do we use callbacks?

JavaScript is asynchronous, meaning some tasks take time (API call, file reading, timers).\
Callbacks make sure our code runs after the task finishes.

Example:

```js
setTimeout(function() {
  console.log("This runs after 2 seconds");
}, 2000);
```

🎯 Real life example explanation

Imagine ordering food:

1. You give order to waiter (main function starts)

2. You don’t wait there (code continues running)

3. When food is ready → waiter calls you (callback is executed)

⭐ Very simple example

```js
function myCallback() {
  console.log("Task done!");
}
function doTask(callback) {
  console.log("Doing task…");
  callback();
}
doTask(myCallback);
```

🧠 In short:

Thing | Meaning
--- | ---
Callback | A function passed as argument
When executed | Later, not immediately
Purpose | Control execution timing

🟡 Important point

Callbacks are heavily used in:

* setTimeout()

* Event listeners

* Fetch / API calls

* Node.js

Example:

```js
button.addEventListener('click', () => {
  console.log("Button clicked");
});
```

The arrow function is the callback.

🚀 One-liner explanation

A callback is a function you give to another function so it can run later.

NOTE: JavaScript is single-threaded, but it uses asynchronous behavior to avoid waiting for slow tasks.

✔️ 10 Tasks: Promises & async/await

1. Create promise that resolves.

2. Create promise that rejects.

3. Use .then().

4. Use .catch().

5. Convert to async/await.

6. Wait 2 seconds using setTimeout promise.

7. Create function that returns promise.

8. Chain promises.

9. Use await inside async function.

10. Use multiple awaits.

## 5. Error Handling – try/catch

Used to handle run-time errors.

Example

```js
try {
  console.log(10 / 0); // valid
  unknown(); // error
} catch(error){
  console.log("Error happened");
}
```

finally

```js
try{
  throw new Error("Oops");
}
catch(e){
  console.log("Handled");
}
finally{
  console.log("Runs always");
}
```

✔️ 10 Tasks: try/catch

1. Try using undefined function.

2. Divide number by zero.

3. Use custom error message.

4. Throw error manually.

5. Create function with try/catch.

6. Multiple catch messages.

7. Use finally.

8. Try JSON.parse with invalid JSON.

9. Catch error and log name.

10. Use try/catch in async function.

⭐ HANDS–ON SOLUTIONS

✔️ Task: Create module and import

math.js

```js
export function add(a,b){
  return a+b; // add values
}
```

main.js

```js
import { add } from "./math.js"; // import add
console.log(add(5,10)); // 15
```

✔️ Task: async/await + mock API

```js
// fake API function
function fakeFetch(){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve({ message: "Hello from API" }); // mock data
    },1000);
  })
}
async function loadData(){
  const result = await fakeFetch(); // wait
  console.log(result.message); // print data
}
loadData();
```

✅ Day 2 — 10 Real-World Example Tasks

Task 1 — “this” inside an object method

Create a user object that has name and login() method.\
Inside login(), print the username using this.name.

Goal: understand object method context

Task 2 — “this” losing context

Create a button click example (even if simulated) where calling a method loses this, then fix it using .bind(this)

Goal: experience the common UI bug

Task 3 — Module: Export a config

Create a config.js and export API_BASE_URL, then import it inside main.js and print it.

Goal: share configuration across modules

Task 4 — Module: Utility functions

Make a utils.js with:

* formatCurrency()

* generateRandomId()

* getTodayDate()

Import and use them in another file.

Goal: reusable utility module

Task 5 — Class representing a Product

Create a class Product with:

* name

* price

* getInfo()

Create an object and print info.

Goal: basic classes in real products

Task 6 — Inheritance example

Create Product, then extend a new class FoodProduct that has an expiry date

Goal: model real objects with OOP

Task 7 — Promise for fetching settings

Create a function that returns a Promise that resolves after 2 seconds with app settings (theme, language).

Use .then() to print them.

Goal: simulate async settings

Task 8 — async/await fetching mock data

Create a function fetchUsers() that returns a Promise with an array of users after 1 second.\
Use async/await to get and log users.

Goal: basic async API task

Task 9 — try/catch handling API errors

Modify the previous task so the promise randomly rejects.\
Add try/catch to show a friendly message.

Goal: handle API failures safely

Task 10 — Combine everything

Build a tiny app flow:

* Import config

* Create Product class

* Fetch mock product list using async/await

* Handle errors using try/catch

Log formatted result using a utility function

Goal: mini end-to-end realistic module