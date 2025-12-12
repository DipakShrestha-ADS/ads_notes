---

# 📘 JSX (JavaScript XML) in React

JSX is a **syntax extension for JavaScript** used in React to describe what the UI should look like. It lets you write **HTML-like code inside JavaScript**, which is then transpiled into regular JavaScript using tools like Babel.

---

## 🧠 What is JSX?

* JSX allows you to **write HTML tags directly in JavaScript** to define React elements.
* Example:

```jsx
const element = <h1>Hello, world!</h1>;
```

* Under the hood, JSX is compiled to:

```js
const element = React.createElement('h1', null, 'Hello, world!');
```

---

## 🔧 JSX Syntax Rules

### 1️⃣ Must Return a Single Root Element

* JSX must have **one top-level element**.

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

Or use a **fragment**:

```jsx
return (
  <>
    <h1>Title</h1>
    <p>Description</p>
  </>
);
```

---

### 2️⃣ `className` Instead of `class`

* Use `className` to avoid conflict with JavaScript `class`.

```jsx
<div className="container">Hello</div>
```

---

### 3️⃣ CamelCase for Attributes

* JSX attributes use **camelCase**:

```jsx
<input type="text" onChange={handleChange} />
```

---

### 4️⃣ JavaScript Expressions with `{}`

* Embed JS expressions inside JSX using **curly braces**:

```jsx
const name = "Alice";
const element = <h1>Hello, {name}</h1>;
```

You can use:

* Variables
* Functions
* Ternary operators
* Expressions (not statements)

---

### 5️⃣ Conditionals in JSX

* **Ternary operator**:

```jsx
{isLoggedIn ? <LogoutButton /> : <LoginButton />}
```

* **Logical AND (`&&`)**:

```jsx
{messages.length > 0 && <Notification />}
```

---

### 6️⃣ Lists and Keys

* Render lists using `.map()` with a **unique `key` prop**:

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

---

### 7️⃣ Self-Closing Tags

* Tags with no children must **self-close**:

```jsx
<input type="text" />
<br />
```

---

### 8️⃣ JSX Prevents Injection Attacks

* JSX **escapes values automatically**, preventing injection:

```jsx
const userInput = "<script>alert('hack')</script>";
const element = <div>{userInput}</div>; // Safe
```

---

### 9️⃣ Component Usage

* Custom components must start with an **uppercase letter**:

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Alice" />;
```

---

### 🔟 Comments in JSX

* Use `{/* comment */}` inside JSX:

```jsx
return (
  <div>
    {/* This is a comment */}
    <p>Hello</p>
  </div>
);
```

---

## 🛠 How JSX Works

* JSX is **not valid JavaScript by default**.
* Babel transpiles JSX into `React.createElement()` calls so browsers can understand it.

---

## ✅ JSX Best Practices

1. Use **fragments (`<>`)** instead of unnecessary `<div>` wrappers.
2. Always use **keys** when rendering lists.
3. Avoid **inline functions in render** for performance.
4. Break UI into **small, reusable components**.

---

**Key Takeaway:**
JSX is a **powerful, declarative syntax** that makes React code readable, concise, and safe. It lets you mix **HTML-like structure with JavaScript logic** seamlessly.

---