# Day 7 — Introduction to CSS

Today, you will learn about **CSS (Cascading Style Sheets)** and how it is used to **style HTML content**.  
CSS allows you to control:

- Colors  
- Fonts  
- Layout  
- Backgrounds  
- Spacing  

---

# 1. What is CSS?

CSS is a language that **describes how HTML elements should look**.  
It separates **content (HTML)** from **presentation (CSS)**.

Example:  
You can change **text color, font, size, and background** without altering HTML.

---

# 2. CSS Syntax

CSS consists of **selectors and declarations**.

### Basic Structure

```css id="css_syntax"
selector {
  property: value;
  property2: value2;
}
````

### Explanation

```text
selector → HTML element to style (e.g., h1, p, .class, #id)
property → CSS property (e.g., color, font-size)
value → value of the property (e.g., red, 16px)
```

### Example

```css id="css_example"
p {
  color: blue; /* text color */
  font-size: 16px; /* font size */
}
```

---

# 3. CSS Types

There are **three ways** to apply CSS:

---

## 3.1 Inline CSS

CSS applied **directly in the HTML tag** using `style` attribute.

### Example

```html id="inline_css"
<p style="color: red; font-size: 18px;">Hello Inline CSS</p>
```

### Explanation

```html
<p style="color: red; font-size: 18px;">
<!-- color and font-size applied directly -->
Hello Inline CSS
</p>
```

---

## 3.2 Internal CSS

CSS written inside a `<style>` tag in the **HTML `<head>` section**.

### Example

```html id="internal_css"
<head>
<style>
h1 {
  color: green;
  text-align: center;
}
</style>
</head>
<body>
<h1>Internal CSS Example</h1>
</body>
```

### Explanation

```html
<style>
h1 {
  color: green; /* text color */
  text-align: center; /* center aligned */
}
</style>
```

---

## 3.3 External CSS

CSS written in a **separate file** (e.g., style.css) and linked using `<link>` tag.

### Example

```html id="external_css"
<head>
<link rel="stylesheet" href="style.css">
</head>
```

**style.css**

```css
h1 {
  color: purple;
  text-align: center;
}
```

### Explanation

* External CSS keeps HTML **clean**
* Reusable across multiple pages

---

# 4. CSS Comments

CSS comments are written like this:

```css id="css_comment"
/* This is a comment */
```

### Example

```css
p {
  color: red; /* text color */
  font-size: 16px; /* font size */
}
```

Comments are **ignored by the browser**.

---

# 5. Colors in CSS

CSS allows multiple ways to define colors:

---

## 5.1 Named Colors

CSS supports **predefined color names**.

```css
p {
  color: red;
}
```

Other examples:

* blue, green, yellow, black, white, orange, pink

---

## 5.2 Hex Colors

Hexadecimal color code starts with `#`.

* Format: `#RRGGBB`

### Example

```css
h1 {
  color: #ff5733; /* reddish color */
}
```

---

## 5.3 RGB Colors

* `rgb(red, green, blue)`
* Values: 0–255

### Example

```css
p {
  color: rgb(255, 0, 0); /* red */
}
```

---

## 5.4 RGBA Colors

* `rgba(red, green, blue, alpha)`
* Alpha defines **opacity (0 to 1)**

### Example

```css
div {
  background-color: rgba(0, 128, 0, 0.5); /* semi-transparent green */
}
```

---

# 6. Background Properties

CSS allows you to **style backgrounds** of elements.

### Properties

* `background-color`
* `background-image`
* `background-repeat`
* `background-position`
* `background-size`

---

### Example: Background Color

```css
body {
  background-color: lightblue;
}
```

---

### Example: Background Image

```css
body {
  background-image: url('background.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
```

### Explanation

```text
background-image → sets image
background-repeat → no-repeat stops tiling
background-size → cover fills entire screen
background-position → centers image
```

---

# Complete Example: CSS Styling

```html id="css_complete"
<!DOCTYPE html>
<html>
<head>
<title>CSS Example</title>
<style>
body {
  background-color: #f0f0f0;
}

h1 {
  color: darkblue;
  text-align: center;
}

p {
  color: rgb(50, 50, 50);
  font-size: 16px;
}

div {
  background-color: rgba(255, 0, 0, 0.3);
  width: 300px;
  height: 150px;
  text-align: center;
  line-height: 150px;
}
</style>
</head>
<body>

<h1>Welcome to CSS</h1>
<p>This is a paragraph with CSS styling.</p>

<div>Styled Div Box</div>

</body>
</html>
```

---

# Summary of Day 7

You learned:

- ✔ What CSS is
- ✔ CSS syntax: selectors, properties, values
- ✔ Three types of CSS: Inline, Internal, External
- ✔ CSS comments
- ✔ Color types: Named, Hex, RGB, RGBA
- ✔ Background properties: color, image, repeat, position, size

---

# Practice Tasks

### Task 1

Apply **inline CSS** to change the color of a paragraph.

---

### Task 2

Use **internal CSS** to center a heading.

---

### Task 3

Use **external CSS** to style multiple headings and paragraphs.

---

### Task 4

Write a CSS comment explaining your code.

---

### Task 5

Use **named colors** for a heading.

---

### Task 6

Use a **hex color code** for a paragraph.

---

### Task 7

Use **RGB colors** for a div background.

---

### Task 8

Use **RGBA colors** to make a semi-transparent box.

---

### Task 9

Add a **background image** with no-repeat and cover.

---

### Task 10

## Create a **complete styled page** with heading, paragraph, and a div using all learned color and background properties.
