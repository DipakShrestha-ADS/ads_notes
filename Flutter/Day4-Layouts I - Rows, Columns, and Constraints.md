# Day 4 - Layouts I: Rows, Columns, and Constraints

## What You Will Learn Today

- The one rule behind every Flutter layout: constraints go down, sizes go up, the parent sets the position
- `Row` and `Column`, and how to line things up inside them
- `Expanded`, `Flexible`, and `Spacer` for sharing space
- `Padding`, `SizedBox`, and `Center`
- Rounded corners, borders, and shadows with `BoxDecoration`
- How to use the Widget Inspector in Flutter DevTools
- What an overflow error is and how to fix it
- Dart: `if` and `else`, the ternary operator, and `switch`
- How to build the Campus Store product detail screen

---

## 1. How Flutter Layout Works

Layout in Flutter follows one rule. Once you understand it, most layout problems make sense:

**Constraints go down. Sizes go up. The parent sets the position.**

Think of a parent and a child shopping for a bag:

1. The parent tells the child: "You can choose any bag between 0 and 300 wide, and between 0 and 600 tall." These limits are the constraints.
2. The child picks a size inside those limits, for example 200 wide and 50 tall, and tells the parent.
3. The parent decides where to put the child, for example in the middle.

Every widget does this with its children. A widget can never be bigger than the constraints its parent gives it.

This explains a lot:

- `Container(width: 2000)` on a phone is not 2000 wide. The parent's constraint wins.
- `Center` gives its child loose constraints ("any size up to mine"), then places it in the middle.
- A `Row` with too much content runs out of space and shows an overflow error.

---

## 2. Row and Column

`Column` places its children from top to bottom. `Row` places them from left to right.

```dart
Row(
  children: [
    const Icon(Icons.star),
    const Text('4.5'),
    const Text('(120 reviews)'),
  ],
)
```

### Main axis and cross axis

Each one has two directions:

| | Main axis (the direction it lays out) | Cross axis (the other direction) |
|--|---------------------------------------|----------------------------------|
| `Row` | Left to right | Top to bottom |
| `Column` | Top to bottom | Left to right |

You control the alignment on each axis:

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [...],
)
```

`mainAxisAlignment` options:

| Value | What it does |
|-------|--------------|
| `start` | Children at the start (the default) |
| `center` | Children in the middle |
| `end` | Children at the end |
| `spaceBetween` | First child at the start, last at the end, equal space between |
| `spaceAround` | Equal space around each child, half-size space at the edges |
| `spaceEvenly` | Exactly equal space everywhere, including the edges |

`crossAxisAlignment` options: `start`, `center` (the default), `end`, and `stretch` (fill the whole cross axis).

### mainAxisSize

A `Column` takes all the height it's allowed by default. A `Row` takes all the width. To make it only as big as its children:

```dart
Column(
  mainAxisSize: MainAxisSize.min,
  children: [...],
)
```

---

## 3. Sharing Space: Expanded, Flexible, and Spacer

### Expanded

`Expanded` tells a child of a `Row` or `Column`: "take all the space that's left".

```dart
Row(
  children: [
    const Icon(Icons.location_on),
    const Expanded(child: Text('Kathmandu, Nepal')),
    const Icon(Icons.edit),
  ],
)
```

The two icons take their normal size. The text takes everything in between, and the edit icon is pushed to the far right.

When several children are `Expanded`, they share the space. Use `flex` to share it unevenly:

```dart
Row(
  children: [
    Expanded(flex: 2, child: Container(height: 50, color: Colors.indigo)),
    Expanded(flex: 1, child: Container(height: 50, color: Colors.amber)),
  ],
)
```

The indigo box gets two parts of the width and the amber box gets one part.

### Flexible

`Flexible` is like `Expanded`, but the child is allowed to be smaller than the space it's given.

| | `Expanded` | `Flexible` |
|--|-----------|-----------|
| Takes the leftover space | Always fills all of it | Takes up to that much, can be smaller |
| Good for | Boxes and buttons that should fill space | Text that should only wrap when it's too long |

In practice, `Expanded` is what you need most of the time.

### Spacer

`Spacer` is an empty `Expanded`. It pushes the widgets around it apart:

```dart
Row(
  children: [
    const Text('Total'),
    const Spacer(),
    const Text('Rs. 847.50'),
  ],
)
```

"Total" stays on the left and the amount goes to the far right.

---

## 4. Padding, SizedBox, and Center

```dart
const Padding(
  padding: EdgeInsets.all(16),
  child: Text('Space all around me'),
)
```

`Padding` adds space around one child. You can also use `Container(padding: ...)`, but when padding is all you need, `Padding` is clearer.

`EdgeInsets` options:

| Code | Meaning |
|------|---------|
| `EdgeInsets.all(16)` | 16 on every side |
| `EdgeInsets.symmetric(horizontal: 16, vertical: 8)` | 16 left and right, 8 top and bottom |
| `EdgeInsets.only(left: 16, top: 8)` | Only the sides you name |

`SizedBox` adds a gap (`SizedBox(height: 16)`), or gives a child an exact size:

```dart
SizedBox(
  width: double.infinity,
  child: ElevatedButton(onPressed: () {}, child: const Text('Buy now')),
)
```

This makes the button as wide as the screen allows.

`Center` puts its child in the middle of the available space.

---

## 5. Decorating a Container

`BoxDecoration` gives a `Container` rounded corners, a border, a shadow, or a gradient:

```dart
Container(
  padding: const EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(12),
    border: Border.all(color: Colors.indigo, width: 2),
    boxShadow: const [
      BoxShadow(color: Colors.black26, blurRadius: 8, offset: Offset(0, 4)),
    ],
  ),
  child: const Text('A decorated box'),
)
```

- `borderRadius: BorderRadius.circular(12)` rounds all four corners.
- `border: Border.all(...)` draws a border on every side.
- `boxShadow` adds a soft shadow. `offset: Offset(0, 4)` moves the shadow 4 down, so it looks like the box is lifted off the screen.

One rule to remember: when you use `decoration`, put the colour inside the `BoxDecoration`. A `Container` can't have both `color:` and `decoration:`. If you try, Flutter shows an error.

---

## 6. Seeing the Layout with the Widget Inspector

Flutter DevTools has a tool called the Widget Inspector. It shows you the widget tree of your running app and the size of every widget.

To open it in VS Code:

1. Run your app.
2. Open the Command Palette with `Ctrl + Shift + P` (`Cmd + Shift + P` on Mac).
3. Type "Open DevTools" and choose the Widget Inspector option.

Things to try:

- Turn on "Select Widget Mode", then tap a widget on your phone. The inspector jumps to that widget in the tree.
- Select a `Row` or `Column` to see its children, their sizes, and the alignment settings. You can even change the alignment there and watch the app update.
- When something isn't where you expect, check its size in the inspector. Usually it's bigger or smaller than you thought.

---

## 7. Overflow Errors

An overflow happens when a child is bigger than the space its parent can give it. Flutter shows yellow and black stripes on the edge where it overflows, and prints an error like "A RenderFlex overflowed by 48 pixels on the right."

This is the most common Flutter error, and it's easy to fix once you know why it happens.

### Example: a Row that overflows

```dart
Row(
  children: [
    const Icon(Icons.local_shipping),
    const SizedBox(width: 8),
    const Text('Free delivery inside the college campus for every order above Rs. 1000'),
  ],
)
```

The `Row` tells the `Text` it can be as wide as it likes, so the text stays on one line and runs off the screen.

### Fix 1: Expanded, so the text wraps

```dart
Row(
  children: [
    const Icon(Icons.local_shipping),
    const SizedBox(width: 8),
    const Expanded(
      child: Text('Free delivery inside the college campus for every order above Rs. 1000'),
    ),
  ],
)
```

`Expanded` limits the text to the space left in the row, so it wraps onto more lines.

### Fix 2: Expanded with one line and "..."

```dart
const Expanded(
  child: Text(
    'Free delivery inside the college campus for every order above Rs. 1000',
    maxLines: 1,
    overflow: TextOverflow.ellipsis,
  ),
)
```

The text stays on one line and ends with "..." where it's cut. This is good for product names in a list.

### Fix 3: Make the content fit

Sometimes the simplest fix is shorter text, a smaller font, or less padding:

```dart
const Text('Free campus delivery over Rs. 1000')
```

When you see an overflow, ask: "Which widget is too big, and what limit should it have?" Then use the Widget Inspector to check.

---

## 8. Dart Spotlight: if and else

`if` runs code only when a condition is `true`:

```dart
int marks = 78;
String result;

if (marks >= 40) {
  result = 'Pass';
} else {
  result = 'Fail';
}
```

You can check more than two cases with `else if`:

```dart
String remark;

if (marks >= 80) {
  remark = 'Excellent';
} else if (marks >= 60) {
  remark = 'Good';
} else if (marks >= 40) {
  remark = 'Pass';
} else {
  remark = 'Needs more practice';
}
```

Dart checks the conditions from top to bottom and runs the first one that is true.

---

## 9. Dart Spotlight: The Ternary Operator

The ternary operator is a short `if` and `else` that gives back a value:

```dart
condition ? valueIfTrue : valueIfFalse
```

```dart
String stockText = stock > 0 ? 'In stock' : 'Out of stock';
```

You can't put an `if` statement in the middle of a widget's parameters, but you can put a ternary there. That's why Flutter code uses it a lot:

```dart
Text(
  stock > 0 ? 'In stock' : 'Out of stock',
  style: TextStyle(color: stock > 0 ? Colors.green : Colors.red),
)
```

Keep ternaries short. If you need more than two choices, use `if` before the `return`, or a `switch`.

---

## 10. Dart Spotlight: switch

### The switch statement

`switch` checks one value against several cases:

```dart
int dayOfWeek = 7;
String dayMessage;

switch (dayOfWeek) {
  case 7:
    dayMessage = 'Saturday, no classes today';
  case 1:
    dayMessage = 'Sunday, a new week starts';
  default:
    dayMessage = 'A normal class day';
}
```

- Each `case` is a value to compare with.
- `default` runs when no case matches.
- In Dart, a case doesn't fall through into the next one, so you don't need `break`.

### The switch expression

Dart 3 added the switch expression. Like the ternary, it gives back a value, so you can use it directly in a variable or a widget:

```dart
String category = 'Stationery';

IconData categoryIcon = switch (category) {
  'Books' => Icons.menu_book,
  'Stationery' => Icons.edit,
  'Clothing' => Icons.checkroom,
  _ => Icons.shopping_bag,
};
```

- Each line is `value => result`.
- `_` means "anything else", like `default`.
- The whole `switch` ends with `};` because it's one expression.

You can match more than one value in a case with `||`:

```dart
String grade = switch (marks ~/ 10) {
  10 || 9 => 'A+',
  8 => 'A',
  7 => 'B+',
  6 => 'B',
  5 || 4 => 'C',
  _ => 'Fail',
};
```

`marks ~/ 10` turns 78 into 7, using the `~/` operator from Day 2, so a mark of 78 gets `B+`.

---

## 11. Dart Lab: Today's Cards

Open `about_me/lib/dart_lab_screen.dart`.

### Step 1 - Add the Day 4 variables

Add these lines inside `build`, below the Day 3 variables:

```dart
    // Day 4: if, ternary, and switch
    int marks = 78;
    String result;
    if (marks >= 40) {
      result = 'Pass';
    } else {
      result = 'Fail';
    }
    final String grade = switch (marks ~/ 10) {
      10 || 9 => 'A+',
      8 => 'A',
      7 => 'B+',
      6 => 'B',
      5 || 4 => 'C',
      _ => 'Fail',
    };
    int dayOfWeek = 7;
    String dayMessage;
    switch (dayOfWeek) {
      case 7:
        dayMessage = 'Saturday, no classes today';
      case 1:
        dayMessage = 'Sunday, a new week starts';
      default:
        dayMessage = 'A normal class day';
    }
```

### Step 2 - Add the cards

Add these lines inside `results`:

```dart
      'Result (if/else)': result,
      'Grade (switch expression)': grade,
      'Remark (ternary)': marks >= 80 ? 'Distinction' : 'Keep going',
      'Today (switch statement)': dayMessage,
```

### Step 3 - Check the results

```
Result (if/else)            Pass
Grade (switch expression)   B+
Remark (ternary)            Keep going
Today (switch statement)    Saturday, no classes today
```

Change `marks` to `92`, then to `35`, and watch three cards change. Change `dayOfWeek` to `3`.

---

## 12. Class Project: The Product Detail Screen

Today we build the screen a shopper sees after tapping a product.

### What we are building

```
+----------------------------------+
| <  Product details               |
+----------------------------------+
|  [ product image, round corners ]|
|                                  |
|  Campus Notebook      Rs. 250.00 |
|  (icon) Stationery     In stock  |
|                                  |
|  Description                     |
|  A 200-page ruled notebook ...   |
|                                  |
|  (icon) Free delivery on campus..|
|                                  |
|  [ Add to wishlist ] [ Buy now ] |
+----------------------------------+
```

Before you code, draw the widget tree on paper. The main parts are a `Column` with: the image, a `Row` for name and price, a `Row` for category and stock, the description, a delivery `Row`, and a `Row` of buttons at the bottom.

### Step 1 - Create the screen

Create `lib/screens/product_detail_screen.dart`:

```dart
import 'package:flutter/material.dart';

class ProductDetailScreen extends StatelessWidget {
  const ProductDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // On Day 9 these values will come from a Product object
    String name = 'Campus Notebook';
    double price = 250;
    String category = 'Stationery';
    int stock = 12;
    String description =
        'A 200-page ruled notebook with a hard cover. Good for lecture notes, '
        'lab records, and daily planning.';
    String imageUrl = 'https://placehold.co/600x400/png?text=Campus+Notebook';

    final bool inStock = stock > 0;

    final IconData categoryIcon = switch (category) {
      'Books' => Icons.menu_book,
      'Stationery' => Icons.edit,
      'Clothing' => Icons.checkroom,
      _ => Icons.shopping_bag,
    };

    String deliveryText;
    if (price >= 1000) {
      deliveryText = 'Free delivery on campus';
    } else {
      deliveryText = 'Free delivery on campus for orders above Rs. 1000';
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Product details')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 220,
              width: double.infinity,
              clipBehavior: Clip.antiAlias,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Image.network(imageUrl, fit: BoxFit.cover),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Text(
                    name,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Text(
                  'Rs. ${price.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.indigo,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(categoryIcon, size: 18, color: Colors.grey),
                const SizedBox(width: 4),
                Text(category, style: const TextStyle(color: Colors.grey)),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: inStock ? Colors.green.shade100 : Colors.red.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    inStock ? 'In stock' : 'Out of stock',
                    style: TextStyle(
                      color: inStock ? Colors.green.shade800 : Colors.red.shade800,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Text(
              'Description',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(description),
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(Icons.local_shipping, color: Colors.indigo),
                const SizedBox(width: 8),
                Expanded(child: Text(deliveryText)),
              ],
            ),
            const Spacer(),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {},
                    child: const Text('Add to wishlist'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: inStock ? () {} : null,
                    child: const Text('Buy now'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```

### What each part does

- `final bool inStock = stock > 0;` works out once whether the product is in stock. The rest of the screen uses `inStock` instead of repeating `stock > 0`.
- The `switch` expression picks an icon for the category.
- The `if` and `else` picks the delivery message before the `return`.
- The image sits in a `Container` with `borderRadius` and `clipBehavior: Clip.antiAlias`. The clip cuts the image to the rounded corners.
- The name and price `Row` uses `Expanded` on the name. A long name wraps instead of pushing the price off the screen.
- The category `Row` uses `Spacer` to push the stock badge to the right.
- The stock badge uses ternaries for its colour and text.
- The delivery `Row` uses `Expanded` so the long message wraps instead of overflowing.
- `const Spacer()` inside the `Column` pushes the buttons to the bottom of the screen.
- Both buttons are in `Expanded`, so they share the width equally.
- `onPressed: inStock ? () {} : null` disables the "Buy now" button when the product is out of stock. A button with `onPressed: null` is shown greyed out and can't be tapped.

### Step 2 - Show the screen

We learn how to move between screens on Day 10. For now, open `lib/main.dart` and change the first screen:

```dart
import 'screens/product_detail_screen.dart';
```

```dart
home: const ProductDetailScreen(),
```

Run the app and check the detail screen. When you're done, you can switch `home:` back to `HomeScreen()`.

### Step 3 - Test it

1. Change `stock` to `0`. The badge turns red and says "Out of stock", and "Buy now" is greyed out.
2. Change `price` to `1500`. The delivery message changes.
3. Change `category` to `'Books'`, then `'Toys'`. Watch the icon change.
4. Change `name` to a very long name. It wraps, and the price stays in place.
5. Open the Widget Inspector and select the category `Row`. See how much space the `Spacer` takes.

---

## Summary

Here is what you covered today:

- Constraints go down, sizes go up, and the parent sets the position. A widget can't be bigger than its parent allows.
- `Row` lays out left to right and `Column` top to bottom. `mainAxisAlignment` controls the main axis and `crossAxisAlignment` the other one.
- `Expanded` fills the leftover space, `flex` shares it unevenly, `Flexible` may be smaller, and `Spacer` pushes widgets apart.
- `Padding` adds space around a child, `SizedBox` adds gaps or fixed sizes, and `Center` centres its child.
- `BoxDecoration` adds colour, rounded corners, borders, and shadows. Put the colour inside the decoration, not on the `Container`.
- The Widget Inspector shows the widget tree and the size of every widget.
- An overflow means a child is bigger than its space. Fix it with `Expanded`, `maxLines` with `ellipsis`, or smaller content.
- `if` and `else` choose between blocks of code, the ternary `a ? b : c` chooses between two values, and `switch` handles many cases.
- A switch expression gives back a value and uses `_` for "anything else".

---

## Practice Tasks

1. In the Campus Store detail screen, change the buttons `Row` to `mainAxisAlignment: MainAxisAlignment.spaceEvenly` and remove the `Expanded` widgets. What changes?
2. Create the overflow example from section 7 in your `about_me` project, then fix it all three ways.
3. Recreate this login screen in a new screen file in your `about_me` project. Use only the widgets from Days 2 to 4. You don't need real text fields yet, so use decorated `Container`s with grey text as placeholders.

```
+----------------------------------+
|                                  |
|          (app logo icon)         |
|          Welcome back            |
|     Log in to Campus Store       |
|                                  |
|  +----------------------------+  |
|  | (mail icon) Email          |  |
|  +----------------------------+  |
|  +----------------------------+  |
|  | (lock icon) Password       |  |
|  +----------------------------+  |
|                 Forgot password? |
|                                  |
|  [          Log in            ]  |
|                                  |
|   Don't have an account? Sign up |
+----------------------------------+
```

---

## Homework

### Core

Recreate this settings screen in your `about_me` project, using only `Row`, `Column`, `Padding`, `SizedBox`, `Expanded`, `Spacer`, `Icon`, `Text`, and decorated `Container`s:

```
+----------------------------------+
| Settings                         |
+----------------------------------+
|  (avatar)  Asha Sharma           |
|            asha@example.com    > |
|                                  |
|  ACCOUNT                         |
|  (icon) Edit profile           > |
|  (icon) Change password        > |
|                                  |
|  PREFERENCES                     |
|  (icon) Notifications       On   |
|  (icon) Language       English > |
|                                  |
|  (icon) Log out  (in red)        |
+----------------------------------+
```

Add 3 Dart Lab cards of your own: one using `if` and `else`, one using a ternary, and one using a `switch` expression.

Commit and push:

```bash
git add .
git commit -m "day-04: settings layout and control flow cards"
git push
```

### Challenge

Build a calculator keypad: 4 rows of 4 buttons (7 8 9 /, 4 5 6 *, 1 2 3 -, 0 . = +), where every button is exactly the same size and the keypad fills the screen width. Use `Expanded` inside each `Row`. Make the `=` button a different colour.

---

## Class Project - Level 4

### Story So Far

The Campus Store home screen shows three reusable product cards. Today it gets its first proper layout: the product detail screen.

### Today's Project Level

| Action | Path from `campus_store/` | Why |
|--------|---------------------------|-----|
| Create | `lib/screens/product_detail_screen.dart` | The full product detail layout |
| Update | `lib/main.dart` | Temporarily show the detail screen first, to test it |

### Completed Level

```text
campus_store/
  lib/
    main.dart
    screens/
      home_screen.dart
      product_detail_screen.dart
    widgets/
      primary_button.dart
      product_card.dart
  pubspec.yaml
```

Completion checklist:

- The detail screen shows the rounded image, name and price on one line, category and stock badge, description, delivery message, and two buttons at the bottom.
- Setting `stock` to `0` turns the badge red and disables "Buy now".
- A very long product name wraps without an overflow error.
- Your Dart Lab has the 4 new Day 4 cards.
- You can explain "constraints go down, sizes go up, the parent sets the position" in your own words.

### Next Level

Rows and columns can build most screens, but not all of them. How do you put a "SALE" badge on top of an image, or let chips flow onto a new line when they run out of space? Tomorrow you learn `Stack`, `Wrap`, and scrolling, plus loops and the special `if` and `for` you can write inside a list of widgets. Continue with [Day 5](<Day5-Layouts II - Stack, Wrap, and Scrolling.md>).
