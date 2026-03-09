# Unit V: Structure and Union in C

# 1. Structure

## 1.1 What is a Structure?

A **structure** in C is a **user-defined data type that allows grouping variables of different data types under a single name**.

Structures are used to represent **real-world entities** such as:

* Student
* Employee
* Book
* Product
* Car

Each entity contains **multiple related attributes**, and structures help organize them together.

### Example Concept

A **student** may have:

* Roll number → `int`
* Name → `char`
* Marks → `float`

Instead of storing them in separate variables, we group them into a structure.

```
Student
 ├── roll
 ├── name
 └── marks
```

---

## Advantages of Structure

Structures provide several benefits:

1. They allow **grouping of different data types** into a single unit.
2. They help represent **complex real-world data** easily.
3. They make programs **more organized and readable**.
4. They allow **handling multiple records efficiently**.
5. They can be used with **arrays, pointers, and functions**.

---

# Declaration of Structure

## Syntax

```c
struct structure_name {
    data_type member1;
    data_type member2;
    data_type member3;
};
```

### Explanation

* `struct` → keyword used to declare structure
* `structure_name` → name of the structure
* `member` → variables inside the structure

---

## Example Program

```c
#include <stdio.h>

struct Student {
    int roll;
    char name[50];
    float marks;
};

int main() {

    struct Student s1;

    s1.roll = 1;
    s1.marks = 88.5;

    printf("Roll: %d\n", s1.roll);
    printf("Marks: %.2f\n", s1.marks);

    return 0;
}
```

---

## Accessing Structure Members

Structure members are accessed using the **dot operator (`.`)**.

```
structure_variable.member
```

Example:

```
s1.roll
s1.name
s1.marks
```

---

## Practice Tasks (Declaration)

1. Create a structure **Book** with title, price, and pages.
2. Create a structure **Car** with brand, model, and price.
3. Define a structure **Employee** with id, name, salary.
4. Write a program declaring a **Product** structure.
5. Declare a structure **City** with name and population.
6. Create a **Movie** structure with title, year, rating.
7. Create a structure **Laptop** with brand, RAM, price.
8. Declare a structure **Teacher** with name and subject.
9. Define **BankAccount** with account number and balance.
10. Create structure **Animal** with name and age.

---

# Reading and Assignment of Structure Variables

Structure members can be assigned values manually or read using **`scanf()`**.

---

## Example Program

```c
#include <stdio.h>

struct Student {
    int roll;
    char name[50];
    float marks;
};

int main() {

    struct Student s1;

    printf("Enter Roll: ");
    scanf("%d", &s1.roll);

    printf("Enter Name: ");
    scanf("%s", s1.name);

    printf("Enter Marks: ");
    scanf("%f", &s1.marks);

    printf("\nStudent Details\n");

    printf("Roll: %d\n", s1.roll);
    printf("Name: %s\n", s1.name);
    printf("Marks: %.2f\n", s1.marks);

    return 0;
}
```

---

## Memory Visualization

```
s1
 ├── roll  → 5
 ├── name  → Ram
 └── marks → 78.5
```

Each member **occupies its own memory location**.

---

## Practice Tasks

1. Read and print a student's details.
2. Read employee id, name, salary.
3. Input book title and price.
4. Input car brand and price.
5. Input teacher name and subject.
6. Input laptop brand and RAM.
7. Input movie title and rating.
8. Input bank account number and balance.
9. Input city name and population.
10. Input product name and cost.

---

# Array of Structures

When we need to store **multiple records of the same type**, we use **array of structures**.

---

## Syntax

```c
struct Student s[10];
```

This means we can store **10 student records**.

```
s[0]
s[1]
s[2]
...
s[9]
```

Each element contains:

```
roll
name
marks
```

---

## Example Program

```c
#include <stdio.h>

struct Student {
    int roll;
    float marks;
};

int main() {

    struct Student s[3];

    for(int i=0;i<3;i++) {

        printf("Enter Roll: ");
        scanf("%d",&s[i].roll);

        printf("Enter Marks: ");
        scanf("%f",&s[i].marks);
    }

    printf("\nStudent Details\n");

    for(int i=0;i<3;i++) {

        printf("Roll: %d Marks: %.2f\n",s[i].roll,s[i].marks);
    }

    return 0;
}
```

---

## Visualization

```
s[0] → roll , marks
s[1] → roll , marks
s[2] → roll , marks
```

---

## Practice Tasks

1. Store 5 students and print details.
2. Store 3 employees and print salary.
3. Store 10 books with price.
4. Store 4 cars and print model.
5. Store 6 products and print price.
6. Store 5 teachers.
7. Store 7 laptops.
8. Store 8 cities population.
9. Store 4 movies.
10. Find highest marks among students.

---

# Arrays within Structures

A structure can contain **arrays as members**.

Example:

```
Student
 ├── roll
 ├── name[50]
 └── marks[5]
```

Here a student has **marks of 5 subjects**.

---

## Example Program

```c
#include <stdio.h>

struct Student {

    int roll;
    int marks[3];

};

int main() {

    struct Student s;

    printf("Enter Roll: ");
    scanf("%d",&s.roll);

    for(int i=0;i<3;i++) {

        printf("Enter Marks %d: ",i+1);
        scanf("%d",&s.marks[i]);

    }

    printf("\nRoll: %d\n",s.roll);

    for(int i=0;i<3;i++) {

        printf("Marks %d: %d\n",i+1,s.marks[i]);
    }

    return 0;
}
```

---

## Practice Tasks

1. Student with 5 subject marks.
2. Employee with salary history of 3 months.
3. Store 5 product prices.
4. Store 4 exam scores.
5. Student with 3 semester GPA.
6. Store daily temperature for 7 days.
7. Store 5 book prices.
8. Store 6 match scores.
9. Store 5 movie ratings.
10. Calculate average marks.

---

# Structures within Structures (Nested Structures)

A **nested structure** means **a structure inside another structure**.

---

## Example Concept

```
Date
 ├── day
 ├── month
 └── year

Student
 ├── name
 └── Date dob
```

---

## Example Program

```c
#include <stdio.h>

struct Date {

    int day;
    int month;
    int year;

};

struct Student {

    char name[50];
    struct Date dob;

};

int main() {

    struct Student s;

    printf("Enter Name: ");
    scanf("%s",s.name);

    printf("Enter DOB (dd mm yyyy): ");
    scanf("%d %d %d",&s.dob.day,&s.dob.month,&s.dob.year);

    printf("\nName: %s\n",s.name);
    printf("DOB: %d/%d/%d\n",s.dob.day,s.dob.month,s.dob.year);

    return 0;
}
```

---

## Practice Tasks

1. Student with Address structure.
2. Employee with Date of Joining.
3. Book with Author structure.
4. Car with Engine structure.
5. Person with Birthdate structure.
6. Product with Manufacturer structure.
7. Teacher with Address structure.
8. Movie with Director structure.
9. Order with Date structure.
10. Library book with Publisher structure.

---

# Structures and Functions

Structures can interact with functions in three ways:

1. **Passing structure to a function**
2. **Returning structure from a function**
3. **Using pointer to structure**

---

## Example: Passing Structure to Function

```c
#include <stdio.h>

struct Student {

    int roll;
    float marks;

};

void display(struct Student s) {

    printf("Roll: %d\n",s.roll);
    printf("Marks: %.2f\n",s.marks);

}

int main() {

    struct Student s1;

    printf("Enter Roll: ");
    scanf("%d",&s1.roll);

    printf("Enter Marks: ");
    scanf("%f",&s1.marks);

    display(s1);

    return 0;
}
```

---

## Practice Tasks

1. Pass student structure to function.
2. Function to print employee details.
3. Function to calculate total marks.
4. Function to display book details.
5. Function to return student structure.
6. Function to calculate average marks.
7. Function to print car details.
8. Function to display product list.
9. Function to compare two students marks.
10. Function to print employee salary.

---

# Structure Input / Output in C

## Introduction

In C programming, after **declaring a structure**, we often need to:

* **Read values** into its members
* **Display the values** stored in it

This is called **Structure Input and Output (I/O)**.

* **Input** → using `scanf()` or user-defined values
* **Output** → using `printf()`

> Each structure member is accessed using the **dot operator (`.`)** for reading and printing.

---

## Syntax for Input / Output

### Accessing a structure member

```c
structure_variable.member
```

### Example:

```c
s1.roll     // Access roll number
s1.name     // Access name
s1.marks    // Access marks
```

---

## Example Program: Basic Input / Output

```c
#include <stdio.h>

struct Student {
    int roll;
    char name[50];
    float marks;
};

int main() {

    struct Student s1;

    // Input
    printf("Enter Roll: ");
    scanf("%d", &s1.roll);

    printf("Enter Name: ");
    scanf("%s", s1.name);

    printf("Enter Marks: ");
    scanf("%f", &s1.marks);

    // Output
    printf("\nStudent Details\n");
    printf("Roll: %d\n", s1.roll);
    printf("Name: %s\n", s1.name);
    printf("Marks: %.2f\n", s1.marks);

    return 0;
}
```

---

## Input / Output with Array of Structures

When storing **multiple records**, we use **array of structures** and loops.

### Example Program

```c
#include <stdio.h>

struct Student {
    int roll;
    float marks;
};

int main() {

    struct Student s[3];  // Array of 3 students

    // Input
    for(int i=0; i<3; i++) {
        printf("Enter Roll for student %d: ", i+1);
        scanf("%d", &s[i].roll);

        printf("Enter Marks for student %d: ", i+1);
        scanf("%f", &s[i].marks);
    }

    // Output
    printf("\nStudent Details:\n");
    for(int i=0; i<3; i++) {
        printf("Roll: %d, Marks: %.2f\n", s[i].roll, s[i].marks);
    }

    return 0;
}
```

---

## 5. Memory Visualization

For a single structure:

```
s1
 ├── roll  → 10
 ├── name  → "Ram"
 └── marks → 78.5
```

For array of structures:

```
s[0] → roll, marks
s[1] → roll, marks
s[2] → roll, marks
```

Each **structure element has separate memory** for its members.

---

## Example: Input / Output with Arrays inside Structure

```c
#include <stdio.h>

struct Student {
    int roll;
    int marks[3]; // Marks for 3 subjects
};

int main() {

    struct Student s;

    printf("Enter Roll: ");
    scanf("%d", &s.roll);

    for(int i=0; i<3; i++) {
        printf("Enter Marks for subject %d: ", i+1);
        scanf("%d", &s.marks[i]);
    }

    printf("\nStudent Details\n");
    printf("Roll: %d\n", s.roll);
    for(int i=0; i<3; i++) {
        printf("Marks %d: %d\n", i+1, s.marks[i]);
    }

    return 0;
}
```

---

## Tips

* Always **use dot operator (`.`)** to access members.
* **Array members** inside structure require **looping with index**.
* For **strings**, `scanf("%s", s.name);` is enough, but note it **stops at space**.
* For **multiple records**, use **array of structures**.

---

## Practice Tasks: Structure Input / Output

1. Read and print a student's roll, name, and marks.
2. Read 3 employees’ id, name, and salary; display all.
3. Input 5 books with title and price; display details.
4. Input 4 cars with brand, model, and price; display all.
5. Store 6 products with name and cost; display them.
6. Read 3 teachers’ name and subject; print details.
7. Input 5 laptops with brand, RAM, and price; display all.
8. Read 8 cities with name and population; print all.
9. Input 4 movies with title, year, and rating; display all.
10. Read student roll and marks of 5 subjects; calculate and display total marks.

---

# 2. Union

## What is a Union?

A **union** is a **user-defined data type in C where all members share the same memory location**.

This means:

* Only **one member can store a value at a time**.
* Changing one member **overwrites the previous value**.

Unions are mainly used when **memory optimization is required**.

---

## Syntax

```c
union union_name {

    data_type member1;
    data_type member2;

};
```

---

## Example Program

```c
#include <stdio.h>

union Data {

    int i;
    float f;
    char str[20];

};

int main() {

    union Data data;

    data.i = 10;
    printf("Integer: %d\n",data.i);

    data.f = 220.5;
    printf("Float: %f\n",data.f);

    return 0;
}
```

---

## Memory Visualization

### Structure Memory

```
roll  → 4 bytes
marks → 4 bytes

Total → 8 bytes
```

### Union Memory

```
roll
marks
share same memory

Total → 4 bytes
```

The size of a union is equal to **the size of its largest member**.

---

# Difference Between Structure and Union

| Feature           | Structure                                   | Union                                     |
| ----------------- | ------------------------------------------- | ----------------------------------------- |
| Memory allocation | Separate memory for each member             | Members share the same memory             |
| Memory size       | Sum of all members                          | Size of largest member                    |
| Value storage     | All members can store values simultaneously | Only one member can store value at a time |
| Usage             | Used for complex records                    | Used for memory optimization              |

---

## Practice Tasks (Union)

1. Create union for int and float.
2. Store integer then float.
3. Show memory overwrite behavior.
4. Create union for student data.
5. Print union values.
6. Compare structure vs union size.
7. Create union with char array.
8. Store multiple values sequentially.
9. Print memory size using `sizeof()`.
10. Create union for sensor data.