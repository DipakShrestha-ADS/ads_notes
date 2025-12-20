# Unit II: Basics of C (4 Hours)

C is a general-purpose programming language created by Dennis Ritchie at Bell Laboratories in 1972.  
It is a very popular language, despite being old. The main reason for its popularity is because it is a fundamental language in the field of computer science.  
C is strongly associated with UNIX, as it was developed to write the UNIX operating system.

This unit explores the essential basics of C programming in depth, tailored for Nepali students like you—who might be studying in schools or colleges in places like Kathmandu, Pokhara, or Biratnagar. We'll break down each topic into simple, easy-to-understand words, as if explaining to a friend over a cup of chiya (tea). Imagine C as the basic tools for building a house in a Nepali village: operators are like hammers and nails for joining parts, type conversions are like adjusting materials to fit, input/output functions are like talking to workers, and control statements are like deciding the plan and repeating tasks. Each section includes a detailed explanation (what it is, why it's important, how it works, common mistakes to avoid), a real-world scenario from everyday Nepali life, and a complete code example with line-by-line comments. Where appropriate, like for listing operators, we'll use tables for clear, organized descriptions. Practice these examples by compiling and running them on a C compiler like GCC or Turbo C—it's like practicing driving a scooter before hitting the busy roads of Nepal.

## 1. Types of Operators

Operators in C are special symbols or keywords that perform specific operations on data (operands), such as calculations, comparisons, or manipulations. They are the "action heroes" of your code, making it efficient and powerful. Without operators, C would be like a toolbox without tools—you couldn't add numbers or check conditions. Operators can be unary (one operand, like ++x), binary (two operands, like x + y), or ternary (three operands). C evaluates expressions involving operators from left to right, but follows a strict precedence (priority) order—higher precedence operators are done first. Always use parentheses () to override precedence and avoid confusion. Misusing operators can lead to bugs, like confusing = (assignment) with == (comparison). Operators turn simple variables into dynamic expressions, which are building blocks for statements (complete instructions ending with ;).

### 1.1 Arithmetic Operators

Arithmetic operators perform mathematical calculations on numbers (integers, floats, etc.). They are fundamental for any computation-heavy program, like financial apps or games. Key points: Integer division truncates decimals (e.g., 5/2 = 2), modulus (%) gives remainder but only for integers, and operations can cause overflow if results exceed data type limits (use larger types like long). Why important? They handle real-life math efficiently. Common mistake: Forgetting that / on integers loses fractions—cast to float if needed.

| Operator | Description | Example | Result (assuming a=10, b=3) |
|----------|-------------|---------|-----------------------------|
| +       | Addition: Adds two operands | a + b | 13 |
| -       | Subtraction: Subtracts second from first | a - b | 7 |
| *       | Multiplication: Multiplies two operands | a * b | 30 |
| /       | Division: Divides first by second | a / b | 3 (integer division) |
| %       | Modulus: Remainder of division | a % b | 1 |

**Real-world scenario**: In a small grocery shop in a Nepali bazaar (like Asan in Kathmandu), calculating the total bill for rice and dal, applying a 5% discount, and finding the change from a 1000-rupee note. This mimics daily transactions where quick math is needed.

```c
#include <stdio.h>  // Includes standard input/output library for printf function

int main() {  // Main function: Entry point of the program
    int rice_price = 100;     // Price per kg of rice in Nepali rupees
    int dal_price = 150;      // Price per kg of dal
    int kg_rice = 5;          // Quantity of rice bought
    int kg_dal = 2;           // Quantity of dal bought
    
    int subtotal_rice = rice_price * kg_rice;  // Multiplication: 100 * 5 = 500
    int subtotal_dal = dal_price * kg_dal;     // Multiplication: 150 * 2 = 300
    int total = subtotal_rice + subtotal_dal;  // Addition: 500 + 300 = 800
    int discount = total / 20;                 // Division for 5% discount (800 / 20 = 40, since 5% = 1/20)
    int final_bill = total - discount;         // Subtraction: 800 - 40 = 760
    int payment = 1000;                        // Amount paid by customer
    int change = payment - final_bill;         // Subtraction: 1000 - 760 = 240
    int extra_notes = change % 100;            // Modulus: Remainder after giving 100-rupee notes (240 % 100 = 40)
    
    printf("Total before discount: %d rupees\n", total);      // Prints total: 800
    printf("Discount applied: %d rupees\n", discount);        // Prints discount: 40
    printf("Final bill: %d rupees\n", final_bill);            // Prints final: 760
    printf("Change given: %d rupees (remainder %d)\n", change, extra_notes);  // Prints change and remainder
    
    return 0;  // Returns 0 to indicate successful program execution
}
```

### 1.2 Relational Operators

Relational operators compare two values and return a boolean result (1 for true, 0 for false in C). They are vital for decision-making in code, like in if-statements or loops. Key points: They don't change values, just compare; work with numbers, chars (via ASCII), but not strings directly. Precedence is lower than arithmetic, so mix carefully. Why important? They enable conditional logic, like filtering data. Common mistake: Using = instead of ==, which assigns instead of comparing.

| Operator | Description | Example | Result (assuming a=10, b=3) |
|----------|-------------|---------|-----------------------------|
| ==      | Equal to: Checks if equal | a == b | 0 (false) |
| !=      | Not equal to: Checks if different | a != b | 1 (true) |
| >       | Greater than: Checks if first is larger | a > b | 1 (true) |
| <       | Less than: Checks if first is smaller | a < b | 0 (false) |
| >=      | Greater than or equal: Checks if first is larger or same | a >= b | 1 (true) |
| <=      | Less than or equal: Checks if first is smaller or same | a <= b | 0 (false) |

**Real-world scenario**: During SLC/SEE exams in Nepal, comparing a student's marks to the pass threshold (40) to determine if they passed, or if their score is higher than a friend's for bragging rights. This is like teachers grading papers.

```c
#include <stdio.h>  // For printf to display output

int main() {  // Program starts here
    int my_marks = 65;        // Your exam marks
    int friend_marks = 50;    // Friend's marks
    int pass_threshold = 40;  // Minimum to pass
    
    if (my_marks > pass_threshold) {  // Greater than: 65 > 40? True – prints message
        printf("You passed the exam!\n");
    }
    if (my_marks >= 60) {             // Greater than or equal: 65 >= 60? True – first division
        printf("First division! Great job.\n");
    }
    if (my_marks != friend_marks) {   // Not equal: 65 != 50? True – different scores
        printf("Your marks are different from your friend's.\n");
    }
    if (friend_marks < pass_threshold) {  // Less than: 50 < 40? False – no print
        printf("Friend needs to study more.\n");
    }
    if (my_marks <= 100) {            // Less than or equal: 65 <= 100? True – valid score
        printf("Marks are within range.\n");
    }
    if (my_marks == 100) {            // Equal to: 65 == 100? False – no print
        printf("Perfect score!\n");
    }
    
    return 0;  // End program
}
```

### 1.3 Logical Operators

Logical operators combine or invert boolean expressions (from relational operators). They support short-circuit evaluation: && skips second if first is false; || skips if first is true—efficient for performance. Key points: Precedence: ! > && > ||. Use for complex conditions. Why important? They allow multi-condition checks, like in user login (username correct && password matches). Common mistake: Forgetting short-circuit can cause side effects if second expression has actions.

| Operator | Description | Example | Result (assuming a=1 (true), b=0 (false)) |
|----------|-------------|---------|-------------------------------------------|
| &&      | Logical AND: True if both are true | a && b | 0 (false) |
| ||      | Logical OR: True if at least one is true | a || b | 1 (true) |
| !       | Logical NOT: Inverts true/false | !a | 0 (false) |

**Real-world scenario**: Planning a trip to Chitwan National Park from Nepal—go only if it's holiday && weather is good, or if you have a car || a bus ticket. This mirrors decision-making in daily life.

```c
#include <stdio.h>  // For output functions

int main() {  // Main entry
    int is_holiday = 1;       // 1=true, it's a public holiday like Dashain
    int is_good_weather = 0;  // 0=false, it's raining
    int has_transport = 1;    // 1=true, you have a bus ticket
    
    if (is_holiday && is_good_weather) {  // AND: 1 && 0 = 0 (false) – skip print
        printf("Perfect time for the trip!\n");
    }
    if (is_holiday || has_transport) {    // OR: 1 || 1 = 1 (true) – print
        printf("You can still go somehow.\n");
    }
    if (!is_good_weather) {               // NOT: !0 = 1 (true) – print
        printf("Weather is bad, stay safe.\n");
    }
    
    return 0;  // Exit
}
```

### 1.4 Compound Assignment Operators

Compound assignment operators combine an arithmetic operation with assignment (=), making code shorter and readable. They are like shortcuts: x += 5 is x = x + 5. Key points: Evaluated right to left, useful in loops. Why important? Reduces typing errors, improves efficiency in large codes. Common mistake: Using on non-variables (e.g., 5 += x is invalid).

| Operator | Description | Example | Equivalent | Result (assuming x=10) |
|----------|-------------|---------|------------|------------------------|
| +=      | Add and assign | x += 3 | x = x + 3 | 13 |
| -=      | Subtract and assign | x -= 3 | x = x - 3 | 7 |
| *=      | Multiply and assign | x *= 3 | x = x * 3 | 30 |
| /=      | Divide and assign | x /= 3 | x = x / 3 | 3 |
| %=      | Modulus and assign | x %= 3 | x = x % 3 | 1 |

**Real-world scenario**: Managing daily earnings in a tea shop in Thamel, Kathmandu—adding sales, subtracting costs, multiplying for bulk, to update total profit quickly.

```c
#include <stdio.h>  // For printf

int main() {  // Start
    int total_profit = 2000;  // Initial profit in rupees
    
    total_profit += 500;      // Add today's sales: 2000 + 500 = 2500
    total_profit -= 200;      // Subtract costs: 2500 - 200 = 2300
    total_profit *= 2;        // Double for partnership: 2300 * 2 = 4600 (example)
    total_profit /= 4;        // Divide among workers: 4600 / 4 = 1150
    total_profit %= 1000;     // Remainder after withdrawing 1000s: 1150 % 1000 = 150
    
    printf("Final profit: %d rupees\n", total_profit);  // Prints 150
    
    return 0;  // End
}
```

### 1.5 Increment and Decrement Operators

Increment (++) adds 1, decrement (--) subtracts 1. Prefix (++x) changes before use; postfix (x++) after. Key points: Unary, high precedence. Why important? Ideal for counters in loops. Common mistake: Misunderstanding postfix in expressions (e.g., y = x++ uses old x).

| Operator | Description | Example | Result (assuming x=5) |
|----------|-------------|---------|-----------------------|
| ++ (prefix) | Increment before use | ++x | x=6, result=6 |
| ++ (postfix) | Increment after use | x++ | result=5, x=6 |
| -- (prefix) | Decrement before use | --x | x=4, result=4 |
| -- (postfix) | Decrement after use | x-- | result=5, x=4 |

**Real-world scenario**: Counting vehicles at a traffic chowk in Nepal during rush hour—increasing count as each bus passes, decreasing when one leaves.

```c
#include <stdio.h>  // Output library

int main() {  // Main
    int bus_count = 0;  // Initial count
    
    bus_count++;        // Postfix: Use 0, then increment to 1
    ++bus_count;        // Prefix: Increment to 2, then use 2
    int temp = bus_count++;  // Postfix: temp=2, bus_count=3
    bus_count--;        // Postfix: Use 3, then decrement to 2
    --bus_count;        // Prefix: Decrement to 1, use 1
    
    printf("Final bus count: %d, Temp: %d\n", bus_count, temp);  // Prints 1 and 2
    
    return 0;  // End
}
```

### 1.6 Conditional or Ternary Operator

The ternary operator (?:) is a shorthand for if-else, with format: condition ? true_expression : false_expression. It's the only ternary operator in C. Key points: Evaluates only one expression based on condition, efficient. Why important? Makes code concise for simple decisions. Common mistake: Nesting too many—use if-else for complexity.

**Real-world scenario**: Calculating taxi fare in Nepal—if distance > 5km, full rate; else, minimum— like deciding charges based on trip length.

```c
#include <stdio.h>  // For printf

int main() {  // Start
    int distance = 3;             // Trip distance in km
    int fare = (distance > 5) ? (distance * 20) : 100;  // Ternary: If >5, 20 per km; else flat 100
    
    printf("Taxi fare: %d rupees\n", fare);  // Prints 100 (since 3 <=5)
    
    return 0;  // End
}
```

### 1.7 Bitwise and Comma Operators

**Bitwise Operators**: Operate on binary bits of integers for low-level manipulation (& AND, | OR, ^ XOR, ~ NOT, << left shift, >> right shift). Key points: Fast for hardware control, shifts multiply/divide by powers of 2. Why important? Used in embedded systems, graphics. Common mistake: Confusing with logical operators (&& vs &).

| Operator | Description | Example | Result (assuming a=5 (101), b=3 (011)) |
|----------|-------------|---------|----------------------------------------|
| &       | Bitwise AND: 1 if both bits 1 | a & b | 1 (001) |
| |       | Bitwise OR: 1 if any bit 1 | a | b | 7 (111) |
| ^       | Bitwise XOR: 1 if bits differ | a ^ b | 6 (110) |
| ~       | Bitwise NOT: Inverts bits | ~a | -6 (in 2's complement) |
| <<      | Left shift: Shifts bits left (multiply by 2^n) | a << 1 | 10 (1010) |
| >>      | Right shift: Shifts bits right (divide by 2^n) | a >> 1 | 2 (10) |

**Comma Operator (,)**: Evaluates multiple expressions left to right, returns the last one's value. Key points: Lowest precedence, used in for loops or initializations. Why important? Groups statements. Common mistake: Overusing—keep code readable.

**Real-world scenario**: For bitwise—in a Diwali/Tihar light setup in Nepal, flipping bits to control which lights are on (like LED patterns). For comma—preparing ingredients for momo: chop onions, mix meat, then cook (multiple steps, focus on last).

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

### 1.8 Precedence and Order of Evaluation

Precedence defines the order operators are evaluated—higher first (e.g., * > +). Order of evaluation is left-to-right for same precedence, but undefined for some (like function args). Key points: Use () for clarity. Why important? Prevents wrong calculations (e.g., 2+3*4=14, not 20). Common mistake: Assuming left-to-right always—use parentheses.

Table of key precedences (higher to lower):  
| Level | Operators | Associativity |
|-------|-----------|---------------|
| High | ++ -- ! ~ (unary) | Right-to-left |
| | * / % | Left-to-right |
| | + - | Left-to-right |
| | << >> | Left-to-right |
| | < <= > >= | Left-to-right |
| | == != | Left-to-right |
| | & | Left-to-right |
| | ^ | Left-to-right |
| | | | Left-to-right |
| | && | Left-to-right |
| | || | Left-to-right |
| Low | ?: , = += etc. | Right-to-left |

**Real-world scenario**: Calculating area of a field in Nepal: length + width * height—precedence ensures multiplication first, like prioritizing urgent tasks in farming.

```c
#include <stdio.h>  // Output

int main() {  // Start
    int result1 = 2 + 3 * 4;          // * first: 3*4=12, then +2=14
    int result2 = (2 + 3) * 4;        // () overrides: 5*4=20
    int a = 5, b = 10;                
    int result3 = a > 0 && b++ > 10;  // && short-circuits, b not incremented
    int result4 = a , b , a + b;      // Comma: evaluates all, result=15
    
    printf("Result1: %d (precedence * > +)\n", result1);
    printf("Result2: %d (with parentheses)\n", result2);
    printf("Result3: %d (short-circuit)\n", result3);
    printf("Result4: %d (comma)\n", result4);
    
    return 0;  // End
}
```

### 1.9 Statements and Expressions

An expression is any valid combination of variables, constants, and operators that evaluates to a value (e.g., a + b, 5 > 3). A statement is a complete unit of execution, often ending with ; (e.g., c = a + b;). Key points: Expressions can be part of statements; compound statements {} group multiple. Why important? Statements are the "sentences" of code; expressions the "phrases." Common mistake: Forgetting ;—causes syntax errors.

**Real-world scenario**: In a recipe for sel roti during festivals in Nepal—expression like "flour + water" calculates mix; statement like "mix = flour + water;" completes the step.

```c
#include <stdio.h>  // For printf

int main() {  // Main (a compound statement)
    int a = 10;               // Declaration statement
    int b = 20;               // Another declaration
    int sum = a + b;          // Assignment statement with expression a + b
    if (sum > 25) {           // Control statement with expression sum > 25
        printf("Sum is large: %d\n", sum);  // Output statement
    }
    int expr = (a * 2) + (b / 2);  // Complex expression in assignment
    
    printf("Expression result: %d\n", expr);  // Prints 30
    
    return 0;  // Return statement
}
```

## 2. Type Conversions

Type conversion changes data from one type to another (e.g., int to float). It's crucial when mixing types in operations to avoid data loss or errors. C handles it automatically or manually. Why important? Ensures compatibility in calculations. Common mistake: Losing precision in narrowing conversions (float to int truncates decimals).

### 2.1 Automatic and Explicit Type Conversion

**Automatic (Implicit) Conversion**: C automatically promotes smaller types to larger in expressions (e.g., int + float = float). Rules: char/short to int, int to long/float as needed. No coder intervention.

**Explicit (Casting)**: Force conversion using (type) before value, e.g., (int)3.7 = 3. Useful for control, but can lose data.

| Type | Description | Example |
|------|-------------|---------|
| Automatic | C does it: Smaller to larger (promotion) | int x=5; float y=2.5; float z = x + y; (z=7.5) |
| Explicit | Coder forces: (type)value | float p=3.7; int q = (int)p; (q=3) |

**Real-world scenario**: Weighing fruits in a Nepali market—automatic: adding kg (int) to grams (float) promotes to float; explicit: forcing total to whole kg by casting, like rounding for billing.

```c
#include <stdio.h>  // For output

int main() {  // Start
    int kg = 5;               // Integer kg
    float grams = 0.75;       // Float grams
    float total_weight = kg + grams;  // Automatic: int promoted to float, total=5.75
    
    int rounded_kg = (int)total_weight;  // Explicit cast: 5.75 to int=5 (truncates)
    
    printf("Total weight (auto): %.2f kg\n", total_weight);  // Prints 5.75
    printf("Rounded (explicit): %d kg\n", rounded_kg);       // Prints 5
    
    return 0;  // End
}
```

## 3. Data Input and Output Function

Input/Output (I/O) functions handle data exchange with users—input reads from keyboard, output displays on screen. They are from <stdio.h>. Why important? Programs need interaction; without I/O, code is silent. Common mistake: Wrong format specifiers (e.g., %d for float causes garbage).

### 3.1 Formatted I/O

Formatted I/O uses placeholders (%d for int, %f for float, etc.) for structured data.

#### 3.1.1 printf()

printf() outputs formatted data to screen. Syntax: printf("format", vars);. Supports flags like %10d for width.

#### 3.1.2 scanf()

scanf() reads formatted input from keyboard. Syntax: scanf("format", &vars);. & is address for storing.

**Real-world scenario**: In a bus ticket counter in Nepal, printf() displays fare; scanf() takes passenger count—like asking and telling prices.

```c
#include <stdio.h>  // Includes printf and scanf

int main() {  // Main
    int passengers;                   // Variable for input
    printf("Enter number of passengers: ");  // Prompt with printf (no newline)
    scanf("%d", &passengers);         // Read int input, store at &passengers
    
    float fare = 50.5;                // Sample fare
    printf("Total fare for %d passengers: %.2f rupees\n", passengers, passengers * fare);  // Formatted output
    
    return 0;  // End
}
```

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

**Real-world scenario**: In a simple ATM in Nepal, getch() for hidden PIN; puts() to display welcome—like secure input in banking.

```c
#include <stdio.h>   // For getchar, putchar, gets, puts
#include <conio.h>   // For getch, getche (non-standard, for Windows)

int main() {  // Start
    char ch1 = getch();       // Read char, no echo, no Enter
    char ch2 = getche();      // Read char, with echo, no Enter
    char ch3 = getchar();     // Read char, requires Enter
    char str[20];             // Array for string
    gets(str);                // Read string until Enter (unsafe)
    
    putchar(ch1);             // Output ch1
    putc(ch2, stdout);        // Output ch2 to screen
    puts(str);                // Output string with newline
    
    return 0;  // End
}
```

## 4. Iterations: Control Statements for Decision Making

Control statements manage program flow—decide paths (branching), repeat actions (looping), or jump (jumps). They make code dynamic. Why important? Without them, programs run linearly—boring! Common mistake: Infinite loops (forget update).

### 4.1 Control Statements for Decision Making

#### 4.1.1 Branching

Branching chooses code paths based on conditions.

##### 4.1.1.1 if Statement

Executes block if condition true. Syntax: if (cond) { ... }

##### 4.1.1.2 else.. if Statement

Chains if-else for multiple conditions. else if for alternatives.

##### 4.1.1.3 switch Statement

Multi-way branch based on value. Syntax: switch(var) { case val: ... break; default: ... }

**Real-world scenario**: Grading system in Nepali schools—if marks >=80 A, else if >=60 B, etc.; switch for menu choices like food orders in a restaurant.

```c
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

#### 4.1.2 Looping

Looping repeats code.

##### 4.1.2.1 while Loop

Repeats while condition true. Checks before execution (entry-controlled).

##### 4.1.2.2 do… while

Repeats at least once, checks after (exit-controlled).

##### 4.1.2.3 for Loop

Compact: for(init; cond; update) { ... }. Good for counted loops.

**Real-world scenario**: Counting prayer beads in a Nepali temple—while until 108; do-while to pray at least once; for to repeat exactly 10 times like rounds in a field.

```c
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

#### 4.1.3 Jump Statements

Jumps alter normal flow.

##### 4.1.3.1 break

Exits loop or switch early.

##### 4.1.3.2 continue

Skips rest of loop body, goes to next iteration.

##### 4.1.3.3 goto

Jumps to labeled statement. Avoid—makes code spaghetti!

**Real-world scenario**: In a queue at a Nepali bank—break to stop if counter closes; continue to skip if document missing; goto like jumping lines (bad practice).

```c
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