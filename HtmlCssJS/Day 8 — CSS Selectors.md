# Day 8 — CSS Selectors

Today, you will learn about **CSS selectors**, which are used to **target HTML elements** for styling.  
Selectors allow you to **apply styles to specific elements, groups, or patterns**.

You will also learn **CSS concepts** like specificity and cascade.

---

# 1. Element Selector

Targets **HTML tags directly**.

### Example

```css id="el_selector"
p {
  color: blue;
  font-size: 16px;
}
````

### Explanation

```text id="el_expl"
p → targets all <p> elements
color → sets text color
font-size → sets size of text
```

---

# 2. Class Selector

Targets elements with a **specific class**.
Class selector starts with a `.`

### Example

```css id="class_selector"
.highlight {
  background-color: yellow;
}
```

```html id="class_html"
<p class="highlight">This is highlighted text.</p>
```

### Explanation

* `.highlight` → targets elements with class="highlight"
* Multiple elements can share the same class

---

# 3. ID Selector

Targets an element with a **specific id**.
ID selector starts with `#`

### Example

```css id="id_selector"
#main-title {
  color: red;
  text-align: center;
}
```

```html id="id_html"
<h1 id="main-title">Welcome</h1>
```

### Explanation

* `#main-title` → targets element with id="main-title"
* IDs must be **unique** on the page

---

# 4. Group Selector

Apply **same styles to multiple elements** using a comma.

### Example

```css id="group_selector"
h1, h2, p {
  font-family: Arial, sans-serif;
}
```

### Explanation

* `h1, h2, p` → all h1, h2, and p elements share the same styles

---

# 5. Universal Selector

Targets **all elements** on the page.

### Example

```css id="universal_selector"
* {
  margin: 0;
  padding: 0;
}
```

### Explanation

* `*` → applies style to every element
* Useful for **resetting default browser styles**

---

# 6. Descendant Selector

Targets elements **inside another element**, no matter how deep.

### Example

```css id="descendant_selector"
div p {
  color: green;
}
```

### Explanation

* `div p` → selects all `<p>` elements **inside any `<div>`**
* Can be nested multiple levels deep

---

# 7. Child Selector

Targets **direct children only** using `>`.

### Example

```css id="child_selector"
div > p {
  color: purple;
}
```

### Explanation

* `div > p` → only `<p>` that are **immediate children** of `<div>`

---

# 8. Sibling Selectors

### 8.1 Adjacent Sibling (`+`)

Targets the **next sibling element**.

```css id="adj_sibling"
h1 + p {
  color: orange;
}
```

* `p` immediately **after h1** will be styled

### 8.2 General Sibling (`~`)

Targets **all siblings after an element**.

```css id="gen_sibling"
h1 ~ p {
  color: gray;
}
```

* All `<p>` after `<h1>` **at the same level**

---

# 9. Attribute Selectors

Target elements with **specific attributes**.

### Examples

```css id="attr_selector1"
/* Select all input elements with type="text" */
input[type="text"] {
  border: 1px solid black;
}

/* Select all elements with title attribute */
[title] {
  color: blue;
}
```

---

# 10. CSS Concepts

## 10.1 CSS Specificity

Determines **which style wins** if multiple rules apply.

* Inline CSS → **highest priority**
* ID selector → higher than class
* Class selector → higher than element
* Element selector → lowest

### Example

```html id="specificity_html"
<p id="para1" class="highlight">Hello</p>
```

```css id="specificity_css"
p { color: blue; } /* lowest */
.highlight { color: green; } /* medium */
#para1 { color: red; } /* highest */
```

Result: **text will be red** due to ID selector.

---

## 10.2 CSS Cascade

When multiple styles **conflict**, the browser uses:

1. Specificity
2. Order of CSS (later rules override earlier)
3. Inline styles override everything

### Example

```css id="cascade_css"
p { color: blue; }
p { color: green; } /* overrides previous */
```

Result: **green** text color.

---

# Complete Example: CSS Selectors

```html id="selectors_html"
<!DOCTYPE html>
<html>
<head>
<style>
/* Element Selector */
p {
  font-size: 16px;
}

/* Class Selector */
.highlight {
  background-color: yellow;
}

/* ID Selector */
#main-title {
  color: red;
  text-align: center;
}

/* Group Selector */
h1, h2 {
  font-family: Arial, sans-serif;
}

/* Universal Selector */
* {
  box-sizing: border-box;
}

/* Descendant Selector */
div p {
  color: green;
}

/* Child Selector */
div > h2 {
  color: purple;
}

/* Adjacent Sibling */
h1 + p {
  color: orange;
}

/* General Sibling */
h1 ~ p {
  font-weight: bold;
}

/* Attribute Selector */
input[type="text"] {
  border: 1px solid black;
}
</style>
</head>
<body>

<h1 id="main-title">Welcome</h1>
<p class="highlight">This is a highlighted paragraph.</p>
<div>
  <h2>Section Title</h2>
  <p>Paragraph inside div.</p>
</div>
<p>Another paragraph after h1.</p>
<input type="text" placeholder="Enter text">

</body>
</html>
```

---

# Summary of Day 8

You learned:

- ✔ Element selectors
- ✔ Class selectors
- ✔ ID selectors
- ✔ Group selectors
- ✔ Universal selector
- ✔ Descendant and Child selectors
- ✔ Sibling selectors (adjacent and general)
- ✔ Attribute selectors
- ✔ CSS specificity rules
- ✔ CSS cascade principles

---

# Practice Tasks

### Task 1

Style all `<p>` elements using **element selector**.

---

### Task 2

Add **highlight class** and style using class selector.

---

### Task 3

Style a heading using **ID selector**.

---

### Task 4

Use a **group selector** for multiple headings.

---

### Task 5

Reset all elements using **universal selector**.

---

### Task 6

Select `<p>` **inside a `<div>`** using descendant selector.

---

### Task 7

Select **direct child `<h2>`** inside `<div>` using child selector.

---

### Task 8

Style **adjacent and general sibling paragraphs**.

---

### Task 9

Style **input fields** using attribute selector for `type="text"`.

---

### Task 10

## Test **CSS specificity** by applying **element, class, and ID** styles on the same element.