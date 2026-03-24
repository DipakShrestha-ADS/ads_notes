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
    int data;          // Data part
    struct Node* next; // Pointer to next node
};

// Function to traverse the list
void traverse(struct Node* head) {
    struct Node* temp = head;
    while (temp != NULL) {
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\n");
}

// Insert at beginning
void insertAtBeginning(struct Node** head_ref, int new_data) {
    struct Node* new_node = (struct Node*) malloc(sizeof(struct Node));
    new_node->data = new_data;        // Assign data
    new_node->next = *head_ref;       // Link new node to previous head
    *head_ref = new_node;             // Update head
}

// Insert after a given node
void insertAfter(struct Node* prev_node, int new_data) {
    if (prev_node == NULL) {
        printf("Previous node cannot be NULL.\n");
        return;
    }
    struct Node* new_node = (struct Node*) malloc(sizeof(struct Node));
    new_node->data = new_data;             // Assign data
    new_node->next = prev_node->next;      // Link new node to next
    prev_node->next = new_node;            // Link previous node to new node
}

// Delete node by key
void deleteNode(struct Node** head_ref, int key) {
    struct Node* temp = *head_ref;
    struct Node* prev = NULL;

    // If head node itself holds the key
    if (temp != NULL && temp->data == key) {
        *head_ref = temp->next;
        free(temp);
        return;
    }

    // Search for the key
    while (temp != NULL && temp->data != key) {
        prev = temp;
        temp = temp->next;
    }

    // If key not found
    if (temp == NULL) return;

    // Unlink the node and free memory
    prev->next = temp->next;
    free(temp);
}

// Search for a value
struct Node* search(struct Node* head, int key) {
    struct Node* current = head;
    while (current != NULL) {
        if (current->data == key)
            return current;
        current = current->next;
    }
    return NULL; // Not found
}

int main() {
    struct Node* head = NULL;

    // Insert nodes at beginning
    insertAtBeginning(&head, 30);
    insertAtBeginning(&head, 20);
    insertAtBeginning(&head, 10);

    printf("Linked List: ");
    traverse(head);

    // Insert after a node
    insertAfter(head->next, 25); // After 20
    printf("After inserting 25: ");
    traverse(head);

    // Delete a node
    deleteNode(&head, 20);
    printf("After deleting 20: ");
    traverse(head);

    // Search a node
    int key = 25;
    struct Node* result = search(head, key);
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

# Linear Linked List – Visual Diagrams

---

## 1. Traversing a Linked List

**Example List:** `10 -> 20 -> 30 -> NULL`

**Steps:**

1. Start at `Head`

```
Head -> 10 -> 20 -> 30 -> NULL
^
Current
```

2. Print current node, move to next:

```
Print: 10
Current -> 20 -> 30 -> NULL
```

3. Print current node, move to next:

```
Print: 20
Current -> 30 -> NULL
```

4. Print current node, move to next:

```
Print: 30
Current -> NULL
```

5. Stop when `Current == NULL`.
   **Output:** `10 -> 20 -> 30 -> NULL`

---

## 2. Insertion at Beginning

**Before Insertion:**

```
Head -> 20 -> 30 -> NULL
```

**Insert 10 at Beginning:**

1. Create new node with data = 10
2. Link new node to head:

```
NewNode(10) -> 20 -> 30 -> NULL
```

3. Update head to new node:

```
Head -> 10 -> 20 -> 30 -> NULL
```

---

## 3. Insertion After a Given Node

**Before Insertion:**

```
Head -> 10 -> 20 -> 30 -> NULL
```

**Insert 25 after 20:**

1. Identify previous node (`prev = 20`)
2. Create new node with data = 25
3. Update links:

```
prev->next = newNode
newNode->next = prev->next(original)
```

**After Insertion:**

```
Head -> 10 -> 20 -> 25 -> 30 -> NULL
```

---

## 4. Deletion of a Node

**Before Deletion:** Delete node 20

```
Head -> 10 -> 20 -> 25 -> 30 -> NULL
```

**Steps:**

1. Find node to delete and previous node

```
Prev -> 10
Temp -> 20
```

2. Update previous node link:

```
Prev->next = Temp->next
```

3. Free the memory of node 20

**After Deletion:**

```
Head -> 10 -> 25 -> 30 -> NULL
```

---

## 5. Searching a Node

**Example:** Search for `25`

```
Head -> 10 -> 25 -> 30 -> NULL
```

**Steps:**

1. Start at Head:

```
Current = 10 -> 25 -> 30
10 != 25 -> move to next
```

2. Next node:

```
Current = 25 -> 30
25 == 25 -> found
```

**Output:** Node found

---

## 6. Reversing a Linked List (Extra Visualization)

**Before:**

```
Head -> 10 -> 25 -> 30 -> NULL
```

**Step-by-Step Reversal:**

1. Initialize: `Prev = NULL`, `Current = Head`
2. Iteration 1:

```
Next = Current->next (25)
Current->next = Prev (NULL)
Prev = Current (10)
Current = Next (25)
```

**List now:** 10 -> NULL

3. Iteration 2:

```
Next = 30
Current->next = Prev (10)
Prev = 25
Current = 30
```

**List now:** 25 -> 10 -> NULL

4. Iteration 3:

```
Next = NULL
Current->next = Prev (25)
Prev = 30
Current = NULL
```

**List now:** 30 -> 25 -> 10 -> NULL

5. Update Head = Prev

```
Head -> 30 -> 25 -> 10 -> NULL
```