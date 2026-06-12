# 25-Day Node.js REST API Lesson Plan

Prepared for students who have already completed basic JavaScript and modern JavaScript concepts during React classes.

---

# Course Overview

This 25-day Node.js course is designed to help students move from JavaScript knowledge to real backend API development. Since we assume learners already know JavaScript basics, ES6 concepts, modules, and async programming, this course focuses directly on Node.js, Express.js, REST APIs, PostgreSQL, Prisma, authentication, validation, testing, security, documentation, Docker, deployment, and final project development.

The course follows a practical learning approach. Students will build APIs step by step, understand backend architecture, and complete a final project by the end of the course.

---

# Course Objectives

By the end of this course, students will be able to:

1. Understand how backend systems and APIs work.
2. Build REST APIs using Node.js and Express.js.
3. Organize backend projects using proper folder structure.
4. Connect Node.js applications with PostgreSQL.
5. Use Prisma ORM for database operations.
6. Validate incoming data and handle errors properly.
7. Implement authentication and authorization.
8. Build advanced API features like filtering, pagination, and file uploads.
9. Secure, test, and document APIs.
10. Dockerize and deploy a backend project.
11. Build and present a complete real-world REST API project.

---

# Prerequisite Reminder

Students are already expected to know:

- variables, functions, arrays, and objects
- ES6 syntax
- destructuring and spread operator
- modules
- promises and async/await
- basic error handling
- JSON basics

These topics will only be briefly reviewed when needed during backend development.

---

# Teaching Approach

Each day should ideally include:

- concept explanation
- live coding by teacher
- guided student practice
- Q&A and recap
- homework or mini assignment

---

# 25-Day Lesson Plan

## Day 1: Introduction to Backend, API, and Node.js

### Topics
- What is backend development
- Client, server, request, response
- What is an API
- What is Node.js
- Why Node.js is used for backend
- Installing Node.js and npm
- Running the first Node.js file

### Daily Objectives
By the end of the class, students should be able to:
- explain what backend does
- describe the role of an API
- explain what Node.js is
- run a simple Node.js program from the terminal

### Classroom Tasks
1. Install Node.js and verify installation.
2. Create a file named `app.js`.
3. Print a few lines in the console using `console.log()`.
4. Run the file using `node app.js`.
5. Discuss examples of frontend and backend communication.

### Homework
- Write short notes on backend, API, request, and response.
- Create a simple Node.js file that prints your name, course name, and today's date.

---

## Day 2: Node.js Runtime, npm, package.json, and Environment Variables

### Topics
- Understanding Node.js runtime
- What npm is
- Creating a Node.js project
- `npm init`
- Understanding `package.json`
- Installing packages
- Environment variables
- Introduction to `.env`

### Daily Objectives
By the end of the class, students should be able to:
- initialize a Node.js project
- explain the purpose of `package.json`
- install packages using npm
- use environment variables in a basic project

### Classroom Tasks
1. Create a new project folder.
2. Run `npm init -y`.
3. Install Express.
4. Create a `.env` file and add a sample port variable.
5. Print the environment variable in a Node.js file.

### Homework
- Create a new Node.js project from scratch.
- Add two custom values in `.env` and print them in the console.

---

## Day 3: HTTP Fundamentals and REST API Concepts

### Topics
- HTTP methods
- GET, POST, PUT, PATCH, DELETE
- Status codes
- Headers
- Request body
- Route parameters
- Query parameters
- What makes an API RESTful

### Daily Objectives
By the end of the class, students should be able to:
- identify different HTTP methods
- explain common status codes
- describe the difference between params, query, and body
- design basic REST API routes

### Classroom Tasks
1. Use Postman or Thunder Client to test sample APIs.
2. Identify request method, headers, body, and response.
3. Design route structure for a student management system.
4. Discuss REST naming examples.

### Homework
- Write 10 example API routes using proper REST naming.
- Explain the difference between `GET /users/:id` and `GET /users?id=1`.

---

## Day 4: Express.js Introduction and First Server

### Topics
- What is Express.js
- Installing Express
- Creating an Express server
- `req` and `res`
- Sending text, JSON, and status response
- `express.json()`

### Daily Objectives
By the end of the class, students should be able to:
- create a basic Express server
- define simple routes
- return JSON responses
- handle incoming JSON data

### Classroom Tasks
1. Create a new Express project.
2. Build routes:
   - `GET /`
   - `GET /about`
   - `POST /message`
3. Return JSON response from an API.
4. Test the endpoints with Postman.

### Homework
- Build a simple Express app with three routes of your choice.
- Add one POST route that accepts JSON and returns the same data.

---

## Day 5: CRUD API Basics with Express

### Topics
- CRUD meaning
- Route design for CRUD
- Route parameters
- Sending different status codes
- Working with temporary in-memory data

### Daily Objectives
By the end of the class, students should be able to:
- explain CRUD operations
- build basic CRUD APIs
- use route params in Express
- test CRUD APIs using API tools

### Classroom Tasks
1. Create a `users` array.
2. Build:
   - `GET /users`
   - `GET /users/:id`
   - `POST /users`
   - `PUT /users/:id`
   - `DELETE /users/:id`
3. Test all routes.

### Homework
- Build CRUD APIs for a `products` array.
- Add at least five sample product records.

---

## Day 6: Middleware in Express

### Topics
- What middleware is
- Built-in middleware
- Custom middleware
- Route-level middleware
- Logger middleware
- Middleware flow

### Daily Objectives
By the end of the class, students should be able to:
- explain middleware in Express
- create custom middleware
- apply middleware globally and on specific routes
- use middleware for logging

### Classroom Tasks
1. Create a logger middleware.
2. Create middleware that checks a custom header.
3. Apply middleware to selected routes.
4. Observe execution flow using console logs.

### Homework
- Create two custom middlewares:
  - one for logging request method and URL
  - one for checking if a query value exists

---

## Day 7: Project Structure for Real Backend Applications

### Topics
- Why project structure matters
- folders for routes, controllers, services, middlewares, config, utils
- separating logic from routes
- clean code organization

### Daily Objectives
By the end of the class, students should be able to:
- organize a backend project into multiple files
- separate route and controller logic
- explain why clean project structure matters

### Classroom Tasks
1. Refactor the previous CRUD project into:
   - routes
   - controllers
   - app entry file
2. Move logic into separate files.
3. Test that the refactored app still works.

### Homework
- Refactor your `products` CRUD API using proper folder structure.

---

## Day 8: Node.js Core Modules for Backend

### Topics
- `fs` module
- `path` module
- `os` module
- `process`
- reading and writing files
- practical use in backend apps

### Daily Objectives
By the end of the class, students should be able to:
- use core Node.js modules
- read and write basic files
- understand useful runtime information

### Classroom Tasks
1. Create and write to a text file.
2. Read content from a file.
3. Use `path.join()` to create file paths.
4. Print system information using `os`.

### Homework
- Create a Node.js file that writes student information into a file and reads it back.

---

## Day 9: Database Fundamentals and PostgreSQL Introduction

### Topics
- Why databases are needed
- SQL vs NoSQL
- What is PostgreSQL
- Tables, rows, columns
- Primary key
- Foreign key
- Relationships overview

### Daily Objectives
By the end of the class, students should be able to:
- explain why databases are needed
- describe relational database basics
- understand PostgreSQL fundamentals
- design a simple relational data model

### Classroom Tasks
1. Discuss real-world examples of data storage.
2. Design tables for users and products.
3. Identify relationships between entities.
4. Introduce PostgreSQL setup.

### Homework
- Draw a simple database design for:
  - users
  - courses
  - enrollments

---

## Day 10: Connecting Node.js with PostgreSQL

### Topics
- Installing PostgreSQL driver
- Connecting Node.js with PostgreSQL
- Basic SQL queries
- Creating tables
- Insert, select, update, delete

### Daily Objectives
By the end of the class, students should be able to:
- connect a Node.js app to PostgreSQL
- run basic SQL queries from Node.js
- build a simple database-driven API

### Classroom Tasks
1. Connect to PostgreSQL.
2. Create a `users` table.
3. Insert sample records.
4. Fetch all users using an API route.
5. Create one insert API route.

### Homework
- Build two API routes connected to PostgreSQL:
  - create user
  - get all users

---

## Day 11: Prisma ORM Basics

### Topics
- What ORM is
- Why use Prisma
- Installing Prisma
- Prisma schema
- Migration
- Prisma Client
- Basic CRUD with Prisma

### Daily Objectives
By the end of the class, students should be able to:
- explain the purpose of an ORM
- create a Prisma model
- run migrations
- perform CRUD using Prisma

### Classroom Tasks
1. Initialize Prisma.
2. Create a `User` model.
3. Run migration.
4. Use Prisma Client to create and fetch records.

### Homework
- Create a `Product` model in Prisma and perform create plus read operations.

---

## Day 12: Validation and Error Handling

### Topics
- Why validation matters
- Zod or Joi
- validating request body
- try/catch
- custom error messages
- global error handling middleware

### Daily Objectives
By the end of the class, students should be able to:
- validate incoming data
- handle errors properly in APIs
- create a global error handler
- return meaningful error responses

### Classroom Tasks
1. Validate a registration request.
2. Create custom validation messages.
3. Add global error middleware.
4. Test invalid requests.

### Homework
- Add validation and error handling to your user or product API.

---

## Day 13: Mini Project 1, User and Product API

### Topics
- combining Express structure
- PostgreSQL or Prisma
- CRUD APIs
- validation
- error handling

### Daily Objectives
By the end of the class, students should be able to:
- combine learned backend concepts into one project
- build a small working REST API with real data
- test and debug a structured project

### Classroom Tasks
1. Build a mini project with:
   - users module
   - products module
   - validation
   - database
2. Review common mistakes.
3. Improve route design and response structure.

### Homework
- Complete unfinished mini project work and prepare for demo next class.

---

## Day 14: Authentication with JWT and Password Hashing

### Topics
- What authentication is
- registration flow
- login flow
- password hashing with bcrypt
- JWT basics
- protected routes

### Daily Objectives
By the end of the class, students should be able to:
- explain authentication flow
- hash passwords securely
- generate JWT tokens
- protect private routes

### Classroom Tasks
1. Build:
   - `POST /register`
   - `POST /login`
   - `GET /profile`
2. Hash passwords before saving.
3. Create token after login.
4. Verify token on protected route.

### Homework
- Add authentication to your mini project.

---

## Day 15: Authorization and Role-Based Access Control

### Topics
- authentication vs authorization
- user roles
- role-based route protection
- admin-only access

### Daily Objectives
By the end of the class, students should be able to:
- explain the difference between authentication and authorization
- implement role checks in middleware
- protect admin-only resources

### Classroom Tasks
1. Add roles like admin and user.
2. Create admin-only route.
3. Restrict delete operations to admins.

### Homework
- Add role-based protection to one route in your project.

---

## Day 16: Advanced REST API Features

### Topics
- pagination
- filtering
- searching
- sorting
- better API response formats

### Daily Objectives
By the end of the class, students should be able to:
- create pagination logic
- filter data using query params
- search and sort API results
- return cleaner list responses

### Classroom Tasks
1. Add pagination to product list.
2. Add filter by category.
3. Add search by product name.
4. Add sorting by price or date.

### Homework
- Extend your product or course API with pagination, filtering, and sorting.

---

## Day 17: File Uploads and Static File Serving

### Topics
- multipart form data
- Multer
- single and multiple file upload
- file validation
- serving uploaded files

### Daily Objectives
By the end of the class, students should be able to:
- handle file uploads in Express
- validate uploaded files
- serve uploaded files statically

### Classroom Tasks
1. Upload profile image using Multer.
2. Upload product image.
3. Restrict allowed file types.
4. Serve uploaded images publicly.

### Homework
- Add one file upload feature to your existing project.

---

## Day 18: API Documentation with Swagger

### Topics
- what API documentation is
- why Swagger is useful
- OpenAPI basics
- documenting routes
- request and response examples

### Daily Objectives
By the end of the class, students should be able to:
- explain the role of API documentation
- document routes using Swagger
- provide request and response examples

### Classroom Tasks
1. Add Swagger to the project.
2. Document auth routes.
3. Document product routes.
4. Open and test the Swagger UI.

### Homework
- Document at least five routes from your project.

---

## Day 19: Security Essentials for Node.js APIs

### Topics
- CORS
- Helmet
- rate limiting
- secure environment variables
- SQL injection awareness
- basic API security practices

### Daily Objectives
By the end of the class, students should be able to:
- secure common API risks
- configure CORS correctly
- use basic security middleware
- explain why backend security matters

### Classroom Tasks
1. Add Helmet to the app.
2. Add CORS configuration.
3. Add rate limiting.
4. Review safe environment variable handling.

### Homework
- Add at least three security improvements to your project.

---

## Day 20: Logging and Debugging

### Topics
- request logging
- error logging
- Morgan
- Winston or Pino
- debugging backend issues
- reading stack traces

### Daily Objectives
By the end of the class, students should be able to:
- add logging to an API
- debug common backend errors
- distinguish request logs from error logs

### Classroom Tasks
1. Add Morgan to log requests.
2. Add custom error logging.
3. Debug a few intentionally broken routes.
4. Improve debugging process.

### Homework
- Add logging to your current project and note two common errors you faced.

---

## Day 21: Testing APIs with Jest and Supertest

### Topics
- why testing matters
- unit testing basics
- integration testing basics
- testing Express APIs
- Jest
- Supertest

### Daily Objectives
By the end of the class, students should be able to:
- explain the importance of testing
- write simple API tests
- test route responses and status codes

### Classroom Tasks
1. Install Jest and Supertest.
2. Write test for a health route.
3. Write test for auth or user route.
4. Run tests and inspect results.

### Homework
- Write at least three API tests for your project.

---

## Day 22: Docker Basics for Node.js Projects

### Topics
- what Docker is
- image and container basics
- Dockerfile
- dockerizing a Node.js app
- running PostgreSQL in a container

### Daily Objectives
By the end of the class, students should be able to:
- explain Docker basics
- write a simple Dockerfile
- run a Node.js project in a container
- understand containerized database workflow

### Classroom Tasks
1. Create a Dockerfile for the backend app.
2. Build Docker image.
3. Run the Node.js app in a container.
4. Discuss using PostgreSQL with containers.

### Homework
- Dockerize your project and write the commands you used.

---

## Day 23: Deployment Basics

### Topics
- preparing project for production
- production environment variables
- deployment on Render or Railway
- process management basics
- deployment checklist

### Daily Objectives
By the end of the class, students should be able to:
- prepare a backend project for deployment
- configure production environment variables
- deploy a simple API online

### Classroom Tasks
1. Prepare project for production.
2. Deploy project to Render or Railway.
3. Test the deployed API.
4. Discuss common deployment issues.

### Homework
- Deploy your backend project and collect the live API link.

---

## Day 24: Final Project Development Day

### Topics
- final project implementation
- API planning review
- database review
- feature completion
- teacher guidance and support

### Daily Objectives
By the end of the class, students should be able to:
- continue a full backend project independently
- organize project tasks clearly
- solve issues with teacher guidance

### Classroom Tasks
1. Build the final project based on approved idea.
2. Complete major routes and models.
3. Add validation, auth, and core features.
4. Review progress individually.

### Homework
- Complete remaining project features and prepare for presentation.

---

## Day 25: Final Project Completion, Presentation, and Course Review

### Topics
- project completion
- presentation
- code review
- deployment review
- recap of full Node.js backend journey

### Daily Objectives
By the end of the class, students should be able to:
- present a full backend API project
- explain project structure and logic
- review major backend concepts learned in the course

### Classroom Tasks
1. Present final project.
2. Explain routes, models, middleware, and auth flow.
3. Show documentation or deployed API if available.
4. Review full course from Day 1 to Day 25.

### Homework
- Final reflection:
  - what you learned
  - what was difficult
  - what project you want to build next

---

# Suggested Final Project Ideas

- Student Management API
- Course Management API
- Blog API
- E-commerce API
- Library Management API
- Job Portal API

---

# Suggested Evaluation Method

## Internal Evaluation
- Attendance and participation
- Daily task completion
- Homework submission
- Mini project
- Final project
- Viva or presentation

## Suggested Weight Distribution
- Daily practice and homework: 20%
- Mini project: 20%
- Class participation and attendance: 10%
- Final project: 40%
- Presentation or viva: 10%

---

# Teacher Notes

- Start each class with a short recap of the previous day.
- End each class with 10 to 15 minutes of student practice review.
- Encourage students to test every API using Postman or Thunder Client.
- Keep one growing project throughout the course where possible.
- Use real examples like users, products, courses, or orders.
- Spend extra support time on database connection, auth, and deployment because students usually struggle most there.

---

# Final Outcome

At the end of 25 days, students should be able to build, test, document, secure, and deploy a full Node.js REST API project with proper backend structure and modern development practices.