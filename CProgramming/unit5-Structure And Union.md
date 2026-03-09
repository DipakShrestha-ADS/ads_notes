# Unit V: Structure and Union in C

## 1. Structure

### 1.1 What is a Structure?

In C programming, a **structure** is a user-defined data type that allows us to **store multiple variables of different data types under a single name**.

For example:

A student has:

* Name (string)
* Roll number (int)
* Marks (float)

Instead of storing them separately, we can group them into **one structure**.

### Why Structures are Needed

Without structure:

```c
int roll;
char name[50];
float marks;
```

For 100 students we would need many variables.

With structure:

```c
struct Student {
    int roll;
    char name[50];
    float marks;
};
```

Now we can create many students easily.

```
Student
 ├── roll
 ├── name
 └── marks
```

---

# Declaration of Structure

### Syntax

```c
struct structure_name {
    data_type member1;
    data_type member2;
    data_type member3;
};
```

### Example

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

### Accessing Structure Members

We use **dot operator (.)**

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

### Example Program

```c
#include <stdio.h>

struct Student {
    int roll;
    float marks;
};

int main() {

    struct Student s1;

    s1.roll = 10;
    s1.marks = 92.3;

    printf("Roll Number: %d\n", s1.roll);
    printf("Marks: %.2f\n", s1.marks);

    return 0;
}
```

---

### Practice Tasks (Declaration)

1. Create a structure **Book** with title, price, and pages.
2. Create a structure **Car** with brand, model, and price.
3. Define a structure **Employee** with id, name, salary.
4. Write a program declaring a **Product** structure.
5. Declare a structure **City** with name and population.
6. Create a **Movie** structure with title, year, rating.
7. Create a structure **Laptop** with brand, RAM, price.
8. Declare a structure **Teacher** with name, subject.
9. Define **BankAccount** with account number and balance.
10. Create structure **Animal** with name and age.

---

# Reading and Assignment of Structure Variables

We can read values using **scanf()** and assign values.

### Example

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

### Memory Visualization

```
s1
 ├── roll  → 5
 ├── name  → Ram
 └── marks → 78.5
```

---

### Practice Tasks

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

When we need **many structures of the same type**, we use **array of structures**.

### Syntax

```c
struct Student s[10];
```

This means **10 students**.

```
s[0]
s[1]
s[2]
...
s[9]
```

Each contains:

```
roll
name
marks
```

---

### Example Program

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

### Visualization

```
s[0] → roll , marks
s[1] → roll , marks
s[2] → roll , marks
```

---

### Practice Tasks

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

This means **5 subjects marks**.

---

### Example Program

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

### Practice Tasks

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

A structure can contain **another structure inside it**.

Example:

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

### Example Program

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

### Practice Tasks

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

Structures can be used with functions in **three ways**:

1. Passing structure to function
2. Returning structure
3. Using pointer to structure

---

### Example: Passing Structure to Function

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

### Practice Tasks

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

# 2. Union

## What is a Union?

A **union** is similar to a structure, but **all members share the same memory location**.

Meaning:

Only **one member can store value at a time**.

---

### Syntax

```c
union union_name {

    data_type member1;
    data_type member2;

};
```

---

### Example

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

### Memory Visualization

Structure memory:

```
roll  → 4 bytes
marks → 4 bytes
Total → 8 bytes
```

Union memory:

```
roll
marks
share same memory
Total → 4 bytes
```

---

### Difference Between Structure and Union

| Feature     | Structure                 | Union                |
| ----------- | ------------------------- | -------------------- |
| Memory      | Separate for each member  | Shared               |
| Usage       | All members used together | One member at a time |
| Memory size | Sum of members            | Largest member       |

---

### Practice Tasks (Union)

1. Create union for int and float.
2. Store integer then float.
3. Show memory overwrite behavior.
4. Create union for student data.
5. Print union values.
6. Compare structure vs union size.
7. Create union with char array.
8. Store multiple values sequentially.
9. Print memory size using sizeof().
10. Create union for sensor data.