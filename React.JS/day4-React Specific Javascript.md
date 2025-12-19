# Day 4: React-Specific JavaScript

This day focuses on JavaScript features and patterns most commonly used in React development. These concepts bridge plain JavaScript and React-specific syntax/practices.

## 1. Understanding JSX

**JSX (JavaScript XML)** is a syntax extension that allows you to write HTML-like code inside JavaScript. It is not valid JavaScript by itself — tools like Babel transpile it into `React.createElement` calls.

### Key Rules of JSX

- Must return a **single root element**.
- Use `className` instead of `class`.
- Use camelCase for attributes (e.g., `onClick`, `tabIndex`).
- Embed JavaScript expressions with `{}`.
- Self-closing tags for void elements (e.g., `<img />`, `<br />`).

### Example: Basic JSX with Comments

```jsx
// Import React (not needed in newer React 17+ with automatic JSX transform)
import React from 'react';

// Functional component returning JSX
function WelcomeMessage() {
  const name = "Dipak";               // JavaScript variable
  const isLoggedIn = true;            // Boolean for conditional rendering

  return (
    <div className="container">       {/* className instead of class */}
      <h1>Welcome to React!</h1>      {/* Standard HTML-like tag */}
      <p>Hello, {name}!</p>           {/* JavaScript expression inside {} */}
      
      {isLoggedIn ? (                 {/* Ternary inside JSX */}
        <span>You are logged in ✅</span>
      ) : (
        <span>Please log in</span>
      )}
      
      <img src="logo.png" alt="React Logo" />  {/* Self-closing tag */}
      <br />                                      {/* Self-closing void element */}
    </div>
  );
}

export default WelcomeMessage;
```

### Under the Hood (What Babel Transpiles To)

```js
React.createElement("div", { className: "container" },
  React.createElement("h1", null, "Welcome to React!"),
  React.createElement("p", null, "Hello, ", name, "!"),
  // ... more createElement calls
);
```

## 2. Event Handling in React (onClick, onChange)

React uses **camelCase** event names and passes a function reference (not a call).

### Example: onClick and onChange with Line Comments

```jsx
import React, { useState } from 'react';

function EventDemo() {
  const [count, setCount] = useState(0);        // State for counter
  const [inputValue, setInputValue] = useState(""); // State for input

  // Event handler for button click
  const handleClick = () => {
    setCount(count + 1);                        // Update state → triggers re-render
    alert("Button clicked!");                   // Side effect
  };

  // Event handler for input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);          // Update state with input value
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={handleClick}>           {/* Pass function reference */}
        Increment Count
      </button>

      <br /><br />

      <input
        type="text"
        value={inputValue}                      // Controlled input
        onChange={handleInputChange}            // Listen to changes
        placeholder="Type something..."
      />
      <p>You typed: {inputValue}</p>
    </div>
  );
}

export default EventDemo;
```

**Key Points:**
- Use `onClick={() => ...}` only when passing arguments.
- Never call the function directly: `onClick={handleClick()}` → wrong (runs immediately).

## 3. Spread Operator in Props

The spread operator (`...`) is useful for passing all properties of an object as props.

### Example: Spreading Props with Comments

```jsx
function UserCard(props) {
  return (
    <div className="card">
      <h3>{props.name}</h3>
      <p>Age: {props.age}</p>
      <p>Email: {props.email}</p>
    </div>
  );
}

// Parent component
function App() {
  const userData = {
    name: "Dipak Shrestha",
    age: 26,
    email: "dipak@example.com",
    country: "Nepal"  // Extra prop (not used in UserCard)
  };

  return (
    <div>
      {/* Spread all properties as individual props */}
      <UserCard {...userData} />  
      {/* Equivalent to: 
          <UserCard 
            name={userData.name} 
            age={userData.age} 
            email={userData.email} 
            country={userData.country} 
          /> 
      */}
    </div>
  );
}

export default App;
```

**Benefits:**
- Cleaner code when passing many props.
- Easy to override: `<UserCard {...userData} age={30} />`

## 4. Destructuring Props and State

Destructuring makes code cleaner by extracting values directly from objects.

### Example: Destructuring Props and State

```jsx
import React, { useState } from 'react';

function Profile({ name, age, email }) {  // Destructure props directly in parameters
  const [likes, setLikes] = useState(0); // State

  const incrementLikes = () => {
    setLikes(likes + 1);                 // Use destructured state
  };

  return (
    <div>
      <h2>{name}</h2>                      {/* Use destructured props */}
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      <p>Likes: {likes}</p>
      <button onClick={incrementLikes}>Like ❤️</button>
    </div>
  );
}

// Usage
function App() {
  return (
    <Profile 
      name="Dipak" 
      age={26} 
      email="dipak@example.com" 
    />
  );
}

export default App;
```

**Alternative: Destructure inside function body**

```jsx
function Profile(props) {
  const { name, age, email } = props;    // Destructure from props object
  // ... rest of code
}
```

## Hands-On Solutions

### Task 1: Write JSX for a component that displays a user’s profile using props

```jsx
import React from 'react';

// Component that receives props and displays user profile
function UserProfile(props) {
  return (
    <div className="profile-card" style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
      <h2>User Profile</h2>
      <img 
        src={props.avatar} 
        alt="User avatar" 
        style={{ width: "100px", borderRadius: "50%" }} 
      />
      <h3>{props.name}</h3>                          {/* Display name from props */}
      <p><strong>Age:</strong> {props.age}</p>       {/* Display age */}
      <p><strong>Email:</strong> {props.email}</p>   {/* Display email */}
      <p><strong>Bio:</strong> {props.bio}</p>       {/* Display bio */}
      <p><strong>Location:</strong> {props.location}</p>
    </div>
  );
}

// Parent component using UserProfile
function App() {
  return (
    <UserProfile
      name="Dipak Shrestha"
      age={26}
      email="dipak@example.com"
      bio="React enthusiast and teacher"
      location="Nepal"
      avatar="https://via.placeholder.com/150"     {/* Placeholder image */}
    />
  );
}

export default App;
```

### Task 2: Create a simple event handler for a button

```jsx
import React, { useState } from 'react';

function ButtonHandler() {
  const [message, setMessage] = useState("No button clicked yet"); // Initial state

  // Event handler function
  const handleButtonClick = () => {
    setMessage("Button was clicked! 🎉");    // Update state on click
  };

  const handleReset = () => {
    setMessage("No button clicked yet");     // Reset message
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Event Handling Demo</h2>
      <p>{message}</p>                         {/* Display current message */}
      
      <button 
        onClick={handleButtonClick}            {/* Attach handler */}
        style={{ padding: "10px 20px", fontSize: "16px", margin: "10px" }}
      >
        Click Me!
      </button>
      
      <button 
        onClick={handleReset}                  {/* Another handler */}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Reset
      </button>
    </div>
  );
}

export default ButtonHandler;
```

## 10 Practice Tasks for Each Topic

### 1. Understanding JSX – 10 Tasks

1. Write JSX for a `<header>` with a logo image and navigation links.

2. Create a JSX list of 5 fruits using `<ul>` and `<li>`.

3. Write JSX with a conditional message using ternary operator.

4. Embed a JavaScript array length in JSX: "You have {items.length} items".

5. Create JSX with inline styles using an object.

6. Write JSX for a self-closing `<input />` with placeholder and type.

7. Use fragments (`<>...</>`) to return multiple elements without a wrapper.

8. Write JSX comments inside the return statement.

9. Create a JSX table with 3 rows and 2 columns.

10. Write JSX that displays current date using `{new Date().toLocaleDateString()}`.

### 2. Event Handling in React – 10 Tasks

1. Create a button that shows an alert when clicked.

2. Make a counter with increment and decrement buttons.

3. Build an input that updates a `<p>` tag with typed text in real-time.

4. Create a toggle button that shows/hides a message.

5. Make a button that changes background color on click.

6. Handle form submission and prevent page reload.

7. Create multiple buttons that set different messages.

8. Build a like button with a counter.

9. Handle mouse over/out events to change text.

10. Create a button that logs event object details to console.

### 3. Spread Operator in Props – 10 Tasks

1. Create an object `config` and spread it as props to a component.

2. Spread props and override one property (e.g., change color).

3. Pass default props and override some using spread.

4. Spread an array of styles into an inline style object.

5. Use spread to pass event handlers from parent to child.

6. Create a component that accepts any HTML attributes via spread.

7. Spread state object as props to a child component.

8. Merge two objects and spread the result as props.

9. Use spread to clone props and add a new one.

10. Spread props in a wrapper component (forwarding props).

### 4. Destructuring Props and State – 10 Tasks

1. Destructure `name` and `age` from props in function parameters.

2. Destructure nested props: `{ user: { name, email } }`.

3. Destructure state array: `const [count, setCount] = useState(0)`.

4. Destructure props inside the function body from `props`.

5. Destructure only needed props and use rest (`...rest`).

6. Destructure props and provide default values.

7. Destructure event object in handler: `({ target: { value } })`.

8. Destructure multiple state variables from useState.

9. Destructure array returned from a custom hook.

10. Destructure props in a child component and pass to grandchild.

Practice these tasks to master React-specific JavaScript patterns! 🚀