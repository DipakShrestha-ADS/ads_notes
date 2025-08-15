## Day 16: Introduction to Docker 🐳

Welcome to the world of containers\! Today, you'll learn about **Docker**, a tool that has revolutionized how developers build, ship, and run applications. It's a fundamental skill in modern cloud and backend development.

-----

### What is Docker?

**Docker** is a platform for developing, shipping, and running applications inside **containers**. The best analogy is a real-world shipping container. Before shipping containers, loading a ship was a chaotic process with items of all shapes and sizes. The shipping container standardized everything, making transport efficient and reliable, regardless of what was inside.

Docker does the same for software. It packages your application, along with all its dependencies (libraries, configuration files, etc.), into a single, standardized unit called a **container**. This container can then be run on any machine that has Docker installed, and it will behave exactly the same way, whether it's your laptop, a teammate's computer, or a production server in the cloud. This solves the classic developer problem: "It works on my machine\!"

#### Containers vs. Virtualization (VMs)

You might be familiar with Virtual Machines (VMs). While they also provide isolation, they are much heavier. A VM virtualizes an entire operating system, including the kernel. Containers, on the other hand, share the host machine's operating system kernel but isolate the application processes.

  * **Virtual Machines (Heavyweight):** Each VM includes a full copy of a guest operating system. This uses a lot of disk space and RAM.
  * **Containers (Lightweight):** Containers sit on top of the host OS and share its kernel. They are much smaller, start up in seconds, and use fewer resources.

-----

### Basic Docker Commands

Here are the four essential commands you'll use constantly.

  * `docker run [IMAGE]`
    This command is used to create and start a new container from an image. If you don't have the image locally, Docker will automatically download it for you.
  * `docker build -t [TAG] [PATH]`
    This command builds a new Docker image from a `Dockerfile`. The `-t` flag is used to "tag" or name your image (e.g., `my-go-app:latest`). The `[PATH]` is the location of your Dockerfile and build context (usually `.`).
  * `docker ps`
    This command lists all the **running** containers. To see all containers, including stopped ones, use `docker ps -a`.
  * `docker images`
    This command lists all the Docker **images** that you have on your local machine.

-----

### Task Solutions

#### Task 1: Install Docker on your machine.

**Solution:**
Docker provides an easy-to-use desktop application for Windows and macOS, and a standard installation for Linux.

1.  Go to the official Docker website: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2.  Download the installer for your operating system.
3.  Run the installer and follow the on-screen instructions.
4.  After installation, open your terminal or command prompt and run `docker --version` to verify it's installed correctly.

#### Task 2: Run a "hello-world" container to verify your installation.

**Solution:**
This is the simplest way to confirm that Docker is working.

```sh
docker run hello-world
```

**What happens when you run this?**

1.  The Docker client talks to the Docker daemon (the background service).
2.  The daemon checks if you have the `hello-world` image locally. You don't.
3.  The daemon pulls the `hello-world` image from Docker Hub (the public registry).
4.  The daemon creates a new container from that image.
5.  The daemon runs the container, which executes a simple program that prints a message to your terminal.
6.  The container stops.

You should see a message that starts with "Hello from Docker\!".

#### Task 3: Pull and run the official PostgreSQL Docker image.

**Solution:**
This is the same command we used on Day 9. Let's break down what each flag does.

```sh
docker run --name gorm-postgres -e POSTGRES_USER=gorm -e POSTGRES_PASSWORD=gorm -e POSTGRES_DB=gorm -p 5432:5432 -d postgres
```

  * `docker run`: The command to run a container.
  * `--name gorm-postgres`: Gives the running container a human-readable name.
  * `-e POSTGRES_USER=gorm`: Sets an **e**nvironment variable inside the container. The PostgreSQL image uses these to configure the database on first startup.
  * `-p 5432:5432`: **P**ublishes a port. This maps port `5432` on your host machine to port `5432` inside the container, allowing your Go application to connect to it.
  * `-d`: Runs the container in **d**etached mode (in the background).
  * `postgres`: The name of the image to run.

#### Task 4: Explore the Docker Hub for other useful images.

**Solution:**
**Docker Hub** is the largest public registry of container images. It's like GitHub, but for Docker images. You can find official images for almost any technology you can think of.

1.  Go to [https://hub.docker.com/](https://hub.docker.com/).
2.  Use the search bar to look for common services like:
      * `redis`: A popular in-memory key-value store.
      * `nginx`: A high-performance web server and reverse proxy.
      * `node`: The official image for running Node.js applications.
      * `python`: The official image for running Python applications.

Each official image has a detailed page explaining how to use it, what environment variables it supports, and common configurations.

#### Task 5: Learn the difference between a Docker image and a container.

**Solution:**
This is the most fundamental concept in Docker.

  * An **Image** is a **blueprint** or a **recipe**. It's a read-only template that contains the application code, a runtime, libraries, and everything else needed to run the application. Images are built from a `Dockerfile`. They are inert and don't do anything on their own.
  * A **Container** is a **running instance** of an image. It's the actual, living thing that you create from the blueprint. You can create many containers from the same image, just like you can build many identical houses from the same blueprint. Each container is an isolated process running on your host machine.

**Analogy:** If an image is a class in object-oriented programming, a container is an object (an instance of that class).

-----

### What About Podman?

**Podman** is a popular, open-source alternative to Docker. For the most part, it works exactly like Docker, but with one major architectural difference.

  * **Docker** uses a **client-server architecture**. The `docker` command you type is a client that talks to a background service called the Docker daemon (`dockerd`). This daemon, which runs as root, is responsible for managing all your images and containers.
  * **Podman** is **daemonless**. The `podman` command interacts directly with the container registry and the Linux kernel to manage containers. There is no central daemon.

**Why does this matter?**

  * **Security:** Because Podman doesn't require a root daemon, it can easily run containers in a **rootless** mode. This means a compromised container has far fewer privileges and can't easily harm the host system, making it more secure by default.
  * **Compatibility:** The Podman team has intentionally made its commands compatible with Docker's. In many systems, you can simply run `alias docker=podman` and continue using the commands you already know.

For a beginner, the experience of using Docker and Podman is nearly identical. But as you advance, you'll appreciate the security and architectural simplicity that Podman's daemonless design offers.