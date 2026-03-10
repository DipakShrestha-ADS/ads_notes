# Day 5 — Advanced Form Elements

In Day 4, you learned **basic form inputs** such as text, email, password, etc.

In this lesson, you will learn **advanced form elements** that allow users to:

- Select options
- Upload files
- Pick dates and colors
- Enter long text
- Group related form fields

These elements are widely used in **registration forms, surveys, feedback forms, and online applications**.

---

# 1. Radio Buttons

Radio buttons allow the user to **select only ONE option from multiple choices**.

Example use cases:

- Gender selection
- Payment method
- Yes/No questions

Important rule:

> Radio buttons that belong to the same group must have the **same `name` attribute**.

---

## Example

```html
<label>Gender:</label>

<input type="radio" name="gender" value="male"> Male
<input type="radio" name="gender" value="female"> Female
<input type="radio" name="gender" value="other"> Other
````

---

## Line-by-line Explanation

```html
<label>Gender:</label>
<!-- Label describing the radio group -->

<input type="radio" name="gender" value="male">
<!-- radio input for male option -->
<!-- name="gender" groups all radio buttons together -->

Male
<!-- text displayed next to radio button -->

<input type="radio" name="gender" value="female">
<!-- second option -->

Female

<input type="radio" name="gender" value="other">
<!-- third option -->

Other
```

Only **one option can be selected at a time**.

---

# 2. Checkboxes

Checkboxes allow users to **select multiple options**.

Example uses:

* Hobbies
* Skills
* Interests

---

## Example

```html
<label>Hobbies:</label>

<input type="checkbox" name="hobby" value="reading"> Reading
<input type="checkbox" name="hobby" value="sports"> Sports
<input type="checkbox" name="hobby" value="music"> Music
```

---

## Explanation

```html
<label>Hobbies:</label>
<!-- Label for hobbies -->

<input type="checkbox" name="hobby" value="reading">
<!-- checkbox option -->

Reading

<input type="checkbox" name="hobby" value="sports">
<!-- second checkbox -->

Sports

<input type="checkbox" name="hobby" value="music">
<!-- third checkbox -->

Music
```

Users can **select one or multiple options**.

---

# 3. Select Dropdown (`<select>`)

A dropdown allows users to **select one option from a list**.

Tags used:

* `<select>` → creates dropdown
* `<option>` → dropdown options

---

## Example

```html
<label>Country:</label>

<select>
<option>Nepal</option>
<option>India</option>
<option>USA</option>
<option>UK</option>
</select>
```

---

## Explanation

```html
<label>Country:</label>
<!-- label describing dropdown -->

<select>
<!-- start dropdown -->

<option>Nepal</option>
<!-- first option -->

<option>India</option>

<option>USA</option>

<option>UK</option>

</select>
<!-- end dropdown -->
```

---

# 4. Textarea (`<textarea>`)

`<textarea>` is used for **long text input**.

Examples:

* Feedback
* Comments
* Messages

---

## Example

```html
<label>Message:</label>

<textarea rows="4" cols="40"></textarea>
```

---

## Explanation

```html
<label>Message:</label>
<!-- label for textarea -->

<textarea rows="4" cols="40">
</textarea>

<!-- rows defines height -->
<!-- cols defines width -->
```

Users can type **multiple lines of text**.

---

# 5. File Upload

File input allows users to **upload files from their computer**.

Example uses:

* Profile photo upload
* Resume upload
* Document submission

---

## Example

```html
<label>Upload Resume:</label>

<input type="file">
```

---

## Explanation

```html
<label>Upload Resume:</label>
<!-- label for file upload -->

<input type="file">
<!-- opens file selection dialog -->
```

When clicked, the browser opens the **file explorer**.

---

# 6. Hidden Input

Hidden inputs store **data that users cannot see**.

Example uses:

* user ID
* session values
* tracking information

---

## Example

```html
<input type="hidden" name="userid" value="12345">
```

---

## Explanation

```html
<input type="hidden" name="userid" value="12345">

<!-- hidden field not visible to users -->
<!-- used to send data to server -->
```

---

# 7. Date Input

Allows users to **select a date from a calendar**.

---

## Example

```html
<label>Select Date:</label>

<input type="date">
```

---

## Explanation

```html
<label>Select Date:</label>

<input type="date">
<!-- browser displays a calendar picker -->
```

---

# 8. Range Input

Range input creates a **slider control**.

Example uses:

* Volume control
* Price range
* Rating

---

## Example

```html
<label>Volume:</label>

<input type="range" min="0" max="100">
```

---

## Explanation

```html
<label>Volume:</label>

<input type="range" min="0" max="100">

<!-- range slider -->
<!-- min defines minimum value -->
<!-- max defines maximum value -->
```

---

# 9. Color Input

Allows users to **choose a color**.

---

## Example

```html
<label>Choose Color:</label>

<input type="color">
```

---

## Explanation

```html
<label>Choose Color:</label>

<input type="color">
<!-- browser shows color picker -->
```

---

# 10. Form Buttons

Buttons perform **actions in forms**.

Types of buttons:

* submit
* reset
* button

---

# 10.1 Submit Button

The **submit button sends form data to the server**.

---

## Example

```html
<input type="submit" value="Submit">
```

---

## Explanation

```html
<input type="submit" value="Submit">

<!-- submits form data -->
<!-- value defines button text -->
```

---

# 10.2 Reset Button

The **reset button clears all form fields**.

---

## Example

```html
<input type="reset" value="Reset">
```

---

## Explanation

```html
<input type="reset" value="Reset">

<!-- clears all inputs in the form -->
```

---

# 10.3 Button

This is a **normal button**.

It does **not perform any action unless programmed with JavaScript**.

---

## Example

```html
<button>Click Me</button>
```

---

## Explanation

```html
<button>
Click Me
</button>

<!-- generic button -->
```

---

# 11. Form Grouping

Large forms can become **difficult to read**.

HTML provides tags to **group related fields**.

---

# 11.1 `<fieldset>`

`<fieldset>` groups related form elements.

---

## Example

```html
<fieldset>

<label>Name:</label>
<input type="text">

<label>Email:</label>
<input type="email">

</fieldset>
```

---

## Explanation

```html
<fieldset>

<!-- groups related form fields -->

<label>Name:</label>
<input type="text">

<label>Email:</label>
<input type="email">

</fieldset>
```

Browsers usually display **a border around the grouped fields**.

---

# 11.2 `<legend>`

`<legend>` provides a **title for the fieldset group**.

---

## Example

```html
<fieldset>

<legend>Personal Information</legend>

<label>Name:</label>
<input type="text">

<label>Email:</label>
<input type="email">

</fieldset>
```

---

## Explanation

```html
<fieldset>

<legend>Personal Information</legend>
<!-- title for the fieldset -->

<label>Name:</label>
<input type="text">

<label>Email:</label>
<input type="email">

</fieldset>
```

---

# Complete Example: Advanced Form

```html
<!DOCTYPE html>
<html>

<head>
<title>Advanced Form Example</title>
</head>

<body>

<h1>Registration Form</h1>

<form>

<fieldset>

<legend>Personal Information</legend>

<label>Name:</label>
<input type="text" placeholder="Enter your name">

<br><br>

<label>Email:</label>
<input type="email" placeholder="Enter your email">

<br><br>

<label>Gender:</label>

<input type="radio" name="gender"> Male
<input type="radio" name="gender"> Female

<br><br>

<label>Hobbies:</label>

<input type="checkbox"> Reading
<input type="checkbox"> Sports
<input type="checkbox"> Music

<br><br>

<label>Country:</label>

<select>
<option>Nepal</option>
<option>India</option>
<option>USA</option>
</select>

<br><br>

<label>Message:</label>

<textarea rows="4" cols="40"></textarea>

<br><br>

<label>Upload Photo:</label>
<input type="file">

<br><br>

<label>Birth Date:</label>
<input type="date">

<br><br>

<label>Favorite Color:</label>
<input type="color">

<br><br>

<input type="submit" value="Submit">
<input type="reset" value="Reset">

</fieldset>

</form>

</body>
</html>
```

---

# Summary of Day 5

You learned:

- ✔ Radio buttons
- ✔ Checkboxes
- ✔ Select dropdown
- ✔ Textarea
- ✔ File upload
- ✔ Hidden input
- ✔ Date input
- ✔ Range slider
- ✔ Color picker
- ✔ Submit button
- ✔ Reset button
- ✔ Button tag
- ✔ Fieldset
- ✔ Legend

---

# Practice Tasks

### Task 1

Create a form with **radio buttons for gender selection**.

---

### Task 2

Create checkboxes for hobbies:

```
Reading
Sports
Music
Travel
```

---

### Task 3

Create a **dropdown menu** for selecting country.

---

### Task 4

Create a **textarea for feedback**.

---

### Task 5

Add a **file upload field** for profile picture.

---

### Task 6

Create a **date picker** for birth date.

---

### Task 7

Create a **range slider for rating (1–10)**.

---

### Task 8

Create a **color picker for favorite color**.

---

### Task 9

Create a form with **submit and reset buttons**.

---

### Task 10

Create a **complete registration form** containing:

* Name
* Email
* Gender (radio buttons)
* Hobbies (checkboxes)
* Country (dropdown)
* Message (textarea)
* File upload
* Date input
* Color input
* Submit and Reset buttons
* Fieldset and Legend

---