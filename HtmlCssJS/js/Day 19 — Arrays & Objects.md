
# Day 19 — Arrays & Objects

Today, you will learn how to **store multiple values using arrays**, **work with objects**, and understand **basic JSON** for data representation.

---

# 1. Arrays

Arrays are **ordered collections of values**.

---

## 1.1 Creating Arrays

```javascript id="array_creation"
let fruits = ["Apple", "Banana", "Mango"];
console.log(fruits);
````

---

## 1.2 Accessing Elements

* Use **index**, starting from 0

```javascript id="array_access"
console.log(fruits[0]); // Apple
console.log(fruits[2]); // Mango
```

---

# 2. Array Methods

### 2.1 `push()` — add at end

```javascript id="array_push"
fruits.push("Orange");
console.log(fruits); // ["Apple","Banana","Mango","Orange"]
```

---

### 2.2 `pop()` — remove last

```javascript id="array_pop"
fruits.pop();
console.log(fruits); // ["Apple","Banana","Mango"]
```

---

### 2.3 `shift()` — remove first

```javascript id="array_shift"
fruits.shift();
console.log(fruits); // ["Banana","Mango"]
```

---

### 2.4 `unshift()` — add at start

```javascript id="array_unshift"
fruits.unshift("Strawberry");
console.log(fruits); // ["Strawberry","Banana","Mango"]
```

---

### 2.5 `splice()` — add/remove at position

```javascript id="array_splice"
fruits.splice(1, 1, "Kiwi"); 
// remove 1 element at index 1 and insert "Kiwi"
console.log(fruits); // ["Strawberry","Kiwi","Mango"]
```

---

# 3. Iterating Arrays

### Using `for` loop

```javascript id="array_for_loop"
for(let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
```

### Using `for...of` loop

```javascript id="array_forof"
for(let fruit of fruits) {
  console.log(fruit);
}
```

### Using `forEach()`

```javascript id="array_foreach"
fruits.forEach(function(fruit, index) {
  console.log(index, fruit);
});
```

---

# 4. Objects

Objects are **collections of key-value pairs**.

---

## 4.1 Creating Objects

```javascript id="object_creation"
let person = {
  name: "Dipak",
  age: 22,
  isStudent: true
};
console.log(person);
```

---

## 4.2 Object Properties

```javascript id="object_properties"
console.log(person.name); // Dipak
console.log(person["age"]); // 22
```

---

## 4.3 Object Methods

```javascript id="object_methods"
let person = {
  name: "Dipak",
  age: 22,
  greet: function() {
    console.log("Hello, I am " + this.name);
  }
};

person.greet(); // Hello, I am Dipak
```

---

# 5. JSON Basics

* **JSON (JavaScript Object Notation)** is a **format to store/send data**
* Looks like JS objects but **keys must be in double quotes**

### Example

```javascript id="json_example"
let jsonData = '{"name":"Dipak","age":22,"isStudent":true}';

// Convert JSON string to JS object
let obj = JSON.parse(jsonData);
console.log(obj.name); // Dipak

// Convert JS object to JSON string
let jsonString = JSON.stringify(obj);
console.log(jsonString);
```

---

# Complete Example: Arrays & Objects

```html id="js_day19_complete"
<!DOCTYPE html>
<html>
<head>
  <title>Arrays & Objects</title>
</head>
<body>

<h1>Arrays & Objects Example</h1>

<script>
// Arrays
let fruits = ["Apple", "Banana", "Mango"];
fruits.push("Orange");
fruits.unshift("Strawberry");
fruits.splice(2, 1, "Kiwi");
console.log("Fruits:", fruits);

// Iterate arrays
fruits.forEach((fruit, index) => {
  console.log(index, fruit);
});

// Objects
let person = {
  name: "Dipak",
  age: 22,
  greet: function() {
    console.log("Hello, I am " + this.name);
  }
};

console.log(person.name);
person.greet();

// JSON
let jsonData = '{"name":"Dipak","age":22,"isStudent":true}';
let obj = JSON.parse(jsonData);
console.log("From JSON:", obj.name);

let jsonString = JSON.stringify(person);
console.log("To JSON:", jsonString);
</script>

</body>
</html>
```

---

# Summary of Day 19

You learned:

- ✔ Arrays: creation, access, methods, iteration
- ✔ Objects: properties and methods
- ✔ JSON: converting between JS objects and strings

---

# Practice Tasks

### Task 1

Create an array of **5 numbers** and print each element.

---

### Task 2

Use `push`, `pop`, `shift`, `unshift` on an array.

---

### Task 3

Use `splice` to **replace an element** in an array.

---

### Task 4

Iterate an array using `for` loop, `for...of`, and `forEach`.

---

### Task 5

Create an object with properties: `name`, `age`, `city`.

---

### Task 6

Add a **method** to the object that prints a greeting.

---

### Task 7

Access object properties using **dot notation** and **bracket notation**.

---

### Task 8

Convert an object to **JSON string** and print it.

---

### Task 9

Convert a JSON string to **JS object** and print a property.

---

### Task 10

## Create an array of objects representing **students** with `name` and `score`, and print each student's score.
