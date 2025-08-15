## Day 1: Introduction to Go 🚀

Welcome to the first day of your Go journey\! Today, we'll cover the absolute basics, from understanding what Go is to writing and running your very first program.

-----

### What is Go?

Go, often called **Golang**, is a programming language created at Google in 2009. Think of it as a modern language built to solve modern problems.

  * **Statically Typed:** This means the type of a variable is known at compile-time (before you run the program). It's like having a very strict grammar checker for your code, which helps catch many common errors early. For example, you can't accidentally try to do math with a word.
  * **Compiled:** Go code is converted directly into machine code that your computer's processor can execute. This makes Go programs incredibly fast and efficient, unlike interpreted languages (like Python or JavaScript) which are translated on the fly.
  * **Designed for Concurrency:** Go makes it remarkably easy to have your program do multiple things at the same time. This is a huge advantage for building web servers and other applications that need to handle many tasks simultaneously.

-----

### Why Learn Go?

Learning Go is a great investment for any developer. Here's why:

  * **High Demand:** Go is the backbone of many modern tools in cloud computing and DevOps, like Docker and Kubernetes. Companies are actively looking for Go developers to build fast and scalable backend services.
  * **Excellent Performance:** Because it's a compiled language, Go runs nearly as fast as C or C++, but with a much simpler syntax. This means you get high performance without the complexity.
  * **Simple and Clean Syntax:** The creators of Go intentionally kept the language small and easy to learn. It has a clean, readable syntax that makes it easier to write and maintain code. You'll spend less time looking up syntax and more time building things.

-----

### Setting up the Go Development Environment

Before you can write code, you need to set up your workshop.

#### Installation

The first step is to install the Go toolchain. This includes the compiler and other tools you'll need.

1.  Go to the official Go downloads page: [https://golang.org/dl/](https://golang.org/dl/)
2.  Download the installer for your operating system (Windows, macOS, or Linux).
3.  Run the installer and follow the on-screen instructions. It's a straightforward process.
4.  To verify the installation, open your terminal or command prompt and type:
    ```sh
    go version
    ```
    You should see a message displaying the installed Go version, like `go version go1.22.0 windows/amd64`.

#### GOPATH and Go Modules

In the past, Go used a system called `GOPATH` to manage code workspaces. While it's good to know the term, modern Go development uses **Go Modules**.

**Go Modules** is the dependency management system. Think of it like a shopping list for your project. When your project needs code written by someone else (a "package" or "library"), Go Modules automatically downloads and manages it for you. You don't need to configure a `GOPATH` anymore; you can create your projects anywhere on your computer.

-----

### Your First Go Program: "Hello, World\!"

Let's write the traditional first program. Create a new folder for your project, and inside it, create a file named `main.go`.

```go
// This line declares the package for the current file. 'main' is a special name
// that tells the Go compiler that this is an executable program.
package main

// The 'import' keyword is used to include code from other packages.
// 'fmt' (short for format) is a standard library package for formatted I/O
// (like printing text to the console).
import "fmt"

// 'func main()' is the main entry point of the application. When you run the
// program, the code inside this function is the first to be executed.
func main() {
    // 'fmt.Println' is a function from the 'fmt' package that prints a line of
    // text to the console. It automatically adds a newline character at the end.
    fmt.Println("Hello, World!")
}
```

**To run this program:**

1.  Open your terminal and navigate to the folder where you saved `main.go`.
2.  Run the command:
    ```sh
    go run main.go
    ```
3.  You'll see the output: `Hello, World!`

-----

### Basic Go Syntax

Let's break down the fundamental building blocks of Go.

#### Packages and Imports

Every Go file starts with a `package` declaration. Packages are Go's way of organizing and reusing code. The `main` package is special; it tells Go to create an executable file. To use code from other packages, you use the `import` keyword.

#### Functions (`func`)

A function is a block of code that performs a specific task. You declare a function using the `func` keyword. The `main` function is the starting point of every executable Go program.

#### Variables (`var`, `:=`)

A variable is a container for storing a value.

You can declare a variable in two main ways:

1.  **Using the `var` keyword:** This is the more explicit way.
    ```go
    // Declare a variable named 'age' of type 'int'
    var age int
    // Assign the value 30 to it
    age = 30

    // You can also declare and assign in one line
    var name string = "Alice"
    ```
2.  **Using the Short Declaration Operator `:=`:** This is a more common and concise way. Go automatically figures out the type of the variable based on the value you give it.
    ```go
    // Declare a variable 'isLearning' and Go infers its type is 'bool'
    isLearning := true
    ```
    **Note:** You can only use `:=` inside a function.

#### Basic Data Types

Go has several built-in data types:

  * `int`: Used for whole numbers (e.g., `-10`, `0`, `42`).
  * `float64`: Used for decimal numbers (e.g., `3.14`, `-0.01`).
  * `string`: Used for text. String values are enclosed in double quotes (`"`).
  * `bool`: Represents a truth value, which can be either `true` or `false`.

-----

### Task Solutions

Here are the solutions and explanations for today's tasks.

#### Task 1: Install Go on your machine.

**Solution:** Follow the installation steps mentioned in the "Setting up the Go Development Environment" section above. This involves downloading the installer from [golang.org/dl/](https://golang.org/dl/) and running it.

#### Task 2: Write and run the "Hello, World\!" program.

**Solution:** The code and instructions are provided in the "Your First Go Program: 'Hello, World\!'" section. The key is to save the code in a `main.go` file and execute it from your terminal using `go run main.go`.

#### Task 3: Declare variables of different data types and print them.

**Solution:** Create a file named `variables.go` and add the following code.

```go
// Every executable program must be in the 'main' package.
package main

// We import the 'fmt' package to print output to the console.
import "fmt"

// The main function where our program execution begins.
func main() {
    // --- Using the 'var' keyword ---

    // Declare a string variable to store a name.
    var personName string = "Bob"
    // Print the name and its value.
    fmt.Println("Name:", personName)

    // Declare an integer variable for age.
    var personAge int = 35
    // Print the age.
    fmt.Println("Age:", personAge)


    // --- Using the Short Declaration Operator `:=` ---

    // Declare a float64 variable for height, Go infers the type.
    heightInMeters := 1.85
    // Print the height.
    fmt.Println("Height:", heightInMeters)

    // Declare a boolean variable to represent employment status.
    isEmployed := true
    // Print the employment status.
    fmt.Println("Is Employed:", isEmployed)
}
```

**Explanation:** This program demonstrates both ways of declaring variables (`var` and `:=`) for each of the basic data types. The `fmt.Println` function is used to display the name of the variable and its stored value.

#### Task 4: Write a program that takes your name as input and prints a greeting.

**Solution:** This task requires reading input from the user. We'll use another standard library package called `bufio` to help with this. Create a file named `greeting.go`.

```go
// This program must be in the 'main' package to be executable.
package main

// We need to import three packages this time:
import (
    "bufio" // To read text from the user.
    "fmt"   // To print messages.
    "os"    // Provides a way for our program to interact with the operating system, like reading standard input.
    "strings" // Provides utility functions for strings, like trimming spaces.
)

func main() {
    // Print a message to the user, asking for their name.
    fmt.Print("Please enter your name: ")

    // Create a new reader that reads from 'os.Stdin' (standard input, which is the keyboard).
    reader := bufio.NewReader(os.Stdin)

    // Read the text the user types until they press the Enter key.
    // The result is stored in 'name', and any potential error is stored in 'err'.
    name, err := reader.ReadString('\n')

    // It's good practice to check if an error occurred during input reading.
    if err != nil {
        // If there was an error, print an error message and exit.
        fmt.Println("An error occurred while reading input. Please try again.", err)
        return
    }

    // The name read includes the Enter key press ('\n'). We use 'strings.TrimSpace'
    // to remove any leading/trailing whitespace, including the newline character.
    name = strings.TrimSpace(name)

    // Print a personalized greeting message using the name provided by the user.
    fmt.Println("Hello,", name, "! Welcome to Go.")
}
```

**How to run it:**

1.  `go run greeting.go`
2.  The program will pause and wait. Type your name and press Enter.
3.  It will then print the greeting.

#### Task 5: Explore the official Go documentation.

**Solution:** The best place to start is the official documentation website: [https://golang.org/doc/](https://golang.org/doc/).

**What to look for:**

  * **"A Tour of Go":** This is an interactive tutorial that is highly recommended for beginners.
  * **"Effective Go":** A document that gives tips on writing clear, idiomatic Go code. It's a bit more advanced, but it's good to know it exists.
  * **"Package Documentation":** You can look up standard library packages like `fmt` to see all the functions they provide. For example, check out the page for the `fmt` package to see what else you can do besides `Println`.