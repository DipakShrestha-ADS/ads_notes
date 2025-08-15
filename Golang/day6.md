## Day 6: Building a Simple Web Server 🌐

Today you'll learn how to make your Go programs communicate over the internet. We'll use Go's powerful built-in `net/http` package to create a web server from scratch. It's surprisingly easy\!

-----

### The `net/http` Package

The **`net/http`** package contains all the tools you need to build HTTP servers and clients in Go. For today, we'll focus on two core functions for building a server:

  * **`http.ListenAndServe(address, handler)`**: This function is the engine of your web server.
      * It tells the server to **listen** on a specific network address (like `":8080"` for localhost port 8080).
      * It then waits for incoming requests and **serves** them using a handler.
      * This function is **blocking**; it runs forever until the program is stopped or an error occurs.
  * **`http.HandleFunc(path, handlerFunction)`**: This function is like a traffic director.
      * It tells the server that all requests for a specific URL **path** (like `/` or `/about`) should be handled by a specific **handler function**.
      * You register all your routes using this function before starting the server.

### Handling Requests and Responses

Every handler function you write will receive two important arguments:

1.  **`http.ResponseWriter`** (commonly named `w`): This is your tool for crafting the reply to the user. It's an interface that lets you write your response headers and body. Think of it as the blank piece of paper you write your answer on before sending it back.
2.  **`*http.Request`** (commonly named `r`): This is an object that contains all the information about the incoming request from the user's browser. It includes the URL, the HTTP method (GET, POST, etc.), and any data submitted. Think of it as the letter you receive from the user.

**The Basic Flow:**

1.  A user's browser sends a request to your server (e.g., `http://localhost:8080/about`).
2.  `ListenAndServe` receives the request.
3.  It looks at the path (`/about`) and finds the handler function you registered with `HandleFunc`.
4.  It calls your handler function, passing it the `ResponseWriter` (`w`) and the `Request` (`r`).
5.  Your function uses `r` to understand the request and uses `w` to write the response.

-----

### Task Solutions

#### Task 1: Create a web server that responds with "Welcome to my website\!"

**Solution:**

```go
package main

import (
	"fmt"
	"log"
	"net/http"
)

// homeHandler is the function that will handle all requests to the root path "/".
func homeHandler(w http.ResponseWriter, r *http.Request) {
	// Fprintf is like Printf but it writes to a writer instead of the console.
	// Here, we write the string directly to the http.ResponseWriter.
	fmt.Fprintf(w, "Welcome to my website!")
}

func main() {
	// Register the homeHandler function to handle all requests for the URL path "/".
	http.HandleFunc("/", homeHandler)

	fmt.Println("Starting server on port 8080...")
	// Start the web server on port 8080.
	// We pass 'nil' as the second argument to use the default router we just configured.
	// 'log.Fatal' will print an error and exit the program if the server fails to start.
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

**How to run it:**

1.  Save the code as `server.go`.
2.  Run `go run server.go` in your terminal.
3.  Open a web browser and go to `http://localhost:8080`. You will see the welcome message.

#### Task 2: Add a new route `/about` that provides information about the site.

**Solution:** We just need to add another handler and register it.

```go
package main

import (
	"fmt"
	"log"
	"net/http"
)

func homeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the Home Page!")
}

// aboutHandler handles requests for the "/about" path.
func aboutHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "This is a simple web server created with Go.")
}

func main() {
	// Register the handler for the root path.
	http.HandleFunc("/", homeHandler)
	// Register the new handler for the "/about" path.
	http.HandleFunc("/about", aboutHandler)

	fmt.Println("Starting server on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

Now, if you run this and go to `http://localhost:8080/about`, you'll see the new message.

#### Task 3: Serve a simple HTML file.

**Solution:**
First, create an HTML file named `index.html` in the same directory as your Go program.

**`index.html`:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Go Web Page</title>
</head>
<body>
    <h1>Hello from an HTML file!</h1>
    <p>This file is being served by a Go web server.</p>
</body>
</html>
```

Now, modify your Go code to serve this file.

**`server.go`:**

```go
package main

import (
	"fmt"
	"log"
	"net/http"
)

// This handler will now serve our HTML file.
func htmlHandler(w http.ResponseWriter, r *http.Request) {
	// http.ServeFile is a helper function that reads a file and writes its
	// contents to the http.ResponseWriter. It also handles setting the
	// correct Content-Type header (e.g., "text/html").
	http.ServeFile(w, r, "./index.html")
}

func main() {
	http.HandleFunc("/", htmlHandler)

	fmt.Println("Starting server on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

When you run this and visit `http://localhost:8080`, you will see your rendered HTML page.

#### Task 4: Handle different HTTP methods (GET, POST).

**Solution:** We can check the `r.Method` field inside our handler to see which HTTP method was used.

```go
package main

import (
	"fmt"
	"log"
	"net/http"
)

func formHandler(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is GET.
	if r.Method == "GET" {
		// If it's a GET request, serve a simple HTML form.
		// The form's 'action' is the same URL, but its 'method' is POST.
		fmt.Fprintf(w, `
            <h1>Simple Form</h1>
            <form action="/" method="POST">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name">
                <button type="submit">Submit</button>
            </form>
        `)
	// Check if the request method is POST.
	} else if r.Method == "POST" {
		// If it's a POST request, we need to parse the form data.
		if err := r.ParseForm(); err != nil {
			fmt.Fprintf(w, "ParseForm() err: %v", err)
			return
		}
		// Get the value of the 'name' field from the submitted form.
		name := r.FormValue("name")
		// Write a personalized greeting.
		fmt.Fprintf(w, "Hello, %s!", name)
	} else {
		// Handle other methods like PUT, DELETE, etc.
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func main() {
	http.HandleFunc("/", formHandler)

	fmt.Println("Starting server on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

**How it works:**

1.  When you first visit `http://localhost:8080`, your browser makes a GET request, and you see the HTML form.
2.  When you type a name and click submit, the browser makes a POST request to the same URL, sending the form data.
3.  The handler detects the POST method, parses the data, and displays the greeting.

#### Task 5: Read about the `http.Request` and `http.ResponseWriter` types.

**Solution:**

Think of ordering food at a restaurant.

  * **`http.Request`**: This is your **order slip**. It contains everything the kitchen (your server) needs to know about what you want.

      * `r.URL`: What dish you want (e.g., `/pizzas/pepperoni`).
      * `r.Method`: How you want it (e.g., `GET` - just look at the menu, `POST` - place a new order).
      * `r.Header`: Special instructions (e.g., "Content-Type: application/json" - I'm ordering in a specific format).
      * `r.Body`: The details of your custom order (e.g., the JSON data for a new pizza).

  * **`http.ResponseWriter`**: This is the **tray** the kitchen uses to send your food back to you. You, as the programmer, put things on this tray.

      * `w.WriteHeader(http.StatusOK)`: You put the status on the tray first (e.g., `200 OK` - order successful, `404 Not Found` - we don't have that dish).
      * `w.Header().Set("Content-Type", "text/html")`: You put a label on the tray explaining what kind of food it is (e.g., this is an HTML page, not a JSON object).
      * `w.Write([]byte("Hello"))`: You place the actual food (the response body) on the tray.

By reading the `Request` and writing to the `ResponseWriter`, you control the entire server interaction.