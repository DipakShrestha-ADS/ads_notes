### Day 2: Control Structures and Data Structures 🧠

Today we're moving on to the core logic and data handling in Go. You'll learn how to make decisions, repeat actions, and store collections of data.

-----

### Control Structures

Control structures allow you to direct the flow of your program's execution.

#### `if-else` Statements

The `if-else` statement is used to execute code based on a condition. It's the primary way your program can make decisions.

**Syntax:**

```go
if condition {
    // code to run if condition is true
} else if anotherCondition {
    // code to run if anotherCondition is true
} else {
    // code to run if all conditions are false
}
```

**Example:**

```go
package main

import "fmt"

func main() {
    // We define an integer variable named 'score'.
    score := 75

    // The 'if' statement checks if the score is greater than 90.
    if score > 90 {
        // This block runs only if the condition is true.
        fmt.Println("Grade: A")
    // 'else if' checks another condition if the first one was false.
    } else if score > 70 {
        // This block runs if the score is not > 90, but is > 70.
        fmt.Println("Grade: B")
    // 'else' runs if none of the preceding conditions were true.
    } else {
        // This block runs for any score 70 or less.
        fmt.Println("Grade: C")
    }
}
```

#### `for` Loops

Go has only one looping construct: the `for` loop. It's very versatile and can be used in several ways.

**1. The Classic `for` Loop (Counter-based)**
This is similar to `for` loops in languages like C or Java. It has an initializer, a condition, and a post-statement.

```go
// 1. i := 0;  (initializer: runs once before the loop)
// 2. i < 5;   (condition: checked before each iteration)
// 3. i++      (post-statement: runs after each iteration)
for i := 0; i < 5; i++ {
    fmt.Println("Current number:", i)
}
```

**2. The "while" Loop**
You can omit the initializer and post-statement to make the `for` loop behave like a `while` loop.

```go
package main

import "fmt"

func main() {
    // We start with a counter variable.
    n := 0
    // The loop will continue as long as 'n' is less than 5.
    for n < 5 {
        fmt.Println("Still running...", n)
        // It's crucial to change the condition variable inside the loop
        // to avoid an infinite loop.
        n++
    }
}
```

**3. The `for...range` Loop**
This is the most common way to iterate over collections like slices, maps, or arrays.

```go
package main

import "fmt"

func main() {
    // We define a slice of strings.
    colors := []string{"Red", "Green", "Blue"}

    // 'for...range' iterates over the 'colors' slice.
    // In each iteration, it returns the index and the value at that index.
    for index, value := range colors {
        fmt.Printf("Index: %d, Value: %s\n", index, value)
    }
}
```

#### `switch` Statements

A `switch` statement is a cleaner way to write a sequence of `if-else` statements. It compares an expression against a series of possible `case` values.

**Example:**

```go
package main

import "fmt"

func main() {
    // We define a string variable for the day of the week.
    day := "Wednesday"

    // The 'switch' statement evaluates the 'day' variable.
    switch day {
    // 'case' checks if 'day' matches the string "Monday".
    case "Monday":
        fmt.Println("Time to start the week!")
    // 'case' checks for "Wednesday".
    case "Wednesday":
        fmt.Println("Halfway there!")
    // 'case' checks for "Friday".
    case "Friday":
        fmt.Println("Weekend is coming!")
    // 'default' runs if no other case matches.
    default:
        fmt.Println("It's another day.")
    }
}
```

-----

### Data Structures

Data structures are used to store and organize data.

#### Arrays

An **array** is a numbered sequence of elements of a specific length and type. The size of an array is fixed and cannot be changed.

**Example:**

```go
package main

import "fmt"

func main() {
    // Declares an array named 'primes' that holds 5 integers.
    // The size [5] is part of its type.
    var primes [5]int

    // We assign values to the array elements using their index.
    // Indexing starts at 0.
    primes[0] = 2
    primes[1] = 3
    primes[2] = 5

    // We print the entire array. Note that unassigned elements have a
    // "zero value", which is 0 for integers.
    fmt.Println("Primes array:", primes) // Output: [2 3 5 0 0]
    // We can access a specific element by its index.
    fmt.Println("The first prime is:", primes[0])
}
```

#### Slices

A **slice** is the most common collection type in Go. It's a flexible, dynamically-sized view into the elements of an array. You'll use slices far more often than arrays.

**Example:**

```go
package main

import "fmt"

func main() {
    // This creates a slice of strings. The empty square brackets []
    // indicate it's a slice, not an array.
    fruits := []string{"Apple", "Banana", "Cherry"}
    fmt.Println("Initial fruits:", fruits)
    fmt.Println("Number of fruits:", len(fruits)) // len() gets the length

    // The 'append' function adds new elements to a slice.
    // It returns a new, updated slice.
    fruits = append(fruits, "Orange")

    fmt.Println("Fruits after append:", fruits)
    fmt.Println("New number of fruits:", len(fruits))
}
```

#### Maps

A **map** stores data in key-value pairs. It's an unordered collection, so the items are not stored in any particular sequence.

**Example:**

```go
package main

import "fmt"

func main() {
    // This creates a map where keys are strings and values are integers.
    // 'make' is a built-in function to initialize maps, slices, and channels.
    studentGrades := make(map[string]int)

    // We add key-value pairs to the map.
    studentGrades["Alice"] = 92
    studentGrades["Bob"] = 85
    studentGrades["Charlie"] = 78

    fmt.Println("Student Grades:", studentGrades)

    // To get a value, you use its key.
    bobsGrade := studentGrades["Bob"]
    fmt.Println("Bob's grade is:", bobsGrade)

    // The 'delete' function removes a key-value pair from the map.
    delete(studentGrades, "Charlie")
    fmt.Println("Grades after deleting Charlie:", studentGrades)
}
```

#### Structs

A **struct** (short for structure) is a composite type that groups together variables (fields) under a single name. It's used to create custom data types.

**Example:**

```go
package main

import "fmt"

// We define a new type called 'Car'.
// It groups together three fields: Make, Model, and Year.
type Car struct {
    Make  string
    Model string
    Year  int
}

func main() {
    // We create a variable 'myCar' of type 'Car'.
    // We initialize it with values for each field.
    myCar := Car{
        Make:  "Toyota",
        Model: "Corolla",
        Year:  2021,
    }

    // We can print the entire struct.
    fmt.Println("My car details:", myCar)

    // We can access individual fields using the dot '.' operator.
    fmt.Println("My car is a", myCar.Make)
}
```

-----

### Task Solutions

#### Task 1: Write a program to find the largest of three numbers.

```go
package main

import "fmt"

func main() {
    // Define three integer variables.
    num1, num2, num3 := 10, 45, 23

    // Assume the first number is the largest initially.
    largest := num1

    // Compare the current 'largest' with the second number.
    if num2 > largest {
        // If num2 is larger, update 'largest' to be num2.
        largest = num2
    }

    // Compare the current 'largest' with the third number.
    if num3 > largest {
        // If num3 is larger, update 'largest' to be num3.
        largest = num3
    }

    // Print the final result.
    fmt.Printf("The largest number among %d, %d, and %d is %d\n", num1, num2, num3, largest)
}
```

#### Task 2: Create a slice of integers and iterate over it to print each element.

```go
package main

import "fmt"

func main() {
    // Create a slice of integers with five elements.
    numbers := []int{11, 22, 33, 44, 55}

    fmt.Println("Printing elements of the slice:")
    // Use a for...range loop to iterate over the slice.
    // '_' is used to ignore the index, as we only need the value.
    for _, number := range numbers {
        // Print each number on a new line.
        fmt.Println(number)
    }
}
```

#### Task 3: Implement a simple "guess the number" game.

```go
package main

import (
    "fmt"
    "math/rand"
    "time"
)

func main() {
    // Seed the random number generator to make it produce different
    // numbers each time we run the program.
    rand.Seed(time.Now().UnixNano())

    // Generate a random secret number between 1 and 100.
    secretNumber := rand.Intn(100) + 1
    var guess int

    fmt.Println("I have picked a random number between 1 and 100.")
    fmt.Println("Can you guess what it is?")

    // An infinite for loop that we will break out of manually.
    for {
        fmt.Print("Enter your guess: ")
        // Read the user's input and store it in the 'guess' variable.
        fmt.Scanln(&guess)

        // Check if the guess is lower than the secret number.
        if guess < secretNumber {
            fmt.Println("Too low! Try again.")
        // Check if the guess is higher than the secret number.
        } else if guess > secretNumber {
            fmt.Println("Too high! Try again.")
        // If it's neither lower nor higher, it must be correct.
        } else {
            fmt.Println("You got it! The number was", secretNumber)
            // 'break' exits the loop.
            break
        }
    }
}
```

#### Task 4: Define a `Person` struct with `Name` and `Age` fields.

```go
package main

import "fmt"

// Define the Person struct with two fields: Name (string) and Age (int).
// Note that field names starting with a capital letter are "exported",
// meaning they can be accessed from other packages.
type Person struct {
    Name string
    Age  int
}

func main() {
    // Create an instance of the Person struct.
    // This is also called "instantiating" the struct.
    person1 := Person{
        Name: "Alice",
        Age:  30,
    }

    // Print the created struct instance.
    fmt.Println("Person 1:", person1)

    // Access and print individual fields.
    fmt.Printf("%s is %d years old.\n", person1.Name, person1.Age)
}
```

#### Task 5: Create a map to store the prices of different fruits.

```go
package main

import "fmt"

func main() {
    // Create and initialize a map in one step.
    // The keys are strings (fruit names) and values are float64 (prices).
    fruitPrices := map[string]float64{
        "Apple":  1.50,
        "Banana": 0.75,
        "Orange": 1.25,
    }

    fmt.Println("--- Fruit Price List ---")
    // Iterate over the map using a for...range loop.
    // In each iteration, 'fruit' gets the key and 'price' gets the value.
    for fruit, price := range fruitPrices {
        // Print the fruit and its price, formatted to 2 decimal places.
        fmt.Printf("%s: $%.2f\n", fruit, price)
    }
}
```