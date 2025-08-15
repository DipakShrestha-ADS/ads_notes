## Day 5: Concurrency in Go ⚡

Welcome to one of the most exciting features of Go: **concurrency**. Concurrency is the ability to have multiple tasks in progress at the same time. Go makes this incredibly simple and efficient with goroutines and channels.

-----

### Goroutines

A **goroutine** is a lightweight thread of execution. Think of it as a function that can run independently and simultaneously alongside other functions. They are called "lightweight" because they are much cheaper to create and manage than traditional operating system threads. You can easily have thousands, or even millions, of goroutines running at once.

#### The `go` Keyword

Creating a goroutine is astonishingly simple. You just place the `go` keyword in front of a function call. The Go runtime will then schedule this function to run concurrently with the rest of your program.

**Example:**

```go
package main

import (
    "fmt"
    "time"
)

// This is a simple function that prints a message five times.
func say(message string) {
    for i := 0; i < 5; i++ {
        // We pause for a short duration to see the concurrency in action.
        time.Sleep(100 * time.Millisecond)
        fmt.Println(message)
    }
}

func main() {
    // We call the 'say' function as a goroutine.
    // The program does NOT wait for it to finish. It starts it and immediately
    // moves to the next line.
    go say("Hello")

    // We call 'say' again, but this time as a normal function call.
    // The main function will execute this and wait for it to complete.
    say("World")
}
```

If you run this, you'll see "Hello" and "World" printed interleaved, showing they are running at the same time.

-----

### Channels

Goroutines are great, but how do they talk to each other? The answer is **channels**.

A **channel** is a typed conduit through which you can send and receive values between goroutines. Think of it as a conveyor belt that safely transports data from one part of your program to another.

#### Sending and Receiving Data

You use the `<-` operator to send and receive data on a channel.

  * `channel <- value` // Send `value` to `channel`.
  * `variable := <-channel` // Receive a value from `channel` and store it in `variable`.

Sending and receiving are **blocking** operations by default.

  * When you send a value to a channel, the sending goroutine will pause until another goroutine is ready to receive the value.
  * When you receive a value from a channel, the receiving goroutine will pause until a value is sent to that channel.

This blocking nature is the key to synchronizing goroutines.

**Example:**

```go
package main

import "fmt"

func main() {
    // 'make(chan string)' creates a new channel that can transport strings.
    messages := make(chan string)

    // We start a new goroutine using an anonymous function (a function without a name).
    go func() {
        // Inside the goroutine, we send the string "Ping!" to the 'messages' channel.
        // This line will block until the main goroutine is ready to receive it.
        messages <- "Ping!"
    }() // The () at the end calls the function.

    // The main goroutine now waits to receive a value from the channel.
    // This line will block until the goroutine sends the "Ping!" message.
    msg := <-messages

    // Once the value is received, we print it.
    fmt.Println(msg) // Output: Ping!
}
```

-----

### Task Solutions

#### Task 1: Write a program that launches two goroutines to print numbers from 1 to 5 and 6 to 10 concurrently.

**Solution:**

```go
package main

import (
    "fmt"
    "time"
)

// This function prints numbers in a given range.
func printNumbers(start, end int) {
    for i := start; i <= end; i++ {
        fmt.Printf("%d ", i)
        time.Sleep(50 * time.Millisecond) // A small delay to see interleaving.
    }
}

func main() {
    // Start the first goroutine to print numbers from 1 to 5.
    go printNumbers(1, 5)

    // Start the second goroutine to print numbers from 6 to 10.
    go printNumbers(6, 10)

    // The main function needs to wait for the goroutines to finish.
    // If main exits, the entire program exits, killing the goroutines.
    // For now, we'll use a simple, but not ideal, sleep.
    // Task 4 will show the correct way to do this.
    time.Sleep(1 * time.Second)
    fmt.Println("\nMain function finished.")
}
```

**Explanation:** The output will be a mix of numbers from both ranges (e.g., `1 6 2 7 3 8...`), demonstrating that the two `printNumbers` functions were running concurrently. The `time.Sleep` in `main` is a temporary hack to prevent the program from exiting before the goroutines have a chance to run.

#### Task 2: Use a channel to send a message from one goroutine to another.

**Solution:** This is the exact pattern shown in the main channel example above.

```go
package main

import (
    "fmt"
    "time"
)

// This function takes a channel as an argument.
func sendMessage(ch chan string) {
    fmt.Println("Goroutine: preparing to send message...")
    time.Sleep(2 * time.Second) // Simulate some work.
    // Send a message to the channel.
    ch <- "Hello from the goroutine!"
    fmt.Println("Goroutine: message sent.")
}

func main() {
    // Create a channel for strings.
    messageChannel := make(chan string)

    // Start a goroutine and pass the channel to it.
    go sendMessage(messageChannel)

    fmt.Println("Main: waiting for message...")
    // Block and wait to receive the message from the channel.
    receivedMessage := <-messageChannel

    // Once the message is received, print it.
    fmt.Println("Main: received message:", receivedMessage)
}
```

#### Task 3: Implement a simple worker pool.

**Solution:** A worker pool is a common concurrency pattern where you have a fixed number of goroutines (workers) processing a queue of jobs.

```go
package main

import (
    "fmt"
    "time"
)

// 'worker' is our goroutine function. It will receive jobs from the 'jobs' channel
// and send results to the 'results' channel.
func worker(id int, jobs <-chan int, results chan<- int) {
    // It ranges over the jobs channel. The loop will automatically end
    // when the 'jobs' channel is closed.
    for j := range jobs {
        fmt.Printf("Worker %d started job %d\n", id, j)
        time.Sleep(time.Second) // Simulate work
        fmt.Printf("Worker %d finished job %d\n", id, j)
        // Send the result of the work to the results channel.
        results <- j * 2
    }
}

func main() {
    // The number of jobs we need to process.
    const numJobs = 5
    // Create a buffered channel for jobs. We can send up to 5 jobs
    // without a receiver being ready.
    jobs := make(chan int, numJobs)
    // Create a buffered channel for results.
    results := make(chan int, numJobs)

    // Start up 3 worker goroutines.
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // Send 5 jobs to the 'jobs' channel.
    for j := 1; j <= numJobs; j++ {
        jobs <- j
    }
    // 'close' the jobs channel to signal that no more jobs will be sent.
    // This is crucial for the worker's for...range loop to terminate.
    close(jobs)

    // Finally, we collect all the results from the work.
    // This also ensures that the main goroutine waits for all jobs to be done.
    for a := 1; a <= numJobs; a++ {
        <-results
    }
    fmt.Println("All jobs are done.")
}
```

#### Task 4: Explore the `sync` package, particularly `WaitGroup`.

**Solution:** A `sync.WaitGroup` is the standard, reliable way to wait for a collection of goroutines to finish. It's a counter that can be incremented, decremented, and waited on until it reaches zero.

Let's refactor Task 1 to use a `WaitGroup`.

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func printNumbersWithWG(start, end int, wg *sync.WaitGroup) {
    // 'defer' schedules a function call to be run when the surrounding function exits.
    // We call 'wg.Done()' to decrement the WaitGroup counter when this goroutine finishes.
    defer wg.Done()

    for i := start; i <= end; i++ {
        fmt.Printf("%d ", i)
        time.Sleep(50 * time.Millisecond)
    }
}

func main() {
    // Create a new WaitGroup.
    var wg sync.WaitGroup

    // We are about to launch two goroutines, so we increment the counter by 2.
    wg.Add(2)

    // Start the first goroutine. We pass a pointer to the WaitGroup.
    go printNumbersWithWG(1, 5, &wg)

    // Start the second goroutine.
    go printNumbersWithWG(6, 10, &wg)

    // 'wg.Wait()' blocks the main function until the WaitGroup counter becomes zero.
    // This happens after both goroutines have called 'wg.Done()'.
    wg.Wait()

    fmt.Println("\nMain function finished.")
}
```

#### Task 5: Write a program that fetches data from two different URLs concurrently.

**Solution:**

```go
package main

import (
    "fmt"
    "io"
    "net/http"
    "sync"
    "time"
)

func fetchURL(url string, wg *sync.WaitGroup, ch chan<- string) {
    // Decrement the WaitGroup counter when the function returns.
    defer wg.Done()

    // Start a timer to measure how long the fetch takes.
    start := time.Now()

    // Make the HTTP GET request.
    resp, err := http.Get(url)
    if err != nil {
        // If there's an error, send an error message to the channel.
        ch <- fmt.Sprintf("Error fetching %s: %v", url, err)
        return
    }
    // Ensure the response body is closed when the function returns.
    defer resp.Body.Close()

    // Read the response body. We discard the body content with io.Copy
    // but get its size. This simulates processing the response.
    bytes, _ := io.Copy(io.Discard, resp.Body)
    // Calculate the duration.
    secs := time.Since(start).Seconds()

    // Send a formatted result string to the channel.
    ch <- fmt.Sprintf("%.2fs %7d bytes %s", secs, bytes, url)
}

func main() {
    // Start a timer for the whole program.
    start := time.Now()

    // Create a channel to receive the results.
    ch := make(chan string)
    // Create a WaitGroup.
    var wg sync.WaitGroup

    // A slice of URLs to fetch.
    urls := []string{
        "https://golang.org",
        "https://www.google.com",
    }

    // We need to wait for each URL fetch.
    wg.Add(len(urls))

    // Loop through the URLs and start a goroutine for each one.
    for _, url := range urls {
        go fetchURL(url, &wg, ch)
    }

    // Start another goroutine that will close the channel
    // ONLY after all the fetchURL goroutines are done.
    go func() {
        wg.Wait()
        close(ch)
    }()

    // Range over the channel to receive and print all the results.
    // This loop will block until the channel is closed.
    for result := range ch {
        fmt.Println(result)
    }

    // Print the total time taken.
    fmt.Printf("%.2fs elapsed\n", time.Since(start).Seconds())
}
```