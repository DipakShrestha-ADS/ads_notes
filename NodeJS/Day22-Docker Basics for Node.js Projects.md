# Day 22 - Docker Basics for Node.js Projects

## What You Will Learn Today

- What containers are and why they solve the "it works on my machine" problem
- The difference between an image and a container
- How to write a Dockerfile for a Node.js app
- How to build and run your container using Podman
- How your Node.js container talks to the PostgreSQL container
- How to keep secrets out of your container image

---

## 1. What a Container Is

Imagine you are shipping a piece of furniture. Instead of just sending the wood and screws and hoping the buyer has the right tools, you pack everything into one sealed box: the parts, the screws, the exact tool needed, and the instructions. The buyer opens the box and it works the same way every time, regardless of what tools they already own.

A container works the same way for software. It packages your application code together with the exact version of Node.js, the exact dependencies, and the exact configuration it needs to run. It does not matter what operating system or what software is already installed on the machine running it. The container runs the same way everywhere.

This solves the classic problem where code works on your laptop but breaks on your teammate's machine or on a production server, because they had a different Node.js version or missing dependency.

You already used containers throughout this course for PostgreSQL, defined in your `docker-compose.yaml` file. Today you containerize your own Node.js application the same way.

---

## 2. Image vs Container

These two words are related but different.

An image is the packaged blueprint. It contains your code, dependencies, and instructions for how to run it, but it is not running yet. Think of it like a recipe written down on paper.

A container is a running instance of an image. You can start multiple containers from the same image, just like you can cook the same recipe multiple times.

```
Dockerfile  --build-->  Image  --run-->  Container (running)
(instructions)         (packaged app)     (live process)
```

---

## 3. Docker vs Podman

Docker popularized containers and created the standard format that almost every tool follows today, including the `Dockerfile` format and `docker-compose.yaml` format. Podman is a compatible alternative that reads the exact same `Dockerfile` and compose file formats, so everything you learn about "Docker concepts" applies directly, you just run it with the `podman` command instead of `docker`.

This course uses Podman for all container commands. If a tutorial online says `docker build` or `docker run`, you can substitute `podman build` or `podman run` and it works the same way.

---

## 4. Writing a Dockerfile

A Dockerfile is a plain text file with step-by-step instructions for building your image. Create it in your project root, next to `package.json`.

```dockerfile
# Dockerfile

# Start from an official Node.js image - this already has Node.js installed
# The "alpine" version is a small, lightweight version of Linux
FROM node:22-alpine

# Set the working directory inside the container
# All following commands run relative to this folder
WORKDIR /app

# Copy only package.json and package-lock.json first
# This lets Podman reuse the cached install step if only your code changes later, not your dependencies
COPY package*.json ./

# Install production dependencies only, skipping devDependencies like nodemon
RUN npm install --omit=dev

# Copy the rest of your project files into the container
COPY . .

# Generate the Prisma client inside the container
# This is required because node_modules is built fresh inside the container
RUN npx prisma generate

# Document which port the app listens on (informational, does not actually open the port)
EXPOSE 8888

# The command that runs when the container starts
CMD ["node", "src/server.js"]
```

Each line explained:
- `FROM` picks the base image to build on top of
- `WORKDIR` sets the folder where all later commands run
- `COPY package*.json ./` copies dependency files before the rest of the code
- `RUN npm install` installs dependencies inside the container
- `COPY . .` copies your actual application code
- `EXPOSE` documents the port your app uses
- `CMD` is the command that starts your app when the container runs

---

## 5. Creating a .dockerignore File

Just like `.gitignore` tells Git what to skip, `.dockerignore` tells Podman what to skip when building the image. This keeps your image smaller and avoids copying local secrets into it.

```
# .dockerignore
node_modules/
.env
.git/
src/logs/
npm-debug.log
```

Never let your `.env` file get copied into the image. Secrets should always be passed in separately, which you will see in the next section.

---

## 6. Adding the Node.js App to docker-compose.yaml

You already have a `docker-compose.yaml` with a `postgres` service from previous days. Now add a service for your own app so both containers run together and can talk to each other.

```yaml
# docker-compose.yaml
services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  app:
    build: .                          # build the image from the Dockerfile in this folder
    restart: always
    ports:
      - "${PORT}:8888"                # map the host port to the container's port 8888
    environment:
      # Inside the container, "postgres" is the hostname of the postgres service above
      # Containers on the same compose network can reach each other by service name
      DATABASE_URL: "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public"
      PORT: 8888
    depends_on:
      - postgres                      # start postgres before starting app

volumes:
  pgdata:
```

Notice the `DATABASE_URL` here uses `postgres` as the hostname, not `localhost`. Inside a compose network, each service can reach another service using its service name. `localhost` inside the `app` container would refer to the app container itself, not the database.

---

## 7. Building and Running with Podman

```bash
# Build and start both containers, showing logs in the terminal
podman compose up --build

# Build and start in the background
podman compose up --build -d

# Stop both containers
podman compose down

# View logs from the app container specifically
podman compose logs app -f
```

The `--build` flag tells Podman to rebuild the image from your Dockerfile before starting, which is important whenever you change your Dockerfile or your code.

---

## 8. Testing the Containerized App

Once `podman compose up --build -d` finishes, both containers are running. Your app is now reachable the same way it was before, since the port mapping exposes it on your machine:

```
GET http://localhost:8888/
Expected: your usual health check response
```

Check that both containers are running:

```bash
podman ps
```

You should see two containers listed, one for `postgres` and one for `app`.

---

## 9. Keeping Secrets Out of the Image

Never bake real secrets directly into a Dockerfile with an `ENV` instruction, because anyone who has access to the image can extract them.

```dockerfile
# wrong - secret becomes permanently baked into the image layer
ENV JWT_SECRET=my-actual-secret-key
```

Instead, pass secrets at runtime using the `environment` section in `docker-compose.yaml`, which reads from your `.env` file that is never committed to Git:

```yaml
# correct - value comes from .env at runtime, not baked into the image
environment:
  JWT_SECRET: ${JWT_SECRET}
```

This is the same idea from Day 19: secrets live in `.env`, never in your code or in your image.

---

## Summary

- A container packages your app with everything it needs to run consistently anywhere
- An image is the packaged blueprint, a container is a running instance of that image
- Podman uses the same Dockerfile and compose file format as Docker
- `Dockerfile` defines how to build your app's image step by step
- `.dockerignore` keeps unnecessary and sensitive files out of the image
- Inside a compose network, containers reach each other using service names, not `localhost`
- Never hardcode secrets into a Dockerfile, always pass them through environment variables at runtime

---

## Practice Tasks

1. Write the Dockerfile and `.dockerignore` for your mini project.
2. Add an `app` service to your existing `docker-compose.yaml`.
3. Run `podman compose up --build -d` and confirm both containers start.
4. Confirm your app can reach the database using the service name `postgres` in `DATABASE_URL`.
5. Test your API routes against `http://localhost:8888` while the app is running inside a container.
6. Run `podman compose down` and confirm both containers stop cleanly.

---

## Homework

Dockerize your mini project. Write the Dockerfile, `.dockerignore`, and updated `docker-compose.yaml` with both the `postgres` and `app` services. Write down the exact `podman compose` commands you used to build, run, and stop your containers.
