# Unit I: Introduction to Algorithms and C (8 Hours)

## Fundamentals of Algorithms

Imagine you're baking a cake. You don't just throw ingredients together randomly—you follow a recipe with clear steps: mix flour, add eggs, bake at 350°F for 30 minutes. That's basically what an **algorithm** is: a set of clear, step-by-step instructions to solve a problem. It's like a recipe for computers.

### What is the Notion (Idea) of an Algorithm?
- An algorithm is a finite (it ends eventually) sequence of well-defined steps to solve a problem.
- Key properties:
  - **Unambiguous**: Every step is crystal clear—no confusion.
  - **Finite**: It stops after a certain number of steps, not forever.
  - **Effective**: It actually works and gives the right output.
- Algorithms take **input** (like numbers or data), process it, and give **output** (the result).
- Example: Think of Google Maps finding the shortest route. Input: Your location and destination. Process: Calculate paths. Output: Directions.
- Why learn this? In programming, everything starts with algorithms. For exams, remember: Algorithms are problem-solving blueprints.

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
  - How: Top-down—start with main task, divide into sub-tasks.
  - Pros: Simple, efficient for small programs.
  - Cons: Hard to manage big projects.
  - Example: C language. Like a recipe book—follow steps.
  - Knowledge: Emphasizes "what to do" over data.

- **Object-Oriented Approach (OOP)**:
  - Focus: Real-world objects (like car: has color, speed; methods: drive, stop).
  - Key Concepts: Classes (blueprint), Objects (instance), Encapsulation (hide data), Inheritance (reuse code), Polymorphism (same method, different behaviors).
  - How: Bottom-up—build small objects, combine.
  - Pros: Reusable, easier for large software.
  - Cons: Steeper learning curve.
  - Example: C++, Java. Like Lego blocks—build complex from simple parts.

- **Event-Driven Approach**:
  - Focus: Respond to events (user clicks, timers).
  - How: Program waits for events, then runs code.
  - Pros: Great for apps with user interaction.
  - Cons: Can be unpredictable.
  - Example: GUI apps like Windows buttons, web (JavaScript). Like a phone—rings (event), you answer.

For exams: Compare them—procedural is function-based, OOP data-based, event-driven reaction-based.

## Structure of C

C is a general-purpose programming language created by Dennis Ritchie at the Bell Laboratories in 1972.

It is a very popular language, despite being old. The main reason for its popularity is because it is a fundamental language in the field of computer science.

C is strongly associated with UNIX, as it was developed to write the UNIX operating system.

- **Basic Structure**:
  - Every C program has sections:
    1. **Documentation**: Comments for notes.
    2. **Preprocessor Directives**: #include <stdio.h> (for input/output), #define PI 3.14 (constants).
    3. **Global Declarations**: Variables usable everywhere.
    4. **main() Function**: Where program starts. Has { } body with local vars and statements.
    5. **User-Defined Functions**: Extra helpers.
  - Example Full Program:
    ```c
    /* This is a comment: Hello World Program */
    #include <stdio.h>  // For printf

    int global_var = 10;  // Global

    int main() {
        int local_var = 5;  // Local to main
        printf("Hello, World! Global: %d, Local: %d\n", global_var, local_var);
        return 0;  // End successfully
    }
    ```

- **Use of Comments**:
  - Why? Explain code for others (or future you).
  - Single-line: // This is single.
  - Multi-line: /* This is
    multi-line. */
  - Comments are ignored by compiler—good for debugging.

- **Compilation of Program**:
  - Process: Write code → Preprocess (#includes) → Compile (to assembly) → Assemble (to object code) → Link (combine libraries) → Executable (.exe).
  - Why? C is compiled (not interpreted like Python)—faster but needs compiling.
  - Tool: gcc compiler. Command: gcc file.c -o output.

## Data Concepts

Data is the heart of programs—like ingredients in cooking.

- **Variables**: Named spots in memory to store changeable values. Like boxes labeled "age" holding 20.
  - Must declare first: Tell type and name.

- **Constants**: Fixed values that don't change. Like PI=3.14.
  - Ways: #define MAX 100 (preprocessor) or const int MAX=100;

- **Data Types**: Tell what kind of data (number, text).
  - **int**: Whole numbers (e.g., 10). Size: usually 4 bytes.
  - **float**: Decimal (e.g., 3.14f). Less precise.
  - **char**: Single character (e.g., 'A'). Or strings with arrays.
  - **double**: More precise decimal (e.g., 3.14159).
  - **void**: Nothing—used for functions returning no value or pointers.
  - Example: int age=20; float height=5.9;

- **Qualifiers**: Modify types.
  - **Size**: short (smaller, e.g., short int=2 bytes), long (bigger, e.g., long int=8 bytes).
  - **Signed/Unsigned**: Signed (can be negative, default), Unsigned (only positive, bigger range—e.g., unsigned int 0 to 4e9).
  - Example: unsigned short int small_positive=65535;

- **Declaring Variables**:
  - Syntax: type name; or type name=value;
  - Multiple: int a,b,c;
  - Why? Compiler allocates memory.

- **Scope of Variables According to Block**:
  - **Local**: Inside function or { } block—dies when block ends. Example: In main(), local to main.
  - **Global**: Outside functions—lives whole program, accessible anywhere.
  - **Block Scope**: In loops or ifs—limited to that {}.
  - Example: Global for shared data, local for temporary.
  - Knowledge: Avoid globals if possible—can cause bugs.

- **Hierarchy of Data Types**:
  - When mixing (e.g., int + float), lower promotes to higher.
  - Order: char < int < unsigned int < long < unsigned long < float < double < long double.
  - Example: int x=5; float y=2.5; x+y → float result (7.5).
  - Why? Prevents data loss.
