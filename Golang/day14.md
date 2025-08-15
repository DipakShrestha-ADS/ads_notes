## Day 14: Project Structure and Best Practices 🏗️

As your applications grow, the way you organize your code becomes crucial. A well-structured project is easier to understand, maintain, and scale. Today, we'll learn how to structure a Go project like a professional and adopt best practices and tools that ensure code quality.

-----

### Organizing Your Go Project

A good project structure provides a clear **separation of concerns**. Instead of putting all your code in one giant `main.go` file, you group related code into different packages and directories. This makes it easy to find what you're looking for and understand how the different parts of your application fit together.

#### The Standard Go Project Layout

While Go doesn't enforce a single structure, a community-endorsed standard has emerged, often referred to as the "Standard Go Project Layout". You don't need all of these directories for every project, but understanding the most important ones is key.

  * **/cmd**: This is where your application's entry points live. For a web server, you'd have a `/cmd/server/main.go`. If you also had a command-line tool for your project, you could have `/cmd/cli/main.go`. This separation is great for projects that produce multiple executables.
  * **/internal**: This is the most important directory. **The Go compiler enforces a special rule for this folder: code inside `/internal` can only be imported by code within the same project.** This is perfect for all your core application logic (handlers, services, models) that you don't want other projects to import as a library.
  * **/pkg**: This directory is for code that is safe to be imported and used by external applications. **Use this with caution.** For most web applications, almost all your code should live in `/internal`. You would only use `/pkg` if you were intentionally writing a reusable library.
  * **/api**: Contains API definition files, like OpenAPI/Swagger specs.
  * **/web**: For web application-specific assets like static files (CSS, JS, images) and templates.
  * **/configs**: For configuration files (e.g., `config.yaml`).

-----

### Go Best Practices and Tooling

Writing good code is about more than just making it work. It's about writing code that is clean, readable, and robust.

#### Reading "Effective Go"

**"Effective Go"** is the official document from the Go creators that outlines the idiomatic way to write Go code. It's not a tutorial, but a guide to style and philosophy. Reading it is a rite of passage for Go developers. You can find it here: [https://go.dev/doc/effective\_go](https://go.dev/doc/effective_go).

#### Essential Tools

Go comes with a powerful toolchain out of the box.

  * **`go fmt`**: This is the Go code formatter. It automatically formats your code according to the official Go style guide. **There are no arguments about style in Go; `go fmt` is the standard.** You should run it on your code every time you save. Most code editors can be configured to do this automatically.
  * **`go vet`**: This is a static analysis tool that examines your source code for suspicious constructs and potential bugs that the compiler might not catch, such as unreachable code or incorrect use of format strings.

#### Setting up a Linter (`golangci-lint`)

A **linter** is like `go vet` on steroids. It's a tool that analyzes your code for a wide range of stylistic errors, programming mistakes, and potential bugs. The most popular linter for Go is **`golangci-lint`**. It's a fast runner that combines dozens of different linters into one tool.

-----

### Task Solutions

#### Task 1: Restructure your project into a more scalable layout.

**Solution:**

Let's take our project from the previous days and reorganize it using the standard layout.

**New Project Structure:**

```
gorm-gin-crud/
├── cmd/
│   └── server/
│       └── main.go         // <-- Our main function moves here
├── internal/
│   ├── auth/               // <-- New package for auth logic
│   │   ├── handler.go
│   │   └── middleware.go
│   ├── database/
│   │   └── database.go     // <-- Database connection logic
│   └── user/
│       ├── handler.go      // <-- User CRUD handlers
│       └── model.go        // <-- User struct definition
├── go.mod
├── go.sum
└── .golangci.yml           // <-- Linter config (from Task 2)
```

**What to do:**

1.  Create the new directories: `cmd/server`, `internal/auth`, `internal/database`, `internal/user`.
2.  **Move `main.go`** to `cmd/server/main.go`. Update its `package` to `main`.
3.  **Move `database.go`** to `internal/database/database.go`. Update its `package` to `database`.
4.  **Move `user.model.go`** to `internal/user/model.go`. Update its `package` to `user`.
5.  **Move the user CRUD handlers** to `internal/user/handler.go`. Update its `package` to `user`.
6.  **Move the auth handlers and middleware** to `internal/auth/handler.go` and `internal/auth/middleware.go`. Update their `package` to `auth`.
7.  **Update all the `import` paths** in your files to reflect the new structure. For example, in `main.go`, you'll now need to import `your-module-name/internal/auth`, `your-module-name/internal/database`, etc.

#### Task 2: Set up `golangci-lint` for your project and fix any reported issues.

**Solution:**

1.  **Install `golangci-lint`:** Follow the official installation guide: [https://golangci-lint.run/usage/install/](https://www.google.com/search?q=https://golangci-lint.run/usage/install/)

2.  **Create a configuration file:** In the root of your project, create a file named `.golangci.yml`. This file lets you configure which linters to run and how they should behave.

    **`.golangci.yml` (a good starting point):**

    ```yaml
    run:
      timeout: 5m
      skip-dirs:
        - vendor

    linters:
      enable:
        - gofmt
        - govet
        - errcheck
        - staticcheck
        - unused
        - ineffassign
        - typecheck
        - unconvert
      disable-all: false

    linters-settings:
      errcheck:
        # Report unchecked errors for all functions, not just standard library ones.
        check-blank: true
    ```

3.  **Run the linter:** In your terminal, at the project root, run:

    ```sh
    golangci-lint run ./...
    ```

    The `./...` tells it to scan all packages within the current directory and its subdirectories.

4.  **Fix reported issues:** The linter might find issues like an unchecked error. For example:

      * **Linter Error:** ` user/handler.go:25:9: Error return value of  `c.ShouldBindJSON`  is not checked (errcheck) `
      * **Code Before:** `_ = c.ShouldBindJSON(&input)`
      * **Code After:**
        ```go
        if err := c.ShouldBindJSON(&input); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        ```

#### Task 3: Read and understand the key principles of "Effective Go."

**Solution:** This is a reading task. After reading, you should be able to explain these key principles:

  * **Formatting (`gofmt`):** Code should always be formatted with `gofmt`. This is a non-negotiable standard in the Go community.
  * **Naming:** Use `camelCase` for internal variables and functions. Use `PascalCase` to **export** a function, type, or variable, making it visible to other packages. Keep names short and descriptive.
  * **Comments:** The standard way to document code is with comments directly preceding the item they are documenting. `// MyFunction does...` is a doc comment for `MyFunction`.
  * **Simplicity:** Go favors composition over inheritance. It encourages writing simple, clear code rather than creating complex abstractions.
  * **Error Handling:** Errors are values. The `if err != nil` pattern is the idiomatic way to handle errors immediately after they occur, leading to more robust code.

#### Task 4: Refactor your code for best practices for error handling.

**Solution:**

A common mistake for beginners is to use `panic` for recoverable errors. `panic` should be reserved for truly exceptional situations where the program cannot continue. Let's refactor our database connection.

**Before (in `database.go`):**

```go
func ConnectDatabase() {
	// ...
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database!") // <-- Not ideal
	}
	DB = database
}
```

**After (in `internal/database/database.go`):**

```go
package database

import (
	// ...
)

var DB *gorm.DB

// Connect returns a new database connection and an error if it fails.
func Connect() (*gorm.DB, error) {
	dsn := "host=localhost user=gorm password=gorm dbname=gorm port=5432 sslmode=disable"
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		// Return the error instead of panicking.
		return nil, err
	}
	return database, nil
}
```

Now, the calling code in `main.go` is responsible for handling the error gracefully.

#### Task 5: Add comments and documentation to your code.

**Solution:**

Good comments explain *what* and *why*, not *how*. Use Go's standard doc comment format.

**`internal/user/model.go`**

```go
// Package user defines the data model and handlers for user-related operations.
package user

import "gorm.io/gorm"

// User represents a user in the database.
// It includes standard model fields via gorm.Model.
type User struct {
	gorm.Model
	Name     string
	City     string
	Password string `json:"-"` // Password is not exposed in JSON responses.
}
```

**`internal/user/handler.go`**

```go
package user

import (
	// ...
)

// FindUser retrieves a single user by their ID from the database.
// It expects the user ID to be passed as a URL parameter.
func FindUser(c *gin.Context) {
	var user User
	// Find the first record matching the provided ID.
	if err := database.DB.First(&user, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found!"})
		return
	}

	c.JSON(http.StatusOK, user)
}
```

These comments are automatically picked up by Go's documentation tools (`go doc`), making your code much easier for others (and your future self) to understand.