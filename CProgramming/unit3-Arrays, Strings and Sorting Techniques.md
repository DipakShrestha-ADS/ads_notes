# Unit III: Arrays, Strings and Sorting Techniques (8 Hours)

## 1. Arrays

An array is a collection of similar data items stored in contiguous memory locations. All elements have the same data type and can be accessed using an index (starting from 0).

### 1.1 One-Dimensional and Multidimensional Arrays

- **One-Dimensional Array**: Like a single row or list.  
  Example: Marks of 10 students in one subject.

- **Multidimensional Array**: Like a table or grid.  
  Most common is **Two-Dimensional** (rows and columns).  
  Example: Marks of 10 students in 5 different subjects.

**Real-world scenario**: In a school in Pokhara, storing monthly sales of 12 months (1D array) or sales of 5 shops over 12 months (2D array).

### 1.2 Declaring Array Variables

Syntax:  
`data_type array_name[size];`  // 1D  
`data_type array_name[row_size][column_size];`  // 2D

### 1.3 Initialization of Arrays

You can initialize at declaration:  
`int marks[5] = {85, 90, 78, 92, 88};`  
Partial initialization: remaining elements become 0.  
For 2D:  
`int matrix[3][3] = {{1,2,3}, {4,5,6}, {7,8,9}};`

### 1.4 Accessing Array Elements

Use subscript/index: `array_name[index]`  
Index starts from 0.  
For 2D: `array_name[row_index][column_index]`

**C Code Example** (1D and 2D arrays):
```c
#include <stdio.h>

int main() {
    // 1D Array declaration and initialization
    int marks[5] = {85, 90, 78, 92, 88};  // 5 students' marks
    
    // Accessing and printing 1D array
    printf("Student marks:\n");
    for(int i = 0; i < 5; i++) {          // Loop from 0 to 4
        printf("Student %d: %d\n", i+1, marks[i]);  // marks[0] is first student
    }
    
    // 2D Array declaration and initialization
    int sales[3][4] = {                  // 3 shops, 4 months sales
        {5000, 6000, 5500, 7000},       // Shop 1
        {4500, 4800, 5200, 6500},       // Shop 2
        {6000, 5800, 6200, 7500}        // Shop 3
    };
    
    // Accessing and printing 2D array
    printf("\nMonthly sales of shops:\n");
    for(int i = 0; i < 3; i++) {          // Rows (shops)
        for(int j = 0; j < 4; j++) {      // Columns (months)
            printf("Shop %d, Month %d: %d\n", i+1, j+1, sales[i][j]);
        }
    }
    
    return 0;
}
```

## 2. Strings

In C, a string is a one-dimensional array of characters terminated by a null character `\0`.

### 2.1 Declaring and Initializing String Variables

Declaration:  
`char name[20];`  // Can hold up to 19 chars + \0

Initialization:  
`char name[] = "Ram Bahadur";`  // Size automatically calculated  
`char city[10] = {'K','a','t','h','m','a','n','d','u','\0'};`

### 2.2 Character and String Handling Functions

Need `#include <string.h>`

Common functions:

| Function      | Purpose                              | Example                          |
|---------------|--------------------------------------|----------------------------------|
| strlen()      | Returns length (without \0)          | strlen("Nepal") → 5              |
| strcpy()      | Copies one string to another         | strcpy(dest, "Hello");           |
| strcat()      | Concatenates (joins) two strings     | strcat(s1, s2);                  |
| strcmp()      | Compares two strings (returns 0 if equal) | strcmp("abc","abc") → 0     |
| strrev()      | Reverses string (not standard, some compilers) |                          |
| gets() / puts() | Input/output string (gets unsafe)  | Use fgets instead                |

**Real-world scenario**: Storing and displaying student names, or joining first and last name.

**C Code Example**:
```c
#include <stdio.h>
#include <string.h>  // For string functions

int main() {
    char name[50] = "Hari Prasad";     // Initialization
    char surname[20] = "Sharma";
    char full_name[70];
    
    printf("Name: %s\n", name);        // %s for string
    printf("Length of name: %zu\n", strlen(name));  // strlen returns size_t
    
    strcpy(full_name, name);           // Copy name to full_name
    strcat(full_name, " ");            // Add space
    strcat(full_name, surname);        // Add surname
    
    printf("Full name: %s\n", full_name);
    
    if(strcmp(name, "Hari Prasad") == 0) {  // Compare
        printf("Name matches!\n");
    }
    
    return 0;
}
```

## 3. Sorting Algorithms

Sorting means arranging elements in ascending or descending order. We will study four common methods and implement them in C.

### 3.1 Bubble Sort

Repeatedly swaps adjacent elements if they are in wrong order. Simple but slow for large data.

**Real-world scenario**: Arranging students by height in assembly – repeatedly compare and swap neighbors.

### 3.2 Selection Sort

Finds the smallest element and places it in correct position, repeatedly.

**Real-world scenario**: Selecting the shortest student for front row, then next shortest, etc.

### 3.3 Insertion Sort

Builds sorted list one item at a time by inserting new element in correct place.

**Real-world scenario**: Inserting new playing cards into a sorted hand.

### 3.4 Merge Sort

Divide-and-conquer: splits array into halves, sorts them, then merges.

Fastest among these for large data.

### 3.5 Efficiency of Algorithms

Measured using Big-O notation (worst-case time complexity):

| Algorithm      | Time Complexity (Worst) | Space Complexity | Stable? | Best For                  |
|----------------|--------------------------|------------------|---------|---------------------------|
| Bubble Sort    | O(n²)                   | O(1)             | Yes     | Small arrays, nearly sorted |
| Selection Sort | O(n²)                   | O(1)             | No      | Small arrays              |
| Insertion Sort | O(n²)                   | O(1)             | Yes     | Small or nearly sorted    |
| Merge Sort     | O(n log n)              | O(n)             | Yes     | Large arrays, stable sort |

### 3.6 Implement Using C

**C Code Example** (All four sorts on same array):
```c
#include <stdio.h>

// Function to print array
void printArray(int arr[], int n) {
    for(int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

// Bubble Sort
void bubbleSort(int arr[], int n) {
    for(int i = 0; i < n-1; i++) {           // Passes
        for(int j = 0; j < n-i-1; j++) {      // Comparisons
            if(arr[j] > arr[j+1]) {           // Swap if greater
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

// Selection Sort
void selectionSort(int arr[], int n) {
    for(int i = 0; i < n-1; i++) {
        int min_idx = i;                     // Assume current is minimum
        for(int j = i+1; j < n; j++) {
            if(arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        // Swap minimum with current position
        int temp = arr[i];
        arr[i] = arr[min_idx];
        arr[min_idx] = temp;
    }
}

// Insertion Sort
void insertionSort(int arr[], int n) {
    for(int i = 1; i < n; i++) {
        int key = arr[i];                    // Current element
        int j = i - 1;
        while(j >= 0 && arr[j] > key) {      // Shift larger elements
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;                      // Insert in correct place
    }
}

// Merge function for Merge Sort
void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int L[n1], R[n2];
    
    for(int i = 0; i < n1; i++) L[i] = arr[left + i];
    for(int i = 0; i < n2; i++) R[i] = arr[mid + 1 + i];
    
    int i = 0, j = 0, k = left;
    while(i < n1 && j < n2) {
        if(L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    while(i < n1) arr[k++] = L[i++];         // Remaining elements
    while(j < n2) arr[k++] = R[j++];
}

// Merge Sort
void mergeSort(int arr[], int left, int right) {
    if(left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);           // Sort left half
        mergeSort(arr, mid + 1, right);      // Sort right half
        merge(arr, left, mid, right);        // Merge them
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = 7;
    
    printf("Original array: ");
    printArray(arr, n);
    
    // Copy array for each sort (simple way: re-run program or use different arrays)
    int arr2[7] = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(arr2, n);
    printf("Bubble Sort: ");
    printArray(arr2, n);
    
    int arr3[7] = {64, 34, 25, 12, 22, 11, 90};
    selectionSort(arr3, n);
    printf("Selection Sort: ");
    printArray(arr3, n);
    
    int arr4[7] = {64, 34, 25, 12, 22, 11, 90};
    insertionSort(arr4, n);
    printf("Insertion Sort: ");
    printArray(arr4, n);
    
    int arr5[7] = {64, 34, 25, 12, 22, 11, 90};
    mergeSort(arr5, 0, n-1);
    printf("Merge Sort: ");
    printArray(arr5, n);
    
    return 0;
}
```

Practice these programs regularly. Start with small arrays and understand how each sort works step by step. This unit builds strong foundation for handling real data in C programming!

# Tasks

## 1. Arrays

1. Declare a one-dimensional array of 10 integers and initialize it with values from 1 to 10.
2. Write a C program to read 5 elements into an integer array and print them in reverse order.
3. Declare and initialize a 3x3 two-dimensional array with values 1 to 9.
4. Write a program to find the sum of all elements in a one-dimensional array of 8 floats.
5. Access and print the element at row 2, column 1 in a 4x5 integer matrix.
6. Declare a multidimensional array (3x4x2) and initialize it with sequential numbers.
7. Write a program to calculate the average of elements in a one-dimensional array entered by the user.
8. Copy elements from one array to another array of the same size without using built-in functions.
9. Declare an array of 20 characters and initialize it with a string literal.
10. Find the largest and smallest element in a one-dimensional integer array of size 15.
11. Write a program to add two 3x3 matrices and store the result in a third matrix.
12. Multiply a 2x3 matrix by a 3x2 matrix and display the result.
13. Access diagonal elements of a square matrix and calculate their sum.
14. Initialize a one-dimensional array with zeros using a loop during declaration.
15. Write a program to transpose a 4x4 matrix.

## 2. Strings

1. Declare and initialize a string variable with your name and print it.
2. Write a program to find the length of a string using strlen() function.
3. Read a string from the user and print it in reverse without using strrev().
4. Copy one string to another using strcpy() function.
5. Concatenate two strings entered by the user using strcat().
6. Compare two strings for equality using strcmp() and display the result.
7. Convert a string to uppercase using toupper() in a loop.
8. Count the number of vowels in a given string.
9. Declare a string and initialize it without specifying size (using literal).
10. Write a program to check if a string is palindrome.
11. Find the frequency of each character in a string.
12. Replace all occurrences of a character in a string with another character.
13. Extract a substring from a given string (using manual indexing).
14. Convert a string to lowercase manually without using library functions.
15. Read multiple strings into an array of strings and display them.

## 3. Sorting Algorithms

1. Implement Bubble sort to sort an array of integers in ascending order.
2. Write a program using Selection sort to find the second smallest element in an array.
3. Implement Insertion sort on an array of floating-point numbers.
4. Write a complete program for Merge sort and sort a large array (size 20).
5. Compare the number of comparisons in Bubble sort vs Selection sort for a given array.
6. Implement Bubble sort and count the number of swaps performed.
7. Sort an array of strings using Bubble sort (lexicographical order).
8. Implement Selection sort in descending order.
9. Write Insertion sort and demonstrate it shifts elements correctly.
10. Merge two sorted arrays into one sorted array using merge logic.
11. Analyze and print the time complexity (theoretical) for Bubble, Selection, Insertion, and Merge sort.
12. Implement an optimized Bubble sort that stops if the array is already sorted.
13. Sort an array using Insertion sort and display the array after each iteration.
14. Implement recursive Merge sort and test with duplicate elements.
15. Compare execution time (using simple counter) of all four sorting algorithms on the same random array.