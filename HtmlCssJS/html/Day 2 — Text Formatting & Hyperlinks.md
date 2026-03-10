# Day 2 — Text Formatting & Hyperlinks

These notes help you learn **how to format text and create links in HTML**.

By the end of this lesson, you will be able to:

- Format text in different styles
- Create links to other pages
- Open links in new tabs
- Link pages inside a website

---

# 1. Text Formatting in HTML

Text formatting is used to **change the appearance or importance of text**.

HTML provides several **text formatting tags**.

---

# 1.1 `<strong>` — Important Text

The `<strong>` tag is used to show **important text**.

Browsers usually display it as **bold text**.

### Example

```html
<p>This is <strong>very important</strong> information.</p>
````

### Line-by-line Explanation

```html
<p>
<!-- Starts a paragraph -->

This is 
<!-- Normal text -->

<strong>very important</strong>
<!-- strong tag highlights important text (usually bold) -->

information.

</p>
<!-- Ends the paragraph -->
```

---

# 1.2 `<em>` — Emphasized Text

The `<em>` tag is used to **emphasize text**.

Browsers usually display it as *italic text*.

### Example

```html
<p>Please <em>pay attention</em> to this topic.</p>
```

### Explanation

```html
<p>
Please 

<em>pay attention</em>
<!-- em tag emphasizes text (usually italic) -->

to this topic.
</p>
```

---

# 1.3 `<b>` — Bold Text

The `<b>` tag makes text **bold**, but it **does not indicate importance** like `<strong>`.

### Example

```html
<p>This word is <b>bold</b>.</p>
```

### Explanation

```html
<p>
This word is 

<b>bold</b>
<!-- b tag simply makes text bold -->

.
</p>
```

---

# 1.4 `<i>` — Italic Text

The `<i>` tag displays text in **italic style**.

### Example

```html
<p>This word is <i>italic</i>.</p>
```

### Explanation

```html
<p>
This word is 

<i>italic</i>
<!-- i tag makes the text italic -->

.
</p>
```

---

# 1.5 `<u>` — Underlined Text

The `<u>` tag is used to **underline text**.

### Example

```html
<p>This word is <u>underlined</u>.</p>
```

### Explanation

```html
<p>
This word is 

<u>underlined</u>
<!-- u tag underlines the text -->

.
</p>
```

---

# 1.6 `<del>` — Deleted Text

The `<del>` tag shows **deleted or removed text**.

Browsers usually display it with a **line through the text**.

### Example

```html
<p>The old price was <del>Rs.1000</del>.</p>
```

### Explanation

```html
<p>
The old price was 

<del>Rs.1000</del>
<!-- del tag shows deleted text using strikethrough -->

.
</p>
```

---

# 1.7 `<mark>` — Highlighted Text

The `<mark>` tag highlights text (usually **yellow background**).

### Example

```html
<p>This is a <mark>very important point</mark>.</p>
```

### Explanation

```html
<p>
This is a 

<mark>very important point</mark>
<!-- mark tag highlights the text -->

.
</p>
```

---

# 1.8 `<small>` — Smaller Text

The `<small>` tag displays text **smaller than normal text**.

### Example

```html
<p>This is normal text and this is <small>small text</small>.</p>
```

### Explanation

```html
<p>

This is normal text

and this is 

<small>small text</small>
<!-- small tag reduces the text size -->

.
</p>
```

---

# 2. Line Break (`<br>`)

The `<br>` tag is used to **break a line**.

Unlike most HTML tags, `<br>` **does not need a closing tag**.

### Example

```html
<p>
Hello Students<br>
Welcome to HTML Course<br>
Let's start learning
</p>
```

### Explanation

```html
<p>
Hello Students
<br>
<!-- br moves text to next line -->

Welcome to HTML Course
<br>
<!-- another line break -->

Let's start learning
</p>
```

Output will appear like:

```
Hello Students
Welcome to HTML Course
Let's start learning
```

---

# 3. Horizontal Rule (`<hr>`)

The `<hr>` tag creates a **horizontal line** across the page.

It is used to **separate sections of content**.

### Example

```html
<h1>HTML Course</h1>

<hr>

<p>This course teaches HTML basics.</p>
```

### Explanation

```html
<h1>HTML Course</h1>
<!-- Main heading -->

<hr>
<!-- hr creates a horizontal line -->

<p>This course teaches HTML basics.</p>
<!-- Paragraph after the line -->
```

---

# 4. Anchor Tag (`<a>`)

The `<a>` tag is used to **create hyperlinks**.

A hyperlink allows users to **navigate to another webpage**.

### Syntax

```html
<a href="URL">Link Text</a>
```

* `href` → destination of the link
* Link Text → clickable text

---

### Example

```html
<a href="https://www.google.com">Visit Google</a>
```

### Explanation

```html
<a href="https://www.google.com">
<!-- href specifies the destination website -->

Visit Google
<!-- Clickable text -->

</a>
```

When the user clicks **Visit Google**, the browser opens Google.

---

# 5. Absolute vs Relative Links

There are **two types of links**.

---

# 5.1 Absolute Link

An **absolute link** contains the **full URL** of a website.

Example:

```html
<a href="https://www.wikipedia.org">Open Wikipedia</a>
```

Explanation:

```html
<a href="https://www.wikipedia.org">
<!-- Full web address -->

Open Wikipedia
</a>
```

Absolute links are used for:

* External websites
* Different domains

---

# 5.2 Relative Link

A **relative link** connects to **another page in the same website**.

Example folder:

```
website/
│
├── index.html
├── about.html
```

Example link:

```html
<a href="about.html">About Page</a>
```

Explanation:

```html
<a href="about.html">
<!-- about.html is another file in the same folder -->

About Page
</a>
```

---

# 6. Opening Links in a New Tab

By default, links open in the **same tab**.

To open a link in a **new tab**, use:

```
target="_blank"
```

### Example

```html
<a href="https://www.youtube.com" target="_blank">Open YouTube</a>
```

### Explanation

```html
<a href="https://www.youtube.com" target="_blank">

<!-- href contains the website link -->

<!-- target="_blank" tells the browser to open link in new tab -->

Open YouTube

</a>
```

---

# 7. Internal Page Linking

Internal linking means **connecting pages inside the same website**.

Example project:

```
mywebsite/

index.html
about.html
contact.html
```

---

### Example (index.html)

```html
<h1>Welcome to My Website</h1>

<a href="about.html">About Us</a>

<br>

<a href="contact.html">Contact Us</a>
```

### Explanation

```html
<h1>Welcome to My Website</h1>
<!-- Main heading -->

<a href="about.html">
<!-- Link to about.html page -->

About Us
</a>

<br>
<!-- Line break -->

<a href="contact.html">
<!-- Link to contact page -->

Contact Us
</a>
```

When users click:

* **About Us** → opens about.html
* **Contact Us** → opens contact.html

---

# Complete Example: Text Formatting + Links

```html
<!DOCTYPE html>
<html>

<head>
<title>Text Formatting Example</title>
</head>

<body>

<h1>HTML Text Formatting</h1>

<p>This is <strong>important</strong> text.</p>

<p>This is <em>emphasized</em> text.</p>

<p>This word is <b>bold</b>.</p>

<p>This word is <i>italic</i>.</p>

<p>This word is <u>underlined</u>.</p>

<p>The old price was <del>Rs.1000</del>.</p>

<p>This is <mark>highlighted</mark> text.</p>

<p>This is <small>small text</small>.</p>

<hr>

<p>
Visit 
<a href="https://www.google.com" target="_blank">
Google
</a>
</p>

</body>

</html>
```

---

# Summary of Day 2

You learned:

- ✔ Text formatting tags
- ✔ Bold and italic text
- ✔ Highlighted and deleted text
- ✔ Line break `<br>`
- ✔ Horizontal line `<hr>`
- ✔ Anchor tag `<a>`
- ✔ Absolute links
- ✔ Relative links
- ✔ Opening links in new tab
- ✔ Internal page linking

---

# Practice Tasks

### Task 1

Create a paragraph using:

* `<strong>`
* `<em>`

---

### Task 2

Create text using:

* `<b>`
* `<i>`
* `<u>`

---

### Task 3

Write a paragraph showing a **discount price** using `<del>`.

Example:

```
Old Price: Rs.1000
New Price: Rs.800
```

---

### Task 4

Highlight an important sentence using `<mark>`.

---

### Task 5

Create a paragraph containing **small text** for a note.

Example:

```
*Terms and conditions apply*
```

---

### Task 6

Write **3 lines of text using `<br>`**.

---

### Task 7

Add a **horizontal line `<hr>`** between two paragraphs.

---

### Task 8

Create a link to:

```
https://www.wikipedia.org
```

---

### Task 9

Create two pages:

```
index.html
about.html
```

Add a link from **index → about page**.

---

### Task 10

Create a webpage containing:

* Heading
* Two paragraphs
* `<strong>`
* `<em>`
* `<mark>`
* `<del>`
* One external link
* One internal link

---