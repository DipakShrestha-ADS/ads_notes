## Day 11: Middleware in Gin 🛡️

Today, we'll explore **middleware**, a core concept in web frameworks like Gin. Middleware helps you keep your code clean and organized by handling common tasks like logging, authentication, and error recovery in a reusable way.

-----

### What is Middleware?

A **middleware** is a function that sits between the incoming request and your final request handler. Think of it like a series of security checkpoints at an airport.

1.  A request arrives.
2.  It passes through the first middleware (e.g., a logger that writes down the request details).
3.  Then it passes through the next middleware (e.g., an authentication check).
4.  If it passes all the checks, it finally reaches your main handler (the "gate").
5.  On the way back, the response can also pass through the middleware, which might modify it or perform cleanup actions.

In Gin, a middleware is simply a handler function that calls `c.Next()` to pass control to the next middleware or handler in the chain.

-----

### Using Gin's Middleware

#### Default Middleware

When you create a router with `gin.Default()`, it automatically includes two very useful middleware:

1.  **`Logger()`**: This prints a detailed log for every incoming request to the console. It includes the status code, latency, method, and path.
2.  **`Recovery()`**: This is a lifesaver. If your handler has a `panic` (a critical, unrecoverable error), this middleware catches it and prevents the entire server from crashing. It recovers from the panic and returns a `500 Internal Server Error` response instead.

#### Writing Custom Middleware

A custom middleware is just a function that returns a `gin.HandlerFunc`.

**The basic structure:**

```go
func MyCustomMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // --- Code to execute BEFORE the request handler ---
        fmt.Println("I am the middleware, running before the handler!")

        // c.Next() passes control to the next middleware/handler in the chain.
        c.Next()

        // --- Code to execute AFTER the request handler ---
        // This code runs after the main handler has finished.
        fmt.Println("I am the middleware, running after the handler!")
    }
}
```

-----

### Task Solutions

#### Task 1: Analyze the output of Gin's default `Logger()` middleware.

**Solution:**

When you run a server using `gin.Default()`, you'll see lines like this in your console for every request:

```
[GIN] | 200 |      15.25µs |             ::1 | GET      "/users"
```

Let's break it down:

  * **`[GIN]`**: A prefix indicating the log is from the Gin framework.
  * **`| 200 |`**: The **HTTP Status Code** of the response. `200` means OK, `404` means Not Found, `500` means Internal Server Error, etc.
  * **`| 15.25µs |`**: The **latency**, or how long the server took to process the request from start to finish. `µs` is microseconds.
  * **`| ::1 |`**: The **client's IP address**. `::1` is the IPv6 equivalent of `127.0.0.1` (localhost).
  * **`| GET |`**: The **HTTP Method** used for the request.
  * **`"/users"`**: The **URL Path** that was requested.

This single line gives you a powerful, at-a-glance overview of your server's traffic and performance.

#### Task 2: Write a custom logging middleware that logs requests in a specific format.

**Solution:**

Let's create a logger that prints a simpler, custom message.

```go
package main

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

// CustomLogger is our custom middleware.
func CustomLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the start time of the request.
		startTime := time.Now()

		// Process the request by calling the next handler in the chain.
		c.Next()

		// Once the request is finished, calculate the latency.
		latency := time.Since(startTime)

		// Get the request method and path.
		method := c.Request.Method
		path := c.Request.URL.Path
		statusCode := c.Writer.Status()

		// Log our custom message.
		log.Printf("[CUSTOM LOG] %d | %s | %s %s", statusCode, latency, method, path)
	}
}

func main() {
	// Create a new router without the default middleware.
	router := gin.New()

	// Use our custom logger middleware.
	router.Use(CustomLogger())

	// A sample route to test the logger.
	router.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "hello world"})
	})

	router.Run(":8080")
}
```

When you run this and go to `http://localhost:8080/test`, your console will show:
`[CUSTOM LOG] 200 | 25.5µs | GET /test`

#### Task 3: Create a middleware for authenticating users with a simple static API key in the header.

**Solution:**

This middleware will check for an `X-API-Key` header and ensure it matches a secret value.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Define our secret API key. In a real app, this would come from a config file or env variable.
const ApiKey = "my-secret-key"

// AuthMiddleware checks for the presence and correctness of the API key.
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the value of the 'X-API-Key' header from the request.
		key := c.GetHeader("X-API-Key")

		// Check if the key is missing or incorrect.
		if key == "" || key != ApiKey {
			// If the key is invalid, we abort the request with an error.
			// c.AbortWithStatusJSON stops the chain and sends a JSON response.
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return // Stop further execution.
		}

		// If the key is valid, we call c.Next() to proceed to the next handler.
		c.Next()
	}
}

func main() {
	router := gin.Default()

	// This route is public and does not use the auth middleware.
	router.GET("/public", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "This is a public endpoint"})
	})

	// This route is protected by our auth middleware.
	router.GET("/private", AuthMiddleware(), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Welcome to the private area!"})
	})

	router.Run(":8080")
}
```

**How to test:**

  * `curl http://localhost:8080/private` -\> Returns `{"error":"Unauthorized"}`
  * `curl -H "X-API-Key: my-secret-key" http://localhost:8080/private` -\> Returns `{"message":"Welcome to the private area!"}`

#### Task 4: Apply your auth middleware to a specific group of routes.

**Solution:**

This is the cleanest way to protect multiple related endpoints.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

const ApiKey = "my-secret-key"

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		key := c.GetHeader("X-API-Key")
		if key != ApiKey {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		c.Next()
	}
}

func main() {
	router := gin.Default()

	// Public route
	router.GET("/status", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "API is up and running"})
	})

	// Create a new group for our protected API routes.
	protected := router.Group("/api/v1")
	// Apply the AuthMiddleware to the entire group.
	protected.Use(AuthMiddleware())
	{
		// All routes defined inside this block are now protected.
		protected.GET("/users", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"users": []string{"Alice", "Bob"}})
		})
		protected.GET("/products", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"products": []string{"Laptop", "Mouse"}})
		})
	}

	router.Run(":8080")
}
```

Now, both `/api/v1/users` and `/api/v1/products` require the `X-API-Key` header, but `/status` does not.

#### Task 5: Implement a CORS middleware from scratch.

**Solution:**

**CORS (Cross-Origin Resource Sharing)** is a security mechanism that browsers use. By default, a web page at `domain-a.com` is not allowed to make API requests to `domain-b.com`. To allow this, the server at `domain-b.com` must send specific CORS headers.

```go
package main

import (
	"github.com/gin-gonic/gin"
)

// CORSMiddleware is a custom middleware to handle CORS.
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Set the 'Access-Control-Allow-Origin' header.
		// Using "*" allows any origin, which is fine for public APIs.
		// For more security, you would set this to your frontend's domain.
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		// Set the allowed credentials header.
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		// Set the allowed headers.
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		// Set the allowed HTTP methods.
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		// Handle the preflight OPTIONS request.
		// Browsers send this request first to check if the actual request is safe to send.
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204) // 204 No Content
			return
		}

		// Pass control to the next handler.
		c.Next()
	}
}

func main() {
	router := gin.Default()

	// Use the CORS middleware globally for all routes.
	router.Use(CORSMiddleware())

	router.GET("/data", func(c *gin.Context) {
		c.JSON(200, gin.H{"data": "This data is accessible from any origin"})
	})

	router.Run(":8080")
}
```

**Note:** While writing your own CORS middleware is a great learning exercise, for production applications, it's often recommended to use a well-tested third-party library like `github.com/gin-contrib/cors`, which handles all the edge cases for you.