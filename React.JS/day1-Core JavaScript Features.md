# Core Javascript Features

1. Variables in JavaScript (let, const)

   JavaScript lets you store data inside variables.\
   Modern JS prefers let and const:

   🔹 let

   * Use it when the value can change later.

   * Block-scoped (lives inside { }).

   Example

   ```js
   let age = 25;       // create variable using "let"
   age = 26;           // updating value is allowed
   ```

   🔹 const

   * Use it when the value should not change.

   * Also block-scoped.

   Example

   ```js
   const PI = 3.14;    // constant value
   // PI = 3.15;       // ❌ Error: const variables cannot be reassigned
   ```

2. Template Literals

   Template literals allow inserting variables inside strings using backticks (`).

   Example

   ```js
   const name = "Dipak";        // variable storing a name
   const score = 95;            // variable storing score
   const message = `Hello ${name}, your score is ${score}`;  // embed variables inside string
   console.log(message);        // prints: Hello Dipak, your score is 95
   ```

3. Arrow Functions

   Arrow functions are shorter and more modern than traditional functions.

   Basic Form

   ```js
   const greet = () => "Hello";   // arrow function returning a value
   ```

   With parameters

   ```js
   const add = (a, b) => {       // arrow function taking two parameters
       return a + b;             // return the sum
   };
   ```

   Clean and beautiful.

4. Destructuring Objects & Arrays

   Destructuring lets you extract values easily.

   🔹 Object Destructuring

   Extract properties directly into variables.

   Example

   ```js
   const person = {
       name: "Dipak",         // property 1
       age: 26,               // property 2
       country: "Nepal"       // property 3
   };
   const { name, age } = person;   // extract name and age
   console.log(name);              // prints: Dipak
   console.log(age);               // prints: 26
   ```

   🔹 Array Destructuring

   Extract values from arrays.

   Example

   ```js
   const numbers = [10, 20, 30];  // array with 3 values
   const [first, second] = numbers; // extract first two elements
   console.log(first);              // 10
   console.log(second);             // 20
   ```

5. Default Parameters

   You can give a parameter a default value.

   Example

   ```js
   const greet = (name = "Guest") => {   // default value for name is Guest
       return `Hello ${name}`;           // using template literal
   };
   console.log(greet());                 // prints: Hello Guest
   console.log(greet("Dipak"));          // prints: Hello Dipak
   ```

6. Rest & Spread Operators (...)

   The three dots (...) have two magical roles.

   🔹 Rest Operator

   Collects multiple values into a single array.

   Example

   ```js
   const sumAll = (...numbers) => {          // rest operator collects all arguments
       return numbers.reduce((total, n) => total + n, 0); // calculate sum
   };
   console.log(sumAll(1, 2, 3));             // prints: 6
   ```

   🔹 Spread Operator

   Spreads (expands) the elements of arrays or objects.

   Example — Array

   ```js
   const arr1 = [1, 2, 3];        // original array
   const arr2 = [...arr1, 4, 5];  // spread arr1 into arr2
   console.log(arr2);             // [1, 2, 3, 4, 5]
   ```

   Example — Object

   ```js
   const obj1 = { a: 1, b: 2 };      // first object
   const obj2 = { ...obj1, c: 3 };   // spread obj1 into new object
   console.log(obj2);                // {a:1, b:2, c:3}
   ```

7. Hands-On Exercises

   Exercise 1: Calculate Sum Using Rest + Spread

   Solution

   ```js
   // function to calculate sum using rest operator
   const calcSum = (...numbers) => {            // rest collects all arguments
       return numbers.reduce((total, num) => total + num, 0); // add them
   };
   const values = [10, 20, 30];                 // array of numbers
   console.log(calcSum(...values));             // spread array into arguments → output: 60
   ```

   Exercise 2: Merge and Destructure Objects

   Solution

   ```js
   // two objects to merge
   const objA = { name: "Dipak", age: 26 };     // first object
   const objB = { country: "Nepal", hobby: "Football" }; // second object
   // merge objects using spread operator
   const merged = { ...objA, ...objB };         // combine both objects
   console.log(merged);                         // full merged result
   // destructure merged object
   const { name, country } = merged;            // extract name & country
   console.log(name);                           // prints: Dipak
   console.log(country);                        // prints: Nepal
   ```

   1️⃣ Task: Create a function that calculates the sum of numbers in an array using rest and spread operators.

   ✅ Solution

   ```js
   // Using rest + spread
   function sumNumbers(...numbers) {
     return numbers.reduce((total, n) => total + n, 0);
   }
   const arr = [10, 20, 30, 40];
   // Spread the array into the function
   console.log(sumNumbers(...arr)); 
   // Output: 100
   ```

   🧠 Explanation (short & sharp)

   * ...numbers collects inputs as an array.

   * ...arr spreads elements of arr into separate arguments.

   * reduce adds everything up.

   2️⃣ Task: Write a function to merge and destructure objects.

   ✅ Solution

   ```js
   const person = { name: "Dipak", age: 25 };
   const job = { role: "Developer", company: "TechCorp" };
   // Merge both using spread
   const combined = { ...person, ...job };
   // Destructure merged object
   const { name, role, company } = combined;
   console.log(combined);
   // { name: 'Dipak', age: 25, role: 'Developer', company: 'TechCorp' }
   console.log(name, role, company);
   // Dipak Developer TechCorp
   ```

   🧠 Explanation

   * { ...obj1, ...obj2 } merges objects.

   * Destructuring pulls specific keys into variables.

## Day 1: Core JavaScript Hands-On Tasks

Task 1 – Variables and Template Literals\
Create two variables, firstName and lastName, and combine them into a greeting message using template literals. Log the message.

Task 2 – let and const Scope\
Create a let variable inside a block {} and try to access it outside. Then do the same with a const variable. Observe the errors.

Task 3 – Arrow Function Simple\
Write an arrow function greet that takes a name and returns "Hello, <name>!". Test it with your name.

Task 4 – Arrow Function with Multiple Parameters\
Write an arrow function multiply that takes two numbers and returns their product. Log the result for 5 and 6.

Task 5 – Object Destructuring\
Create an object person with keys name, age, and country. Destructure the object to extract name and country into variables and log them.

Task 6 – Array Destructuring\
Create an array [10, 20, 30, 40]. Destructure the first two elements into variables and log them.

Task 7 – Default Parameters\
Write a function sayHello with a parameter name that defaults to "Guest" if not provided. Log the output when called with and without an argument.

Task 8 – Rest Operator (Sum of Numbers)\
Write a function sumAll using the rest operator (...numbers) that calculates the sum of any number of inputs. Test with 1, 2, 3, 4.

Task 9 – Spread Operator with Arrays\
Create two arrays [1, 2, 3] and [4, 5]. Merge them into a new array using the spread operator and log the result.

Task 10 – Merge and Destructure Objects\
Create two objects: {a: 1, b: 2} and {c: 3, d: 4}. Merge them using the spread operator. Then destructure the merged object to extract a and d and log them.