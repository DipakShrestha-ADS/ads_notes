## Day 10: Real-time Communication with Gorilla WebSocket ↔️

Today, we're moving beyond the simple request-response model of HTTP to explore **WebSockets**, a technology that allows for persistent, two-way communication between a client and a server. This is the magic behind chat apps, live notifications, and online multiplayer games.

-----

### Introduction to WebSockets

Standard HTTP is like sending letters. The client sends a request (a letter), and the server sends back a response (a reply letter). The conversation is over until the client sends a new letter.

**WebSockets**, on the other hand, are like a telephone call. Once the connection is established, both the client and the server can talk (send data) to each other at any time, without waiting for the other to ask.

**Key Features:**

  * **Bidirectional:** Data can flow from client-to-server and server-to-client simultaneously.
  * **Full-duplex:** Both parties can send and receive data at the same time.
  * **Persistent Connection:** A single TCP connection is kept open, reducing the overhead of creating new connections for each message.

### Using Gorilla WebSocket with Gin

While Go has some low-level support for WebSockets, the community standard is the **Gorilla WebSocket** library. It provides a robust and easy-to-use API for handling WebSocket connections.

First, let's install the library:

```sh
go get github.com/gorilla/websocket
```

The process of establishing a WebSocket connection involves "upgrading" a standard HTTP GET request. The client essentially asks, "Can we switch from HTTP to a WebSocket connection?" and the server agrees. The Gorilla library provides an `Upgrader` to handle this handshake.

**The Basic Flow in Gin:**

1.  Define a regular GET route in Gin (e.g., `/ws`).
2.  In the handler, create an instance of `websocket.Upgrader`.
3.  Call `upgrader.Upgrade(c.Writer, c.Request, nil)` to perform the handshake. This takes the standard `http.ResponseWriter` and `*http.Request` and converts the connection to a WebSocket.
4.  Once upgraded, you get a `*websocket.Conn` object. You'll use this object's methods (`ReadMessage`, `WriteMessage`) to communicate.

-----

### Task 1, 2, & 3: Create a Simple Chat Application

This is a comprehensive task, so we'll build it in a few parts. The architecture involves a **Hub** that manages all connected clients and broadcasts messages to them.

#### Step 1: The WebSocket Upgrader and Main Handler

Let's set up the Gin route and the upgrader.

**`main.go`**

```go
package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// We'll need a websocket.Upgrader to upgrade the HTTP connection
// to a WebSocket connection.
var upgrader = websocket.Upgrader{
	// CheckOrigin allows us to configure Cross-Origin Resource Sharing (CORS).
	// For this example, we'll allow all origins. In a real application,
	// you would want to restrict this to your domain.
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// serveWs handles websocket requests from the peer.
func serveWs(hub *Hub, c *gin.Context) {
	// Upgrade the HTTP server connection to the WebSocket protocol.
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println(err)
		return
	}
	// Create a new client and register it with the hub.
	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}
	client.hub.register <- client

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}

func main() {
	// Create a new hub.
	hub := newHub()
	// Run the hub in a separate goroutine.
	go hub.run()

	router := gin.Default()
	// Serve the index.html file at the root.
	router.LoadHTMLFiles("index.html")
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	// Configure the websocket route.
	router.GET("/ws", func(c *gin.Context) {
		serveWs(hub, c)
	})

	router.Run(":8080")
}
```

#### Step 2: The Client

A `Client` represents a single user connected via WebSocket. It has a `readPump` to read messages from the user and a `writePump` to send messages to the user.

**`client.go`**

```go
package main

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second
	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second
	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10
)

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	hub *Hub
	// The websocket connection.
	conn *websocket.Conn
	// Buffered channel of outbound messages.
	send chan []byte
}

// readPump pumps messages from the websocket connection to the hub.
func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		// Read a message from the WebSocket connection.
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		// Send the message to the hub's broadcast channel.
		c.hub.broadcast <- message
	}
}

// writePump pumps messages from the hub to the websocket connection.
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			// Write the message to the WebSocket connection.
			c.conn.WriteMessage(websocket.TextMessage, message)
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
```

#### Step 3: The Hub

The `Hub` is the central component. It keeps track of all active clients and broadcasts messages to them. This is how we achieve the "broadcast to all" functionality.

**`hub.go`**

```go
package main

// Hub maintains the set of active clients and broadcasts messages to the clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool
	// Inbound messages from the clients.
	broadcast chan []byte
	// Register requests from the clients.
	register chan *Client
	// Unregister requests from clients.
	unregister chan *Client
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			// When a client connects, add them to the map.
			h.clients[client] = true
		case client := <-h.unregister:
			// When a client disconnects, close their send channel and delete them.
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			// When a message is received, loop through all connected clients.
			for client := range h.clients {
				select {
				case client.send <- message:
					// Send the message to the client's send channel.
				default:
					// If the send channel is full, assume the client is dead
					// or lagging and unregister them.
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}
```

#### Step 4: The HTML Frontend

Create an `index.html` file for the user interface.

**`index.html`**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Simple Chat</title>
</head>
<body>
    <h1>Simple WebSocket Chat</h1>
    <input id="input" type="text" />
    <button onclick="send()">Send</button>
    <pre id="output"></pre>
    <script>
        var input = document.getElementById("input");
        var output = document.getElementById("output");
        // Establish a WebSocket connection to our /ws endpoint.
        var socket = new WebSocket("ws://localhost:8080/ws");

        socket.onopen = function () {
            output.innerHTML += "Status: Connected\n";
        };

        // This function is called whenever the server sends a message.
        socket.onmessage = function (e) {
            output.innerHTML += "Server: " + e.data + "\n";
        };

        function send() {
            // Send the content of the input box to the server.
            socket.send(input.value);
            input.value = "";
        }
    </script>
</body>
</html>
```

Now, run `go run .` (or `go run main.go client.go hub.go`) and open `http://localhost:8080` in multiple browser tabs. You can now chat between them in real-time\!

-----

### Task 4: Implement a "user is typing" feature.

This requires a small change. We'll agree on a special message format, perhaps a simple JSON object, to distinguish chat messages from system messages like "typing".

**Frontend (`index.html`):**
Add an event listener to the input box.

```html
<script>
    // ... (existing script)
    
    // Send a 'typing' message when the user types in the input box.
    input.addEventListener("input", () => {
        let msg = { type: "typing", value: true };
        socket.send(JSON.stringify(msg));
    });

    function send() {
        let msg = { type: "chat", value: input.value };
        socket.send(JSON.stringify(msg));
        input.value = "";
    }
</script>
```

**Backend (`client.go`):**
In the `readPump`, we now need to parse the JSON and decide whether to broadcast it or not. For a simple "typing" indicator, we might just broadcast it to everyone *except* the sender.

```go
// In client.go, inside readPump()
// ...
// Replace 'c.hub.broadcast <- message' with this:
// We would need to parse the message here. For simplicity,
// let's assume all messages are broadcast. A real implementation
// would parse the JSON and handle 'typing' messages differently,
// perhaps by not sending them back to the original client.
c.hub.broadcast <- message
```

A full implementation would involve more complex logic in the hub to track who is typing and only broadcast the chat messages, while the frontend would display a "User is typing..." indicator when it receives a typing message.

-----

### Task 5: Explore WebSocket security considerations.

1.  **Use WSS (WebSocket Secure):** Just like HTTPS for HTTP, WSS provides a secure, encrypted WebSocket connection. If your site is served over HTTPS, you **must** use WSS for your WebSocket connections. This is handled automatically by most reverse proxies (like Nginx) when you configure SSL/TLS.

2.  **Origin Header Check:** Web browsers send an `Origin` header with the WebSocket handshake request. Your server should always check this header to ensure the connection is coming from an authorized domain. This prevents **Cross-Site WebSocket Hijacking (CSWH)**, where a malicious website could try to open a WebSocket connection to your server on behalf of a user. In our example, we disabled this for simplicity with `CheckOrigin: func(r *http.Request) bool { return true }`, but in production, it should be:

    ```go
    CheckOrigin: func(r *http.Request) bool {
        return r.Header.Get("Origin") == "https://your-allowed-domain.com"
    }
    ```

3.  **Authentication:** Don't assume a WebSocket connection is authenticated just because the user logged in on the website. You must re-authenticate the WebSocket connection itself, typically by having the client send a JWT or session cookie as part of the initial handshake request, which you can then validate on the server.