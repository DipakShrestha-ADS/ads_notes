# **Unit: Queues in C**

## **1. Introduction to Queues**

A **Queue** is a **linear data structure** that follows the **FIFO (First In First Out)** principle. The element that is inserted first is removed first.

### **Features of Queue**

* **FIFO Principle**: First element inserted is the first to be removed.
* **Rear**: End where elements are inserted.
* **Front**: End from where elements are removed.
* **Dynamic or Static**: Can be implemented using arrays (static) or linked lists (dynamic).

### **Applications of Queue**

* Printer job scheduling.
* CPU task scheduling.
* Call center management.
* Handling requests in web servers.
* Breadth-First Search (BFS) in graphs.

---

## **2. Basic Operations of a Queue**

1. **Enqueue**: Insert an element at the rear.
2. **Dequeue**: Delete an element from the front.
3. **Peek / Front**: Get the front element without removing it.
4. **isEmpty**: Check if the queue is empty.
5. **isFull**: Check if the queue is full (for arrays).

---

## **3. Representation of Queue**

Queues can be represented in two main ways:

### **3.1 Using Arrays (Static Queue)**

* Fixed size array.
* Front and rear pointers are used to manage insertion and deletion.
* Limitation: Wastes space after some deletions (unless circular queue is used).

### **3.2 Using Linked List (Dynamic Queue)**

* Nodes dynamically allocated.
* No size limit.
* Front and rear pointers used to manage insertion and deletion.
* Memory efficient.

---

## **4. Types of Queues**

| Type                    | Description                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- |
| Straight / Linear Queue | Elements are inserted at rear and deleted from front. Simple but may waste space. |
| Circular Queue          | Rear connects back to front, reusing empty slots. Efficient.                      |
| Priority Queue          | Elements have priorities; highest priority served first.                          |
| Deque                   | Double-ended queue, insertion/deletion at both ends.                              |

---

## **5. Algorithms**

### **5.1 Insertion (Enqueue) in Queue**

**Algorithm:**

1. If `rear` equals `MAX-1`, then Queue Overflow (cannot insert).
2. Else, increment `rear`.
3. Insert the element at `queue[rear]`.
4. If `front` is -1, set `front = 0`.

---

### **5.2 Deletion (Dequeue) in Queue**

**Algorithm:**

1. If `front` is -1 or `front > rear`, then Queue Underflow (cannot delete).
2. Else, remove the element from `queue[front]`.
3. Increment `front` by 1.

---

## **6. Queue Implementation in C**

### **6.1 Using Array**

```c
#include <stdio.h>
#define MAX 5

int queue[MAX];
int front = -1, rear = -1;

// Function to insert element into queue
void enqueue(int value) {
    if (rear == MAX - 1) {
        printf("Queue Overflow\n");
    } else {
        rear++;
        queue[rear] = value;
        if (front == -1) front = 0; // first element inserted
        printf("%d enqueued to queue\n", value);
    }
}

// Function to delete element from queue
void dequeue() {
    if (front == -1 || front > rear) {
        printf("Queue Underflow\n");
    } else {
        printf("%d dequeued from queue\n", queue[front]);
        front++;
    }
}

// Function to display queue
void display() {
    if (front == -1 || front > rear) {
        printf("Queue is empty\n");
    } else {
        printf("Queue elements: ");
        for (int i = front; i <= rear; i++) {
            printf("%d ", queue[i]);
        }
        printf("\n");
    }
}

int main() {
    enqueue(10);
    enqueue(20);
    enqueue(30);
    display();
    dequeue();
    display();
    enqueue(40);
    enqueue(50);
    enqueue(60); // overflow
    display();
    return 0;
}
```

**Explanation:**

* `front` points to the first element.
* `rear` points to the last element.
* `enqueue()` adds elements at `rear`.
* `dequeue()` removes elements from `front`.
* `display()` prints current elements of queue.

---

### **6.2 Using Linked List**

```c
#include <stdio.h>
#include <stdlib.h>

// Node structure
struct Node {
    int data;
    struct Node* next;
};

struct Node* front = NULL;
struct Node* rear = NULL;

// Function to insert element
void enqueue(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;
    if (rear == NULL) { // first element
        front = rear = newNode;
    } else {
        rear->next = newNode;
        rear = newNode;
    }
    printf("%d enqueued to queue\n", value);
}

// Function to delete element
void dequeue() {
    if (front == NULL) {
        printf("Queue Underflow\n");
    } else {
        struct Node* temp = front;
        printf("%d dequeued from queue\n", temp->data);
        front = front->next;
        free(temp);
        if (front == NULL) rear = NULL; // queue empty
    }
}

// Function to display queue
void display() {
    if (front == NULL) {
        printf("Queue is empty\n");
    } else {
        struct Node* temp = front;
        printf("Queue elements: ");
        while (temp != NULL) {
            printf("%d ", temp->data);
            temp = temp->next;
        }
        printf("\n");
    }
}

int main() {
    enqueue(10);
    enqueue(20);
    enqueue(30);
    display();
    dequeue();
    display();
    enqueue(40);
    enqueue(50);
    display();
    return 0;
}
```

**Explanation:**

* Each node contains `data` and `next` pointer.
* `front` and `rear` manage the start and end of the queue.
* Dynamic memory allows flexible queue size.

---

## **7. Straight Queue vs Circular Queue**

| Feature            | Straight Queue                 | Circular Queue          |
| ------------------ | ------------------------------ | ----------------------- |
| Memory Utilization | Can waste space after deletion | Efficient, reuses space |
| Rear pointer       | Moves forward                  | Wraps back to front     |
| Implementation     | Array/Linked List              | Array (preferred)       |

---

## **8. 10 Tasks for Students**

1. Write a program to enqueue 5 integers and display the queue.
2. Write a program to dequeue all elements from a queue and display messages for each.
3. Implement a queue using linked list and test with 5 values.
4. Modify the array queue to allow dynamic size using `malloc`.
5. Implement a circular queue using an array.
6. Write a program to check if a queue is empty or full.
7. Implement a program that finds the sum of all elements in a queue.
8. Create a menu-driven program with options: enqueue, dequeue, display, exit.
9. Write a program to reverse the elements of a queue using recursion.
10. Simulate a printer job scheduling using a queue.
---

# **Queues in C – Visual Explanation**

---

## **1. Queue Structure**

```
Front -> [10] [20] [30] <- Rear
```

* **Front**: Points to the first element (10)
* **Rear**: Points to the last element (30)
* **FIFO principle**: First In, First Out

---

## **2. Enqueue Operation (Insertion)**

**Step 1: Insert 40 into queue**

```
Before insertion:
Front -> [10] [20] [30] <- Rear

After insertion:
Front -> [10] [20] [30] [40] <- Rear
```

* **Algorithm visually**:

  1. Check if queue is full → `Queue Overflow`.
  2. Move `rear` to next position.
  3. Insert element at `rear`.

---

## **3. Dequeue Operation (Deletion)**

**Step 1: Remove element from front**

```
Queue before deletion:
Front -> [10] [20] [30] [40] <- Rear

Queue after deletion:
Front -> [20] [30] [40] <- Rear
```

* **Algorithm visually**:

  1. Check if queue is empty → `Queue Underflow`.
  2. Remove element at `front`.
  3. Move `front` to next element.

---

## **4. Array Representation of Queue**

```
Index: 0   1   2   3   4
Queue: 10  20  30  40  50
Front -> 0
Rear  -> 4
```

* In **array**, `front` and `rear` are **indices**.
* After dequeue, `front` moves forward → space may be wasted.

---

## **5. Circular Queue (Visual)**

```
Circular array of size 5
[10] [20] [30] [ ] [ ]

Front -> 0
Rear  -> 2

Insert 40, 50
[10] [20] [30] [40] [50]
Front -> 0
Rear -> 4

Delete 10, 20
[ ] [ ] [30] [40] [50]
Front -> 2
Rear -> 4

Insert 60
[60] [ ] [30] [40] [50]
Front -> 2
Rear -> 0   (wraps around)
```

* Circular queue **reuses empty space**.
* Efficient memory usage.

---

## **6. Linked List Representation**

```
Front -> [10|*] -> [20|*] -> [30|NULL] <- Rear
```

* Each node stores **data** and **pointer** to next node.
* **Front** points to first node, **Rear** points to last node.
* No fixed size, grows dynamically.

---

## **7. Step-by-Step Example Using Array**

| Step | Operation  | Queue Content | Front | Rear |
| ---- | ---------- | ------------- | ----- | ---- |
| 1    | Enqueue 10 | 10            | 0     | 0    |
| 2    | Enqueue 20 | 10 20         | 0     | 1    |
| 3    | Enqueue 30 | 10 20 30      | 0     | 2    |
| 4    | Dequeue    | 20 30         | 1     | 2    |
| 5    | Enqueue 40 | 20 30 40      | 1     | 3    |

---

## **8. Step-by-Step Example Using Linked List**

```
Initial: Front = NULL, Rear = NULL

Enqueue 10: Front -> [10|NULL] <- Rear
Enqueue 20: Front -> [10|*] -> [20|NULL] <- Rear
Enqueue 30: Front -> [10|*] -> [20|*] -> [30|NULL] <- Rear
Dequeue: Remove 10 -> Front -> [20|*] -> [30|NULL] <- Rear
```

* **Dynamic growth**: new nodes allocated with `malloc`.
* **Deletion**: remove front node, free memory.

---

## **9. Queue Operations Summary Diagram**

```
   Enqueue
    _______
   |       |
   v       |
[ ] [ ] [ ] [ ] [ ]
Front --> Rear
   ^       |
   |_______|
   Dequeue
```

* **Enqueue**: add at rear
* **Dequeue**: remove from front

