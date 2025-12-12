---

# 📘 Controlled vs Uncontrolled Components in React

In React, form inputs are handled in two ways:
1️⃣ **Controlled Components**
2️⃣ **Uncontrolled Components**

Understanding these helps you choose how to manage user input effectively.

---

# 1️⃣ Controlled Components

A **controlled component** is an input where **React completely manages the value using state**.

### ✔ Key Points

* `useState` stores the current value
* `value={state}` binds the input to React
* `onChange` updates the state
* UI always follows state → predictable

---

### ✅ Example: Controlled Input

```jsx
import { useState } from "react";

function ControlledInput() {
    const [text, setText] = useState("");

    return (
        <div>
            <input 
                type="text" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
            />
            <p>Typed Text: {text}</p>
        </div>
    );
}
```

📌 **React controls the value**, not the browser.

---

### 🟢 Advantages of Controlled Components

✔ Real-time validation
✔ Easy to debug (state is the source of truth)
✔ Easy integration with Redux/Context
✔ Perfect for dynamic or complex forms

---

# 2️⃣ Uncontrolled Components

An **uncontrolled component** lets the **browser manage the input value**, and you read the value via `useRef`.

### ✔ Key Points

* No state needed
* Value is read only when required
* Useful for simpler or one-time forms

---

### ✅ Example: Uncontrolled Input

```jsx
import { useRef } from "react";

function UncontrolledInput() {
    const inputRef = useRef(null);

    const handleSubmit = () => {
        alert("Entered Text: " + inputRef.current.value);
    };

    return (
        <div>
            <input type="text" ref={inputRef} />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}
```

📌 Fast and simple—but less predictable.

---

### 🟡 Advantages of Uncontrolled Components

✔ Minimal setup
✔ Good for integrating non-React libraries
✔ Useful for file uploads (file inputs can’t be controlled easily)

---

# 3️⃣ Controlled vs Uncontrolled (Comparison Table)

| Feature          | Controlled 🟢             | Uncontrolled 🟡   |
| ---------------- | ------------------------- | ----------------- |
| State Management | React (`useState`)        | DOM (`ref`)       |
| Accessing Value  | value + onChange          | direct DOM access |
| Best For         | Validation, dynamic forms | Simple forms      |
| Predictability   | ⭐ High                    | ⭐ Low             |
| Code Complexity  | Higher                    | Lower             |

---

# 4️⃣ When Should You Use Which?

### ✔ Use Controlled Components When:

* Form needs validation
* Input must update UI instantly
* You want React to fully control data
* Values influence other parts of UI

### ✔ Use Uncontrolled Components When:

* You only need the value on submit
* Form is simple
* Working with DOM-heavy libraries (e.g., jQuery plugins)
* Handling `<input type="file" />`

---

# 5️⃣ Hybrid Approach (Controlled + Uncontrolled)

You can mix both.

### Example: Controlled Text + Uncontrolled File Input

```jsx
function HybridForm() {
    const fileRef = useRef(null);
    const [name, setName] = useState("");

    const handleSubmit = () => {
        console.log("Name:", name);
        console.log("File:", fileRef.current.files[0]);
    };

    return (
        <div>
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />

            <input type="file" ref={fileRef} />

            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}
```

---

# 📘 Handling Form Inputs in React

React handles inputs through state updates, refs, or both.

---

# 1️⃣ Controlled Inputs (useState)

### Example: Basic Controlled Form

```jsx
function ControlledForm() {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Submitted Name: " + name);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />
            <button type="submit">Submit</button>
        </form>
    );
}
```

---

# 2️⃣ Handling Multiple Inputs

Use a single state object.

```jsx
function MultiInputForm() {
    const [formData, setFormData] = useState({ name: "", email: "" });

    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
    };
```

---

# 3️⃣ Checkbox & Radio Inputs

### Checkbox Example

```jsx
function CheckboxForm() {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <form>
            <input 
                type="checkbox" 
                checked={isChecked} 
                onChange={() => setIsChecked(!isChecked)} 
            />
        </form>
    );
}
```

### Radio Example

```jsx
function RadioForm() {
    const [gender, setGender] = useState("");

    return (
        <form>
            <input 
                type="radio" 
                name="gender" 
                value="male"
                checked={gender === "male"} 
                onChange={(e) => setGender(e.target.value)}
            />
        </form>
    );
}
```

---

# 4️⃣ Select Dropdown

```jsx
function SelectForm() {
    const [country, setCountry] = useState("USA");

    return (
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
        </select>
    );
}
```

---

# 5️⃣ Uncontrolled Inputs (useRef)

```jsx
function UncontrolledForm() {
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(inputRef.current.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" ref={inputRef} />
        </form>
    );
}
```

---

# 📘 Basic Form Validation in React

Validation ensures users enter valid data before submitting.

---

# 1️⃣ Required Field Validation

```jsx
if (name.trim() === "") {
    setError("Name is required!");
}
```

---

# 2️⃣ Email Validation

```jsx
if (!email.includes("@") || !email.includes(".")) {
    setError("Invalid email format!");
}
```

---

# 3️⃣ Password Validation

```jsx
if (password.length < 6) {
    setError("Password must be at least 6 characters!");
}
```

---

# 4️⃣ Multi-Field Validation

Use an `errors` object storing errors for each field.

---

# 5️⃣ Real-Time Validation (Live Feedback)

Validate inside the input’s `onChange`.

---

# 🟦 Summary Table: Form Validation

| Validation Type | Method                   |
| --------------- | ------------------------ |
| Required        | Check empty value        |
| Email           | Check for "@" + "."      |
| Password        | Check minimum length     |
| Multiple Fields | Use errors object        |
| Live Feedback   | Validate inside onChange |

---

# ✅ Final Conclusion

* **Controlled components** → Best for validation, dynamic forms, real-time updates
* **Uncontrolled components** → Best for simple forms, file uploads, and when integrating DOM-based libraries
* React offers flexible ways to handle forms using `useState` and `useRef`
* Real-time validation improves user experience

---