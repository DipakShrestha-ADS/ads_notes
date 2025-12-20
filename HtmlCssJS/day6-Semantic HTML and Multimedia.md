### Day 6: Semantic HTML and Multimedia

Welcome to Day 6! You're halfway through the HTML section—amazing progress!  

Up until now, we've used basic tags like `<div>`, `<p>`, `<h1>`, etc., which work fine but don't tell much about the **meaning** of the content. Today we'll learn **Semantic HTML**—tags that clearly describe what each part of the page is for. This helps search engines (like Google), screen readers (for blind users), and even other developers understand your page better.

We'll also learn how to add **audio** and **video**, and how to embed content from other sites using `<iframe>`.

Everything explained in simple words with well-commented examples. Save and test each one!

#### Topic 1: What is Semantic HTML and Why Use It?
- **Non-semantic tags**: `<div>`, `<span>` — they just group things, no meaning.
- **Semantic tags**: Tell exactly what the content is (e.g., `<header>` = top section, `<nav>` = navigation).

Benefits:
- Better SEO (search engines rank semantic pages higher).
- Better accessibility (screen readers announce "navigation", "main content", etc.).
- Cleaner, easier-to-read code.

Common semantic tags:
- `<header>`: Top area (logo, title).
- `<nav>`: Navigation menu.
- `<main>`: Main content (the most important part).
- `<section>`: Thematic group of content.
- `<article>`: Self-contained content (blog post, news).
- `<aside>`: Sidebar or related info.
- `<footer>`: Bottom area (copyright, links).
- `<figure>` and `<figcaption>`: For images with captions.

Example Code: Save as "semantic-example.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Semantic HTML Example</title>
</head>
<body>
    
    <!-- Header: Usually contains logo and site title -->
    <header>
        <h1>My Awesome Website</h1>
        <p>Welcome to my personal blog!</p>
    </header>
    
    <!-- Navigation menu -->
    <nav>
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
    </nav>
    
    <!-- Main content area -->
    <main>
        
        <!-- A section for latest posts -->
        <section>
            <h2>Latest Blog Posts</h2>
            
            <!-- Each blog post is an article -->
            <article>
                <h3>How I Learned HTML</h3>
                <p>HTML is easy and fun...</p>
                <p><small>Posted on December 20, 2025</small></p>
            </article>
            
            <article>
                <h3>Why Semantic Tags Matter</h3>
                <p>They help everyone...</p>
                <p><small>Posted on December 19, 2025</small></p>
            </article>
        </section>
        
        <!-- Sidebar (related content) -->
        <aside>
            <h3>About Me</h3>
            <p>I'm learning web development!</p>
            <h3>Useful Links</h3>
            <ul>
                <li><a href="https://developer.mozilla.org">MDN Web Docs</a></li>
                <li><a href="https://w3schools.com">W3Schools</a></li>
            </ul>
        </aside>
        
    </main>
    
    <!-- Footer at the bottom -->
    <footer>
        <p>&copy; 2025 My Website. All rights reserved.</p>
        <p>Contact: example@email.com</p>
    </footer>
    
</body>
</html>
```
What you'll see: A clean, organized page. Inspect it (right-click → Inspect) and see how semantic tags make the structure clear!

#### Topic 2: Refactoring Old Code with Semantic Tags
Take any page you made before (like your portfolio or practice files) and replace `<div>` containers with proper semantic tags.

Tip: Ask yourself:
- Is this the header? → Use `<header>`
- Is this navigation? → Use `<nav>`
- Is this the main part? → Use `<main>`

#### Topic 3: Multimedia - Audio and Video
HTML5 makes it easy to add sound and video without plugins.

- **`<audio>`**: For sound/music.
- **`<video>`**: For videos.

Both support:
- `controls`: Shows play/pause buttons.
- `autoplay`: Starts automatically (use carefully!).
- `loop`: Repeats.
- `muted`: No sound (required for autoplay in many browsers).
- Multiple `<source>` tags for different formats.

Example Code: Save as "audio-video.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Audio and Video Example</title>
</head>
<body>
    
    <h1>Multimedia Demo</h1>
    
    <!-- Audio player -->
    <h2>Listen to This Song</h2>
    <audio controls>
        <!-- Provide multiple formats for better browser support -->
        <source src="https://www.w3schools.com/html/horse.ogg" type="audio/ogg">
        <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
    <!-- Use free test files or your own -->
    
    <h2>Watch This Video</h2>
    <video width="600" controls poster="https://via.placeholder.com/600x300?text=Video+Thumbnail">
        <!-- poster = thumbnail image before play -->
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
        <source src="https://www.w3schools.com/html/mov_bbb.ogg" type="video/ogg">
        Your browser does not support the video tag.
    </video>
    
    <!-- Simple autoplay muted video (common for background) -->
    <h2>Background Video (muted + loop)</h2>
    <video autoplay muted loop playsinline width="600">
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
    </video>
    
</body>
</html>
```

#### Topic 4: Embedding with `<iframe>`
- `<iframe>`: Embeds another webpage inside yours (like YouTube videos, Google Maps).

Common uses:
- YouTube videos.
- Maps.
- External content.

Example Code: Save as "iframe-example.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Iframe Example</title>
</head>
<body>
    
    <h1>Embedded Content</h1>
    
    <!-- YouTube Video -->
    <h2>Watch This Tutorial</h2>
    <iframe width="560" height="315" 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
    </iframe>
    <!-- Replace with any YouTube video ID -->
    
    <!-- Google Map -->
    <h2>Our Location</h2>
    <iframe src="https://www.google.com/maps/embed?pb=YOUR_MAP_LINK" 
            width="600" height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy">
    </iframe>
    
    <!-- Tip: Use title attribute for accessibility -->
    
</body>
</html>
```

#### Topic 5: Accessibility Tips for Media
- Always add `alt` to images.
- Add captions to videos if possible.
- Use `title` on iframes.
- Provide text alternatives.

### Hands-On Exercises for Day 6
Create "day6-practice.html" and do these:

1. Full page structure.
2. Use semantic tags to build a complete blog page layout: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
3. Add a real navigation menu with links.
4. Add an `<article>` with heading, paragraph, and image (with `alt`).
5. Use `<figure>` and `<figcaption>` for an image with caption.
6. Embed a YouTube video in your page.
7. Add an audio player (use free test audio from w3schools or similar).
8. Refactor one of your old practice files (like Day 3 or 5) using semantic tags.
9. Add an iframe for a Google Map or another website.
10. Make sure everything is accessible (alt text, titles).

### Extra: 10 Practice Tasks
Add these to your practice file:

1. Use `<details>` and `<summary>` for a FAQ accordion.
2. Use `<mark>` inside an article to highlight text.
3. Add `<time datetime="2025-12-20">December 20, 2025</time>` to a post date.
4. Use `<address>` for contact info in footer.
5. Create a figure: `<figure><img ...><figcaption>Caption here</figcaption></figure>`.
6. Embed a CodePen or JSFiddle demo with iframe.
7. Add multiple sources to audio/video.
8. Make a responsive iframe (we'll style it better with CSS later).
9. Use `<picture>` element for responsive images (advanced).
10. Add track for subtitles: `<track src="subtitles.vtt" kind="subtitles" srclang="en" label="English">`.

Incredible job on Day 6! Semantic HTML is a sign of professional coding. Tomorrow (Day 7) we'll wrap up HTML with meta tags, accessibility best practices, and more. Keep refactoring your old pages with semantic tags—it will make them so much better! You're building real-world skills every day! 🌟