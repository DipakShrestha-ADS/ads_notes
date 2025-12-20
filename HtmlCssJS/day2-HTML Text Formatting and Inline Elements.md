### Day 2: HTML Text Formatting and Inline Elements

Welcome to Day 2! Yesterday, you learned the basic structure of an HTML page and some common elements like headings, paragraphs, links, and images. Today, we'll focus on how to format text inside your paragraphs and headings. We'll also learn the difference between **block** and **inline** elements, and explore some useful inline tags.

Think of this like writing a letter: You don't just write plain words—you make some words **bold** for importance, *italic* for emphasis, or add line breaks to separate ideas. HTML gives you simple tags to do exactly that.

We'll explain everything in simple language with well-commented code examples. Save each example as a separate file (like "day2-example1.html") and open it in your browser to see the result.

#### Topic 1: Text Formatting Tags
These tags help you style text without CSS (we'll use CSS later for real styling). They change how text looks and also tell screen readers (for blind users) the meaning.

Important formatting tags:
- **<strong>** → Makes text **bold** and means "important".
- **<em>** → Makes text *italic* and means "emphasis" (like stressing a word).
- **<u>** → Underlines text (use carefully—people might think it's a link).
- **<del>** → Shows ~~strikethrough~~ text (like something deleted).
- **<ins>** → Underlines text to show something newly inserted.
- **<mark>** → Highlights text with a yellow background (like a highlighter).
- **<sup>** → Superscript (small text above the line, e.g., for powers like 2²).
- **<sub>** → Subscript (small text below the line, e.g., for chemical formulas like H₂O).
- **<small>** → Makes text smaller (often used for disclaimers).

Example Code: Save as "text-formatting.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Text Formatting Examples</title>
</head>
<body>
    
    <h1>Text Formatting in HTML</h1>
    
    <p>This is a normal paragraph.</p>
    
    <p>This is <strong>very important</strong> information.</p> 
    <!-- <strong> makes text bold and tells screen readers it's important -->
    
    <p>She said <em>yes</em> with excitement!</p>
    <!-- <em> makes text italic and adds vocal emphasis for screen readers -->
    
    <p>This word is <u>underlined</u> for attention.</p>
    <!-- <u> adds underline (but avoid too much—it looks like a link) -->
    
    <p>The price was <del>$100</del> now <ins>$80</ins>.</p>
    <!-- <del> shows old price crossed out, <ins> shows new price underlined -->
    
    <p><mark>Highlighted text</mark> stands out!</p>
    <!-- <mark> gives yellow background by default -->
    
    <p>The formula for water is H<sub>2</sub>O.</p>
    <!-- <sub> puts text below the line -->
    
    <p>Einstein's equation: E = mc<sup>2</sup>.</p>
    <!-- <sup> puts text above the line -->
    
    <p><small>This is small text, like a disclaimer.</small></p>
    <!-- <small> makes text smaller -->
    
</body>
</html>
```
What you'll see: A page with different styled text. Try reading it with your eyes closed—screen readers would stress the <strong> and <em> parts!

#### Topic 2: Inline vs. Block Elements
This is very important to understand early!

- **Block-level elements**: Take the full width and start on a new line. Examples: `<p>`, `<h1>`, `<div>`, `<ul>`.
- **Inline elements**: Only take as much width as needed and stay on the same line. Examples: `<strong>`, `<em>`, `<a>`, `<span>`, `<img>`.

Why it matters: You can't easily change block/inline behavior without CSS (coming soon), so knowing this helps you plan your layout.

Example Code: Save as "block-vs-inline.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Block vs Inline Demo</title>
</head>
<body>
    
    <h1>Block vs Inline Elements</h1>
    
    <!-- Block elements (start on new line) -->
    <p>This is a paragraph (block). It takes full width.</p>
    <p>This is another paragraph (block). It starts on a new line.</p>
    
    <!-- Inline elements (stay on same line) -->
    <p>This is <strong>bold text</strong> and this is <em>italic text</em> — they stay on the same line.</p>
    
    <p>Here is a <a href="#">link</a> and an <img src="https://via.placeholder.com/50" alt="small image"> image — both inline!</p>
    <!-- Links and images don't force a new line -->
    
    <!-- Mixing them -->
    <div style="background: lightblue;">This is a div (block) with background.</div>
    <span style="background: lightgreen;">This is span 1 (inline)</span>
    <span style="background: yellow;">This is span 2 (inline)</span>
    <!-- Notice: div takes full width, spans stay side by side -->
    
</body>
</html>
```
Note: I used inline `style` attribute just to show background color quickly. We'll learn proper CSS soon!

#### Topic 3: The <span> Tag
- `<span>` is an inline container. It does nothing by default, but it's perfect for grouping small parts of text so you can style or manipulate them later.
- Use it when you want to apply formatting to just a few words inside a paragraph.

Example Code: Save as "span-example.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Using Span</title>
</head>
<body>
    
    <h1>Why Use Span?</h1>
    
    <p>
        Welcome to our website! We have <span style="color: red;">amazing deals</span> today only.
        Don't miss <span style="font-size: 20px; background: yellow;">this offer</span>!
    </p>
    <!-- <span> lets us style just parts of the sentence -->
    
    <p>
        The temperature today is <span id="temp">25°C</span>.
        <!-- Later with JavaScript, we can change just this number! -->
    </p>
    
</body>
</html>
```

#### Topic 4: Line Breaks and Horizontal Rules
- **<br>** → Forces a line break (no closing tag needed). Use for addresses, poems, etc.
- **<hr>** → Draws a horizontal line to separate sections (also no closing tag needed in HTML5).

Example Code: Save as "breaks-and-rules.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Line Breaks and Rules</title>
</head>
<body>
    
    <h1>Contact Information</h1>
    
    <p>
        John Doe<br>
        123 Main Street<br>
        New York, NY 10001<br>
        Phone: (123) 456-7890
    </p>
    <!-- <br> creates line breaks without making new paragraphs -->
    
    <hr>  <!-- Horizontal line to separate sections -->
    
    <h2>About Us</h2>
    <p>We are a company dedicated to excellence.</p>
    
    <hr>
    
    <h2>Poem Example</h2>
    <p>
        Roses are red,<br>
        Violets are blue,<br>
        HTML is awesome,<br>
        And so are you!
    </p>
    
</body>
</html>
```

### Hands-On Exercises for Day 2
Now it's your turn! Create a new file called "day2-practice.html" and complete these tasks:

1. Create a full HTML page with proper structure.
2. Add a heading: "My Favorite Quote"
3. Add a paragraph with a famous quote. Use `<strong>` for important words and `<em>` for emphasis.
4. Below the quote, add who said it using `<blockquote>` and format the name in italics.
5. Add a horizontal rule `<hr>` to separate sections.
6. Create a section "Math Examples":
   - Write: "The area of a square with side 5 is 5<sup>2</sup> = 25"
   - Write: "Water formula: H<sub>2</sub>O"
7. Create a section "Old vs New Price":
   - Show: "Was: <del>$200</del> Now: <ins>$150</ins>"
8. Highlight one important sentence with `<mark>`.
9. Use `<span>` to make just one word in a sentence red and bigger.
10. Add a poem or song lyrics using `<br>` for line breaks.

### Extra: 10 Practice Tasks with Important Inline Tags
Add these to your practice file one by one. Save and refresh after each!

1. **<q>** (Short quotation): `<p>Einstein said: <q>Imagination is more important than knowledge.</q></p>`

2. **<cite>** (Cite source): `<p>As written in <cite>The Great Gatsby</cite> by F. Scott Fitzgerald.</p>`

3. **<abbr>** (Abbreviation): `<p>The <abbr title="World Health Organization">WHO</abbr> was founded in 1948.</p>` (Hover to see full form!)

4. **<dfn>** (Definition): `<p><dfn>HTML</dfn> stands for HyperText Markup Language.</p>`

5. **<time>** (Date/Time): `<p>The event starts at <time datetime="2025-12-25">Christmas</time>.</p>`

6. **<kbd>** (Keyboard input): `<p>Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.</p>`

7. **<samp>** (Sample output): `<p>The program output: <samp>Hello World!</samp></p>`

8. **<var>** (Variable): `<p>Let <var>x</var> be the unknown value.</p>`

9. **<bdo>** (Bi-Directional Override): `<p>Normal text <bdo dir="rtl">This text goes right to left!</bdo></p>`

10. **<data>** (Machine-readable data): `<p>Product: <data value="12345">Awesome Gadget</data></p>`

Amazing work on Day 2! You've now learned how to make your text look professional and meaningful. Tomorrow we'll explore lists and tables. Keep practicing—try combining yesterday's and today's tags in creative ways! If something doesn't look right, check for missing closing tags. You're doing great! 🚀