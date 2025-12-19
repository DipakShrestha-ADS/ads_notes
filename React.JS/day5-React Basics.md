# 📘 React Basics

## 1. What is React? Overview and Benefits

React is a JavaScript library for building user interfaces.\
It allows you to create reusable UI components efficiently and update them dynamically based on data changes.

React was developed by Facebook and is widely used in modern web development.

✨ Key Benefits of React:

* Component-Based Architecture: Build encapsulated components that manage their own state.

* Virtual DOM: React updates the real DOM in an optimized way, leading to fast performance.

* Reusable Components: Write once, use multiple times across the app.

* Unidirectional Data Flow: Data flows in one direction, making debugging and maintenance easier.

* Rich Ecosystem: Tons of libraries, tools, and a strong community.

* SEO Friendly: Supports server-side rendering (with Next.js) improving SEO for web apps.

## 2. Setting up a React project

You can create a new React project easily using Create-React-App or Vite.

Option 1: Using create-react-app

```bash
npx create-react-app my-app
cd my-app
npm start
```

* npx create-react-app my-app: Creates a new React app named "my-app".

* cd my-app: Navigate into your app folder.

* npm start: Runs the app in development mode on localhost:3000.

Option 2: Using Vite (Faster, Modern Build Tool)

```bash
npm create vite@latest my-app
cd my-app
npm install
npm run dev
```

* npm create vite@latest my-app: Creates a new Vite-based React app.

* npm install: Installs the dependencies.

* npm run dev: Starts the local development server.

## 3. Components and JSX

➡️ What is a Component?

A Component is a reusable, independent piece of UI in React.\
There are two types:

* Functional Components (most common)

* Class Components (older style)

➡️ What is JSX?

JSX stands for JavaScript XML.\
It allows us to write HTML-like code inside JavaScript.

Example:

```js
function Welcome() {
  return <h1>Hello, World!</h1>;
}
```

## 4. Introduction to Props

Props (short for Properties) are used to pass data from a parent component to a child component.

Props are read-only, meaning a component cannot modify the props it receives.

Example:

```js
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

Here, name is a prop.

🛠 Hands-On Example

A. Create a functional component that displays a greeting message

➡️ Code Example with Comments:

```js
// Importing React (optional with newer versions if using JSX directly)
import React from 'react';
// Defining a functional component named Greeting
function Greeting() {
  // Returning JSX content
  return (
    <div>
      <h1>Hello, Welcome to React Learning!</h1>
    </div>
  );
}
// Exporting the component so it can be used elsewhere
export default Greeting;
```

B. Pass props to components to display user information

Let's create another example where we pass props to a component:

➡️ Code Example with Comments:

```js
import React from 'react';
// Defining a functional component that accepts props
function UserInfo(props) {
  return (
    <div>
      {/* Accessing props and displaying */}
      <h2>User Information</h2>
      <p>Name: {props.name}</p>
      <p>Age: {props.age}</p>
      <p>Email: {props.email}</p>
    </div>
  );
}
// Exporting the component
export default UserInfo;
```

➡️ How to use it inside App.js:

```js
import React from 'react';
import UserInfo from './UserInfo'; // Assuming the file is named UserInfo.js
function App() {
  return (
    <div>
      {/* Passing props to UserInfo component */}
      <UserInfo name="John Doe" age={28} email="john@example.com" />
    </div>
  );
}
export default App;
```