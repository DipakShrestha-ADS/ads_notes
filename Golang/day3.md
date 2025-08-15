## Day 3: Functions and Pointers 🛠️

Today, we'll explore two fundamental concepts in Go: **functions**, which are the building blocks of your program's logic, and **pointers**, which give you more control over how your program uses memory.

-----

### Functions

A **function** is a reusable block of code that performs a specific task. You've already been using one: the `main` function\! Organizing your code into functions makes it cleaner, easier to understand, and less repetitive.

#### Defining and Calling Functions

You define a function with the `func` keyword, followed by the function name, a list of parameters, and the return type(s).

**Syntax:**

```go
func functionName(parameter1 type, parameter2 type) returnType {
    // code to be executed
    return value
}
```

**Example:**

```go
package main

import "fmt"

// greet is a function that takes one parameter, 'name', which is a string.
// It does not return any value.
func greet(name string) {
    // This line will be executed when the greet function is called.
    fmt.Println("Hello,", name, "!")
}

func main() {
    // This is the "calling" site. We are calling the 'greet' function.
    // We pass the string "Alice" as an argument to the function.
    greet("Alice")
    // We can call it again with a different argument.
    greet("Bob")
}
```

#### Multiple Return Values

A unique feature of Go is that functions can return multiple values. This is often used to return a result and an error status at the same time.

**Example:**

```go
package main

import "fmt"

// calculate takes two integers, 'a' and 'b'.
// It is declared to return two integer values.
func calculate(a int, b int) (int, int) {
    // Calculate the sum of a and b.
    sum := a + b
    // Calculate the difference between a and b.
    difference := a - b
    // Return both results. The order of the returned values
    // must match the order in the function signature.
    return sum, difference
}

func main() {
    // We call the 'calculate' function with 5 and 3.
    // We can assign the two returned values to two separate variables.
    s, d := calculate(5, 3)

    // Print the results.
    fmt.Println("Sum:", s)          // Output: Sum: 8
    fmt.Println("Difference:", d)   // Output: Difference: 2
}
```

#### Variadic Functions

A variadic function is one that can be called with a varying number of arguments. You define one by using the `...` syntax before the type of the last parameter.

**Example:**

```go
package main

import "fmt"

// sumAll takes a variable number of integers.
// The 'numbers ...int' syntax means 'numbers' will be a slice of integers
// inside the function, containing all the arguments passed.
func sumAll(numbers ...int) int {
    // Print the slice of numbers received by the function.
    fmt.Println("Numbers received:", numbers)
    // Initialize a variable 'total' to store the sum.
    total := 0
    // Use a for...range loop to iterate over the 'numbers' slice.
    for _, number := range numbers {
        // Add each number to the total.
        total += number
    }
    // Return the final sum.
    return total
}

func main() {
    // Call sumAll with two arguments.
    result1 := sumAll(1, 2)
    fmt.Println("Total 1:", result1) // Output: Total 1: 3

    // Call sumAll with four arguments.
    result2 := sumAll(10, 20, 30, 40)
    fmt.Println("Total 2:", result2) // Output: Total 2: 100
}
```

-----

### Pointers

#### What are Pointers?

Imagine your computer's memory is a giant street of houses, and each house has a unique address. A variable is like a piece of paper inside a house that has a value written on it (e.g., the number `10`).

A **pointer** is a special type of variable that doesn't store the value itself, but instead stores the **address** of the house where the value is kept. It "points" to the location of the data.

#### The `&` (address of) and `*` (dereference) operators

Go gives you two important operators to work with pointers:

  * **`&` (The "address of" operator):** When you place `&` in front of a variable, it gives you the memory address of that variable (i.e., it creates a pointer to it).
  * **`*` (The "dereference" operator):** When you have a pointer, placing `*` in front of it lets you see or change the value at the memory address it points to.

**Example:**

```go
package main

import "fmt"

func main() {
    // 'x' is a regular integer variable holding the value 10.
    x := 10
    // 'p' is a pointer variable. We use '&x' to get the memory address of 'x'
    // and store that address in 'p'. The type of 'p' is '*int' (pointer to an integer).
    p := &x

    fmt.Println("Value of x:", x)
    fmt.Println("Memory address of x:", &x)
    fmt.Println("Value of p (which is the address of x):", p)

    // To see the value that 'p' points to, we "dereference" it with '*'.
    fmt.Println("Value at the address p is pointing to:", *p) // Output: 10

    // We can change the original value of 'x' through the pointer.
    *p = 20 // This means "go to the address stored in p, and set the value there to 20".

    // The value of x has now been changed.
    fmt.Println("New value of x:", x) // Output: New value of x: 20
}
```

#### When to Use Pointers

You generally use pointers for two main reasons:

1.  **To allow a function to modify a variable that was passed to it.** By default, Go passes arguments to functions by value (it makes a copy). If you want the function to change the original variable, you must pass a pointer to it.
2.  **For efficiency.** When you have a very large data structure (like a big struct), copying it every time you pass it to a function can be slow. Passing a pointer (which is just a small memory address) is much faster.

-----

### Task Solutions

#### Task 1: Write a function that takes two integers and returns their sum and difference.

**Solution:** This is the exact example used in the "Multiple Return Values" section above.

```go
package main

import "fmt"

// This function is named 'sumAndDifference'.
// It takes two integer parameters, 'a' and 'b'.
// It is defined to return two integer values.
func sumAndDifference(a int, b int) (int, int) {
    // Calculate the sum and store it in the 'sum' variable.
    sum := a + b
    // Calculate the difference and store it in the 'diff' variable.
    diff := a - b
    // Return both calculated values.
    return sum, diff
}

func main() {
    // Define two numbers to work with.
    num1, num2 := 20, 8

    // Call the function and capture its two return values.
    s, d := sumAndDifference(num1, num2)

    // Print the results in a formatted string.
    fmt.Printf("The sum is %d and the difference is %d.\n", s, d)
}
```

#### Task 2: Create a function that swaps the values of two variables using pointers.

**Solution:**

```go
package main

import "fmt"

// The 'swap' function takes two parameters, 'a' and 'b'.
// Both parameters are pointers to integers (*int).
func swap(a *int, b *int) {
    // Create a temporary variable 'temp' to hold the value that 'a' points to.
    // We use '*a' to get the value at the address stored in 'a'.
    temp := *a

    // Set the value at the address 'a' to be the value at the address 'b'.
    *a = *b

    // Set the value at the address 'b' to be the value we stored in 'temp'.
    *b = temp
}

func main() {
    // Define two integer variables.
    x := 100
    y := 200

    fmt.Println("Before swap: x =", x, ", y =", y)

    // Call the 'swap' function. We must pass the memory addresses of 'x' and 'y'
    // using the '&' operator, because the function expects pointers.
    swap(&x, &y)

    fmt.Println("After swap:  x =", x, ", y =", y)
}
```

#### Task 3: Write a function that takes a slice of strings and returns a single concatenated string.

**Solution:**

```go
package main

import (
    "fmt"
    "strings" // Import the 'strings' package for its 'Join' function.
)

// The 'joinStrings' function takes one parameter: a slice of strings.
// It returns a single string.
func joinStrings(elements []string) string {
    // The 'strings.Join' function is a standard library helper that does exactly this.
    // It takes a slice of strings and a separator string.
    // It concatenates all elements with the separator in between.
    return strings.Join(elements, " ")
}

func main() {
    // Create a slice of strings.
    words := []string{"Go", "is", "fun", "and", "powerful!"}

    // Call the function with our slice.
    sentence := joinStrings(words)

    // Print the final result.
    fmt.Println(sentence)
}
```

#### Task 4: Implement a function that calculates the factorial of a number.

**Solution:**

```go
package main

import "fmt"

// The 'factorial' function calculates the factorial of a non-negative integer 'n'.
// Factorial of n (n!) is the product of all positive integers up to n.
// e.g., 5! = 5 * 4 * 3 * 2 * 1 = 120.
func factorial(n int) int {
    // Base case: The factorial of 0 is defined as 1.
    if n == 0 {
        return 1
    }

    // Initialize the result to 1.
    result := 1
    // Loop from n down to 1.
    for i := n; i > 0; i-- {
        // Multiply the result by the current number 'i'.
        result = result * i
    }
    // Return the final calculated result.
    return result
}

func main() {
    // The number for which we want to calculate the factorial.
    number := 5
    // Call the function.
    fact := factorial(number)

    // Print the result.
    fmt.Printf("The factorial of %d is %d.\n", number, fact)
}
```

#### Task 5: Refactor your `Person` struct to include a method that prints the person's details.

**Solution:** A **method** is a function that is associated with a specific type.

```go
package main

import "fmt"

// Define the Person struct as before.
type Person struct {
    Name string
    Age  int
}

// This is a METHOD, not a function.
// The '(p Person)' part before the method name is called the "receiver".
// It declares that this method "belongs" to the Person struct.
// Inside the method, 'p' refers to the instance of the struct it was called on.
func (p Person) printDetails() {
    fmt.Printf("Name: %s, Age: %d\n", p.Name, p.Age)
}

func main() {
    // Create an instance of the Person struct.
    person1 := Person{Name: "Alice", Age: 30}
    person2 := Person{Name: "Bob", Age: 25}

    // To call the method, we use the dot notation on the struct instance.
    person1.printDetails()
    person2.printDetails()
}
```