# React Hooks Introduction

## 1. What are React Hooks?

Hooks are special functions in React that let you "hook into" React features like state and lifecycle methods in functional components (instead of class components).

Why Hooks?

* Before Hooks, functional components couldn’t manage state or side effects.

* Hooks make code cleaner and easier to reuse.

## 2. useState Hook

Lets you add state to functional components.

Example: Counter App

```jsx
import React, { useState } from 'react';
function Counter() {
  // Declare a state variable 'count' with initial value 0
  // 'setCount' is the function to update it
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

Explanation:

1. useState(0) initializes count with 0.

2. setCount updates the state.

3. When the button is clicked, count increases by 1.

## 3. useEffect Hook

Lets you perform side effects (like API calls, timers) in functional components.

Example: Fetching Data from an API

```jsx
import React, { useState, useEffect } from 'react';
function UserData() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    // Fetch data when component mounts
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []); // Empty dependency array means it runs only once
  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

Explanation:

1. useEffect runs after the component renders.

2. fetch gets data from an API.

3. setUsers updates the state with fetched data.

4. [] means it runs only once (like componentDidMount).

## 4. Cleanup in useEffect

Some effects (like timers) need cleanup to avoid memory leaks.

Example: A Clock Component

```jsx
import React, { useState, useEffect } from 'react';
function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date()); // Update time every second
    }, 1000);
    // Cleanup: Clear the interval when component unmounts
    return () => clearInterval(timer);
  }, []);
  return <h2>Current Time: {time.toLocaleTimeString()}</h2>;
}
```

Explanation:

1. setInterval updates time every second.

2. The return function clears the timer when the component is removed (prevents memory leaks).

## 5. Other Important Hooks

| Hook         | Purpose                              |
|--------------|--------------------------------------|
| useContext   | Access React context (global state)   |
| useReducer   | Manage complex state logic           |
| useRef       | Store mutable values without re-rendering |
| useMemo      | Optimize performance by memoizing values |
| useCallback  | Memoize functions to prevent unnecessary re-renders |

### 1. useContext Hook

Purpose:

* Allows you to access React Context (global state) without prop drilling.

Example: Theme Switcher

Step 1: Create a Context

```jsx
import React, { createContext, useState, useContext } from 'react';
// Create a context
const ThemeContext = createContext();
function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

Step 2: Use the Context in Child Component

```jsx
function Toolbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333', padding: '20px' }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <p>Current Theme: {theme}</p>
    </div>
  );
}
```

Explanation:

1. createContext() creates a new context.

2. ThemeContext.Provider wraps components that need access to the theme.

3. useContext(ThemeContext) retrieves the theme and toggle function.

### 2. useReducer Hook

Purpose:

* Better for managing complex state logic (like Redux).

Example: Todo List with Actions

```jsx
import React, { useReducer } from 'react';
// Reducer function (handles state updates)
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), text: action.payload }];
    case 'DELETE':
      return state.filter((todo) => todo.id !== action.payload);
    default:
      return state;
  }
}
function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [input, setInput] = useState('');
  const addTodo = () => {
    if (input.trim()) {
      dispatch({ type: 'ADD', payload: input });
      setInput('');
    }
  };
  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => dispatch({ type: 'DELETE', payload: todo.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Explanation:

1. useReducer takes a reducer function and initial state.

2. dispatch({ type: 'ADD', payload: input }) triggers state updates.

3. The reducer decides how state changes based on the action.

### 3. useRef Hook

Purpose:

* Stores mutable values that don’t trigger re-renders.

* Used to access DOM elements directly.

Example: Focus an Input on Button Click

```jsx
import React, { useRef } from 'react';
function FocusInput() {
  const inputRef = useRef(null);
  const focusInput = () => {
    inputRef.current.focus(); // Directly access the input element
  };
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

Explanation:

1. useRef creates a reference (inputRef).

2. ref={inputRef} attaches it to the input element.

3. inputRef.current.focus() focuses the input when the button is clicked.

### 4. useMemo Hook

Purpose:

* Memoizes expensive calculations to optimize performance.

Example: Compute Fibonacci Number (Optimized)

```jsx
import React, { useState, useMemo } from 'react';
function Fibonacci() {
  const [num, setNum] = useState(1);
  // Expensive calculation (only re-runs when 'num' changes)
  const fib = useMemo(() => {
    function calculateFib(n) {
      if (n <= 1) return n;
      return calculateFib(n - 1) + calculateFib(n - 2);
    }
    return calculateFib(num);
  }, [num]);
  return (
    <div>
      <h3>Fibonacci of {num}: {fib}</h3>
      <button onClick={() => setNum(num + 1)}>Next Fibonacci</button>
    </div>
  );
}
```

Explanation:

1. useMemo caches the result of calculateFib(num).

2. Recalculates only when num changes (not on every render).

### 5. useCallback Hook

Purpose:

* Memoizes functions to prevent unnecessary re-renders in child components.

Example: Optimized Button Component

```jsx
import React, { useState, useCallback } from 'react';
function App() {
  const [count, setCount] = useState(0);
  // Memoized function (only recreated when 'count' changes)
  const increment = useCallback(() => {
    setCount(count + 1);
  }, [count]);
  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={increment} />
    </div>
  );
}
// React.memo prevents re-renders if props don't change
const Button = React.memo(({ onClick }) => {
  console.log('Button re-rendered');
  return <button onClick={onClick}>Increment</button>;
});
```

Explanation:

1. useCallback memoizes increment function.

2. React.memo prevents Button from re-rendering unnecessarily.

### Extra Hands-On Task: Shopping Cart with useReducer

Requirements:

* Add/remove items from a cart.

* Calculate the total price.

Solution:

```jsx
import React, { useReducer } from 'react';
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), name: action.payload.name, price: action.payload.price }];
    case 'REMOVE':
      return state.filter((item) => item.id !== action.payload);
    default:
      return state;
  }
}
function ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState(0);
  const addToCart = () => {
    dispatch({ type: 'ADD', payload: { name: product, price } });
    setProduct('');
    setPrice(0);
  };
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return (
    <div>
      <input
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder="Product name"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Price"
      />
      <button onClick={addToCart}>Add to Cart</button>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}
            <button onClick={() => dispatch({ type: 'REMOVE', payload: item.id })}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h3>Total: ${total}</h3>
    </div>
  );
}
```

Explanation:

1. useReducer manages cart state (add/remove items).

2. total is calculated using reduce().

3. dispatch({ type: 'ADD' }) adds a new item to the cart.

### Summary Table of Hooks

| Hook         | Purpose                              | Example Use Case             |
|--------------|--------------------------------------|------------------------------|
| useContext   | Access global state                  | Theme switching, user auth   |
| useReducer   | Manage complex state                 | Shopping cart, form handling |
| useRef       | Access DOM/store mutable values      | Focus input, animation       |
| useMemo      | Optimize expensive calculations      | Fibonacci, sorting           |
| useCallback  | Memoize functions                    | Preventing child re-renders  |

### Extra Hands-On Tasks (With Solutions)

Task 1: Build a Todo List

Requirements:

* Add a new task using useState.

* Display the list of tasks.

* Delete a task when clicked.

Solution:

```jsx
import React, { useState } from 'react';
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const addTodo = () => {
    if (task.trim()) {
      setTodos([...todos, task]);
      setTask('');
    }
  };
  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };
  return (
    <div>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => deleteTodo(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Explanation:

1. todos stores the list of tasks.

2. task stores the current input.

3. addTodo adds a new task to the list.

4. deleteTodo removes a task by filtering it out.

Task 2: Fetch and Filter Users

Requirements:

* Fetch users from https://jsonplaceholder.typicode.com/users.

* Add a search input to filter users by name.

Solution:

```jsx
import React, { useState, useEffect } from 'react';
function UserSearch() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

Explanation:

1. users stores fetched data.

2. searchTerm stores the search input.

3. filteredUsers filters users based on search input.

### Summary

* useState → Manages state in functional components.

* useEffect → Handles side effects (API calls, timers).

* Cleanup → Prevents memory leaks (e.g., clearInterval).

* Other Hooks → useContext, useReducer, etc., for advanced cases.

# Custom Hooks in React - Complete Guide

A custom hook is a JavaScript function that starts with use and can call other hooks. It allows you to reuse stateful logic across multiple components.

Why Use Custom Hooks?

* Avoid code duplication (DRY principle).

* Share logic between components easily.

* Keep components clean and focused.

Rules for Custom Hooks

1. Name must start with use (e.g., useFetch, useLocalStorage).

2. Can call other hooks (useState, useEffect, etc.).

3. Should be used at the top level (not inside loops/conditions).

### Example 1: useFetch - Custom Hook for API Calls

1. Create the Hook (useFetch.js)

```jsx
import { useState, useEffect } from 'react';
function useFetch(url) {
  // State to store fetched data
  const [data, setData] = useState(null);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to store errors
  const [error, setError] = useState(null);
  useEffect(() => {
    // Reset states when URL changes
    setLoading(true);
    setError(null);
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]); // Re-run effect when URL changes
  return { data, loading, error }; // Return states for component to use
}
export default useFetch;
```

2. Use the Hook in a Component

```jsx
import React from 'react';
import useFetch from './useFetch';
function UserList() {
  // Use the custom hook to fetch users
  const { data: users, loading, error } = useFetch(
    'https://jsonplaceholder.typicode.com/users'
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

| Line                                      | Explanation                                      |
|-------------------------------------------|--------------------------------------------------|
| const [data, setData] = useState(null);   | Stores fetched data (initially null).            |
| const [loading, setLoading] = useState(true); | Tracks if data is loading (starts as true).      |
| const [error, setError] = useState(null); | Stores error messages (initially null).          |
| useEffect(() => { ... }, [url]);          | Fetches data when url changes.                   |
| setLoading(true); setError(null);         | Resets states before new fetch.                  |
| fetch(url).then(...).catch(...);          | Fetches data, handles success/error.             |
| return { data, loading, error };          | Returns states for components to use.            |

### Example 2: useLocalStorage - Custom Hook for Persistent State

1. Create the Hook (useLocalStorage.js)

```jsx
import { useState, useEffect } from 'react';
function useLocalStorage(key, initialValue) {
  // Get stored value or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  // Update localStorage when state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);
  return [storedValue, setStoredValue];
}
export default useLocalStorage;
```

2. Use the Hook in a Component

```jsx
import React from 'react';
import useLocalStorage from './useLocalStorage';
function ThemeSwitcher() {
  // Use the custom hook to persist theme
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333', padding: '20px' }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <p>Current Theme: {theme}</p>
    </div>
  );
}
```

| Line                                                  | Explanation                                      |
|-------------------------------------------------------|--------------------------------------------------|
| const [storedValue, setStoredValue] = useState(() => { ... }); | Initializes state from localStorage or initialValue. |
| window.localStorage.getItem(key)                       | Retrieves stored value.                           |
| JSON.parse(item)                                      | Converts string back to object.                  |
| useEffect(() => { ... }, [key, storedValue]);         | Saves changes to localStorage.                   |
| window.localStorage.setItem(key, JSON.stringify(storedValue)) | Stores state as a string.                        |
| return [storedValue, setStoredValue];                 | Returns state and updater (like useState).       |

### Extra Hands-On Task: useTimer Custom Hook

Requirements:

* Create a useTimer hook that:

  * Starts a timer.

  * Pauses/resumes the timer.

  * Resets the timer.

* Use it in a component to display seconds.

Solution:

1. Create useTimer.js

```jsx
import { useState, useEffect, useRef } from 'react';
function useTimer(initialState = 0) {
  const [timer, setTimer] = useState(initialState);
  const [isActive, setIsActive] = useState(false);
  const countRef = useRef(null);
  const start = () => {
    setIsActive(true);
    countRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  };
  const pause = () => {
    clearInterval(countRef.current);
    setIsActive(false);
  };
  const reset = () => {
    clearInterval(countRef.current);
    setIsActive(false);
    setTimer(0);
  };
  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(countRef.current);
  }, []);
  return { timer, isActive, start, pause, reset };
}
export default useTimer;
```

2. Use the Hook in a Component

```jsx
import React from 'react';
import useTimer from './useTimer';
function TimerComponent() {
  const { timer, isActive, start, pause, reset } = useTimer();
  return (
    <div>
      <h2>Timer: {timer}s</h2>
      <button onClick={isActive ? pause : start}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

Explanation:

1. useRef stores the interval ID (for cleanup).

2. start() begins the timer, pause() stops it, reset() clears it.

3. useEffect cleans up the interval when the component unmounts.

### When to Use Custom Hooks?

| Scenario                  | Example Custom Hook   |
|---------------------------|-----------------------|
| Fetching data             | useFetch              |
| Managing form state       | useForm               |
| Tracking scroll position  | useScrollPosition     |
| Handling keyboard events  | useKeyPress           |

Key Takeaway:\
Custom hooks make your code reusable, cleaner, and easier to test. Start creating them whenever you see repeated logic! 🚀