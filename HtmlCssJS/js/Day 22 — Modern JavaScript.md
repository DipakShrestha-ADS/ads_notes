
# Day 22 — Modern JavaScript

Today, you will learn **modern JavaScript (ES6+) features**, including **template literals, destructuring, spread/rest operators**, and **array functional methods**.  
We will also explore **browser storage** using `localStorage`.

---

# 1. ES6 Features

---

## 1.1 Template Literals

- Allows **embedding variables** in strings using backticks `` ` ``  
- Supports **multi-line strings**

```javascript id="template_literals"
let name = "Dipak";
let age = 22;

console.log(`Hello, my name is ${name} and I am ${age} years old.`);

// Multi-line
let text = `This is line 1
This is line 2`;
console.log(text);
````

---

## 1.2 Destructuring

* Extract values from **arrays** or **objects** into variables

### Array Destructuring

```javascript id="array_destructuring"
let colors = ["Red", "Green", "Blue"];
let [first, second] = colors;
console.log(first);  // Red
console.log(second); // Green
```

### Object Destructuring

```javascript id="object_destructuring"
let person = {name: "Dipak", age: 22};
let {name, age} = person;
console.log(name); // Dipak
console.log(age);  // 22
```

---

## 1.3 Spread Operator `...`

* Expands **arrays or objects**

```javascript id="spread_operator"
let arr1 = [1,2,3];
let arr2 = [...arr1, 4,5];
console.log(arr2); // [1,2,3,4,5]

let obj1 = {a:1, b:2};
let obj2 = {...obj1, c:3};
console.log(obj2); // {a:1, b:2, c:3}
```

---

## 1.4 Rest Operator `...`

* Collects **remaining elements** into an array

```javascript id="rest_operator"
function sum(...numbers) {
  return numbers.reduce((a,b) => a+b, 0);
}
console.log(sum(1,2,3,4)); // 10
```

---

# 2. Array Functional Methods

---

## 2.1 `map()`

* Creates a **new array** by transforming each element

```javascript id="map_example"
let nums = [1,2,3];
let squares = nums.map(x => x*x);
console.log(squares); // [1,4,9]
```

---

## 2.2 `filter()`

* Returns a **new array** with elements that pass a test

```javascript id="filter_example"
let nums = [1,2,3,4,5];
let even = nums.filter(x => x % 2 === 0);
console.log(even); // [2,4]
```

---

## 2.3 `reduce()`

* Reduces array to a **single value** using a callback

```javascript id="reduce_example"
let nums = [1,2,3,4];
let sum = nums.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 10
```

---

# 3. Browser Storage: `localStorage`

* Stores data **locally in the browser** (persists after refresh)

### Set Item

```javascript id="localstorage_set"
localStorage.setItem("username", "Dipak");
```

### Get Item

```javascript id="localstorage_get"
let user = localStorage.getItem("username");
console.log(user); // Dipak
```

### Remove Item

```javascript id="localstorage_remove"
localStorage.removeItem("username");
```

### Clear All

```javascript id="localstorage_clear"
localStorage.clear();
```

---

# Complete Example: Modern JavaScript

```html id="js_day22_complete"
<!DOCTYPE html>
<html>
<head>
  <title>Modern JavaScript</title>
</head>
<body>

<h1>Modern JS Features Example</h1>

<script>
// Template literals
let name = "Dipak";
let age = 22;
console.log(`Hello ${name}, age: ${age}`);

// Destructuring
let colors = ["Red","Green","Blue"];
let [first, second] = colors;
console.log(first, second);

let person = {name:"Dipak", age:22};
let {name:personName, age:personAge} = person;
console.log(personName, personAge);

// Spread operator
let arr1 = [1,2,3];
let arr2 = [...arr1,4,5];
console.log(arr2);

let obj1 = {a:1, b:2};
let obj2 = {...obj1, c:3};
console.log(obj2);

// Rest operator
function sum(...nums) {
  return nums.reduce((a,b)=>a+b,0);
}
console.log(sum(1,2,3,4));

// Array functional methods
let nums = [1,2,3,4,5];
console.log(nums.map(x => x*x));          // map
console.log(nums.filter(x => x%2===0));   // filter
console.log(nums.reduce((a,b)=>a+b,0));   // reduce

// localStorage
localStorage.setItem("username","Dipak");
console.log(localStorage.getItem("username"));
localStorage.removeItem("username");
</script>

</body>
</html>
```

---

# Summary of Day 22

You learned:

- ✔ ES6 features: template literals, destructuring, spread & rest operators
- ✔ Array functional methods: `map`, `filter`, `reduce`
- ✔ Browser storage: **localStorage**

---

# Practice Tasks

### Task 1

Use **template literals** to print a multi-line message with variables.

---

### Task 2

Destructure **array** and **object** values into variables.

---

### Task 3

Use **spread operator** to merge two arrays.

---

### Task 4

Use **rest operator** in a function to sum any number of arguments.

---

### Task 5

Use `map` to square each element of an array.

---

### Task 6

Use `filter` to select only odd numbers from an array.

---

### Task 7

Use `reduce` to calculate the product of an array of numbers.

---

### Task 8

Store **user info** in localStorage and retrieve it.

---

### Task 9

Remove a specific item from localStorage.

---

### Task 10

## Clear all items from localStorage.

