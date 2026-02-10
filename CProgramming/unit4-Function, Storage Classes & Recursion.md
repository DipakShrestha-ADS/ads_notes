# 📘 UNIT 4: FUNCTIONS, Storage Classes & Recursion

---

## 🔰 What is a Function in C?

A **function** is a **named block of code** that performs a **specific task**.

Instead of writing the same logic again and again, we:

* Write the logic once inside a function
* Give it a name
* Call it whenever required

### 📌 Example Idea (Before Function)

```c
printf("Hello\n");
printf("Hello\n");
printf("Hello\n");
```

### 📌 Example Idea (Using Function)

```c
void greet() {
    printf("Hello\n");
}

greet();
greet();
greet();
```

---

## ❓ Why are Functions Needed?

Functions are needed because they:

1. **Reduce code duplication**
2. **Improve readability**
3. **Make debugging easier**
4. **Allow code reuse**
5. **Divide large programs into small parts**

### 🧠 Real-Life Analogy

Think of a **function like a machine**:

* You give input (arguments)
* It performs a task
* It may return output

---

## ⏰ When Should We Use Functions?

Use functions when:

* A task is **repeated**
* Code becomes **long**
* You want **modular design**
* You want **easy maintenance**
* Multiple programmers work on one project

---

## 🧱 Basic Structure of a Function

```c
return_type function_name(parameters) {
    // function body
}
```

---

# 1️⃣ Global & Local Variables

---

## 🔹 What is a Variable?

A **variable** is a named memory location used to store data.

```c
int x = 10;
```

---

## 🔸 Local Variables

### 📌 Definition

A **local variable** is declared **inside a function** and can be used **only inside that function**.

### 📌 Properties

* Scope: Only within the function
* Lifetime: Until function ends
* Memory: Created when function is called
* Safer to use

### 📌 Example

```c
#include <stdio.h>

void show() {
    int a = 10;   // local variable
    printf("%d", a);
}

int main() {
    show();
    return 0;
}
```

❌ `a` cannot be used in `main()`.

---

## 🔸 Global Variables

### 📌 Definition

A **global variable** is declared **outside all functions** and can be accessed by **any function**.

### 📌 Properties

* Scope: Entire program
* Lifetime: Entire program execution
* Memory: Allocated once
* Less safe

### 📌 Example

```c
#include <stdio.h>

int g = 20;   // global variable

void show() {
    printf("%d\n", g);
}

int main() {
    show();
    printf("%d", g);
    return 0;
}
```

---

## 🔸 Global vs Local Variables

| Feature        | Local         | Global         |
| -------------- | ------------- | -------------- |
| Scope          | Function only | Entire program |
| Safety         | High          | Low            |
| Lifetime       | Short         | Long           |
| Recommendation | ✅ Preferred   | ⚠️ Limited use |

---

### 📝 Task Questions

1. Write a program using a local variable.
2. Write a program using a global variable.
3. What happens if both have same name?
4. Identify scope of variables.
5. Convert global variable to local.

---

# 2️⃣ Function Definition

---

## 🔹 What is a Function Definition?

A **function definition** contains the **actual code** that executes when the function is called.

---

## 🔸 Syntax

```c
return_type function_name(parameters) {
    statements;
}
```

---

## 🔸 Parts of a Function

1. **Return Type** – Type of value returned
2. **Function Name** – Used to call the function
3. **Parameters** – Input values (optional)
4. **Function Body** – Logic/code

---

## 🔸 Example

```c
#include <stdio.h>

void greet() {
    printf("Welcome Students\n");
}

int main() {
    greet();
    return 0;
}
```

---

## 🔸 Function with Parameters

```c
void add(int a, int b) {
    printf("Sum = %d", a + b);
}
```

---

### 📝 Task Questions

1. Write a function to print your name.
2. Write a function to add two numbers.
3. Identify function parts.
4. Write a function with parameters.
5. Separate logic from main using function.

---

# 3️⃣ return Statement

---

## 🔹 What is return Statement?

The `return` statement:

* Sends value back to caller
* Terminates function execution

---

## 🔸 Syntax

```c
return value;
```

---

## 🔸 Example

```c
int square(int x) {
    return x * x;
}
```

---

## 🔸 Using return in main

```c
return 0;
```

Means program ended successfully.

---

## 🔸 Multiple return statements

```c
int check(int n) {
    if (n % 2 == 0)
        return 1;
    else
        return 0;
}
```

---

### 📝 Task Questions

1. Write function returning sum.
2. Write function returning largest number.
3. What happens after return?
4. Can void function use return?
5. Identify return errors.

---

# 4️⃣ Calling a Function by Value

---

## 🔹 What is Call by Value?

In **call by value**:

* The function receives a **copy** of the variable
* Changes inside the function **do not affect the original variable**

---

## 🔸 Example

```c
#include <stdio.h>

void change(int x) {
    x = 50;
}

int main() {
    int a = 10;
    change(a);
    printf("%d", a);  // Output: 10
    return 0;
}
```

---

## 🔸 Why Value Doesn’t Change?

* `x` is a copy
* `a` remains original

---
## 🔹 Why is Call by Value Used?

### ✅ 1. Data Safety

Original data cannot be changed accidentally.

```c
void calculate(int x) {
    x = x + 10;
}
```

Original value remains safe.

---

### ✅ 2. Easy to Understand

* No pointers
* Simple memory model
* Best for beginners

---

### ✅ 3. Useful for Calculations

When you only want:

* Input → process → output
* No modification of original variable

---

### ✅ 4. Avoids Side Effects

One function cannot disturb another function’s data.

---

### 📝 Task Questions

1. Demonstrate call by value.
2. Predict output of program.
3. Explain memory behavior.
4. Try swapping using call by value.
5. Advantages of call by value.

---

# 5️⃣ Macros in C

---

## 🔹 What is a Macro?

A **macro** is a **preprocessor instruction** that **replaces text before compilation**.

Defined using
```c
#define
```

---

## 🔹 Where Does Macro Work?

Macro works in the **preprocessing stage**, BEFORE:

* Compilation
* Execution

---

## 🔸 Syntax

```c
#define NAME value
```

---

## 🔸 Example

```c
#define PI 3.14
```
When compiler sees:
```c
area = PI * r * r;
```

It **replaces it as**:

```c
area = 3.14 * r * r;
```

👉 No memory is created for `PI`.

---

## 🔸 Macro with Arguments

```c
#define SQUARE(x) (x * x)
```

---

## 🔸 Example Program

```c
#include <stdio.h>
#define SQUARE(x) (x * x)

int main() {
    printf("%d", SQUARE(5));
    return 0;
}
```
When compiler sees:
```c
printf("%d", SQUARE(5));
```

### Preprocessor Replaces It As

```c
printf("%d", (5 * 5));
```

---
## 🔹 Why Are Macros Used?

### ✅ 1. Faster Execution

* No function call
* No stack memory
* Direct replacement

Functions:

```
main → function call → return
```

Macros:

```
Direct replacement
```

---

### ✅ 2. No Function Overhead

Functions require:

* Stack
* Jump to function
* Return back

Macros avoid all this.

---

### ✅ 3. Useful for Constants

```c
#define MAX 100
```

Better than variables because:

* Cannot be changed
* No memory used

---

### ✅ 4. Small Repeated Code

For very small operations like:

* Square
* Cube
* Min / Max

Macros are faster.
---

## 🔹 Why Macros Are Dangerous?

### ❌ 1. No Type Checking

```c
#define ADD(a,b) a+b
```

Can cause unexpected results.

---

### ❌ 2. Debugging is Difficult

* Macro does not exist at runtime
* Cannot set breakpoint

---

### ❌ 3. Expression Problems

```c
#define SQUARE(x) x*x
SQUARE(2+3)   // becomes 2+3*2+3 = 11 ❌
```

Correct way:

```c
#define SQUARE(x) (x*x)
```
---

## 🔸 Important Points

* No type checking
* Faster execution
* Hard to debug

---

### 📝 Task Questions

1. Define macro for PI.
2. Write macro for cube.
3. Explain macro expansion.
4. Identify macro mistakes.
5. Difference between macro and constant.

---

# 6️⃣ Difference between Function & Macro

---

## 🔸 Comparison Table

| Feature       | Function | Macro        |
| ------------- | -------- | ------------ |
| Execution     | Runtime  | Compile time |
| Type checking | Yes      | No           |
| Speed         | Slower   | Faster       |
| Debugging     | Easy     | Difficult    |
| Safety        | High     | Low          |

---

## 🔸 Example

### Function

```c
int square(int x) {
    return x * x;
}
```

### Macro

```c
#define SQUARE(x) (x * x)
```

---

### 📝 Task Questions

1. Write differences.
2. Convert function to macro.
3. Which is safer and why?
4. When to avoid macros?
5. Predict macro output.

---
