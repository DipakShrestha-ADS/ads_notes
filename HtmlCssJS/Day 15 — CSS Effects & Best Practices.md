
# Day 15 — CSS Effects & Best Practices

Today, you will learn **CSS effects**, **animations**, **modern CSS techniques**, and **best practices** for writing maintainable and performant CSS.

---

# 1. CSS Effects

CSS effects make your elements **interactive and visually engaging**.

---

## 1.1 CSS Transitions

- Smoothly change **property values** over time
- Syntax:

```css id="transition_syntax"
transition: property duration timing-function delay;
````

### Example

```css id="transition_example"
.button {
  background-color: lightblue;
  padding: 10px 20px;
  transition: background-color 0.5s ease;
}

.button:hover {
  background-color: lightgreen; /* changes smoothly on hover */
}
```

---

## 1.2 CSS Transforms

Transforms allow you to **rotate, scale, or move elements**.

### Example: Rotate

```css id="transform_rotate"
.box {
  width: 100px;
  height: 100px;
  background-color: coral;
  transition: transform 0.5s;
}

.box:hover {
  transform: rotate(45deg);
}
```

### Example: Scale

```css id="transform_scale"
.box:hover {
  transform: scale(1.5); /* increase size 1.5x */
}
```

### Example: Translate

```css id="transform_translate"
.box:hover {
  transform: translate(50px, 20px); /* move right 50px, down 20px */
}
```

---

# 2. Animations

CSS animations allow **complex sequences** over time using `@keyframes`.

---

## 2.1 `@keyframes`

Define animation steps:

```css id="keyframes_syntax"
@keyframes example {
  0%   { transform: translateX(0); }
  50%  { transform: translateX(50px); }
  100% { transform: translateX(0); }
}
```

---

## 2.2 Animation Properties

* `animation-name` → name of keyframes
* `animation-duration` → time to complete
* `animation-iteration-count` → number of repeats (`infinite` for endless)
* `animation-timing-function` → speed curve (`ease`, `linear`, etc.)

### Example

```css id="animation_example"
.box {
  width: 100px;
  height: 100px;
  background-color: lightcoral;
  animation-name: move;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes move {
  0% { transform: translateX(0); }
  50% { transform: translateX(100px); }
  100% { transform: translateX(0); }
}
```

---

# 3. Modern CSS

---

## 3.1 CSS Variables (Custom Properties)

* Define reusable **values**
* Syntax: `--variable-name: value;`
* Use: `var(--variable-name)`

### Example

```css id="css_variables"
:root {
  --main-color: lightblue;
  --padding: 10px;
}

.button {
  background-color: var(--main-color);
  padding: var(--padding);
}
```

---

# 4. Best Practices

---

## 4.1 CSS Organization

* Group related styles together
* Use **comments** for sections
* Use **consistent naming conventions** (BEM, SMACSS)

### Example

```css id="css_organization"
/* Buttons */
.button { ... }
/* Forms */
input { ... }
```

---

## 4.2 Performance Optimization

* Minimize **DOM size** and unnecessary selectors
* Avoid **overly complex selectors**
* Use **CSS shorthand** where possible
* Minify CSS for production

### Example

```css id="css_shorthand"
margin: 10px 5px 15px 0; /* top right bottom left */
padding: 5px 10px;        /* top-bottom, left-right */
```

---

# Complete Example: CSS Effects

```html id="css_effects_complete"
<!DOCTYPE html>
<html>
<head>
<title>CSS Effects Example</title>
<style>
/* CSS Variables */
:root {
  --main-color: lightblue;
  --hover-color: lightgreen;
  --box-size: 100px;
}

/* Button with transition */
.button {
  background-color: var(--main-color);
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.5s ease, transform 0.5s ease;
}

.button:hover {
  background-color: var(--hover-color);
  transform: scale(1.2);
}

/* Box with animation */
.box {
  width: var(--box-size);
  height: var(--box-size);
  background-color: lightcoral;
  animation: move 2s ease-in-out infinite;
  margin-top: 20px;
}

/* Keyframes */
@keyframes move {
  0% { transform: translateX(0); }
  50% { transform: translateX(100px); }
  100% { transform: translateX(0); }
}
</style>
</head>
<body>

<h1>CSS Effects & Animations</h1>

<button class="button">Hover Me</button>

<div class="box"></div>

</body>
</html>
```

---

# Summary of Day 15

You learned:

- ✔ CSS transitions for smooth effects
- ✔ CSS transforms: `rotate`, `scale`, `translate`
- ✔ CSS animations using `@keyframes`
- ✔ CSS variables for reusable values
- ✔ Best practices: organization and performance optimization

---

# Practice Tasks

### Task 1

Create a button with a **hover transition** for background color and scale.

---

### Task 2

Create a box that **rotates** on hover.

---

### Task 3

Animate a box moving **left to right** infinitely using `@keyframes`.

---

### Task 4

Use **CSS variables** to define colors and padding.

---

### Task 5

Create a card with **shadow and scale transform** on hover.

---

### Task 6

Use **transition** on text color change.

---

### Task 7

Animate multiple boxes with **different delays**.

---

### Task 8

Organize CSS with **sections and comments** for buttons, forms, and layout.

---

### Task 9

Optimize selectors for better performance.

---

### Task 10

## Build a small **interactive UI** with buttons and animated boxes applying all learned effects.
