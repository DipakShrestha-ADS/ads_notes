# JSX SYNTAX

JSX (JavaScript XML) is a syntax extension for JavaScript used in React to describe what the UI should look like. It allows you to write HTML-like code within JavaScript, which is then transpiled into regular JavaScript calls using tools like Babel.

Here’s a complete breakdown of JSX in React:

## 🧠 What is JSX?

JSX lets you write HTML-like tags directly in JavaScript to define React elements.

Example:

```jsx
const element = <h1>Hello, world!</h1>;
```

Under the hood, this gets compiled to:

```js
const element = React.createElement('h1', null, 'Hello, world!');
```

## 🔧 JSX Syntax Rules

1. Must return a single root element

   Only one top-level element can be returned.

   ❌ Invalid:

   ```jsx
   return (
     <h1>Title</h1>
     <p>Description</p>
   );
   ```

   ✅ Valid:

   ```jsx
   return (
     <div>
       <h1>Title</h1>
       <p>Description</p>
     </div>
   );
   ```

   Or use React.Fragment:

   ```jsx
   return (
     <>
       <h1>Title</h1>
       <p>Description</p>
     </>
   );
   ```

2. Class becomes className

   In JSX, use className instead of class (to avoid conflict with JavaScript class keyword).

   ```jsx
   <div className="container">Hello</div>
   ```

3. CamelCase for attributes

   JSX attributes use camelCase:

   ```jsx
   <input type="text" onChange={handleChange} />
   ```

4. JavaScript Expressions with {}

   Use curly braces to embed JavaScript expressions.

   ```jsx
   const name = "Alice";
   const element = <h1>Hello, {name}</h1>;
   ```

   You can use:

   * Variables

   * Functions

   * Ternary operators

   * Expressions (not statements)

5. Conditionals in JSX

   Using ternary:

   ```jsx
   {isLoggedIn ? <LogoutButton /> : <LoginButton />}
   ```

   Using logical &&:

   ```jsx
   {messages.length > 0 && <Notification />}
   ```

6. Lists and keys

   To render lists, use .map() and include a unique key prop:

   ```jsx
   const items = ['a', 'b', 'c'];
   return (
     <ul>
       {items.map((item, index) => (
         <li key={index}>{item}</li>
       ))}
     </ul>
   );
   ```

7. Self-closing tags

   Tags with no children must be self-closed.

   ```jsx
   <input type="text" />
   <br />
   ```

8. JSX prevents injection attacks

   JSX escapes values before rendering them, so it’s safe from injection by default.

   ```jsx
   const userInput = "<script>alert('hack')</script>";
   const element = <div>{userInput}</div>;  // Safe
   ```

9. Component Usage

   Uppercase names are treated as custom components.

   ```jsx
   function Welcome(props) {
     return <h1>Hello, {props.name}</h1>;
   }
   const element = <Welcome name="Alice" />;
   ```

10. Comments in JSX

    Use {/* comment */} inside JSX.

    ```jsx
    return (
      <div>
        {/* This is a comment */}
        <p>Hello</p>
      </div>
    );
    ```

## 🛠 How JSX Works

JSX is not valid JavaScript by default. Tools like Babel transpile it to standard React.createElement() calls.

## ✅ JSX Best Practices

* Use fragments instead of unnecessary <div>s.

* Use keys when rendering lists.

* Avoid inline functions in render (for performance).

* Break down UI into small reusable components.