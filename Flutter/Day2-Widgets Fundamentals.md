# Day 2 - Widgets Fundamentals

## What You Will Learn Today

- What a widget is and how widgets form a tree
- How a `StatelessWidget` is put together
- What `MaterialApp`, `Scaffold`, `AppBar`, and `FloatingActionButton` do
- The basic widgets: `Text`, `Icon`, `Image`, `Container`, and `SizedBox`
- The four common buttons
- Why Flutter code has `const` everywhere
- Dart: `var`, `final`, `const`, type inference, `dynamic`, and `Object`
- Dart: arithmetic, comparison, and logical operators
- Dart: turning numbers into text with `toString()` and `toStringAsFixed()`
- How to start the Campus Store app

---

## 1. Everything Is a Widget

Yesterday you saw that a Flutter screen is made of widgets. Today we look at this properly.

A widget is a description of one piece of the screen. Some widgets are things you can see:

- `Text` shows text
- `Icon` shows an icon
- `Image` shows a picture
- `ElevatedButton` shows a button

Other widgets are invisible and only arrange or style things:

- `Column` places widgets one below another
- `Row` places widgets side by side
- `SizedBox` adds empty space
- `Center` puts its child in the middle

You build a screen by putting widgets inside other widgets. Think of a set of boxes. The big box is the app. Inside it is a screen. Inside the screen is a column. Inside the column are some texts and a button.

---

## 2. The Widget Tree

When widgets sit inside other widgets, they form a tree. Here is the tree for the screen we build today:

```
MaterialApp
  Scaffold
    AppBar
      Text: "Campus Store"
      IconButton (cart)
    Container (padding)
      Column
        Text: "Featured product"
        Image
        Text: "Campus Notebook"
        Text: "Rs. 250.00"
        ElevatedButton
          Text: "Buy now"
    FloatingActionButton
```

A few words you will hear a lot:

- The widget that holds another widget is its parent.
- The widget inside is its child.
- Some widgets take one `child`, like `Center` and `Container`.
- Some widgets take a list of `children`, like `Column` and `Row`.

Tip: before you code a screen, draw its widget tree on paper. It makes the code much easier to write.

---

## 3. Inside a StatelessWidget

Every screen and every custom widget you write is a class. Here is the simplest kind, a `StatelessWidget`:

```dart
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Text('Hello');
  }
}
```

Line by line:

- `class HomeScreen` creates a new widget called `HomeScreen`. Widget names start with a capital letter.
- `extends StatelessWidget` means our widget is a kind of `StatelessWidget`. Stateless means it doesn't change by itself once it's shown. (On Day 7 you learn `StatefulWidget`, which can change.)
- `const HomeScreen({super.key});` is the constructor. It lets you create the widget with `const HomeScreen()`. You will understand every part of this line by Day 9. For now, copy this pattern for every widget.
- `@override` tells Dart we are replacing a method that `StatelessWidget` already has.
- `Widget build(BuildContext context)` is the most important method. Flutter calls it whenever it needs to draw this widget. Whatever widget you `return` is what appears on screen.

In VS Code, type `stless` and press Enter. VS Code writes this whole pattern for you, and you only type the name.

---

## 4. MaterialApp, Scaffold, AppBar, and FloatingActionButton

These four widgets give you a normal app screen.

### MaterialApp

`MaterialApp` is the root of almost every Flutter app. It sets up things the whole app needs: the title, the colours, and which screen to show first.

```dart
MaterialApp(
  title: 'Campus Store',
  debugShowCheckedModeBanner: false,
  theme: ThemeData(colorSchemeSeed: Colors.indigo),
  home: const HomeScreen(),
)
```

- `title` is the app name the phone uses in the recent apps list.
- `debugShowCheckedModeBanner: false` hides the "DEBUG" ribbon.
- `theme` sets the colours. `colorSchemeSeed` builds a full colour set from one colour.
- `home` is the first screen.

### Scaffold

`Scaffold` is the frame of one screen. It has ready-made places for the common parts:

```dart
Scaffold(
  appBar: AppBar(title: const Text('Campus Store')),
  body: const Center(child: Text('Welcome')),
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: const Icon(Icons.chat),
  ),
)
```

- `appBar` is the bar at the top.
- `body` is the main area of the screen.
- `floatingActionButton` is the round button in the bottom corner.

### AppBar

```dart
AppBar(
  title: const Text('Campus Store'),
  actions: [
    IconButton(
      onPressed: () {},
      icon: const Icon(Icons.shopping_cart_outlined),
    ),
  ],
)
```

- `title` is the text in the bar.
- `actions` is a list of widgets on the right side, usually icon buttons.

You will see `onPressed: () {}` often today. It means "when tapped, do nothing yet". Tomorrow you learn exactly what `() {}` is.

---

## 5. Basic Widgets

### Text and TextStyle

```dart
const Text(
  'Campus Notebook',
  style: TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: Colors.indigo,
  ),
)
```

`style` controls how the text looks. The most common settings are `fontSize`, `fontWeight`, and `color`.

### Icon

```dart
const Icon(Icons.favorite, color: Colors.red, size: 32)
```

Flutter comes with thousands of Material icons. To find one, search "Material icons" online or type `Icons.` in VS Code and look through the suggestions.

### Image.network

```dart
Image.network(
  'https://placehold.co/600x400/png?text=Campus+Notebook',
  height: 200,
  width: double.infinity,
  fit: BoxFit.cover,
)
```

- The first value is the image link.
- `height` and `width` set the size. `double.infinity` means "as wide as the parent allows".
- `fit: BoxFit.cover` fills the space without stretching the picture, cutting the edges if needed.

`Image.network` needs internet. On Day 6 you learn to use images stored inside the app with `Image.asset`.

### Container

`Container` is a box. You can give it a size, a colour, padding, and margin.

```dart
Container(
  width: 200,
  padding: const EdgeInsets.all(16),
  margin: const EdgeInsets.all(8),
  color: Colors.amber,
  child: const Text('I am inside a box'),
)
```

- `padding` is space inside the box, between the edge and the child.
- `margin` is space outside the box, between it and other widgets.
- `EdgeInsets.all(16)` means 16 on every side. `EdgeInsets.symmetric(horizontal: 16, vertical: 8)` sets the sides and the top and bottom separately.

On Day 4 you learn to add rounded corners, borders, and shadows to a `Container`.

### SizedBox

`SizedBox` is the easiest way to add space between widgets:

```dart
const SizedBox(height: 16)   // 16 of empty space, top to bottom
const SizedBox(width: 8)     // 8 of empty space, left to right
```

### Column and Row (a first look)

You already used `Column` yesterday. `Column` puts its children one below another. `Row` puts them side by side. You learn all their options on Day 4.

```dart
Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    const Text('First'),
    const Text('Second'),
  ],
)
```

`crossAxisAlignment: CrossAxisAlignment.start` lines the children up on the left instead of in the middle.

---

## 6. Buttons

| Button | Looks like | Use it for |
|--------|-----------|------------|
| `ElevatedButton` | Filled button with a slight shadow | The main action on a screen, like "Buy now" |
| `OutlinedButton` | Button with a border, no fill | A second action, like "Add to wishlist" |
| `TextButton` | Just text, no border | Small actions, like "Cancel" or "See all" |
| `IconButton` | Just an icon | Actions in the app bar, like the cart |

```dart
ElevatedButton(onPressed: () {}, child: const Text('Buy now'))
OutlinedButton(onPressed: () {}, child: const Text('Add to wishlist'))
TextButton(onPressed: () {}, child: const Text('See all'))
IconButton(onPressed: () {}, icon: const Icon(Icons.share))
```

Every button needs `onPressed`, which says what happens when it's tapped. The first three take a `child` (usually a `Text`). `IconButton` takes an `icon`.

---

## 7. Dart Spotlight: var, final, and const

You already know `var` and typed variables from Day 1. Dart has two more ways to make a variable: `final` and `const`.

```dart
var city = 'Kathmandu';       // can change later
city = 'Pokhara';             // allowed

final String course = 'Flutter';   // set once, can't change
// course = 'React';          // error

const double vatRate = 0.13;  // a fixed value known before the app runs
// vatRate = 0.15;            // error
```

| Keyword | Can change? | When is the value decided? | Use it for |
|---------|-------------|----------------------------|------------|
| `var` or a type | Yes | Any time | Values that change, like a counter |
| `final` | No | When the app runs | Values decided while the app runs, like the current time |
| `const` | No | Before the app runs | Fixed values, like a tax rate or a title |

The difference between `final` and `const` is when Dart knows the value:

```dart
final now = DateTime.now();     // fine: the time is known when this line runs
// const now = DateTime.now();  // error: Dart can't know the time in advance
```

A simple rule: use `const` when you can, `final` when you can't, and `var` only when the value really needs to change.

### Why Flutter code has const everywhere

Widgets can be `const` too:

```dart
const Text('Campus Store')
```

A `const` widget is created once and reused. Flutter knows it can never change, so it can skip rebuilding it. This makes your app faster.

When a widget could be `const` but isn't, VS Code shows a blue underline with the message "Use 'const' with the constructor". Click the light bulb, or press `Ctrl + .` (`Cmd + .` on Mac), and choose "Add 'const' modifier".

A widget can only be `const` if everything inside it is fixed. `Text('Hi $name')` can't be `const` when `name` is a normal variable.

### Type inference, dynamic, and Object

When you write `var city = 'Kathmandu';`, Dart sees the text and decides `city` is a `String`. This is called type inference. The type is still fixed: you can't put a number in `city` later.

`dynamic` turns type checking off:

```dart
dynamic anything = 'hello';
anything = 42;   // allowed, but Dart can no longer catch your mistakes
```

`Object` can also hold any value, but Dart still checks how you use it. You will rarely need either one. Prefer real types like `String` and `int`, because then Dart catches mistakes before you run the app.

---

## 8. Dart Spotlight: Operators

### Arithmetic

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| `+` | Add | `7 + 2` | `9` |
| `-` | Subtract | `7 - 2` | `5` |
| `*` | Multiply | `7 * 2` | `14` |
| `/` | Divide (always gives a `double`) | `7 / 2` | `3.5` |
| `~/` | Divide and drop the decimal part | `7 ~/ 2` | `3` |
| `%` | Remainder after dividing | `7 % 2` | `1` |

`~/` and `%` are very useful. For example, 130 minutes is `130 ~/ 60` hours (2) and `130 % 60` minutes (10).

### Comparison

These always give a `bool` (`true` or `false`):

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| `==` | Equal to | `5 == 5` | `true` |
| `!=` | Not equal to | `5 != 3` | `true` |
| `>` | Greater than | `5 > 3` | `true` |
| `<` | Less than | `5 < 3` | `false` |
| `>=` | Greater than or equal to | `5 >= 5` | `true` |
| `<=` | Less than or equal to | `5 <= 3` | `false` |

### Logical

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| `&&` | And: both must be true | `true && false` | `false` |
| `\|\|` | Or: at least one must be true | `true \|\| false` | `true` |
| `!` | Not: flips the value | `!true` | `false` |

### Shortcuts for changing a variable

```dart
int stock = 10;
stock++;      // add 1, now 11
stock--;      // subtract 1, now 10
stock += 5;   // add 5, now 15
stock -= 3;   // subtract 3, now 12
stock *= 2;   // multiply by 2, now 24
```

---

## 9. Dart Spotlight: Numbers as Text

To show a number on screen, it has to become text. Interpolation does this for you:

```dart
double price = 250;
Text('Rs. $price')   // shows: Rs. 250.0
```

`Rs. 250.0` doesn't look like a price. `toStringAsFixed()` fixes the number of decimal places:

```dart
price.toStringAsFixed(2)   // '250.00'
price.toStringAsFixed(0)   // '250'
```

`toString()` turns any value into text:

```dart
int age = 20;
String ageText = age.toString();   // '20'
```

---

## 10. Dart Lab: Today's Cards

Open your `about_me` project and then `lib/dart_lab_screen.dart`.

### Step 1 - Add the Day 2 variables

Add these lines below the Day 1 variables (below `bool isStudent = true;`):

```dart
    // Day 2: final, const, and operators
    const double vatRate = 0.13;
    int quantity = 3;
    double unitPrice = 250;
    final double subtotal = unitPrice * quantity;
    final double vat = subtotal * vatRate;
    final double total = subtotal + vat;
    int stock = 10;
    stock -= 3;
    stock++;
```

### Step 2 - Add the Day 2 cards

Add these lines inside `results`, below your Day 1 cards:

```dart
      'Subtotal': 'Rs. ${subtotal.toStringAsFixed(2)}',
      'VAT (13%)': 'Rs. ${vat.toStringAsFixed(2)}',
      'Total': 'Rs. ${total.toStringAsFixed(2)}',
      '7 / 2': '${7 / 2}',
      '7 ~/ 2': '${7 ~/ 2}',
      '7 % 2': '${7 % 2}',
      'Is adult?': '${age >= 18}',
      'Student and adult?': '${isStudent && age >= 18}',
      'Stock left': '$stock',
```

### Step 3 - Check the results

Save and open the Dart Lab. You should see:

```
Subtotal             Rs. 750.00
VAT (13%)            Rs. 97.50
Total                Rs. 847.50
7 / 2                3.5
7 ~/ 2               3
7 % 2                1
Is adult?            true
Student and adult?   true
Stock left           8
```

Notice how `subtotal`, `vat`, and `total` are `final`. They are worked out when the screen is built, and they never change after that. `vatRate` is `const` because 13% is fixed.

Try changing `quantity` to `5` and save. Every card that depends on it updates.

---

## 11. Starting the Campus Store App

The Campus Store is the app we build together for the rest of the course. By the end, it will have products from a real API, a cart, login, and a release build you can install on any phone.

### Step 1 - Create the project

In your `flutter-course` folder (not inside `about_me`), run:

```bash
flutter create campus_store
cd campus_store
code .
```

### Step 2 - Clean up the demo

1. Delete `test/widget_test.dart`, like yesterday.
2. Create a folder `lib/screens`.

### Step 3 - Write main.dart

Replace everything in `lib/main.dart` with:

```dart
import 'package:flutter/material.dart';

import 'screens/home_screen.dart';

void main() {
  runApp(const CampusStoreApp());
}

class CampusStoreApp extends StatelessWidget {
  const CampusStoreApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Campus Store',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: Colors.indigo),
      home: const HomeScreen(),
    );
  }
}
```

`main.dart` stays small. It only starts the app and sets it up. Each screen gets its own file inside `lib/screens`.

### Step 4 - Write the home screen

Create `lib/screens/home_screen.dart`:

```dart
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    String productName = 'Campus Notebook';
    double price = 250;
    String imageUrl = 'https://placehold.co/600x400/png?text=Campus+Notebook';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Campus Store'),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.shopping_cart_outlined),
          ),
        ],
      ),
      body: Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Featured product',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Image.network(
              imageUrl,
              height: 200,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
            const SizedBox(height: 12),
            Text(
              productName,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            Text(
              'Rs. ${price.toStringAsFixed(2)}',
              style: const TextStyle(fontSize: 18, color: Colors.indigo),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () {},
              child: const Text('Buy now'),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.chat),
      ),
    );
  }
}
```

### What each part does

- The three variables at the top hold the product information. On Day 9 they will come from a `Product` object instead.
- `AppBar` shows the store name and a cart button on the right.
- `Container` with `padding` keeps everything 16 away from the screen edges.
- `Column` stacks the content from top to bottom, lined up on the left.
- `Image.network` loads the product picture from the internet.
- The price uses `toStringAsFixed(2)` so it shows `Rs. 250.00`.
- `ElevatedButton` is the main action. It does nothing yet.
- `FloatingActionButton` is a chat button for later.

Notice where `const` is and isn't used. `const Text('Featured product')` never changes, so it's `const`. `Text(productName, ...)` uses a variable, so it can't be `const`, but its `TextStyle` can.

### Step 5 - Run it

Run the app with `flutter run` or F5. You should see the Campus Store home screen with one featured product.

---

## Summary

Here is what you covered today:

- Everything on a Flutter screen is a widget, and widgets inside widgets form the widget tree.
- A `StatelessWidget` has a constructor and a `build` method. Whatever `build` returns is shown on screen.
- `MaterialApp` sets up the app. `Scaffold` gives a screen its app bar, body, and floating button.
- `Text`, `Icon`, `Image.network`, `Container`, and `SizedBox` are the basic building blocks.
- Use `ElevatedButton` for the main action, `OutlinedButton` for a second action, `TextButton` for small actions, and `IconButton` for icons.
- `const` widgets are built once and reused, which makes the app faster.
- `var` can change, `final` is set once while the app runs, and `const` is fixed before the app runs.
- `/` always gives a `double`, `~/` drops the decimal part, and `%` gives the remainder.
- `toStringAsFixed(2)` shows a number with exactly 2 decimal places.

---

## Practice Tasks

1. Draw the widget tree of the Campus Store home screen on paper, without looking at the notes.
2. In the Campus Store app, change the theme colour and the product name, and watch hot reload update them.
3. Add a `TextButton` with the text "See all products" below the "Buy now" button.
4. Build a profile card screen in your `about_me` project (replace `AboutMeScreen` or make a new screen file). It should have:
   - a photo using `Image.network` (try `https://placehold.co/300x300/png?text=Me`)
   - your name in large bold text
   - your role, for example "Flutter Student"
   - two buttons: an `ElevatedButton` "Follow" and an `OutlinedButton` "Message"

---

## Homework

### Core

Create a new project called `business_card` in your `flutter-course` folder. Build a business card screen with:

- a photo
- your name and job title
- your phone number with a phone icon
- your email with an email icon
- an `AppBar` and a theme colour of your choice

Use `const` everywhere VS Code suggests it.

Then add 3 more Dart Lab cards in your `about_me` project that use operators. For example: minutes to hours and minutes using `~/` and `%`, or a check like "Can vote?" using `>=`.

Commit and push:

```bash
git add .
git commit -m "day-02: business card and operator cards"
git push
```

### Challenge

In the Dart Lab, show a discount table for 3 products. For each product, show the price, the discount percentage, and the final price with 2 decimal places. For example:

```
Notebook   Rs. 250.00, 10% off, now Rs. 225.00
```

---

## Class Project - Level 2

### Story So Far

On Day 1 you built a warm-up app and your Dart Lab. Today the real project begins.

### Today's Project Level

| Action | Path from `campus_store/` | Why |
|--------|---------------------------|-----|
| Replace | `lib/main.dart` | Starts the app and sets the theme |
| Create | `lib/screens/home_screen.dart` | The home screen with a featured product |
| Delete | `test/widget_test.dart` | It tests the counter demo, which is gone |

### Completed Level

```text
campus_store/
  lib/
    main.dart
    screens/
      home_screen.dart
  pubspec.yaml
```

Completion checklist:

- The Campus Store app runs and shows the app bar, the featured product, the price as `Rs. 250.00`, and a "Buy now" button.
- There are no blue `const` warnings left in your code.
- Your Dart Lab has the 9 new Day 2 cards.
- You can explain the difference between `final` and `const` with an example.

### Next Level

Right now the product is written straight into the home screen. If we want ten products, we would have to copy the same code ten times. Tomorrow you learn to build your own reusable widgets, and the Dart functions that make them work. Continue with [Day 3](<Day3-Custom Widgets and Dart Functions.md>).
