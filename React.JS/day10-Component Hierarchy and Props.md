# Day 10: Component Hierarchy and Props

In React, building complex UIs involves breaking them into smaller, reusable components organized in a hierarchy. Understanding how data and functions flow between parent and child components is crucial for creating maintainable applications.

## 1. Parent-Child Component Structure

React components form a tree-like hierarchy:
- **Parent component** renders one or more **child components**.
- Data flows **down** from parent to child via **props**.
- Events and state changes can flow **up** (we'll cover this in "lifting state up").

### Example: Basic Parent-Child Structure with Line Comments

```jsx
import React from 'react';

// Child component - displays user info
function UserInfo({ name, age, email }) {          // Receives props from parent
  return (
    <div style={{ border: "2px solid blue", padding: "15px", margin: "10px" }}>
      <h3>User Information</h3>
      <p><strong>Name:</strong> {name}</p>          {/* Uses props */}
      <p><strong>Age:</strong> {age}</p>
      <p><strong>Email:</strong> {email}</p>
    </div>
  );
}

// Parent component - manages data and renders child
function App() {
  // Data defined in parent
  const userData = {
    name: "Dipak Shrestha",
    age: 26,
    email: "dipak@example.com"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>My App</h1>
      {/* Pass data down as props */}
      <UserInfo 
        name={userData.name} 
        age={userData.age} 
        email={userData.email} 
      />
      {/* Or use spread operator */}
      {/* <UserInfo {...userData} /> */}
    </div>
  );
}

export default App;
```

**Key Points:**
- Parent owns the data.
- Child only displays what it receives via props.
- Child is reusable and independent.

## 2. Passing Functions as Props

Functions are first-class citizens in JavaScript — you can pass them as props just like data. This enables child components to communicate back to the parent.

### Example: Passing Function as Prop

```jsx
import React, { useState } from 'react';

// Child component - button that calls a function from parent
function LikeButton({ onLikeClick }) {             // Receives function as prop
  return (
    <button 
      onClick={onLikeClick}                       // Calls parent's function
      style={{ padding: "10px 20px", fontSize: "16px" }}
    >
      Like ❤️
    </button>
  );
}

// Parent component - owns state and function
function Post() {
  const [likes, setLikes] = useState(0);          // State lives in parent

  // Function to update state
  const handleLike = () => {
    setLikes(likes + 1);                          // Update state
  };

  return (
    <div style={{ border: "1px solid gray", padding: "20px", margin: "20px" }}>
      <h2>Amazing React Post</h2>
      <p>Likes: {likes}</p>
      {/* Pass function down to child */}
      <LikeButton onLikeClick={handleLike} />
    </div>
  );
}

export default Post;
```

**Why pass functions?**
- Child doesn't need to know about state.
- Parent controls how state changes.
- Enables reusability.

## 3. Lifting State Up

When multiple components need to share state, move it to their **closest common ancestor** (parent). This is called "lifting state up".

### Why Lift State Up?

- Single source of truth.
- Synchronize state across components.
- Avoid prop drilling through many layers.

### Example: Two Inputs Sharing State (Before Lifting)

Bad: Each input manages its own state → not synced.

```jsx
function Input1() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}

function Input2() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
// Values are independent → not useful for shared input
```

### Correct: Lift State Up to Parent

```jsx
import React, { useState } from 'react';

// Child component - controlled input
function SyncInput({ value, onValueChange }) {     // Receives value and handler
  return (
    <input
      value={value}                               // Controlled by parent
      onChange={(e) => onValueChange(e.target.value)} // Calls parent's function
      style={{ margin: "10px", padding: "8px" }}
    />
  );
}

// Parent component - owns shared state
function App() {
  const [sharedValue, setSharedValue] = useState(""); // Single source of truth

  return (
    <div style={{ padding: "30px" }}>
      <h2>Shared Input Demo</h2>
      <p>Current value: <strong>{sharedValue}</strong></p>
      
      <label>Input 1:</label>
      <SyncInput value={sharedValue} onValueChange={setSharedValue} />
      
      <br /><br />
      
      <label>Input 2:</label>
      <SyncInput value={sharedValue} onValueChange={setSharedValue} />
      
      <p>Both inputs stay in sync!</p>
    </div>
  );
}

export default App;
```

## Hands-On Solution: Temperature Converter with Shared State

**Requirement:**  
Build a temperature converter (Celsius ↔ Fahrenheit) using two components that share the same temperature state.

### Solution with Detailed Line Comments

```jsx
import React, { useState } from 'react';

// Child component: Celsius input
function CelsiusInput({ celsius, onCelsiusChange }) {
  return (
    <div style={{ margin: "20px" }}>
      <label>
        <strong>Celsius:</strong>
        <input
          type="number"
          value={celsius}                          // Controlled by parent state
          onChange={(e) => onCelsiusChange(Number(e.target.value))}
          style={{ padding: "8px", marginLeft: "10px" }}
        />
        °C
      </label>
    </div>
  );
}

// Child component: Fahrenheit input
function FahrenheitInput({ fahrenheit, onFahrenheitChange }) {
  return (
    <div style={{ margin: "20px" }}>
      <label>
        <strong>Fahrenheit:</strong>
        <input
          type="number"
          value={fahrenheit}                       // Controlled by parent
          onChange={(e) => onFahrenheitChange(Number(e.target.value))}
          style={{ padding: "8px", marginLeft: "10px" }}
        />
        °F
      </label>
    </div>
  );
}

// Parent component: owns state and conversion logic
function TemperatureConverter() {
  const [celsius, setCelsius] = useState(0);      // Single source of truth

  // Convert Celsius to Fahrenheit
  const fahrenheit = (celsius * 9/5) + 32;

  // Handler when Celsius changes
  const handleCelsiusChange = (newCelsius) => {
    setCelsius(newCelsius);                       // Update state directly
  };

  // Handler when Fahrenheit changes (convert back)
  const handleFahrenheitChange = (newFahrenheit) => {
    const newCelsius = (newFahrenheit - 32) * 5/9;
    setCelsius(newCelsius);                       // Update shared state
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "40px auto",
      padding: "30px",
      border: "2px solid #333",
      borderRadius: "12px",
      textAlign: "center",
      backgroundColor: "#f9f9f9"
    }}>
      <h1>Temperature Converter</h1>
      <p>Change either value — both update automatically!</p>

      {/* Child components receive value and handler */}
      <CelsiusInput 
        celsius={celsius} 
        onCelsiusChange={handleCelsiusChange} 
      />

      <FahrenheitInput 
        fahrenheit={fahrenheit} 
        onFahrenheitChange={handleFahrenheitChange} 
      />

      <p style={{ marginTop: "30px", fontSize: "18px" }}>
        {celsius}°C = {fahrenheit.toFixed(2)}°F
      </p>
    </div>
  );
}

export default TemperatureConverter;
```

**How It Works:**
- State (`celsius`) lives in the parent.
- Fahrenheit is derived from celsius.
- Both child inputs update the same shared state.
- Changing either input syncs both displays.

## 10 Practice Tasks for Each Topic

### 1. Parent-Child Component Structure – 10 Tasks

1. Create a `Header` child component rendered inside `App`.

2. Build a `Card` component that displays title and description from parent.

3. Make a `Profile` component with avatar image passed as prop.

4. Create a `ProductList` parent that renders multiple `ProductItem` children.

5. Build a `Navbar` with `Logo` and `Menu` as child components.

6. Create a `BlogPost` parent with `Title`, `Author`, and `Content` children.

7. Make a `Dashboard` with `Sidebar` and `MainContent` children.

8. Build a `Form` parent with `InputField` and `SubmitButton` children.

9. Create a `Gallery` parent rendering multiple `ImageCard` children.

10. Make a `Team` parent showing multiple `TeamMember` cards.

### 2. Passing Functions as Props – 10 Tasks

1. Create a button child that calls parent's `onDelete` function.

2. Build a `TodoItem` that calls `onComplete` when checkbox clicked.

3. Make a `CounterButton` that calls parent's increment/decrement.

4. Create a `Modal` with `onClose` function passed from parent.

5. Build a `RatingStar` that calls `onRate(value)` on click.

6. Make a `Pagination` button that calls `onPageChange(page)`.

7. Create a `SearchBar` that calls `onSearch(query)`.

8. Build a `FilterDropdown` that calls `onFilterChange(filter)`.

9. Make a `SortableColumn` header that calls `onSort(column)`.

10. Create a `FileUploader` that calls `onUpload(file)`.

### 3. Lifting State Up – 10 Tasks

1. Sync two text inputs (typing in one appears in both).

2. Build a form with name/email inputs showing live preview below.

3. Create two counters that share the same count value.

4. Make a light/dark theme toggle affecting multiple components.

5. Build a shopping cart where item count updates total in header.

6. Create a multi-step form where progress is shared.

7. Sync a slider and number input for the same value.

8. Build a color picker where hex and RGB inputs stay synced.

9. Make two date pickers for "start" and "end" with shared state.

10. Create a unit converter (km ↔ miles) with bidirectional sync.

Practice these concepts daily — mastering component communication is key to building scalable React apps! 🚀