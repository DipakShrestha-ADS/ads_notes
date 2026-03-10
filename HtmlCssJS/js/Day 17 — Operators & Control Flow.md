
# Day 17 — Operators & Control Flow

Today, you will learn how to **perform operations** using JavaScript operators and control the **flow of code** using conditional statements.

---

# 1. Operators

Operators are **symbols that perform operations** on values.

---

## 1.1 Arithmetic Operators

Used for **math operations**.

| Operator | Description          | Example           |
|----------|-------------------|-----------------|
| `+`      | Addition           | `5 + 3` → 8     |
| `-`      | Subtraction        | `5 - 3` → 2     |
| `*`      | Multiplication     | `5 * 3` → 15    |
| `/`      | Division           | `10 / 2` → 5    |
| `%`      | Modulus (remainder)| `10 % 3` → 1    |
| `**`     | Exponentiation     | `2 ** 3` → 8    |

### Example

```javascript id="arithmetic_example"
let a = 10;
let b = 3;

console.log(a + b); // 13
console.log(a - b); // 7
console.log(a * b); // 30
console.log(a / b); // 3.3333
console.log(a % b); // 1
console.log(a ** b); // 1000
````

---

## 1.2 Assignment Operators

Used to **assign values** to variables.

| Operator | Example              |
| -------- | -------------------- |
| `=`      | `x = 5`              |
| `+=`     | `x += 3` → x = x + 3 |
| `-=`     | `x -= 2`             |
| `*=`     | `x *= 4`             |
| `/=`     | `x /= 2`             |
| `%=`     | `x %= 3`             |

### Example

```javascript id="assignment_example"
let x = 10;
x += 5; // x = 15
x *= 2; // x = 30
console.log(x);
```

---

## 1.3 Comparison Operators

Used to **compare values**.

| Operator | Description      | Example             |
| -------- | ---------------- | ------------------- |
| `==`     | Equal            | `5 == '5'` → true   |
| `===`    | Strict Equal     | `5 === '5'` → false |
| `!=`     | Not equal        | `5 != 3` → true     |
| `!==`    | Strict not equal | `5 !== '5'` → true  |
| `>`      | Greater than     | `5 > 3` → true      |
| `<`      | Less than        | `5 < 3` → false     |
| `>=`     | Greater or equal | `5 >= 5` → true     |
| `<=`     | Less or equal    | `5 <= 3` → false    |

---

## 1.4 Logical Operators

Combine **boolean values**.

| Operator | Description | Example                 |    |       |   |               |
| -------- | ----------- | ----------------------- | -- | ----- | - | ------------- |
| `&&`     | AND         | `true && false` → false |    |       |   |               |
| `        |             | `                       | OR | `true |   | false` → true |
| `!`      | NOT         | `!true` → false         |    |       |   |               |

### Example

```javascript id="logical_example"
let isStudent = true;
let hasID = false;

console.log(isStudent && hasID); // false
console.log(isStudent || hasID); // true
console.log(!isStudent);         // false
```

---

# 2. Conditional Statements

Conditional statements **execute code based on a condition**.

---

## 2.1 `if`

Executes **code if condition is true**.

```javascript id="if_example"
let score = 85;

if (score >= 80) {
  console.log("You passed!");
}
```

---

## 2.2 `else`

Executes code if the **`if` condition is false**.

```javascript id="else_example"
let score = 65;

if (score >= 80) {
  console.log("You passed!");
} else {
  console.log("You failed.");
}
```

---

## 2.3 `else if`

Check **multiple conditions** sequentially.

```javascript id="elseif_example"
let score = 75;

if (score >= 90) {
  console.log("Grade A");
} else if (score >= 75) {
  console.log("Grade B");
} else if (score >= 50) {
  console.log("Grade C");
} else {
  console.log("Fail");
}
```

---

## 2.4 `switch`

Alternative to multiple `if-else` statements, especially for **discrete values**.

```javascript id="switch_example"
let day = 3;
let dayName;

switch(day) {
  case 1:
    dayName = "Monday";
    break;
  case 2:
    dayName = "Tuesday";
    break;
  case 3:
    dayName = "Wednesday";
    break;
  default:
    dayName = "Unknown";
}

console.log("Today is:", dayName); // Today is: Wednesday
```

---

# Complete Example: Operators & Control Flow

```html id="js_day17_complete"
<!DOCTYPE html>
<html>
<head>
<title>JS Operators & Control Flow</title>
</head>
<body>

<h1>JS Operators & Conditional Example</h1>

<script>
// Variables
let score = 78;

// Arithmetic
let x = 10, y = 5;
console.log("Addition:", x + y);
console.log("Subtraction:", x - y);

// Logical
let isStudent = true, hasID = false;
console.log("AND:", isStudent && hasID);
console.log("OR:", isStudent || hasID);

// Conditional statements
if (score >= 90) {
  console.log("Grade A");
} else if (score >= 75) {
  console.log("Grade B");
} else if (score >= 50) {
  console.log("Grade C");
} else {
  console.log("Fail");
}

// Switch example
let day = 2;
switch(day) {
  case 1:
    console.log("Monday");
    break;
  case 2:
    console.log("Tuesday");
    break;
  case 3:
    console.log("Wednesday");
    break;
  default:
    console.log("Unknown");
}
</script>

</body>
</html>
```

---

# Summary of Day 17

You learned:

- ✔ Arithmetic, assignment, comparison, and logical operators
- ✔ Conditional statements: `if`, `else`, `else if`
- ✔ `switch` statements for multiple discrete cases

---

# Practice Tasks

### Task 1

Create two numbers and **perform all arithmetic operations**.

---

### Task 2

Use `if-else` to check if a number is positive, negative, or zero.

---

### Task 3

Check if a student **passed or failed** using score with `if-else`.

---

### Task 4

Use `else if` to assign **grades A, B, C, Fail**.

---

### Task 5

Use `switch` to print **day of the week** for a number 1-7.

---

### Task 6

Combine **comparison and logical operators** in a condition.

---

### Task 7

Check if a number is **even or odd** using `%`.

---

### Task 8

Compare two numbers and print the **larger number**.

---

### Task 9

Use **nested if statements** for multiple conditions.

---

### Task 10

## Write a program to assign **letter grades based on marks** using both `if-else` and `switch`.
