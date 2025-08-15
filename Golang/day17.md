## Day 17: Dockerizing a Go Application 📦

Now that you know what Docker is, it's time to create a container for our own Go application. This process is called **"Dockerizing"**. We'll write a `Dockerfile`, which is a recipe for building our application's image, and we'll learn a crucial technique called **multi-stage builds** to make our final image small and secure.

-----

### Creating a `Dockerfile` for Go

A **`Dockerfile`** is a simple text file that contains a series of instructions on how to build a Docker image. Each instruction creates a layer in the image.

Here are the most common instructions you'll use for a Go application:

  * `FROM [image]`: Specifies the **base image** to start from. For Go, we'll start with an official `golang` image that has all the Go tools pre-installed.
  * `WORKDIR /app`: Sets the **working directory** inside the container. All subsequent commands will be run from this directory.
  * `COPY [source] [destination]`: **Copies** files from your local machine into the container's filesystem.
  * `RUN [command]`: **Runs** a command inside the container during the build process. We'll use this to download dependencies and compile our code.
  * `CMD ["executable", "param1"]`: Specifies the **default command** to run when a container is started from the image. For our app, this will be the command to run our compiled binary.
  * `EXPOSE [port]`: **Informs** Docker that the container listens on the specified network port at runtime. This is good for documentation but doesn't actually publish the port.

-----

### Using Multi-Stage Builds

A simple `Dockerfile` might compile the code and leave it inside the `golang` base image. The problem is that the `golang` image is very large (hundreds of MBs) because it contains the entire Go compiler and toolchain. Our final production image doesn't need any of that; it only needs the single, compiled binary file.

A **multi-stage build** solves this problem by using multiple `FROM` instructions in a single `Dockerfile`.

1.  **The Build Stage:** The first stage uses the large `golang` image to compile our application. It downloads dependencies and builds the Go binary.
2.  **The Final Stage:** The second stage starts from a new, tiny base image (like `scratch` or `alpine`). We then **only copy the compiled binary** from the first stage into this new, clean stage.

The result is a tiny, optimized production image that contains only our application and nothing else, making it more secure and faster to deploy.

-----

### Task Solutions

#### Task 1 & 2: Write a multi-stage `Dockerfile` for your Gin API.

**Solution:**

Create a file named `Dockerfile` (with no extension) in the root of your project.

```dockerfile
# --- Stage 1: The Build Stage ---
# Start from the official Go image. We'll use a specific version for reproducibility.
# We can name this stage 'builder' to refer to it later.
FROM golang:1.22-alpine AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy the go.mod and go.sum files first. This is a Docker caching optimization.
# If these files don't change, Docker will use the cached layer for the next step.
COPY go.mod go.sum ./

# Download the application's dependencies.
RUN go mod download

# Copy the rest of the application's source code into the container.
COPY . .

# Compile the Go application.
# -o /app/main specifies the output file name and location.
# CGO_ENABLED=0 disables CGO, which is needed for a static binary.
# -ldflags="-w -s" strips debugging information, making the binary smaller.
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/main ./cmd/server/

# --- Stage 2: The Final Stage ---
# Start from a 'scratch' image, which is a completely empty image.
# This is the most minimal base possible.
FROM scratch

# Set the working directory.
WORKDIR /app

# Copy ONLY the compiled binary from the 'builder' stage.
COPY --from=builder /app/main .

# Expose port 8080 to inform Docker that our application uses this port.
EXPOSE 8080

# Set the command to run when the container starts.
# This will execute our compiled Go binary.
CMD ["./main"]
```

#### Task 3: Build a Docker image of your application.

**Solution:**

Open your terminal in the root of your project (the same directory as your `Dockerfile`) and run the `docker build` command.

```sh
# -t gin-api:latest tags (names) the image as 'gin-api' with the 'latest' version tag.
# . tells Docker to use the current directory as the build context.
docker build -t gin-api:latest .
```

After the build completes, you can run `docker images` to see your new `gin-api` image. You'll notice it's very small (likely around 10-15 MB) thanks to the multi-stage build\!

#### Task 4: Run your Go API inside a Docker container.

**Solution:**

Now that you have the image, you can run it as a container using `docker run`.

```sh
# -p 8080:8080 maps port 8080 on your local machine to port 8080 inside the container.
# --name my-api gives the running container a name.
# -d runs the container in detached (background) mode.
# gin-api:latest is the name of the image to run.
docker run -p 8080:8080 --name my-api -d gin-api:latest
```

Your Go API is now running inside a Docker container\! You can access it in your browser or with Postman at `http://localhost:8080`, just like before. You can see it running by typing `docker ps`.

#### Task 5: Learn how to pass environment variables to your container at runtime.

**Solution:**

Our application currently has the database connection string hardcoded. This is bad practice. We should pass it in as an environment variable.

First, let's modify our Go code to read from the environment.

**`internal/database/database.go` (Updated)**

```go
package database

import (
	"os"
	// ...
)

func Connect() (*gorm.DB, error) {
	// Read the DSN from an environment variable named "DATABASE_DSN".
	dsn := os.Getenv("DATABASE_DSN")
	if dsn == "" {
		// Provide a default for local development if the variable isn't set.
		dsn = "host=localhost user=gorm password=gorm dbname=gorm port=5432 sslmode=disable"
	}
	// ... (rest of the function is the same)
}
```

Now, when we run our container, we can pass this environment variable using the `-e` flag.

```sh
# First, stop and remove the old container
docker stop my-api
docker rm my-api

# Run the new container, passing the environment variable.
# IMPORTANT: 'host.docker.internal' is a special DNS name that Docker provides
# for containers to connect to services running on the host machine.
docker run -p 8080:8080 --name my-api \
  -e "DATABASE_DSN=host=host.docker.internal user=gorm password=gorm dbname=gorm port=5432 sslmode=disable" \
  -d gin-api:latest
```

By using environment variables, you make your Docker image much more flexible. You can run the same image in different environments (development, staging, production) just by providing different environment variables at runtime, without ever needing to rebuild the image.