# Unit I: Introduction To Algorithms and C (8 Hours)

C is a general-purpose programming language created by Dennis Ritchie at Bell Laboratories in 1972.  
It is a very popular language, despite being old. The main reason for its popularity is because it is a fundamental language in the field of computer science.  
C is strongly associated with UNIX, as it was developed to write the UNIX operating system.

### Fundamentals of Algorithms: Notion of an Algorithm
- An algorithm is a step-by-step procedure or a finite sequence of well-defined instructions designed to solve a specific problem or perform a computation, taking inputs and producing outputs.
- Key properties include: definiteness (each step is precisely stated), effectiveness (each step is basic and executable), finiteness (it terminates after a finite number of steps), input (zero or more well-defined inputs), and output (one or more results).
- Algorithms are language-independent and focus on logic, making them essential for problem-solving in computing.
- Benefits: They ensure efficiency, reusability, and correctness; allow analysis of time and space complexity (e.g., Big O notation); and serve as a blueprint for coding in any language.
- Real-world analogy: A recipe for baking a cake is an algorithm—ingredients (inputs), steps (process), baked cake (output).
- Importance in programming: Algorithms help break down complex problems into manageable steps, reduce errors, and optimize resource usage.

### Pseudo-code Conventions
Pseudo-code is like writing algorithms in plain English mixed with code-like words. It's not real code, but it helps plan before writing actual programs. It's "pseudo" because it's fake code—easy to read.

- **Assignment**: Use `←` or `=` to set a value. Example: `age ← 20` means "set age to 20".
- **Input**: `READ` or `INPUT` to get data from user. Example: `READ number`.
- **Output**: `PRINT` or `WRITE` to show results. Example: `PRINT "Hello"`.
- **Basic Control Structures** (these control the flow—like decisions or loops):
  - **Sequence**: Just do steps one after another.
  - **Selection**: Make decisions with `IF-THEN-ELSE`. Example: If it's raining, take an umbrella; else, go without.
  - **Repetition**: Loops like `WHILE` (repeat while condition is true), `FOR` (repeat a set number of times), or `REPEAT-UNTIL` (repeat until condition is met).

Why use pseudo-code? It's language-independent—you can convert it to C, Java, etc. For exams, practice writing pseudo-code for simple problems.

**Example Pseudo-code** (Calculate area of rectangle):
```
BEGIN
    INPUT length
    INPUT width
    area ← length * width
    PRINT "Area is", area
END
```

## Algorithmic Problems: Fundamental Algorithms with Examples

These are common problems you'll see in exams. I'll give the pseudo-code, explain how it works, and add a real C code example where relevant. Think of these as building blocks for bigger programs.

1. **Exchange (Swap) Values of Two Variables**
   - Why? Sometimes you need to switch values, like sorting numbers.
   - **With Temporary Variable** (easy way):
     - Pseudo-code:
       ```
       READ a, b  // Get two numbers
       temp ← a   // Store a's value in temp
       a ← b      // Now a gets b's value
       b ← temp   // b gets the original a's value from temp
       PRINT a, b // Show swapped values
       ```
     - Explanation: Temp is like a spare cup—if you want to swap tea and coffee in two cups, pour tea into spare, pour coffee into tea's cup, then spare into coffee's cup.
     - C Code Example:
       ```c
       #include <stdio.h>
       int main() {
           int a = 5, b = 10, temp;
           temp = a;
           a = b;
           b = temp;
           printf("Swapped: a=%d, b=%d\n", a, b);
           return 0;
       }
       ```
       Output: Swapped: a=10, b=5

   - **Without Temporary Variable** (using math—clever but can overflow for big numbers):
     - Pseudo-code:
       ```
       READ a, b
       a ← a + b  // a now holds sum
       b ← a - b  // b gets original a (sum - b = a)
       a ← a - b  // a gets original b (sum - a_original = b)
       PRINT a, b
       ```
     - Explanation: Like swapping without extra space—add them, subtract to isolate values.
     - C Code: Similar to above, but replace swaps with a=a+b; b=a-b; a=a-b;

2. **Counting Positive Numbers from a Set of Integers**
   - Why? Useful for data analysis, like counting passing students.
   - Pseudo-code:
     ```
     READ n     // How many numbers?
     count ← 0  // Start counter at 0
     FOR i = 1 to n
         READ num  // Get each number
         IF num > 0 THEN
             count ← count + 1  // Increment if positive
     PRINT count
     ```
   - Explanation: Loop through numbers, check if >0, add to count. Like counting sunny days in a week.
   - C Code Example:
     ```c
     #include <stdio.h>
     int main() {
         int n, num, count = 0;
         printf("Enter n: ");
         scanf("%d", &n);
         for(int i=1; i<=n; i++) {
             scanf("%d", &num);
             if(num > 0) count++;
         }
         printf("Positive count: %d\n", count);
         return 0;
     }
     ```

3. **Summation (Adding Up) a Set of Numbers**
   - Why? Basic math, like calculating total score.
   - Pseudo-code:
     ```
     READ n
     sum ← 0
     FOR i = 1 to n
         READ num
         sum ← sum + num
     PRINT sum
     ```
   - Explanation: Start sum at 0, add each number in a loop. Like adding groceries in a bill.
   - C Code: Similar to counting, but sum += num instead of count++.

4. **Reversing the Digits of an Integer**
   - Why? For fun or checks, like palindrome numbers.
   - Pseudo-code:
     ```
     READ num   // e.g., 123
     rev ← 0
     WHILE num > 0
         digit ← num MOD 10  // Get last digit (3)
         rev ← rev * 10 + digit  // Build reverse (0*10+3=3, then 3*10+2=32, etc.)
         num ← num / 10  // Remove last digit (123→12)
     PRINT rev  // 321
     ```
   - Explanation: Peel off last digit, add to reverse (shift left by *10), repeat. Like reading a number backwards.
   - C Code Example:
     ```c
     #include <stdio.h>
     int main() {
         int num = 123, rev = 0, digit;
         while(num > 0) {
             digit = num % 10;
             rev = rev * 10 + digit;
             num = num / 10;
         }
         printf("Reversed: %d\n", rev);
         return 0;
     }
     ```

5. **Find Smallest Positive Divisor of an Integer (Other Than 1)**
   - Why? To check if prime or find factors.
   - Pseudo-code:
     ```
     READ n  (n > 1)  // e.g., 15
     FOR i = 2 to n
         IF n MOD i == 0 THEN
             PRINT i  // Smallest divisor, e.g., 3 for 15
             EXIT loop
     ```
   - Explanation: Start from 2, check if divides evenly. If none till n, it's prime (but this finds the smallest).
   - If no divisor, n is prime. C Code: Use a for loop with if(n%i==0) break.

6. **Find GCD (Greatest Common Divisor) and LCM (Least Common Multiple)**
   - GCD: Largest number dividing both without remainder. LCM: Smallest multiple of both.
   - Why? Math problems, like simplifying fractions.
   - **GCD for Two Numbers** (Euclidean Algorithm—efficient!):
     - Pseudo-code:
       ```
       READ a, b  // e.g., 12, 18
       WHILE b ≠ 0
           temp ← b
           b ← a MOD b  // Remainder
           a ← temp
       PRINT a  // GCD=6
       LCM = (a_original * b_original) / GCD  // LCM=36
       ```
     - Explanation: Replace a with b, b with a%b, repeat till b=0. a is GCD. Like finding common factors quickly.
   - For Three Numbers: First find GCD of first two, then with third. Same for LCM.
   - C Code Example for GCD:
     ```c
     #include <stdio.h>
     int main() {
         int a=12, b=18, temp;
         while(b != 0) {
             temp = b;
             b = a % b;
             a = temp;
         }
         printf("GCD: %d\n", a);
         return 0;
     }
     ```

7. **Generating Prime Numbers**
   - Prime: Number >1 with no divisors other than 1 and itself (e.g., 2,3,5,7).
   - Why? Security (encryption), math.
   - Pseudo-code (Check if One Number is Prime):
     ```
     READ n  // e.g., 7
     IF n < 2 THEN
         PRINT "not prime"
     ELSE
         is_prime ← true
         FOR i = 2 to sqrt(n)  // Check up to square root for efficiency
             IF n MOD i == 0 THEN
                 is_prime ← false
                 EXIT
         IF is_prime THEN PRINT "prime" ELSE PRINT "not prime"
     ```
   - Explanation: Check divisors from 2 to sqrt(n)—if any, not prime. To generate many: Loop this for 1 to n.
   - Advanced: Sieve of Eratosthenes for multiples (mark multiples of primes as non-prime).
   - C Code: Use loop with sqrt from <math.h>.

## Different Approaches in Programming

Programming isn't one-size-fits-all. Different styles suit different needs. Think of them as ways to build a house.

- **Procedural Approach**:
  - Focus: Break problem into steps/procedures (functions).
  - Key Concepts:
    - Procedure/Function (step-by-step tasks)
    - Sequence (top-to-bottom execution)
    - Shared Data (global/state variables)
    - Modularity (split into functions)
    - Control Flow (loops, conditions)
    - Reusability (reuse functions)
  - How: Top-down—start with main task, divide into sub-tasks.
  - Pros: Simple, efficient for small programs.
  - Cons: Hard to manage big projects.
  - Example: C language. Like a recipe book—follow steps.

- **Object-Oriented Approach (OOP)**:
  - Focus: Real-world objects (like car: has color, speed; methods: drive, stop).
  - Key Concepts: 
    - Classes (blueprint)
    - Objects (instance)
    - Encapsulation (hide data)
    - Inheritance (reuse code)
    - Polymorphism (same method, different behaviors)
  - How: Bottom-up—build small objects, combine.
  - Pros: Reusable, easier for large software.
  - Cons: Steeper learning curve: Requires more effort and time to learn due to complexity.
  - Example: C++, Java. Like Lego blocks—build complex from simple parts.

- **Event-Driven Approach**:
  - Focus: Respond to events (user clicks, timers).
  - Key Concepts:
    - Event (action/change)
    - Producer (fires event)
    - Consumer (listens)
    - Handler (executes logic)
    - Async (non-blocking)
    - Loose Coupling (independent parts)
  - How: Program waits for events, then runs code.
  - Pros: Great for apps with user interaction.
  - Cons: Can be unpredictable.
  - Example: GUI apps like Windows buttons, web (JavaScript). Like a phone—rings (event), you answer.

For exams: Compare them—procedural is function-based, OOP data-based, event-driven reaction-based.

## 4. Structure of C

A C program has a clear structure.

### 4.1 Header and Body

- Header: #include directives
- Body: main() function with statements

### 4.2 Use of Comments

// for single line  
/* for multiple lines */  
Comments explain code – very important!

### 4.3 Compilation of Program

Steps: Write → Compile → Link → Execute  
Compiler (gcc) converts .c to executable.

**Simple C Program**:
```c
#include <stdio.h>          // Header

int main() {                // Body starts
    // This is a comment
    /* Multi-line
       comment */
    printf("Namaste Nepal!\n");  // Print message
    
    return 0;               // End successfully
}
```

## 5. Data Concepts

### 5.1 Variables

- Named memory locations to store changeable data; declared with type, e.g., int x;.
- Rules: Start with letter/underscore, no spaces/keywords; case-sensitive.

### 5.2 Constants
- Fixed values; literal (e.g., 5, "text") or defined (#define PI 3.14);
- Values that don't change. Use const or #define.

### 5.3 Data Types
    - int: Integer, 4 bytes, range ~ -2^31 to 2^31-1 (signed).
    - float: Single-precision floating-point, 4 bytes, range ~1.2E-38 to 3.4E+38, Precision upto ~6-7 digits.
    - char: Character, 1 byte, range -128 to 127 (signed) or ASCII values.
    - double: Double-precision float, 8 bytes, higher precision/range than float, Precision upto ~15-16 digits.
    - void: No value; used for functions returning nothing or generic pointers.
- Purpose: Determine memory allocation, operations allowed (e.g., int for counts, float for decimals).

| Data Type | Size (typical) | Range                          | Use Example              |
|-----------|----------------|--------------------------------|--------------------------|
| int       | 4 bytes        | -2^31 to 2^31-1                | Marks, count             |
| float     | 4 bytes        | ±3.4E-38 to ±3.4E+38            | Prices with decimal      |
| char      | 1 byte         | -128 to 127 or 0-255           | Letters, 'A', 'न'        |
| double    | 8 bytes        | Higher precision than float    | Scientific calculations  |
| void      | -              | No value                       | Functions returning nothing |

**Example**:
```c
int age = 18;
float price = 150.50;
char grade = 'A';
double pi = 3.1415926535;
```

## 6. Qualifiers

Qualifiers modify data types.

- Size Qualifiers:
    - short: Reduces size, e.g., short int (2 bytes, range -32768 to 32767).
    - long: Increases size, e.g., long int (4-8 bytes, larger range); long double (higher precision).

- Sign Qualifiers:
    - signed: Allows negative values (default for int, char).
    - unsigned: Only non-negative, doubles positive range, e.g., unsigned int (0 to 4E9).

- Memory and Range: Qualifiers modify base types; e.g., unsigned short int: 2 bytes, 0 to 65535.
- Usage: Choose based on data needs—unsigned for positive-only (e.g., ages), long for large numbers.

### 6.1 Short and Long Size Qualifiers

| Qualifier | Effect on int          | Effect on double       |
|-----------|------------------------|------------------------|
| short     | Smaller size (2 bytes) | -                      |
| long      | Larger size (4/8 bytes)| long double (more precision) |

### 6.2 Signed and Unsigned Qualifiers

signed: allows negative (default for int)  
unsigned: only positive, doubles positive range

| Type              | Range Example                  |
|-------------------|--------------------------------|
| signed int        | -2147483648 to 2147483647      |
| unsigned int      | 0 to 4294967295                |

**Example**:
```c
unsigned int population = 30000000;  // Nepal population (always positive)
short int temperature = -5;          // Cold in mountains
long double precise = 3.14159265358979;
```

## 7. Declaring Variables

Syntax: data_type variable_name;  
Can initialize: int x = 10;  
Multiple: int a, b, c = 0;

**Example**:
```c
int marks, total = 0;
float average;
char section = 'B';
```

## 8. Scope of the Variables According to Block

Scope = visibility of variable.

- Local: Inside {} block – only visible there
- Global: Outside all functions – visible everywhere
- Block: Limited to {} braces.

**Example**:
```c
#include <stdio.h>

int global = 100;           // Global scope

int main() {
    int local = 50;         // Local to main
    
    {
        int block_var = 20;  // Local to this block only
        printf("Inside block: %d\n", block_var);
    }
    
    // printf("%d", block_var);  // Error! Not visible here
    
    printf("Global: %d, Local: %d\n", global, local);
    
    return 0;
}
```

## 9. Hierarchy of Data Types

When mixing types in expressions, lower ones promote to higher (implicit conversion).

**Promotion Hierarchy** (low to high):
char → int → unsigned int → long → unsigned long → float → double → long double

**Example**: int + float → result is float

This prevents data loss during operations.

Now you have a strong foundation in algorithms and C basics – practice these examples daily to become confident!

# Tasks

1. Write a pseudo-code to exchange the values of two variables using a temporary variable and then without using any temporary variable.
2. Develop an algorithm and pseudo-code to count the number of positive numbers among 10 integers entered by the user.
3. Write a C program to compute the summation of a set of numbers stored in an array of size 8.
4. Create an algorithm to reverse the digits of a given positive integer (e.g., 1234 becomes 4321) and implement it in C.
5. Write a C program to find the smallest positive divisor (other than 1) of a given integer.
6. Implement Euclid's algorithm in C to find the G.C.D. and L.C.M. of two positive integers, and extend it to three integers.
7. Write a C program using the Sieve of Eratosthenes to generate all prime numbers up to a given number n.
8. Write a simple C program that demonstrates the basic structure: inclusion of header (#include <stdio.h>), main function, use of comments, and print a message. Explain the compilation steps.
9. Declare variables of different basic data types (int, float, char, double) in C and print their sizes using sizeof operator.
10. Write a C program to demonstrate the use of short and long qualifiers with int and double data types, and display their values and sizes.
11. Create a program using signed and unsigned qualifiers for int and char, and show how unsigned types handle negative values.
12. Write a C program with nested blocks to illustrate the scope of variables (local to block) and how a variable in an inner block shadows an outer one.
13. Demonstrate the hierarchy of data types by writing a C program that performs arithmetic operations involving int, float, and double, and observe automatic type promotion.
14. Write a complete C program that combines an algorithmic problem (e.g., finding G.C.D.) with proper variable declaration, constants (using #define), and single-line/multi-line comments.
15. Compare the procedural approach of C with a brief description (in comments of a C program) of how the same task (e.g., swapping values) would differ in Object-Oriented and Event-Driven approaches.