---

# 📘 React Hooks Introduction

Hooks are **special functions in React** that let you “hook into” React features like state and lifecycle methods **inside functional components**.

---

## 1️⃣ What Are React Hooks?

* Before Hooks, only **class components** could manage state or lifecycle events.
* Hooks allow **functional components** to have state, perform side effects, and reuse logic.
* Benefits:

  * Cleaner, more readable code
  * Easy to reuse logic across components
  * No need for classes for stateful logic

---

## 2️⃣ useState Hook

**Purpose:** Add state to functional components.

### Example: Counter App

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // initialize count

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

**Explanation:**

* `useState(0)` → initializes `count` with `0`
* `setCount` → updates the state
* UI updates automatically when `count` changes

---

## 3️⃣ useEffect Hook

**Purpose:** Perform **side effects** like API calls, timers, or subscriptions.

### Example: Fetching Users

```jsx
import React, { useState, useEffect } from 'react';

function UserData() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []); // runs only once

  return (
    <ul>
      {users.map((user) => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

**Explanation:**

* Runs **after rendering**
* `[]` → run only on mount (like `componentDidMount`)
* `setUsers` updates state with fetched data

---

### Cleanup in useEffect

Some effects (like timers) need cleanup to prevent memory leaks.

```jsx
function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // cleanup
  }, []);

  return <h2>{time.toLocaleTimeString()}</h2>;
}
```

---

## 4️⃣ Other Important Hooks

| Hook          | Purpose                                 |
| ------------- | --------------------------------------- |
| `useContext`  | Access global state                     |
| `useReducer`  | Manage complex state                    |
| `useRef`      | Store mutable values or access DOM      |
| `useMemo`     | Memoize expensive calculations          |
| `useCallback` | Memoize functions to prevent re-renders |

---

### a) useContext Hook

**Purpose:** Access context (global state) without prop drilling.

```jsx
import { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

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

---

### b) useReducer Hook

**Purpose:** Manage **complex state logic**.

```jsx
import React, { useReducer, useState } from 'react';

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD': return [...state, { id: Date.now(), text: action.payload }];
    case 'DELETE': return state.filter(todo => todo.id !== action.payload);
    default: return state;
  }
}

function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [input, setInput] = useState('');

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => { dispatch({ type: 'ADD', payload: input }); setInput(''); }}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => dispatch({ type: 'DELETE', payload: todo.id })}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### c) useRef Hook

**Purpose:** Store mutable values **without re-rendering**, or access DOM.

```jsx
function FocusInput() {
  const inputRef = useRef(null);
  return (
    <div>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </div>
  );
}
```

---

### d) useMemo Hook

**Purpose:** Optimize expensive calculations.

```jsx
import { useMemo } from 'react';

function Fibonacci({ num }) {
  const fib = useMemo(() => {
    function calc(n) { if(n<=1) return n; return calc(n-1)+calc(n-2); }
    return calc(num);
  }, [num]);

  return <h3>Fibonacci: {fib}</h3>;
}
```

---

### e) useCallback Hook

**Purpose:** Memoize functions to prevent unnecessary re-renders.

```jsx
const increment = useCallback(() => setCount(count+1), [count]);
```

Used with `React.memo` for child components.

---

## 5️⃣ Custom Hooks

**Custom Hook:** A JS function starting with `use` that can call other hooks.

**Why:**

* Reuse logic
* Keep components clean
* Avoid code duplication

---

### Example: `useFetch`

```jsx
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true); setError(null);
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

Use in a component:

```jsx
function UserList() {
  const { data: users, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');
  if(loading) return <p>Loading...</p>;
  if(error) return <p>{error}</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

---

### Example: `useLocalStorage`

```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; }
    catch { return initialValue; }
  });

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(storedValue)); }
    catch {}
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
```

---

### Example: `useTimer`

```jsx
function useTimer(initial=0) {
  const [timer, setTimer] = useState(initial);
  const [isActive, setIsActive] = useState(false);
  const countRef = useRef(null);

  const start = () => { setIsActive(true); countRef.current = setInterval(() => setTimer(t=>t+1), 1000); };
  const pause = () => { clearInterval(countRef.current); setIsActive(false); };
  const reset = () => { clearInterval(countRef.current); setIsActive(false); setTimer(0); };

  useEffect(() => () => clearInterval(countRef.current), []);

  return { timer, isActive, start, pause, reset };
}
```

Use in a component:

```jsx
function TimerComponent() {
  const { timer, isActive, start, pause, reset } = useTimer();
  return (
    <div>
      <h2>{timer}s</h2>
      <button onClick={isActive ? pause : start}>{isActive ? 'Pause':'Start'}</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

---

## ✅ Summary Table: Hooks

| Hook        | Purpose               | Example Use              |
| ----------- | --------------------- | ------------------------ |
| useState    | Manage state          | Counter, inputs          |
| useEffect   | Side effects          | API calls, timers        |
| useContext  | Global state          | Theme switcher           |
| useReducer  | Complex state         | Todo, cart               |
| useRef      | DOM / mutable         | Focus input, timers      |
| useMemo     | Optimize calculations | Fibonacci                |
| useCallback | Memoize functions     | Prevent child re-renders |

---

**Key Takeaway:**
Hooks (built-in or custom) make React **functional components powerful, reusable, and clean**.
Whenever logic repeats, consider creating a **custom hook**! 🚀

---