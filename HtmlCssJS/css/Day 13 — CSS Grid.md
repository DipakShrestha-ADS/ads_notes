
# Day 13 — CSS Grid

Today, you will learn **CSS Grid**, a powerful 2-dimensional layout system for **rows and columns**.  
CSS Grid allows precise control over **placement, spacing, and alignment** of elements on a webpage.

---

# 1. Creating a Grid Container

Use:

```css
display: grid;
````

All **direct children** of this container become **grid items**.

### Example

```css id="grid_container"
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  grid-template-rows: 100px 100px;       /* 2 rows of 100px */
  grid-gap: 10px;                        /* gap between rows & columns */
}
```

---

# 2. Grid Columns

Defines **columns in the grid**.

* `grid-template-columns: 100px 200px 1fr;` → first column 100px, second 200px, third takes remaining space

### Example

```css id="grid_columns"
.container {
  display: grid;
  grid-template-columns: 150px 1fr 2fr;
}
```

---

# 3. Grid Rows

Defines **rows in the grid**.

* `grid-template-rows: 100px 200px auto;` → heights of rows

### Example

```css id="grid_rows"
.container {
  display: grid;
  grid-template-rows: 100px 200px 100px;
}
```

---

# 4. Grid Gap

* `grid-gap` or `gap` → spacing between rows and columns

### Example

```css id="grid_gap"
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 15px;
}
```

---

# 5. Grid Template Areas

Assign **names to grid areas** for easier placement.

### Example

```css id="grid_template_areas"
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 100px 100px;
  grid-template-areas:
    "header header"
    "sidebar main";
}

.header { grid-area: header; background: lightblue; }
.sidebar { grid-area: sidebar; background: lightgreen; }
.main { grid-area: main; background: lightcoral; }
```

---

# 6. Grid Spanning

Grid items can **span multiple rows or columns** using `grid-column` and `grid-row`.

### Example

```css id="grid_spanning"
.item1 {
  grid-column: 1 / 3; /* spans columns 1 to 2 */
  grid-row: 1 / 2;    /* spans first row */
}
```

---

# 7. Nested Grids

Grids can **contain another grid** inside a grid item.

### Example

```css id="nested_grid"
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
}

.item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
}
```

---

# 8. Layout Comparison: Grid vs Flexbox

| Feature        | Grid                            | Flexbox            |
| -------------- | ------------------------------- | ------------------ |
| Dimensions     | 2D (rows & columns)             | 1D (row or column) |
| Use Case       | Complex layouts                 | Linear layouts     |
| Alignment      | Rows & columns independently    | Main axis only     |
| Item Placement | Precise control with grid lines | Order in flow      |

**Tip:** Use Flexbox for **smaller UI components**, Grid for **full-page layouts**.

---

# Complete Example: CSS Grid

```html id="grid_complete"
<!DOCTYPE html>
<html>
<head>
<title>CSS Grid Example</title>
<style>
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 100px 100px;
  grid-gap: 10px;
  grid-template-areas:
    "header header"
    "sidebar main";
}

.header { grid-area: header; background-color: lightblue; display: flex; align-items: center; justify-content: center; }
.sidebar { grid-area: sidebar; background-color: lightgreen; display: flex; align-items: center; justify-content: center; }
.main { grid-area: main; background-color: lightcoral; display: flex; align-items: center; justify-content: center; }

.item1 { grid-column: 1 / 3; grid-row: 1 / 2; background-color: orange; }
.nested {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
}
.nested div { background-color: yellow; padding: 10px; text-align: center; }
</style>
</head>
<body>

<h1>CSS Grid Layout</h1>

<div class="container">
  <div class="header">Header</div>
  <div class="sidebar">
    Sidebar
    <div class="nested">
      <div>Nested 1</div>
      <div>Nested 2</div>
    </div>
  </div>
  <div class="main">Main Content</div>
</div>

</body>
</html>
```

---

# Summary of Day 13

You learned:

- ✔ Creating a grid container using `display: grid`
- ✔ Defining **grid columns and rows**
- ✔ Using **grid gaps**
- ✔ **Grid template areas** for semantic layout
- ✔ Grid spanning with `grid-column` and `grid-row`
- ✔ Nested grids
- ✔ Difference between **Grid and Flexbox**

---

# Practice Tasks

### Task 1

Create a 3x2 grid layout with equal columns and rows.

---

### Task 2

Use `grid-gap` to add spacing between grid items.

---

### Task 3

Assign **grid template areas** for header, sidebar, and main content.

---

### Task 4

Make one item span **two columns**.

---

### Task 5

Nest a small grid inside a grid item with 2x2 layout.

---

### Task 6

Experiment with `grid-template-columns` using `1fr`, `2fr`, `auto`.

---

### Task 7

Compare layout using **Flexbox** vs **Grid** for the same elements.

---

### Task 8

Create a dashboard layout with **header, sidebar, main, footer** using grid areas.

---

### Task 9

Use `grid-column` and `grid-row` to manually place items.

---

### Task 10

## Build a **complete webpage layout** using grid with multiple rows, columns, and nested grids.