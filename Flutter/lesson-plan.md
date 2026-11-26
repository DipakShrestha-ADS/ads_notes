# 33-Day Flutter App Development Lesson Plan

Prepared for students who already know basic programming (variables, functions, loops, objects). Prior JavaScript/React experience helps, but no Dart knowledge is assumed.

Each class is 1 hour 30 minutes long, and every day below has its own timed plan. How the classes are run (the class format, the Dart Lab, homework checking, pair work and lab days) is explained in [teaching-strategy.md](teaching-strategy.md).

---

# Course Overview

This course takes students from no mobile experience to building, testing and releasing a real Flutter app.

We don't teach Dart as a separate block at the start. Students build a real app from the first day, and each Dart topic is taught on the day the app needs it. The results show up in the app on their phone, not in a terminal. So they learn named parameters while building their own widgets, loops while filling a product list, classes while turning product data into models, and `async`/`await` while loading data from the internet.

Each day has one main Flutter topic and at most one Dart topic. That keeps every class realistic for 90 minutes, with time left to practise and check the work.

Along the way the course covers UI building, layouts, navigation, forms, theming, state management, networking, local storage, Firebase, device features, animations, architecture, testing and release builds. The teacher builds one class project live through the whole course, and from Day 16 each student works on their own final project, which they submit on Day 33.

The course runs for 33 classes. That's about 7 weeks at 5 classes a week, or five and a half weeks at 6 classes a week.

---

# Course Objectives

By the end of this course, students will be able to:

1. Write clean, null-safe Dart code: functions with every parameter style, collections, OOP, async, and Dart 3 features.
2. Explain how Flutter renders UI using the widget tree.
3. Build responsive multi-screen layouts with Material 3 widgets, following basic accessibility guidelines.
4. Handle user input, gestures, forms, and validation.
5. Navigate between screens and pass data between them.
6. Manage app state with `setState` and Provider.
7. Fetch, send, and display data from REST APIs.
8. Store data locally and use Firebase Auth and Firestore.
9. Use device features such as the camera, gallery, and links through packages.
10. Add animations and polish the user experience.
11. Structure a project cleanly, debug it, and write unit and widget tests.
12. Build a release APK/AAB and understand the store publishing process.
13. Plan, build, present, and submit a complete Flutter app.

---

# Prerequisites and Setup

Students should know:

- basic programming logic (variables, conditions, loops, functions)
- basic object concepts (objects, properties, methods)
- JSON basics and what an API is

Machine requirements (check before Day 1):

- 8 GB RAM minimum (16 GB recommended for the Android emulator)
- latest stable Flutter SDK (Dart 3 or later)
- VS Code with the Flutter and Dart extensions, or Android Studio
- Android Studio SDK and one emulator, or a physical Android phone with USB debugging (preferred)
- Git and a GitHub account
- macOS and Xcode only if iOS builds will be demonstrated

Hold a 1-hour setup session before Day 1. In that session every student installs everything, passes `flutter doctor`, and creates their `flutter-course` GitHub repo. Day 1 depends on every student being able to run an app on their own phone.

---

# Course at a Glance

| Day | Flutter topic | Dart Spotlight | Checkpoint |
|-----|---------------|----------------|------------|
| **Phase 1: First App and UI Basics** ||||
| 1 | Your first Flutter app on your phone | Variables, interpolation | |
| 2 | Widgets fundamentals | `final` / `const`, operators | |
| 3 | Custom widgets | Functions: all parameter types | |
| 4 | Layouts I: rows, columns, constraints | `if`, ternary, `switch` | |
| 5 | Layouts II: stack, wrap, scrolling | Loops, collection `if` / `for`, spread | |
| 6 | Lists, grids, and assets | `List`, `Map`, `Set`, generics | |
| 7 | Stateful widgets, lifecycle, gestures | Null safety | |
| 8 | Filter, search, sort, swipe to delete | Higher-order methods, cascade | Quiz 1 |
| **Phase 2: Multi-Screen Apps** ||||
| 9 | Data models | Classes and constructors (OOP 1) | |
| 10 | Navigator: moving between screens | Inheritance, abstract, interfaces (OOP 2) | |
| 11 | `go_router`, bottom nav, drawer, tabs | Enums | |
| 12 | Forms and validation | String methods, `RegExp`, extensions | |
| 13 | More inputs, dialogs, bottom sheets | Mixins | |
| 14 | Theming and responsive design | Records and patterns | |
| 15 | Mini Project 1: build day | | Mini project |
| 16 | Mini Project 1 demos and final project briefing | | Quiz 2 |
| **Phase 3: Async, State, and Real Data** ||||
| 17 | Async UI with `FutureBuilder` | `Future`, `async` / `await`, errors | Proposal due |
| 18 | State management with Provider | Equality, unmodifiable state | Proposal approved, project setup |
| 19 | HTTP requests and JSON | `dart:convert`, `fromJson` | |
| 20 | REST CRUD, `dio`, service layer | Imports, abstract repository | |
| 21 | Authentication, tokens, saved settings | `DateTime`, `Duration` | Milestone 1 |
| 22 | SQLite and offline data | Date and number formatting (`intl`) | Quiz 3 |
| 23 | Firebase setup and Firebase Auth | Streams I | |
| 24 | Cloud Firestore in real time | Streams II: `async*`, `StreamController` | |
| **Phase 4: Real-World Features and Production** ||||
| 25 | Device features and packages | Sealed classes | |
| 26 | Animations and UX polish | Mixins in Flutter | Milestone 2 |
| 27 | App architecture and clean code | Generics, class modifiers | Peer review |
| 28 | Testing | `assert` | |
| 29 | Debugging and performance | Isolates and `compute` | Quiz 4 |
| 30 | Build, release, and publishing | | Milestone 3 |
| **Phase 5: Final Project** ||||
| 31 | Final project lab I | | |
| 32 | Final project lab II and rehearsal | | |
| 33 | Presentations, submission, course review | | Final submission |

---

# Dart Coverage Map

This table lists every important Dart topic, the day it's taught, and where students use it in the app.

| Dart topic | Day | Where it is used in the app |
|------------|-----|-----------------------------|
| `main()`, `runApp()`, comments, `print` / `debugPrint` | 1 | App entry point |
| Variables: `var`, `String`, `int`, `double`, `bool`, `num` | 1 | Dart Lab cards, About Me app |
| String interpolation `$x` / `${expr}`, multi-line strings | 1 | Text widgets |
| `final` vs `const` vs `var`, type inference, `dynamic`, `Object` | 2 | `const` widgets |
| Operators: arithmetic (`~/`, `%`), comparison, logical, `++`, `+=` | 2 | Bill and discount calculations |
| `toString`, `toStringAsFixed` | 2 | Showing prices |
| Functions: return types, `void`, arrow `=>` | 3 | Helper functions |
| Required positional parameters | 3 | `String greet(String name)` |
| Optional positional parameters `[ ]` | 3 | `greet(name, [title])` |
| Named parameters `{ }` | 3 | Every widget constructor: `Text('Hi', style: ...)` |
| `required` named parameters | 3 | `ProductCard({required this.title})` |
| Default parameter values | 3 | `{String currency = 'Rs.'}` |
| Positional and named parameters together | 3 | `orderLine(item, qty: 2)` |
| Anonymous functions, functions as values, callbacks (`VoidCallback`, `void Function(int)`) | 3 | `onPressed: () {}` |
| `typedef` | 3 | Callback types for custom widgets |
| `if` / `else`, ternary `? :` | 4 | "Out of stock" label |
| `switch` statement, Dart 3 `switch` expression | 4 | Grade from marks, category to icon |
| Loops: `for`, `for-in`, `while`, `do-while`, `break`, `continue` | 5 | Rating stars |
| Collection `if`, collection `for`, spread `...` / `...?` | 5 | Inside `children: [...]` |
| `List`, `Map`, `Set`, generics `List<String>`, `Map<String, dynamic>` | 6 | Product data |
| List methods: `add`, `addAll`, `remove`, `insert`, `contains`, `indexOf`, `length`, `isEmpty`, `first`, `last` | 6 | Product list |
| `Timer` (used with `initState` / `dispose`) | 7 | Countdown |
| Null safety: `?`, `!`, `??`, `??=`, `?.`, `late`, type promotion | 7 | Selected size, optional image |
| Higher-order methods: `map`, `where`, `firstWhere`, `any`, `every`, `fold`, `reduce`, `sort`, `take`, `skip`, `join`, `toList` | 8 | Filter, search, sort, totals |
| Cascade `..` | 8 | Sorting a copy of a list |
| Classes, fields, methods, `this` | 9 | `Product` model |
| Constructors: generative, `this.x` shorthand, named, `const`, `factory`, initializer list, redirecting | 9 | `Product`, `Product.sample()` |
| Private members `_`, getters and setters, `static` | 9 | `product.finalPrice` |
| `toString`, `copyWith`, immutability | 9 | Updating a product |
| `super.key`, super parameters | 9 | Why widgets use `{super.key}` |
| Inheritance `extends`, `@override`, `super` | 10 | Why every widget `extends StatelessWidget` |
| Abstract classes, `implements` (interfaces) | 10 | `Shape`, later repositories |
| Enums and enhanced enums | 11 | Categories, tabs |
| String methods: `trim`, `toLowerCase`, `contains`, `split`, `substring`, `padLeft` | 12 | Cleaning form input |
| `int.tryParse` / `double.tryParse` | 12 | Number input |
| `RegExp` | 12 | Email and phone validation |
| Extension methods | 12 | `'a@b.com'.isValidEmail` |
| Mixins `with`, `mixin ... on` | 13 | `ValidationMixin` |
| Records `(a, b)`, patterns, destructuring, relational patterns | 14 | Stock label and colour |
| `Future`, `async` / `await`, `then`, `Future.delayed`, `Future.wait` | 17 | Loading data |
| `try` / `catch` / `on` / `finally`, `throw`, `rethrow`, custom exceptions | 17 | Error screen with retry |
| `==`, `hashCode` | 18 | Cart item equality |
| `List.unmodifiable`, computed getters | 18 | Safe Provider state |
| `dart:convert`: `jsonDecode`, `jsonEncode`; `fromJson` / `toJson` | 19 | API models |
| `is`, `as` casts, nested JSON | 19 | Parsing API responses |
| Imports: `package:`, relative, `as`, `show`, `hide` | 20 | Service layer files |
| Abstract repository with fake and real versions | 20 | Swapping data sources |
| `DateTime`, `Duration` | 21 | Token expiry |
| `DateFormat`, `NumberFormat` (`intl`) | 22 | Dates, currency, "2 hours ago" |
| `Stream`, `listen`, `await for`, `StreamSubscription` | 23 | Auth state changes |
| `async*` / `yield`, `StreamController`, broadcast streams | 24 | Live countdown, Firestore |
| Sealed classes and exhaustive `switch`, object patterns | 25 | `UploadState` |
| `SingleTickerProviderStateMixin` | 26 | Animation controllers |
| Generic classes and functions (`Result<T>`) | 27 | Repository results |
| Class modifiers: `final`, `base`, `interface`, `sealed` (overview) | 27 | Architecture |
| `assert` | 28 | Development checks |
| Isolates and `compute()` | 29 | Parsing large JSON |

---

# Class Project: Campus Store App

The teacher builds a Campus Store shopping app live and adds to it every day. Students build it alongside the teacher, so they always have a complete working example to look back at.

| Days | What gets added |
|------|-----------------|
| 1 | About Me warm-up app and Dart Lab screen |
| 2-8 | Home screen, `ProductCard`, product detail layout, product grid, favourites, filter / search / sort |
| 9 | `Product` model |
| 10-14 | Navigation, router with bottom nav and tabs, login / register forms, profile edit, theme and dark mode |
| 17-18 | Fake async loading, cart with Provider |
| 19-22 | Products from a real API, add / delete products, login with token, offline favourites |
| 23-24 | Firebase version of auth and orders |
| 25-30 | Profile picture, animations, clean structure, tests, release APK |

API option: if students took the Node.js course, connect the app to their Campus Store API. Otherwise use a free public API such as `dummyjson.com` or `fakestoreapi.com`. Tell students early that these public APIs only pretend to save data. A POST or DELETE returns success, but nothing changes when you reload. The Node.js API saves real data, so it's the better choice for Days 20 to 22.

---

# Daily Lesson Plan

Most days follow this standard plan (see [teaching-strategy.md](teaching-strategy.md) for details):

| Time | Segment |
|------|---------|
| 0:00-0:10 | Warm-up: 3 recall questions and homework show |
| 0:10-0:25 | Dart Spotlight |
| 0:25-0:40 | Flutter concept |
| 0:40-1:05 | Live coding (class project) |
| 1:05-1:25 | Guided practice |
| 1:25-1:30 | Wrap-up and homework |

Some days change the timing, so each day below has its own plan.

---

# Phase 1: First App and UI Basics (Days 1-8)

---

## Day 1: Your First Flutter App on Your Phone

### Topics
**Flutter**
- What Flutter is and why it is used (one codebase for Android, iOS, web, and desktop)
- Flutter vs native vs React Native (short comparison)
- `flutter doctor`, `flutter create`, running on a phone or emulator
- Project structure: `lib/`, `pubspec.yaml`, `android/`, `ios/`, `test/`
- Hot reload vs hot restart

**Dart Spotlight**
- `main()` and `runApp()`: where the app starts
- Variables: `var`, `String`, `int`, `double`, `bool`, `num`
- String interpolation: `'$name'`, `'${age + 1}'`
- Comments, `print()` and `debugPrint()`

### Daily Objectives
By the end of the class, students should be able to:
- run a Flutter app on their own phone or emulator
- change the app and see the change with hot reload
- create variables and show their values in the app

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Welcome | Course roadmap; demo of the finished Campus Store app ("you will build this") |
| 0:10-0:25 | Flutter concept | What Flutter is, how it draws UI, project structure, hot reload |
| 0:25-0:50 | Live coding | `flutter create about_me`, run on a phone, change text and colour with hot reload, replace the counter app with an About Me screen |
| 0:50-1:05 | Dart Spotlight | `main`, `runApp`, variables, interpolation; add the Dart Lab screen (starter code in the strategy file) |
| 1:05-1:25 | Guided practice | Students finish About Me and add 3 Dart Lab cards; teacher fixes device issues |
| 1:25-1:30 | Wrap-up | Commit and push to the `flutter-course` repo made in the setup session; homework |

### Homework
- **Core:** Complete the About Me app (name, course, hobby, today's date as text) using variables and interpolation. Push to GitHub.
- **Challenge:** Calculate and show your age in months and days in the Dart Lab.

---

## Day 2: Widgets Fundamentals

### Topics
**Flutter**
- Everything is a widget; the widget tree
- `StatelessWidget`
- `MaterialApp`, `Scaffold`, `AppBar`, `FloatingActionButton`
- `Text`, `TextStyle`, `Icon`, `Image.network`, `Container`, `SizedBox`
- `ElevatedButton`, `TextButton`, `OutlinedButton`, `IconButton`
- Why `const` widgets matter
- Using the Flutter docs and widget catalog

**Dart Spotlight**
- `final` vs `const` vs `var`, type inference, `dynamic`, `Object`
- Operators: `+ - * / ~/ %`, comparison, logical `&& || !`, `++`, `+=`
- `toString()`, `toStringAsFixed(2)`

### Daily Objectives
By the end of the class, students should be able to:
- explain the widget tree
- build a simple screen with `Scaffold` and basic widgets
- choose correctly between `var`, `final`, and `const`
- use operators to calculate values for display

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: hot reload vs restart, interpolation of an expression; 2 homework shows |
| 0:10-0:25 | Dart Spotlight | `final` / `const` / `var`; operators; Dart Lab: a bill with subtotal, 13% VAT, total to 2 decimals |
| 0:25-0:40 | Flutter concept | Draw a widget tree on the board; how `MaterialApp`, `Scaffold` and the other widgets fit together; buttons; `const` |
| 0:40-1:05 | Live coding | Create the Campus Store project: home screen with an AppBar and one featured product (image, name, price, "Buy" button) |
| 1:05-1:25 | Guided practice | Profile card screen (photo, name, role, two buttons) |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Build a "Business Card" app with a photo, name, phone, and email. Add 3 Dart Lab cards using operators.
- **Challenge:** Show a discount table for 3 products (price, discount %, final price).

---

## Day 3: Custom Widgets and Dart Functions (All Parameter Types)

### Topics
**Flutter**
- Extracting a reusable custom widget
- Passing data into widgets through constructors
- Passing actions into widgets (`onPressed`, `onTap` callbacks)
- Why widget constructors use named parameters

**Dart Spotlight**
- Functions: return type, `void`, block body vs arrow `=>`
- Required positional parameters
- Optional positional parameters `[ ]`
- Named parameters `{ }`
- `required` named parameters
- Default values
- Positional and named parameters together
- Anonymous functions, functions as values, callbacks
- `VoidCallback`, `void Function(int)`, `typedef`

```dart
// 1. Required positional
String greet(String name) => 'Hello, $name';

// 2. Optional positional
String greetWithTitle(String name, [String? title]) =>
    title == null ? 'Hello, $name' : 'Hello, $title $name';

// 3. Named, with required and default values
String priceLabel({required double price, String currency = 'Rs.'}) =>
    '$currency ${price.toStringAsFixed(2)}';

// 4. Positional and named together
String orderLine(String item, {int qty = 1}) => '$qty x $item';

// 5. Function as a parameter (a callback)
void runTwice(void Function() action) {
  action();
  action();
}
```

### Daily Objectives
By the end of the class, students should be able to:
- write functions with every parameter type and explain when to use each
- create reusable widgets with `required` and optional named parameters
- pass callback functions into custom widgets

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: `final` vs `const`, what `~/` does; homework shows |
| 0:10-0:35 | Dart Spotlight (25 min) | One function per parameter type, each shown as a Dart Lab card; then callbacks and `typedef` |
| 0:35-0:45 | Flutter concept | Open the `Text` constructor in the IDE: "these are named parameters"; how to extract a widget |
| 0:45-1:05 | Live coding | `ProductCard({required title, required price, imageUrl})`, `PrimaryButton({required label, required onPressed})`; use them 3 times on the home screen |
| 1:05-1:25 | Guided practice | `InfoTile` widget with required and optional named parameters, used 4 times |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Write 6 functions in the Dart Lab covering every parameter type. Finish the `InfoTile` widget.
- **Challenge:** Build `RatingStars({required int rating, int max = 5, Color color = Colors.amber})`.

---

## Day 4: Layouts I: Rows, Columns, and Constraints

### Topics
**Flutter**
- How layout works: constraints go down, sizes go up, parent sets position
- `Row`, `Column`, `mainAxisAlignment`, `crossAxisAlignment`, `mainAxisSize`
- `Expanded`, `Flexible`, `Spacer`
- `Padding`, `SizedBox`, `Center`
- `Container` decoration: colour, border, radius, shadow
- Flutter DevTools widget inspector and layout explorer
- Overflow errors and how to fix them

**Dart Spotlight**
- `if` / `else`, ternary `condition ? a : b`
- `switch` statement and Dart 3 `switch` expression

### Daily Objectives
By the end of the class, students should be able to:
- build layouts with rows and columns
- explain how constraints work and fix overflow errors
- use `if`, ternary, and `switch` to choose what to show

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: named vs optional positional; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | Constraints diagram; main and cross axis; `Expanded` vs `Flexible`; layout explorer in DevTools |
| 0:30-0:45 | Dart Spotlight | `if`, ternary, `switch` expression (grade from marks) in the Dart Lab |
| 0:45-1:05 | Live coding | Product detail layout: image, title and price row, description, button row; "Out of stock" with ternary |
| 1:05-1:10 | Error of the day | Create an overflow and fix it 3 ways |
| 1:10-1:27 | Guided practice | Recreate a login screen design |
| 1:27-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Recreate a "settings" screen design given by the teacher using only rows, columns, and padding.
- **Challenge:** Build a calculator keypad layout with equal-size buttons using `Expanded`.

---

## Day 5: Layouts II: Stack, Wrap, and Scrolling

### Topics
**Flutter**
- `Stack` and `Positioned`
- `Align`
- `Wrap` (chips that move to the next line)
- `SingleChildScrollView`
- Gradients and shadows

**Dart Spotlight**
- Loops: `for`, `for-in`, `while`, `do-while`, `break`, `continue`
- Collection `if` and collection `for` inside `children: [...]`
- Spread `...` and null-aware spread `...?`

```dart
Column(
  children: [
    const Text('Products'),
    if (isOnSale) const Text('SALE!'),
    for (final name in productNames) Text(name),
    ...extraWidgets,
  ],
)
```

### Daily Objectives
By the end of the class, students should be able to:
- layer widgets with `Stack`
- build scrollable screens
- generate widgets with collection `if`, collection `for`, and spread

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: what causes overflow, `switch` expression syntax; homework shows |
| 0:10-0:25 | Dart Spotlight | Loops, then "remember the `for` in the Dart Lab? Today we learn it": collection `if` / `for`, spread |
| 0:25-0:40 | Flutter concept | `Stack`, `Positioned`, `Align`, `Wrap`, scrolling |
| 0:40-1:05 | Live coding | Home banner with `Stack` and "SALE" badge (collection `if`); category chips with `Wrap` (collection `for`); scrollable home |
| 1:05-1:25 | Guided practice | Profile header: cover image with an overlapping avatar and stats row |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Recreate a teacher-given design that uses a `Stack`. Use at least one collection `if` and one collection `for`.
- **Challenge:** Build a multiplication table screen (1-10) using loops in the widget tree.

---

## Day 6: Lists, Grids, and Assets

### Topics
**Flutter**
- `ListView`, `ListView.builder` (and why builder is faster), `ListView.separated`
- `GridView.builder`, `GridView.count`
- `Card`, `ListTile`, `CircleAvatar`, `Divider`, `Chip`
- Adding images and fonts through `pubspec.yaml`
- `Image.asset` vs `Image.network`, `errorBuilder`
- First package from pub.dev: `google_fonts`

**Dart Spotlight**
- `List`, `Map`, `Set`, and generics: `List<String>`, `Map<String, dynamic>`
- `add`, `addAll`, `remove`, `insert`, `contains`, `indexOf`, `length`, `isEmpty`, `first`, `last`

Product data is kept as a list of maps for now on purpose. Students will run into key typos like `p['prise']`, and that problem leads into classes on Day 9.

### Daily Objectives
By the end of the class, students should be able to:
- display dynamic lists and grids from data
- add and use local assets and custom fonts
- create and change lists, maps, and sets

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: collection `if`, spread; homework shows |
| 0:10-0:25 | Dart Spotlight | Lists, maps, sets, generics, basic methods in the Dart Lab |
| 0:25-0:40 | Flutter concept | `ListView.builder`, `GridView.builder`, `Card`, `ListTile`; assets and fonts in `pubspec.yaml` |
| 0:40-1:05 | Live coding | Product grid from a list of maps; local logo asset; Google Font |
| 1:05-1:25 | Guided practice | Contacts list (20 contacts) with `ListView.builder` and avatars |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Build a "Recipe List" screen: a grid of recipe cards (image, title, time, rating) from a list of maps.
- **Challenge:** Add a horizontal "Popular" list above the grid.

---

## Day 7: Stateful Widgets, Lifecycle, and Gestures

### Topics
**Flutter**
- `StatefulWidget` and `setState`
- When to use stateless vs stateful
- Lifecycle: `initState`, `build`, `didUpdateWidget`, `dispose`
- `Timer` started in `initState` and cancelled in `dispose`
- Gestures: `GestureDetector`, `InkWell` (tap, double tap, long press)

**Dart Spotlight**
- Why null safety exists
- Nullable `String?` vs non-nullable `String`
- `!`, `??`, `??=`, `?.`, `late`
- Type promotion (`if (x != null)`)

```dart
String? selectedSize;                       // nothing chosen yet
final label = selectedSize ?? 'Choose a size';
final length = selectedSize?.length;        // null if no size
```

### Daily Objectives
By the end of the class, students should be able to:
- update the UI with `setState`
- explain the widget lifecycle and clean up in `dispose`
- respond to taps and long presses
- use null safety operators correctly

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: why `ListView.builder`, how to add an asset; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | Stateless vs stateful; `setState`; print logs in every lifecycle method and watch them run; gestures |
| 0:30-0:45 | Dart Spotlight | Null safety with `selectedSize` as the example |
| 0:45-1:05 | Live coding | Product detail: favourite toggle, quantity selector (minimum 1), size selector starting as `null` |
| 1:05-1:25 | Guided practice | Countdown timer: start in `initState`, cancel in `dispose`, with pause and reset |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Build a "Post" card: like toggle with a count, double tap to like, and an optional caption (`String?`) that shows "No caption" when null.
- **Challenge:** Build a tap-the-target game with a 30-second timer and a score.

---

## Day 8: Filter, Search, Sort, and Swipe to Delete

### Topics
**Flutter**
- `FilterChip` / `ChoiceChip` for categories
- A simple search box with `TextField` and `onChanged` (full forms on Day 12)
- Sort menu with `PopupMenuButton`
- `Dismissible` (swipe to delete) and why it needs a `Key`
- `ValueKey`, `UniqueKey`

**Dart Spotlight**
- `map`, `where`, `firstWhere`, `any`, `every`, `fold`, `reduce`, `sort`, `take`, `skip`, `join`, `toList`, `toSet`
- Cascade `..`

```dart
final cheap = products.where((p) => p['price'] < 500).toList();
final total = cart.fold<double>(0, (sum, item) => sum + item['price']);
final sorted = [...products]..sort((a, b) => a['price'].compareTo(b['price']));
```

### Daily Objectives
By the end of the class, students should be able to:
- filter, search, and sort lists in Dart and show the result
- remove items with swipe to delete
- explain why some widgets need keys

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: `??` vs `?.`, what `dispose` is for; homework shows |
| 0:10-0:30 | Dart Spotlight (20 min) | Higher-order methods and cascade; Dart Lab: cheapest product, total, names in one line, sorted list |
| 0:30-0:40 | Flutter concept | Chips, search `TextField` with `onChanged`, `PopupMenuButton`, `Dismissible` and keys |
| 0:40-1:00 | Live coding | Category chips and search and sort on the product grid; swipe to delete in a wishlist; end by showing a `p['prise']` typo bug (leads into Day 9) |
| 1:00-1:10 | Quiz 1 | Days 1-7 |
| 1:10-1:27 | Guided practice | Add "quick recipes under 20 minutes" filter and sort to the recipe homework |
| 1:27-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Add search, a category filter, and sorting to your Recipe List.
- **Challenge:** Show "No results" with a "Clear filters" button when nothing matches.

---

# Phase 2: Multi-Screen Apps (Days 9-16)

---

## Day 9: Data Models with Classes (OOP Part 1)

### Topics
**Flutter**
- Why models: replacing maps with classes
- Refactoring the app to use a `Product` class
- Reading a widget's source code: widgets are classes with constructors

**Dart Spotlight**
- Classes, objects, fields, methods, `this`
- Constructors: generative with `this.x`, named, `const`, `factory`, initializer list with `assert`, redirecting
- `super.key` and super parameters
- Private members `_`, getters and setters, `static`
- `toString`, immutability, `copyWith`

```dart
class Product {
  final String id;
  final String name;
  final double price;
  final double discount;

  const Product({
    required this.id,
    required this.name,
    required this.price,
    this.discount = 0,
  });

  Product.sample() : this(id: '0', name: 'Sample', price: 100);

  double get finalPrice => price - (price * discount / 100);

  Product copyWith({String? name, double? price}) => Product(
        id: id,
        name: name ?? this.name,
        price: price ?? this.price,
        discount: discount,
      );

  @override
  String toString() => 'Product($name, Rs. $price)';
}
```

### Daily Objectives
By the end of the class, students should be able to:
- create classes with different constructor types
- explain why models are safer than maps
- use getters, private fields, and `copyWith`

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: `where` vs `firstWhere`, why `Dismissible` needs a key; homework shows |
| 0:10-0:15 | Problem | Replay yesterday's map typo bug: "how can the editor catch this for us?" |
| 0:15-0:45 | Dart Spotlight (30 min) | Classes and all constructor types, built step by step in the Dart Lab |
| 0:45-1:05 | Live coding | Refactor Campus Store from maps to `Product`; open `ElevatedButton` source and read its constructor together |
| 1:05-1:25 | Guided practice | `Student` and `Course` classes; show students with grades in a list |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Refactor your Recipe List from maps to a `Recipe` class with a named constructor, a getter, and `toString`.
- **Challenge:** Add `factory Recipe.fromMap(Map<String, dynamic> map)` and build the list from raw maps.

---

## Day 10: Navigator: Moving Between Screens

### Topics
**Flutter**
- The navigation stack (diagram)
- `Navigator.push` / `pop`, `MaterialPageRoute`
- Passing data to a screen through its constructor
- Returning data from a screen with `await Navigator.push` (a first look at `await`)
- Named routes (short)

**Dart Spotlight**
- Inheritance: `extends`, `@override`, `super`
- Why every widget `extends StatelessWidget` and overrides `build`
- Abstract classes and abstract methods
- `implements` and how it differs from `extends`

### Daily Objectives
By the end of the class, students should be able to:
- move between screens and pass data both ways
- use inheritance and abstract classes
- explain `extends` vs `implements`

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: named constructor, `copyWith`; homework shows |
| 0:10-0:25 | Flutter concept | Stack of screens diagram; push, pop, passing and returning data |
| 0:25-0:40 | Dart Spotlight | `abstract class Shape` with `Circle` and `Rectangle`; `extends` vs `implements` |
| 0:40-1:05 | Live coding | Product grid to detail screen (passing a `Product`); "choose size" screen that returns a value; cart screen |
| 1:05-1:25 | Guided practice | Recipe list to recipe detail; a "rate this recipe" screen that returns the rating |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Finish recipe detail and rating screens.
- **Challenge:** Build an abstract `Vehicle` with 3 subclasses and show them in a list with their own icons and descriptions.

---

## Day 11: go_router, Bottom Navigation, Drawer, and Tabs

### Topics
**Flutter**
- Why use a router package
- `go_router`: routes, path parameters, query parameters, `context.go` vs `context.push`
- Redirects (preview of the login guard)
- `NavigationBar`, `Drawer`, `TabBar` / `TabBarView`
- `ShellRoute` for a persistent bottom bar (short)
- Deep linking (overview)

**Dart Spotlight**
- Enums and enhanced enums (fields, constructors, methods)
- `values`, `name`, switching on an enum

```dart
enum Category {
  books('Books', Icons.book),
  stationery('Stationery', Icons.edit),
  clothing('Clothing', Icons.checkroom);

  const Category(this.label, this.icon);
  final String label;
  final IconData icon;
}
```

### Daily Objectives
By the end of the class, students should be able to:
- set up routing with `go_router`
- build bottom navigation, drawer, and tab layouts
- use enhanced enums to drive UI

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: how to return data from a screen; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | `go_router` routes and parameters; `NavigationBar`, `Drawer`, tabs |
| 0:30-0:45 | Dart Spotlight | `Category` enum; `Category.values` to build tabs |
| 0:45-1:05 | Live coding | Campus Store routes `/`, `/product/:id`, `/cart`, `/profile`; bottom bar; category tabs from the enum |
| 1:05-1:25 | Guided practice | News app with 3 tabs (enum-based) and a drawer |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Finish the News app: tabs, drawer, and a detail route with a path parameter.
- **Challenge:** Add a "Settings" route reachable from the drawer that uses a query parameter.

---

## Day 12: Forms and Validation

### Topics
**Flutter**
- `TextField` vs `TextFormField`
- `TextEditingController` and disposing it
- `InputDecoration` (labels, hints, icons, borders, error text)
- `Form`, `GlobalKey<FormState>`, validators, `validate()`, `save()`
- Keyboard types, `obscureText`, `textInputAction`, `FocusNode`, closing the keyboard

**Dart Spotlight**
- String methods: `trim`, `toLowerCase`, `contains`, `split`, `substring`, `padLeft`
- `int.tryParse`, `double.tryParse`
- `RegExp` for email and phone
- Extension methods: `extension StringX on String { bool get isValidEmail => ... }`

### Daily Objectives
By the end of the class, students should be able to:
- build forms with validation
- read, clean, and use input values
- write extension methods

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: `context.go` vs `context.push`, enhanced enum syntax; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | Controllers, `Form` and validators, keyboard and focus |
| 0:30-0:45 | Dart Spotlight | String methods, `tryParse`, `RegExp`, `isValidEmail` extension |
| 0:45-1:05 | Live coding | Campus Store login and register screens with validation |
| 1:05-1:25 | Guided practice | Registration form: name, email, phone, password, confirm password |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Build a "Contact Us" form with at least 5 validated fields.
- **Challenge:** Add `toTitleCase()` and a Nepali phone number validator as extensions.

---

## Day 13: More Inputs, Dialogs, and Bottom Sheets

### Topics
**Flutter**
- `Checkbox`, `Switch`, `RadioListTile`, `DropdownButtonFormField`, `Slider` (check the current Radio API before class, because recent Flutter versions changed how radio groups work)
- Date and time pickers
- `SnackBar`, `AlertDialog`, `showModalBottomSheet`
- Confirming dangerous actions (delete, logout)

**Dart Spotlight**
- Mixins: `mixin`, `with`, `mixin ... on`
- Mixin vs inheritance: when to use which
- A `ValidationMixin` shared by login and register forms

### Daily Objectives
By the end of the class, students should be able to:
- use all common input widgets
- show feedback with snackbars, dialogs, and bottom sheets
- share behaviour across classes with mixins

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: what `validate()` returns, extension syntax; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | Input widgets, pickers, snackbar, dialog, bottom sheet |
| 0:30-0:45 | Dart Spotlight | Mixins; move validators into a `ValidationMixin` |
| 0:45-1:05 | Live coding | Profile edit screen: gender radio, notifications switch, date of birth picker, a snackbar on save, a confirm dialog on logout, sort options in a bottom sheet |
| 1:05-1:25 | Guided practice | Job application form: dropdown, date picker, checkbox, slider |
| 1:25-1:30 | Wrap-up | Homework; Mini Project 1 is announced on Day 14 |

### Homework
- **Core:** Finish the job application form with full validation and a confirmation dialog.
- **Challenge:** Add a bottom sheet filter (price range slider and category checkboxes) to your Recipe List.

---

## Day 14: Theming and Responsive Design

### Topics
**Flutter**
- `ThemeData`, `ColorScheme.fromSeed`, Material 3
- Text themes and `Theme.of(context)`
- Light and dark mode (`themeMode`)
- `MediaQuery`, `LayoutBuilder`, `SafeArea`, breakpoints for phone and tablet
- Overview (5 min): Cupertino and adaptive widgets, accessibility (contrast, tap target size, text scaling, `Semantics`), localization with `intl`

**Dart Spotlight**
- Records: returning more than one value `(String, Color)`
- Patterns and destructuring: `final (label, color) = ...`
- Relational patterns in `switch`

```dart
(String, Color) stockStyle(int stock) => switch (stock) {
      0 => ('Out of stock', Colors.red),
      < 5 => ('Only $stock left', Colors.orange),
      _ => ('In stock', Colors.green),
    };

final (label, color) = stockStyle(product.stock);
```

### Daily Objectives
By the end of the class, students should be able to:
- create a consistent app theme with light and dark mode
- build layouts that adapt to screen size
- use records and patterns to return and unpack multiple values

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: mixin vs inheritance, how to show a snackbar; homework shows |
| 0:10-0:35 | Flutter concept (25 min) | Theme, colour scheme, text theme, dark mode, responsive layouts; 5-minute overview of adaptive, accessibility, localization |
| 0:35-0:50 | Dart Spotlight | Records and patterns with `stockStyle` |
| 0:50-1:10 | Live coding | Campus Store theme and dark mode toggle; grid with 2 columns on phones, 4 on tablets; stock badge using a record |
| 1:10-1:25 | Guided practice | Apply your own theme with dark mode to the News app |
| 1:25-1:30 | Wrap-up | Mini Project 1 brief (requirements and rubric) so students can plan tonight |

### Homework
- **Core:** Choose your Mini Project 1 idea and sketch the screens on paper.
- **Challenge:** Make one screen work well in both portrait and landscape.

---

## Day 15: Mini Project 1: Build Day

### Topics
- Building a complete multi-screen app independently
- Planning screens before coding

### Daily Objectives
By the end of the class, students should be able to:
- plan and build a multi-screen app without step-by-step guidance

### Requirements
Choose one: Travel guide, Food menu, or Portfolio app. It must include:
- a model class
- a list or grid with filter or search
- a detail screen
- a form with validation
- navigation (`go_router` with a bottom bar or tabs)
- a custom theme

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Brief | Requirements and rubric review |
| 0:10-0:20 | Plan | Students list screens, models, and routes on paper; teacher checks scope |
| 0:20-1:20 | Build | Students build; teacher circulates; common blockers explained on the board |
| 1:20-1:30 | Wrap-up | Commit and push; self-check against the requirements |

### Homework
- **Core:** Finish Mini Project 1 and push to GitHub before Day 16.

---

## Day 16: Mini Project 1 Demos and Final Project Briefing

### Topics
- Demo and feedback
- Common mistakes review
- Final project briefing: requirements, timeline, milestones, rubric

### Daily Objectives
By the end of the class, students should be able to:
- present their app and receive feedback
- understand the final project requirements and timeline

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:45 | Demos | 2 minutes per student; teacher grades with the rubric (larger batches: continue in the warm-ups of Days 17-18) |
| 0:45-0:55 | Review | Most common mistakes seen in the demos |
| 0:55-1:05 | Quiz 2 | Days 9-14 |
| 1:05-1:25 | Final project briefing | Requirements, timeline, rubric, example ideas, proposal template |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Write the final project proposal (template in the Final Project section). Due on Day 17.

---

# Phase 3: Async, State, and Real Data (Days 17-24)

---

## Day 17: Async Dart and FutureBuilder

### Topics
**Flutter**
- `FutureBuilder`: `ConnectionState`, `hasError`, `hasData`
- Why the future must not be created inside `build`
- Loading, error (with retry), and empty states
- The `mounted` check after `await`; using `BuildContext` after async gaps

**Dart Spotlight**
- Why async is needed (the UI must not freeze)
- `Future`, `async` / `await`, `then`
- `Future.delayed`, `Future.wait`
- `try` / `catch` / `on` / `finally`, `throw`, `rethrow`
- Custom exceptions

```dart
Future<List<Product>> fetchProducts() async {
  await Future.delayed(const Duration(seconds: 2));
  if (Random().nextBool()) throw NetworkException('No internet');
  return sampleProducts;
}
```

### Daily Objectives
By the end of the class, students should be able to:
- write async functions and handle their errors
- show loading, error, and data states with `FutureBuilder`
- use `BuildContext` safely after `await`

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Collect proposals; recall: record syntax, dark mode setup |
| 0:10-0:35 | Dart Spotlight (25 min) | Frozen-UI demo; `Future`, `async` / `await`, `Future.wait`; errors and custom exceptions |
| 0:35-0:45 | Flutter concept | `FutureBuilder` states; `mounted` |
| 0:45-1:05 | Live coding | Fake `ProductRepository` (2-second delay, random failure); loader, error with retry, grid |
| 1:05-1:25 | Guided practice | Fake weather screen with loading, error, and retry. Teacher reviews proposals one-on-one |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Finish the weather screen. Update your proposal with the teacher's feedback.
- **Challenge:** Load 3 fake sources in parallel with `Future.wait` and show the total load time.

---

## Day 18: State Management with Provider

### Topics
**Flutter**
- App state vs local (ephemeral) state
- Lifting state up and the "prop drilling" problem
- `InheritedWidget` idea (what Provider is built on)
- `ChangeNotifier`, `notifyListeners`
- `ChangeNotifierProvider`, `MultiProvider`
- `Consumer`, `context.watch`, `context.read`, `Selector`
- Overview (3 min): Riverpod, Bloc/Cubit, GetX

**Dart Spotlight**
- `==` and `hashCode` (why two equal products are not "equal" by default)
- Computed getters for totals
- `List.unmodifiable`: protecting state from outside changes
- `extends ChangeNotifier` vs `with ChangeNotifier`

### Daily Objectives
By the end of the class, students should be able to:
- manage app-wide state with Provider
- read and update state from any screen
- avoid unnecessary rebuilds

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: `FutureBuilder` states, what `rethrow` does; homework shows |
| 0:10-0:25 | Flutter concept | Prop drilling demo (callbacks through 3 levels), then Provider as the fix |
| 0:25-0:40 | Dart Spotlight | Equality, `hashCode`, `List.unmodifiable`, computed getters |
| 0:40-1:05 | Live coding | `CartProvider` (add, remove, quantity, total); cart badge; `ThemeProvider` |
| 1:05-1:25 | Guided practice (pairs) | To-Do app with Provider. Teacher finishes proposal approvals |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Finish the To-Do app: add, edit, delete, complete, filter (All / Active / Done).
- **Core:** Final project: create the repo, folder structure and theme.
- **Challenge:** Use `Selector` so only the badge rebuilds when the cart count changes.

---

## Day 19: HTTP Requests and JSON

### Topics
**Flutter**
- How a mobile app talks to a REST API
- The `http` package: GET, status codes
- Loading API data in a Provider
- Pull to refresh (`RefreshIndicator`)
- Pagination / infinite scroll (overview)
- Android internet permission
- DevTools network tab

**Dart Spotlight**
- `dart:convert`: `jsonDecode`, `jsonEncode`
- `Map<String, dynamic>`, `List<dynamic>`
- `factory Product.fromJson(...)`, `toJson()`
- `is`, `as`, nested JSON

### Daily Objectives
By the end of the class, students should be able to:
- fetch data from a REST API
- convert JSON into models and back
- show API data with loading, error, and empty states

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: `watch` vs `read`; homework shows |
| 0:10-0:25 | Dart Spotlight | Decode a JSON string in the Dart Lab; write `fromJson` / `toJson` |
| 0:25-0:40 | Flutter concept | `http` GET, status codes, where API calls belong, pull to refresh |
| 0:40-1:05 | Live coding | `ProductProvider` loads products from the API; pull to refresh; error state |
| 1:05-1:25 | Guided practice | Users Directory: list from a public API and detail screen |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Final project: build at least half of your screens with static data.
- **Challenge:** Finish the Users Directory and add search that filters the loaded users.

---

## Day 20: REST CRUD, dio, and the Service Layer

### Topics
**Flutter**
- POST, PUT/PATCH, DELETE with body and headers
- `dio`: base options, timeouts, `DioException`, interceptors
- Service and repository layer: the UI talks to the Provider, the Provider to the repository, and the repository to the ApiService
- Public fake APIs don't really save writes (show this in class so students don't think their code is broken)

**Dart Spotlight**
- Imports: `package:` vs relative, `as`, `show`, `hide`
- Splitting code into files and folders
- `abstract class ProductRepository` with `FakeProductRepository` and `ApiProductRepository`

### Daily Objectives
By the end of the class, students should be able to:
- create, update, and delete data through an API
- keep API logic out of widgets
- swap a fake data source for a real one

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: `fromJson`, what status 404 means; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | CRUD requests, `dio`, layer diagram |
| 0:30-0:45 | Dart Spotlight | Imports and the abstract repository |
| 0:45-1:05 | Live coding | `ApiService` with `dio`; `ProductRepository`; add product (POST) and delete (DELETE) |
| 1:05-1:25 | Guided practice | Add create, edit, and delete to the Users Directory |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Final project: finish all screens and navigation for Milestone 1 on Day 21.
- **Challenge:** Finish CRUD in the Users Directory and add a `dio` interceptor that logs every request.

---

## Day 21: Authentication, Tokens, and Saved Settings

### Topics
**Flutter**
- Login flow: send credentials, receive a token, store it, attach it
- `flutter_secure_storage` for tokens, `shared_preferences` for settings
- `AuthProvider`
- `go_router` redirect as a login guard
- Auto login on app start; logout
- Attaching the token with a `dio` interceptor

**Dart Spotlight (10 min)**
- `DateTime`: `now`, `parse`, `add`, `isAfter`, `difference`
- `Duration` (token expiry)

### Daily Objectives
By the end of the class, students should be able to:
- implement login, auto login, and logout
- store tokens securely and settings simply
- protect routes with a redirect

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: why use a repository; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | Login flow diagram; secure storage vs shared preferences; redirect guard |
| 0:30-0:40 | Dart Spotlight | `DateTime` and `Duration` for token expiry |
| 0:40-1:05 | Live coding | `AuthProvider`: log in, save the token, redirect; auto login; logout; dark mode saved with `shared_preferences` |
| 1:05-1:25 | Milestone 1 | Teacher checks each student's screens and navigation (5 min each); others add login to their project |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Add login and auto login to your final project (or Users Directory). Fix your Milestone 1 feedback.
- **Challenge:** Log the user out automatically when the token expires.

---

## Day 22: SQLite and Offline Data

### Topics
**Flutter**
- When to use a local database
- `sqflite`: open database, create table, insert, query, update, delete
- `toMap` / `fromMap` for rows
- Offline cache: show saved data first, then refresh from the network
- Overview: Hive CE, Drift, Isar

**Dart Spotlight (10 min)**
- `DateFormat`, `NumberFormat` from `intl`
- "2 hours ago" style relative time

### Daily Objectives
By the end of the class, students should be able to:
- create, read, update, and delete rows in SQLite
- cache API data for offline use
- format dates and currency

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: where to store a token; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | `sqflite` basics, offline cache strategy |
| 0:30-0:40 | Dart Spotlight | `intl` formatting |
| 0:40-1:00 | Live coding | Favourites saved in SQLite; products cached for offline use |
| 1:00-1:10 | Quiz 3 | Days 17-21 |
| 1:10-1:27 | Guided practice | Notes feature with `sqflite` showing "created 2 hours ago" |
| 1:27-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Build an Expense Tracker with `sqflite`: add with a date, list, delete, monthly total in currency format.
- **Challenge:** Group expenses under "Today", "Yesterday", and "Earlier".

---

## Day 23: Firebase Setup and Firebase Auth

### Topics
**Flutter**
- What Firebase is (Backend as a Service) and its main services
- FlutterFire CLI setup (`flutterfire configure`)
- Firebase Auth: sign up, login, logout, password reset
- Switching screens with `authStateChanges()`

**Dart Spotlight**
- `Future` vs `Stream`: one value vs many values over time
- `listen`, `await for`, `StreamSubscription`, cancelling in `dispose`
- `StreamBuilder`

### Daily Objectives
By the end of the class, students should be able to:
- connect a Flutter app to Firebase
- implement sign up, login, and logout with Firebase Auth
- explain streams and use `StreamBuilder`

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: SQLite vs shared preferences; homework shows |
| 0:10-0:25 | Flutter concept | Firebase overview; Auth methods |
| 0:25-0:40 | Dart Spotlight | Streams and `StreamBuilder` (live clock in the Dart Lab) |
| 0:40-1:05 | Live coding | Create a Firebase project, `flutterfire configure`, sign up / login / logout, `authStateChanges` |
| 1:05-1:25 | Guided practice | Students set up their own Firebase project and auth (extra time for setup problems) |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Finish Firebase Auth with password reset.
- **Challenge:** Add Google sign-in.

---

## Day 24: Cloud Firestore in Real Time

### Topics
**Flutter**
- Firestore data model: collections and documents
- Add, get, update, delete; queries (`where`, `orderBy`, `limit`)
- Real-time updates with `snapshots()` and `StreamBuilder`
- Security rules basics
- Overview: Firebase Storage, Cloud Messaging (push notifications)

**Dart Spotlight**
- `async*` and `yield` (stream generators)
- `StreamController`, broadcast streams

```dart
Stream<int> countdown(int from) async* {
  for (var i = from; i >= 0; i--) {
    await Future.delayed(const Duration(seconds: 1));
    yield i;
  }
}
```

### Daily Objectives
By the end of the class, students should be able to:
- read and write Firestore data in real time
- write basic security rules
- create their own streams

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: `Future` vs `Stream`; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | Firestore model, CRUD, queries, rules |
| 0:30-0:45 | Dart Spotlight | `countdown` stream in the Dart Lab; `StreamController` |
| 0:45-1:05 | Live coding | Orders saved to Firestore and shown in real time; rules so users see only their own orders |
| 1:05-1:25 | Guided practice | Shared Notes app: each user sees only their own notes |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Finish Shared Notes. Final project: connect the backend (REST API or Firebase) for Milestone 2 (Day 26).
- **Challenge:** Show a live comment count that updates for all users.

---

# Phase 4: Real-World Features and Production (Days 25-30)

---

## Day 25: Device Features and Packages

### Topics
**Flutter**
- Choosing a good package on pub.dev (likes, pub points, maintenance, platforms)
- Permissions: `AndroidManifest.xml`, `Info.plist`, `permission_handler`, denied vs permanently denied
- `image_picker` (camera and gallery)
- `url_launcher` (links, phone, email, maps)
- `share_plus`
- Overview: `geolocator`, local notifications

**Dart Spotlight**
- Sealed classes (Dart 3) for UI states
- Exhaustive `switch` and object patterns

```dart
sealed class UploadState {}
class Idle extends UploadState {}
class Uploading extends UploadState { Uploading(this.progress); final double progress; }
class Done extends UploadState { Done(this.url); final String url; }
class Failed extends UploadState { Failed(this.message); final String message; }

Widget buildStatus(UploadState state) => switch (state) {
      Idle() => const Text('Pick a photo'),
      Uploading(:final progress) => LinearProgressIndicator(value: progress),
      Done(:final url) => Image.network(url),
      Failed(:final message) => Text(message),
    };
```

### Daily Objectives
By the end of the class, students should be able to:
- evaluate and add packages safely
- request and handle permissions
- pick images and open links, calls, and maps
- model UI states with sealed classes

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: what `snapshots()` returns; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | Package evaluation, permissions flow, `image_picker`, `url_launcher`, `share_plus` |
| 0:30-0:45 | Dart Spotlight | Sealed `UploadState` with exhaustive `switch` |
| 0:45-1:05 | Live coding | Profile picture pick and upload state; contact buttons (call, email, map) |
| 1:05-1:25 | Guided practice | Add one device feature to the final project |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Finish the device feature in your final project.
- **Challenge:** Refactor one screen of your final project to use a sealed state class.

---

## Day 26: Animations and UX Polish

### Topics
**Flutter**
- Implicit animations: `AnimatedContainer`, `AnimatedOpacity`, `AnimatedScale`, `AnimatedSwitcher`
- `Hero` animations
- Explicit animations: `AnimationController`, `Tween`, `CurvedAnimation` (basics)
- Page transitions
- Overview: shimmer loaders, Lottie, `SliverAppBar` collapsing headers
- UX polish: empty states, clear errors, feedback on every action

**Dart Spotlight (10 min)**
- `with SingleTickerProviderStateMixin`: mixins in real Flutter code, and what `vsync` does

### Daily Objectives
By the end of the class, students should be able to:
- add simple, meaningful animations
- use Hero transitions
- improve the feel of an app with small UX details

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: what "permanently denied" means; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | Implicit vs explicit animations, Hero, polish ideas |
| 0:30-0:40 | Dart Spotlight | The ticker mixin |
| 0:40-1:00 | Live coding | Animated like button, Hero product image, shimmer loader, `SliverAppBar` on detail |
| 1:00-1:25 | Milestone 2 | Teacher checks state and real data in each project (students using Firebase can show theirs on Day 27); others add 3 UX improvements |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Add at least 3 animations or UX improvements to your final project.
- **Challenge:** Build an animated 3-page onboarding with a page indicator.

---

## Day 27: App Architecture and Clean Code

### Topics
**Flutter**
- Feature-first folder structure
- Layers: UI, state, repository and data source
- Dependency injection through constructors
- App config and `--dart-define`
- Central error handling
- `flutter_lints`, `dart format`, `flutter analyze`
- Git practice: branches, meaningful commits, `.gitignore`, no secrets in the repo

**Dart Spotlight**
- Generic classes and functions: `Result<T>`
- Class modifiers overview: `final`, `base`, `interface`, `sealed`

### Daily Objectives
By the end of the class, students should be able to:
- organise a project into clear layers
- write reusable generic code
- review someone else's code and give useful feedback

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: implicit vs explicit animation; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | Structure, layers, DI, config, lints, git practice |
| 0:30-0:45 | Dart Spotlight | `Result<T>` and class modifiers |
| 0:45-1:05 | Live coding | Refactor Campus Store to feature-first; use `Result<T>` in the repository; fix lint warnings |
| 1:05-1:25 | Peer review | Pairs swap repos and write 3 improvement points each; teacher checks Milestone 2 for students using Firebase |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Refactor your final project structure and fix your peer review points.
- **Challenge:** Use `--dart-define` to switch between development and production API URLs.

---

## Day 28: Testing

### Topics
**Flutter**
- Why test; unit, widget, and integration tests
- Unit tests: `test`, `expect`, `group`, `setUp`
- Widget tests: `pumpWidget`, `find`, `tap`, `pump`, `expect`
- Testing with a fake repository (from Day 20)
- `integration_test` (overview)
- Running `flutter test`

**Dart Spotlight (5 min)**
- `assert` for development checks

### Daily Objectives
By the end of the class, students should be able to:
- write unit and widget tests
- use fakes to test code that depends on an API

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: what a repository layer is; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | Test types, unit and widget test syntax, fakes |
| 0:30-0:35 | Dart Spotlight | `assert` |
| 0:35-1:00 | Live coding | Tests for `Product.fromJson` and `CartProvider`; widget test: "Add to cart" updates the badge |
| 1:00-1:25 | Guided practice | Write tests for your own project |
| 1:25-1:30 | Wrap-up | Homework |

### Homework
- **Core:** At least 3 unit tests and 1 widget test for your final project.
- **Challenge:** A widget test for your login form validation.

---

## Day 29: Debugging and Performance

### Topics
**Flutter**
- DevTools: inspector, performance, CPU, memory, network, logging
- Common runtime errors: `setState() called after dispose`, overflow, null errors, `BuildContext` across async gaps, unbounded height
- Performance: `const` widgets, builder lists, no heavy work in `build`, image sizes, smaller rebuilds with `Selector`
- Profile mode
- App lifecycle (`AppLifecycleState`) overview

**Dart Spotlight (10 min)**
- Isolates and `compute()` for heavy work

### Daily Objectives
By the end of the class, students should be able to:
- use DevTools to find bugs and slow code
- fix common runtime errors
- keep the UI smooth with heavy work moved off the main isolate

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: `pumpWidget` vs `pump`; homework shows |
| 0:10-0:30 | Flutter concept (20 min) | DevTools tour, common errors, performance rules |
| 0:30-0:40 | Dart Spotlight | `compute()` parsing a large JSON |
| 0:40-1:00 | Error of the day (5 samples) | Class debugs 5 broken samples together |
| 1:00-1:10 | Quiz 4 | Days 23-28 |
| 1:10-1:27 | Guided practice | Find and fix one bug or slow spot in your project with DevTools |
| 1:27-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Fix all `flutter analyze` warnings in your project. Feature-complete for Milestone 3 (Day 30).
- **Challenge:** Measure frame times before and after one performance fix.

---

## Day 30: Build, Release, and Publishing

### Topics
**Flutter**
- App name, package name (application ID), version (`version: 1.0.0+1`)
- App icon (`flutter_launcher_icons`), splash screen (`flutter_native_splash`)
- Debug vs profile vs release mode
- Keystore and `key.properties` (never commit them)
- `flutter build apk`, `flutter build appbundle`
- Google Play Console overview: listing, screenshots, privacy policy, testing tracks
- iOS release overview (Xcode, TestFlight)
- Flutter web build (short demo)

### Daily Objectives
By the end of the class, students should be able to:
- prepare an app for release
- generate a signed release APK / AAB
- explain the Play Store publishing steps

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Warm-up | Recall: what `compute` is for; homework shows |
| 0:10-0:35 | Flutter concept (25 min) | Release checklist, signing, build modes, store overview |
| 0:35-1:00 | Live coding | Campus Store icon, splash, app name, signed release APK installed on a phone |
| 1:00-1:27 | Milestone 3 | Teacher checks each project is feature complete and the release APK runs; others build their release APK |
| 1:27-1:30 | Wrap-up | Homework |

### Homework
- **Core:** Install your release APK on a friend's phone and list the bugs you find.

---

# Phase 5: Final Project (Days 31-33)

---

## Day 31: Final Project Lab I

### Topics
- Finishing the remaining features
- Bug fixing with teacher support
- Common problems explained for everyone

### Daily Objectives
By the end of the class, students should be able to:
- work through their remaining task list independently
- solve problems with teacher guidance

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:10 | Goals | Each student writes today's goal on the board or class chat |
| 0:10-0:45 | Build | Students work; teacher does one-on-one reviews (students behind on milestones first) |
| 0:45-0:55 | Board session | Teacher solves the 2-3 most common blockers for everyone |
| 0:55-1:20 | Build | one-on-one reviews continue |
| 1:20-1:30 | Wrap-up | Commit, push, update progress |

### Homework
- Finish all features. Only polish and documentation should remain.

---

## Day 32: Final Project Lab II: Polish, Documentation, and Rehearsal

### Topics
- UI polish and testing on a real device
- README, screenshots and demo video
- Presentation rehearsal

### Daily Objectives
By the end of the class, students should be able to:
- deliver a polished, tested app
- document the project clearly
- present with confidence

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:05 | Checklist | Go through the submission checklist together |
| 0:05-0:45 | Polish | Test on a real device, fix final bugs |
| 0:45-1:00 | Documentation | README and screenshots |
| 1:00-1:25 | Rehearsal | Pairs rehearse presentations (5 min each and feedback) |
| 1:25-1:30 | Wrap-up | Presentation order announced |

### Homework
- Record a 2-3 minute demo video. Complete the submission checklist before Day 33.

---

## Day 33: Final Presentations, Submission, and Course Review

### Topics
- Final presentations and viva
- Course review and next steps

### Daily Objectives
By the end of the class, students should be able to:
- present a complete Flutter app
- explain their architecture, state management, and data flow
- answer questions about their code

### Class Plan
| Time | Segment | What happens |
|------|---------|--------------|
| 0:00-0:05 | Setup | Projector and device check |
| 0:05-1:15 | Presentations | About 5 minutes per student: idea (1), live demo (2), code walkthrough (1), viva (1). For more than about 14 students, start on Day 32 or split into two sessions |
| 1:15-1:30 | Course review | Students open their Day 1 About Me app next to their final project; next steps; reflection |

### Homework
- Final reflection: what you learned, what was difficult, what app you want to build next.

---

# Final Project

## Timeline

| Day | Step | What is checked |
|-----|------|-----------------|
| Day 16 | Briefing | Requirements and rubric explained |
| Day 17 | Proposal | Idea, features, screens, backend choice submitted |
| Day 18 | Approval and setup | Proposal approved (with changes if it's too big); repo, folder structure and theme created that evening |
| Day 21 | Milestone 1 | All screens designed, navigation works (static data allowed) |
| Day 26 | Milestone 2 | State management and real data connected (students using Firebase can show it on Day 27) |
| Day 30 | Milestone 3 | All features done, local storage used, release APK works |
| Day 31-32 | Lab days | Bug fixes, tests, polish, README, demo video |
| Day 33 | Submission | Presentation and viva |

## Minimum Requirements

Every final project must include:

- at least 6 screens
- model classes with `fromJson` / `toJson`
- authentication (login / register / logout)
- navigation with `go_router`, plus a bottom nav, drawer, or tabs
- at least one form with validation
- state management with Provider (or another approved solution)
- data from a REST API or Firebase
- local storage (settings, token, favourites, or offline cache)
- loading, error, and empty states
- a custom theme (dark mode is a bonus)
- at least one device feature taught in class (camera or gallery, sharing, or opening links, calls and maps)
- at least one animation
- at least 3 unit tests and 1 widget test
- a signed release APK

## Proposal Template (due Day 17)

```
Project name:
Problem it solves (2-3 lines):
Target users:
Main features (5-8 points):
List of screens:
Backend choice: REST API / Firebase
Packages planned:
Stretch goals (optional):
```

## Suggested Final Project Ideas

- Campus Store / e-commerce app
- Expense tracker with charts
- Recipe app with favourites
- Event booking app
- Library management app
- Job portal app
- Fitness and habit tracker
- Travel planner
- Chat app (Firebase)
- Student attendance app
- Blog / news reader with bookmarks
- Doctor appointment booking app

## Submission Checklist (due Day 33)

- [ ] GitHub repository link (public or shared with the teacher)
- [ ] Clean commit history (not one single commit)
- [ ] README with: project description, features, screenshots, packages used, how to run, folder structure
- [ ] Release APK (in GitHub Releases or a shared drive)
- [ ] 2-3 minute demo video
- [ ] No API keys, keystores, or passwords committed
- [ ] Tests pass with `flutter test`
- [ ] `flutter analyze` shows no errors

---

# Evaluation

## Weight Distribution

| Component | Weight |
|-----------|--------|
| Daily homework and classroom tasks (including Dart Lab) | 15% |
| Quizzes (4 short quizzes) | 10% |
| Mini Project 1 | 10% |
| Attendance and participation | 5% |
| Final project milestones (Days 21, 26, 30) | 15% |
| Final project (submitted app) | 35% |
| Presentation and viva | 10% |

## Final Project Rubric (35 marks)

| Criteria | Marks | What "full marks" looks like |
|----------|-------|------------------------------|
| Features and requirements | 10 | All minimum requirements done and working |
| UI / UX quality | 6 | Consistent theme, responsive, good loading/error/empty states |
| Code quality and architecture | 7 | Clear layers, reusable widgets, no lint errors, meaningful names |
| State management and data | 5 | Correct use of Provider, clean API/Firebase integration |
| Testing | 3 | Required tests written and passing |
| Release and documentation | 4 | Signed APK, complete README, demo video |

## Mini Project 1 Rubric (10 marks)

| Criteria | Marks |
|----------|-------|
| Required screens and navigation | 3 |
| Layout and UI quality | 3 |
| Model class and form with validation | 2 |
| Code organisation (custom widgets, no huge files) | 2 |

---

# After the Course: What to Learn Next

- Riverpod or Bloc for larger apps
- Clean Architecture and dependency injection (`get_it`)
- Code generation (`freezed`, `json_serializable`)
- Push notifications with Firebase Cloud Messaging (in depth)
- Payment integration (Khalti, eSewa, Stripe)
- CI/CD for Flutter (GitHub Actions, Codemagic)
- Platform channels and native code
- Flutter for web and desktop

---

# Final Outcome

By the end of the course, students can design, build, test and release a complete Flutter app with a clean structure, real backend data, local storage and a polished feel. They learn Dart by using it inside real apps, and each of them leaves with a finished project on GitHub for their portfolio.
