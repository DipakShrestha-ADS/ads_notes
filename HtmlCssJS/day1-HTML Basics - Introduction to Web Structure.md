### Day 1: HTML Basics - Introduction to Web Structure

Welcome to Day 1 of your journey to becoming a pro in HTML, CSS, and JavaScript! Today, we'll start with the basics of HTML. Think of HTML as the "skeleton" of a website—it gives structure to the content, like bones give shape to a body. We'll learn step by step in simple words, with easy examples. If you're new, don't worry; we'll explain everything like we're chatting. If you know a bit already, these notes will help you review and practice.

You'll need:
- A text editor (like Notepad on Windows, TextEdit on Mac, or free ones like VS Code).
- A web browser (like Chrome or Firefox) to see your work.

Let's break it down topic by topic. For each, I'll explain what it is, why it's important, and give a code example with comments (notes inside the code starting with <!-- -->) so you can understand every part.

#### Topic 1: What is HTML?
HTML stands for HyperText Markup Language. It's not a programming language like one that does math—it's a way to tell the browser how to display text, images, and links on a web page. "HyperText" means you can link to other pages, and "Markup" means you use special "tags" to mark up (or label) your content.

Why it's important: Without HTML, websites would just be plain text files. HTML makes them organized and clickable.

Example: No code yet—this is just the intro. But imagine writing a story; HTML helps you say, "This is the title, this is a paragraph, this is a picture."

#### Topic 2: Basic Syntax - Tags, Elements, and Attributes
- **Tags**: These are the building blocks. They look like <tagname> and usually come in pairs: an opening tag <tag> and a closing tag </tag>. The closing one has a slash (/).
- **Elements**: A full tag pair with content inside, like <p>Hello!</p>. This is a paragraph element.
- **Attributes**: Extra info inside the opening tag, like <a href="https://example.com">Link</a>. Here, "href" is the attribute that tells where the link goes.

Why it's important: Syntax is like grammar in English—if you get it wrong, the browser might not understand your page.

Example Code: Save this as "syntax-example.html" and open it in your browser.
```html
<!DOCTYPE html>  <!-- This declares the document type; we'll explain it soon. -->
<html>  <!-- The root element; everything goes inside here. -->

<head>  <!-- Head section: For info about the page, not visible on the screen. -->
    <title>Basic Syntax Example</title>  <!-- Title shows in the browser tab. -->
</head>

<body>  <!-- Body section: This is where visible content goes. -->
    
    <!-- Example of a tag and element: A heading tag -->
    <h1>This is a Heading</h1>  <!-- <h1> is the opening tag, </h1> is closing. The whole thing is an element. -->
    
    <!-- Example with attribute: A link tag -->
    <a href="https://www.example.com">Click Me!</a>  <!-- "href" is an attribute that sets the link URL. -->
    
</body>

</html>
```
What you'll see: A big heading and a clickable link. Comments (<!-- -->) are invisible on the page—they're just for you to read in the code.

#### Topic 3: Document Structure
Every HTML page has a standard structure to work properly:
- **<!DOCTYPE html>**: Tells the browser this is an HTML5 document (the latest version).
- **<html>**: The main container for everything.
- **<head>**: Holds info like the page title, not shown on the screen.
- **<body>**: Where all the visible stuff (text, images) goes.

Why it's important: It's like a house blueprint—if the structure is wrong, the page might break on some browsers.

Example Code: Save as "structure-example.html".
```html
<!DOCTYPE html>  <!-- This must be the first line; it says "Hey browser, this is modern HTML!" -->

<html lang="en">  <!-- <html> wraps everything. "lang=en" attribute means the language is English (good for accessibility). -->
    
    <head>  <!-- Head: Non-visible info. -->
        <meta charset="UTF-8">  <!-- Sets character encoding so special letters like é work. -->
        <title>My First Page</title>  <!-- Title in the browser tab. -->
    </head>
    
    <body>  <!-- Body: Visible content starts here. -->
        <p>Welcome to my page!</p>  <!-- A simple paragraph. -->
    </body>

</html>
```
What you'll see: A tab titled "My First Page" with "Welcome to my page!" on the screen. Try removing <!DOCTYPE html> and reload— the page might look weird!

#### Topic 4: Common Elements
These are basic tags for everyday content:
- **Headings**: <h1> to <h6>—<h1> is the biggest (main title), <h6> is smallest (sub-sub-title).
- **Paragraphs**: <p>—For blocks of text.
- **Links**: <a>—Makes clickable text. Use "href" attribute for the URL.
- **Images**: <img>—Shows pictures. Use "src" for the image URL and "alt" for text if the image doesn't load (good for blind users).

Why it's important: These are the most used tags. Headings help search engines understand your page, paragraphs organize text, links connect pages, and images make it visual.

Example Code: Save as "common-elements-example.html".
```html
<!DOCTYPE html>  <!-- Document type declaration. -->
<html>  <!-- Root element. -->

<head>  <!-- Page info. -->
    <title>Common Elements Demo</title>  <!-- Browser tab title. -->
</head>

<body>  <!-- Visible content. -->
    
    <!-- Headings: Use for titles and sections. -->
    <h1>Main Title (Biggest)</h1>  <!-- h1 for top-level heading. -->
    <h2>Sub-Title</h2>  <!-- h2 for secondary. -->
    <h3>Even Smaller</h3>  <!-- And so on up to h6. -->
    
    <!-- Paragraph: For regular text. -->
    <p>This is a paragraph. It's a block of text that the browser treats as one unit.</p>
    
    <!-- Link: Clickable text. -->
    <a href="https://www.google.com">Go to Google</a>  <!-- "href" attribute points to the website. -->
    
    <!-- Image: Displays a picture. -->
    <img src="https://via.placeholder.com/150" alt="A placeholder image">  <!-- "src" is the image location (URL). "alt" describes it for accessibility. -->
    
</body>

</html>
```
What you'll see: Titles in different sizes, a paragraph, a link, and a small square image. Hover over the link and click it!

### Hands-On Exercises
Now, practice what you learned. Create files in a folder called "Day1-Practice".

1. Create an `index.html` file with a basic structure. Include <!DOCTYPE html>, <html>, <head> with a title, and an empty <body>. Open it in your browser—it should show a blank page with your title in the tab.

2. Add a heading (<h1>Hello World!</h1>), a paragraph (<p>This is my first web page.</p>), a link to Google (<a href="https://www.google.com">Search Here</a>), and an image (<img src="https://via.placeholder.com/200" alt="Test Image">). Save and refresh the browser.

3. Open your page in the browser, right-click anywhere, and choose "Inspect" (or "Inspect Element"). This opens the developer tools. Click on elements in the inspector to see how your HTML tags match the page. Try changing a tag in the inspector (it won't save, but it's fun to experiment).

### Extra: 10 Tasks on Other Important Tags
HTML has many more tags! These aren't in today's main topics, but they're super useful. Each task introduces one and asks you to add it to your "index.html" file. Practice them one by one, save, and refresh the browser each time. I've included a short explanation and example snippet for each.

1. **<div> Tag** (For grouping content, like a container): Add <div><p>Inside a div.</p></div>. Why? It helps organize sections for later styling.
   
2. **<span> Tag** (For inline grouping, like highlighting part of text): Add <p>This is <span>important</span> text.</p>. Why? Good for small changes without breaking lines.

3. **<br> Tag** (Line break): Add <p>First line.<br>Second line.</p>. Why? Forces a new line without a full paragraph break. (No closing tag needed!)

4. **<hr> Tag** (Horizontal rule/line): Add <hr> between two paragraphs. Why? Draws a line to separate sections.

5. **<strong> Tag** (Bold text): Add <p>This is <strong>bold</strong>.</p>. Why? Makes text stand out; better than old <b> for accessibility.

6. **<em> Tag** (Italic/emphasis): Add <p>This is <em>italic</em>.</p>. Why? Emphasizes text; screen readers say it differently.

7. **<ul> and <li> Tags** (Unordered list): Add <ul><li>Item 1</li><li>Item 2</li></ul>. Why? For bullet-point lists, like shopping items.

8. **<ol> and <li> Tags** (Ordered list): Add <ol><li>Step 1</li><li>Step 2</li></ol>. Why? For numbered lists, like instructions.

9. **<code> Tag** (Code snippet): Add <p>Write <code>console.log('Hello');</code> in JS.</p>. Why? Displays code in a special font.

10. **<blockquote> Tag** (Quote block): Add <blockquote><p>"Famous quote."</p></blockquote>. Why? Indents and styles quotes nicely.

Great job on Day 1! If something doesn't work, check for typos (like missing closing tags). Tomorrow, we'll build on this. Practice these until you're comfy—copy the examples and tweak them! If you're stuck, search "HTML [tag name] example" on Google.