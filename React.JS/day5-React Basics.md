---

# 📘 React Chapter 5 Notes

### **React Basics, Setup, Components, JSX & Props**

---

## **1. What is React? Overview and Benefits**

React is a **JavaScript library** used for building **user interfaces**, especially dynamic and interactive web apps.
It was created by **Facebook** and is now one of the most popular tools in modern frontend development.

### ✅ **Key Benefits of React**

* **Component-Based Architecture**
  Build independent, reusable components that manage their own state.

* **Virtual DOM**
  Updates the UI efficiently for better performance.

* **Reusable Components**
  Helps reduce repeated code across the application.

* **Unidirectional Data Flow**
  Predictable and easier to debug.

* **Rich Ecosystem**
  Huge community, libraries, tools, and extensions.

* **SEO Friendly**
  Supports server-side rendering (via Next.js).

---

## **2. Setting Up a React Project**

You can create a React project using **Create React App** or **Vite**.

---

### **Option 1: Using Create React App (CRA)**

```bash
npx create-react-app my-app
cd my-app
npm start
```

**Explanation:**

* `npx create-react-app my-app` → Creates the project
* `cd my-app` → Open the project folder
* `npm start` → Runs the app on **localhost:3000**

---

### **Option 2: Using Vite (Recommended for Speed)**

```bash
npm create vite@latest my-app
cd my-app
npm install
npm run dev
```

**Explanation:**

* Creates a Vite + React project
* Installs required packages
* Starts a fast dev server

---

## **3. Components and JSX**

### **➡️ What is a Component?**

A component is a **reusable UI block**.
React has two types:

* **Functional Components** (modern & preferred)
* **Class Components** (older style)

---

### **➡️ What is JSX?**

JSX stands for **JavaScript XML** — lets you write **HTML-like code inside JavaScript**.

**Example:**

```jsx
function Welcome() {
  return <h1>Hello, World!</h1>;
}
```

---

## **4. Introduction to Props**

**Props** (short for *properties*) allow components to receive data from their parent.

* Props are **read-only**
* Used to display dynamic values

**Example:**

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

Here, **name** is a prop.

---

# 🛠 Hands-On Examples

## **A. Create a Functional Component (Greeting Component)**

```jsx
import React from 'react';

function Greeting() {
  return (
    <div>
      <h1>Hello, Welcome to React Learning!</h1>
    </div>
  );
}

export default Greeting;
```

---

## **B. Passing Props to a Component (User Information Component)**

### **UserInfo Component**

```jsx
import React from 'react';

function UserInfo(props) {
  return (
    <div>
      <h2>User Information</h2>
      <p>Name: {props.name}</p>
      <p>Age: {props.age}</p>
      <p>Email: {props.email}</p>
    </div>
  );
}

export default UserInfo;
```

---

### **Using it inside App.js**

```jsx
import React from 'react';
import UserInfo from './UserInfo';

function App() {
  return (
    <div>
      <UserInfo 
        name="John Doe" 
        age={28} 
        email="john@example.com" 
      />
    </div>
  );
}

export default App;
```

---