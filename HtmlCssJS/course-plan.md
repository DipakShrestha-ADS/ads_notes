### 25-Day Course: Mastering HTML, CSS, and JavaScript

This course is designed for beginners to advanced learners, assuming no prior knowledge. It progresses logically: starting with an expanded HTML section for deeper structure mastery, followed by an extended CSS for comprehensive styling and layouts, then JavaScript for interactivity (kept unchanged in scope), and integrating all three for real-world projects. Each day includes:

- **Key Topics**: Core concepts with brief explanations.
- **Hands-On Exercises**: Practical tasks to reinforce learning. Use a code editor like VS Code and a browser for testing. Aim to spend 1-2 hours coding per day.
- **Resources**: Free tools like MDN Web Docs, freeCodeCamp, or W3Schools for reference.
- **Tips for All Learners**: Read explanations first, code along, experiment, and debug errors. If you're a slow learner, revisit previous days; if advanced, add challenges like optimizing code or adding accessibility features.

By Day 25, you'll build a full interactive website, making you proficient in front-end development.

#### Day 1: HTML Basics - Introduction to Web Structure
**Key Topics**:
- What is HTML? HyperText Markup Language for creating web page structure.
- Basic syntax: Tags, elements, attributes.
- Document structure: `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`.
- Common elements: Headings (`<h1>` to `<h6>`), paragraphs (`<p>`), links (`<a>`), images (`<img>`).

**Hands-On Exercises**:
1. Create an `index.html` file with a basic structure.
2. Add a heading, paragraph, a link to Google, and an image (use a placeholder URL like "https://via.placeholder.com/150").
3. Open in a browser and inspect elements (right-click > Inspect).

#### Day 2: HTML Text Formatting and Inline Elements
**Key Topics**:
- Text elements: Bold (`<strong>`), italic (`<em>`), underline (`<u>`), strikethrough (`<del>`), code (`<code>`).
- Inline vs. block elements.
- Spans (`<span>`) for grouping inline content.
- Line breaks (`<br>`) and horizontal rules (`<hr>`).

**Hands-On Exercises**:
1. Enhance Day 1's page with formatted text (e.g., bold a heading, italicize a quote).
2. Use spans to group and later style phrases.
3. Create a simple resume section with formatted text and breaks.

#### Day 3: HTML Lists and Tables
**Key Topics**:
- Lists: Unordered (`<ul>`), ordered (`<ol>`), definition (`<dl>`).
- Tables: `<table>`, `<tr>`, `<th>`, `<td>`, attributes like `rowspan` and `colspan`.
- Nesting elements for complex structures.

**Hands-On Exercises**:
1. Build a shopping list using `<ul>` and nest a sub-list.
2. Create a table for a weekly schedule (e.g., days vs. tasks).
3. Add links within list items to external sites and nest a table inside a list.

#### Day 4: HTML Forms and Input Elements - Part 1
**Key Topics**:
- Forms: `<form>`, attributes like `action` and `method`.
- Basic input types: Text (`<input type="text">`), password, email.
- Labels (`<label>`) and fieldsets (`<fieldset>`) for organization.

**Hands-On Exercises**:
1. Create a simple login form with username, password, and submit button.
2. Add labels and group inputs in a fieldset.
3. Test submission (use a placeholder action like "#").

#### Day 5: HTML Forms and Input Elements - Part 2
**Key Topics**:
- Advanced inputs: Radio, checkbox, select (`<select>`), textarea, file.
- Buttons: Submit, reset, button types.
- Form validation basics (required, pattern attributes).

**Hands-On Exercises**:
1. Expand Day 4's form to include gender (radio), hobbies (checkbox), country (select), and a message (textarea).
2. Add validation (e.g., required email, pattern for phone number).
3. Create a survey form combining all input types.

#### Day 6: Semantic HTML and Multimedia
**Key Topics**:
- Semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<aside>` for better SEO and accessibility.
- Multimedia: Audio (`<audio>`), video (`<video>`), iframes (`<iframe>` for embedding).

**Hands-On Exercises**:
1. Refactor a previous page using semantic tags (e.g., wrap content in `<main>`).
2. Embed a YouTube video via `<iframe>` and add an audio player with controls.
3. Ensure accessibility (add alt text to images, captions to media).

#### Day 7: Advanced HTML - Meta Tags, Accessibility, and Best Practices
**Key Topics**:
- Meta tags in `<head>`: Charset, viewport for mobile, title, description, keywords for SEO.
- HTML5 features: Canvas (`<canvas>` for drawing), SVG basics.
- Accessibility: ARIA roles, alt attributes, keyboard navigation.
- Review: Validating HTML with tools like W3C Validator, best practices for clean code.

**Hands-On Exercises**:
1. Add meta tags to your survey form for responsiveness and SEO.
2. Create a simple drawing on `<canvas>` and an inline SVG shape.
3. Build a full accessible portfolio page combining all HTML elements, validate it online.

#### Day 8: CSS Basics - Introduction to Styling
**Key Topics**:
- What is CSS? Cascading Style Sheets for presentation.
- Syntax: Selectors, properties, values.
- Linking CSS: Inline, internal (`<style>`), external (link to .css file).
- Basic properties: Color, background, font-family, font-size, text-align.

**Hands-On Exercises**:
1. Create a `styles.css` file and link it to your Day 7 portfolio.
2. Style headings (e.g., color: blue), paragraphs (font: Arial), and add a background color to the body.
3. Experiment with text properties like line-height and letter-spacing.

#### Day 9: CSS Selectors and Specificity
**Key Topics**:
- Advanced selectors: Element, class (`.class`), ID (`#id`), attribute selectors, combinators (descendant, child, sibling).
- Specificity rules: How styles override (inline > ID > class > element).
- Pseudo-classes (:hover, :active, :focus) and pseudo-elements (::before, ::after).

**Hands-On Exercises**:
1. Add classes and IDs to your HTML and style them specifically.
2. Use combinators to style nested elements (e.g., ul li).
3. Add hover effects and pseudo-elements for content insertion (e.g., add arrows to links).

#### Day 10: CSS Box Model and Display Properties
**Key Topics**:
- Box model: Content, padding, border, margin.
- Display properties: Block, inline, inline-block, none.
- Overflow handling, box-sizing.

**Hands-On Exercises**:
1. Style a div as a box with custom padding, border, and margin.
2. Change display types to rearrange elements (e.g., make list items inline).
3. Create a card component with overflow hidden for images.

#### Day 11: CSS Layout - Positioning and Floats
**Key Topics**:
- Positioning: Static, relative, absolute, fixed, sticky.
- Floats: Float left/right for wrapping text around images.
- Clearing floats with clearfix.

**Hands-On Exercises**:
1. Build a simple navigation bar using floats.
2. Position a fixed header and an absolute sidebar on your portfolio.
3. Create a magazine-style layout with floated images and text wrap.

#### Day 12: Flexbox for Responsive Layouts - Part 1
**Key Topics**:
- Flexbox basics: Container (`display: flex;`), flex-direction, justify-content, align-items.
- Flex items: flex-grow, flex-shrink, flex-basis.

**Hands-On Exercises**:
1. Convert a floated layout to Flexbox for a header with logo and nav.
2. Align items in a container (e.g., center vertically and horizontally).
3. Build a flexible footer with evenly spaced links.

#### Day 13: Flexbox for Responsive Layouts - Part 2
**Key Topics**:
- Advanced Flexbox: Wrapping (flex-wrap), ordering (order), aligning content.
- Media queries for responsiveness (@media screen and (max-width: 600px)).
- Combining with other layouts.

**Hands-On Exercises**:
1. Create a responsive card gallery that wraps and stacks on mobile.
2. Use order to rearrange items on smaller screens.
3. Add media queries to your portfolio for mobile views.

#### Day 14: CSS Grid and Advanced Styling
**Key Topics**:
- Grid: Container (`display: grid;`), grid-template-columns/rows, gaps, grid areas.
- Naming grid lines and areas for complex layouts.
- Nested grids.

**Hands-On Exercises**:
1. Build a dashboard layout with CSS Grid (e.g., header, sidebar, main, footer).
2. Assign grid areas and span items across cells.
3. Make it responsive with media queries.

#### Day 15: CSS Transitions, Animations, and Best Practices
**Key Topics**:
- Transitions: Transition property for smooth changes (e.g., on hover).
- Animations: @keyframes, animation properties.
- Variables (custom properties: --var-name).
- Best practices: Performance, vendor prefixes, organizing CSS.

**Hands-On Exercises**:
1. Add transitions to buttons (e.g., color change on hover).
2. Create a loading spinner with @keyframes.
3. Use variables for a theme switcher and refactor your styles for efficiency.

#### Day 16: JavaScript Basics - Introduction to Programming
**Key Topics**:
- What is JS? Scripting language for interactivity.
- Syntax: Variables (let, const, var), data types (strings, numbers, booleans).
- Operators: Arithmetic, comparison, logical.
- Console logging for debugging.

**Hands-On Exercises**:
1. Create a `script.js` file and link it to your HTML.
2. Declare variables (e.g., let name = "John";) and log them to console.
3. Write a simple calculator: Add two numbers input by prompt() and alert the result.

#### Day 17: JS Control Structures
**Key Topics**:
- Conditionals: If/else, switch.
- Loops: For, while, do-while.
- Arrays: Creation, methods (push, pop, splice).

**Hands-On Exercises**:
1. Build a grade calculator: Use if/else on a score to output pass/fail.
2. Loop through an array of names and log each.
3. Create a to-do list array and add/remove items.

#### Day 18: JS Functions and Scope
**Key Topics**:
- Functions: Declaration, expressions, arrow functions.
- Parameters, return values.
- Scope: Global vs. local.
- ES6 features: Template literals.

**Hands-On Exercises**:
1. Write a function to calculate factorial using recursion.
2. Create an arrow function that greets a user by name.
3. Build a simple game: Guess a number (use loops and conditionals).

#### Day 19: DOM Manipulation
**Key Topics**:
- Document Object Model: Accessing elements (getElementById, querySelector).
- Modifying: innerHTML, textContent, style.
- Creating/removing elements dynamically.

**Hands-On Exercises**:
1. Select and change the text of a heading on your portfolio.
2. Add a button that creates a new list item on click.
3. Toggle a class to change styles (e.g., dark mode).

#### Day 20: JS Events and Forms
**Key Topics**:
- Events: addEventListener (click, submit, keydown).
- Event objects, preventing default.
- Form handling: Validate inputs on submit.

**Hands-On Exercises**:
1. Add a click event to a button that alerts a message.
2. Validate your form: Check if email is valid before submit.
3. Create an interactive quiz: Buttons that check answers and update score.

#### Day 21: Advanced JS - Objects and Arrays
**Key Topics**:
- Objects: Creation, properties, methods.
- Array methods: map, filter, reduce.
- JSON: Parsing and stringifying.

**Hands-On Exercises**:
1. Create an object for a user profile and log its properties.
2. Filter an array of numbers to evens using filter().
3. Build a contact list: Store objects in an array and display them.

#### Day 22: Asynchronous JS - Promises and Fetch
**Key Topics**:
- Async basics: Callbacks, promises (then/catch).
- Fetch API for HTTP requests.
- Async/await for cleaner code.

**Hands-On Exercises**:
1. Fetch data from a public API (e.g., JSONPlaceholder users) and log it.
2. Use async/await to get and display posts on your page.
3. Handle errors with try/catch.

#### Day 23: JS Modules and ES6+ Features
**Key Topics**:
- Modules: Import/export for code organization.
- Destructuring, spread/rest operators.
- Classes and inheritance.

**Hands-On Exercises**:
1. Split your JS into modules (e.g., utils.js) and import functions.
2. Create a class for a "Car" with methods and extend it.
3. Refactor your quiz to use classes.

#### Day 24: Integrating HTML, CSS, JS - Building Components
**Key Topics**:
- Combining: Dynamic styling, event-driven layouts.
- LocalStorage for persistence.
- Best practices: Clean code, error handling.

**Hands-On Exercises**:
1. Build a to-do app: Add tasks (JS), style with CSS, store in LocalStorage.
2. Make it responsive and add animations (e.g., fade out on delete).
3. Fetch and display API data in a grid layout.

#### Day 25: Final Project - Full Interactive Website
**Key Topics**:
- Review all concepts.
- Deployment basics (e.g., GitHub Pages).
- Debugging and optimization.

**Hands-On Exercises**:
1. Build a complete website: E.g., a personal blog with navigation, forms for comments, dynamic content from API, responsive design, and animations.
2. Deploy to GitHub Pages.
3. Test across devices and fix bugs. Challenge: Add user authentication simulation.

Congratulations! You've completed the course. Practice by building more projects, contribute to open-source, or explore frameworks like React for next steps. If stuck, review days or seek forums like Stack Overflow.