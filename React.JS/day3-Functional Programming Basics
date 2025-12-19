# Day 3: Functional Programming Basics

Functional programming (FP) is a programming paradigm that treats computation as the evaluation of mathematical functions and avoids changing state and mutable data. In JavaScript, adopting FP principles leads to more predictable, testable, and maintainable code—especially important when working with React.

## 1. Pure Functions

A **pure function** is a function that:
- Always returns the same output for the same input.
- Has no side effects (does not modify external state, variables, or arguments).

### Example: Pure Function

```js
// Pure function: same input → same output, no side effects
function add(a, b) {
  return a + b; // Only depends on parameters a and b
}

console.log(add(5, 3)); // Output: 8
console.log(add(5, 3)); // Output: 8 (always the same)
```

### Example: Impure Function (Avoid in FP)

```js
let taxRate = 0.1; // External variable

// Impure: depends on external state and result changes if taxRate changes
function calculateTax(price) {
  return price * taxRate; // Relies on external variable
}
```

**Why Pure Functions Matter?**  
They are predictable and easier to test/debug.

## 2. Arrays & Objects

In FP, we treat arrays and objects as immutable data structures.

```js
// Creating an array
const fruits = ["apple", "banana", "orange"];

// Creating an object
const person = {
  name: "Dipak",
  age: 26,
  country: "Nepal"
};
```

## 3. Array Methods: map, filter, reduce, find, forEach

These methods are the cornerstone of functional programming in JavaScript.

### map() — Transform each element

```js
const numbers = [1, 2, 3, 4];

// map creates a new array by applying a function to each element
const doubled = numbers.map(num => num * 2);

console.log(doubled); // [2, 4, 6, 8]
console.log(numbers); // [1, 2, 3, 4] → original unchanged (immutable)
```

### filter() — Select elements that match a condition

```js
const ages = [15, 22, 17, 30, 19];

// filter creates a new array with elements that pass the test
const adults = ages.filter(age => age >= 18);

console.log(adults);  // [22, 30, 19]
console.log(ages);    // [15, 22, 17, 30, 19] → original unchanged
```

### reduce() — Reduce array to a single value

```js
const values = [10, 20, 30, 40];

// reduce accumulates a value (total) starting from initial value 0
const sum = values.reduce((total, current) => total + current, 0);

console.log(sum);     // 100
console.log(values);  // unchanged
```

### find() — Return the first element that matches

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
];

// find returns the first matching element (or undefined)
const user = users.find(u => u.id === 2);

console.log(user); // { id: 2, name: "Bob" }
```

### forEach() — Execute a function for each element (no return)

```js
const colors = ["red", "green", "blue"];

// forEach does not return anything, just performs side effect
colors.forEach(color => console.log("Color:", color));
```

## 4. Immutability Principles

**Never mutate data directly.** Always create new copies.

### Bad (Mutation)

```js
const obj = { name: "John", age: 25 };
obj.age = 30; // Direct mutation → bad in FP
```

### Good (Immutability)

```js
const obj = { name: "John", age: 25 };

// Create a new object with updated value using spread operator
const updatedObj = { ...obj, age: 30 };

console.log(obj);        // { name: "John", age: 25 } → original unchanged
console.log(updatedObj); // { name: "John", age: 30 }
```

### Immutability with Arrays

```js
const scores = [85, 90, 95];

// Add new score immutably
const newScores = [...scores, 88]; // Spread + new value

// Remove first score immutably
const withoutFirst = scores.slice(1); // slice creates new array
```

## 5. Higher-Order Functions

A **higher-order function** is a function that:
- Takes one or more functions as arguments, or
- Returns a function.

All array methods (`map`, `filter`, `reduce`, etc.) are higher-order functions.

### Custom Higher-Order Function Example

```js
// Function that takes another function as argument
function applyOperation(arr, operation) {
  return arr.map(operation); // map is also higher-order
}

// Usage
const nums = [1, 2, 3, 4];

const squared = applyOperation(nums, n => n * n);
console.log(squared); // [1, 4, 9, 16]

const doubled = applyOperation(nums, n => n * 2);
console.log(doubled); // [2, 4, 6, 8]
```

## Hands-On Solutions

### Task 1: Use map and filter to process an array of objects

**Requirement:**  
Given an array of students, create a new array containing only passing students (score >= 60) and include their grade ("Pass").

**Solution with Detailed Comments**

```js
// Array of student objects
const students = [
  { name: "Alice", score: 85 },
  { name: "Bob",   score: 45 },
  { name: "Charlie", score: 72 },
  { name: "Diana", score: 59 },
  { name: "Eve",   score: 90 }
];

// Step 1: Filter students who passed (score >= 60)
const passingStudents = students.filter(student => student.score >= 60);

// Step 2: Use map to create new objects with grade "Pass"
const result = passingStudents.map(student => ({
  name: student.name,           // Keep original name
  score: student.score,         // Keep original score
  grade: "Pass"                 // Add new property
}));

// Output the result
console.log(result);
/*
Expected Output:
[
  { name: "Alice",   score: 85, grade: "Pass" },
  { name: "Charlie", score: 72, grade: "Pass" },
  { name: "Eve",     score: 90, grade: "Pass" }
]
*/

// Original array remains unchanged
console.log(students); // Original data intact
```

**Chaining map and filter (more functional style)**

```js
const resultChained = students
  .filter(student => student.score >= 60)           // Filter first
  .map(student => ({                                // Then transform
    name: student.name,
    score: student.score,
    grade: "Pass"
  }));

console.log(resultChained); // Same result as above
```

### Task 2: Write a function that returns a new object without modifying the original

**Requirement:**  
Write a function `updateUserAge(user, newAge)` that returns a new user object with updated age, without changing the original.

**Solution with Detailed Comments**

```js
// Original user object
const originalUser = {
  name: "Dipak",
  age: 26,
  country: "Nepal",
  hobbies: ["coding", "football"]
};

// Function to update age immutably
function updateUserAge(user, newAge) {
  // Use spread operator to create shallow copy
  // Only override the 'age' property
  return {
    ...user,              // Copy all properties from original
    age: newAge           // Update only age
  };
}

// Call the function
const updatedUser = updateUserAge(originalUser, 27);

// Log both objects
console.log("Original:", originalUser);
/*
{
  name: "Dipak",
  age: 26,
  country: "Nepal",
  hobbies: ["coding", "football"]
}
*/

console.log("Updated:", updatedUser);
/*
{
  name: "Dipak",
  age: 27,
  country: "Nepal",
  hobbies: ["coding", "football"]
}
*/

// Proof of immutability
console.log(originalUser.age === 26); // true → original not changed
```

**Bonus: Deep Immutability (Nested Objects)**

If the object has nested mutable data (like arrays), spread is shallow. For deep copy:

```js
function updateUserHobbies(user, newHobby) {
  return {
    ...user,
    hobbies: [...user.hobbies, newHobby] // New array copy
  };
}
```

## Summary

- **Pure functions** → predictable, no side effects.
- **Array methods** → `map`, `filter`, `reduce`, `find`, `forEach` → functional tools.
- **Immutability** → never mutate data directly → use spread, slice, etc.
- **Higher-order functions** → functions that accept or return functions → core of FP.
- Always prefer returning new data instead of modifying existing → makes code safer and easier to reason about in React.

# Day 3: Functional Programming Basics – Practice Tasks

Here are **10 practice tasks for each topic** covered in Day 3. These tasks are designed for students to reinforce functional programming concepts in JavaScript. Encourage students to write pure functions, maintain immutability, and avoid side effects.

## 1. Pure Functions – 10 Practice Tasks

1. Write a pure function `multiply(a, b)` that returns the product of two numbers.

2. Create a pure function `getFullName(firstName, lastName)` that returns a concatenated full name with a space.

3. Write a pure function `isEven(num)` that returns `true` if the number is even, `false` otherwise.

4. Create a pure function `capitalize(str)` that returns the string with the first letter capitalized.

5. Write a pure function `calculateArea(radius)` that returns the area of a circle (use π ≈ 3.14).

6. Create a pure function `getInitials(firstName, lastName)` that returns initials like "D.S." for "Dipak Shrestha".

7. Write a pure function `fahrenheitToCelsius(f)` that converts Fahrenheit to Celsius.

8. Create a pure function `reverseString(str)` that returns the reversed string.

9. Write a pure function `findMax(arr)` that returns the largest number in an array.

10. Create a pure function `formatDate(year, month, day)` that returns a string in "DD/MM/YYYY" format.

## 2. Arrays & Objects – 10 Practice Tasks

1. Create an array `colors` with 5 color names and log the third element.

2. Create an object `book` with properties `title`, `author`, `pages`, and `publishedYear`.

3. Add a new property `isRead: true` to an existing `book` object immutably (return new object).

4. Create an array of 3 objects, each representing a `student` with `name` and `grade`.

5. Create a nested object `company` with properties `name`, `location`, and `employees` (an array of names).

6. From an array `numbers = [10, 20, 30]`, create a new array with each value increased by 5 immutably.

7. Create an object `car` and add a new property `color` immutably.

8. Create an array `shoppingList` and add a new item at the beginning immutably.

9. Create an object `profile` with nested `address` object containing `city` and `country`.

10. From an array of objects `products`, create a new array with only `name` and `price` properties.

## 3. Array Methods (map, filter, reduce, find, forEach) – 10 Practice Tasks

1. Use `map` to double all numbers in `[1, 2, 3, 4, 5]`.

2. Use `filter` to get all even numbers from `[1, 2, 3, 4, 5, 6]`.

3. Use `reduce` to calculate the sum of `[10, 20, 30, 40]`.

4. Use `find` to get the first object with `age > 18` from an array of user objects.

5. Use `forEach` to log each element of `["apple", "banana", "orange"]` with its index.

6. Use `map` to extract only names from an array of user objects.

7. Use `filter` to get products with `price < 100` from an array of product objects.

8. Use `reduce` to find the maximum value in an array of numbers.

9. Use `map` and `filter` together to get names of adults (age >= 18) in uppercase.

10. Use `forEach` to build an HTML unordered list string from an array of items.

## 4. Immutability Principles – 10 Practice Tasks

1. Update an object's `age` from 25 to 26 immutably using spread operator.

2. Add a new hobby to a person's `hobbies` array immutably.

3. Remove the last element from an array immutably.

4. Replace the second element in an array immutably.

5. Change a nested property `address.city` in an object immutably.

6. Add a new key-value pair to an object immutably.

7. Remove a property `deletedAt` from an object immutably.

8. Merge two arrays immutably into a new array.

9. Merge two objects immutably into a new object.

10. Update a specific object in an array of objects immutably (by id).

## 5. Higher-Order Functions – 10 Practice Tasks

1. Write a higher-order function `repeat(action, times)` that calls `action` function `times` times.

2. Create a function `operate(arr, fn)` that applies `fn` to each element using `map`.

3. Write a function `filterBy(arr, conditionFn)` that returns filtered array using the provided condition.

4. Create a higher-order function `logger(fn)` that logs "before" and "after" calling `fn`.

5. Write a function `createAdder(x)` that returns a new function adding `x` to its argument.

6. Create a higher-order function `sortBy(arr, key)` that sorts array of objects by given key.

7. Write a function `pipeline(...functions)` that chains multiple functions (apply one after another).

8. Create a higher-order function `withTax(taxRate)` that returns a function to add tax to price.

9. Write a function `debounce(fn, delay)` that delays function execution (basic version).

10. Create a higher-order function `memoize(fn)` that caches results of expensive pure functions.

Students should complete all 50 tasks above for strong mastery of functional programming principles! These skills will directly improve their React code quality. 🚀