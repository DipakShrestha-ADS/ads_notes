
# Day 20 — DOM Manipulation

Today, you will learn how to **interact with the HTML page using JavaScript** through the **Document Object Model (DOM)**.

---

# 1. DOM Concept

- The **DOM** is a **tree-like representation of the HTML page**.  
- Each HTML element is a **node** that can be **accessed and modified** using JavaScript.  
- Allows dynamic updates without reloading the page.

---

# 2. Selecting Elements

### 2.1 `getElementById`

- Select element by its `id`

```javascript id="dom_getid"
let heading = document.getElementById("title");
console.log(heading);
````

---

### 2.2 `getElementsByClassName`

* Select all elements with a class
* Returns an **HTMLCollection** (array-like)

```javascript id="dom_getclass"
let items = document.getElementsByClassName("item");
console.log(items);
```

---

### 2.3 `querySelector`

* Select **first element** matching a CSS selector

```javascript id="dom_queryselector"
let firstItem = document.querySelector(".item");
console.log(firstItem);
```

---

### 2.4 `querySelectorAll`

* Select **all elements** matching a CSS selector
* Returns a **NodeList**

```javascript id="dom_queryselectorall"
let allItems = document.querySelectorAll(".item");
allItems.forEach(item => console.log(item));
```

---

# 3. Modifying Elements

### 3.1 Changing Text

```javascript id="dom_text"
let heading = document.getElementById("title");
heading.innerText = "New Title"; // changes visible text
```

---

### 3.2 Changing HTML

```javascript id="dom_html"
let container = document.getElementById("container");
container.innerHTML = "<p>New paragraph added!</p>"; // can include HTML tags
```

---

### 3.3 Changing Styles

```javascript id="dom_style"
heading.style.color = "blue";
heading.style.fontSize = "24px";
```

---

# 4. DOM Operations

### 4.1 Creating Elements

```javascript id="dom_create"
let newPara = document.createElement("p");
newPara.innerText = "I am a new paragraph";
document.body.appendChild(newPara); // adds to end of body
```

---

### 4.2 Removing Elements

```javascript id="dom_remove"
let oldPara = document.getElementById("old");
oldPara.remove();
```

---

### 4.3 Class Manipulation

```javascript id="dom_class"
let box = document.querySelector(".box");
box.classList.add("highlight");    // add class
box.classList.remove("highlight"); // remove class
box.classList.toggle("active");    // add/remove depending on presence
```

---

# Complete Example: DOM Manipulation

```html id="js_day20_complete"
<!DOCTYPE html>
<html>
<head>
  <title>DOM Manipulation</title>
  <style>
    .highlight { background-color: yellow; }
    .active { border: 2px solid red; }
  </style>
</head>
<body>

<h1 id="title">Original Title</h1>
<div id="container">
  <p class="item">Item 1</p>
  <p class="item">Item 2</p>
</div>
<p id="old">This will be removed</p>
<button id="btn">Click Me</button>
<div class="box">Box Element</div>

<script>
// Selecting elements
let heading = document.getElementById("title");
let items = document.getElementsByClassName("item");
let firstItem = document.querySelector(".item");
let allItems = document.querySelectorAll(".item");

// Modifying elements
heading.innerText = "DOM Manipulation Example";
firstItem.innerText = "Updated First Item";
heading.style.color = "green";

// Creating elements
let newPara = document.createElement("p");
newPara.innerText = "I am a new paragraph";
document.body.appendChild(newPara);

// Removing elements
let oldPara = document.getElementById("old");
oldPara.remove();

// Class manipulation
let box = document.querySelector(".box");
box.classList.add("highlight");
box.classList.toggle("active");

// Button event example
document.getElementById("btn").onclick = function() {
  box.classList.toggle("highlight");
};
</script>

</body>
</html>
```

---

# Summary of Day 20

You learned:

- ✔ The **DOM concept** for accessing and manipulating HTML
- ✔ Selecting elements using:

  * `getElementById`
  * `getElementsByClassName`
  * `querySelector`
  * `querySelectorAll`

- ✔ Modifying elements: `innerText`, `innerHTML`, styles
- ✔ Creating and removing elements dynamically
- ✔ Adding, removing, and toggling **classes**

---

# Practice Tasks

### Task 1

Select an element by `id` and change its text.

---

### Task 2

Select all elements with a class and log them.

---

### Task 3

Change the **color and font size** of an element dynamically.

---

### Task 4

Create a new `<div>` with text and append to the body.

---

### Task 5

Remove a paragraph element by its `id`.

---

### Task 6

Add a class to an element, then remove it after 3 seconds.

---

### Task 7

Use `toggle` to add/remove a class when a button is clicked.

---

### Task 8

Use `querySelectorAll` to iterate over elements and change their text.

---

### Task 9

Modify the `innerHTML` of a container to include multiple `<p>` elements.

---

### Task 10

## Combine element creation and style changes to build a small dynamic list.
