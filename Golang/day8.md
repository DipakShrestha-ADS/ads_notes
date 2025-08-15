## Day 8: Working with JSON and Data Binding 🔄

Today, we'll focus on how modern web APIs communicate: using **JSON**. You'll learn how Gin makes it incredibly simple to both send and receive JSON data. We'll also cover **data binding and validation**, a powerful feature that saves you from writing a lot of tedious manual code.

-----

### Handling JSON in Gin

You've already seen a glimpse of this. Gin provides a convenient method, `c.JSON()`, to serialize a Go data structure (like a struct or a map) into JSON format and send it as a response.

Gin takes care of a few things for you automatically:

  * It converts your Go data into a JSON string.
  * It sets the `Content-Type` response header to `application/json`.
  * It writes the JSON string and the HTTP status code to the response.

**Example (Sending a single object):**

```go
c.JSON(http.StatusOK, gin.H{"user_id": "123", "status": "active"})
```

**Example (Sending a slice of structs):**

```go
type User struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

users := []User{
    {ID: 1, Name: "Alice"},
    {ID: 2, Name: "Bob"},
}

c.JSON(http.StatusOK, users)
// This will produce the JSON response: [{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]
```

Notice the `json:"id"` part. These are called **struct tags**. They control how the struct fields are encoded into JSON. Here, we're telling Go's JSON encoder to use lowercase `id` as the key in the JSON output, even though the struct field is `ID`.

-----

### Data Binding and Validation

**Data binding** is the process of automatically parsing an incoming request body (like a JSON payload from a POST request) and mapping its data into a Go struct. This is a huge time-saver.

**Validation** is the next step. After binding the data, Gin can automatically check if the data follows certain rules you've defined (e.g., a field is required, an email is in the correct format).

You define these rules using struct tags, just like with JSON encoding.

**Example Struct with Validation:**

```go
// Login defines the structure for a login request.
type Login struct {
    // The 'binding:"required"' tag means this field must be present in the JSON.
    User     string `json:"user" binding:"required"`
    // We can chain tags. This field is required and must be a valid email address.
    Email    string `json:"email" binding:"required,email"`
    // This field must be at least 8 characters long.
    Password string `json:"password" binding:"required,min=8"`
}
```

To perform the binding and validation, you use the `c.ShouldBindJSON()` method. It reads the request body, tries to fit it into your struct, and checks all the validation rules.

-----

### Task Solutions

#### Task 1: Create an API endpoint that returns a list of users in JSON format using Gin.

**Solution:**

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// User struct defines our user data model.
// The `json:"..."` tags control the output field names in the JSON response.
type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	City string `json:"city"`
}

// Create a slice of User structs to act as our database.
var users = []User{
	{ID: 1, Name: "Alice", City: "New York"},
	{ID: 2, Name: "Bob", City: "London"},
	{ID: 3, Name: "Charlie", City: "Tokyo"},
}

// This handler function will get all users.
func getUsers(c *gin.Context) {
	// c.JSON takes the status code and the data to be serialized.
	// Gin automatically converts our 'users' slice into a JSON array.
	c.JSON(http.StatusOK, users)
}

func main() {
	router := gin.Default()
	router.GET("/users", getUsers)
	router.Run(":8080")
}
```

**How to test it:**

1.  Run the code.
2.  Visit `http://localhost:8080/users` in your browser or use a tool like Postman.
3.  You will see the JSON array of all users.

#### Task 2: Implement an endpoint that accepts a JSON payload to create a new user and binds it to a struct.

**Solution:**

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	City string `json:"city"`
}

var users = []User{
	{ID: 1, Name: "Alice", City: "New York"},
}

func getUsers(c *gin.Context) {
	c.JSON(http.StatusOK, users)
}

// This handler will create a new user.
func createUser(c *gin.Context) {
	// Create an empty User struct to hold the incoming data.
	var newUser User

	// c.ShouldBindJSON() attempts to parse the request body as JSON
	// and populates the 'newUser' struct with the data.
	if err := c.ShouldBindJSON(&newUser); err != nil {
		// If there's an error (e.g., malformed JSON), return a 400 Bad Request.
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// For this simple example, we'll assign a new ID.
	newUser.ID = len(users) + 1
	// Add the new user to our 'database' (the slice).
	users = append(users, newUser)

	// Return the newly created user as a confirmation, with a 201 Created status.
	c.JSON(http.StatusCreated, newUser)
}

func main() {
	router := gin.Default()
	router.GET("/users", getUsers)
	// Register a POST route to the same /users endpoint.
	router.POST("/users", createUser)
	router.Run(":8080")
}
```

**How to test it:**

1.  Use a tool like Postman or `curl`.
2.  Make a **POST** request to `http://localhost:8080/users`.
3.  Set the `Content-Type` header to `application/json`.
4.  Set the request body to: `{"name": "David", "city": "Paris"}`
5.  You will get a `201 Created` response with the new user's data, including the ID. If you then `GET /users`, you will see David in the list.

#### Task 3: Add validation tags to your user struct (e.g., `binding:"required"`).

**Solution:** Let's modify the `User` struct and the `createUser` handler to enforce validation.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// We now define a separate struct for creating users, which is good practice.
// This allows validation rules to be specific to the creation process.
type CreateUserInput struct {
	// The Name field is now mandatory.
	Name string `json:"name" binding:"required"`
	// The City field is also mandatory.
	City string `json:"city" binding:"required"`
}

// The main User struct remains the same.
type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	City string `json:"city"`
}

var users = []User{
	{ID: 1, Name: "Alice", City: "New York"},
}

func createUser(c *gin.Context) {
	var input CreateUserInput

	// Bind the request body to the 'input' struct.
	// This will now also check the 'binding' tags.
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// If binding and validation are successful, create the new user.
	newUser := User{
		ID:   len(users) + 1,
		Name: input.Name,
		City: input.City,
	}
	users = append(users, newUser)

	c.JSON(http.StatusCreated, newUser)
}

// ... (getUsers and main function are the same as before)
func getUsers(c *gin.Context) { c.JSON(http.StatusOK, users) }

func main() {
	router := gin.Default()
	router.GET("/users", getUsers)
	router.POST("/users", createUser)
	router.Run(":8080")
}
```

**How to test it:**

1.  Try to create a user with a missing field. Send a POST request with the body: `{"city": "Berlin"}`.
2.  You will receive a `400 Bad Request` error with a message like: `Key: 'CreateUserInput.Name' Error:Field validation for 'Name' failed on the 'required' tag`.

#### Task 4: Handle binding errors and return appropriate error messages.

**Solution:** The solutions for tasks 2 and 3 already demonstrate this. The key pattern is:

```go
if err := c.ShouldBindJSON(&input); err != nil {
    // If the error is not nil, it means binding or validation failed.
    // We stop processing the request immediately and send an error response.
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
}
// ... proceed only if there was no error.
```

This `if err != nil` check is the standard way to handle errors from binding functions in Gin. It ensures that your handler doesn't proceed with invalid or incomplete data.

#### Task 5: Explore binding for different content types, like form data.

**Solution:**

Gin can bind data from sources other than JSON, like standard HTML form submissions (`application/x-www-form-urlencoded`). The process is almost identical, but you use a different method and struct tags.

**Struct with Form Tags:**

```go
type CreateUserInput struct {
    // Instead of `json:"..."`, we use `form:"..."`.
    // The validation tags work exactly the same way.
	Name string `form:"name" binding:"required"`
	City string `form:"city" binding:"required"`
}
```

**Handler using `ShouldBind()`:**

```go
func createUserFromForm(c *gin.Context) {
    var input CreateUserInput

    // c.ShouldBind() is a smart method. It automatically detects the
    // Content-Type of the request and uses the appropriate binder
    // (JSON, form, XML, etc.).
    if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    // ... (logic to create user is the same)
    c.JSON(http.StatusCreated, gin.H{"message": "User created!", "name": input.Name, "city": input.City})
}
```

You would test this by sending a POST request with the `Content-Type` header set to `application/x-www-form-urlencoded` and the body as `name=Frank&city=Sydney`. The binding and validation would work just as they did for JSON.