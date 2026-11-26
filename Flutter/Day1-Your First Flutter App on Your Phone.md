# Day 1 - Your First Flutter App on Your Phone

## What You Will Learn Today

- What Flutter is and why so many apps are built with it
- How Flutter is different from native apps and React Native
- How to check your setup with `flutter doctor`
- How to create a Flutter app and run it on your own phone
- What the main folders in a Flutter project are for
- The difference between hot reload and hot restart
- Your first Dart: `main()`, `runApp()`, variables, and string interpolation
- How to build an About Me screen and a Dart Lab screen

---

## 1. What Is Flutter

Think about the apps on your phone. Each one has screens, buttons, lists, and forms. Normally a company needs two teams to build them: one team writes the Android app in Kotlin, and another team writes the iPhone app in Swift. Two teams, two codebases, double the work.

Flutter solves this. Flutter is a free, open-source toolkit made by Google for building apps. You write your app once, and the same code runs on:

- Android phones
- iPhones
- the web
- Windows, macOS, and Linux desktops

Flutter apps are written in a language called Dart. Dart is also made by Google. If you know JavaScript, Dart will feel familiar very quickly.

You don't need to learn Dart before starting Flutter. In this course you learn Dart inside your app, a little each day, and you see every result on your phone.

---

## 2. Why Use Flutter

| Reason | What it means for you |
|--------|-----------------------|
| One codebase | Write the app once and run it on Android, iOS, web, and desktop |
| Hot reload | Save your code and see the change on your phone in about a second |
| Beautiful UI | Flutter draws every pixel itself, so your app looks the same on every phone |
| Fast apps | Your Dart code is compiled to native machine code for the release version |
| Big community | Thousands of free packages on pub.dev for maps, cameras, payments, and more |
| Used by real companies | Apps from Google, BMW, Alibaba, and many startups are built with Flutter |

---

## 3. Flutter vs Native vs React Native

There are three common ways to build a mobile app.

| | Native | React Native | Flutter |
|--|--------|--------------|---------|
| Language | Kotlin (Android), Swift (iOS) | JavaScript or TypeScript | Dart |
| Codebases | Two separate apps | One | One |
| How the UI is drawn | Uses the phone's own buttons and lists | Uses the phone's own buttons and lists, controlled from JavaScript | Flutter draws its own UI with its own engine |
| Best for | Apps that need deep phone features | Teams that already know React | Fast development with a consistent, custom look |

Native is still a great choice for some apps. But for most apps, building once with Flutter saves a lot of time.

---

## 4. How Flutter Draws the Screen

In Flutter, everything you see is a widget. A piece of text is a widget. A button is a widget. Even the padding around a button is a widget.

You put widgets inside other widgets to build a screen, like stacking boxes inside boxes:

```
App
  Screen
    Top bar with a title
    Column
      Text: "Hi, I am Asha"
      Text: "I live in Kathmandu"
      Button
```

Flutter takes this tree of widgets and paints it on the screen using its own rendering engine. That is why a Flutter app looks the same on a cheap Android phone and on a new iPhone.

While you are developing, Flutter runs your app in debug mode. Debug mode is what makes hot reload possible. When you build the final app for users, Flutter compiles everything into fast native code.

We will study widgets properly tomorrow. Today you just need to know: screens are made of widgets inside widgets.

---

## 5. Checking Your Setup with flutter doctor

You installed Flutter in the setup session. Let's make sure everything is ready. Open a terminal and run:

```bash
flutter doctor
```

Flutter checks your computer and prints a list. Each line starts with a tick when that part is ready, or a cross or exclamation mark when something needs attention. You will see lines for:

- the Flutter SDK
- the Android toolchain (needed to build Android apps)
- Xcode (only on a Mac, only needed for iPhone apps)
- Chrome (for web apps)
- Android Studio and VS Code
- connected devices

For this course, Flutter, the Android toolchain, and VS Code (or Android Studio) must be ready. Xcode is optional.

If the Android toolchain shows a problem about licenses, run this and type `y` for each one:

```bash
flutter doctor --android-licenses
```

---

## 6. Getting Your Phone Ready

Running the app on your own phone is the best way to learn. You can hold your app in your hand.

### Step 1 - Turn on Developer options

1. Open Settings on your Android phone.
2. Go to About phone.
3. Find Build number and tap it 7 times.
4. You will see a message saying you are now a developer.

### Step 2 - Turn on USB debugging

1. Go back to Settings.
2. Open Developer options (sometimes inside System).
3. Turn on USB debugging.

### Step 3 - Connect and check

Connect your phone to your laptop with a USB cable. When the phone asks "Allow USB debugging?", tap Allow. Then run:

```bash
flutter devices
```

You should see your phone in the list, for example:

```
SM A515F (mobile) • R58N12ABCDE • android-arm64 • Android 13 (API 33)
```

### No phone? Use the emulator

If you don't have an Android phone, open Android Studio, go to Device Manager, and start an emulator. It will show up in `flutter devices` just like a phone.

---

## 7. Creating Your First App

### Step 1 - Create the project

In your terminal, go to the folder where you keep your course work and run:

```bash
flutter create about_me
```

Flutter creates a full project in a new folder called `about_me`.

Project names must be all lowercase, with underscores between words. `about_me` is fine. `AboutMe` or `about-me` will give an error.

### Step 2 - Open it in VS Code

```bash
cd about_me
code .
```

`code .` opens the current folder in VS Code. If that command doesn't work, open VS Code and use File, then Open Folder.

### Step 3 - Run the app

Make sure your phone is connected, then run:

```bash
flutter run
```

You can also press F5 in VS Code.

The first build takes a few minutes because Flutter downloads and builds the Android parts. Later runs are much faster.

When it finishes, a counter app appears on your phone. Tap the plus button and watch the number go up. This is the demo app Flutter creates for every new project.

You just ran your first Flutter app on your own phone.

---

## 8. Understanding the Project Structure

Your `about_me` folder has a lot of files. You only need a few of them right now.

| File or folder | What it is for |
|----------------|----------------|
| `lib/` | Your Dart code lives here. You will spend almost all your time in this folder |
| `lib/main.dart` | The starting point of the app |
| `pubspec.yaml` | The project settings: app name, version, packages, images, and fonts |
| `android/` | The Android project. Flutter manages it, you rarely touch it |
| `ios/` | The iPhone project. Same as above |
| `web/`, `windows/`, `macos/`, `linux/` | Projects for the other platforms |
| `test/` | Automated tests (we write these on Day 28) |
| `analysis_options.yaml` | Rules that warn you about code style problems |
| `build/` | Files Flutter generates when it builds. Never edit these |

If you only remember two things, remember these: your code goes in `lib/`, and your project settings go in `pubspec.yaml`.

---

## 9. Hot Reload and Hot Restart

This is the feature that makes Flutter fun to work with.

### Try hot reload

1. Open `lib/main.dart`.
2. Find this line:

```dart
home: const MyHomePage(title: 'Flutter Demo Home Page'),
```

3. Change only the text inside the quotes:

```dart
home: const MyHomePage(title: 'My First Flutter App'),
```

4. Save the file.

Look at your phone. The title changed in about a second, and the app didn't restart. If you had tapped the counter up to 5, it is still 5.

In VS Code, saving the file triggers hot reload automatically. If you started the app with `flutter run` in a terminal, press `r` in that terminal.

### Hot reload vs hot restart

| | Hot reload | Hot restart |
|--|-----------|-------------|
| How | Save the file, or press `r` | Press `R` (capital), or the restart button in VS Code |
| Speed | About 1 second | A few seconds |
| Keeps app state | Yes, the counter keeps its value | No, the app starts fresh |
| Use it when | You change how something looks | Hot reload didn't show your change, or you changed code in `main()` |

Some changes need a full stop and `flutter run` again. For example, when you add a new package or change files inside `android/`.

---

## 10. Dart Spotlight: main() and runApp()

Every Dart program starts from a function called `main()`. In a Flutter app, `main()` lives in `lib/main.dart`:

```dart
void main() {
  runApp(const MyApp());
}
```

Line by line:

- `void main()` is the starting point. When the app opens, Dart runs this function first.
- `void` means the function doesn't give back any value.
- `runApp(...)` takes a widget and makes it the whole app on the screen.
- `const MyApp()` is the top widget of the app. Everything else lives inside it.

So the flow when your app opens is simple: Dart runs `main()`, `main()` calls `runApp()`, and `runApp()` shows your app.

---

## 11. Dart Spotlight: Variables

A variable is a named box that stores a value. Here are the basic types you need today:

```dart
String name = 'Asha';        // text
int age = 20;                // whole numbers
double height = 5.4;         // numbers with a decimal point
bool isStudent = true;       // true or false
num marks = 85;              // any number, int or double
var city = 'Kathmandu';      // Dart works out the type for you (String)
```

| Type | Stores | Example |
|------|--------|---------|
| `String` | Text | `'Asha'` |
| `int` | Whole numbers | `20` |
| `double` | Decimal numbers | `5.4` |
| `bool` | True or false | `true` |
| `num` | Any number | `85` or `85.5` |
| `var` | Dart decides the type from the value | `var city = 'Kathmandu';` |

A few rules to remember:

- Every statement ends with a semicolon `;`.
- Text goes inside quotes. Dart accepts single quotes `'Asha'` or double quotes `"Asha"`. Flutter code usually uses single quotes.
- Once a variable has a type, it keeps it. If `city` is a `String`, you can't later put a number in it. Dart will show a red error before you even run the app. This is a good thing. It catches mistakes early.

Tomorrow you will learn `final` and `const`, which are used even more than `var` in Flutter.

---

## 12. Dart Spotlight: String Interpolation

Interpolation means putting a variable's value inside a piece of text.

```dart
String name = 'Asha';
int age = 20;

String intro = 'Hello, I am $name';          // Hello, I am Asha
String nextYear = 'Next year I will be ${age + 1}';   // Next year I will be 21
```

Line by line:

- `$name` puts the value of `name` into the text.
- `${age + 1}` is for anything more than a plain variable name. Dart works out `age + 1` first, then puts the result into the text.

You will use interpolation all the time in Flutter, because most text on screen comes from variables:

```dart
Text('Hello, I am $name')
```

For text that runs over several lines, use three quotes:

```dart
String bio = '''
I am a student.
I am learning Flutter.
''';
```

---

## 13. Dart Spotlight: Comments, print, and debugPrint

### Comments

Comments are notes for humans. Dart ignores them.

```dart
// This is a one-line comment

/*
  This is a comment
  over several lines
*/

/// This is a documentation comment.
/// Use it above a class or function to explain what it does.
```

### print and debugPrint

Sometimes you want to check a value while the app is running. `print()` writes it to the Debug Console in VS Code (or the terminal):

```dart
print('The age is $age');
```

In Flutter, use `debugPrint()` instead:

```dart
debugPrint('The age is $age');
```

`debugPrint()` works the same way, but it is safer on Android when you print a lot of lines at once. Flutter's code checker also warns you if you leave `print()` in your app.

These are for checking things while you code. In this course, results you want to show go on the screen, inside the app.

---

## 14. Building the About Me Screen

Now let's replace the counter demo with our own screen.

### Step 1 - Clear main.dart

Open `lib/main.dart`, select everything, and delete it.

### Step 2 - Delete the demo test

Delete the file `test/widget_test.dart`. It tests the counter demo, which no longer exists, so it would show a red error saying `MyApp` isn't a class. We write our own tests on Day 28.

### Step 3 - Write the About Me app

Type this into `lib/main.dart`:

```dart
import 'package:flutter/material.dart';

import 'dart_lab_screen.dart';

void main() {
  runApp(const AboutMeApp());
}

class AboutMeApp extends StatelessWidget {
  const AboutMeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'About Me',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: Colors.teal),
      home: const AboutMeScreen(),
    );
  }
}

class AboutMeScreen extends StatelessWidget {
  const AboutMeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // My information, stored in variables
    String name = 'Asha Sharma';
    int age = 20;
    String city = 'Kathmandu';
    String course = 'Flutter App Development';

    return Scaffold(
      appBar: AppBar(title: const Text('About Me')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Hi, I am $name',
              style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Text('I am $age years old', style: const TextStyle(fontSize: 18)),
            Text('I live in $city', style: const TextStyle(fontSize: 18)),
            Text('I am learning $course', style: const TextStyle(fontSize: 18)),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const DartLabScreen()),
          );
        },
        icon: const Icon(Icons.science),
        label: const Text('Dart Lab'),
      ),
    );
  }
}
```

The file shows an error on the `dart_lab_screen.dart` line until you create that file in the next section. That's expected.

### What each part does

You don't need to understand every widget today. We go through widgets properly on Day 2. For now, focus on the parts you can change.

- `import 'package:flutter/material.dart';` brings in all of Flutter's ready-made widgets.
- `import 'dart_lab_screen.dart';` brings in the Dart Lab screen we create next.
- `main()` calls `runApp()` with our app, `AboutMeApp`.
- `MaterialApp` sets up the whole app: its title, its colours, and its first screen.
- `debugShowCheckedModeBanner: false` hides the red "DEBUG" ribbon in the corner.
- `ThemeData(colorSchemeSeed: Colors.teal)` picks the app's colours from one starting colour. Try `Colors.orange` or `Colors.indigo`.
- `home: const AboutMeScreen()` says which screen to show first.
- Inside `AboutMeScreen`, the four variables hold your information.
- `Scaffold` gives the screen its basic layout: a top bar, a body, and a floating button.
- `Column` puts its children one below the other.
- Each `Text` uses string interpolation to show a variable.
- `SizedBox(height: 16)` adds a little empty space.
- The floating button opens the Dart Lab screen. We learn how screen navigation works on Day 10. Today, just copy it.

### Step 4 - Make it yours

Change the four variables to your own name, age, city, and course. Save, and watch your phone update.

---

## 15. Adding the Dart Lab Screen

The Dart Lab is a screen where you try out Dart and see the results straight away. Every day in this course, you will add new cards to it.

### Step 1 - Create the file

In the `lib` folder, create a new file called `dart_lab_screen.dart`.

### Step 2 - Add the starter code

```dart
import 'package:flutter/material.dart';

class DartLabScreen extends StatelessWidget {
  const DartLabScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Day 1: variables and string interpolation
    const String name = 'Asha';
    int age = 20;
    double price = 499.5;
    bool isStudent = true;

    final results = <String, String>{
      'Hello': 'Hello, $name!',
      'Next year': 'You will be ${age + 1}',
      'Price with VAT': 'Rs. ${price * 1.13}',
      'Student?': '$isStudent',
      // Add your own cards below this line
    };

    return Scaffold(
      appBar: AppBar(title: const Text('Dart Lab')),
      body: ListView(
        children: [
          for (final item in results.entries)
            Card(
              child: ListTile(
                title: Text(item.key),
                subtitle: Text(item.value),
              ),
            ),
        ],
      ),
    );
  }
}
```

### Step 3 - Open the Dart Lab

Save both files. The error in `main.dart` disappears. Tap the Dart Lab button on your phone. You should see four cards:

```
Hello            Hello, Asha!
Next year        You will be 21
Price with VAT   Rs. 564.435
Student?         true
```

### How the Dart Lab works

- The variables at the top are what we are practising today.
- `results` is a list of pairs. The left side is the card title, the right side is the result.
- Each pair becomes one card on the screen.

To add a card, add one line inside `results`:

```dart
'My city': 'I live in Kathmandu',
```

You may notice two things we haven't explained: the `for` inside `children`, and the `<String, String>{...}`. That's on purpose. You will learn exactly how they work on Day 5 and Day 6. For now, just add lines to `results`.

### Try it

Change `age` to `25` and save. The card changes to "You will be 26" in about a second. This is how you will learn Dart in this course: change a value, save, and see the result.

---

## 16. Common Day 1 Problems

| Problem | What to do |
|---------|-----------|
| `flutter: command not found` | Flutter isn't in your PATH. Ask the teacher to check your setup |
| Phone doesn't appear in `flutter devices` | Check the cable (some cables only charge), unlock the phone, and tap Allow on the USB debugging popup |
| First build is very slow | Normal. The first Android build can take several minutes |
| Build fails with a Gradle error | Run `flutter clean`, then `flutter run` again. If it still fails, show the error to the teacher |
| A red screen appears on the phone | Read the first line of the error. It usually names the problem and the file |
| You saved but nothing changed | Try hot restart (`R`). If that doesn't work, stop the app and run it again |
| Red underline in VS Code | Hover over it to read the message. Often it's a missing `;`, quote, or bracket |
| Error in `test/widget_test.dart` about `MyApp` | Delete that file. It belongs to the counter demo you replaced |

---

## Summary

Here is what you covered today:

- Flutter is Google's toolkit for building apps for Android, iOS, web, and desktop from one codebase.
- Flutter apps are written in Dart, and everything on the screen is a widget.
- `flutter doctor` checks your setup, `flutter create` makes a new project, and `flutter run` runs it.
- Your code lives in `lib/`, and your project settings live in `pubspec.yaml`.
- Hot reload updates the app in about a second and keeps its state. Hot restart starts the app fresh.
- Every Dart program starts at `main()`. In Flutter, `main()` calls `runApp()` to show the app.
- Variables store values. The basic types are `String`, `int`, `double`, `bool`, and `num`, and `var` lets Dart choose the type.
- String interpolation puts values inside text: `'$name'` for a variable and `'${age + 1}'` for an expression.
- `debugPrint()` is for checking values while you code. Results you want to show go on the screen.

---

## Practice Tasks

1. Run `flutter doctor` and fix anything that is marked as a problem.
2. Create the `about_me` app and run it on your phone or emulator.
3. Change the demo app's title, save, and watch hot reload work.
4. Replace the counter app with the About Me screen, using your own information.
5. Change the theme colour in `ThemeData` to your favourite colour.
6. Add the Dart Lab screen and add 3 cards of your own.

---

## Homework

### Core

Complete your About Me app so that it shows:

- your name
- your course name
- your hobby
- today's date as text (for example, `String today = '25 November 2026';`)

Every value must come from a variable and appear on screen using string interpolation.

Then commit and push your work to your `flutter-course` GitHub repo:

```bash
git add .
git commit -m "day-01: about me app and dart lab"
git push
```

### Challenge

In the Dart Lab, calculate and show your age in months and in days, using your `age` variable. For example:

```dart
'Age in months': '${age * 12} months',
'Age in days': 'About ${age * 365} days',
```

Then add one more card of your own idea that uses a calculation inside `${ }`.

---

## Class Project - Level 1

### Story So Far

This is the very first day. Before we start the Campus Store app tomorrow, you build a small warm-up app to get comfortable with Flutter, hot reload, and Dart variables.

### Today's Project Level

| Action | Path from `about_me/` | Why |
|--------|-----------------------|-----|
| Replace | `lib/main.dart` | The About Me app and screen |
| Create | `lib/dart_lab_screen.dart` | The Dart Lab, where you will practise Dart every day |
| Delete | `test/widget_test.dart` | It tests the counter demo, which is gone |

### Completed Level

At the end of today, your project looks like this (only the files you changed are shown):

```text
about_me/
  lib/
    main.dart
    dart_lab_screen.dart
  pubspec.yaml
```

Completion checklist:

- The app runs on your phone or emulator without errors.
- The About Me screen shows your own information from variables.
- The Dart Lab button opens the Dart Lab screen.
- The Dart Lab shows at least 7 cards: the 4 starter cards and 3 of your own.
- Your work is pushed to GitHub.
- You can explain what `main()`, `runApp()`, and string interpolation do without reading the code.

### Next Level

Tomorrow you start the Campus Store app in a new project and learn what widgets really are, how `MaterialApp` and `Scaffold` work, and when to use `final` and `const`. Keep this `about_me` project too. Your Dart Lab lives here, and you will add new cards to it in almost every class. Continue with [Day 2](<Day2-Widgets Fundamentals.md>).
