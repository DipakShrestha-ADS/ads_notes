
# Day 4 — HTML Forms

HTML Forms are used to **collect information from users**.

Examples of forms on websites:

- Login forms
- Registration forms
- Contact forms
- Search boxes
- Payment forms

Forms allow users to **enter data and send it to a server**.

---

# 1. Introduction to Forms

A **form** is a section of a webpage where users can:

- Enter text
- Choose options
- Submit information

Example websites using forms:

- Google search bar
- Facebook login
- Online shopping checkout
- Contact us page

Forms send user data to a **server** for processing.

---

# 2. `<form>` Tag

The `<form>` tag is used to **create a form** in HTML.

### Basic Syntax

```html
<form>
   form elements go here
</form>
````

Everything inside the `<form>` tag becomes part of the form.

---

### Simple Form Example

```html
<form>

<label>Name:</label>
<input type="text">

</form>
```

### Line-by-line Explanation

```html
<form>
<!-- Starts the form -->

<label>Name:</label>
<!-- Text label describing the input field -->

<input type="text">
<!-- Input field where user types text -->

</form>
<!-- Ends the form -->
```

---

# 3. Input Fields (`<input>`)

The `<input>` tag is used to **accept data from the user**.

The behavior of the input field depends on the **type attribute**.

Syntax:

```html
<input type="type-name">
```

---

# 3.1 Text Input (`type="text"`)

Used to enter **short text**.

Example:

```html
<input type="text">
```

### Example with Explanation

```html
<label>Full Name:</label>

<input type="text">
<!-- Allows user to type their name -->
```

---

# 3.2 Password Input (`type="password"`)

Used for **password fields**.

The typed characters are **hidden**.

Example:

```html
<input type="password">
```

### Explanation

```html
<label>Password:</label>

<input type="password">
<!-- Characters typed will appear as dots or stars -->
```

---

# 3.3 Email Input (`type="email"`)

Used to enter **email addresses**.

Browsers automatically check if the input **looks like an email**.

Example:

```html
<input type="email">
```

### Explanation

```html
<label>Email:</label>

<input type="email">
<!-- Browser validates email format -->
```

Example valid email:

```
student@gmail.com
```

---

# 3.4 Number Input (`type="number"`)

Used to enter **numbers only**.

Example:

```html
<input type="number">
```

### Explanation

```html
<label>Age:</label>

<input type="number">
<!-- Only numeric values can be entered -->
```

Browsers often show **up/down arrows** for numbers.

---

# 3.5 Telephone Input (`type="tel"`)

Used to enter **phone numbers**.

Example:

```html
<input type="tel">
```

### Explanation

```html
<label>Phone Number:</label>

<input type="tel">
<!-- Used for telephone numbers -->
```

Example input:

```
9841234567
```

---

# 3.6 URL Input (`type="url"`)

Used to enter **website addresses**.

Example:

```html
<input type="url">
```

### Explanation

```html
<label>Website:</label>

<input type="url">
<!-- Browser checks for proper URL format -->
```

Example:

```
https://example.com
```

---

# 4. `<label>` Tag

The `<label>` tag provides a **text description for an input field**.

It helps users understand **what information to enter**.

### Example

```html
<label>Username:</label>
<input type="text">
```

### Explanation

```html
<label>Username:</label>
<!-- Text describing the input -->

<input type="text">
<!-- Input field for entering username -->
```

Benefits of label:

* Improves accessibility
* Makes forms easier to understand

---

# 5. Placeholder Attribute

The **placeholder** attribute shows a **hint text inside the input field**.

The text disappears when the user starts typing.

### Example

```html
<input type="text" placeholder="Enter your name">
```

### Explanation

```html
<input 
type="text"
placeholder="Enter your name"
>

<!-- placeholder shows guide text inside input -->
```

---

# 6. Required Attribute

The **required** attribute makes a field **mandatory**.

The form **cannot be submitted unless the field is filled**.

### Example

```html
<input type="text" required>
```

### Explanation

```html
<input type="text" required>
<!-- User must enter a value before submitting -->
```

If the user leaves the field empty, the browser shows an **error message**.

---

# 7. Basic Input Validation

HTML provides **built-in validation** for certain inputs.

Validation ensures that **correct data is entered**.

Examples:

| Input Type | Validation                              |
| ---------- | --------------------------------------- |
| email      | must contain `@`                        |
| url        | must start with `http://` or `https://` |
| number     | must be numeric                         |

---

### Example Form with Validation

```html
<form>

<label>Name:</label>
<input type="text" placeholder="Enter your name" required>

<br><br>

<label>Email:</label>
<input type="email" placeholder="Enter your email" required>

<br><br>

<label>Age:</label>
<input type="number" placeholder="Enter your age">

<br><br>

<label>Phone:</label>
<input type="tel" placeholder="Enter your phone number">

<br><br>

<label>Website:</label>
<input type="url" placeholder="Enter your website">

</form>
```

---

# Line-by-line Explanation

```html
<form>
<!-- Starts the form -->

<label>Name:</label>
<!-- Label for name field -->

<input type="text" placeholder="Enter your name" required>
<!-- Text field with placeholder and required validation -->

<br><br>
<!-- Line breaks for spacing -->

<label>Email:</label>
<!-- Label for email field -->

<input type="email" placeholder="Enter your email" required>
<!-- Email field with automatic email validation -->

<br><br>

<label>Age:</label>

<input type="number" placeholder="Enter your age">
<!-- Numeric input field -->

<br><br>

<label>Phone:</label>

<input type="tel" placeholder="Enter your phone number">
<!-- Phone number field -->

<br><br>

<label>Website:</label>

<input type="url" placeholder="Enter your website">
<!-- URL input field -->

</form>
<!-- End of form -->
```

---

# Complete Example: Registration Form

```html
<!DOCTYPE html>
<html>

<head>
<title>Registration Form</title>
</head>

<body>

<h1>Student Registration</h1>

<form>

<label>Full Name:</label>
<input type="text" placeholder="Enter your full name" required>

<br><br>

<label>Email Address:</label>
<input type="email" placeholder="Enter your email" required>

<br><br>

<label>Password:</label>
<input type="password" placeholder="Enter your password" required>

<br><br>

<label>Age:</label>
<input type="number" placeholder="Enter your age">

<br><br>

<label>Phone Number:</label>
<input type="tel" placeholder="Enter your phone number">

<br><br>

<label>Website:</label>
<input type="url" placeholder="Enter your website">

</form>

</body>
</html>
```

---

# Summary of Day 4

You learned:

- ✔ What HTML forms are
- ✔ `<form>` tag
- ✔ Input fields
- ✔ `text` input
- ✔ `password` input
- ✔ `email` input
- ✔ `number` input
- ✔ `tel` input
- ✔ `url` input
- ✔ `<label>` tag
- ✔ Placeholder attribute
- ✔ Required attribute
- ✔ Basic HTML input validation

---

# Practice Tasks

### Task 1

Create a form with:

* Name field
* Email field

---

### Task 2

Create a login form containing:

* Username
* Password

---

### Task 3

Create a form with:

* Name
* Age
* Email

Use **placeholders** for each field.

---

### Task 4

Create a form with **required fields**.

Required:

```
Name
Email
Password
```

---

### Task 5

Create a form to collect:

```
Phone number
Website URL
```

---

### Task 6

Create a form with **all input types learned today**.

---

### Task 7

Create a **student registration form**.

Fields:

```
Name
Email
Age
Phone
```

---

### Task 8

Create a **contact form** with:

```
Name
Email
Website
```

---

### Task 9

Create a form where **email must be validated**.

---

### Task 10

Create a **complete registration form** containing:

* Name
* Email
* Password
* Phone
* Website
* Placeholder text
* Required validation

---
