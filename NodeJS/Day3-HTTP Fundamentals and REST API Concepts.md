# Day 3 - HTTP Fundamentals and REST API Concepts

## What You Will Learn Today

- What HTTP is and how it powers the web
- The five main HTTP methods and when to use each one
- HTTP status codes and what they mean
- What headers are and what they carry
- What the request body is used for
- The difference between route parameters and query parameters
- What makes an API RESTful and how to design clean API routes

---

## 1. What Is HTTP

HTTP stands for HyperText Transfer Protocol. It is the set of rules that governs how data is sent between a client and a server on the web.

Every time you open a website, submit a form, or call an API, HTTP is involved. It is the language that browsers, apps, and servers use to talk to each other.

Think of HTTP as the postal system. When you want to send something, you follow rules: put it in an envelope, write the address, mark the type of delivery (standard or express). The postal service (HTTP) delivers it and brings back a reply.

HTTP runs on top of the internet. A client makes an HTTP request. A server receives it and sends back an HTTP response.

---

## 2. HTTP Methods

An HTTP method tells the server what action the client wants to perform. There are five methods you will use constantly in backend development.

| Method | Purpose                  | Example                         |
| ------ | ------------------------ | ------------------------------- |
| GET    | Retrieve data            | Get a list of users             |
| POST   | Create new data          | Register a new user             |
| PUT    | Replace an entire record | Update all fields of a user     |
| PATCH  | Update part of a record  | Update only the email of a user |
| DELETE | Remove data              | Delete a user                   |

### GET

GET is used to retrieve data. It does not modify anything on the server.

```
GET /users
```

This asks the server to return a list of all users.

```
GET /users/5
```

This asks for the specific user with ID 5.

GET requests have no body. The data you need is sent in the URL itself.

### POST

POST is used to create something new on the server. You send data in the request body.

```
POST /users
Body: { "name": "Priya", "email": "priya@example.com" }
```

This tells the server to create a new user with the given data.

### PUT

PUT is used to update an existing record by replacing the entire thing.

```
PUT /users/5
Body: { "name": "Priya Sharma", "email": "priya.sharma@example.com" }
```

This replaces all the data of user 5 with the new data you send.

### PATCH

PATCH is used to update only specific fields, not the entire record.

```
PATCH /users/5
Body: { "email": "newemail@example.com" }
```

This updates only the email of user 5. Other fields like name remain unchanged.

### DELETE

DELETE is used to remove a record.

```
DELETE /users/5
```

This deletes user 5 from the database.

---

## 3. HTTP Status Codes

Every response the server sends back includes a status code. This is a three-digit number that tells the client what happened.

Status codes are grouped by their first digit:

| Range | Category     | Meaning                   |
| ----- | ------------ | ------------------------- |
| 2xx   | Success      | The request worked        |
| 3xx   | Redirection  | The resource moved        |
| 4xx   | Client Error | The client made a mistake |
| 5xx   | Server Error | The server failed         |

### The most important ones to know:

| Code | Name                  | When It Is Used                                    |
| ---- | --------------------- | -------------------------------------------------- |
| 200  | OK                    | Request succeeded and data is returned             |
| 201  | Created               | A new resource was created successfully            |
| 204  | No Content            | Success but nothing to return (like after DELETE)  |
| 400  | Bad Request           | The request had invalid data or was malformed      |
| 401  | Unauthorized          | The user is not logged in or token is missing      |
| 403  | Forbidden             | The user is logged in but does not have permission |
| 404  | Not Found             | The resource or route does not exist               |
| 422  | Unprocessable Entity  | Data was received but failed validation            |
| 500  | Internal Server Error | Something went wrong on the server                 |

Real examples:

```
Creating a user successfully  -->  201 Created
Fetching a list of users      -->  200 OK
User not found in database    -->  404 Not Found
Missing or invalid token      -->  401 Unauthorized
Trying to delete another user's post  -->  403 Forbidden
Server crash or unhandled error  -->  500 Internal Server Error
```

---

## 4. HTTP Headers

Headers are additional information sent with a request or response. They are key-value pairs that describe the message.

Common request headers:

| Header        | What It Carries                                            |
| ------------- | ---------------------------------------------------------- |
| Content-Type  | The format of the data being sent (e.g., application/json) |
| Authorization | The user's token for protected routes                      |
| Accept        | The format the client wants back (e.g., application/json)  |

Common response headers:

| Header         | What It Carries                       |
| -------------- | ------------------------------------- |
| Content-Type   | The format of the data being returned |
| Content-Length | The size of the response body         |

Example request with headers:

```
POST /login
Content-Type: application/json
Accept: application/json

{ "email": "ali@example.com", "password": "12345" }
```

The `Content-Type: application/json` header tells the server that the body is JSON. Without this, the server might not know how to read the body correctly.

---

## 5. Request Body

The request body is where you send data when creating or updating something. Not all requests have a body.

| Method | Has Body?  |
| ------ | ---------- |
| GET    | No         |
| POST   | Yes        |
| PUT    | Yes        |
| PATCH  | Yes        |
| DELETE | Usually No |

A typical request body in JSON:

```json
{
  "name": "Rajesh Sharma",
  "email": "rajesh@example.com",
  "password": "mypassword123"
}
```

When you send this to an API, the server reads this JSON, extracts the values, and uses them to create a new record.

---

## 6. Route Parameters

Route parameters are variable parts of the URL. They let you pass specific identifiers in the URL path.

You write a route parameter by putting a colon before the name:

```
/users/:id
```

The `:id` is the parameter. When someone requests `/users/5`, the value of `:id` is `5`. When someone requests `/users/42`, the value is `42`.

Examples of routes with parameters:

```
GET /users/:id          --> Get user with a specific ID
GET /products/:productId  --> Get a specific product
DELETE /posts/:postId   --> Delete a specific post
```

Route parameters are used when the thing you are looking for has a unique identifier that belongs to the URL itself.

---

## 7. Query Parameters

Query parameters are optional values you add to the end of a URL using a `?` and then `key=value` pairs.

```
GET /products?category=electronics&price=low
```

Here, `category` is a query parameter with value `electronics`, and `price` is a query parameter with value `low`.

You can chain multiple query parameters with `&`.

Query parameters are usually used for:

- filtering results
- searching
- sorting
- pagination

More examples:

```
GET /users?role=admin                 --> Get only admin users
GET /products?search=laptop           --> Search products by name
GET /orders?page=2&limit=10           --> Get the second page with 10 results per page
GET /articles?sort=date&order=desc    --> Get articles sorted by date, newest first
```

### The difference between route params and query params

| Route Params                   | Query Params                           |
| ------------------------------ | -------------------------------------- |
| Part of the URL path           | Added after `?` at the end of the URL  |
| Used for specific resource IDs | Used for optional filters and searches |
| Required in the URL pattern    | Always optional                        |
| `GET /users/5`                 | `GET /users?role=admin`                |

---

## 8. What Makes an API RESTful

REST stands for Representational State Transfer. It is a style of designing APIs that follows a set of conventions.

An API is called RESTful if it follows these principles:

### Principle 1 - Use nouns for endpoints, not verbs

The URL should represent a resource (a thing), not an action (a verb).

Wrong way (not RESTful):

```
GET /getUsers
POST /createUser
DELETE /deleteUser/5
```

Right way (RESTful):

```
GET /users
POST /users
DELETE /users/5
```

The HTTP method already says what action is being done. The URL just says what resource you are working with.

### Principle 2 - Use plural nouns

Always use plural names for collections:

```
/users    (not /user)
/products (not /product)
/orders   (not /order)
```

### Principle 3 - Nest related resources

If something belongs to another resource, show that relationship in the URL:

```
GET /users/5/orders       --> Get all orders of user 5
GET /users/5/orders/12    --> Get order 12 that belongs to user 5
POST /users/5/orders      --> Create a new order for user 5
```

### Principle 4 - Use proper HTTP methods

Use GET for reading, POST for creating, PUT or PATCH for updating, DELETE for removing. Never use GET to delete something or POST to fetch data.

### Principle 5 - Return appropriate status codes

Return 201 when you create something, 200 when you fetch something, 204 when you delete something, and proper 4xx codes for client errors.

---

## 9. Designing REST API Routes - Real Example

Let us design the full API for a student management system.

First, identify your resources:

- students
- courses
- enrollments

Then design the routes:

**Students API:**

```
GET    /students              --> Get all students
GET    /students/:id          --> Get one student
POST   /students              --> Create a new student
PUT    /students/:id          --> Update a student (full update)
PATCH  /students/:id          --> Update student's specific field
DELETE /students/:id          --> Delete a student
```

**Courses API:**

```
GET    /courses               --> Get all courses
GET    /courses/:id           --> Get one course
POST   /courses               --> Create a new course
PUT    /courses/:id           --> Update a course
DELETE /courses/:id           --> Delete a course
```

**Enrollments (nested under students):**

```
GET    /students/:id/courses  --> Get all courses a student is enrolled in
POST   /students/:id/courses  --> Enroll student in a course
DELETE /students/:id/courses/:courseId  --> Remove enrollment
```

This is clean, predictable, and easy for any developer to understand.

---

## 10. Testing APIs with Postman / Insomnia or Thunder Client

To test your APIs without building a frontend, you use tools like Postman or Thunder Client.

Postman / Insomnia is a standalone app. Thunder Client is a VS Code extension that works inside your editor.

Both let you:

- choose the HTTP method (GET, POST, etc.)
- enter the URL
- add headers
- add a request body
- send the request and see the response

For every API you build from Day 4 onwards, you will test it using one of these tools.

Example of a POST request in Postman / Insomnia / Thunder Client:

```
Method: POST
URL: http://localhost:3000/users

Headers:
  Content-Type: application/json

Body (raw, JSON):
{
  "name": "Sita Sharma",
  "email": "sita@example.com"
}
```

When you click Send, Postman / Insomnia / Thunder Client shows you the response status code, headers, and body.

---

## Summary

Here is what you covered today:

- HTTP is the protocol that governs all communication between clients and servers on the web.
- There are five main HTTP methods: GET reads data, POST creates data, PUT replaces data, PATCH partially updates data, and DELETE removes data.
- Status codes tell the client what happened: 2xx is success, 4xx is client error, 5xx is server error.
- Headers carry metadata about the request or response like content type and authorization tokens.
- Route parameters (`/users/:id`) identify specific resources. Query parameters (`?category=electronics`) are used for optional filtering and searching.
- A RESTful API uses nouns in URLs, proper HTTP methods, and predictable patterns for all routes.

---

## Practice Tasks

1. Open Postman / Insomnia or install the Thunder Client extension in VS Code.
2. Make a GET request to `https://jsonplaceholder.typicode.com/users`. This is a free public test API. Look at the response body and the status code in the header area.
3. Design a complete set of API routes for a library management system with these resources: books, members, and borrowings.
4. For each route you designed, write which HTTP method to use and what status code the server should return when it succeeds.

---

## Homework

- Write 10 example API routes using proper REST naming for a job portal application. Include routes for jobs, companies, and applications.
- Write in your own words: what is the difference between `GET /users/5` and `GET /users?id=5`? When would you use each one?
- Look at the status code table above and write one real-world sentence for each of these: 200, 201, 400, 401, 403, 404, 500. Describe exactly when you would see that code.
