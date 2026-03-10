
# Day 12 — Flexbox Layout

Today, you will learn **CSS Flexbox**, a powerful layout module to create **responsive, flexible layouts**.  
Flexbox makes it easy to **align, distribute, and reorder elements** inside a container.

---

# 1. Flex Container

A **flex container** is created using:

```css
display: flex;
````

All **direct children** of this container become **flex items**.

---

## 1.1 `flex-direction`

Defines the **direction of the main axis**:

* `row` → horizontal, left to right (default)
* `row-reverse` → horizontal, right to left
* `column` → vertical, top to bottom
* `column-reverse` → vertical, bottom to top

### Example

```css id="flex_direction"
.container {
  display: flex;
  flex-direction: row; /* elements arranged horizontally */
}
```

---

## 1.2 `justify-content`

Aligns **flex items along the main axis**.

Values:

* `flex-start` → start
* `flex-end` → end
* `center` → center
* `space-between` → equal space between items
* `space-around` → space around items
* `space-evenly` → equal space around and between

### Example

```css id="justify_content"
.container {
  display: flex;
  justify-content: space-between;
}
```

---

## 1.3 `align-items`

Aligns **flex items along the cross axis** (perpendicular to main axis).

Values:

* `flex-start`
* `flex-end`
* `center`
* `stretch` (default)
* `baseline`

### Example

```css id="align_items"
.container {
  display: flex;
  align-items: center;
}
```

---

## 1.4 `align-content`

Aligns **multiple rows of flex items** when wrapped.

Values: same as `align-items`: `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `stretch`

### Example

```css id="align_content"
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
}
```

---

# 2. Flex Items

---

## 2.1 `flex-wrap`

Controls whether **items wrap onto multiple lines**.

* `nowrap` → single line (default)
* `wrap` → wrap to next line
* `wrap-reverse` → wrap in reverse order

### Example

```css id="flex_wrap"
.container {
  display: flex;
  flex-wrap: wrap;
}
```

---

## 2.2 `flex-grow`

Defines how much a flex item **grows relative to others**.

### Example

```css id="flex_grow"
.item {
  flex-grow: 1; /* grows to fill available space */
}
```

---

## 2.3 `flex-shrink`

Defines how a flex item **shrinks** when space is limited.

### Example

```css id="flex_shrink"
.item {
  flex-shrink: 0; /* prevent shrinking */
}
```

---

## 2.4 `flex-basis`

Defines the **initial main size** of a flex item before growing or shrinking.

### Example

```css id="flex_basis"
.item {
  flex-basis: 200px; /* start at 200px */
}
```

---

## 2.5 `order`

Defines the **order of flex items** (default: 0)

### Example

```css id="flex_order"
.item1 {
  order: 2;
}

.item2 {
  order: 1;
}
```

* `item2` will appear before `item1` visually.

---

# Complete Example: Flexbox Layout

```html id="flexbox_complete"
<!DOCTYPE html>
<html>
<head>
<title>Flexbox Example</title>
<style>
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  background-color: lightgray;
  padding: 10px;
}

.item {
  background-color: lightblue;
  width: 100px;
  height: 100px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

/* Flex grow, shrink, basis */
.item1 {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 150px;
  order: 2;
}

.item2 {
  flex-grow: 2;
  flex-shrink: 1;
  flex-basis: 100px;
  order: 1;
}

.item3 {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 120px;
}
</style>
</head>
<body>

<h1>Flexbox Layout Example</h1>

<div class="container">
  <div class="item item1">Item 1</div>
  <div class="item item2">Item 2</div>
  <div class="item item3">Item 3</div>
  <div class="item item4">Item 4</div>
  <div class="item item5">Item 5</div>
</div>

</body>
</html>
```

---

# Summary of Day 12

You learned:

- ✔ Creating a flex container using `display: flex`
- ✔ Flex container properties: `flex-direction`, `justify-content`, `align-items`, `align-content`
- ✔ Flex item properties: `flex-wrap`, `flex-grow`, `flex-shrink`, `flex-basis`, `order`
- ✔ Wrapping, alignment, and ordering of flex items for responsive layouts

---

# Practice Tasks

### Task 1

Create a flex container with **row direction** and 3 items.

---

### Task 2

Use `justify-content: space-between` to distribute items.

---

### Task 3

Center items vertically using `align-items: center`.

---

### Task 4

Add more items and make them **wrap** using `flex-wrap`.

---

### Task 5

Use `flex-grow` to allow one item to expand more than others.

---

### Task 6

Set `flex-shrink: 0` to prevent shrinking on small screens.

---

### Task 7

Set `flex-basis` for each item to define initial sizes.

---

### Task 8

Change the visual **order** of flex items using `order`.

---

### Task 9

Experiment with `flex-direction: column` and `row-reverse`.

---

### Task 10

## Build a **mini responsive layout** combining all flex container and item properties.