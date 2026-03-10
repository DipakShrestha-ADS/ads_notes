# Day 25 — Final Project & Deployment

Today, you will **combine all their learning** to build a complete, responsive website and deploy it online.  
We will also cover **debugging, performance optimization**, and deployment options.

---

# 1. Build a Complete Website

### 1.1 Responsive Layout

- Use **CSS Grid** and **Flexbox** for layouts  
- Use **media queries** for mobile, tablet, and desktop

```css id="responsive_layout"
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
````

---

### 1.2 Navigation

* Add a **navigation bar** with links
* Use semantic `<nav>` element

```html id="nav_example"
<nav>
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>
```

---

### 1.3 Forms

* Add **contact or registration forms**
* Include **validation** and proper **labels**

```html id="form_example"
<form id="contactForm">
  <label for="name">Name:</label>
  <input type="text" id="name" required>
  <button type="submit">Submit</button>
</form>
```

---

### 1.4 Dynamic Content

* Use **JavaScript** to update content dynamically
* Example: Display messages, fetch API data, or add new items

```javascript id="dynamic_content"
let msgContainer = document.getElementById("messages");
function showMessage(text) {
  let p = document.createElement("p");
  p.innerText = text;
  msgContainer.appendChild(p);
}
showMessage("Welcome to the site!");
```

---

# 2. Development Skills

### 2.1 Debugging Techniques

* Use **browser console**: `console.log()`, `console.error()`
* Use **breakpoints** in developer tools
* Test **edge cases** for forms and interactive elements

---

### 2.2 Performance Basics

* Minimize **DOM operations**
* Use **CSS over JavaScript** for animations
* Optimize **images and assets**
* Load scripts at the **end of body** or use `defer`

```html
<script src="script.js" defer></script>
```

---

### 2.3 Code Cleanup

* Remove unused variables and functions
* Add comments and organize code
* Separate **HTML, CSS, JS** into different files
* Use consistent **indentation and naming conventions**

---

# 3. Deployment

### 3.1 GitHub Pages

* Host static sites directly from **GitHub repository**
* Steps:

  1. Push project to GitHub
  2. Go to repository → Settings → Pages
  3. Select branch (`main` / `master`) and folder (`/root` or `/docs`)
  4. Save → GitHub provides URL

---

### 3.2 Netlify

* Free hosting for static sites
* Steps:

  1. Sign up on Netlify
  2. Connect GitHub repository
  3. Configure build settings if using JS framework
  4. Deploy → site live instantly

---

### 3.3 Firebase Hosting

* Free hosting for static and dynamic sites
* Steps:

  1. Install Firebase CLI: `npm install -g firebase-tools`
  2. Initialize project: `firebase init`
  3. Deploy: `firebase deploy`
  4. Firebase provides live URL

---

# Complete Project Example Structure

```
project/
├─ index.html          # Main HTML file
├─ about.html          # About page
├─ contact.html        # Contact page
├─ css/
│  └─ style.css        # Stylesheet
├─ js/
│  └─ script.js        # JavaScript
├─ images/             # Assets
└─ README.md
```
