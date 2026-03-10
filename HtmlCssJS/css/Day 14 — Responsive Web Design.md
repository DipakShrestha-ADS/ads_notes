
# Day 14 — Responsive Web Design

Today, you will learn **how to make websites adapt to different screen sizes**.  
Responsive design ensures **websites look good on mobiles, tablets, and desktops**.

---

# 1. Mobile-First Design

- Start designing for **small screens first**, then scale up  
- Benefits:
  - Faster load for mobile users  
  - Easier to scale for larger screens  

### Example

```css id="mobile_first"
body {
  font-size: 16px; /* default for mobile */
}

@media(min-width: 768px) {
  body {
    font-size: 18px; /* larger font for tablets */
  }
}

@media(min-width: 1200px) {
  body {
    font-size: 20px; /* larger font for desktops */
  }
}
````

---

# 2. Media Queries

Media queries apply **CSS rules based on device characteristics**.

### Syntax

```css id="media_query_syntax"
@media (condition) {
  /* CSS rules */
}
```

### Example: Breakpoints

```css id="breakpoints_example"
/* Small devices (phones) */
@media (max-width: 600px) {
  body { background-color: lightyellow; }
}

/* Medium devices (tablets) */
@media (min-width: 601px) and (max-width: 1024px) {
  body { background-color: lightblue; }
}

/* Large devices (desktops) */
@media (min-width: 1025px) {
  body { background-color: lightgreen; }
}
```

---

# 3. Responsive Techniques

---

## 3.1 Responsive Images

* Use `%`, `max-width: 100%`, or `<picture>` element

### Example

```css id="responsive_images"
img {
  max-width: 100%;
  height: auto;
}
```

```html
<picture>
  <source media="(max-width: 600px)" srcset="small.jpg">
  <source media="(max-width: 1200px)" srcset="medium.jpg">
  <img src="large.jpg" alt="Responsive Image">
</picture>
```

---

## 3.2 Responsive Typography

* Use **relative units** like `em`, `rem`, `%` instead of `px`

### Example

```css id="responsive_typography"
body {
  font-size: 1rem; /* scalable */
}

h1 {
  font-size: 2rem;
}

@media (max-width: 600px) {
  h1 {
    font-size: 1.5rem;
  }
}
```

---

## 3.3 Responsive Layouts

* Use **flexbox, grid, or percentages** instead of fixed px widths

### Example

```css id="responsive_layouts"
.container {
  display: flex;
  flex-wrap: wrap;
}

.item {
  flex: 1 1 200px; /* grow, shrink, basis */
  margin: 10px;
}
```

---

## 3.4 Responsive Navigation

* Collapse menu for smaller screens using CSS or JavaScript

### Example

```css id="responsive_nav"
.navbar {
  display: flex;
  flex-wrap: wrap;
}

.navbar a {
  flex: 1 1 100px;
  text-align: center;
  padding: 10px;
}

/* Mobile layout */
@media (max-width: 600px) {
  .navbar a {
    flex: 1 1 100%; /* stack links vertically */
  }
}
```

---

# Complete Example: Responsive Web Page

```html id="responsive_complete"
<!DOCTYPE html>
<html>
<head>
<title>Responsive Design Example</title>
<style>
body {
  font-family: Arial, sans-serif;
  font-size: 16px;
  margin: 0;
}

header {
  background-color: lightblue;
  padding: 10px;
  text-align: center;
}

.container {
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
}

.item {
  flex: 1 1 200px;
  margin: 10px;
  background-color: lightgreen;
  padding: 20px;
  text-align: center;
}

img {
  max-width: 100%;
  height: auto;
}

/* Mobile-first typography */
h1 {
  font-size: 2rem;
}

/* Responsive navigation */
.navbar {
  display: flex;
  flex-wrap: wrap;
  background-color: lightgray;
  padding: 5px;
}

.navbar a {
  flex: 1 1 100px;
  text-align: center;
  padding: 10px;
  text-decoration: none;
  color: black;
}

/* Breakpoints */
@media (max-width: 600px) {
  h1 { font-size: 1.5rem; }
  .navbar a { flex: 1 1 100%; }
}
</style>
</head>
<body>

<header>
  <h1>Responsive Web Design</h1>
</header>

<nav class="navbar">
  <a href="#">Home</a>
  <a href="#">About</a>
  <a href="#">Services</a>
  <a href="#">Contact</a>
</nav>

<div class="container">
  <div class="item">
    <h2>Item 1</h2>
    <img src="https://via.placeholder.com/200" alt="Item 1">
  </div>
  <div class="item">
    <h2>Item 2</h2>
    <img src="https://via.placeholder.com/200" alt="Item 2">
  </div>
  <div class="item">
    <h2>Item 3</h2>
    <img src="https://via.placeholder.com/200" alt="Item 3">
  </div>
</div>

</body>
</html>
```

---

# Summary of Day 14

You learned:

- ✔ Mobile-first design approach
- ✔ Using **media queries** to target breakpoints
- ✔ Responsive techniques for images, typography, layouts, and navigation
- ✔ How to make pages look good on **different screen sizes**

---

# Practice Tasks

### Task 1

Create a webpage that **adapts font-size** for mobile, tablet, and desktop using media queries.

---

### Task 2

Use `max-width: 100%` to make images responsive.

---

### Task 3

Create a flexbox container with items that **wrap on small screens**.

---

### Task 4

Make a navigation menu **stack vertically on screens smaller than 600px**.

---

### Task 5

Experiment with **breakpoints**: 480px, 768px, 1024px.

---

### Task 6

Use **relative units** like `em` or `rem` for all typography.

---

### Task 7

Add multiple responsive images using `<picture>` with different source sizes.

---

### Task 8

Create a card layout that **reflows on small screens**.

---

### Task 9

Combine **flexbox and media queries** to make a 2-column layout responsive.

---

### Task 10

## Build a **mini responsive landing page** including header, navigation, image section, and cards.