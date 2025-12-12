---

# ⭐️ JSX Syntax Checklist (Full Clean Notes)

## **1. Component Basics**

✔ Component names must **start with Capital Letters**
✔ Component must **return ONE root element**
✔ Props use **camelCase** (e.g., `onClick`, `tabIndex`)
✔ **Do NOT call components as normal functions** → use `<Component />`

**Example:**

```jsx
function MyComponent() { 
  return <h1>Hello</h1>; 
}
```

---

## **2. HTML Differences in JSX**

JSX is not HTML — some attributes differ:

| HTML          | JSX         |
| ------------- | ----------- |
| `class`       | `className` |
| `for`         | `htmlFor`   |
| Inline events | camelCase   |

✔ Attributes must use **camelCase**
✔ Boolean attributes must be written explicitly:

```jsx
<input disabled={true} />
```

---

## **3. JavaScript Inside `{ }`**

✔ Wrap JS expressions inside `{ }`
✔ Only **expressions** allowed (not statements like `if`, `for`)

**Examples**

```jsx
<p>{total + 1}</p>
<p>{user?.name}</p>
<p>{isLoggedIn && "Welcome!"}</p>
```

❌ Not allowed:

```jsx
{ if(total > 5) return "ok" } // ❌
```

---

## **4. Props & Data Flow**

✔ Props passed like attributes
✔ Dynamic values use `{ }`
✔ Functions passed by reference (NOT called)

```jsx
<Button title="Click me" count={5} onClick={handleClick} />
```

---

## **5. Conditional Rendering**

✔ Ternary operator

```jsx
{isLoggedIn ? "Welcome" : "Please Login"}
```

✔ Logical AND (`&&`)

```jsx
{cart.length > 0 && <Cart />}
```

---

## **6. Lists & Keys**

✔ Use `.map()` to render lists
✔ **Each item needs a unique key** (not index if items can reorder)

```jsx
{users.map(user => (
  <li key={user.id}>{user.name}</li>
))}
```

---

## **7. Self-Closing Tags**

Always close tags:

```jsx
<img src="" />
<input />
<br />
```

---

## **8. Fragments**

To return multiple elements without a wrapper:

```jsx
<>
  <h1>Hello</h1>
  <p>World</p>
</>
```

Alternative:

```jsx
<React.Fragment>...</React.Fragment>
```

---

## **9. Event Handling**

✔ Events use camelCase:

* onClick
* onChange
* onSubmit
* onMouseEnter

✔ Pass function reference (not execute)

```jsx
<button onClick={handleClick}>Click</button>
```

❌ Wrong:

```jsx
<button onClick={handleClick()}>Click</button>
```

---

## **10. Styling in JSX**

Inline styles must be **JS objects**:

```jsx
<div style={{ color: "red", fontSize: "20px" }}>Hello</div>
```

CSS files still recommended.

---

## **11. Avoid Pitfalls**

✔ Must close every tag
✔ Never mutate state directly
❌ Wrong:

```jsx
state.count = 5
```

✔ Use setter:

```jsx
setCount(5)
```

---

# ⭐ Optional MINI CHEAT-SHEET (Ultra-Quick Revision)

* Components start **Capitalized**
* JS expressions go **inside `{}`**
* Use `className`
* One root element
* Use **keys** in lists
* Props use **camelCase**
* Functions passed without calling them
* Inline styles = object
* Conditional rendering → **ternary / &&**

---