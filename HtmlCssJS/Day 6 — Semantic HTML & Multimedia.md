# Day 6 — Semantic HTML & Multimedia

Today, you will learn about:

- **Semantic HTML elements** to structure webpages meaningfully  
- **Accessibility basics** to make content usable for everyone  
- **Multimedia elements** to embed audio, video, and external content  
- Additional topics: **HTML entities** and **validation**

By the end of this lesson, you will understand how to **create well-structured, accessible, and media-rich webpages**.

---

# 1. Semantic HTML

Semantic HTML means using **HTML tags that describe the meaning of the content**.  
It helps:

- Search engines understand content (SEO)  
- Screen readers assist visually impaired users  
- Developers read code more easily

---

# 1.1 `<header>`

Defines the **header section** of a page or a section.  
Commonly contains:

- Logo
- Website title
- Navigation links

### Example

```html id="h6hdrx"
<header>
<h1>My Website</h1>
<p>Welcome to my site!</p>
</header>
````

### Explanation

```html id="pj4t6k"
<header>
<!-- header section of page -->

<h1>My Website</h1>
<!-- main title -->

<p>Welcome to my site!</p>
<!-- optional subtitle -->
</header>
```

---

# 1.2 `<nav>`

Represents **navigation links**.

### Example

```html id="l2sq5r"
<nav>
<a href="index.html">Home</a>
<a href="about.html">About</a>
<a href="contact.html">Contact</a>
</nav>
```

### Explanation

```html id="xq9t2w"
<nav>
<!-- navigation section -->

<a href="index.html">Home</a>
<!-- link to home -->

<a href="about.html">About</a>
<!-- link to about page -->

<a href="contact.html">Contact</a>
<!-- link to contact page -->
</nav>
```

---

# 1.3 `<main>`

Defines the **main content** of the page.

* Only **one `<main>` per page**
* Contains **unique content** not repeated across pages

### Example

```html id="m1n7ab"
<main>
<h2>About Our Company</h2>
<p>We provide web development services.</p>
</main>
```

---

# 1.4 `<section>`

Defines a **section of content** within a page.

* Can have its own heading
* Can contain multiple articles

### Example

```html id="s1c2rt"
<section>
<h2>Services</h2>
<p>Web design, SEO, Marketing</p>
</section>
```

---

# 1.5 `<article>`

Represents **self-contained content** that can stand alone.

Examples:

* Blog posts
* News articles

### Example

```html id="a1rtcl"
<article>
<h3>How to Learn HTML</h3>
<p>HTML is easy to learn if you practice daily.</p>
</article>
```

---

# 1.6 `<aside>`

Used for **side content**, such as:

* Advertisements
* Related links
* Sidebar widgets

### Example

```html id="as1d1e"
<aside>
<h4>Related Articles</h4>
<ul>
<li>CSS Basics</li>
<li>JavaScript Tips</li>
</ul>
</aside>
```

---

# 1.7 `<footer>`

Defines the **footer of a page or section**.
Commonly contains:

* Contact info
* Copyright
* Social links

### Example

```html id="f1t00r"
<footer>
<p>&copy; 2026 My Website</p>
</footer>
```

---

# 2. Accessibility Basics

Making websites accessible ensures **everyone can use them**.

---

## 2.1 Importance of `alt`

The `alt` attribute in `<img>` provides **alternative text**.

* Helps **screen readers** describe images
* Displays text if image fails to load

```html id="accimg"
<img src="logo.png" alt="Company Logo">
```

---

## 2.2 Semantic Meaning

Using semantic tags like `<header>`, `<nav>`, `<main>`, etc.:

* Improves accessibility
* Helps screen readers navigate
* Improves SEO

---

# 3. Multimedia Elements

HTML can embed **audio, video, and external content**.

---

# 3.1 `<audio>`

Plays **sound files** on the page.

### Example

```html id="audio1"
<audio controls>
<source src="song.mp3" type="audio/mpeg">
Your browser does not support the audio element.
</audio>
```

### Explanation

```html id="audio2"
<audio controls>
<!-- controls display play/pause buttons -->

<source src="song.mp3" type="audio/mpeg">
<!-- source file -->

Your browser does not support the audio element.
<!-- fallback text -->
</audio>
```

---

# 3.2 `<video>`

Plays **video files** on the page.

### Example

```html id="video1"
<video width="400" controls>
<source src="video.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>
```

### Explanation

```html id="video2"
<video width="400" controls>
<!-- width sets video size, controls add play/pause -->

<source src="video.mp4" type="video/mp4">
<!-- video file -->

Your browser does not support the video tag.
<!-- fallback message -->
</video>
```

---

# 3.3 `<iframe>`

Embeds **external content**, such as:

* Videos
* Maps
* Other websites

### Example

```html id="iframe1"
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" frameborder="0" allowfullscreen></iframe>
```

### Explanation

```html id="iframe2"
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" frameborder="0" allowfullscreen></iframe>
<!-- embeds external video in page -->
```

---

# 4. HTML Entities

Some characters have **special meaning in HTML**:

* `<` → `&lt;`
* `>` → `&gt;`
* `&` → `&amp;`
* `"` → `&quot;`
* `'` → `&apos;`

Example:

```html id="entity1"
<p>Use &lt;header&gt; for page header.</p>
```

---

# 5. HTML Validation

Valid HTML ensures:

* Correct syntax
* Browser compatibility
* Better SEO

Check your HTML using:

* [W3C Validator](https://validator.w3.org/)

---

# Complete Example: Semantic Page with Multimedia

```html id="semmedia"
<!DOCTYPE html>
<html>

<head>
<title>Semantic HTML Example</title>
</head>

<body>

<header>
<h1>My Website</h1>
</header>

<nav>
<a href="index.html">Home</a>
<a href="about.html">About</a>
<a href="contact.html">Contact</a>
</nav>

<main>

<section>
<h2>Blog Post</h2>
<article>
<h3>Learning HTML</h3>
<p>HTML is the backbone of the web.</p>
</article>
</section>

<aside>
<h4>Related Posts</h4>
<ul>
<li>CSS Tips</li>
<li>JavaScript Basics</li>
</ul>
</aside>

<section>
<h2>Media Example</h2>

<audio controls>
<source src="song.mp3" type="audio/mpeg">
Your browser does not support the audio element.
</audio>

<br><br>

<video width="400" controls>
<source src="video.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>

<br><br>

<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" frameborder="0" allowfullscreen></iframe>

</section>

</main>

<footer>
<p>&copy; 2026 My Website</p>
</footer>

</body>
</html>
```

---

# Summary of Day 6

You learned:

- ✔ Semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- ✔ Importance of `alt` for accessibility
- ✔ Multimedia elements: `<audio>`, `<video>`, `<iframe>`
- ✔ HTML entities: `&lt;`, `&gt;`, `&amp;`, etc.
- ✔ HTML validation using W3C validator

---

# Practice Tasks

### Task 1

Create a webpage using `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.

---

### Task 2

Add an image with a **meaningful `alt` text**.

---

### Task 3

Embed an **audio file** on your webpage.

---

### Task 4

Embed a **video file** on your webpage.

---

### Task 5

Embed a **YouTube video using `<iframe>`**.

---

### Task 6

Use HTML entities in a paragraph to display `<`, `>`, and `&`.

---

### Task 7

Create a blog post using **semantic tags**.

---

### Task 8

Create a **sidebar with related links** using `<aside>`.

---

### Task 9

Validate your HTML using **W3C validator** and fix errors.

---

### Task 10

Create a complete **semantic HTML page with multimedia**:

* Header, Nav, Main, Section, Article, Aside, Footer
* Audio, Video, and Iframe
* Accessible images with `alt`
* Use at least **3 HTML entities**

---