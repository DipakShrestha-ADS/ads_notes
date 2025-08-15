## Day 7: Web Development with Gin Framework 🏎️

While Go's `net/http` package is powerful, it's also very low-level. For building complex applications, a web framework can save you a lot of time and code. Today, we'll learn about **Gin**, one of the most popular and fastest web frameworks for Go.

-----

### Introduction to Gin

**Gin** is a high-performance web framework that can help you write web applications and microservices. Think of it as a set of pre-made tools and helpers built on top of `net/http`.

**Why use Gin?**

  * **Speed:** It's known for being extremely fast, thanks to its radix tree-based routing.
  * **Middleware:** It has a great system for "middleware," which are functions that can run before or after your request handlers. This is perfect for logging, authentication, and error handling.
  * **Convenience:** It provides handy functions for common tasks like parsing JSON, handling route parameters, and validating data, which means you write less boilerplate code.

#### Installing and Setting Up a Basic Gin Server

First, you need to add Gin to your project. Open your terminal in your project's root directory and run:

```sh
go get -u github.com/gin-gonic/gin
```

This command downloads the Gin package and adds it as a dependency in your `go.mod` file.

Now, let's create a basic server. It's even simpler than with `net/http`.

```go
package main

import "github.com/gin-gonic/gin"

func main() {
    // Create a new Gin router with default middleware (logger and recovery).
    // gin.Default() is a convenient shortcut.
    router := gin.Default()

    // Define a handler for the GET request on the "/" path.
    // The handler function takes a pointer to a gin.Context.
    router.GET("/", func(c *gin.Context) {
        // c.JSON() is a helper to send a JSON response.
        // It takes the HTTP status code and a JSON-serializable object.
        // gin.H is a shortcut for map[string]interface{}.
        c.JSON(200, gin.H{
            "message": "Hello from Gin!",
        })
    })

    // Start the server on port 8080.
    // router.Run() starts the HTTP server and is a shorthand for http.ListenAndServe.
    router.Run(":8080")
}
```

The `gin.Context` (usually named `c`) is the most important part of Gin. It's a struct that carries request details, validates and serializes JSON, and, most importantly, allows you to write the response. It's both the `http.Request` and `http.ResponseWriter` rolled into one convenient package.

-----

### Routing in Gin

Gin makes defining routes for different HTTP methods and URL patterns very clear and easy.

#### Handling GET, POST, PUT, DELETE requests

You simply use the corresponding function on the router object:

```go
router.GET("/someGet", getting)
router.POST("/somePost", posting)
router.PUT("/somePut", putting)
router.DELETE("/someDelete", deleting)
```

#### Route Parameters

Often, you need to capture a dynamic part of a URL, like a user's ID. Gin handles this with named parameters, prefixed with a colon `:`.

```go
// This route will match /users/123, /users/alice, etc.
router.GET("/users/:id", func(c *gin.Context) {
    // You can get the value of the 'id' parameter using c.Param().
    id := c.Param("id")
    c.JSON(200, gin.H{"message": "Fetching user with ID: " + id})
})
```

#### Query Strings

Query strings are the key-value pairs that appear after a `?` in a URL. You can easily access them with `c.Query()`.

```go
// This route will handle URLs like /search?q=books&page=2
router.GET("/search", func(c *gin.Context) {
    // c.Query("q") gets the value of the 'q' parameter.
    query := c.Query("q")
    // c.DefaultQuery() is useful for providing a fallback value if the
    // parameter is not present.
    page := c.DefaultQuery("page", "1")

    c.JSON(200, gin.H{
        "query": query,
        "page":  page,
    })
})
```

#### Grouping Routes

When you have several routes that share a common URL prefix (like an API version), you can group them. This helps organize your code and allows you to apply middleware to the entire group.

```go
// Create a route group for the "/api/v1" prefix.
v1 := router.Group("/api/v1")
{
    // The routes inside this block will be prefixed with /api/v1.
    v1.GET("/users", getAllUsers)   // Becomes /api/v1/users
    v1.POST("/users", createUser)  // Becomes /api/v1/users
    v1.GET("/posts", getAllPosts)   // Becomes /api/v1/posts
}
```

-----

### Task Solutions

#### Task 1: Convert your simple `net/http` server to use Gin.

**Solution:** Let's convert the `net/http` server from Day 6 that had `/` and `/about` routes.

```go
package main

import (
	"net/http" // We still need this for status codes.

	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Create a Gin router.
	router := gin.Default()

	// 2. Define the handler for the root path "/".
	router.GET("/", func(c *gin.Context) {
		// Use c.String() to send a plain text response.
		// It takes the status code, a format string, and values.
		c.String(http.StatusOK, "Welcome to the Home Page!")
	})

	// 3. Define the handler for the "/about" path.
	router.GET("/about", func(c *gin.Context) {
		c.String(http.StatusOK, "This is a simple web server created with Gin.")
	})

	// 4. Start the server.
	router.Run(":8080")
}
```

**Explanation:** The code is much more concise. We create a router, define our routes with `router.GET()`, and use the `gin.Context` (`c`) to send back a simple string response. `router.Run()` handles starting the server.

#### Task 2: Create a route `/users/:id` that retrieves a user by their ID from a map.

**Solution:**

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Let's create some dummy data to act as our database.
var users = map[string]string{
	"1": "Alice",
	"2": "Bob",
	"3": "Charlie",
}

func main() {
	router := gin.Default()

	router.GET("/users/:id", func(c *gin.Context) {
		// Get the 'id' from the URL path.
		id := c.Param("id")

		// Look up the user in our map.
		// The 'ok' variable will be true if the key exists, and false otherwise.
		userName, ok := users[id]

		// Check if the user was found.
		if ok {
			// If found, return the user's name as JSON.
			c.JSON(http.StatusOK, gin.H{"id": id, "name": userName})
		} else {
			// If not found, return a 404 Not Found error with a message.
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		}
	})

	router.Run(":8080")
}
```

**How to test it:**

  * Go to `http://localhost:8080/users/2`. You'll see `{"id":"2","name":"Bob"}`.
  * Go to `http://localhost:8080/users/99`. You'll see `{"error":"User not found"}`.

#### Task 3: Implement an endpoint that accepts query parameters (e.g., `/search?q=golang`).

**Solution:**

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.GET("/search", func(c *gin.Context) {
		// Get the value of the 'q' query parameter.
		query := c.Query("q")
		// Get the value of the 'lang' parameter, with a default value.
		lang := c.DefaultQuery("lang", "en")

		// Return the received parameters as JSON.
		c.JSON(http.StatusOK, gin.H{
			"search_term": query,
			"language":    lang,
		})
	})

	router.Run(":8080")
}
```

**How to test it:**

  * Go to `http://localhost:8080/search?q=golang&lang=go`. You'll see `{"language":"go","search_term":"golang"}`.
  * Go to `http://localhost:8080/search?q=gin`. You'll see `{"language":"en","search_term":"gin"}` because `lang` was not provided, so the default "en" was used.

#### Task 4: Group your API routes under an `/api/v1` prefix.

**Solution:** We'll combine the user and search endpoints into a single API group.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

var users = map[string]string{"1": "Alice", "2": "Bob"}

func main() {
	router := gin.Default()

	// Create a group for the /api/v1 prefix.
	apiV1 := router.Group("/api/v1")
	{
		// This route is now reachable at GET /api/v1/users/:id
		apiV1.GET("/users/:id", func(c *gin.Context) {
			id := c.Param("id")
			userName, ok := users[id]
			if ok {
				c.JSON(http.StatusOK, gin.H{"id": id, "name": userName})
			} else {
				c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			}
		})

		// This route is now reachable at GET /api/v1/search
		apiV1.GET("/search", func(c *gin.Context) {
			query := c.Query("q")
			lang := c.DefaultQuery("lang", "en")
			c.JSON(http.StatusOK, gin.H{"search_term": query, "language": lang})
		})
	}

	router.Run(":8080")
}
```

**Explanation:** By using `router.Group("/api/v1")`, we've cleanly organized our API endpoints. All routes defined within the `{...}` block will automatically have `/api/v1` prepended to their path.

#### Task 5: Explore Gin's documentation for more advanced routing features.

**Solution:**

The official Gin documentation is the best place to learn more.

**Website:** [https://gin-gonic.com/docs/](https://www.google.com/search?q=https://gin-gonic.com/docs/)

**What to look for:**

  * **"Custom Middleware":** Learn how to write functions that can intercept and process requests.
  * **"Model binding and validation":** Gin can automatically parse JSON/XML/form data into a Go struct and validate it for you. This is a huge time-saver.
  * **"Serving static files":** Learn how to serve files like CSS, JavaScript, and images.
  * **"Grouping routes":** You've seen the basics, but the documentation shows how to apply middleware to specific groups.