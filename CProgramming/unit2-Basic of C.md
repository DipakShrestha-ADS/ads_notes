## Unit II: Basics of C

### Unit Introduction
Unit II introduces the core building blocks of C programming, emphasizing how to perform operations on data, handle input and output, and control the flow of program execution. This unit is allocated 4 hours and forms the foundation for writing interactive and logical C programs. It covers operators for computations, expressions and statements for code structure, type conversions for data compatibility, I/O functions for user interaction, and control statements for decision-making and repetition. Mastering this unit allows students to create programs that process data values, read inputs in various formats, and execute code conditionally or repeatedly.

### Objectives
At the end of this unit, students should be able:
- To write various C programs to perform operations on data values using different types of operators.
- To input various types of data and obtain output in a desired form using formatted and character I/O functions.
- To alter the sequence of program execution using control statements.
- To set up loops to repeat a set of statements a desired number of times.
- To transfer control to different statements in the program using branching, looping, and jump statements.

### Detailed Topics

#### 1. Types of Operators
- Operators are symbols that instruct the compiler to perform specific mathematical, relational, or logical operations on variables or constants. 
- C categorizes operators based on their purpose, and they follow a precedence order (higher precedence evaluated first) and associativity (left-to-right or right-to-left). 
- Use parentheses `()` to override default precedence for clarity. 
- Below is a comprehensive table of operator types for easy reference.

| Operator Type                  | Symbols/Operators                          | Description                                                                 | Example in C                                                                 | Key Notes                                                                 |
|--------------------------------|--------------------------------------------|-----------------------------------------------------------------------------|------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| **Arithmetic Operators**      | `+` (addition)<br>`-` (subtraction)<br>`*` (multiplication)<br>`/` (division)<br>`%` (modulus) | Perform basic math on numbers. Modulus gives remainder.                    | `int a = 10, b = 3; int sum = a + b; // sum = 13`                           | Integer division truncates (10/3 = 3). High precedence for `*`, `/`, `%`. Can overflow. |
| **Relational Operators**      | `==` (equal)<br>`!=` (not equal)<br>`>` (greater)<br>`<` (less)<br>`>=` (greater or equal)<br>`<=` (less or equal) | Compare values, return 1 (true) or 0 (false). Used in conditions.          | `if (a > b) { printf("Greater"); } // Checks if 10 > 3`                     | Lower precedence than arithmetic. Common in if/while. Avoid confusing with assignment `=`. |
| **Logical Operators**         | `&&` (AND)<br>`\| \|` (OR)<br>`!` (NOT)   | Combine or invert conditions. AND true if both true; OR if any true.       | `if (a > 0 && b > 0) { printf("Both positive"); }`                          | Short-circuit: `&&` skips second if first false. Lowest precedence.       |
| **Compound Assignment Operators** | `+=`, `-=`, `*=`, `/=`, `%=`              | Shorthand for operation + assignment (e.g., `a += b` is `a = a + b`).     | `a += 5; // a becomes 15`                                                   | Improves readability. Right-to-left associativity.                        |
| **Increment/Decrement Operators** | `++` (increment)<br>`--` (decrement)      | Add/subtract 1. Prefix changes immediately; postfix after use.             | `int x = 5; printf("%d", x++); // Prints 5, x=6`                            | Highest precedence. Avoid multiple on same variable in one expression.    |
| **Conditional (Ternary) Operator** | `? :`                                     | Shorthand if-else: `condition ? true_expr : false_expr`.                   | `int max = (a > b) ? a : b; // max=10`                                       | Three operands. Right-to-left. Reduces code but can be less readable.     |
| **Bitwise Operators**         | `&` (AND)<br>`\|` (OR)<br>`^` (XOR)<br>`~` (NOT)<br>`<<` (left shift)<br>`>>` (right shift) | Manipulate bits. Shifts move bits left/right.                              | `int res = 5 & 3; // Binary 101 & 011 = 001 (1)`                            | Integers only. Useful for flags/masks. High precedence.                   |
| **Comma Operator**            | `,`                                        | Evaluates multiple expressions; returns last value.                        | `int z = (a=1, b=2, a+b); // z=3`                                           | Lowest precedence. Used in loops for multiple init/evals.                 |


**Bitwise Operators**: Operate on binary bits of integers for low-level manipulation (& AND, | OR, ^ XOR, ~ NOT, << left shift, >> right shift). Key points: Fast for hardware control, shifts multiply/divide by powers of 2. Why important? Used in embedded systems, graphics. Common mistake: Confusing with logical operators (&& vs &).

| Operator | Description | Example | Result (assuming a=5 (101), b=3 (011)) |
|----------|-------------|---------|----------------------------------------|
| &       | Bitwise AND: 1 if both bits 1 | a & b | 1 (001) |
| |       | Bitwise OR: 1 if any bit 1 | a | b | 7 (111) |
| ^       | Bitwise XOR: 1 if bits differ | a ^ b | 6 (110) |
| ~       | Bitwise NOT: Inverts bits | ~a | -6 (in 2's complement) |
| <<      | Left shift: Shifts bits left (multiply by 2^n) | a << 1 | 10 (1010) |
| >>      | Right shift: Shifts bits right (divide by 2^n) | a >> 1 | 2 (10) |

Example C Program Demonstrating Multiple Operators (with Line-by-Line Comments):
```c
#include <stdio.h>  // Include standard I/O library for printf function

int main() {  // Main function: Entry point of the program
    int a = 10, b = 3;  // Declare and initialize two integers
    
    // Arithmetic operators
    int sum = a + b;  // Addition: sum = 13
    int mod = a % b;  // Modulus: mod = 1
    
    // Relational and logical operators in condition
    if (a > b && sum > 10) {  // Checks if a > b (true) AND sum > 10 (true)
        printf("Conditions met: Sum = %d, Mod = %d\n", sum, mod);  // Prints if true
    }
    
    // Compound assignment
    a += b;  // a = a + b; a = 13
    
    // Increment and ternary
    int inc = ++a;  // Prefix increment: a=14, inc=14
    printf("Incremented: %d\n", (inc > 10) ? inc : 0);  // Ternary: Prints 14
    
    // Bitwise example
    int bit = a & b;  // Bitwise AND: 14 (1110) & 3 (0011) = 2 (0010)
    printf("Bitwise AND: %d\n", bit);  // Prints 2
    
    return 0;  // Exit program successfully
}
```
```c
#include <stdio.h>  // For output

int main() {  // Main
    int a = 5;  // 101 in binary
    int b = 3;  // 011 in binary
    
    int bit_and = a & b;  // AND: 101 & 011 = 001 (1)
    int bit_or = a | b;   // OR: 101 | 011 = 111 (7)
    int bit_xor = a ^ b;  // XOR: 101 ^ 011 = 110 (6)
    int bit_not = ~a;     // NOT: ~101 = ... (negative in signed int)
    int left_shift = a << 2;  // Left shift: 101 << 2 = 10100 (20)
    int right_shift = a >> 1; // Right shift: 101 >> 1 = 10 (2)
    
    int comma_result = (a=10, b=20, a + b);  // Comma: Set a=10, b=20, result=30 (last)
    
    printf("Bit AND: %d, OR: %d, XOR: %d, NOT: %d\n", bit_and, bit_or, bit_xor, bit_not);
    printf("Left Shift: %d, Right Shift: %d\n", left_shift, right_shift);
    printf("Comma result: %d\n", comma_result);  // Prints 30
    
    return 0;  // End
}
```

#### 2. Statements and Expressions
- **Statements**: Complete instructions that perform actions, ending with a semicolon (;). They include declarations (e.g., `int x;`), assignments (e.g., `x = 5;`), function calls (e.g., `printf("Hello");`), and control statements. Statements do not return values but execute operations.
- **Expressions**: Combinations of variables, constants, and operators that evaluate to a value (e.g., `a + b`). Every expression can be a statement if ended with ;, but statements are broader.

Example C Program (with Line-by-Line Comments):
```c
#include <stdio.h>  // Include for printf

int main() {  // Main function
    int x = 5;  // Declaration and assignment statement
    int y = x + 3;  // Expression (x + 3) evaluated and assigned
    
    printf("Expression result: %d\n", y * 2);  // Expression y * 2 in printf (evaluates to 16)
    
    if (y > x) {  // Control statement using relational expression
        printf("y is greater\n");  // Compound statement (block)
    }
    
    return 0;  // Return statement
}
```

#### 3. Type Conversions
- Type conversion changes data from one type to another to ensure compatibility in operations.
- It's crucial when mixing types in operations to avoid data loss or errors.

- **Automatic (Implicit) Conversion**: Done by compiler in mixed-type expressions. C automatically promotes smaller types to larger in expressions (e.g., int + float = float). Follows promotion: smaller types (e.g., char) to larger (e.g., int to float).
- **Explicit (Casting) Conversion**: Manual using `(type)` syntax. Useful for precision control. Useful for control, but can lose data.

Example C Program (with Line-by-Line Comments):
```c
#include <stdio.h>  // Include for printf

int main() {  // Main
    int num = 10;  // Integer
    float dec = 3.5;  // Float
    
    float result = num + dec;  // Implicit: num promoted to float, result=13.5
    printf("Implicit: %f\n", result);  // Prints 13.500000
    
    int cast = (int)dec;  // Explicit cast: Truncates to 3
    printf("Explicit: %d\n", cast);  // Prints 3
    
    return 0;  // End
}
```

#### 4. Data Input and Output Functions
I/O functions handle reading from input (keyboard) and writing to output (screen). They are from <stdio.h>. 
- **Formatted I/O**:
  - `printf()`: Outputs formatted data. Format specifiers: `%d` (int), `%f` (float), `%c` (char), `%s` (string).
  - `scanf()`: Inputs formatted data. Requires address `&` for variables.
- **Character I/O**:
  - Input: `getch()` (no echo/enter), `getche()` (echo, no enter), `getchar()` (enter needed), `getc(stdin)`, `gets()` (string, unsafe - use fgets instead).
  - Output: `putchar()` (char), `putc(stdout)`, `puts()` (string with newline).

### 3.1 Formatted I/O

Formatted I/O uses placeholders (%d for int, %f for float, etc.) for structured data.

#### 3.1.1 printf()

printf() outputs formatted data to screen. Syntax: printf("format", vars);. Supports flags like %10d for width.

#### 3.1.2 scanf()

scanf() reads formatted input from keyboard. Syntax: scanf("format", &vars);. & is address for storing.

### 3.2 Character I/O Format

Character I/O handles single chars or strings, often unformatted. From <stdio.h> or <conio.h> for getch/getche.

#### 3.2.1 getch()

Reads a char without echo (no display), no Enter needed. Good for passwords.

#### 3.2.2 getche()

Reads a char with echo (displays), no Enter.

#### 3.2.3 getchar()

Reads a char, requires Enter, from stdin.

#### 3.2.4 getc()

Reads a char from file/stream.

#### 3.2.5 gets()

Reads a string until Enter, unsafe (buffer overflow)—use fgets instead.

#### 3.2.6 putchar()

Outputs a single char.

#### 3.2.7 putc()

Outputs a char to file/stream.

#### 3.2.8 puts()

Outputs a string with newline.

Example C Program (with Line-by-Line Comments):
```c
#include <stdio.h>  // Include for I/O functions

int main() {  // Main
    int age;  // Declare integer
    printf("Enter age: ");  // Prompt user
    scanf("%d", &age);  // Formatted input: Read int into age
    
    char ch = getchar();  // Character input (after pressing enter)
    printf("Age: %d\n", age);  // Formatted output
    putchar(ch);  // Output single char
    
    return 0;  // End
}
```

#### 5. Iterations: Control Statements for Decision Making
Control statements alter program flow.
- **Branching**:
  - `if`: Executes if condition true. Syntax: `if (cond) { ... }`
  - `if-else`: Alternative for false. Nested for multiple conditions.
  - `switch`: Multi-case branching. Syntax: `switch(expr) { case val: ... break; default: ... }`
    ```c
    //Example: Grading system in Nepali schools—if marks >=80 A, else if >=60 B, etc.; switch for menu choices like food orders in a restaurant.
    #include <stdio.h>  // Output

    int main() {  // Main
        int marks = 75;  // Sample marks
        
        if (marks >= 80) {                // If: Check for A
            printf("Grade A\n");
        } else if (marks >= 60) {         // Else if: Check for B
            printf("Grade B\n");
        } else {                          // Else: Default
            printf("Grade C\n");
        }
        
        int choice = 2;                   // Menu choice
        switch (choice) {                 // Switch on choice
            case 1: printf("Momo\n"); break;  // Case 1
            case 2: printf("Chowmein\n"); break;  // Case 2
            default: printf("Tea\n");     // Default
        }
        
        return 0;  // End
    }
    ```
- **Looping**:
  - `while`: Condition checked before. Syntax: `while (cond) { ... }`
  - `do-while`: Executes at least once, condition after. Syntax: `do { ... } while (cond);`
  - `for`: Init, condition, increment in one. Syntax: `for (init; cond; incr) { ... }`
    ```c
    //Example : Counting prayer beads in a Nepali temple—while until 108; do-while to pray at least once; for to repeat exactly 10 times like rounds in a field.
    #include <stdio.h>  // For printf

    int main() {  // Start
        int count = 0;                    // Counter
        
        while (count < 3) {               // While: Check first, loop 3 times
            printf("While: %d\n", count);
            count++;
        }
        
        do {                              // Do-while: Execute first, then check
            printf("Do-while: %d\n", count);
            count++;
        } while (count < 5);              // Loops until 5
        
        for (int i = 0; i < 3; i++) {     // For: Init i=0, check i<3, update i++
            printf("For: %d\n", i);
        }
        
        return 0;  // End
    }
    ```
- **Jump Statements**:
  - `break`: Exits loop/switch.
  - `continue`: Skips rest of loop iteration.
  - `goto`: Jumps to label (avoid overuse for structured code).

    ```c
    //Example: In a queue at a Nepali bank—break to stop if counter closes; continue to skip if document missing; goto like jumping lines (bad practice).
    #include <stdio.h>  // Output

    int main() {  // Main
        for (int i = 0; i < 5; i++) {     // Loop 0 to 4
            if (i == 2) continue;         // Continue: Skip when i=2
            if (i == 4) break;            // Break: Exit when i=4
            printf("Loop: %d\n", i);      // Prints 0,1,3
        }
        
        goto label;                       // Goto: Jump to label
        printf("This is skipped\n");      // Skipped
    label:                                // Label here
        printf("After goto\n");           // Prints this
        
        return 0;  // End
    }
    ```

Overall Example C Program (with Line-by-Line Comments):
```c
#include <stdio.h>  // Include for I/O

int main() {  // Main
    int i = 1;  // Initialize
    
    // While loop
    while (i <= 3) {  // Check condition first
        printf("%d ", i);  // Print 1 2 3
        i++;  // Increment
    }
    printf("\n");
    
    // For loop with break
    for (int j = 1; j <= 5; j++) {  // Init j=1; cond j<=5; incr j++
        if (j == 4) break;  // Exit loop at 4
        printf("%d ", j);  // Prints 1 2 3
    }
    printf("\n");
    
    // Do-while with continue
    int k = 0;
    do {
        k++;
        if (k % 2 == 0) continue;  // Skip even
        printf("%d ", k);  // Prints odds: 1 3 5...
    } while (k < 5);
    
    // Switch example
    int choice = 2;
    switch (choice) {  // Multi-branch
        case 1: printf("One"); break;
        case 2: printf("Two"); break;  // Prints Two
        default: printf("Default");
    }
    
    return 0;  // End
}
```

# Tasks

1. Write a C program to demonstrate all arithmetic operators (+, -, *, /, %) with two integer variables and print the results.
2. Use relational and logical operators to check if a number entered by the user is positive and even, then display an appropriate message.
3. Implement a program using compound assignment operators (+=, -=, *=, /=) to update a variable in different ways and show the final value.
4. Demonstrate increment (++) and decrement (--) operators in both prefix and postfix forms with a loop that prints values from 1 to 10.
5. Write a C program using the conditional (ternary) operator to find the maximum of three integers entered by the user.
6. Create a program that uses bitwise operators (AND, OR, XOR, NOT, shifts) on two integers and displays the results in binary format using printf.
7. Write a C program to illustrate operator precedence by evaluating a complex expression involving arithmetic, relational, and logical operators without and with parentheses.
8. Demonstrate automatic and explicit type conversion by mixing int, float, and double in arithmetic operations and casting explicitly.
9. Use formatted I/O functions: read two integers and a float using scanf(), then print them with proper formatting (width, precision) using printf().
10. Write a program to read and display a single character using getchar() and putchar(), and a string using gets() and puts().
11. Implement a simple menu-driven program using switch statement to perform basic arithmetic operations based on user choice.
12. Write a C program using if-else ladder (else-if) to determine the grade of a student based on marks entered (A, B, C, D, F).
13. Create a program using while loop to calculate the sum of digits of a number entered by the user.
14. Demonstrate the difference between while and do-while loop by printing numbers from 1 to 5, and then trying with an initial false condition.
15. Write a for loop program to generate the multiplication table of a number, and use break, continue, and goto to skip multiples of 3 and exit early at 10.