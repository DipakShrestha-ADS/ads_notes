## Day 9: GORM and GORM Gen 🐘

So far, our user data has disappeared every time we restart the server. Today, we'll fix that by connecting our application to a persistent **PostgreSQL** database using **GORM**, the most popular ORM library for Go.

-----

### Introduction to GORM

**ORM** stands for **Object-Relational Mapping**. It's a technique that lets you interact with your database (like creating tables, inserting data, and querying records) using your programming language's objects (in our case, Go structs) instead of writing raw SQL queries.

**Why use GORM?**

  * **Productivity:** It saves you from writing repetitive SQL code for common operations like creating, reading, updating, and deleting (CRUD).
  * **Safety:** It helps prevent SQL injection vulnerabilities.
  * **Database Agnostic:** You can switch from PostgreSQL to MySQL or SQLite with minimal code changes.
  * **Features:** It includes powerful features like auto-migration, associations (relations), and transaction support.

-----

### **Prerequisite: Running PostgreSQL with Docker**

Before we can connect to a database, we need one running. The easiest way to do this is with Docker. Run this command in your terminal:

```sh
docker run --name gorm-postgres -e POSTGRES_USER=gorm -e POSTGRES_PASSWORD=gorm -e POSTGRES_DB=gorm -p 5432:5432 -d postgres
```

This command downloads the official PostgreSQL image, starts a container named `gorm-postgres`, and sets up a user, password, and database all named `gorm`. It also maps port `5432` on your machine to the container's port `5432`.

-----

### Task 1: Set up a database connection using GORM in Gin.

**Solution:**

First, we need to install GORM and the PostgreSQL driver.

```sh
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
```

Now, let's create a file to manage our database connection and initialize it in our `main` function.

**`database.go`:**

```go
package main

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB is our global database connection variable.
var DB *gorm.DB

// ConnectDatabase connects to the PostgreSQL database.
func ConnectDatabase() {
	// dsn is the Data Source Name string. It contains the connection info.
	dsn := "host=localhost user=gorm password=gorm dbname=gorm port=5432 sslmode=disable"
	
    // gorm.Open connects to the database using the specified driver and DSN.
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		// If the connection fails, we panic and stop the application.
		panic("Failed to connect to database!")
	}

	// If successful, we assign the connection to our global DB variable.
	DB = database
}
```

**`main.go`:**

```go
package main

import "github.com/gin-gonic/gin"

func main() {
    // Call the function to connect to the database.
	ConnectDatabase()

	router := gin.Default()
	// ... (our routes will go here)
	router.Run(":8080")
}
```

-----

### Task 2: Define a `User` model and use auto-migration.

**Solution:** A **model** is a Go struct that represents a database table. GORM uses struct tags to understand how the struct fields map to table columns.

**`user.model.go`:**

```go
package main

import "gorm.io/gorm"

// User struct is our GORM model for the 'users' table.
type User struct {
	// gorm.Model is an embedded struct that includes common fields:
	// ID, CreatedAt, UpdatedAt, DeletedAt.
	gorm.Model
	Name string
	City string
}
```

Now, let's use GORM's **AutoMigrate** feature to create the `users` table in the database automatically.

Modify `ConnectDatabase()` in **`database.go`**:

```go
// ... (imports and DB variable)

func ConnectDatabase() {
	dsn := "host=localhost user=gorm password=gorm dbname=gorm port=5432 sslmode=disable"
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database!")
	}

    // AutoMigrate will create the 'users' table based on the User struct.
    // It will only add missing fields or tables; it won't delete anything.
	err = database.AutoMigrate(&User{})
	if err != nil {
		panic("Failed to migrate database!")
	}

	DB = database
}
```

Now, when you run `main.go`, GORM will connect to the database and ensure a `users` table exists that matches your `User` struct.

-----

### Task 3: Implement API endpoints for all CRUD operations.

**Solution:** Let's create handlers for each operation and connect them to routes.

**`user.handler.go`:**

```go
package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// CreateUser handles POST /users requests.
func CreateUser(c *gin.Context) {
	var input struct {
		Name string `json:"name" binding:"required"`
		City string `json:"city" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := User{Name: input.Name, City: input.City}
	// DB.Create() inserts the new user record into the database.
	DB.Create(&user)

	c.JSON(http.StatusCreated, user)
}

// FindUsers handles GET /users requests.
func FindUsers(c *gin.Context) {
	var users []User
	// DB.Find() retrieves all records from the 'users' table.
	DB.Find(&users)

	c.JSON(http.StatusOK, users)
}

// FindUser handles GET /users/:id requests.
func FindUser(c *gin.Context) {
	var user User
	// DB.First() finds the first record matching the condition (id = ?).
	// If not found, it returns a gorm.ErrRecordNotFound error.
	if err := DB.First(&user, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found!"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateUser handles PATCH /users/:id requests.
func UpdateUser(c *gin.Context) {
	var user User
	if err := DB.First(&user, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found!"})
		return
	}

	var input struct {
		Name string `json:"name"`
		City string `json:"city"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// DB.Model(&user).Updates() updates the user record with the new data.
	DB.Model(&user).Updates(input)

	c.JSON(http.StatusOK, user)
}

// DeleteUser handles DELETE /users/:id requests.
func DeleteUser(c *gin.Context) {
	var user User
	if err := DB.First(&user, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found!"})
		return
	}

	// DB.Delete() performs a soft delete on the record.
	DB.Delete(&user)

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
```

Update **`main.go`** to include the routes:

```go
package main

import "github.com/gin-gonic/gin"

func main() {
	ConnectDatabase()

	router := gin.Default()

	router.POST("/users", CreateUser)
	router.GET("/users", FindUsers)
	router.GET("/users/:id", FindUser)
	router.PATCH("/users/:id", UpdateUser)
	router.DELETE("/users/:id", DeleteUser)

	router.Run(":8080")
}
```

You now have a fully functional CRUD API connected to a real database\!

-----

### Task 4 & 5: Automating with GORM Gen and Refactoring

**GORM Gen** is a code generator that creates type-safe, reusable DAO (Data Access Object) code based on your GORM models. This helps you avoid writing raw strings in your queries and catches errors at compile time.

**Step 1: Install GORM Gen**

```sh
go get -u gorm.io/gen/tools/gentool
```

**Step 2: Create a Generator File**

Create a new file called `generate.go`. This file tells `gen` what to do.

**`generate.go`:**

```go
//go:build ignore
// The line above is a build tag that tells the Go compiler to ignore this file
// during normal builds. It's only for the generator tool.

package main

import (
	"gorm.io/gen"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Initialize the generator configuration.
	g := gen.NewGenerator(gen.Config{
		OutPath: "./dal/query", // The directory where generated code will be placed.
		Mode:    gen.WithoutContext | gen.WithDefaultQuery | gen.WithQueryInterface,
	})

	// Connect to the database, similar to our main application.
	dsn := "host=localhost user=gorm password=gorm dbname=gorm port=5432 sslmode=disable"
	db, _ := gorm.Open(postgres.Open(dsn))
	g.UseDB(db)

	// Tell the generator to create DAO code for our User model.
	g.ApplyBasic(User{})

	// Execute the code generation.
	g.Execute()
}
```

**Step 3: Run the Generator**

Run this command in your terminal:

```sh
go run generate.go
```

This will create a new `dal` directory in your project with the generated code.

**Step 4: Refactor Handlers to Use Generated Code**

Now, we can update our handlers to be cleaner and type-safe.

**`user.handler.go` (Refactored):**

```go
package main

import (
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"gorm-gin-crud/dal/query" // Import the generated code
)

var q = query.Use(DB) // Initialize the query builder

func CreateUser(c *gin.Context) {
	// ... (input binding is the same)
	var input struct {
		Name string `json:"name" binding:"required"`
		City string `json:"city" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	user := &User{Name: input.Name, City: input.City}
	// Use the generated, type-safe Create method.
	err := q.User.Create(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func FindUsers(c *gin.Context) {
	// Use the generated Find method.
	users, err := q.User.Find()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve users"})
		return
	}
	c.JSON(http.StatusOK, users)
}

func FindUser(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	// Use the generated First method with a type-safe Where clause.
	user, err := q.User.Where(q.User.ID.Eq(uint(id))).First()
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// ... (Update and Delete handlers can be refactored similarly)
```

By using `q.User.Where(q.User.ID.Eq(uint(id)))`, you get autocompletion for your fields (`ID`, `Name`, `City`) and methods (`Eq`, `Neq`, `Gt`), making your code safer and easier to write.