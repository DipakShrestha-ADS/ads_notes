# Day 12: Routing in React

**React Router** is the most popular library for handling navigation and routing in React applications. It allows you to create single-page applications (SPAs) that feel like multi-page sites by rendering different components based on the URL.

We will use **React Router v6** (current standard).

## 1. Introduction to React Router

### Why React Router?
- React itself has no built-in routing.
- React Router lets you:
  - Define routes (URL → component).
  - Navigate without full page reloads.
  - Support nested and dynamic URLs.
  - Handle 404 pages, redirects, etc.

### Installation
```bash
npm install react-router-dom
```

## 2. Setting Up Routes

In v6, routing is set up using `<BrowserRouter>`, `<Routes>`, and `<Route>`.

### Basic Setup Example with Line Comments

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Page components
function Home() {
  return <h1>Home Page 🏠</h1>;
}

function About() {
  return <h1>About Page ℹ️</h1>;
}

function Contact() {
  return <h1>Contact Page ✉️</h1>;
}

function NotFound() {
  return <h1>404 - Page Not Found 🚫</h1>;
}

// Main App component with routing
function App() {
  return (
    <BrowserRouter>                          {/* Wrap entire app */}
      <div style={{ padding: '20px' }}>
        <h2>My Multi-Page App</h2>
        <hr />
        
        <Routes>                               {/* Container for all routes */}
          <Route path="/" element={<Home />} />        {/* Exact home route */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />    {/* Catch-all for 404 */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

**Key Changes in v6:**
- `Switch` → `<Routes>`
- `component` → `element={<Component />}`
- No more `exact` needed in most cases (automatic).

## 3. Dynamic and Nested Routes

### Dynamic Routes (URL Parameters)

Use `:paramName` to capture URL segments.

```jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams();              // Extract URL param

  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {id}</p>
    </div>
  );
}

// In Routes:
<Route path="/users/:id" element={<UserProfile />} />
```

URL `/users/123` → displays "User ID: 123"

### Nested Routes

Render child routes inside a parent layout.

```jsx
function Dashboard() {
  return (
    <div>
      <h1>Dashboard Layout</h1>
      <nav>
        <Link to="profile">Profile</Link> | 
        <Link to="settings">Settings</Link>
      </nav>
      <Outlet />                              {/* Child routes render here */}
    </div>
  );
}

function Profile() { return <h2>User Profile</h2>; }
function Settings() { return <h2>Settings</h2>; }

// In Routes:
<Route path="/dashboard" element={<Dashboard />}>
  <Route path="profile" element={<Profile />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

URL `/dashboard/profile` → shows Dashboard layout with Profile inside.

## 4. Navigation Using Link

Use `<Link>` instead of `<a>` to prevent full page reloads.

```jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      background: '#333',
      padding: '15px',
      marginBottom: '20px'
    }}>
      <Link to="/" style={{ color: '#fff', margin: '0 15px', textDecoration: 'none' }}>
        Home
      </Link>
      <Link to="/about" style={{ color: '#fff', margin: '0 15px', textDecoration: 'none' }}>
        About
      </Link>
      <Link to="/contact" style={{ color: '#fff', margin: '0 15px', textDecoration: 'none' }}>
        Contact
      </Link>
    </nav>
  );
}
```

**Programmatic Navigation** (e.g., after form submit):

```jsx
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // ... login logic
    navigate('/dashboard');                // Redirect programmatically
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

## Hands-On Solution: Simple Multi-Page App

**Requirement:**  
Build a simple multi-page app with Home, About, and Contact pages, including navigation and a 404 page.

### Complete Solution with Detailed Comments

```jsx
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  useNavigate
} from 'react-router-dom';

// Navigation component
function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#282c34',
      padding: '20px',
      textAlign: 'center'
    }}>
      <Link 
        to="/" 
        style={{ color: 'white', margin: '0 20px', textDecoration: 'none', fontSize: '18px' }}
      >
        Home
      </Link>
      <Link 
        to="/about" 
        style={{ color: 'white', margin: '0 20px', textDecoration: 'none', fontSize: '18px' }}
      >
        About
      </Link>
      <Link 
        to="/contact" 
        style={{ color: 'white', margin: '0 20px', textDecoration: 'none', fontSize: '18px' }}
      >
        Contact
      </Link>
    </nav>
  );
}

// Page components
function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Welcome to Home Page 🏠</h1>
      <p>This is the main landing page of our app.</p>
    </div>
  );
}

function About() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>About Us ℹ️</h1>
      <p>We are learning React Router!</p>
      <p>React Router helps create multi-page feel in single-page apps.</p>
    </div>
  );
}

function Contact() {
  const navigate = useNavigate();          // For programmatic navigation

  const handleSubmit = () => {
    alert("Message sent!");
    navigate('/');                         // Redirect to home after submit
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Contact Us ✉️</h1>
      <p>Send us a message:</p>
      <textarea style={{ width: '300px', height: '100px' }} />
      <br /><br />
      <button onClick={handleSubmit} style={{ padding: '10px 20px' }}>
        Send Message
      </button>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>404 - Page Not Found 🚫</h1>
      <p>Sorry, this page doesn't exist.</p>
      <Link to="/">Go Back Home</Link>
    </div>
  );
}

// Layout with Navbar
function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />                              {/* Pages render here */}
    </div>
  );
}

// Main App
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>           {/* Shared layout */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />  {/* 404 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**Features:**
- Shared navbar on all pages.
- Clean navigation with `<Link>`.
- 404 handling.
- Programmatic redirect after contact form.

## 10 Practice Tasks for Each Topic

### 1. Introduction to React Router – 10 Tasks

1. Explain difference between client-side and server-side routing.

2. List 3 benefits of React Router.

3. Compare React Router v5 vs v6 major changes.

4. Research: When to use HashRouter vs BrowserRouter.

5. Explain what `<Outlet />` does.

6. Describe how React Router handles URL synchronization.

7. Research: Protected routes concept.

8. Explain lazy loading with React Router.

9. Describe navigation blocking.

10. Research: Server-side rendering with React Router.

### 2. Setting Up Routes – 10 Tasks

1. Set up basic routes for Home and Products.

2. Add a 404 page.

3. Create routes with exact path matching.

4. Set up redirect from old URL to new.

5. Create layout route with shared header/footer.

6. Add nested routes under /admin.

7. Set up index route for parent path.

8. Create route with multiple path aliases.

9. Add loader animation while switching routes.

10. Set up base path (basename) in BrowserRouter.

### 3. Dynamic and Nested Routes – 10 Tasks

1. Create `/products/:id` dynamic route.

2. Build user profile with `/users/:username`.

3. Create blog with `/blog/:slug`.

4. Nested dashboard with sub-routes (overview, analytics).

5. Product category with nested products list.

6. Admin panel with nested users/settings.

7. Extract dynamic param and display in title.

8. Validate dynamic param (e.g., only numbers).

9. Create optional dynamic param.

10. Build breadcrumb based on nested routes.

### 4. Navigation Using Link – 10 Tasks

1. Create navbar with active link styling.

2. Build sidebar navigation.

3. Add "back" button using navigate(-1).

4. Create breadcrumb navigation.

5. Build tab navigation with Link.

6. Add smooth scroll after navigation.

7. Create dropdown menu with Links.

8. Programmatically navigate after login.

9. Navigate with state (pass data).

10. Prevent navigation with confirmation.

Master routing to build real-world multi-page React applications! 🚀