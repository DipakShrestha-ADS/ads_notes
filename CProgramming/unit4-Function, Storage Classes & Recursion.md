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

## Storage Classes

In C, a **storage class** specifies:
- **where** a variable is stored (memory location),
- its **scope** (where it can be accessed),
- its **lifetime** (how long it exists during program execution),
- and sometimes hints about **speed/optimization**.

Storage classes covered here:
1. **Automatic (`auto`) variables**
2. **External (`extern`) variables**
3. **Static (`static`) variables**
4. **Register (`register`) variables**

---

## 1) Automatic Variables (`auto`)

### Meaning
**Automatic variables** are the default variables declared **inside a function or a block**. They are created automatically when the block starts and destroyed when the block ends.

### Key properties
- **Keyword:** `auto` (rarely written; it’s the default for local variables)
- **Scope:** Local to the block/function where declared
- **Lifetime:** Exists only while control remains inside that block/function
- **Default initial value:** **Garbage value** (if not initialized)
- **Storage location:** Typically **stack memory**

### Notes / Important points
- Automatic variables **cannot be accessed** outside their block.
- Every time a function is called, a **new set of automatic variables** is created.
- Very important in **recursion**: each recursive call gets its own copy of automatic variables.

### Simple example
```c
void demo() {
    int x = 10;   // automatic (default)
    x++;
    printf("%d", x);
} // x is destroyed here
```

### Practice Tasks (5)
1. Write a program that declares local variables in `main()` and prints them. Try accessing them from another function and observe the compilation error.
2. Create a function `test()` with an automatic variable `count = 1`, increment and print it, then call `test()` 5 times. Explain why it does not “remember” the previous call.
3. Write a program with nested blocks `{}` and declare variables with the same name in inner and outer blocks. Demonstrate **block scope**.
4. Write a function that returns the address of an automatic variable. Test it in `main()` and explain why it becomes unsafe (dangling pointer).

---

## 2) External Variables (`extern`)

### Meaning
An **external variable** is typically a **global variable** (defined outside all functions) that can be shared across multiple source files (`.c` files).

### Key properties
- **Keyword:** `extern` (used mainly for *declaration*, not definition)
- **Scope:** Global; can be accessed in multiple files using `extern`
- **Lifetime:** Entire program execution (from start to end)
- **Default initial value:** **0** (if not explicitly initialized)
- **Storage location:** Data segment (global/static storage area)

### Definition vs Declaration (Very Important)
- **Definition**: Allocates memory/storage (creates the variable).
  - Example:
    ```c
    int x = 10;   // definition (global)
    ```
- **Declaration**: Tells the compiler the variable exists elsewhere (no new storage created).
  - Example:
    ```c
    extern int x; // declaration
    ```

### Why use `extern`?
- To share one global variable between files:
  - `file1.c` defines it
  - `file2.c` uses `extern` to access it

### Notes / Important points
- Overuse of external/global variables can reduce readability and make debugging difficult.
- Prefer passing values via **function parameters** when possible.

### Practice Tasks (5)
1. Create a global variable `int total;` and update it in multiple functions. Print it in `main()` and explain lifetime and default initialization.
2. Create two files `a.c` and `b.c`: define a global variable in `a.c`, access and modify it in `b.c` using `extern`. Compile and link correctly.
3. Define the same global variable in two different `.c` files and observe the **multiple definition** linker error. Fix it using `extern`.
4. Create a global variable and a local variable with the same name inside a function. Demonstrate which one is used and explain the concept of **shadowing**.
5. Write a menu-driven program where a global variable stores a shared state (e.g., `balance`). Multiple functions should read/update it, then list pros/cons.

---

## 3) Static Variables (`static`)

`static` changes a variable’s **lifetime** and/or **visibility**, depending on where it is declared.

---

### A) Static Local Variable (inside a function)

#### Meaning
A **static local variable** is accessible only within the function, but it **retains its value between function calls**.

#### Key properties
- **Scope:** Local to the function/block
- **Lifetime:** Entire program execution
- **Default initial value:** **0** (if not explicitly initialized)
- **Storage location:** Data segment (not stack)

#### Use cases
- Counting function calls
- Remembering previous state
- Caching results

#### Example
```c
void counter() {
    static int c;   // initialized to 0 once
    c++;
    printf("%d\n", c);
}
```

---

### B) Static Global Variable (file scope)

#### Meaning
A global variable declared `static` outside functions becomes **visible only within that same `.c` file** (internal linkage).

#### Key properties
- **Scope:** Only within the same file
- **Lifetime:** Entire program execution
- **Default initial value:** **0**

#### Use case
- Hiding internal implementation details (better modular programming)

---

### Practice Tasks (5)
1. Write a function `counter()` using a **static local** variable to count how many times it has been called. Call it 10 times and print the result each time.
2. Compare outputs of a normal local variable vs a static local variable across multiple calls to the same function.
3. Use a static local variable to remember previous values and generate a sequence (e.g., partial Fibonacci behavior across calls).
4. In two files, declare a **static global** in `file1.c` and try accessing it from `file2.c` using `extern`. Explain the error.
5. Create a `static` function (file-private) and try calling it from another file. Explain **internal linkage**.

---

## 4) Register Variables (`register`)

### Meaning
A `register` variable is a request to the compiler to store the variable in a CPU **register** for faster access.  
**Important:** It is only a **suggestion**—the compiler may ignore it.

### Key properties
- **Keyword:** `register`
- **Scope:** Local to the block/function (like automatic variables)
- **Lifetime:** Only while control remains in the block/function
- **Default initial value:** Garbage (if not initialized)

### Major restriction
- You **cannot take the address** of a register variable using `&`.
  - Example (invalid):
    ```c
    register int x = 5;
    printf("%p", &x); // error
    ```

### Use cases
- Loop counters
- Frequently used temporary variables  
(Modern compilers already optimize well, but concept is important for exams.)

### Practice Tasks (5)
1. Write a program to sum numbers from `1` to `N` using a normal loop variable, then using `register int`. Note observations (timing may be similar).
2. Declare a `register` variable and attempt to print its address using `&`. Record the compiler error and explain why it happens.
3. Use `register` for loop counters in nested loops (e.g., matrix sum) and justify why counters are candidates.
4. Write a function that scans an array and uses `register` variables for index and accumulator; explain the intention.
5. Research task: Write 5–6 lines on how modern compilers treat `register` (often ignored) and conclude when it matters.

---

## Quick Comparison Table (Exam-Friendly)

| Storage Class | Keyword | Scope | Lifetime | Default Value | Typical Location |
|---|---|---|---|---|---|
| Automatic | `auto` (default) | Block/function | Until block ends | Garbage | Stack |
| External | `extern` (declaration) | Global / multi-file | Whole program | 0 | Data segment |
| Static (local) | `static` | Local only | Whole program | 0 | Data segment |
| Static (global) | `static` | File only | Whole program | 0 | Data segment |
| Register | `register` | Block/function | Until block ends | Garbage | CPU register (if possible) |

---

### Extra Exam Tips (Short)
- **auto:** local + temporary (created/destroyed with block)
- **extern:** global + share across files (use `extern` declaration)
- **static local:** local scope but permanent lifetime (retains value)
- **static global:** file-private global (cannot be used in other files)
- **register:** faster access request; **no address** using `&`
---
---
# Recursion — (Definition, Algorithms, C Programs + Tasks)

## 1) Definition of Recursion

### What is Recursion?
**Recursion** is a programming technique in which a **function calls itself** (directly or indirectly) to solve a problem by breaking it into **smaller sub-problems** of the same type.

A recursive solution must include:
1. **Base case (termination condition):** stops recursion.
2. **Recursive case:** function calls itself with a smaller/simpler input.

### Why recursion is used
- Problems naturally expressed in smaller sub-problems (factorial, Fibonacci, tree traversal)
- Divide-and-conquer logic (many algorithms)
- Code can be shorter and conceptually clearer for some tasks

### Important concepts
- **Base case** prevents infinite recursion.
- **Recursive call** must reduce the input size (progress toward base case).
- Each call uses **stack memory** (activation record).
- Too many calls may cause **stack overflow**.
- Recursion often has extra overhead compared to iteration.

### General structure (template)
```c
return_type func(parameters) {
    if (base_condition) {
        return base_value;
    } else {
        return func(modified_parameters);  // recursive call
    }
}
```

---

### Practice Tasks (Recursion Basics) — 5
1. Write a recursive function to print numbers from `1` to `n` and another function to print from `n` to `1`. Explain how the order changes due to the position of the `printf`.
2. Write a recursive function to compute the **sum of digits** of an integer (e.g., 582 → 15). Identify base case and recursive case.
3. Write a recursive function to compute `a^b` (power) without using `pow()` (e.g., `power(2,5)=32`). Handle `b=0` correctly.
4. Trace the call stack for a recursive function (your choice) and write the sequence of calls/returns for input `n=4`.
5. Create a program that intentionally causes infinite recursion (no base case). Observe the crash/stack overflow and explain what happened (theory).

---

## 2) Recursion Function Algorithms

---

## A) Factorial (n!)

### Definition
Factorial of a non-negative integer `n` is:
- `n! = n × (n−1) × (n−2) × ... × 1`
- `0! = 1`

### Recursive idea
- **Base case:** `fact(0) = 1` (or `fact(1)=1`)
- **Recursive case:** `fact(n) = n * fact(n-1)` for `n >= 1`

### Algorithm (Steps)
1. Start  
2. Read `n`  
3. If `n < 0`, print error  
4. Else compute `fact(n)`:
   - If `n == 0` return `1`
   - Else return `n * fact(n-1)`
5. Print result  
6. Stop  

---

### C Program: Factorial using Recursion
```c
/* factorial_recursion.c */
#include <stdio.h>

long long factorial(int n) {
    if (n == 0) {              // base case
        return 1;
    }
    return (long long)n * factorial(n - 1);   // recursive case
}

int main(void) {
    int n;
    printf("Enter a non-negative integer: ");
    scanf("%d", &n);

    if (n < 0) {
        printf("Factorial is not defined for negative numbers.\n");
        return 0;
    }

    printf("%d! = %lld\n", n, factorial(n));
    return 0;
}
```

### Practice Tasks (Factorial Recursion) — 5
1. Write a program that calculates factorial using recursion and iteration, and compare outputs for values `0` to `10`.
2. Add input validation: if the user enters a negative number, ask again until a valid `n` is entered.
3. Modify the factorial program to print the **multiplication expression** as well (e.g., `5! = 5 x 4 x 3 x 2 x 1 = 120`).
4. Find the largest `n` for which factorial fits in:
   - (a) `int`
   - (b) `long long`  
   (Explain overflow and show results.)
5. Write a recursive function that returns factorial but also counts the number of times the function is called (using a `static` variable). Print the count.

---

## B) Fibonacci Sequence

### Definition
Fibonacci sequence:
`0, 1, 1, 2, 3, 5, 8, 13, ...`

Mathematically:
- `F(0) = 0`
- `F(1) = 1`
- `F(n) = F(n-1) + F(n-2)` for `n >= 2`

### Recursive idea
- **Base cases:** `fib(0)=0`, `fib(1)=1`
- **Recursive case:** `fib(n)=fib(n-1)+fib(n-2)`

### Algorithm (Steps) — to print first N terms
1. Start  
2. Read `N`  
3. For `i = 0` to `N-1`: print `fib(i)`  
4. Stop  

### Note (Important for theory)
Simple recursive Fibonacci repeats computations and is **slow** for large `n` (exponential time). Iteration or memoization is faster.

---

### C Program (i): Find nth Fibonacci number
```c
/* fibonacci_nth_recursion.c */
#include <stdio.h>

long long fib(int n) {
    if (n == 0) return 0;   // base case
    if (n == 1) return 1;   // base case
    return fib(n - 1) + fib(n - 2);  // recursive case
}

int main(void) {
    int n;
    printf("Enter n (>=0): ");
    scanf("%d", &n);

    if (n < 0) {
        printf("Invalid input.\n");
        return 0;
    }

    printf("F(%d) = %lld\n", n, fib(n));
    return 0;
}
```

### C Program (ii): Print first N Fibonacci terms
```c
/* fibonacci_first_n_terms_recursion.c */
#include <stdio.h>

long long fib(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fib(n - 1) + fib(n - 2);
}

int main(void) {
    int N, i;
    printf("Enter number of terms: ");
    scanf("%d", &N);

    if (N <= 0) {
        printf("Please enter a positive number of terms.\n");
        return 0;
    }

    printf("Fibonacci sequence (%d terms):\n", N);
    for (i = 0; i < N; i++) {
        printf("%lld ", fib(i));
    }
    printf("\n");
    return 0;
}
```

### Practice Tasks (Fibonacci Recursion) — 5
1. Print the first `N` Fibonacci terms using recursion and verify the output for `N=10`.
2. Count how many times `fib()` gets called for a given `n` (use a global/static counter). Test for `n=5`, `n=10`, `n=20` and write observations.
3. Write an iterative Fibonacci program and compare runtime/efficiency conceptually with recursive Fibonacci (write 5–6 lines).
4. Implement Fibonacci using recursion with **memoization** (array to store computed results) and compare the number of calls with simple recursion.
5. Modify the program to print Fibonacci numbers **up to a maximum value** (e.g., print terms until value exceeds 1000). Use recursion for generating terms.

---

## C) Tower of Hanoi

### Problem statement
Three pegs: **Source (S)**, **Auxiliary (A)**, **Destination (D)**.  
`n` disks are initially on S (smallest on top).

**Rules:**
1. Move only **one disk** at a time.
2. Never place a **larger disk** on a smaller disk.
3. Goal: move all disks from S to D using A.

### Recursive idea
To move `n` disks from S to D using A:
1. Move `n-1` disks from **S → A** using **D**
2. Move largest disk from **S → D**
3. Move `n-1` disks from **A → D** using **S**

### Base case
- If `n == 1`, move disk directly from S to D.

### Minimum number of moves
**Moves = 2^n − 1**

---

### C Program: Tower of Hanoi using Recursion
```c
/* tower_of_hanoi_recursion.c */
#include <stdio.h>

void hanoi(int n, char source, char auxiliary, char destination) {
    if (n == 1) {  // base case
        printf("Move disk 1 from %c to %c\n", source, destination);
        return;
    }

    hanoi(n - 1, source, destination, auxiliary);
    printf("Move disk %d from %c to %c\n", n, source, destination);
    hanoi(n - 1, auxiliary, source, destination);
}

int main(void) {
    int n;
    printf("Enter number of disks: ");
    scanf("%d", &n);

    if (n <= 0) {
        printf("Number of disks must be positive.\n");
        return 0;
    }

    printf("Steps to solve Tower of Hanoi for %d disks:\n", n);
    hanoi(n, 'S', 'A', 'D');
    return 0;
}
```
---

# 6. Line-by-Line Explanation of the Program

## Header File

```c
#include <stdio.h>
```

This header file allows us to use:

* `printf()` → display output
* `scanf()` → read user input

---

# 7. Hanoi Function

```
void hanoi(int n, char source, char auxiliary, char destination)
```

This function performs the **Tower of Hanoi solution**.

### Parameters

| Parameter   | Meaning         |
| ----------- | --------------- |
| n           | number of disks |
| source      | starting rod    |
| auxiliary   | helper rod      |
| destination | final rod       |

Example call:

```
hanoi(n, 'A', 'B', 'C')
```

Meaning:

```
Move n disks from A → C using B
```

---

# 8. Base Case (Stopping Condition)

```c
if(n == 1)
{
    printf("Move disk 1 from %c to %c\n", source, destination);
    return;
}
```

Explanation:

If there is **only one disk**, we simply move it from **source → destination**.

Example output:

```
Move disk 1 from A to C
```

This stops the recursion.

---

# 9. First Recursive Step

```c
hanoi(n-1, source, destination, auxiliary);
```

This step moves **n-1 disks** from **source → auxiliary**.

Example for `n = 3`:

```
Move 2 disks from A → B
```

This frees the **largest disk**.

---

# 10. Move the Largest Disk

```c
printf("Move disk %d from %c to %c\n", n, source, destination);
```

Now the **largest disk** can move from **source → destination**.

Example:

```
Move disk 3 from A to C
```

---

# 11. Second Recursive Step

```c
hanoi(n-1, auxiliary, source, destination);
```

Now move the **n-1 disks** from **auxiliary → destination**.

Example:

```
Move 2 disks from B → C
```

This completes the puzzle.

---

# 12. Main Function

```
int main()
```

Every C program starts execution from **main()**.

---

## Variable Declaration

```
int n;
```

`n` represents the **number of disks**.

---

## Taking Input

```
printf("Enter number of disks: ");
scanf("%d", &n);
```

User enters the number of disks.

Example:

```
Enter number of disks: 3
```

---

## Calling the Function

```
hanoi(n, 'A', 'B', 'C');
```

Meaning:

```
Move disks from rod A → rod C
Using rod B as helper
```

---

# 13. Example Execution (n = 3)

Call:

```
hanoi(3, A, B, C)
```

Steps:

```
Move disk 1 from A to C
Move disk 2 from A to B
Move disk 1 from C to B
Move disk 3 from A to C
Move disk 1 from B to A
Move disk 2 from B to C
Move disk 1 from A to C
```

Total moves:

```
7
```

---

# 14. Recursion Tree

```
hanoi(3)
 ├── hanoi(2)
 │    ├── hanoi(1)
 │    └── hanoi(1)
 └── hanoi(2)
      ├── hanoi(1)
      └── hanoi(1)
```

Each recursive call reduces the problem size until `n = 1`.

---

### Practice Tasks (Tower of Hanoi Recursion) — 5
1. Run the Tower of Hanoi program for `n=1`, `n=2`, `n=3` and write the exact sequence of moves for each case.
2. Modify the program to count the total number of moves and print it at the end. Verify it matches `2^n − 1`.
3. Add input validation: if `n > 20`, print a warning about too many steps and do not print moves (only print total moves).
4. Write a trace table (or write-up) showing recursive calls and returns for `n=3` (include parameters `source`, `auxiliary`, `destination` in each call).
5. Modify the program to accept custom peg names from the user (characters or strings) and print moves accordingly.

---

## Quick Revision (Very Short)
- **Recursion:** function calls itself.
- Must have **base case + recursive case**.
- **Factorial:** `fact(n)=n*fact(n-1)`, `fact(0)=1`.
- **Fibonacci:** `F(n)=F(n-1)+F(n-2)`, `F(0)=0`, `F(1)=1`.
- **Tower of Hanoi:** move `n-1`, move largest, move `n-1`; min moves = `2^n - 1`.