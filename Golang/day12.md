## Day 12: Authentication and Authorization 🔐

So far, our API has been open to everyone. Today, we'll implement **authentication**—the process of verifying who a user is. We'll use **JSON Web Tokens (JWTs)**, the modern standard for securing APIs.

-----

### What are JSON Web Tokens (JWTs)?

A **JWT** is a compact, self-contained, and secure way of transmitting information between parties as a JSON object. Think of it as a secure access pass, like a concert ticket or a hotel key card.

A JWT consists of three parts separated by dots (`.`):

1.  **Header:** Contains metadata about the token, like the signing algorithm used (e.g., HMAC SHA256).
2.  **Payload:** Contains the "claims" or data about the user, such as their user ID, username, and an expiration date for the token. This is the information the server will use.
3.  **Signature:** A cryptographic signature created by combining the header, payload, and a secret key known only to the server. This signature ensures that the token hasn't been tampered with.

**The Authentication Flow:**

1.  A user logs in with their username and password.
2.  The server verifies the credentials.
3.  If they are correct, the server creates a JWT containing the user's ID and an expiration time, signs it with a secret key, and sends it back to the user.
4.  The user's application (e.g., a web browser or mobile app) stores this token.
5.  For every subsequent request to a protected API endpoint, the user includes the JWT in the `Authorization` header.
6.  The server's middleware intercepts the request, validates the JWT's signature and expiration, and if everything is valid, allows the request to proceed.

-----

### Prerequisite: Install Libraries

We need a library to handle JWT creation and validation, and a library for password hashing.

```sh
# The most popular JWT library for Go
go get -u github.com/golang-jwt/jwt/v5

# A library for securely hashing and verifying passwords
go get -u golang.org/x/crypto/bcrypt
```

-----

### Task 1: Implement User Registration and Login Endpoints

First, we need to set up our user model and database connection from Day 9. We'll add a `Password` field to our `User` model.

**`user.model.go`**

```go
package main

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name     string
	City     string
	Password string `json:"-"` // The '-' tag prevents this field from ever being sent in JSON responses.
}
```

*Remember to run `AutoMigrate` again to add the new `Password` column.*

Now, let's create the registration and login handlers.

**`auth.handler.go`**

```go
package main

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// In a real app, get this from an environment variable
var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

// Register handles user registration.
func Register(c *gin.Context) {
	var input struct {
		Name     string `json:"name" binding:"required"`
		City     string `json:"city" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := User{Name: input.Name, City: input.City, Password: string(hashedPassword)}
	DB.Create(&user)

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

// Login handles user login and issues a JWT.
func Login(c *gin.Context) {
	var input struct {
		Name     string `json:"name" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	// Find the user by name
	if err := DB.Where("name = ?", input.Name).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Compare the provided password with the stored hash
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Create the JWT claims, which includes the user ID and expiry time
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &jwt.RegisteredClaims{
		Subject:   string(rune(user.ID)),
		ExpiresAt: jwt.NewNumericDate(expirationTime),
	}

	// Create the JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	// Return the token
	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}
```

-----

### Task 2 & 3: Create JWT Middleware and Protect Routes

Now, let's create the middleware that will protect our routes. It will extract the token from the `Authorization: Bearer <token>` header, validate it, and if it's valid, allow the request to proceed.

**`auth.middleware.go`**

```go
package main

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			return
		}

		// The header should be in the format "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			return
		}

		tokenString := parts[1]
		claims := &jwt.RegisteredClaims{}

		// Parse and validate the token
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// You can add the user ID to the context for later use in handlers
		c.Set("userID", claims.Subject)

		c.Next()
	}
}
```

Now, let's update `main.go` to use these new handlers and protect our CRUD routes.

**`main.go`**

```go
package main

import "github.com/gin-gonic/gin"

func main() {
	ConnectDatabase() // From Day 9

	router := gin.Default()

	// Public routes for authentication
	authRoutes := router.Group("/auth")
	{
		authRoutes.POST("/register", Register)
		authRoutes.POST("/login", Login)
	}

	// Protected routes for user management
	protectedRoutes := router.Group("/users")
	protectedRoutes.Use(AuthMiddleware()) // Apply the middleware here
	{
		protectedRoutes.GET("/", FindUsers)
		protectedRoutes.GET("/:id", FindUser)
		protectedRoutes.PATCH("/:id", UpdateUser)
		protectedRoutes.DELETE("/:id", DeleteUser)
	}

	router.Run(":8080")
}
```

-----

### Task 4: Implement a "Logout" Feature (Blacklisting)

JWTs are stateless, which means the server doesn't keep track of them. A "logout" on the client-side simply means deleting the token. However, that token is still valid until it expires. To implement a true server-side logout, you need to **blacklist** the token.

A fast in-memory database like **Redis** is perfect for this.

**The Logic:**

1.  Create a `/logout` endpoint that is protected by the `AuthMiddleware`.
2.  When a user hits `/logout`, the middleware validates their token.
3.  The logout handler takes the valid token and stores its unique ID (the `jti` claim) in Redis with a Time-To-Live (TTL) equal to the token's remaining validity.
4.  Modify the `AuthMiddleware` to check if the token's ID exists in the Redis blacklist on every request. If it does, reject the request even if the token is otherwise valid.

This is an advanced pattern and requires setting up Redis, but it's the most secure way to handle JWT invalidation.

-----

### Task 5: Read About Different JWT Libraries

The library we used, `github.com/golang-jwt/jwt`, is the de facto standard in the Go community. It's a fork of the original, now-deprecated `dgrijalva/jwt-go`.

**Why read the documentation?**

  * **Security:** Learn about different signing algorithms (like RSA for asymmetric keys) and best practices to avoid vulnerabilities.
  * **Custom Claims:** The documentation shows you how to add your own custom data to the token's payload, such as user roles or permissions.
  * **Error Handling:** Understand the different types of errors the library can return (e.g., `ErrTokenExpired`, `ErrTokenNotValidYet`) so you can handle them gracefully.
  * **Advanced Features:** Explore features like token refreshing and handling key rotation.

Reading the official documentation and examples will give you a much deeper understanding of how to use JWTs securely and effectively in your applications.