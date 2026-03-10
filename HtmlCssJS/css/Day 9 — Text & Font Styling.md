# Day 9 — Text & Font Styling

Today, you will learn **how to style text and fonts** using CSS.  
This includes **font properties, web fonts, text alignment, decorations, spacing**, and **interactive styles** like hover effects.

---

# 1. Font Properties

CSS allows you to control **fonts** for readability and design.

---

## 1.1 `font-family`

Specifies the **font type** for text.

### Example

```css id="font_family"
p {
  font-family: Arial, sans-serif;
}
````

### Explanation

```text id="font_family_expl"
Arial → primary font
sans-serif → fallback font if Arial is not available
```

---

## 1.2 `font-size`

Controls the **size of text**.

### Example

```css id="font_size"
h1 {
  font-size: 36px;
}

p {
  font-size: 16px;
}
```

---

## 1.3 `font-weight`

Controls **thickness** of text.

Values: `normal`, `bold`, `lighter`, or numeric (100–900)

### Example

```css id="font_weight"
p {
  font-weight: bold;
}

span {
  font-weight: 300; /* light */
}
```

---

## 1.4 `font-style`

Defines **italic, normal, or oblique** text.

### Example

```css id="font_style"
em {
  font-style: italic;
}

p.normal-text {
  font-style: normal;
}
```

---

# 2. Web Fonts

Web fonts allow using **custom fonts from online sources** like **Google Fonts**.

### Example: Google Fonts

```html id="google_fonts_html"
<head>
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
<style>
body {
  font-family: 'Roboto', sans-serif;
}
</style>
</head>
```

---

# 3. Text Properties

---

## 3.1 `text-align`

Controls **horizontal alignment** of text: `left`, `right`, `center`, `justify`.

### Example

```css id="text_align"
h1 {
  text-align: center;
}

p {
  text-align: justify;
}
```

---

## 3.2 `text-decoration`

Adds **underline, overline, line-through, or none**.

### Example

```css id="text_decoration"
a {
  text-decoration: none; /* removes underline */
}

h2 {
  text-decoration: underline;
}
```

---

## 3.3 `text-transform`

Changes **text capitalization**.

Values: `uppercase`, `lowercase`, `capitalize`

### Example

```css id="text_transform"
h1 {
  text-transform: uppercase;
}

p {
  text-transform: capitalize;
}
```

---

## 3.4 `line-height`

Controls **space between lines**.

### Example

```css id="line_height"
p {
  line-height: 1.5; /* 1.5 times font size */
}
```

---

## 3.5 `letter-spacing`

Controls **space between characters**.

### Example

```css id="letter_spacing"
h1 {
  letter-spacing: 2px;
}
```

---

# 4. Other Styling

---

## 4.1 List Styling

* `list-style-type` → `disc`, `circle`, `square`, `none`
* `list-style-position` → `inside`, `outside`

### Example

```css id="list_style"
ul {
  list-style-type: square;
  list-style-position: inside;
}
```

---

## 4.2 Link Styling

* `color` → link color
* `text-decoration` → underline
* `:hover` → interactive style

### Example

```css id="link_style"
a {
  color: blue;
  text-decoration: none;
}

a:hover {
  color: red;
  text-decoration: underline;
}
```

---

## 4.3 Hover Effects

Hover effects make **elements interactive**.

### Example

```css id="hover_effect"
button {
  background-color: lightblue;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: blue;
  color: white;
}
```

---

# Complete Example: Text & Font Styling

```html id="text_font_complete"
<!DOCTYPE html>
<html>
<head>
<title>Text & Font Styling</title>
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
<style>
body {
  font-family: 'Roboto', sans-serif;
}

h1 {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
}

p {
  font-size: 16px;
  line-height: 1.6;
  text-align: justify;
}

ul {
  list-style-type: square;
  list-style-position: inside;
}

a {
  color: blue;
  text-decoration: none;
}

a:hover {
  color: red;
  text-decoration: underline;
}

button {
  background-color: lightgreen;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: green;
  color: white;
}
</style>
</head>
<body>

<h1>Text & Font Styling</h1>

<p>This paragraph demonstrates <em>line-height</em>, <strong>font-weight</strong>, and <span style="text-decoration: underline;">text-decoration</span>.</p>

<ul>
<li>First item</li>
<li>Second item</li>
<li>Third item</li>
</ul>

<a href="#">Hover over this link</a>

<br><br>

<button>Hover Me</button>

</body>
</html>
```

---

# Summary of Day 9

You learned:

- ✔ Font properties: `font-family`, `font-size`, `font-weight`, `font-style`
- ✔ Web fonts (Google Fonts)
- ✔ Text properties: `text-align`, `text-decoration`, `text-transform`, `line-height`, `letter-spacing`
- ✔ List styling with `list-style-type` and `list-style-position`
- ✔ Link styling and hover effects
- ✔ Button hover effects

---

# Practice Tasks

### Task 1

Change the **font-family** of a paragraph to a Google Font.

---

### Task 2

Set different **font-size and font-weight** for headings.

---

### Task 3

Apply **text-transform** and **letter-spacing** to a heading.

---

### Task 4

Justify a paragraph and adjust **line-height** for readability.

---

### Task 5

Create a **list of items** and style bullets as `circle`.

---

### Task 6

Style links with **custom colors** and **hover effects**.

---

### Task 7

Create a **button** with hover effect changing background and text color.

---

### Task 8

Apply **italic and bold** styles to different parts of a paragraph.

---

### Task 9

Use **text-decoration** to underline some text and strike through others.

---

### Task 10

## Create a **mini web page** combining headings, paragraphs, list, links, and buttons with all the above text and font styling.