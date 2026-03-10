# Day 3 — Images, Lists & Tables

These notes will teach you how to:

- Display **images** on a webpage
- Create **lists** to organize information
- Build **tables** to show structured data

By the end of this lesson, you will be able to create **image galleries, menus, and data tables**.

---

# 1. Image Tag (`<img>`)

The `<img>` tag is used to **display images on a webpage**.

Important:

> `<img>` is a **self-closing tag**.  
> It does **not need a closing tag**.

### Basic Syntax

```html
<img src="image.jpg" alt="Description">
````

* `src` → image location
* `alt` → description of the image

---

# 2. Image Attributes

Attributes provide **extra information** about the image.

The most common attributes are:

* `src`
* `alt`
* `width`
* `height`

---

# 2.1 `src` (Source)

The `src` attribute specifies the **path of the image file**.

### Example

```html
<img src="cat.jpg">
```

### Explanation

```html
<img src="cat.jpg">
<!-- img tag displays an image -->
<!-- src tells the browser which image file to load -->
```

---

# 2.2 `alt` (Alternative Text)

The `alt` attribute provides **alternative text if the image cannot load**.

It also helps **screen readers and accessibility**.

### Example

```html
<img src="dog.jpg" alt="A cute dog">
```

### Explanation

```html
<img src="dog.jpg" alt="A cute dog">
<!-- alt describes the image -->
<!-- if the image fails to load, the text will appear -->
```

---

# 2.3 `width` Attribute

The `width` attribute controls the **image width**.

### Example

```html
<img src="mountain.jpg" width="300">
```

### Explanation

```html
<img src="mountain.jpg" width="300">
<!-- width sets the image width to 300 pixels -->
```

---

# 2.4 `height` Attribute

The `height` attribute controls the **image height**.

### Example

```html
<img src="mountain.jpg" height="200">
```

### Explanation

```html
<img src="mountain.jpg" height="200">
<!-- height sets the image height to 200 pixels -->
```

---

# Example: Image with All Attributes

```html
<img src="nature.jpg" alt="Beautiful nature view" width="400" height="250">
```

### Line-by-line Explanation

```html
<img 
src="nature.jpg"
<!-- image file name -->

alt="Beautiful nature view"
<!-- text describing the image -->

width="400"
<!-- image width in pixels -->

height="250"
<!-- image height in pixels -->

>
```

---

# 3. Image Formats

Different image formats are used on the web.

### 1. PNG

* High quality
* Supports **transparent background**

Example:

```
logo.png
```

---

### 2. JPG / JPEG

* Smaller file size
* Good for **photographs**

Example:

```
photo.jpg
```

---

### 3. SVG

* **Vector format**
* Can scale without losing quality
* Used for **logos and icons**

Example:

```
icon.svg
```

---

### 4. WebP

* Modern image format
* **Very small size**
* High quality

Example:

```
image.webp
```

---

# 4. Lists in HTML

Lists help organize information clearly.

HTML provides **3 types of lists**:

1. Ordered List
2. Unordered List
3. Description List

---

# 4.1 Ordered List (`<ol>`)

An ordered list displays items with **numbers**.

### Example

```html
<ol>
<li>HTML</li>
<li>CSS</li>
<li>JavaScript</li>
</ol>
```

### Explanation

```html
<ol>
<!-- ol starts an ordered list -->

<li>HTML</li>
<!-- li means list item -->

<li>CSS</li>

<li>JavaScript</li>

</ol>
<!-- end of ordered list -->
```

Output:

```
1. HTML
2. CSS
3. JavaScript
```

---

# 4.2 Unordered List (`<ul>`)

An unordered list displays items with **bullet points**.

### Example

```html
<ul>
<li>Apple</li>
<li>Banana</li>
<li>Mango</li>
</ul>
```

### Explanation

```html
<ul>
<!-- ul starts unordered list -->

<li>Apple</li>
<!-- first list item -->

<li>Banana</li>

<li>Mango</li>

</ul>
<!-- end of list -->
```

Output:

```
• Apple
• Banana
• Mango
```

---

# 4.3 Description List (`<dl>`)

A description list is used to show **terms and their descriptions**.

### Tags Used

* `<dl>` → description list
* `<dt>` → term
* `<dd>` → description

---

### Example

```html
<dl>

<dt>HTML</dt>
<dd>Language used to create webpages.</dd>

<dt>CSS</dt>
<dd>Used to style webpages.</dd>

</dl>
```

### Explanation

```html
<dl>
<!-- starts description list -->

<dt>HTML</dt>
<!-- dt defines the term -->

<dd>Language used to create webpages.</dd>
<!-- dd provides the description -->

<dt>CSS</dt>

<dd>Used to style webpages.</dd>

</dl>
```

---

# 4.4 Nested Lists

A nested list means **a list inside another list**.

### Example

```html
<ul>

<li>Programming Languages

<ul>
<li>C</li>
<li>Java</li>
<li>Python</li>
</ul>

</li>

<li>Web Technologies</li>

</ul>
```

### Explanation

```html
<ul>
<!-- main list -->

<li>Programming Languages

<ul>
<!-- nested list -->

<li>C</li>
<li>Java</li>
<li>Python</li>

</ul>

</li>

<li>Web Technologies</li>

</ul>
```

---

# 5. Tables in HTML

Tables are used to display **structured data in rows and columns**.

Example uses:

* Student marks
* Product price lists
* Timetables

---

# 5.1 `<table>` Tag

The `<table>` tag creates the **table structure**.

### Example

```html
<table border="1">
</table>
```

Explanation:

```html
<table border="1">
<!-- border="1" adds a visible border -->
```

---

# 5.2 `<tr>` — Table Row

`<tr>` defines a **row** in the table.

---

# 5.3 `<th>` — Table Header

`<th>` creates **header cells** (usually bold and centered).

---

# 5.4 `<td>` — Table Data

`<td>` defines **normal data cells**.

---

# Example Table

```html
<table border="1">

<tr>
<th>Name</th>
<th>Age</th>
<th>City</th>
</tr>

<tr>
<td>Ram</td>
<td>21</td>
<td>Kathmandu</td>
</tr>

<tr>
<td>Sita</td>
<td>20</td>
<td>Pokhara</td>
</tr>

</table>
```

### Line-by-line Explanation

```html
<table border="1">
<!-- starts table -->

<tr>
<!-- first row -->

<th>Name</th>
<th>Age</th>
<th>City</th>
<!-- header cells -->

</tr>

<tr>
<!-- second row -->

<td>Ram</td>
<td>21</td>
<td>Kathmandu</td>
<!-- data cells -->

</tr>

<tr>
<td>Sita</td>
<td>20</td>
<td>Pokhara</td>
</tr>

</table>
<!-- end of table -->
```

---

# 6. Table Attributes

---

# 6.1 `rowspan`

`rowspan` allows a cell to **span multiple rows**.

### Example

```html
<td rowspan="2">Ram</td>
```

Explanation:

```html
<td rowspan="2">Ram</td>
<!-- this cell will cover 2 rows -->
```

---

# 6.2 `colspan`

`colspan` allows a cell to **span multiple columns**.

### Example

```html
<td colspan="2">Total</td>
```

Explanation

```html
<td colspan="2">Total</td>
<!-- this cell will cover 2 columns -->
```

---

# Example: Table with Rowspan and Colspan

```html
<table border="1">

<tr>
<th>Name</th>
<th colspan="2">Marks</th>
</tr>

<tr>
<td rowspan="2">Ram</td>
<td>Math</td>
<td>90</td>
</tr>

<tr>
<td>Science</td>
<td>85</td>
</tr>

</table>
```

---

# 7. Table Header, Body, Footer

HTML tables can be divided into:

* `<thead>`
* `<tbody>`
* `<tfoot>`

---

# Example

```html
<table border="1">

<thead>

<tr>
<th>Name</th>
<th>Age</th>
</tr>

</thead>

<tbody>

<tr>
<td>Ram</td>
<td>21</td>
</tr>

<tr>
<td>Sita</td>
<td>20</td>
</tr>

</tbody>

<tfoot>

<tr>
<td colspan="2">Student Data</td>
</tr>

</tfoot>

</table>
```

### Explanation

```html
<thead>
<!-- header section of table -->

<tbody>
<!-- main table data -->

<tfoot>
<!-- footer section of table -->
```

---

# Complete Example: Images + Lists + Table

```html
<!DOCTYPE html>
<html>

<head>
<title>HTML Example</title>
</head>

<body>

<h1>My Website</h1>

<img src="nature.jpg" alt="Nature Image" width="300">

<h2>Favorite Fruits</h2>

<ul>
<li>Apple</li>
<li>Mango</li>
<li>Banana</li>
</ul>

<h2>Student Table</h2>

<table border="1">

<tr>
<th>Name</th>
<th>Age</th>
</tr>

<tr>
<td>Ram</td>
<td>21</td>
</tr>

<tr>
<td>Sita</td>
<td>20</td>
</tr>

</table>

</body>

</html>
```

---

# Summary of Day 3

You learned:

- ✔ How to insert images
- ✔ Image attributes (`src`, `alt`, `width`, `height`)
- ✔ Image formats (PNG, JPG, SVG, WebP)
- ✔ Ordered lists
- ✔ Unordered lists
- ✔ Description lists
- ✔ Nested lists
- ✔ HTML tables
- ✔ Table rows, headers, and data
- ✔ `rowspan` and `colspan`
- ✔ Table sections (`thead`, `tbody`, `tfoot`)

---

# Practice Tasks

### Task 1

Insert an image into a webpage using:

* `src`
* `alt`

---

### Task 2

Display an image with:

```
width = 300
height = 200
```

---

### Task 3

Create an **ordered list** of your favorite programming languages.

---

### Task 4

Create an **unordered list** of your favorite foods.

---

### Task 5

Create a **description list** explaining:

```
HTML
CSS
JavaScript
```

---

### Task 6

Create a **nested list** like this:

```
Programming
   C
   Java
   Python
```

---

### Task 7

Create a table showing:

```
Name | Age | City
```

Add **3 rows of data**.

---

### Task 8

Create a table with **5 students and marks**.

---

### Task 9

Create a table using **rowspan**.

---

### Task 10

Create a complete webpage containing:

* One image
* One ordered list
* One unordered list
* One table with student data

---