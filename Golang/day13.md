## Day 13: Testing in Go 🧪

Writing code is only half the battle; ensuring it works correctly and continues to work as you make changes is just as important. Today, we'll dive into **testing**, a critical practice for building reliable and maintainable software. Go has excellent built-in support for testing, making it easy to get started.

-----

### The `testing` Package

Go's standard library includes a powerful `testing` package that provides all the tools you need for writing unit tests.

**Key Conventions:**

  * Test files must end with `_test.go` (e.g., `utils_test.go`).
  * Test functions must start with `Test` followed by a capitalized name (e.g., `TestMyFunction`).
  * Test functions must take one argument: `t *testing.T`. The `*testing.T` object is your toolkit for reporting test failures.

**Basic Unit Test Example:**

Let's say we have a simple function in `math.go`:

```go
// math.go
package main

func Add(a, b int) int {
    return a + b
}
```

The test file would be `math_test.go`:

```go
// math_test.go
package main

import "testing"

func TestAdd(t *testing.T) {
    // Arrange: Set up the inputs.
    a, b := 2, 3
    expected := 5

    // Act: Call the function we are testing.
    result := Add(a, b)

    // Assert: Check if the result is what we expected.
    if result != expected {
        // t.Errorf reports a test failure and prints an error message.
        t.Errorf("Add(%d, %d) = %d; want %d", a, b, result, expected)
    }
}
```

To run your tests, you simply navigate to your project directory in the terminal and run:

```sh
go test
```

-----

### Table-Driven Tests

When you need to test a function with many different inputs and expected outputs, writing a separate `if` statement for each case becomes tedious. **Table-driven tests** are a Go idiom for organizing these test cases cleanly.

You create a slice of structs, where each struct represents a single test case with its inputs and expected output. Then, you loop over this slice and run the test for each case.

**Example:**

```go
// math_test.go
package main

import "testing"

func TestAddTableDriven(t *testing.T) {
    // 1. Define the test cases table.
    var tests = []struct {
        a, b   int
        want int
    }{
        {2, 3, 5},          // Case 1: Positive numbers
        {-1, 1, 0},         // Case 2: Negative and positive
        {-5, -5, -10},      // Case 3: Negative numbers
        {0, 0, 0},          // Case 4: Zeroes
    }

    // 2. Loop over the test cases.
    for _, tt := range tests {
        // t.Run allows you to run sub-tests for each case, which gives clearer output.
        testname := fmt.Sprintf("%d+%d", tt.a, tt.b)
        t.Run(testname, func(t *testing.T) {
            ans := Add(tt.a, tt.b)
            if ans != tt.want {
                t.Errorf("got %d, want %d", ans, tt.want)
            }
        })
    }
}
```

-----

### Testing Gin Handlers

You can't test a Gin handler by calling it directly because it's tightly coupled to the `gin.Context`. Instead, we use the `net/http/httptest` package to create a **mock HTTP request** and a **response recorder**. This lets us simulate a real HTTP call to our handler without needing to run a live server.

**The Process:**

1.  Set up a test router.
2.  Create a `httptest.ResponseRecorder`, which acts as a fake `http.ResponseWriter`.
3.  Create a `http.NewRequest` to simulate an incoming request (e.g., a `GET` to `/users`).
4.  Serve the request to the router using `router.ServeHTTP()`.
5.  Check the recorder's status code and response body to see if the handler behaved as expected.

-----

### Task Solutions

#### Task 1: Write unit tests for a utility or helper function.

**Solution:**

Let's create a simple helper function in a new file, `utils.go`. This function will capitalize a string.

**`utils.go`**

```go
package main

import "strings"

// Capitalize returns a new string with the first letter capitalized.
// It returns an empty string if the input is empty.
func Capitalize(s string) string {
	if s == "" {
		return ""
	}
	return strings.ToUpper(s[:1]) + s[1:]
}
```

Now, let's write the test for it in `utils_test.go`.

**`utils_test.go`**

```go
package main

import "testing"

func TestCapitalize(t *testing.T) {
	// Arrange
	input := "hello"
	expected := "Hello"

	// Act
	result := Capitalize(input)

	// Assert
	if result != expected {
		t.Errorf("Capitalize('%s') = '%s'; want '%s'", input, result, expected)
	}
}

func TestCapitalizeEmpty(t *testing.T) {
	// Arrange
	input := ""
	expected := ""

	// Act
	result := Capitalize(input)

	// Assert
	if result != expected {
		t.Errorf("Capitalize('%s') = '%s'; want '%s'", input, result, expected)
	}
}
```

This demonstrates testing both the primary use case and an edge case (the empty string).

-----

#### Task 2: Implement table-driven tests for the same function.

**Solution:**

We can combine the tests from Task 1 into a single, cleaner table-driven test.

**`utils_test.go` (Table-Driven)**

```go
package main

import (
	"fmt"
	"testing"
)

func TestCapitalizeTableDriven(t *testing.T) {
	// Define the test cases table.
	var tests = []struct {
		input string
		want  string
	}{
		{"hello", "Hello"},
		{"world", "World"},
		{"", ""},
		{"123go", "123go"},
		{"Go", "Go"},
	}

	// Loop over the test cases.
	for _, tt := range tests {
		testname := fmt.Sprintf("Input:'%s'", tt.input)
		t.Run(testname, func(t *testing.T) {
			ans := Capitalize(tt.input)
			if ans != tt.want {
				t.Errorf("got '%s', want '%s'", ans, tt.want)
			}
		})
	}
}
```

This version is much more scalable. If we think of more edge cases, we can simply add another struct to the `tests` slice.

-----

#### Task 3: Write tests for your Gin API endpoints.

**Solution:**

Let's write a test for the `GET /users` endpoint from Day 9. We'll assume we have a handler that returns a list of users.

**`user.handler.go` (for context)**

```go
// This is the handler we want to test.
func FindUsers(c *gin.Context) {
	var users []User
	DB.Find(&users) // In a real test, we would mock this.
	c.JSON(http.StatusOK, users)
}
```

**`user.handler_test.go`**

```go
package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert" // A popular assertion library
)

// Helper function to set up a test router
func setupRouter() *gin.Engine {
	// Switch to test mode to make logging less verbose
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	return router
}

func TestFindUsers(t *testing.T) {
	// For this test, let's assume the DB is empty or pre-populated.
	// A better approach is mocking, which is Task 5.
	// ConnectDatabase() // You might need to connect to a test database.

	router := setupRouter()
	// Define the route and handler we are testing.
	router.GET("/users", FindUsers)

	// 1. Create the ResponseRecorder.
	w := httptest.NewRecorder()

	// 2. Create the mock request.
	req, _ := http.NewRequest("GET", "/users", nil)

	// 3. Serve the request.
	router.ServeHTTP(w, req)

	// 4. Assert the results.
	// Using the testify/assert library makes assertions cleaner.
	assert.Equal(t, http.StatusOK, w.Code)

	// We can also check the response body.
	var users []User
	err := json.Unmarshal(w.Body.Bytes(), &users)
	assert.NoError(t, err)
	// For example, assert that the returned list is not nil (even if empty)
	assert.NotNil(t, users)
}
```

-----

#### Task 4: Calculate the test coverage for your code.

**Solution:**

Test coverage is a metric that measures what percentage of your code is executed by your tests. To generate a coverage report, use the `-cover` flag.

```sh
go test -cover
```

The output will look something like this:

```
PASS
coverage: 68.5% of statements
ok      your/module/name      0.015s
```

To get a more detailed, visual report, you can generate an HTML file:

```sh
# 1. Generate a coverage profile file.
go test -coverprofile=coverage.out

# 2. Open the profile in your browser.
go tool cover -html=coverage.out
```

This will open a web page showing your source code, with covered lines in green and uncovered lines in red. It's a fantastic tool for finding parts of your code that are not being tested.

-----

#### Task 5: Explore mocking your GORM database layer.

**Solution:**

The test in Task 3 has a major flaw: it depends on a real database connection. This makes tests slow, fragile (what if the DB is down?), and hard to set up. **Mocking** is the solution. A mock is a fake object that simulates the behavior of a real object.

For GORM, we can use a library like **`go-sqlmock`** to create a mock SQL database. This mock allows us to define exactly what we expect our code to do (e.g., "I expect a `SELECT * FROM users` query") and what fake data it should return, all without ever touching a real database.

**The General Approach:**

1.  **Use `go-sqlmock`** to create a mock database connection (`sql.DB`) and a GORM instance that uses this mock connection.
2.  **In your test**, before calling the handler, set up your mock's expectations. For example: ` mock.ExpectQuery("SELECT \\* FROM  `users`").WillReturnRows(...)`.
3.  **Run the handler test** as before. GORM will send its query to the mock instead of a real database.
4.  **The mock will check** if the query it received matches your expectation. If it doesn't, the test fails. If it does, it returns the fake data you specified.
5.  **Assert** that your handler behaved correctly based on the fake data it received.

This isolates your handler logic from the database, leading to faster, more reliable, and truly independent unit tests. Exploring libraries like `go-sqlmock` and `testify/mock` is a crucial next step for professional Go testing.