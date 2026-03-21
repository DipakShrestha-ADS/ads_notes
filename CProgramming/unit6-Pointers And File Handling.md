# 📘 Unit VI: Pointers and File Handling

# 🔹 1. POINTER – FUNDAMENTALS

- **Pointers** in C are variables that store the **memory address** of another variable, rather than a direct value. This allows indirect access and manipulation of data. 
- They are essential for efficient memory management, enabling dynamic memory allocation, building complex data structures (like linked lists/trees), modifying function arguments, and handling arrays/strings faster.

## Key Reasons & Importance of Pointers:
- ***Dynamic Memory Management***: Allocate memory at runtime using malloc() or calloc() when the size of data is unknown at compile time.
- ***Modifying Data in Functions***: Pass variable addresses to functions, allowing the function to directly change the original value rather than a copy.
- ***Efficient Array/String Manipulation***: Traverse arrays and strings quickly by incrementing a pointer, which is faster than indexing.
- ***Complex Data Structures***: Essential for building linked lists, trees, and graphs, where nodes point to other nodes.
- ***Hardware Access***: Crucial in embedded systems for accessing specific memory addresses for input/output.

## Real-World Use Cases in C:

- ***Linked Lists and Trees***: Implementing data structures that grow and shrink at runtime.
- ***Passing Large Structures/Arrays***: Passing a pointer is much faster than passing a huge struct by value, saving memory and time.
- ***Returning Multiple Values***: Functions can update multiple variables via pointers.
- ***File Handling***: Using file pointers (FILE *) to read/write files.
- ***Dynamic Array Allocation***: Creating arrays of variable size (int *arr = malloc(size * sizeof(int));).

### Summary:

- `Pointers are important because they give you direct control over memory, making programs faster and more flexible. However, misuse can lead to errors like memory leaks or corruption.`

- `Pointers are declared using the `*` symbol and are very powerful for memory management, arrays, and functions.`

---

## 🧪 Example

```c
#include<stdio.h>
int main() {
    int a = 10;
    int *p = &a;

    printf("Value of a: %d\n", a);
    printf("Address of a: %p\n", &a);
    printf("Pointer value: %p\n", p);
    printf("Value using pointer: %d\n", *p);

    return 0;
}
```

---

## 🎯 Tasks

1. Declare a pointer and print its value
2. Store address of variable and print
3. Print value using dereferencing
4. Modify value using pointer
5. Print pointer address itself
6. Use pointer with float
7. Compare normal vs pointer
8. Use pointer with char
9. Draw memory diagram
10. Predict output

---

# 🔹 2. POINTER VARIABLES

A pointer variable is used specifically to store the address of another variable. It must be declared with a data type that matches the type of variable whose address it stores.

Pointers can also be assigned NULL if they are not pointing to any valid memory location.

---

## 🧪 Example

```c
#include<stdio.h>
int main() {
    int x = 20;
    int *ptr = &x;

    printf("%d", *ptr);

    return 0;
}
```

---

## 🎯 Tasks

1. Declare pointer for int, float, char
2. Assign address and print value
3. Create multiple pointers
4. Swap values using pointers
5. Observe uninitialized pointer
6. Use NULL pointer
7. Print pointer size
8. Pointer to pointer
9. Pointer in loop
10. Predict output

---

# 🔹 3. REFERENCING AND DEREFERENCING

Referencing is the process of obtaining the memory address of a variable using the `&` operator. Dereferencing is the process of accessing the value stored at a memory address using the `*` operator.

These two operations form the core concept of pointers.

---

## 🧪 Example

```c
#include<stdio.h>
int main() {
    int a = 10;
    int *p = &a;

    printf("Address: %p\n", &a);
    printf("Value using pointer: %d\n", *p);

    return 0;
}
```

---

## 🎯 Tasks

1. Print address using `&`
2. Print value using `*`
3. Modify value using pointer
4. Combine operations
5. Use pointer in expressions
6. Use pointer with scanf
7. Debug wrong code
8. Print both address and value
9. Multiple dereferencing
10. Predict output

---

# 🔹 4. POINTER ARITHMETIC

Pointer arithmetic allows operations like increment, decrement, and subtraction on pointers. When a pointer is incremented, it moves to the next memory location based on the size of its data type.

This is mainly used to traverse arrays efficiently.

---

## 🧪 Example

```c
#include<stdio.h>
int main() {
    int arr[3] = {10, 20, 30};
    int *p = arr;

    printf("%d\n", *p);
    printf("%d\n", *(p+1));
    printf("%d\n", *(p+2));

    return 0;
}
```

---

## 🎯 Tasks

1. Traverse array using pointer
2. Increment pointer
3. Subtract pointers
4. Compare pointers
5. Loop with pointer
6. Reverse array
7. Print addresses
8. Float pointer arithmetic
9. Pointer difference
10. Simulate indexing

---

# 🔹 5. CHAIN OF POINTERS

A chain of pointers means a pointer pointing to another pointer. It is also called pointer to pointer and is represented using `**`.

It is useful in advanced memory handling and dynamic structures.

---

## 🧪 Example

```c
#include<stdio.h>
int main() {
    int a = 10;
    int *p = &a;
    int **q = &p;

    printf("%d", **q);

    return 0;
}
```

---

## 🎯 Tasks

1. Create double pointer
2. Use `**` to print value
3. Draw diagram
4. Triple pointer
5. Modify value
6. Compare levels
7. Debug code
8. Use in function
9. Print addresses
10. Predict output

---

# 🔹 6. POINTERS AND ARRAYS

An array name acts as a pointer to its first element. Using pointers, arrays can be accessed and manipulated efficiently.

---

## 🧪 Example

```c
#include<stdio.h>
int main() {
    int arr[3] = {1,2,3};
    int *p = arr;

    printf("%d", *(p+1));

    return 0;
}
```

---

## 🎯 Tasks

1. Access array using pointer
2. Print array
3. Compare arr[i] vs *(p+i)
4. Reverse array
5. Sum elements
6. Find max
7. Sort
8. 2D array pointer
9. Increment pointer
10. Indexing

---

# 🔹 7. POINTERS AND STRINGS

Strings are arrays of characters ending with a null character `\0`. A pointer can be used to access and manipulate strings efficiently.

---

## 🧪 Example

```c
#include<stdio.h>
int main() {
    char *str = "Hello";

    while(*str != '\0') {
        printf("%c", *str);
        str++;
    }

    return 0;
}
```

---

## 🎯 Tasks

1. Print string
2. Length calculation
3. Reverse string
4. Copy string
5. Compare strings
6. Concatenate
7. Modify string
8. Char pointer
9. Detect null
10. Build string

---

# 🔹 8. ARRAY OF POINTERS

An array of pointers is a collection where each element is a pointer. It is commonly used to store multiple strings.

---

## 🧪 Example

```c
#include<stdio.h>
int main() {
    char *names[] = {"Ram", "Shyam", "Hari"};

    printf("%s", names[1]);

    return 0;
}
```

---

## 🎯 Tasks

1. Store strings
2. Print all
3. Loop usage
4. Sort strings
5. Compare
6. Dynamic strings
7. Access chars
8. Count words
9. Replace
10. Pointer arithmetic

---

# 🔹 9. POINTERS AS FUNCTION ARGUMENTS

Passing pointers to functions allows modification of original values. This is known as call by reference.

---

## 🧪 Example

```c
#include<stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 5, y = 10;
    swap(&x, &y);

    printf("%d %d", x, y);

    return 0;
}
```

---

## 🎯 Tasks

1. Swap values
2. Modify array
3. Pass pointer
4. Return multiple values
5. Recursion
6. Sum array
7. Input via pointer
8. Structure pointer
9. Debug
10. Predict

---

# 🔹 10. FUNCTIONS RETURNING POINTERS

Functions can return pointers, but they should not return the address of local variables because they are destroyed after function execution. Static or dynamically allocated memory should be used.

---

## 🧪 Example

```c
#include<stdio.h>

int* fun() {
    static int a = 10;
    return &a;
}

int main() {
    int *p = fun();
    printf("%d", *p);
}
```

---

## 🎯 Tasks

1. Return pointer
2. Static variable
3. Avoid local return
4. Print value
5. Array pointer
6. Debug
7. Compare memory
8. Modify value
9. Chain functions
10. Predict

---

# 🔹 11. POINTER TO FUNCTION

A function pointer stores the address of a function and allows calling the function dynamically.

---

## 🧪 Example

```c
#include<stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int (*fp)(int, int) = add;
    printf("%d", fp(2,3));
}
```

---

## 🎯 Tasks

1. Create function pointer
2. Call function
3. Pass function
4. Array of functions
5. Calculator
6. Debug
7. Compare calls
8. Menu program
9. Return function
10. Predict

---

# 🔹 12. POINTER TO STRUCTURE

A pointer can store the address of a structure variable. Members are accessed using the `->` operator.

---

## 🧪 Example

```c
#include<stdio.h>

struct Student {
    int id;
};

int main() {
    struct Student s = {1};
    struct Student *p = &s;

    printf("%d", p->id);
}
```

---

## 🎯 Tasks

1. Access structure
2. Use arrow operator
3. Modify values
4. Array of structure
5. Pass pointer
6. Dynamic structure
7. Compare . and ->
8. Print fields
9. Nested structure
10. Predict

---

# 🔹 13. POINTERS WITHIN STRUCTURE

Structures can contain pointer members which store addresses of other structures. This concept is used to create dynamic data structures like linked lists.

---

## 🧪 Example

```c
struct Node {
    int data;
    struct Node *next;
};
```

---

## 🎯 Tasks

1. Create node
2. Assign next
3. Traverse list
4. Insert
5. Delete
6. Count nodes
7. Reverse
8. Debug
9. Visualize
10. Implement list

---

# 📂 14. FILE HANDLING

File handling is used to store data permanently in files and retrieve it when required. It allows programs to read and write data even after execution ends.

Text files store data in readable form, while binary files store data in machine format.

---

## 🔹 File Functions

---

### fopen()

Used to open a file in a specified mode like read, write, or append.

```c
FILE *fp = fopen("file.txt", "w");
```

---

### fclose()

Used to close an opened file and free resources.

```c
fclose(fp);
```

---

### fputc()

Writes a single character into a file.

```c
fputc('A', fp);
```

---

### fscanf()

Reads formatted data from a file.

```c
fscanf(fp, "%d", &x);
```

---

### fprintf()

Writes formatted data into a file.

```c
fprintf(fp, "%d", x);
```

---

### getw() / putw()

Used to read and write integers from/to a file.

```c
putw(x, fp);
x = getw(fp);
```

---

### fread() / fwrite()

Used for binary file operations to read and write blocks of data.

```c
fwrite(&x, sizeof(x), 1, fp);
fread(&x, sizeof(x), 1, fp);
```

---

### fseek()

Moves the file pointer to a specific position.

```c
fseek(fp, 0, SEEK_SET);
```

---

## 🧪 Example

```c
#include<stdio.h>
int main() {
    FILE *fp = fopen("data.txt", "w");
    fprintf(fp, "Hello World");
    fclose(fp);
    return 0;
}
```

---

## 🎯 Tasks

1. Create and write file
2. Read file
3. Append data
4. Copy file
5. Count characters
6. Store structure
7. Binary read/write
8. Use fseek
9. Handle errors
10. Menu program

---

# 💾 15. DYNAMIC MEMORY ALLOCATION

Dynamic memory allocation allows memory to be allocated during runtime instead of compile time. It helps in creating flexible and efficient programs.

---

### malloc()

Allocates a single block of memory of specified size.

```c
int *p = (int*) malloc(sizeof(int));
```

---

### calloc()

Allocates multiple blocks and initializes them to zero.

```c
int *p = (int*) calloc(5, sizeof(int));
```

---

### realloc()

Resizes the previously allocated memory.

```c
p = realloc(p, 10 * sizeof(int));
```

---

### free()

Releases the allocated memory back to the system.

```c
free(p);
```

---

### sizeof operator

Returns the size of a data type or variable in bytes.

```c
sizeof(int);
```

---

## 🧪 Example

```c
#include<stdio.h>
#include<stdlib.h>

int main() {
    int *p;
    p = (int*) malloc(3 * sizeof(int));

    for(int i=0;i<3;i++) {
        scanf("%d", &p[i]);
    }

    for(int i=0;i<3;i++) {
        printf("%d ", p[i]);
    }

    free(p);
    return 0;
}
```

---

## 🎯 Tasks

1. Allocate memory
2. Dynamic array
3. Use calloc
4. Resize memory
5. Free memory
6. Dynamic string
7. Dynamic structure
8. Memory leak
9. Compare malloc & calloc
10. Build program

---
---
---

# 🎯 🔥 VERY HIGH CHANCE BOARD QUESTIONS (Example)

*(Pointers + File Handling + DMA)*

---

# 🧠 SECTION A: THEORY (Short Questions)

---

### 🔹 Pointers

1. What is a pointer? Explain with example.
2. What is the difference between pointer and normal variable?
3. Explain referencing and dereferencing with example.
4. What is pointer arithmetic? Explain with example.
5. What is a null pointer?
6. What is a pointer to pointer?
7. Explain relationship between pointers and arrays.
8. What is an array of pointers?
9. Explain pointers and strings.
10. What is call by value and call by reference?

---

### 🔹 Functions & Structures

11. What is a function pointer? Explain with syntax.
12. What is a pointer to structure?
13. Difference between `.` and `->` operator
14. Explain pointers within structure.

---

### 🔹 File Handling

15. What is file handling? Why is it needed?
16. Difference between text file and binary file
17. Explain file opening modes (r, w, a, rb, wb)
18. What is FILE pointer?
19. Explain fopen() and fclose()
20. Explain fprintf() and fscanf()

---

### 🔹 Dynamic Memory Allocation

21. What is dynamic memory allocation?
22. Difference between malloc() and calloc()
23. What is realloc()?
24. What is free()?
25. What is sizeof operator?

---

# 🧠 SECTION B: DIFFERENCE QUESTIONS (VERY IMPORTANT)

👉 These are **EXTREMELY COMMON in board exams**

1. Pointer vs Normal Variable
2. malloc() vs calloc()
3. Text file vs Binary file
4. Call by Value vs Call by Reference
5. Structure vs Pointer to Structure
6. Array vs Pointer

---

# 💻 SECTION C: PROGRAM QUESTIONS (HIGH PROBABILITY)

---

## 🔥 POINTER PROGRAMS

### 1. Swap two numbers using pointer

```c
#include<stdio.h>
void swap(int *a, int *b){
    int temp = *a;
    *a = *b;
    *b = temp;
}
int main(){
    int x=5,y=10;
    swap(&x,&y);
    printf("%d %d",x,y);
}
```

---

### 2. Find sum of array using pointer

```c
#include<stdio.h>
int main(){
    int arr[5]={1,2,3,4,5};
    int *p=arr,sum=0;

    for(int i=0;i<5;i++){
        sum += *(p+i);
    }
    printf("Sum = %d",sum);
}
```

---

### 3. String length using pointer

```c
#include<stdio.h>
int main(){
    char *str="Hello";
    int count=0;

    while(*str!='\0'){
        count++;
        str++;
    }
    printf("%d",count);
}
```

---

## 🔥 FUNCTION POINTER

### 4. Function pointer example

```c
#include<stdio.h>
int add(int a,int b){
    return a+b;
}
int main(){
    int (*fp)(int,int)=add;
    printf("%d",fp(2,3));
}
```

---

## 🔥 STRUCTURE + POINTER

### 5. Access structure using pointer

```c
#include<stdio.h>
struct Student{
    int id;
};
int main(){
    struct Student s={1};
    struct Student *p=&s;
    printf("%d",p->id);
}
```

---

## 🔥 FILE HANDLING PROGRAMS (VERY IMPORTANT)

---

### 6. Write data to file

```c
#include<stdio.h>
int main(){
    FILE *fp=fopen("data.txt","w");
    fprintf(fp,"Hello");
    fclose(fp);
}
```

---

### 7. Read data from file

```c
#include<stdio.h>
int main(){
    FILE *fp=fopen("data.txt","r");
    char ch;
    while((ch=fgetc(fp))!=EOF){
        printf("%c",ch);
    }
    fclose(fp);
}
```

---

### 8. Copy one file to another (VERY IMPORTANT)

```c
#include<stdio.h>
int main(){
    FILE *f1=fopen("a.txt","r");
    FILE *f2=fopen("b.txt","w");
    char ch;

    while((ch=fgetc(f1))!=EOF){
        fputc(ch,f2);
    }

    fclose(f1);
    fclose(f2);
}
```

---

### 9. Write and read binary file

```c
#include<stdio.h>
int main(){
    FILE *fp=fopen("data.bin","wb");
    int x=10;
    fwrite(&x,sizeof(x),1,fp);
    fclose(fp);

    fp=fopen("data.bin","rb");
    fread(&x,sizeof(x),1,fp);
    printf("%d",x);
    fclose(fp);
}
```

---

## 🔥 DYNAMIC MEMORY PROGRAMS

---

### 10. malloc example

```c
#include<stdio.h>
#include<stdlib.h>
int main(){
    int *p=(int*)malloc(3*sizeof(int));

    for(int i=0;i<3;i++){
        scanf("%d",&p[i]);
    }

    for(int i=0;i<3;i++){
        printf("%d ",p[i]);
    }

    free(p);
}
```

---

### 11. calloc example

```c
int *p=(int*)calloc(5,sizeof(int));
```

---

### 12. realloc example

```c
p = realloc(p,10*sizeof(int));
```

---

# 🧠 SECTION D: LONG QUESTIONS

---

### 🔥 VERY IMPORTANT

1. Explain pointers with types and examples
2. Explain pointer arithmetic with program
3. Explain dynamic memory allocation with all functions
4. Explain file handling with all functions and example
5. Explain pointers and arrays with program
6. Explain pointer to structure with example
7. Explain function pointer with example

---

# 🚨 LAST MINUTE REVISION (SUPER IMPORTANT)

👉 You must **100% prepare these:**

* Swap using pointer
* Array sum using pointer
* File write + read
* File copy program
* malloc + calloc difference
* Pointer basics definitions
* Text vs Binary file
* Function pointer syntax
