# Day 3 - Custom Widgets and Dart Functions

## What You Will Learn Today

- How to write Dart functions, with a block body or an arrow `=>`
- Every kind of function parameter:
  - required positional
  - optional positional `[ ]`
  - named `{ }`
  - `required` named
  - default values
- How to mix positional and named parameters
- Anonymous functions, functions as values, and callbacks
- `typedef` for naming a function type
- How to build your own reusable widgets
- How to pass data and actions into your widgets

---

## 1. Why We Need Our Own Widgets

Yesterday the Campus Store home screen showed one product. Now imagine the store has 20 products. If we copy the product code 20 times, the screen becomes hundreds of lines long. And if we want to change how a product looks, we would have to change it in 20 places.

The fix is to build our own widget once, called `ProductCard`, and use it as many times as we like:

```dart
ProductCard(title: 'Campus Notebook', price: 250)
ProductCard(title: 'Blue Pen Pack', price: 120)
ProductCard(title: 'College Hoodie', price: 1800)
```

To build widgets like this, you need to understand functions and parameters. That's today's Dart topic.

---

## 2. Dart Spotlight: Functions

A function is a named block of code that does one job. You write it once and call it whenever you need it.

```dart
String greet(String name) {
  return 'Hello, $name';
}
```

- `String` at the start is the return type: this function gives back a `String`.
- `greet` is the name of the function.
- `(String name)` is the parameter: the value you give the function when you call it.
- `return` sends the result back.

You call it like this:

```dart
greet('Asha')   // 'Hello, Asha'
```

### void functions

If a function doesn't give anything back, its return type is `void`:

```dart
void sayHello() {
  debugPrint('Hello');
}
```

### Arrow functions

When a function only returns one expression, you can write it on one line with `=>`:

```dart
String greet(String name) => 'Hello, $name';
```

This does exactly the same as the version with `{ return ... }`. The arrow is just shorter. You will see it everywhere in Flutter code.

---

## 3. Dart Spotlight: The Five Kinds of Parameters

Dart gives you several ways to pass values into a function. This matters a lot in Flutter, because every widget is created by passing values into it.

### 1. Required positional parameters

```dart
String greet(String name) => 'Hello, $name';

greet('Asha')   // Hello, Asha
```

You must give a value, and the order matters. This is the simplest kind.

### 2. Optional positional parameters `[ ]`

Put parameters inside square brackets to make them optional:

```dart
String greetWithTitle(String name, [String? title]) =>
    title == null ? 'Hello, $name' : 'Hello, $title $name';

greetWithTitle('Asha')          // Hello, Asha
greetWithTitle('Asha', 'Ms.')   // Hello, Ms. Asha
```

- `String?` means this value is allowed to be missing. A missing value is called `null`. You learn this fully on Day 7.
- `title == null ? A : B` means "if no title was given, use A, otherwise use B". This is called a ternary, and you learn it properly tomorrow.

### 3. Named parameters `{ }`

Put parameters inside curly brackets to make them named. When you call the function, you write the name of each value:

```dart
String priceLabel({double price = 0, String currency = 'Rs.'}) =>
    '$currency ${price.toStringAsFixed(2)}';

priceLabel(price: 250)                    // Rs. 250.00
priceLabel(currency: 'USD', price: 5)     // USD 5.00
```

Named parameters have two big advantages:

- The call is easy to read. `priceLabel(price: 250)` tells you exactly what 250 means.
- The order doesn't matter.

### 4. Required named parameters

Named parameters are optional by default. Add `required` when the value must always be given:

```dart
String priceLabel({required double price, String currency = 'Rs.'}) =>
    '$currency ${price.toStringAsFixed(2)}';

priceLabel(price: 250)   // fine
// priceLabel()          // error: price is required
```

### 5. Default values

Use `=` to give an optional parameter a value it uses when nothing is passed. You already saw this above: `currency = 'Rs.'` means the currency is `Rs.` unless you say otherwise.

Default values work for optional positional parameters too:

```dart
String repeatWord(String word, [int times = 2]) => '$word ' * times;

repeatWord('Hi')      // 'Hi Hi '
repeatWord('Hi', 3)   // 'Hi Hi Hi '
```

### Mixing positional and named

You can have positional parameters first, then named ones:

```dart
String orderLine(String item, {int qty = 1}) => '$qty x $item';

orderLine('Notebook')           // 1 x Notebook
orderLine('Notebook', qty: 2)   // 2 x Notebook
```

You can't mix optional positional `[ ]` and named `{ }` in the same function. Pick one.

### Which one should I use?

| Kind | Example | Use it when |
|------|---------|-------------|
| Required positional | `greet('Asha')` | One or two obvious values |
| Optional positional | `greet('Asha', 'Ms.')` | Rarely. Named is usually clearer |
| Named | `priceLabel(price: 250)` | More than one or two values |
| `required` named | `ProductCard(title: 'Pen')` | Values that must always be given |
| Default value | `currency = 'Rs.'` | A value that's usually the same |

### Now look at Flutter again

Open any widget you used yesterday:

```dart
Text('Campus Notebook', style: TextStyle(fontSize: 22))
```

- `'Campus Notebook'` is a required positional parameter.
- `style:` is a named parameter.

```dart
ElevatedButton(onPressed: () {}, child: const Text('Buy now'))
```

- `onPressed:` and `child:` are `required` named parameters. Try deleting `onPressed:` and VS Code shows an error.

In VS Code, hold `Ctrl` (or `Cmd` on Mac) and click on `Text`. VS Code opens Flutter's own code for the `Text` widget. Look at its constructor. You will see the same parameter kinds you just learned.

---

## 4. Dart Spotlight: Functions as Values

In Dart, a function is a value, just like a number or a piece of text. You can pass a function into another function.

### Anonymous functions

A function without a name is called an anonymous function:

```dart
(double price) => price * 2
```

```dart
() {
  debugPrint('Tapped');
}
```

You can't call these by name. Instead, you pass them straight into something that will call them later.

### Callbacks

A callback is a function you give to someone else to call later. You have already used callbacks:

```dart
ElevatedButton(
  onPressed: () {
    debugPrint('Buy now tapped');
  },
  child: const Text('Buy now'),
)
```

The `() { ... }` is an anonymous function. You give it to the button, and the button calls it every time someone taps.

Here is a function that takes a callback:

```dart
void runTwice(void Function() action) {
  action();
  action();
}

runTwice(() {
  debugPrint('Hi');
});   // prints Hi twice
```

- `void Function()` is the type of the parameter. It means "a function that takes nothing and returns nothing".
- Inside, `action()` calls the function we were given.

### Function types you will see in Flutter

| Type | Means | Example use |
|------|-------|-------------|
| `void Function()` | Takes nothing, returns nothing | A tap |
| `VoidCallback` | Flutter's short name for `void Function()` | `onPressed` |
| `void Function(int)` | Takes an `int`, returns nothing | A rating that changed |
| `double Function(double)` | Takes a `double`, returns a `double` | A price rule |

### typedef

When a function type gets long, give it a short name with `typedef`:

```dart
typedef PriceRule = double Function(double price);

double applyRule(double price, PriceRule rule) => rule(price);

applyRule(250, (price) => price * 2)      // 500.0
applyRule(250, (price) => price - 50)     // 200.0
```

`VoidCallback` is exactly this: Flutter wrote `typedef VoidCallback = void Function();` so we don't have to write the long form.

---

## 5. Dart Lab: Today's Cards

Open `about_me/lib/dart_lab_screen.dart`.

### Step 1 - Add the functions

Functions go outside the class. Add these lines just below the `import` line at the top of the file:

```dart
// Day 3: functions and parameters
String greet(String name) => 'Hello, $name';

String greetWithTitle(String name, [String? title]) =>
    title == null ? 'Hello, $name' : 'Hello, $title $name';

String priceLabel({required double price, String currency = 'Rs.'}) =>
    '$currency ${price.toStringAsFixed(2)}';

String orderLine(String item, {int qty = 1}) => '$qty x $item';

typedef PriceRule = double Function(double price);

double applyRule(double price, PriceRule rule) => rule(price);

void runTwice(void Function() action) {
  action();
  action();
}
```

### Step 2 - Add a variable for the callback

Inside `build`, below the Day 2 variables, add:

```dart
    // Day 3: callback
    int taps = 0;
    runTwice(() {
      taps++;
    });
```

### Step 3 - Add the cards

Add these lines inside `results`:

```dart
      'Required positional': greet('Asha'),
      'Optional positional, missing': greetWithTitle('Asha'),
      'Optional positional, given': greetWithTitle('Asha', 'Ms.'),
      'Named with default': priceLabel(price: 250),
      'Named, both given': priceLabel(price: 5, currency: 'USD'),
      'Positional and named': orderLine('Notebook', qty: 2),
      'Anonymous function': '${applyRule(250, (price) => price * 2)}',
      'Callback ran': '$taps times',
```

### Step 4 - Check the results

```
Required positional            Hello, Asha
Optional positional, missing   Hello, Asha
Optional positional, given     Hello, Ms. Asha
Named with default             Rs. 250.00
Named, both given              USD 5.00
Positional and named           2 x Notebook
Anonymous function             500.0
Callback ran                   2 times
```

Change the values you pass in and save. Try removing `price:` from `priceLabel(price: 250)` and read the error VS Code shows.

---

## 6. Building Your Own Widget

Now let's use all of this to build reusable widgets.

A custom widget is a class with:

1. fields to hold the values passed in
2. a constructor with named parameters
3. a `build` method that uses those fields

```dart
class PriceTag extends StatelessWidget {
  const PriceTag({super.key, required this.price, this.currency = 'Rs.'});

  final double price;
  final String currency;

  @override
  Widget build(BuildContext context) {
    return Text('$currency ${price.toStringAsFixed(2)}');
  }
}
```

Line by line:

- `final double price;` and `final String currency;` are the widget's fields. They are `final` because a widget never changes after it's created.
- `required this.price` means "a price must be given, and store it in the `price` field".
- `this.currency = 'Rs.'` means "currency is optional, and defaults to `Rs.`".
- `super.key` passes the optional `key` up to `StatelessWidget`. Every widget has one. You learn what keys do on Day 8.
- `build` uses `price` and `currency` to make a `Text`.

Using it:

```dart
const PriceTag(price: 250)                    // Rs. 250.00
const PriceTag(price: 5, currency: 'USD')     // USD 5.00
```

### Passing an action into a widget

To let the user of your widget decide what happens on tap, add a callback field:

```dart
class PrimaryButton extends StatelessWidget {
  const PrimaryButton({super.key, required this.label, required this.onPressed});

  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(onPressed: onPressed, child: Text(label));
  }
}
```

`PrimaryButton` doesn't know what should happen when it's tapped. It just passes the `onPressed` function to the `ElevatedButton`. The screen that uses it decides:

```dart
PrimaryButton(
  label: 'Add to cart',
  onPressed: () => debugPrint('Added to cart'),
)
```

### Extract Widget in VS Code

VS Code can create a widget for you from existing code. Click on a widget in your code, press `Ctrl + .` (`Cmd + .` on Mac), and choose "Extract Widget". Type a name, and VS Code moves that code into a new widget class.

---

## 7. Class Project: ProductCard and PrimaryButton

Let's replace the single featured product with reusable product cards.

### Step 1 - Create the widgets folder

In `campus_store`, create a folder `lib/widgets`.

### Step 2 - Create PrimaryButton

Create `lib/widgets/primary_button.dart`:

```dart
import 'package:flutter/material.dart';

class PrimaryButton extends StatelessWidget {
  const PrimaryButton({super.key, required this.label, required this.onPressed});

  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(onPressed: onPressed, child: Text(label));
  }
}
```

### Step 3 - Create ProductCard

Create `lib/widgets/product_card.dart`:

```dart
import 'package:flutter/material.dart';

import 'primary_button.dart';

class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.title,
    required this.price,
    required this.onAddToCart,
    this.imageUrl = 'https://placehold.co/600x400/png?text=Campus+Store',
  });

  final String title;
  final double price;
  final VoidCallback onAddToCart;
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(12),
      color: Colors.indigo.shade50,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Image.network(
            imageUrl,
            height: 140,
            width: double.infinity,
            fit: BoxFit.cover,
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          Text(
            'Rs. ${price.toStringAsFixed(2)}',
            style: const TextStyle(fontSize: 16, color: Colors.indigo),
          ),
          const SizedBox(height: 8),
          PrimaryButton(label: 'Add to cart', onPressed: onAddToCart),
        ],
      ),
    );
  }
}
```

What's new here:

- `title` and `price` are required, because a product card makes no sense without them.
- `imageUrl` is optional with a default picture, so a product without a photo still looks fine.
- `onAddToCart` is a callback. The card doesn't decide what "add to cart" does. The home screen does.
- `EdgeInsets.only(bottom: 16)` adds space only below each card.
- `Colors.indigo.shade50` is a very light indigo. Colours come in shades from 50 (lightest) to 900 (darkest).
- The card uses our own `PrimaryButton`. Widgets can use other custom widgets.

### Step 4 - Update the home screen

Replace `lib/screens/home_screen.dart` with:

```dart
import 'package:flutter/material.dart';

import '../widgets/product_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            ProductCard(
              title: 'Campus Notebook',
              price: 250,
              imageUrl: 'https://placehold.co/600x400/png?text=Campus+Notebook',
              onAddToCart: () => debugPrint('Added Campus Notebook'),
            ),
            ProductCard(
              title: 'Blue Pen Pack',
              price: 120,
              imageUrl: 'https://placehold.co/600x400/png?text=Blue+Pens',
              onAddToCart: () => debugPrint('Added Blue Pen Pack'),
            ),
            ProductCard(
              title: 'College Hoodie',
              price: 1800,
              onAddToCart: () => debugPrint('Added College Hoodie'),
            ),
          ],
        ),
      ),
    );
  }
}
```

What changed:

- The home screen is now short and easy to read. Each product is one `ProductCard`.
- The third product has no `imageUrl`, so it uses the default picture.
- Each card gets its own `onAddToCart` callback. Tap "Add to cart" and check the Debug Console in VS Code to see which product was added.
- `../widgets/product_card.dart` means "go up one folder from `screens`, then into `widgets`".
- `SingleChildScrollView` lets the screen scroll, because three cards are taller than most phone screens. You learn it properly on Day 5. For now, just use it.
- We removed the floating chat button to keep the screen simple.

### Step 5 - Run it

Run the app. You should see three product cards and be able to scroll down to the third one.

Now try changing the `ProductCard` design, for example its background colour. Save, and all three cards change at once. That's the power of a reusable widget.

---

## Summary

Here is what you covered today:

- A function is a named block of code. It can have a block body `{ return ...; }` or an arrow body `=> ...`.
- `void` means the function returns nothing.
- Required positional parameters must be given in order.
- Optional positional parameters go in `[ ]`.
- Named parameters go in `{ }`, are written with their name when called, and are optional unless marked `required`.
- Default values like `currency = 'Rs.'` are used when nothing is passed.
- Functions are values. Anonymous functions can be passed into other functions, and a function passed in to be called later is a callback.
- `VoidCallback` is Flutter's name for `void Function()`, and `typedef` lets you name your own function types.
- A custom widget has `final` fields, a constructor with named parameters, and a `build` method.
- Widgets take data through their constructor and actions through callbacks.

---

## Practice Tasks

1. In the Dart Lab, write a function `fullName(String first, String last)` and show the result.
2. Change it to use named parameters: `fullName(first: 'Asha', last: 'Sharma')`. Which call is easier to read?
3. Build an `InfoTile` widget in your `about_me` project with:
   - a `required` `IconData icon`
   - a `required` `String label`
   - an optional `String value` that defaults to `'Not set'`

   Use a `Row` to show the icon and the text side by side. A `Row` works like a `Column`, but places children left to right. Then use `InfoTile` 4 times on your About Me screen (for example: city, course, hobby, and phone).

---

## Homework

### Core

1. In the Dart Lab, write 6 functions of your own that together cover every parameter kind:
   - required positional
   - optional positional with `[ ]`
   - named
   - `required` named
   - a default value
   - a callback parameter

   Show the result of each one as a card.

2. Finish the `InfoTile` widget from the practice tasks and use it at least 4 times.

Commit and push:

```bash
git add .
git commit -m "day-03: functions and info tile widget"
git push
```

### Challenge

Build a `RatingStars` widget:

```dart
RatingStars({required int rating, int max = 5, Color color = Colors.amber})
```

It should show `max` stars, with the first `rating` stars filled and the rest empty. For example, `RatingStars(rating: 3)` shows 3 filled stars and 2 empty stars.

Hint: `List.generate(max, (index) => ...)` creates a list of `max` widgets. Inside, `index < rating ? Icons.star : Icons.star_border` picks the right icon. Put the list in a `Row`.

---

## Class Project - Level 3

### Story So Far

The Campus Store had one hard-coded featured product. Today it gets reusable building blocks.

### Today's Project Level

| Action | Path from `campus_store/` | Why |
|--------|---------------------------|-----|
| Create | `lib/widgets/primary_button.dart` | One button style for main actions across the app |
| Create | `lib/widgets/product_card.dart` | One reusable card for every product |
| Replace | `lib/screens/home_screen.dart` | Shows three products using `ProductCard` |

### Completed Level

```text
campus_store/
  lib/
    main.dart
    screens/
      home_screen.dart
    widgets/
      primary_button.dart
      product_card.dart
  pubspec.yaml
```

Completion checklist:

- The home screen shows three product cards and scrolls.
- The third product uses the default image.
- Tapping "Add to cart" prints the right product name in the Debug Console.
- Changing the `ProductCard` design changes all three cards at once.
- Your Dart Lab has the 8 new Day 3 cards.
- You can explain the difference between positional and named parameters, and when `required` is needed.

### Next Level

The product cards work, but they are just things stacked in a column. Real shop apps put the price next to the name, buttons side by side, and badges on top of images. Tomorrow you learn how Flutter layout really works, and build the product detail screen. Continue with [Day 4](<Day4-Layouts I - Rows, Columns, and Constraints.md>).
