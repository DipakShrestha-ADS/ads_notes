# JSX Syntax Checklist

1. Component Basics

- [x] Component names must start with Capital Letters

- [x] Return a single root element

- [x] Use camelCase for most props

- [x] Do not call components as normal functions

2. HTML Differences in JSX

- [x] Use className instead of class

- [x] Use htmlFor instead of for

- [x] Attributes use camelCase

3. JavaScript Inside { }

- [x] Wrap JS inside { }

- [x] Expressions only, not statements

- [x] Example: {total + 1}

4. Props & Data Flow

- [x] Props passed like HTML attributes

- [x] Dynamic values use {value}

- [x] Functions passed as references

5. Conditional Rendering

- [x] Use ternary operators

- [x] Use && for single-side rendering

6. Lists & Keys

- [x] Use map() for lists

- [x] Each item must have a unique key

7. Self-Closing Tags

- [x] Use <img />, <input />, etc.

8. Fragments

- [x] Use <>...</> for grouping elements

9. Event Handling

- [x] CamelCase events: onClick, onChange

- [x] Pass function reference, not a call

10. Styling in JSX

- [x] Inline styles use objects

11. Avoid Pitfalls

- [x] Must close every tag

- [x] Avoid mutating state directly

## Optional Mini Cheat-sheet (Quick Recall)

- [x] Components start Capitalized

- [x] JS inside {}

- [x] Use className

- [x] One root element

- [x] Keys for list items

- [x] CamelCase attributes

- [x] Functions passed without calling them

- [x] Inline styles = object

- [x] Conditional rendering: ternary / &&