### Day 3: HTML Lists and Tables

Welcome to Day 3! You're doing awesome so far. By now, you know how to create a proper HTML page, add headings, paragraphs, formatted text, and even break lines. Today, we'll learn two super important ways to organize information: **Lists** and **Tables**.

Think of lists like a shopping list or steps in a recipe—they make things easy to read. Tables are like spreadsheets—they organize data in rows and columns, perfect for schedules, comparisons, or scores.

We'll explain everything in simple words with clear, commented code examples. Save each example as a file (like "day3-lists.html") and open it in your browser to see how it looks.

#### Topic 1: Lists in HTML
HTML has three main types of lists:
- **Unordered List (`<ul>`)**: Bullet points (•). Great for items where order doesn't matter, like a grocery list.
- **Ordered List (`<ol>`)**: Numbered (1, 2, 3...). Great for steps or rankings.
- **Definition List (`<dl>`)**: For terms and their definitions (like a dictionary).

Each list uses **list items** with the `<li>` tag.

Why lists are important: They make content organized and easy to scan. Search engines also love them!

##### Example 1: Unordered List (`<ul>`)
Save as "unordered-list.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Unordered List Example</title>
</head>
<body>
    
    <h1>My Shopping List</h1>
    
    <ul>  <!-- Unordered list starts here (bullet points) -->
        <li>Milk</li>             <!-- Each item is in <li> -->
        <li>Bread</li>
        <li>Eggs</li>
        <li>Butter</li>
        <li>Fruits</li>
    </ul>
    <!-- The browser automatically adds bullet points -->
    
    <p>You can change bullet style later with CSS (circles, squares, etc.)!</p>
    
</body>
</html>
```
What you'll see: A heading and a list with round bullet points.

##### Example 2: Ordered List (`<ol>`)
Save as "ordered-list.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Ordered List Example</title>
</head>
<body>
    
    <h1>How to Make Tea (Step by Step)</h1>
    
    <ol>  <!-- Ordered list starts here (numbers) -->
        <li>Boil water in a kettle.</li>
        <li>Put a tea bag in a cup.</li>
        <li>Pour hot water into the cup.</li>
        <li>Wait 2-3 minutes.</li>
        <li>Add milk or sugar if you like.</li>
        <li>Stir and enjoy!</li>
    </ol>
    <!-- Numbers appear automatically -->
    
</body>
</html>
```
What you'll see: A numbered step-by-step guide.

##### Example 3: Nested Lists (Lists Inside Lists)
You can put a list inside another list for sub-items!

Save as "nested-lists.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Nested Lists Example</title>
</head>
<body>
    
    <h1>My Weekly Meal Plan</h1>
    
    <ul>  <!-- Main unordered list -->
        <li>Monday
            <ol>  <!-- Sub-list: ordered for steps -->
                <li>Breakfast: Oatmeal</li>
                <li>Lunch: Salad</li>
                <li>Dinner: Pasta</li>
            </ol>
        </li>
        <li>Tuesday
            <ul>  <!-- Sub-list: unordered for ingredients -->
                <li>Eggs</li>
                <li>Toast</li>
                <li>Juice</li>
            </ul>
        </li>
        <li>Wednesday
            <ol>
                <li>Yoga</li>
                <li>Work</li>
                <li>Read a book</li>
            </ol>
        </li>
    </ul>
    
</body>
</html>
```
What you'll see: Indented sub-lists with different styles.

##### Example 4: Definition List (`<dl>`)
Save as "definition-list.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Definition List Example</title>
</head>
<body>
    
    <h1>Web Development Terms</h1>
    
    <dl>  <!-- Definition list -->
        <dt>HTML</dt>                  <!-- <dt> = Definition Term -->
        <dd>HyperText Markup Language - the structure of web pages.</dd>  <!-- <dd> = Definition Description -->
        
        <dt>CSS</dt>
        <dd>Cascading Style Sheets - makes websites beautiful.</dd>
        
        <dt>JavaScript</dt>
        <dd>A programming language that adds interactivity.</dd>
    </dl>
    
</body>
</html>
```
What you'll see: Terms on the left, descriptions indented below.

#### Topic 2: Tables in HTML
Tables organize data in rows and columns. Use them for real data (like timetables), not for page layout (we'll use CSS for layout later).

Main table tags:
- `<table>`: The whole table.
- `<tr>`: Table row.
- `<th>`: Table header (bold and centered by default).
- `<td>`: Table data/cell.
- Optional: `<thead>`, `<tbody>`, `<tfoot>` for grouping.

Attributes:
- `rowspan`: Cell spans multiple rows.
- `colspan`: Cell spans multiple columns.
- `border`: Adds borders (we'll style properly with CSS later).

##### Example 1: Basic Table
Save as "basic-table.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Basic Table Example</title>
</head>
<body>
    
    <h1>Class Schedule</h1>
    
    <table border="1">  <!-- border="1" adds visible borders for learning -->
        <tr>  <!-- First row: headers -->
            <th>Day</th>       <!-- Table header -->
            <th>Subject</th>
            <th>Time</th>
        </tr>
        
        <tr>  <!-- Second row: data -->
            <td>Monday</td>    <!-- Table data -->
            <td>Math</td>
            <td>9:00 AM</td>
        </tr>
        
        <tr>  <!-- Third row -->
            <td>Tuesday</td>
            <td>Science</td>
            <td>10:00 AM</td>
        </tr>
        
        <tr>
            <td>Wednesday</td>
            <td>English</td>
            <td>11:00 AM</td>
        </tr>
    </table>
    
</body>
</html>
```
What you'll see: A clean table with headers and data.

##### Example 2: Table with rowspan and colspan
Save as "advanced-table.html"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Advanced Table Example</title>
</head>
<body>
    
    <h1>Student Scores</h1>
    
    <table border="1">
        <tr>
            <th rowspan="2">Name</th>      <!-- Spans 2 rows -->
            <th colspan="3">Subjects</th>  <!-- Spans 3 columns -->
        </tr>
        <tr>
            <th>Math</th>
            <th>Science</th>
            <th>English</th>
        </tr>
        
        <tr>
            <td>Alice</td>
            <td>95</td>
            <td>88</td>
            <td>92</td>
        </tr>
        
        <tr>
            <td>Bob</td>
            <td>87</td>
            <td>91</td>
            <td>85</td>
        </tr>
    </table>
    
</body>
</html>
```
What you'll see: A merged header row and a name column.

#### Topic 3: Nesting Elements
You can put almost anything inside lists or tables—like links, images, or even other lists/tables!

Example: Table with links and nested list
```html
<table border="1">
    <tr>
        <th>Website</th>
        <th>Link</th>
        <th>Features</th>
    </tr>
    <tr>
        <td>Google</td>
        <td><a href="https://google.com">Visit</a></td>
        <td>
            <ul>
                <li>Search Engine</li>
                <li  <!-- Nested list inside table cell -->
                <li>Maps</li>
                <li>Email</li>
            </ul>
        </td>
    </tr>
</table>
```

### Hands-On Exercises for Day 3
Create a file called "day3-practice.html" and complete these:

1. Create a full HTML page with proper structure.
2. Add a heading: "My Top 5 Favorite Movies" → Use an **ordered list** (`<ol>`).
3. Add a heading: "Ingredients for Pancakes" → Use an **unordered list** with nested list for steps.
4. Add a heading: "Glossary" → Use a **definition list** with 3 web terms.
5. Add a heading: "My Weekly Timetable" → Create a table with days and activities.
6. Add a heading: "Exam Results" → Make a table with student names and scores (use `colspan` for a title row).
7. Add a nested list inside a table cell (e.g., subjects under each day).
8. Add links inside list items (e.g., movie titles link to IMDb).
9. Add an image inside a table cell.
10. Combine everything into one beautiful page!

### Extra: 10 Practice Tasks with List and Table Features
Add these one by one to your practice file:

1. Change ordered list type: `<ol type="A">` (A, B, C...) or `type="i"` (i, ii, iii).
2. Start numbering from 10: `<ol start="10">`.
3. Reversed order: `<ol reversed>`.
4. Add caption to table: `<caption>Student Grades - 2025</caption>` (put right after `<table>`).
5. Group table sections: Use `<thead>`, `<tbody>`, `<tfoot>`.
6. Add background color with inline style: `<td style="background: lightyellow;">`.
7. Table inside a list item: Put a small table inside `<li>`.
8. List inside table header: Put a short list in `<th>`.
9. Nested definition list.
10. A complex nested structure: Ordered list → unordered sub-list → another ordered sub-sub-list.

Fantastic job on Day 3! Lists and tables are used everywhere on the web. Tomorrow we'll start learning about forms—how users can input data. Keep practicing by making your own lists and tables (like your favorite games, family members, or school subjects). You're building real web skills! 🎉