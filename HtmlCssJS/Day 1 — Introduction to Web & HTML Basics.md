# Day 1 — Introduction to Web & HTML Basics

These notes are designed for **complete beginners**.  
The goal of Day 1 is to understand:

- How websites work
- What HTML is
- How a web page is structured
- How to write basic HTML code

By the end of this lesson, students should be able to **create their first HTML webpage**.

---

# 1. How the Web Works

Before learning HTML, it is important to understand **how the internet delivers a website to your screen**.

## Main Components of the Web

There are **3 main components**:

1. **Browser (Client)**
2. **Server**
3. **HTTP Protocol**

### 1. Browser

A **browser** is a software used to open websites.

Examples:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

The browser's job is to:

- Request a webpage from a server
- Receive the webpage code (HTML, CSS, JS)
- Display it visually to the user

### 2. Server

A **server** is a computer that stores websites and sends them to users when requested.

Example servers:

- Apache
- Nginx
- Node servers

### 3. HTTP (HyperText Transfer Protocol)

HTTP is the **communication language between browser and server**.

Example process:

1. You type a website address in the browser  
   Example: `https://www.example.com`

2. The browser sends a **request** to the server.

3. The server sends back the **HTML page**.

4. The browser reads the HTML and **displays the website**.

### Simple Web Flow Diagram

```

User → Browser → HTTP Request → Server
Server → HTTP Response (HTML) → Browser → Website Displayed

````

---

# 2. Introduction to HTML

## What is HTML?

**HTML stands for HyperText Markup Language.**

HTML is used to:

- Create the **structure of a webpage**
- Organize content such as:
  - Text
  - Images
  - Links
  - Tables
  - Forms

Important:

> HTML is **not a programming language**.  
> It is a **markup language** used to structure content.

### Example of a Simple HTML Page

```html
<!DOCTYPE html>
<html>
<head>
<title>My First Page</title>
</head>

<body>

<h1>Hello World</h1>
<p>This is my first webpage.</p>

</body>
</html>
````

This code tells the browser:

* Show a heading
* Show a paragraph

---

# 3. HTML Document Structure

Every HTML page follows a **standard structure**.

## Basic HTML Template

```html
<!DOCTYPE html>
<html>

<head>
<title>Page Title</title>
</head>

<body>

Content goes here

</body>

</html>
```

### Explanation of Each Line

```html
<!DOCTYPE html> 
<!-- This tells the browser that the document is HTML5 -->

<html>
<!-- The root element of the HTML document.
     Everything inside this tag belongs to the webpage -->

<head>
<!-- The head section contains information about the page,
     but it is NOT visible on the webpage -->

<title>My First Page</title>
<!-- The title appears on the browser tab -->

</head>

<body>
<!-- The body contains the visible content of the webpage -->

<h1>Hello Students</h1>
<!-- A heading displayed on the webpage -->

<p>This is the first HTML class.</p>
<!-- A paragraph displayed on the webpage -->

</body>

</html>
<!-- Closing tag of the entire HTML document -->
```

---

# 4. HTML Tags, Elements, and Attributes

Understanding these **3 concepts is very important**.

---

# 4.1 HTML Tags

A **tag** is a keyword enclosed in angle brackets.

Example:

```
<h1>
<p>
<body>
```

Tags usually come in **pairs**:

```
Opening tag
Closing tag
```

Example:

```
<p>Paragraph</p>
```

* `<p>` → Opening tag
* `</p>` → Closing tag

---

# 4.2 HTML Elements

An **element** includes:

```
Opening Tag + Content + Closing Tag
```

Example:

```html
<p>This is a paragraph</p>
```

Explanation:

```
<p>  → Opening tag
This is a paragraph → Content
</p> → Closing tag
```

So the **whole line is an element**.

---

# 4.3 HTML Attributes

Attributes provide **extra information** about an element.

Attributes are written inside the **opening tag**.

Example:

```html
<p align="center">Hello</p>
```

Explanation:

* `align` → attribute name
* `"center"` → attribute value

Example with explanation:

```html
<p align="center">Welcome Students</p>
<!-- align="center" tells the browser to place text in center -->
```

---

# 5. Basic HTML Tags

These tags are **mandatory in every HTML document**.

---

# 5.1 `<html>` Tag

This is the **root element of the webpage**.

Everything must be written **inside the `<html>` tag**.

Example:

```html
<html>

<head>
<title>My Page</title>
</head>

<body>
<h1>Hello</h1>
</body>

</html>
```

Explanation:

```html
<html>
<!-- Starting of HTML document -->

</html>
<!-- End of HTML document -->
```

---

# 5.2 `<head>` Tag

The `<head>` contains **metadata (information about the page)**.

Examples inside head:

* title
* styles
* scripts
* meta tags

Example:

```html
<head>

<title>My Website</title>

</head>
```

Explanation:

```html
<head>
<!-- Start of head section -->

<title>My Website</title>
<!-- Title shown in browser tab -->

</head>
<!-- End of head section -->
```

---

# 5.3 `<body>` Tag

The `<body>` contains **all visible content**.

Example:

```html
<body>

<h1>Welcome</h1>
<p>This is my website</p>

</body>
```

Explanation:

```html
<body>
<!-- Start of webpage visible content -->

<h1>Welcome</h1>
<!-- Heading displayed on webpage -->

<p>This is my website</p>
<!-- Paragraph displayed on webpage -->

</body>
<!-- End of webpage visible content -->
```

---

# 5.4 `<title>` Tag

The `<title>` defines the **title of the webpage tab**.

Example:

```html
<head>
<title>Learning HTML</title>
</head>
```

Explanation:

```html
<title>Learning HTML</title>
<!-- This text appears on the browser tab -->
```

Example in browser:

```
Tab Name: Learning HTML
```

---

# 6. Headings (`<h1>` – `<h6>`)

HTML provides **6 heading levels**.

```
<h1> → Largest heading
<h6> → Smallest heading
```

Example:

```html
<h1>Main Title</h1>
<h2>Sub Title</h2>
<h3>Section Title</h3>
<h4>Small Heading</h4>
<h5>Smaller Heading</h5>
<h6>Smallest Heading</h6>
```

Example with explanation:

```html
<h1>HTML Course</h1>
<!-- Main title of the webpage -->

<h2>Introduction</h2>
<!-- Subheading -->

<h3>Topics</h3>
<!-- Smaller heading used for sections -->
```

Important rule:

> A webpage should normally have **only one `<h1>`** for the main title.

---

# 7. Paragraph (`<p>`)

The `<p>` tag is used to write **paragraph text**.

Example:

```html
<p>This is a paragraph.</p>
```

Example with explanation:

```html
<p>
HTML is used to create the structure of webpages.
</p>

<!-- <p> starts the paragraph -->
<!-- The text inside is displayed as normal paragraph -->
<!-- </p> ends the paragraph -->
```

Example with multiple paragraphs:

```html
<p>HTML is easy to learn.</p>

<p>Practice is important for mastering HTML.</p>
```

---

# 8. Comments in HTML

Comments are used to **write notes in code**.

Comments are **not displayed on the webpage**.

Syntax:

```
<!-- comment -->
```

Example:

```html
<!-- This is a comment -->

<h1>Welcome</h1>
```

Example with explanation:

```html
<!-- Main heading of the page -->

<h1>My Website</h1>

<!-- This paragraph explains the website -->

<p>This website is about learning HTML.</p>
```

Why comments are useful:

* Explain code
* Help other developers understand code
* Organize large projects

---

# 9. File Structure and Naming

## How to Create an HTML File

Steps:

1. Open **VS Code / Notepad**
2. Create a new file
3. Save it as:

```
index.html
```

Important:

> HTML files must end with **`.html`**

Example:

```
index.html
about.html
contact.html
```

---

## Basic Project Folder Structure

Example:

```
my-website/

│
├── index.html
├── about.html
├── contact.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
└── images/
    └── logo.png
```

Explanation:

```
index.html → Main page
css/ → Contains CSS files
js/ → Contains JavaScript files
images/ → Contains images
```

---

# Example: Complete First HTML Page

```html
<!DOCTYPE html>
<!-- Declares the document type as HTML5 -->

<html>
<!-- Root element of the HTML document -->

<head>
<!-- Contains metadata about the page -->

<title>My First Webpage</title>
<!-- Title shown on browser tab -->

</head>

<body>
<!-- Visible content of the webpage -->

<h1>Welcome to HTML</h1>
<!-- Main heading -->

<p>This is my first webpage created using HTML.</p>
<!-- Paragraph explaining the page -->

<p>I am learning web development.</p>
<!-- Another paragraph -->

</body>

</html>
```

---

# Summary of Day 1

You learned:

- ✔ How the web works
- ✔ Browser, Server, HTTP
- ✔ What HTML is
- ✔ HTML document structure
- ✔ HTML tags, elements, attributes
- ✔ Basic HTML tags
- ✔ Headings
- ✔ Paragraphs
- ✔ Comments
- ✔ File structure

---

# Practice Tasks

### Task 1

Create a webpage with:

* Title: **My First Website**
* One heading
* One paragraph

---

### Task 2

Create a webpage with:

* `<h1>`
* `<h2>`
* `<h3>`

---

### Task 3

Write **three paragraphs** about yourself.

---

### Task 4

Add **comments** explaining each section of your code.

---

### Task 5

Create a page with:

```
Title: HTML Learning
Heading: Welcome Students
Paragraph: This is my HTML practice page.
```

---

### Task 6

Create a webpage using **all 6 heading tags**.

---

### Task 7

Write a paragraph explaining **What HTML is**.

---

### Task 8

Create a folder called:

```
html-practice
```

Inside it create:

```
index.html
about.html
```

---

### Task 9

Add comments to explain:

* title
* heading
* paragraph

---

### Task 10

Create a complete webpage containing:

* Title
* One `<h1>`
* Two `<h2>`
* Three paragraphs
* Comments explaining each part

---
