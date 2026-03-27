# Unit VII: Linear Linked Lists (4 Hrs)

## 1. Introduction

**Definition:**
A **Linear Linked List (LLL)** is a collection of nodes where each node contains data and a pointer (link) to the next node. The last node points to `NULL`.

**Features of Linked List:**

* Dynamic memory allocation (no fixed size).
* Nodes can be easily inserted/deleted without shifting elements.
* Can grow or shrink during runtime.
* Each node has two parts:

  1. `Data` → stores actual information.
  2. `Next` → pointer to the next node.

**Advantages over Array:**

* No need to define size in advance.
* Insertion/deletion is easier and faster at any position (except search).
* Memory utilization is efficient (no unused spaces).

**Shortcomings:**

* Extra memory needed for pointers.
* Accessing elements is sequential (no direct access like arrays).
* Slightly more complex to implement.

**Linked List vs Array:**

| Feature            | Array             | Linked List            |
| ------------------ | ----------------- | ---------------------- |
| Size               | Fixed             | Dynamic                |
| Memory             | Contiguous        | Non-contiguous         |
| Insertion/Deletion | Costly (shifting) | Easy (adjust pointers) |
| Access             | Direct (index)    | Sequential (traversal) |
| Memory overhead    | No extra memory   | Extra pointer per node |

---

## 2. Representation in Memory

Memory representation of a linked list:

```
Head → [Data | Next] → [Data | Next] → [Data | Next] → NULL
```

* `Head` points to the first node.
* Each node points to the next node.
* Last node points to `NULL`.

**Diagram Example:**

```
Head
 |
 v
+-----+-----+     +-----+-----+     +-----+-----+
| 10  |  *--->  | 20  |  *--->  | 30  | NULL |
+-----+-----+     +-----+-----+     +-----+-----+
```

---

## 3. Algorithms for Basic Operations

### 3.1 Traversing a Linked List

**Algorithm:**

1. Start from `Head`.
2. Repeat until current node is `NULL`:

   * Print `current->data`.
   * Move to `current->next`.

---

### 3.2 Searching a Node

**Algorithm to search for value `x`:**

1. Start from `Head`.
2. Traverse nodes:

   * If `current->data == x`, return node found.
   * Else, move to `current->next`.
3. If `NULL` is reached, element not found.

---

### 3.3 Insertion into Linked List

**A) Insert at Beginning:**

1. Create a new node.
2. Assign data to new node.
3. Make `new_node->next = Head`.
4. Update `Head = new_node`.

**B) Insert After a Given Node:**

1. Find the node after which insertion is needed (`prev_node`).
2. Create a new node and assign data.
3. Set `new_node->next = prev_node->next`.
4. Set `prev_node->next = new_node`.

---

### 3.4 Deletion from Linked List

**Algorithm: Delete node with value `x`:**

1. Start from `Head`.
2. If `Head->data == x`, delete head node.
3. Else, traverse nodes until node before target node.
4. Adjust pointers: `prev->next = target->next`.
5. Free memory of deleted node.

---

## 4. C Program Implementation

```c
#include <stdio.h>
#include <stdlib.h>

// Define Node structure
struct Node {
    int data;
    struct Node* next;
};

// Global head pointer
struct Node* head = NULL;

// Function to traverse the list
void traverse() {
    struct Node* temp = head;
    while (temp != NULL) {
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\n");
}

// Insert at beginning
void insertAtBeginning(int new_data) {
    struct Node* new_node = (struct Node*) malloc(sizeof(struct Node));
    
    new_node->data = new_data;
    new_node->next = head;
    head = new_node;
}

// Insert after a given node
void insertAfter(struct Node* prev_node, int new_data) {
    if (prev_node == NULL) {
        printf("Previous node cannot be NULL.\n");
        return;
    }

    struct Node* new_node = (struct Node*) malloc(sizeof(struct Node));

    new_node->data = new_data;
    new_node->next = prev_node->next;
    prev_node->next = new_node;
}

// Delete node by key
void deleteNode(int key) {
    struct Node* temp = head;
    struct Node* prev = NULL;

    // If head node holds the key
    if (temp != NULL && temp->data == key) {
        head = temp->next;
        free(temp);
        return;
    }

    // Search for the key
    while (temp != NULL && temp->data != key) {
        prev = temp;
        temp = temp->next;
    }

    // If key not found
    if (temp == NULL) {
        printf("Value not found.\n");
        return;
    }

    // Unlink node
    prev->next = temp->next;
    free(temp);
}

// Search for a value
struct Node* search(int key) {
    struct Node* current = head;

    while (current != NULL) {
        if (current->data == key)
            return current;
        current = current->next;
    }

    return NULL;
}

// Main function
int main() {

    // Insert nodes
    insertAtBeginning(30);
    insertAtBeginning(20);
    insertAtBeginning(10);

    printf("Linked List: ");
    traverse();

    // Insert after second node (20)
    insertAfter(head->next, 25);
    printf("After inserting 25: ");
    traverse();

    // Delete a node
    deleteNode(20);
    printf("After deleting 20: ");
    traverse();

    // Search a node
    int key = 25;
    struct Node* result = search(key);

    if (result != NULL)
        printf("Node with value %d found.\n", key);
    else
        printf("Node with value %d not found.\n", key);

    return 0;
}
```

### **Explanation of Program**

1. `struct Node` defines the node structure.
2. `traverse()` prints all elements sequentially.
3. `insertAtBeginning()` adds a node at the start.
4. `insertAfter()` adds a node after a specified node.
5. `deleteNode()` removes a node by its value.
6. `search()` looks for a node with a given value.
7. `main()` demonstrates all operations:

   * Creates nodes.
   * Inserts nodes at beginning and after a node.
   * Deletes a node.
   * Searches for a node.

---

## 5. Student Practice Tasks (10)

1. Create a linked list with 5 nodes and display it.
2. Insert a node at the beginning of a linked list.
3. Insert a node at the end of a linked list.
4. Insert a node after a given node in a list.
5. Delete the first node of a linked list.
6. Delete the last node of a linked list.
7. Delete a node with a specific value.
8. Search for a node with a given value.
9. Count the number of nodes in a linked list.
10. Reverse a linked list (without creating a new list).

---
# 📘 Linear Linked List – Visual Diagrams

---

## 🔹 1. Traversing a Linked List

**Example List:**

```
Head -> 10 -> 20 -> 30 -> NULL
```

**Steps:**

1. Start from `head`

```
Head -> 10 -> 20 -> 30 -> NULL
         ^
      Current
```

2. Print and move:

```
Print: 10
Current -> 20 -> 30 -> NULL
```

3. Continue:

```
Print: 20
Current -> 30 -> NULL
```

4. Continue:

```
Print: 30
Current -> NULL
```

5. Stop when `Current == NULL`

✅ **Output:**

```
10 -> 20 -> 30 -> NULL
```

---

## 🔹 2. Insertion at Beginning

**Before:**

```
Head -> 20 -> 30 -> NULL
```

**Insert 10:**

1. Create new node:

```
NewNode = 10
```

2. Link new node to current head:

```
NewNode -> 20 -> 30 -> NULL
```

3. Move head to new node:

```
Head -> 10 -> 20 -> 30 -> NULL
```

---

## 🔹 3. Insertion After a Given Node

**Before:**

```
Head -> 10 -> 20 -> 30 -> NULL
```

**Insert 25 after 20**

👉 Let:

```
prev = node with value 20
```

---

### ❗ Correct Order (VERY IMPORTANT)

1. Create new node:

```
NewNode = 25
```

2. First connect new node to next node:

```
NewNode->next = prev->next
```

```
25 -> 30
```

3. Then connect previous node to new node:

```
prev->next = NewNode
```

---

### ✅ Final Result:

```
Head -> 10 -> 20 -> 25 -> 30 -> NULL
```

---

### 🚨 Common Student Mistake (tell this!)

❌ Wrong:

```
prev->next = newNode
newNode->next = prev->next   (WRONG ORDER ❌)
```

👉 This causes wrong linking / loop.

---

## 🔹 4. Deletion of a Node

**Delete 20**

**Before:**

```
Head -> 10 -> 20 -> 25 -> 30 -> NULL
```

---

### Steps:

1. Find node and previous:

```
Prev -> 10
Temp -> 20
```

2. Skip the node:

```
Prev->next = Temp->next
```

```
10 -> 25 -> 30
```

3. Free memory:

```
free(Temp)
```

---

### ✅ After:

```
Head -> 10 -> 25 -> 30 -> NULL
```

---

### 🧠 Special Case (IMPORTANT)

If deleting first node:

```
Head -> 10 -> 20 -> 30
```

Then:

```
Head = Head->next
```

---

## 🔹 5. Searching a Node

**Search = 25**

```
Head -> 10 -> 25 -> 30 -> NULL
```

---

### Steps:

1. Start:

```
Current = 10
10 != 25 → move next
```

2. Next:

```
Current = 25
25 == 25 → FOUND ✅
```

---

### ❌ If not found:

```
Current becomes NULL
```
