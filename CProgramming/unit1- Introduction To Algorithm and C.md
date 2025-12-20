# Unit I: Introduction To Algorithms and C (8 Hours)

C is a general-purpose programming language created by Dennis Ritchie at Bell Laboratories in 1972.  
It is a very popular language, despite being old. The main reason for its popularity is because it is a fundamental language in the field of computer science.  
C is strongly associated with UNIX, as it was developed to write the UNIX operating system.

## 1. Fundamentals of Algorithms

An algorithm is a step-by-step procedure to solve a problem, like a recipe for making delicious Nepali momos. It must be clear, finite, and effective.

### 1.1 Notion (Idea) of an Algorithm

An algorithm is a finite sequence of well-defined instructions to solve a specific problem. It takes input, processes it, and produces output. Good algorithms are correct, efficient, and easy to understand.

**Characteristics**:
- Clear and unambiguous
- Well-defined inputs and outputs
- Finite steps (must end)
- Effective (each step doable)

**Real-world scenario**: Finding the way from your home in Lalitpur to Tribhuvan Airport – step-by-step directions (algorithm) ensure you reach on time.

### 1.2 Pseudo-code Conventions

Pseudo-code is a simple way to write algorithms in English-like language, without strict syntax. It uses assignment (← or =), input/output, and control structures (if, while, for).

Common conventions:
- Assignment: variable ← value
- Input: READ or INPUT variable
- Output: PRINT or DISPLAY
- Basic controls: IF-THEN-ELSE, WHILE, REPEAT-UNTIL, FOR

**Real-world scenario**: Recipe for dal bhat – pseudo-code helps anyone cook it correctly.

**Example Pseudo-code** (Calculate area of rectangle):
```
BEGIN
    INPUT length
    INPUT width
    area ← length * width
    PRINT "Area is", area
END
```

## 2. Algorithmic Problems

Now we develop simple algorithms for common problems. These build logical thinking.

### 2.1 Exchange the Values of Two Variables

#### With Temporary Variable
Use a third variable to hold one value temporarily.

**Real-world scenario**: Swapping two cups of tea without spilling – use an empty cup (temp).

**Pseudo-code**:
```
BEGIN
    INPUT a, b
    temp ← a
    a ← b
    b ← temp
    PRINT a, b
END
```

#### Without Temporary Variable
Use arithmetic operations.

**Pseudo-code**:
```
BEGIN
    INPUT a, b
    a ← a + b
    b ← a - b
    a ← a - b
    PRINT a, b
END
```

**C Code Example** (both methods):
```c
#include <stdio.h>

int main() {
    int a = 10, b = 20;        // Initial values like two cups
    
    printf("Before swap: a=%d, b=%d\n", a, b);
    
    // Method 1: With temp
    int temp = a;              // temp holds a (10)
    a = b;                     // a gets b (20)
    b = temp;                  // b gets old a (10)
    
    printf("After swap with temp: a=%d, b=%d\n", a, b);
    
    // Reset values
    a = 10; b = 20;
    
    // Method 2: Without temp (arithmetic)
    a = a + b;                 // a becomes 30
    b = a - b;                 // b becomes 30-20=10
    a = a - b;                 // a becomes 30-10=20
    
    printf("After swap without temp: a=%d, b=%d\n", a, b);
    
    return 0;
}
```

### 2.2 Counting Positive Numbers from a Set of Integers

Count how many numbers are greater than zero.

**Real-world scenario**: Counting how many students scored positive marks in a class test.

**Pseudo-code**:
```
BEGIN
    count ← 0
    INPUT n
    FOR i = 1 to n
        INPUT num
        IF num > 0 THEN
            count ← count + 1
        END IF
    END FOR
    PRINT count
END
```

### 2.3 Summation of Set of Numbers

Find total sum of given numbers.

**Real-world scenario**: Adding daily sales in a small shop in Bhaktapur.

**C Code Example**:
```c
#include <stdio.h>

int main() {
    int n, num, sum = 0;       // sum starts at 0
    
    printf("How many numbers? ");
    scanf("%d", &n);
    
    for(int i = 1; i <= n; i++) {  // Loop n times
        printf("Enter number %d: ", i);
        scanf("%d", &num);
        sum = sum + num;           // Add to total
    }
    
    printf("Sum = %d\n", sum);     // Display result
    
    return 0;
}
```

### 2.4 Reversing the Digits of an Integer

Example: 1234 → 4321

**Real-world scenario**: Reversing a bus route number to read from the back.

**Pseudo-code**:
```
BEGIN
    INPUT num
    reversed ← 0
    WHILE num > 0
        digit ← num % 10
        reversed ← reversed * 10 + digit
        num ← num / 10
    END WHILE
    PRINT reversed
END
```

### 2.5 Find Smallest Positive Divisor of an Integer Other Than 1

Find the smallest divisor greater than 1 (i.e., smallest prime factor).

**Real-world scenario**: Finding the smallest packet size that perfectly divides a big order.

**Pseudo-code**:
```
BEGIN
    INPUT n
    FOR i = 2 to n-1
        IF n % i == 0 THEN
            PRINT i
            EXIT
        END IF
    END FOR
    PRINT "n is prime"
END
```

### 2.6 Find G.C.D. and L.C.M. of Two as Well as Three Positive Integers

GCD (Greatest Common Divisor) – largest common divisor.  
LCM (Least Common Multiple) – smallest common multiple.  
LCM(a,b) = (a × b) / GCD(a,b)

**Euclidean Algorithm for GCD**:

**Real-world scenario**: Cutting two ropes of different lengths into equal maximum pieces (GCD).

**C Code Example** (for two numbers):
```c
#include <stdio.h>

int findGCD(int a, int b) {    // Function to find GCD
    while(b != 0) {            // Repeat until b becomes 0
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;                  // a is GCD
}

int main() {
    int a = 48, b = 18;
    int gcd = findGCD(a, b);   // Call function
    int lcm = (a * b) / gcd;    // Calculate LCM
    
    printf("GCD of %d and %d = %d\n", a, b, gcd);
    printf("LCM of %d and %d = %d\n", a, b, lcm);
    
    return 0;
}
```

For three numbers: GCD(a, GCD(b,c))

### 2.7 Generating Prime Numbers

Check if a number is prime or generate primes up to n (e.g., Sieve of Eratosthenes).

**Real-world scenario**: Finding prime numbers is like selecting the strongest pillars for a temple.

**Simple Prime Check Pseudo-code**:
```
BEGIN
    INPUT n
    IF n <= 1 THEN PRINT "Not prime"
    FOR i = 2 to sqrt(n)
        IF n % i == 0 THEN PRINT "Not prime" and EXIT
    END FOR
    PRINT "Prime"
END
```

## 3. Different Approaches in Programming

### 3.1 Procedural Approach

Focus on procedures/functions. Code is written as sequence of steps. C is procedural.

**Example**: Writing a recipe step by step.

### 3.2 Object Oriented Approach

Focus on objects (data + functions). Uses classes, inheritance, polymorphism (like C++, Java).

**Example**: Modeling a "Student" object with marks and methods to calculate grade.

### 3.3 Event Driven Approach

Program responds to events (mouse click, key press). Used in GUI apps (Windows forms, web).

**Example**: Clicking a button in a mobile app to order food.

**Comparison Table**:

| Approach          | Focus              | Languages Example | Real-world Use             |
|-------------------|--------------------|-------------------|----------------------------|
| Procedural       | Functions/Steps    | C, Pascal         | System programming, scripts|
| Object Oriented  | Objects/Classes    | C++, Java, Python | Large applications, games  |
| Event Driven     | Events/Responses   | Visual Basic, JS  | GUI apps, websites         |

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

Named memory locations to store data. Must be declared before use.

### 5.2 Constants

Values that don't change. Use const or #define.

### 5.3 Data Types

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