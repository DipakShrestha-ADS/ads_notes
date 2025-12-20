### Day 5: HTML Forms and Input Elements - Part 2

Welcome to Day 5! You're doing fantastic. Yesterday you learned the basics of forms, labels, text inputs, email, password, and how to group them with fieldsets. Today we finish forms by exploring the remaining input types, buttons, dropdown menus, textareas, and basic form validation.

These elements let users make choices (radio buttons, checkboxes), select from options (dropdowns), write longer messages (textarea), upload files, and more. We'll also see how to make forms smarter with simple built-in validation.

As always, simple explanations, well-commented code examples. Save and test each one!

#### Topic 1: Radio Buttons and Checkboxes
- **Radio buttons** (`<input type="radio">`): Let user choose **only one** option from a group. Use the same `name` attribute for all in the group.
- **Checkboxes** (`<input type="checkbox">`): Let user choose **multiple** options (or none).

Why important: Perfect for yes/no questions, gender selection, multiple hobbies, etc.

Example Code: Save as "radio-checkbox.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Radio and Checkbox Example</title>
</head>
<body>
    
    <h1>Survey Form</h1>
    
    <form action="#" method="POST">
        
        <fieldset>
            <legend>Personal Choices</legend>
            
            <!-- Radio buttons: Only one can be selected -->
            <p>Choose your favorite color:</p>
            <label>
                <input type="radio" name="color" value="red"> Red
            </label><br>
            <label>
                <input type="radio" name="color" value="blue"> Blue
            </label><br>
            <label>
                <input type="radio" name="color" value="green"> Green
            </label>
            <!-- All have same 'name="color"' so only one can be chosen -->
            
            <br><br>
            
            <!-- Checkboxes: Multiple can be selected -->
            <p>Select your hobbies (you can choose more than one):</p>
            <label>
                <input type="checkbox" name="hobbies" value="reading"> Reading
            </label><br>
            <label>
                <input type="checkbox" name="hobbies" value="sports"> Sports
            </label><br>
            <label>
                <input type="checkbox" name="hobbies" value="music"> Music
            </label><br>
            <label>
                <input type="checkbox" name="hobbies" value="coding"> Coding
            </label>
            <!-- Same name, but different values -->
            
        </fieldset>
        
        <br>
        <button type="submit">Submit Answers</button>
        
    </form>
    
</body>
</html>
```
Try it: Select one color (you can't select two), then select as many hobbies as you want.

#### Topic 2: Dropdown Menu (`<select>` and `<option>`)
- `<select>`: Creates a dropdown list.
- `<option>`: Each choice inside the list.
- Use `multiple` attribute to allow selecting more than one (hold Ctrl/Cmd to select multiple).

Example Code: Save as "dropdown.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Dropdown Example</title>
</head>
<body>
    
    <form action="#" method="POST">
        
        <!-- Single selection dropdown -->
        <label for="country">Choose your country:</label><br>
        <select id="country" name="country">
            <option value="">-- Please select --</option>  <!-- Default empty option -->
            <option value="usa">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="india">India</option>
            <option value="canada">Canada</option>
            <option value="other">Other</option>
        </select>
        
        <br><br>
        
        <!-- Multiple selection (hold Ctrl/Cmd to select more) -->
        <label for="languages">Languages you know:</label><br>
        <select id="languages" name="languages" multiple size="4">
            <!-- size="4" shows 4 options at once -->
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="js">JavaScript</option>
            <option value="python">Python</option>
        </select>
        
        <br><br>
        <button type="submit">Submit</button>
        
    </form>
    
</body>
</html>
```

#### Topic 3: Textarea and File Input
- **`<textarea>`**: For longer text (messages, comments).
- **File input** (`<input type="file">`): Lets user upload a file.
- **Other useful types**: `date`, `number`, `range`, `color`.

Example Code: Save as "textarea-file.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Textarea and File Example</title>
</head>
<body>
    
    <form action="#" method="POST">
        
        <!-- Textarea for long message -->
        <label for="message">Your Message:</label><br>
        <textarea id="message" name="message" rows="5" cols="40" placeholder="Write your feedback here..."></textarea>
        <!-- rows and cols control size -->
        
        <br><br>
        
        <!-- File upload -->
        <label for="photo">Upload your photo:</label><br>
        <input type="file" id="photo" name="photo" accept="image/*">
        <!-- accept="image/*" allows only images -->
        
        <br><br>
        
        <!-- Date picker -->
        <label for="birthday">Birthday:</label>
        <input type="date" id="birthday" name="birthday">
        
        <br><br>
        
        <!-- Number input -->
        <label for="age">Age:</label>
        <input type="number" id="age" name="age" min="13" max="100">
        
        <br><br>
        
        <!-- Range slider -->
        <label for="volume">Volume (0-100):</label>
        <input type="range" id="volume" name="volume" min="0" max="100" value="50">
        
        <br><br>
        
        <!-- Color picker -->
        <label for="favcolor">Favorite Color:</label>
        <input type="color" id="favcolor" name="favcolor">
        
        <br><br>
        <button type="submit">Send</button>
        
    </form>
    
</body>
</html>
```
Try it: Click the date → calendar appears! Range → slider! Color → color picker!

#### Topic 4: Buttons and Form Validation Basics
- Buttons:
  - `<button type="submit">`: Sends the form.
  - `<button type="reset">`: Clears all inputs.
  - `<button type="button">`: Does nothing by default (used later with JavaScript).
- Validation attributes:
  - `required`: Field must be filled.
  - `pattern`: Regular expression for format (e.g., phone number).
  - `min`/`max`: For number/date/range.
  - `minlength`/`maxlength`: For text length.

Example Code: Save as "validation-example.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Form Validation</title>
</head>
<body>
    
    <form action="#" method="POST">
        
        <label for="phone">Phone Number (10 digits):</label><br>
        <input type="text" id="phone" name="phone" pattern="[0-9]{10}" required placeholder="1234567890">
        <!-- pattern forces exactly 10 digits -->
        
        <br><br>
        
        <label for="feedback">Feedback (at least 10 characters):</label><br>
        <textarea id="feedback" name="feedback" required minlength="10"></textarea>
        
        <br><br>
        
        <button type="submit">Submit</button>
        <button type="reset">Clear All</button>
        <button type="button">Custom Button (does nothing yet)</button>
        
    </form>
    
</body>
</html>
```
Try it: Leave fields empty or type short feedback → browser shows error!

### Hands-On Exercises for Day 5
Create "day5-practice.html" and build a complete form:

1. Full page structure.
2. Heading: "Job Application Form".
3. Fieldset "Personal Info": Name (text, required), Email (email, required), Phone (pattern for 10 digits).
4. Fieldset "Preferences":
   - Gender: Radio buttons (Male, Female, Other).
   - Skills: Checkboxes (HTML, CSS, JavaScript, Python).
5. Fieldset "Additional Info":
   - Country: Dropdown (single select).
   - Resume: File upload (accept PDF/images).
   - Cover Letter: Textarea (required, minlength 50).
   - Date Available: Date input.
6. Rating: Range slider "How excited are you? (1-10)".
7. Submit and Reset buttons.
8. Add validation to as many fields as possible.
9. Test the form thoroughly.
10. Make it look organized with labels and spacing.

### Extra: 10 Practice Tasks
Add these to your practice file:

1. Pre-select a radio button: Add `checked` attribute.
2. Pre-check a checkbox: Add `checked`.
3. Pre-select dropdown option: Add `selected` to `<option>`.
4. Group options in dropdown: Use `<optgroup label="Group Name">`.
5. Hidden input: `<input type="hidden" name="form_id" value="123">`.
6. Make textarea resizable or not: Add style="resize: none;".
7. Allow multiple files: `multiple` on file input.
8. Use `step="5"` on number/range for increments.
9. Add `autocomplete="off"` to sensitive fields.
10. Create a quiz form with radio buttons for answers.

Outstanding work completing forms! You now know how to build professional, interactive forms that real websites use. Tomorrow we'll learn semantic HTML and multimedia. Practice by building forms for login, registration, feedback, or surveys. You're a front-end pro in the making! 🚀