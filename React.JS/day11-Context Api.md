# Day 11: Context API

The **Context API** is React's built-in solution for sharing data (like theme, user info, language) across many components without passing props manually through every level (prop drilling).

## 1. Introduction to Context API

### Problem: Prop Drilling

When deep components need the same data, you pass it through every intermediate component → messy and hard to maintain.

```jsx
<App /> 
  → <Header />          // needs theme
    → <Navbar />        // needs theme
      → <Logo />        // needs theme ← too many levels!
```

### Solution: Context API

- Create a **context** (global store).
- **Provide** the data at a high level.
- **Consume** it directly in any nested component.

**Benefits:**
- No prop drilling.
- Clean component tree.
- Easy to manage global state (theme, auth, etc.).

## 2. Creating and Using Context

Steps:
1. Create context with `createContext()`.
2. Wrap components with `<Context.Provider value={...}>`.
3. Consume with `useContext(Context)` (modern) or `<Context.Consumer>` (older).

### Example: Basic Context Usage with Line Comments

```jsx
import React, { createContext, useContext, useState } from 'react';

// Step 1: Create a context (default value optional)
const ThemeContext = createContext('light');   // Default theme if no provider

// Child component that consumes context
function Button() {
  const theme = useContext(ThemeContext);      // Directly access context value

  return (
    <button style={{
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
      padding: '10px 20px',
      border: theme === 'dark' ? '1px solid #fff' : '1px solid #000'
    }}>
      I am a {theme} button
    </button>
  );
}

// Deeply nested component
function DeepComponent() {
  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px dashed gray' }}>
      <h3>Deep Component</h3>
      <Button />                                 {/* No props passed! */}
    </div>
  );
}

// Intermediate component (no need to pass theme)
function Toolbar() {
  return (
    <div>
      <h2>Toolbar</h2>
      <DeepComponent />
    </div>
  );
}

// Parent component with Provider
function App() {
  const [theme, setTheme] = useState('light'); // Local state for theme

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div style={{ padding: '40px', minHeight: '100vh' }}>
      <h1>Context API Demo</h1>
      
      {/* Step 2: Provide value to all children */}
      <ThemeContext.Provider value={theme}>
        <button onClick={toggleTheme} style={{ marginBottom: '20px' }}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
        
        <Toolbar />                              {/* No theme prop needed */}
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
```

**Explanation:**
- `ThemeContext.Provider` makes `theme` available to all descendants.
- `useContext(ThemeContext)` reads the current value.
- Changing state in parent updates all consumers automatically.

## 3. Avoiding Prop Drilling

Without Context (Prop Drilling):

```jsx
<App theme={theme} />
  → <Header theme={theme} />
    → <Navbar theme={theme} />
      → <Button theme={theme} />   ← annoying!
```

With Context → clean and scalable.

## Hands-On Solution: Theme Switcher Using Context API

**Requirement:**  
Create a complete theme switcher (light/dark) using Context API. Include a toggle button and multiple components that react to theme change.

### Full Solution with Detailed Line Comments

```jsx
import React, { createContext, useContext, useState } from 'react';

// Step 1: Create Theme Context
const ThemeContext = createContext();

// Custom hook for easier consumption (optional but recommended)
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Header component using theme
function Header() {
  const { theme } = useTheme();                    // Consume theme

  return (
    <header style={{
      background: theme === 'dark' ? '#222' : '#f0f0f0',
      color: theme === 'dark' ? '#fff' : '#000',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1>My Awesome Website</h1>
    </header>
  );
}

// Card component using theme
function Card({ children }) {
  const { theme } = useTheme();

  return (
    <div style={{
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
      border: `2px solid ${theme === 'dark' ? '#555' : '#ddd'}`,
      borderRadius: '12px',
      padding: '20px',
      margin: '20px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      {children}
    </div>
  );
}

// Toggle button component
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();       // Consume both theme and toggle

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        background: theme === 'dark' ? '#555' : '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        margin: '20px'
      }}
    >
      Switch to {theme === 'dark' ? 'Light' : 'Dark'} Theme
    </button>
  );
}

// Main App with Provider
function App() {
  const [theme, setTheme] = useState('light');     // State for current theme

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Value object to provide
  const value = {
    theme,                                         // Current theme
    toggleTheme                                    // Function to change it
  };

  return (
    // Step 2: Provide context value to entire app
    <ThemeContext.Provider value={value}>
      <div style={{
        minHeight: '100vh',
        background: theme === 'dark' ? '#111' : '#f8f9fa',
        transition: 'background 0.3s ease'
      }}>
        <Header />
        
        <main style={{ padding: '20px' }}>
          <ThemeToggle />
          
          <Card>
            <h2>Welcome!</h2>
            <p>This card changes with the theme.</p>
          </Card>
          
          <Card>
            <h2>Another Card</h2>
            <p>All components automatically update when theme changes!</p>
          </Card>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
```

**Features:**
- Global theme state.
- Toggle button anywhere.
- Multiple components react instantly.
- No prop drilling.

## 10 Practice Tasks for Each Topic

### 1. Introduction to Context API – 10 Tasks

1. Explain in your own words what problem Context API solves.

2. List 5 common use cases for Context (theme, auth, language, etc.).

3. Compare Context vs Redux (when to use each).

4. Describe how Context re-renders components.

5. Explain the difference between Provider and Consumer.

6. Research: When should you avoid Context?

7. Explain default value in `createContext()`.

8. Describe multiple contexts in one app.

9. Explain context with dynamic values.

10. Research performance implications of Context.

### 2. Creating and Using Context – 10 Tasks

1. Create a `UserContext` with default user object.

2. Create a `LanguageContext` with current language string.

3. Build a `CartContext` for shopping cart items.

4. Create context for app settings (font size, color scheme).

5. Make a `AuthContext` with `isLoggedIn` and `login/logout` functions.

6. Create `NotificationContext` with message array.

7. Build `ModalContext` to control open/close modals.

8. Create `LoadingContext` for global loading spinner.

9. Make `SidebarContext` to toggle sidebar visibility.

10. Create `BreadcrumbContext` for navigation trail.

### 3. Avoiding Prop Drilling – 10 Tasks

1. Refactor a 4-level deep component tree using Context instead of props.

2. Move user authentication state from App to deep component via Context.

3. Replace theme props passed through 3 components with Context.

4. Share shopping cart count from parent to header and footer.

5. Provide current language to header, footer, and content.

6. Share API base URL without passing through components.

7. Move form data from multi-step form parent to all steps.

8. Share online/offline status globally.

9. Provide current route/path to navigation components.

10. Share feature flags (beta features) across app.

### Bonus Practice: Combine with Previous Days

- Use Context with useReducer for complex state.
- Combine Context with custom hooks.
- Create a complete auth system with Context.
- Build a multilingual app using Context.

Mastering Context API eliminates prop drilling and prepares you for advanced state management! 🚀