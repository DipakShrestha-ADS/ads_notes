---

# 📘 React Chapter 6 Notes

## State, Event Handling & Conditional Rendering

---

# 1. Introduction to State with **useState** 🎯

### 🔹 What is State?

State is a special React variable that stores dynamic data inside a component.
Unlike **props** (which are read-only), state **can change over time**, causing the component to re-render.

### 🔹 Introducing `useState` Hook

`useState` allows functional components to manage state.

**✅ Syntax**

```js
const [state, setState] = useState(initialValue);
```

* **state** → current value
* **setState** → function to update the value
* **initialValue** → default starting value

---

## 🔹 Example 1: Counter App

```jsx
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

export default function App() {
    return <Counter />;
}
```

**🔥 How It Works**

* `count` starts at **0**
* Clicking the button updates state → re-renders UI

---

## 🔹 Example 2: Handling User Input

```jsx
import { useState } from "react";

function InputField() {
    const [text, setText] = useState("");

    return (
        <div>
            <input 
                type="text" 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something..."
            />
            <p>You typed: {text}</p>
        </div>
    );
}

export default function App() {
    return <InputField />;
}
```

---

## 🔹 Example 3: Toggle Visibility

```jsx
import { useState } from "react";

function ToggleText() {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <div>
            {isVisible && <p>Hello, I am visible! 👀</p>}
            <button onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? "Hide" : "Show"}
            </button>
        </div>
    );
}
```

---

## 🔹 Example 4: Updating an Array in State

```jsx
const addTask = () => {
    if (newTask.trim()) {
        setTasks([...tasks, newTask]); 
        setNewTask("");
    }
};
```

* Spread operator keeps old values while adding new ones.

---

## 🔹 Example 5: Updating an Object in State

```jsx
setUser({ ...user, age: user.age + 1 });
```

* Spread operator copies the object
* Only `age` is updated

---

## 🔹 Summary: Key Takeaways

✔ useState helps manage dynamic data
✔ State updates re-render the UI
✔ Always update arrays & objects **immutably** (using spread operator)
✔ React components become interactive through state

---

# 2. Event Handling in React 🚀

### React Event Rules

* Events use **camelCase** → `onClick`, `onChange`
* Event handlers use **functions**, not strings

---

## 1️⃣ Handling Events (Click Example)

```jsx
function ClickButton() {
    const handleClick = () => {
        alert("Button Clicked!");
    };

    return <button onClick={handleClick}>Click Me</button>;
}
```

---

## 2️⃣ Passing Arguments to Event Handlers

```jsx
<button onClick={() => greet("John")}>Greet</button>
```

---

## 3️⃣ Synthetic Events

React wraps events in **SyntheticEvent** (cross-browser compatible).

```jsx
const handleChange = (event) => {
    console.log(event.target.value);
};
```

---

## 4️⃣ Handling Forms (preventDefault)

```jsx
const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Submitted: ${inputValue}`);
};
```

---

## 5️⃣ Event Handling in Class Components (Old Way)

```jsx
this.handleClick = this.handleClick.bind(this);
```

Hooks removed the need for binding.

---

## 6️⃣ Handling Keyboard Events

```jsx
if (event.key === "Enter") {
    alert("Enter key pressed!");
}
```

---

## 7️⃣ Handling Multiple Events

```jsx
<button onClick={handleClick} onMouseOver={handleMouseOver}>
```

---

## 8️⃣ Stop Event Bubbling

```jsx
event.stopPropagation();
```

---

## 9️⃣ Handling Events in List Items

```jsx
<li onClick={() => handleClick(item)}>{item}</li>
```

---

## 🔟 Event Handling Best Practices

✔ Use arrow functions
✔ Use event.preventDefault() for forms
✔ Use stopPropagation() carefully
✔ Prefer function references instead of inline functions

---

# 3. Conditional Rendering in React 🚀

---

## 1️⃣ Using if-else

```jsx
if (isLoggedIn) return <h1>Welcome back!</h1>;
return <h1>Please log in</h1>;
```

---

## 2️⃣ Using Ternary Operator

```jsx
{isLoggedIn ? <button>Logout</button> : <button>Login</button>}
```

---

## 3️⃣ Using && (Short-Circuit)

```jsx
{unreadMessages.length > 0 && <p>You have messages</p>}
```

---

## 4️⃣ Using || (Default Fallback)

```jsx
<h2>Welcome, {username || "Guest"}!</h2>
```

---

## 5️⃣ Using switch-case

```jsx
switch(role) {
  case "admin": return <h2>Admin Panel</h2>;
}
```

---

## 6️⃣ Conditional Rendering with useState

```jsx
{isVisible && <p>This is some content!</p>}
```

---

## 7️⃣ Rendering Different Components

```jsx
return isLoggedIn ? <Dashboard /> : <Landing />;
```

---

## 8️⃣ Conditional Rendering with Lists

```jsx
users.filter(user => user.isActive)
     .map(user => <li key={user.id}>{user.name}</li>);
```

---

## 🔟 Best Practices

✔ Use ternary for simple UI
✔ Use && for true-only rendering
✔ Use switch for multiple cases
✔ Keep logic clean by splitting into components

---