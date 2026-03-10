
# Day 21 — Events

Today, you will learn how to **make web pages interactive** by handling **events** like clicks, keyboard input, and form submissions.  
We will also explore **event flow** and controlling default browser behaviors.

---

# 1. Event Handling

- An **event** is an action performed by the user or browser, e.g., clicking, typing, submitting a form.  
- JavaScript allows us to **respond to events** using **event handlers**.

---

# 2. Event Listeners

### Adding Event Listener

```javascript id="event_listener"
let button = document.getElementById("btn");

button.addEventListener("click", function() {
  alert("Button Clicked!");
});
````

* `addEventListener(event, function)`
* Modern and **preferred method** over inline `onclick`

---

# 3. Mouse Events

Common mouse events:

| Event       | Description                  |
| ----------- | ---------------------------- |
| `click`     | Mouse click                  |
| `dblclick`  | Double click                 |
| `mouseover` | Mouse pointer enters element |
| `mouseout`  | Mouse pointer leaves element |
| `mousedown` | Mouse button pressed         |
| `mouseup`   | Mouse button released        |

### Example

```javascript id="mouse_events"
let box = document.getElementById("box");

box.addEventListener("mouseover", function() {
  box.style.backgroundColor = "yellow";
});

box.addEventListener("mouseout", function() {
  box.style.backgroundColor = "lightblue";
});
```

---

# 4. Keyboard Events

Common keyboard events:

| Event      | Description                 |
| ---------- | --------------------------- |
| `keydown`  | Key pressed                 |
| `keyup`    | Key released                |
| `keypress` | Key being held (deprecated) |

### Example

```javascript id="keyboard_events"
document.addEventListener("keydown", function(event) {
  console.log("Key pressed:", event.key);
});
```

---

# 5. Form Events

Form-related events:

| Event    | Description         |
| -------- | ------------------- |
| `submit` | Form submitted      |
| `change` | Input value changed |
| `focus`  | Input focused       |
| `blur`   | Input lost focus    |

### Example: Form Submission

```javascript id="form_event"
let form = document.getElementById("myForm");

form.addEventListener("submit", function(event) {
  event.preventDefault(); // prevent actual form submission
  alert("Form submitted!");
});
```

---

# 6. Event Flow

### 6.1 Event Propagation

* **Bubbling**: Event flows from child → parent → document
* **Capturing**: Event flows from document → parent → child

```javascript id="event_flow"
document.getElementById("child").addEventListener("click", function() {
  alert("Child clicked!");
}, true); // true = capturing
```

### 6.2 Prevent Default

* Stops browser from performing default action

```javascript id="prevent_default"
let link = document.getElementById("link");
link.addEventListener("click", function(event) {
  event.preventDefault(); // stops navigation
  alert("Default prevented!");
});
```

---

# Complete Example: Events

```html id="js_day21_complete"
<!DOCTYPE html>
<html>
<head>
  <title>JavaScript Events</title>
  <style>
    #box {
      width: 150px;
      height: 150px;
      background-color: lightblue;
      margin: 20px;
      text-align: center;
      line-height: 150px;
    }
  </style>
</head>
<body>

<h1>Events Example</h1>

<button id="btn">Click Me</button>

<div id="box">Hover Me</div>

<form id="myForm">
  <input type="text" placeholder="Enter Name" required>
  <button type="submit">Submit</button>
</form>

<a href="https://www.example.com" id="link">Go to Example</a>

<script>
// Button click
document.getElementById("btn").addEventListener("click", function() {
  alert("Button clicked!");
});

// Mouse hover
let box = document.getElementById("box");
box.addEventListener("mouseover", () => box.style.backgroundColor = "yellow");
box.addEventListener("mouseout", () => box.style.backgroundColor = "lightblue");

// Keyboard event
document.addEventListener("keydown", function(event) {
  console.log("Key pressed:", event.key);
});

// Form submission
let form = document.getElementById("myForm");
form.addEventListener("submit", function(event) {
  event.preventDefault(); // prevent actual submission
  alert("Form submitted!");
});

// Prevent default link behavior
let link = document.getElementById("link");
link.addEventListener("click", function(event) {
  event.preventDefault();
  alert("Navigation prevented!");
});
</script>

</body>
</html>
```

---

# Summary of Day 21

You learned:

- ✔ What **events** are and how to handle them
- ✔ How to use **event listeners**
- ✔ Common **mouse, keyboard, and form events**
- ✔ **Event propagation**: capturing vs bubbling
- ✔ How to **prevent default behavior**

---

# Practice Tasks

### Task 1

Add a button that **alerts** a message when clicked.

---

### Task 2

Create a `<div>` that changes color on **mouseover** and resets on **mouseout**.

---

### Task 3

Log key presses using `keydown` event.

---

### Task 4

Prevent a link from navigating and show an alert instead.

---

### Task 5

Prevent a form from submitting and display a console message.

---

### Task 6

Use **event bubbling**: click on child element and detect parent click.

---

### Task 7

Use **event capturing** instead of bubbling.

---

### Task 8

Create a **hover effect** that changes multiple style properties.

---

### Task 9

Combine mouse and keyboard events to trigger an action.

---

### Task 10

## Create a form with **focus** and **blur** events on inputs and log messages.
