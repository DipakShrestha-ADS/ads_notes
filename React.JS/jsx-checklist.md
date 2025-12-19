# JSX Syntax Checklist

1. Component Basics

* Component names must start with Capital Letters

* Return a single root element

* Use camelCase for most props

* Do not call components as normal functions

2. HTML Differences in JSX

* Use className instead of class

* Use htmlFor instead of for

* Attributes use camelCase

3. JavaScript Inside { }

* Wrap JS inside { }

* Expressions only, not statements

* Example: {total + 1}

4. Props & Data Flow

* Props passed like HTML attributes

* Dynamic values use {value}

* Functions passed as references

5. Conditional Rendering

* Use ternary operators

* Use && for single-side rendering

6. Lists & Keys

* Use map() for lists

* Each item must have a unique key

7. Self-Closing Tags

* Use <img />, <input />, etc.

8. Fragments

* Use <>...</> for grouping elements

9. Event Handling

* CamelCase events: onClick, onChange

* Pass function reference, not a call

10. Styling in JSX

* Inline styles use objects

11. Avoid Pitfalls

* Must close every tag

* Avoid mutating state directly

## Optional Mini Cheat-sheet (Quick Recall)

* Components start Capitalized

- JS inside {}

* Use className

- One root element

* Keys for list items

- CamelCase attributes

* Functions passed without calling them

- Inline styles = object

* Conditional rendering: ternary / &&