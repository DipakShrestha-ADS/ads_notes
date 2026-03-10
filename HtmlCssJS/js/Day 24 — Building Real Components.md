
# Day 24 — Building Real Components

Today, you will learn how to **build interactive and reusable components** using JavaScript, handle **form validation**, interact with APIs, and organize code effectively.

---

# 1. Dynamic UI with JavaScript

- **Dynamic UI** means updating the content **without reloading the page**.  
- Use **DOM manipulation** to add, remove, or update elements.

### Example: Add List Items Dynamically

```javascript id="dynamic_ui"
let list = document.getElementById("myList");
let addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", function() {
  let li = document.createElement("li");
  li.innerText = "New Item";
  list.appendChild(li);
});
````

---

# 2. Form Validation

* Ensure **user input is correct** before submitting.

### Example: Basic Validation

```javascript id="form_validation"
let form = document.getElementById("myForm");
form.addEventListener("submit", function(event) {
  event.preventDefault();
  let name = document.getElementById("name").value;
  if(name === "") {
    alert("Name cannot be empty!");
  } else {
    alert("Form submitted successfully!");
  }
});
```

---

# 3. DOM-based Applications

* Build applications using **DOM operations**
* Example: **Todo list**

```javascript id="dom_app_example"
let todoForm = document.getElementById("todoForm");
let todoInput = document.getElementById("todoInput");
let todoList = document.getElementById("todoList");

todoForm.addEventListener("submit", function(e) {
  e.preventDefault();
  if(todoInput.value !== "") {
    let li = document.createElement("li");
    li.innerText = todoInput.value;
    todoList.appendChild(li);
    todoInput.value = "";
  }
});
```

---

# 4. Using APIs

* Fetch data from external sources to display in the component

### Example: Fetch Users

```javascript id="api_example"
fetch("https://jsonplaceholder.typicode.com/users")
  .then(response => response.json())
  .then(users => {
    let container = document.getElementById("userList");
    users.forEach(user => {
      let p = document.createElement("p");
      p.innerText = `${user.name} (${user.email})`;
      container.appendChild(p);
    });
  })
  .catch(error => console.error("Error:", error));
```

---

# 5. Component Structure

* **Components** are reusable pieces of UI
* Example: A **user card component**

```javascript id="component_example"
function createUserCard(user) {
  let card = document.createElement("div");
  card.classList.add("user-card");

  let name = document.createElement("h3");
  name.innerText = user.name;
  card.appendChild(name);

  let email = document.createElement("p");
  email.innerText = user.email;
  card.appendChild(email);

  return card;
}

// Using it
fetch("https://jsonplaceholder.typicode.com/users")
  .then(res => res.json())
  .then(users => {
    let container = document.getElementById("userContainer");
    users.forEach(user => {
      container.appendChild(createUserCard(user));
    });
  });
```

---

# 6. Code Organization

* Keep **HTML, CSS, JS** separate
* Modularize **reusable components** in functions
* Use **event delegation** for dynamically added elements
* Comment code clearly for maintainability

---

# Complete Example: Building a Todo Component

```html id="js_day24_complete"
<!DOCTYPE html>
<html>
<head>
  <title>Todo Component</title>
  <style>
    .todo-item { margin: 5px 0; }
    .user-card { border: 1px solid #ccc; padding: 10px; margin: 10px 0; }
  </style>
</head>
<body>

<h1>Todo List Component</h1>
<form id="todoForm">
  <input type="text" id="todoInput" placeholder="Enter todo" required>
  <button type="submit">Add</button>
</form>
<ul id="todoList"></ul>

<h1>User List Component</h1>
<div id="userContainer"></div>

<script>
// DOM-based Todo App
let todoForm = document.getElementById("todoForm");
let todoInput = document.getElementById("todoInput");
let todoList = document.getElementById("todoList");

todoForm.addEventListener("submit", function(e) {
  e.preventDefault();
  if(todoInput.value !== "") {
    let li = document.createElement("li");
    li.classList.add("todo-item");
    li.innerText = todoInput.value;
    todoList.appendChild(li);
    todoInput.value = "";
  }
});

// Component: User Card
function createUserCard(user) {
  let card = document.createElement("div");
  card.classList.add("user-card");

  let name = document.createElement("h3");
  name.innerText = user.name;
  card.appendChild(name);

  let email = document.createElement("p");
  email.innerText = user.email;
  card.appendChild(email);

  return card;
}

// Fetch API & render user cards
fetch("https://jsonplaceholder.typicode.com/users")
  .then(res => res.json())
  .then(users => {
    let container = document.getElementById("userContainer");
    users.forEach(user => {
      container.appendChild(createUserCard(user));
    });
  });
</script>

</body>
</html>
```

---

# Practice Tasks

### Task 1

Create a **Todo list** component that allows adding and removing items.

---

### Task 2

Validate form inputs before adding to the Todo list.

---

### Task 3

Fetch a list of users from an API and display in a **user card** format.

---

### Task 4

Add a **delete button** to each Todo item using event delegation.

---

### Task 5

Make a component function that generates a **styled message box**.

---

### Task 6

Separate **CSS and JS files** for the components.

---

### Task 7

Use `innerHTML` safely to update a container dynamically.

---

### Task 8

Allow **editing a Todo item** inline.

---

### Task 9

Add a **loading indicator** while fetching API data.

---

### Task 10

## Combine multiple components (Todo + Users) on a single page maintaining modular code.
