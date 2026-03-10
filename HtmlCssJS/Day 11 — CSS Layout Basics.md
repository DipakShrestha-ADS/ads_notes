
# Day 11 — CSS Layout Basics

Today, you will learn about **CSS layout properties** that control how elements are displayed and positioned on a page.  
This includes **display, visibility, float, positioning, and layering with z-index**.

---

# 1. Display Property

The `display` property defines **how an element is displayed** in the document flow.

---

## 1.1 `block`

- Takes **full width** available  
- Starts on a **new line**  
- Examples: `<div>`, `<p>`, `<h1>`

### Example

```css id="display_block"
div {
  display: block;
  width: 300px;
  background-color: lightblue;
}
````

---

## 1.2 `inline`

* Takes **only as much width as content**
* **Does not start on a new line**
* Examples: `<span>`, `<a>`

### Example

```css id="display_inline"
span {
  display: inline;
  color: red;
}
```

---

## 1.3 `inline-block`

* Behaves like **inline** but allows **width and height**
* Can sit next to other inline-block elements

### Example

```css id="display_inline_block"
div {
  display: inline-block;
  width: 150px;
  height: 100px;
  background-color: lightgreen;
  margin: 5px;
}
```

---

## 1.4 `none`

* Hides element completely (like `display: hidden`)
* Does not occupy space

### Example

```css id="display_none"
p {
  display: none;
}
```

---

# 2. Visibility

* `visible` → default, element is shown
* `hidden` → element is **invisible but occupies space**

### Example

```css id="visibility_example"
div {
  visibility: hidden;
  width: 200px;
  height: 50px;
  background-color: yellow;
}
```

---

# 3. Float Layout

The `float` property allows elements to **float to left or right**.

---

## 3.1 Float

* `left` → floats left
* `right` → floats right
* Used for **images, columns, or menus**

### Example

```css id="float_example"
img {
  float: left;
  margin-right: 10px;
}
```

---

## 3.2 Clear

* Prevents elements from **wrapping around floated elements**
* Values: `left`, `right`, `both`, `none`

### Example

```css id="clear_example"
div.clear {
  clear: both;
}
```

---

# 4. Positioning

The `position` property controls **element placement**.

---

## 4.1 `static`

* Default position
* Element appears in **normal document flow**

```css id="pos_static"
div.static {
  position: static;
}
```

---

## 4.2 `relative`

* Positioned **relative to its normal position**
* Allows **top, bottom, left, right offsets**

### Example

```css id="pos_relative"
div.relative {
  position: relative;
  top: 10px;
  left: 20px;
}
```

---

## 4.3 `absolute`

* Positioned **relative to nearest positioned ancestor**
* Removed from normal flow

### Example

```css id="pos_absolute"
div.absolute {
  position: absolute;
  top: 50px;
  left: 100px;
}
```

---

## 4.4 `fixed`

* Fixed relative to **viewport**
* Stays in place when scrolling

### Example

```css id="pos_fixed"
div.fixed {
  position: fixed;
  top: 0;
  right: 0;
  width: 150px;
  background-color: lightcoral;
}
```

---

## 4.5 `sticky`

* Behaves **like relative until a scroll threshold**, then becomes fixed

### Example

```css id="pos_sticky"
h2.sticky {
  position: sticky;
  top: 0; /* sticks to top when scrolling */
  background-color: yellow;
}
```

---

# 5. Layering with `z-index`

* Controls **stacking order** of positioned elements (`relative`, `absolute`, `fixed`, `sticky`)
* Higher `z-index` → on top

### Example

```css id="z_index_example"
div.box1 {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 150px;
  height: 150px;
  background-color: red;
  z-index: 1;
}

div.box2 {
  position: absolute;
  top: 100px;
  left: 100px;
  width: 150px;
  height: 150px;
  background-color: blue;
  z-index: 2;
}
```

---

# Complete Example: Layout Basics

```html id="layout_complete"
<!DOCTYPE html>
<html>
<head>
<title>CSS Layout Basics</title>
<style>
/* Display examples */
.block-box {
  display: block;
  width: 200px;
  background-color: lightblue;
  margin-bottom: 10px;
}

.inline-box {
  display: inline;
  color: red;
}

.inline-block-box {
  display: inline-block;
  width: 150px;
  height: 100px;
  background-color: lightgreen;
  margin: 5px;
}

/* Float example */
img {
  float: left;
  margin-right: 10px;
}

/* Clear float */
.clear {
  clear: both;
}

/* Position examples */
div.relative {
  position: relative;
  top: 10px;
  left: 20px;
  background-color: orange;
  width: 150px;
  height: 50px;
}

div.absolute {
  position: absolute;
  top: 50px;
  left: 200px;
  background-color: pink;
  width: 150px;
  height: 50px;
}

div.fixed {
  position: fixed;
  top: 0;
  right: 0;
  background-color: lightcoral;
  width: 150px;
  height: 50px;
}

h2.sticky {
  position: sticky;
  top: 0;
  background-color: yellow;
}

/* Z-index example */
div.box1 {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 150px;
  height: 150px;
  background-color: red;
  z-index: 1;
}

div.box2 {
  position: absolute;
  top: 100px;
  left: 100px;
  width: 150px;
  height: 150px;
  background-color: blue;
  z-index: 2;
}
</style>
</head>
<body>

<h1>CSS Layout Basics</h1>

<div class="block-box">Block Box</div>
<span class="inline-box">Inline Box 1</span>
<span class="inline-box">Inline Box 2</span>
<br>
<div class="inline-block-box">Inline-Block Box 1</div>
<div class="inline-block-box">Inline-Block Box 2</div>

<img src="https://via.placeholder.com/50" alt="Image">
<p>Text beside image. Lorem ipsum dolor sit amet.</p>
<div class="clear"></div>

<div class="relative">Relative</div>
<div class="absolute">Absolute</div>
<div class="fixed">Fixed</div>

<h2 class="sticky">Sticky Header</h2>
<p>Scroll down to see sticky effect.</p>
<p>More content...</p>

<div class="box1"></div>
<div class="box2"></div>

</body>
</html>
```

---

# Summary of Day 11

You learned:

- ✔ Display types: `block`, `inline`, `inline-block`, `none`
- ✔ Visibility: `visible` vs `hidden`
- ✔ Float and clear
- ✔ Positioning: `static`, `relative`, `absolute`, `fixed`, `sticky`
- ✔ Layering using `z-index`

---

# Practice Tasks

### Task 1

Create three divs with **block, inline, and inline-block** display.

---

### Task 2

Experiment with `visibility: hidden` and `display: none`.

---

### Task 3

Float an image to the left with text wrapping.

---

### Task 4

Clear float after an image using `clear: both`.

---

### Task 5

Create a div with `position: relative` and move it using `top` and `left`.

---

### Task 6

Create a div with `position: absolute` inside a relative container.

---

### Task 7

Create a fixed header using `position: fixed`.

---

### Task 8

Create a sticky header using `position: sticky`.

---

### Task 9

Create two overlapping boxes with different `z-index`.

---

### Task 10

## Build a **mini layout** combining display, float, positioning, and z-index for practice.