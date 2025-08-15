## Day 20: Final Project - Putting It All Together 🏆

Congratulations\! You've reached the final day of the course. Today is all about synthesis—taking every concept you've learned, from Go fundamentals and Gin routing to GORM, Docker, and CI/CD, and applying it to build a complete, deployable application from scratch. This is your capstone project.

-----

### Task 1: Brainstorm and Choose a Final Project Idea

The goal is to choose a project that is interesting to you but also comprehensive enough to touch on most of the topics we've covered.

**Project Ideas Review:**

  * **A simple e-commerce API:** Good for practicing complex data models (products, orders, users) and relationships.
  * **A real-time polling application:** Excellent for using WebSockets and managing state.
  * **A microblogging platform API (like Twitter):** Great for handling user authentication, posts, and relationships (following/followers).
  * **A URL shortener service:** This is a classic choice and an excellent final project. It's simple enough to complete but covers all the essential concepts:
      * **CRUD:** Creating and retrieving links.
      * **Custom Logic:** Generating a unique short code.
      * **Networking:** Handling HTTP redirects.
      * **Database:** Storing the links.
      * **Authentication:** Can be extended with user accounts to manage links.

For this guide, we will proceed with the **URL Shortener Service** as our example project.

-----

### Task 2: Plan the API Endpoints, Schema, and Architecture

Before writing a single line of code, a good developer plans.

#### 1\. Architecture

We will use the scalable project structure we learned on **Day 14**.

```
url-shortener/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── auth/
│   │   ├── handler.go
│   │   └── middleware.go
│   ├── database/
│   │   └── database.go
│   └── link/
│       ├── handler.go
│       └── model.go
├── go.mod
├── Dockerfile
└── docker-compose.yml
```

#### 2\. Database Schema

We need a simple table to store our links.

**`links` table:**

  * `ID` (Primary Key, uint)
  * `OriginalURL` (string, indexed) - The long URL the user provides.
  * `ShortCode` (string, unique, indexed) - The generated short code (e.g., `a7Bfg3`).
  * `UserID` (uint, nullable) - Foreign key to a `users` table if you implement user accounts.
  * `CreatedAt`, `UpdatedAt` (from `gorm.Model`)

#### 3\. API Endpoints

Let's define the public contract for our API.

  * **`POST /api/v1/shorten`**

      * **Action:** Creates a new short link.
      * **Request Body:** `{"url": "https://a-very-long-url.com/with/path"}`
      * **Response:** `{"short_url": "http://localhost:8080/a7Bfg3"}`
      * **Authentication:** Optional. Could be public or require a user to be logged in.

  * **`GET /:shortCode`**

      * **Action:** Redirects the user to the original long URL.
      * **Request:** A user visits `http://localhost:8080/a7Bfg3`.
      * **Response:** An HTTP `302 Found` redirect to the `OriginalURL`.

  * **`GET /api/v1/links`**

      * **Action:** Lists all links created by the authenticated user.
      * **Response:** A JSON array of link objects.
      * **Authentication:** Required (JWT).

-----

### Task 3: Develop, Test, and Document Your Application

This is where you'll spend most of your time, applying the skills from the course.

#### 1\. Develop

  * **Setup:** Initialize your project, set up the Gin router in `main.go`.
  * **Database:** Create the GORM model for your `Link` and `User` structs. Set up the database connection and auto-migration.
  * **Core Logic:** Write the function to generate a random, unique `ShortCode`. This is the heart of your application. Ensure it handles potential collisions.
  * **Handlers:** Implement the Gin handlers for each endpoint (`POST /shorten`, `GET /:shortCode`, etc.).
  * **Authentication:** Implement the user registration and login handlers from **Day 12** to issue JWTs.
  * **Middleware:** Apply the JWT authentication middleware to your protected routes.

#### 2\. Test

  * **Unit Tests (Day 13):** Write tests for your core logic, especially the `ShortCode` generation function. Use table-driven tests to check various edge cases.
  * **Integration Tests (Day 13):** Write tests for your Gin handlers. Use `net/http/httptest` to simulate API calls to your `POST /shorten` endpoint and verify that you get a correct JSON response and status code. Test the `GET /:shortCode` endpoint to ensure it returns the correct redirect status and `Location` header.

#### 3\. Document

  * **Code Comments (Day 14):** Add Go doc comments to all your public functions and structs, explaining what they do.
  * **`README.md`:** Create a high-quality `README.md` file in your project root. It should include:
      * A brief description of the project.
      * Instructions on how to set it up and run it locally (e.g., `go run ./cmd/server`).
      * A list of all available API endpoints, including the method, path, required request body, and an example response. This is your API documentation.

-----

### Task 4: Dockerize the Application

Prepare your application for deployment by containerizing it.

1.  **`Dockerfile` (Day 17):**

      * Create a multi-stage `Dockerfile`.
      * The `builder` stage will compile your Go application into a static binary.
      * The final stage will copy the binary into a minimal `scratch` or `alpine` image.

2.  **`docker-compose.yml` (Day 18):**

      * Define two services: `api` and `db`.
      * The `api` service should build from your `Dockerfile`.
      * The `db` service should use the official `postgres` image.
      * Use a `.env` file to manage your database credentials and other configuration secrets.
      * Configure networking so your `api` service can connect to the `db` service using its service name (`host=db`).
      * Define a volume to persist the PostgreSQL data.

-----

### Task 5: Deploy Your Final Project to the Cloud

The final step is to share your creation with the world.

1.  **Choose a Cloud Provider (Day 19):** Create a free-tier account on GCP, AWS, or another provider.
2.  **Push Image to Registry:** Build your final Docker image and push it to a container registry (e.g., Google Artifact Registry, Docker Hub).
3.  **Provision a Database:** Create a managed PostgreSQL instance in the cloud (e.g., Google Cloud SQL, AWS RDS).
4.  **Deploy the Container:**
      * Use a managed container service like Google Cloud Run.
      * Create a new service and point it to the image in your registry.
      * **Crucially, configure the production environment variables** for your `DATABASE_DSN` and `JWT_SECRET_KEY`.
5.  **Test and Share:**
      * Once deployed, the service will give you a public URL.
      * Test all your endpoints on the live URL.
      * Share the link\! You've successfully built and deployed a complete web service with Go.

**Congratulations on finishing the course\! You now have a solid foundation in modern backend development with Go and a complete project in your portfolio to prove it.**