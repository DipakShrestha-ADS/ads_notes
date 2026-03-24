
# 📘 Unit VIII: Stacks (Complete Notes)

---

# 🔷 1. What is a Stack?

## 📌 Definition

A **Stack** is a linear data structure that follows:

👉 **LIFO (Last In First Out)**

This means:

* The **last element added** is the **first to be removed**

---

## 🎯 Real-Life Examples

* Stack of plates 🍽️
* Undo/Redo in editors
* Browser history

---

## 📊 Visualization

```
Top → 30  ← Insert/Delete happens here
       20
       10
Bottom
```

---

## 🧠 Key Features of Stack

* Works on **LIFO principle**
* Only one end is used → called **TOP**
* Two main operations:

  * **Push** → Insert element
  * **Pop** → Delete element

---

# 🔷 2. Stack Operations

| Operation | Meaning              |
| --------- | -------------------- |
| Push      | Add element to stack |
| Pop       | Remove element       |

---

# 🔷 3. Array Representation of Stack

## 📌 Concept

We use:

* **Array** to store elements
* **Top variable** to track position

---

## 🧠 Structure

```c
#define MAX 5
int stack[MAX];
int top = -1;
```

---

## 📊 Visualization

```
Index:  0   1   2   3   4
Stack: [10][20][30][  ][  ]
Top → index 2
```

---

# 🔷 4. Algorithms of Stack Operations

---

## ✅ 4.1 PUSH Operation (Insert)

### 📌 Algorithm
```
✅ Algorithm: PUSH Operation
1. Start
2. Check if top == MAX - 1
3. If true, display "Stack Overflow"
4. Else
5. Increment top by 1
6. Insert value into stack[top]
7. Stop
```
### 📌 PSEUODO CODE
```
IF top == MAX - 1
    PRINT "Stack Overflow"
ELSE
    top = top + 1
    stack[top] = value
END
```

---

## ✅ 4.2 POP Operation (Delete)

### 📌 Algorithm
```
✅ Algorithm: POP Operation
1. Start
2. Check if top == -1
3. If true, display "Stack Underflow"
4. Else
5. Store stack[top] in value
6. Decrement top by 1
7. Stop
```
### 📌 Pseudo Code

```
IF top == -1
    PRINT "Stack Underflow"
ELSE
    value = stack[top]
    top = top - 1
END
```
---

# 🔷 5. Stack vs Array (Very Important)

| Feature     | Stack            | Array          |
| ----------- | ---------------- | -------------- |
| Nature      | Data Structure   | Data Structure |
| Access      | Only TOP element | Any index      |
| Rule        | LIFO             | No rule        |
| Flexibility | Restricted       | Flexible       |
| Operations  | Push/Pop         | Direct access  |

---

# 🔷 6. Full C Program (Stack using Array)

---

## 💻 Complete Program

```c
#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

// PUSH function
void push(int value) {
    if (top == MAX - 1) {
        printf("Stack Overflow\n");
    } else {
        top++;
        stack[top] = value;
        printf("%d pushed into stack\n", value);
    }
}

// POP function
void pop() {
    if (top == -1) {
        printf("Stack Underflow\n");
    } else {
        printf("%d popped from stack\n", stack[top]);
        top--;
    }
}

// DISPLAY function
void display() {
    if (top == -1) {
        printf("Stack is empty\n");
    } else {
        printf("Stack elements are:\n");
        for (int i = top; i >= 0; i--) {
            printf("%d\n", stack[i]);
        }
    }
}

int main() {
    int choice, value;

    while (1) {
        printf("\n--- STACK MENU ---\n");
        printf("1. Push\n2. Pop\n3. Display\n5. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter value: ");
                scanf("%d", &value);
                push(value);
                break;

            case 2:
                pop();
                break;

            case 3:
                display();
                break;

            case 4:
                return 0;

            default:
                printf("Invalid choice\n");
        }
    }
}
```
