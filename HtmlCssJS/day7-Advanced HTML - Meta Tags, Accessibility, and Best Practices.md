### Day 7: Advanced HTML - Meta Tags, Accessibility, and Best Practices

Welcome to Day 7—the final day of our HTML section! 🎉 You've already mastered structure, text formatting, lists, tables, forms, semantic elements, and multimedia. Today we'll polish everything with advanced features that make your pages professional, accessible, and search-engine friendly.

We'll cover:
- Meta tags (for SEO, mobile-friendliness, and more)
- Accessibility best practices (ARIA, alt text, etc.)
- HTML5 extras like `<canvas>` and basic SVG
- Validating your HTML and general best practices

Simple explanations, well-commented examples. Let's go!

#### Topic 1: Meta Tags in the `<head>`
The `<head>` section contains information **about** the page (not visible content). Meta tags are super important for:
- Telling browsers how to display the page (especially on mobile)
- Helping search engines understand your page (SEO)
- Setting character encoding

Key meta tags:
- `<meta charset="UTF-8">`: Supports special characters (é, ñ, ₹, etc.)
- `<meta name="viewport" content="width=device-width, initial-scale=1">`: Makes page mobile-responsive
- `<meta name="description" content="Your page description">`: Shows in Google search results
- `<meta name="author" content="Your Name">`
- `<title>`: Most important for SEO and browser tab

Example Code: Save as "meta-tags-example.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Character encoding - always first -->
    <meta charset="UTF-8">
    
    <!-- Mobile responsiveness - VERY IMPORTANT -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- width=device-width: Page width matches screen -->
    <!-- initial-scale=1.0: No zoom by default -->
    
    <!-- SEO and search results -->
    <meta name="description" content="Learn HTML, CSS, and JavaScript with this 25-day course. Beginner-friendly with hands-on projects.">
    <meta name="keywords" content="HTML course, learn web development, beginner HTML">
    <meta name="author" content="Your Name">
    
    <!-- Social media preview (Open Graph) - optional but cool -->
    <meta property="og:title" content="25-Day HTML/CSS/JS Course">
    <meta property="og:description" content="Master front-end development in 25 days!">
    <meta property="og:image" content="https://via.placeholder.com/600x300?text=Course+Thumbnail">
    
    <!-- Page title (shows in tab and search results) -->
    <title>Day 7: Advanced HTML | My Learning Journey</title>
</head>
<body>
    <h1>Welcome to My Professional Website</h1>
    <p>This page uses proper meta tags!</p>
</body>
</html>
```
Try it: Resize your browser window—the page should adjust nicely (thanks to viewport). Search engines will love the description!

#### Topic 2: Accessibility (a11y) Best Practices
Accessibility means making your site usable by **everyone**, including people with disabilities.

Key rules you should already be following:
- Use semantic tags (Day 6)
- Add `alt` text to every `<img>`
- Use labels with forms (Day 4-5)
- Proper heading structure (h1 → h2 → h3, no skipping)

Advanced accessibility:
- **ARIA (Accessible Rich Internet Applications)** attributes:
  - `role`: Describes element purpose
  - `aria-label`: Provides label when none visible
  - `aria-hidden="true"`: Hides decorative elements from screen readers

Example Code: Save as "accessibility-example.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Accessible Page Example</title>
</head>
<body>
    
    <!-- Good heading structure -->
    <h1>Main Title</h1>
    <h2>Section 1</h2>
    <h3>Subsection</h3>
    
    <!-- Image with descriptive alt -->
    <img src="cat.jpg" alt="A cute orange cat sleeping on a windowsill">
    
    <!-- Decorative image - hide from screen readers -->
    <img src="decorative-line.png" alt="" aria-hidden="true">
    
    <!-- Button with ARIA label (if no text) -->
    <button aria-label="Close modal window">
        <span aria-hidden="true">&times;</span>  <!-- × symbol hidden from screen readers -->
    </button>
    
    <!-- Navigation landmark -->
    <nav aria-label="Main navigation">
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
        </ul>
    </nav>
    
    <!-- Main content landmark -->
    <main>
        <h2>Welcome</h2>
        <p>This page is accessible!</p>
    </main>
    
</body>
</html>
```

#### Topic 3: HTML5 Features - Canvas and SVG Basics
- **`<canvas>`**: For drawing graphics with JavaScript (games, charts).
- **SVG (Scalable Vector Graphics)**: For scalable images (logos, icons).

Simple Canvas Example: Save as "canvas-example.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Canvas Drawing</title>
</head>
<body>
    
    <h1>Simple Canvas Drawing</h1>
    
    <canvas id="myCanvas" width="400" height="200" style="border:1px solid black;">
        Your browser does not support canvas.
    </canvas>
    
    <script>
        // JavaScript to draw on canvas
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        
        // Draw a rectangle
        ctx.fillStyle = 'blue';
        ctx.fillRect(50, 50, 100, 80);
        
        // Draw a circle
        ctx.beginPath();
        ctx.arc(250, 100, 50, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
        
        // Draw text
        ctx.font = '30px Arial';
        ctx.fillStyle = 'green';
        ctx.fillText('Hello Canvas!', 100, 180);
    </script>
    
</body>
</html>
```

Simple SVG Example:
```html
<h1>Inline SVG Example</h1>

<!-- SVG code directly in HTML -->
<svg width="200" height="200" viewBox="0 0 200 200">
    <!-- Blue circle -->
    <circle cx="100" cy="100" r="80" fill="blue" />
    
    <!-- Yellow smile -->
    <circle cx="70" cy="80" r="15" fill="yellow" />
    <circle cx="130" cy="80" r="15" fill="yellow" />
    
    <!-- Smile arc -->
    <path d="M60 120 Q100 160 140 120" stroke="yellow" stroke-width="10" fill="none" />
    
    <text x="50" y="180" font-size="20" fill="white">Smiley Face!</text>
</svg>
```

#### Topic 4: Validating HTML and Best Practices
- **Validate your code**: Use https://validator.w3.org/ — paste your code or URL to find errors.
- Best practices:
  - Always use lowercase tags
  - Close all tags
  - Quote attributes (`alt="text"`)
  - Use semantic tags
  - Add alt text, labels, meta viewport
  - Keep code indented and organized

### Hands-On Exercises for Day 7
Create "day7-practice.html" — your **final HTML portfolio page**!

1. Full proper structure with all meta tags (charset, viewport, description, title).
2. Use semantic layout: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
3. Add your name, photo (with alt), and bio.
4. Include sections: About Me, Skills (list), Projects (with images and descriptions).
5. Add a contact form (from Day 4-5) with full accessibility.
6. Embed a YouTube video or audio.
7. Add a simple canvas drawing or SVG icon.
8. Validate your page at validator.w3.org — fix any errors!
9. Make it accessible: alt text, labels, ARIA where needed.
10. Add Open Graph meta tags for social sharing.

### Extra: 10 Practice Tasks
Add these to your portfolio:

1. Add `lang="en"` to `<html>`.
2. Use `<progress>` tag for skill levels.
3. Use `<meter>` for ratings.
4. Add skip navigation link: `<a href="#main">Skip to content</a>`.
5. Use `tabindex` for custom focus order.
6. Add more ARIA roles (e.g., `role="banner"` on header).
7. Draw something fun on canvas (house, flag).
8. Create your own SVG logo.
9. Add favicon: `<link rel="icon" href="favicon.ico">`.
10. Test your page with a screen reader (or Wave tool online).

**Congratulations! You've completed the entire HTML section!** 🎊  
You now know professional, modern HTML5. Your pages are structured, accessible, responsive-ready, and SEO-friendly.

Tomorrow (Day 8) we start **CSS** — where the magic of styling begins!  
Keep your Day 7 portfolio — we'll style it beautifully soon.

You're doing incredibly well. Keep practicing, and be proud of how far you've come! 🚀