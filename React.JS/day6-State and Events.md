# Introduction to State with useState in React 🎯

🔹 What is State?

State in React is an object that holds data specific to a component and determines how it renders. Unlike props (which are read-only and passed from parent to child), state is mutable and can change over time, allowing components to be interactive.

🔹 Introducing useState Hook

React provides the useState hook to manage state in functional components.

✅ Syntax of useState

```js
const [state, setState] = useState(initialValue);
```

* state → The current state value.

* setState → A function to update the state.

* initialValue → The starting value of the state.

🔹 Example 1: Counter App

Let’s build a simple counter that increments on button click.

```jsx
import { useState } from "react";
function Counter() {
    const [count, setCount] = useState(0); // Initialize state
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

🔥 How It Works

* The count state starts at 0.

* Clicking the button updates the state using setCount(count + 1), triggering a re-render.

🔹 Example 2: Handling User Input

State can also store and update text input values.

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

🔥 How It Works

* text holds the value entered in the input field.

* onChange={(e) => setText(e.target.value)} updates text as the user types.

🔹 Example 3: Toggle Visibility

We can use useState to toggle between two states.

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
export default function App() {
    return <ToggleText />;
}
```

🔥 How It Works

* isVisible starts as true.

* Clicking the button toggles it (setIsVisible(!isVisible)), showing or hiding the text.

🔹 Example 4: Updating an Array in State

State can store arrays and update them dynamically.

```jsx
import { useState } from "react";
function TaskList() {
    const [tasks, setTasks] = useState(["Buy groceries", "Read a book"]);
    const [newTask, setNewTask] = useState("");
    const addTask = () => {
        if (newTask.trim()) {
            setTasks([...tasks, newTask]); // Add new task
            setNewTask(""); // Clear input
        }
    };
    return (
        <div>
            <input 
                type="text" 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)} 
                placeholder="Enter task"
            />
            <button onClick={addTask}>Add Task</button>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                ))}
            </ul>
        </div>
    );
}
export default function App() {
    return <TaskList />;
}
```

🔥 How It Works

* The tasks array stores multiple tasks.

* setTasks([...tasks, newTask]) updates the array while keeping old values.

* .map() is used to render the list dynamically.

🔹 Example 5: Updating an Object in State

State can also hold objects.

```jsx
import { useState } from "react";
function UserProfile() {
    const [user, setUser] = useState({ name: "John", age: 25 });
    const updateAge = () => {
        setUser({ ...user, age: user.age + 1 });
    };
    return (
        <div>
            <h2>{user.name}</h2>
            <p>Age: {user.age}</p>
            <button onClick={updateAge}>Increase Age</button>
        </div>
    );
}
export default function App() {
    return <UserProfile />;
}
```

🔥 How It Works

* The user object stores name and age.

* setUser({ ...user, age: user.age + 1 }) updates only age, keeping name unchanged.

🔹 Summary: Key Takeaways

✅ useState helps manage state in functional components.\
✅ State updates trigger re-renders.\
✅ Objects and arrays in state should be updated immutably (...spread).\
✅ useState makes React components interactive and dynamic.

# Event Handling in React 🚀

Event handling in React is similar to handling events in JavaScript, but with a few key differences. React uses synthetic events and follows a declarative approach to event handling.

1️⃣ Handling Events in React

React events are written in camelCase and use JSX functions instead of strings.

✅ Example: Handling Click Events

```jsx
import React from "react";
function ClickButton() {
    const handleClick = () => {
        alert("Button Clicked!");
    };
    return (
        <button onClick={handleClick}>Click Me</button>
    );
}
export default ClickButton;
```

🔹 Differences from HTML:

* In React, use onClick={handleClick} instead of onclick="handleClick()".

* You pass a function reference (not a string or function call).

2️⃣ Passing Arguments to Event Handlers

You may need to pass arguments to event handlers.

✅ Using Arrow Functions

```jsx
function GreetButton() {
    const greet = (name) => {
        alert(`Hello, ${name}!`);
    };
    return (
        <button onClick={() => greet("John")}>Greet</button>
    );
}
```

🔹 We wrap greet("John") inside an arrow function to prevent it from executing immediately.

3️⃣ Synthetic Events in React

React wraps native events in SyntheticEvent, which is cross-browser compatible.

✅ Example: Accessing Event Object

```jsx
function InputHandler() {
    const handleChange = (event) => {
        console.log("Input value:", event.target.value);
    };
    return <input type="text" onChange={handleChange} />;
}
```

🔹 event.target.value captures user input.

4️⃣ Handling Form Submissions

Forms require controlled handling to prevent default behavior.

✅ Example: Prevent Default Form Submission

```jsx
import React, { useState } from "react";
function FormExample() {
    const [inputValue, setInputValue] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent page reload
        alert(`Submitted: ${inputValue}`);
    };
    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
            />
            <button type="submit">Submit</button>
        </form>
    );
}
```

🔹 preventDefault() stops form from reloading the page.\
🔹 The input field uses state (useState) to track value.

5️⃣ Handling Events in Class Components (Before Hooks)

Before hooks, class components used this binding for event handlers.

✅ Example: Handling Events in a Class Component

```jsx
import React, { Component } from "react";
class ClickCounter extends Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
        this.handleClick = this.handleClick.bind(this); // Binding required
    }
    handleClick() {
        this.setState({ count: this.state.count + 1 });
    }
    render() {
        return (
            <button onClick={this.handleClick}>
                Clicked {this.state.count} times
            </button>
        );
    }
}
export default ClickCounter;
```

🔹 In class components, this.handleClick needs to be bound in the constructor.

6️⃣ Handling Keyboard Events

You can listen to keyboard events like onKeyDown, onKeyPress, and onKeyUp.

✅ Example: Detecting Enter Key Press

```jsx
function KeyPressHandler() {
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            alert("Enter key pressed!");
        }
    };
    return <input type="text" onKeyPress={handleKeyPress} />;
}
```

🔹 event.key === "Enter" checks if the Enter key was pressed.

7️⃣ Handling Multiple Events on a Single Element

You can combine multiple event handlers.

✅ Example: Handling Click & Mouse Over

```jsx
function MultiEventButton() {
    const handleClick = () => alert("Button clicked!");
    const handleMouseOver = () => console.log("Mouse hovered!");
    return (
        <button onClick={handleClick} onMouseOver={handleMouseOver}>
            Hover & Click Me
        </button>
    );
}
```

🔹 The button listens for both onClick and onMouseOver events.

8️⃣ Event Propagation: Stop Bubbling

In React, events bubble up the DOM. You can stop this using event.stopPropagation().

✅ Example: Prevent Event Bubbling

```jsx
function ParentChildEvents() {
    const handleParentClick = () => alert("Parent Clicked!");
    const handleChildClick = (event) => {
        event.stopPropagation(); // Prevents event from reaching parent
        alert("Child Clicked!");
    };
    return (
        <div onClick={handleParentClick} style={{ padding: "20px", border: "1px solid black" }}>
            <button onClick={handleChildClick}>Click Me</button>
        </div>
    );
}
```

🔹 Clicking the button only triggers handleChildClick, not handleParentClick.

9️⃣ Handling Events with Dynamic Elements

When working with lists of elements, use unique id to identify the clicked item.

✅ Example: Handling Clicks on a List

```jsx
function ItemList() {
    const items = ["Apple", "Banana", "Cherry"];
    const handleClick = (item) => {
        alert(`Clicked on: ${item}`);
    };
    return (
        <ul>
            {items.map((item) => (
                <li key={item} onClick={() => handleClick(item)}>
                    {item}
                </li>
            ))}
        </ul>
    );
}
```

🔹 map() generates dynamic list elements, and onClick passes unique values.

🔟 Conclusion: Best Practices

✅ Use arrow functions to avoid unnecessary bindings.\
✅ Prevent default actions when handling forms.\
✅ Use event.stopPropagation() to control event bubbling.\
✅ Pass event handlers as function references (avoid inline anonymous functions when possible for better performance).

# Conditional Rendering in React 🚀

Conditional rendering in React allows components to render different UI elements based on conditions. This is similar to using if-else or switch in JavaScript but applied to React components.

1️⃣ Using if Statements (JSX Outside return)

You can conditionally render components using a standard if statement.

✅ Example: Rendering a Message Based on Authentication Status

```jsx
function Greeting({ isLoggedIn }) {
    if (isLoggedIn) {
        return <h1>Welcome back, User!</h1>;
    } else {
        return <h1>Please log in</h1>;
    }
}
export default function App() {
    return <Greeting isLoggedIn={true} />;
}
```

🔹 If isLoggedIn is true, it displays "Welcome back, User!"\
🔹 Otherwise, it displays "Please log in"

2️⃣ Using Ternary Operator (condition ? true : false)

The ternary operator is useful for simple conditions inside JSX.

✅ Example: Display Different Buttons Based on Login Status

```jsx
function LoginButton({ isLoggedIn }) {
    return (
        <div>
            {isLoggedIn ? <button>Logout</button> : <button>Login</button>}
        </div>
    );
}
export default function App() {
    return <LoginButton isLoggedIn={false} />;
}
```

🔹 If isLoggedIn is true, the Logout button appears.\
🔹 Otherwise, it shows the Login button.

3️⃣ Using && Operator (Short-Circuit Evaluation)

The && operator is useful when you only render something if the condition is true.

✅ Example: Display Notification Badge Only If There Are Messages

```jsx
function Notification({ unreadMessages }) {
    return (
        <div>
            <h1>Inbox</h1>
            {unreadMessages.length > 0 && <p>You have {unreadMessages.length} new messages</p>}
        </div>
    );
}
export default function App() {
    return <Notification unreadMessages={["Hello", "Reminder"]} />;
}
```

🔹 If unreadMessages.length > 0, the message appears.\
🔹 If unreadMessages.length === 0, nothing is rendered.

4️⃣ Using || Operator (Default Fallback Values)

The || (logical OR) operator can be used to provide default UI when a value is falsy.

✅ Example: Show Default Name If No Username Exists

```jsx
function UserProfile({ username }) {
    return <h2>Welcome, {username || "Guest"}!</h2>;
}
export default function App() {
    return <UserProfile username="" />;
}
```

🔹 If username is empty, "Guest" is displayed as the default value.

5️⃣ Using switch-case for Multiple Conditions

If there are multiple conditions, a switch-case can be useful.

✅ Example: Display Different Messages Based on User Role

```jsx
function RoleMessage({ role }) {
    switch (role) {
        case "admin":
            return <h2>Welcome, Admin! You have full access.</h2>;
        case "editor":
            return <h2>Welcome, Editor! You can edit content.</h2>;
        case "viewer":
            return <h2>Welcome, Viewer! You can browse content.</h2>;
        default:
            return <h2>Welcome, Guest! Please log in.</h2>;
    }
}
export default function App() {
    return <RoleMessage role="editor" />;
}
```

🔹 Depending on the role, a different message is displayed.

6️⃣ Conditional Rendering with useState (Toggle UI Dynamically)

We can use React Hooks like useState to toggle elements dynamically.

✅ Example: Show/Hide Content Button

```jsx
import { useState } from "react";
function ToggleContent() {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div>
            <button onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? "Hide" : "Show"} Content
            </button>
            {isVisible && <p>This is some content!</p>}
        </div>
    );
}
export default function App() {
    return <ToggleContent />;
}
```

🔹 Clicking the button toggles visibility of the text.

7️⃣ Conditional Rendering with Components

You can create separate components and conditionally render them.

✅ Example: Show Different Components Based on Login Status

```jsx
function UserDashboard() {
    return <h2>Welcome to your dashboard!</h2>;
}
function GuestLandingPage() {
    return <h2>Please sign up to get started.</h2>;
}
function HomePage({ isLoggedIn }) {
    return isLoggedIn ? <UserDashboard /> : <GuestLandingPage />;
}
export default function App() {
    return <HomePage isLoggedIn={true} />;
}
```

🔹 Renders UserDashboard if logged in, otherwise renders GuestLandingPage.

8️⃣ Conditional Rendering with Lists (map + filter)

You can use .map() and .filter() to conditionally render elements from an array.

✅ Example: Show Only Active Users

```jsx
function ActiveUsers({ users }) {
    return (
        <ul>
            {users.filter(user => user.isActive).map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}
export default function App() {
    const users = [
        { id: 1, name: "Alice", isActive: true },
        { id: 2, name: "Bob", isActive: false },
        { id: 3, name: "Charlie", isActive: true }
    ];
    return <ActiveUsers users={users} />;
}
```

🔹 Only active users (isActive: true) are displayed.

🔟 Best Practices for Conditional Rendering

✅ Use ternary (? :) for simple conditions.\
✅ Use && for rendering when condition is true.\
✅ Use switch-case for multiple cases.\
✅ Use .map() & .filter() for dynamic lists.\
✅ Use components to separate logic and UI.