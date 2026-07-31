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

Let us design the full API for a learner management system.

First, identify your resources:

- learners
- courses
- enrollments

Then design the routes:

**Learners API:**

```
GET    /learners              --> Get all learners
GET    /learners/:id          --> Get one learner
POST   /learners              --> Create a new learner
PUT    /learners/:id          --> Update a learner (full update)
PATCH  /learners/:id          --> Update learner's specific field
DELETE /learners/:id          --> Delete a learner
```

**Courses API:**

```
GET    /courses               --> Get all courses
GET    /courses/:id           --> Get one course
POST   /courses               --> Create a new course
PUT    /courses/:id           --> Update a course
DELETE /courses/:id           --> Delete a course
```

**Enrollments (nested under learners):**

```
GET    /learners/:id/courses  --> Get all courses a learner is enrolled in
POST   /learners/:id/courses  --> Enroll learner in a course
DELETE /learners/:id/courses/:courseId  --> Remove enrollment
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
URL: http://localhost:8888/users

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

---

## Campus Store Storyline Project - Level 3

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 3 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 2 is your starting checkpoint. You can review it in [Day 2](<Day2-Node.js Runtime, npm, package.json, and Environment Variables.md>).

You design the users, products, and orders API before writing route handlers.

### Today’s Project Level

No new package is required.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Create | `docs/api-plan.md` | Record resources, routes, sample bodies, status codes, and ownership rules. |
| Keep | `src/server.js` | The runtime checkpoint from Level 2 still runs unchanged. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 2 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 3 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Create `docs/api-plan.md`

Record resources, routes, sample bodies, status codes, and ownership rules.

**File: `docs/api-plan.md`**

~~~markdown
# Campus Store API Plan

## Resources

- User: a person who registers, logs in, and may own products.
- Product: the main resource that people browse and administrators manage.
- Order: a later transaction connecting a user to a product.

## Planned Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /products | Browse products |
| GET | /products/:id | Read one product |
| POST | /products | Create a product |
| PUT | /products/:id | Replace product details |
| DELETE | /products/:id | Delete a product |
| POST | /auth/register | Register a user |
| POST | /auth/login | Log in |
| GET | /orders | Read the current user's orders |
| POST | /orders | Create an order |

Route parameters identify one resource. Query parameters filter a list. JSON request bodies carry create or update data.
~~~

This is the complete Level 3 version of `docs/api-plan.md`. Record resources, routes, sample bodies, status codes, and ownership rules. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Keep `src/server.js`

Leave `src/server.js` unchanged. The runtime checkpoint from Level 2 still runs unchanged. Run today’s test after the other steps to prove that this existing file still behaves correctly.

#### Expected result

Review every planned URL and confirm it uses a resource noun such as `/products`, not an action such as `/getProducts`.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 3, your reference project has this cumulative structure:

```text
campus-store-api/
├── docs/
│   └── api-plan.md
├── src/
│   └── server.js
├── .env.example
├── .gitignore
├── package-lock.json
└── package.json
```

Your completed checkpoint now:

- Documents RESTful product and user URLs.
- Distinguishes route parameters, query parameters, and request bodies.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Review every planned URL and confirm it uses a resource noun such as `/products`, not an action such as `/getProducts`.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Identify the nouns, URLs, request bodies, and responses for any project before implementation begins.

Keep the architecture and replace the Campus Store nouns with the nouns from your assigned project:

| Example project | Campus Store `Product` becomes | Campus Store `User` becomes | Campus Store `Order` becomes |
| --- | --- | --- | --- |
| Library API | Book | Member | Borrowing |
| Course API | Course | Learner | Enrollment |
| Blog API | Post | Author | Comment or Subscription |
| Job Portal API | Job | Applicant | Application |
| Vehicle Rental API | Vehicle | Customer | Booking |

For your own project:

1. Write the name of your main resource.
2. Write the person or role that uses the system.
3. Write the transaction or relationship connecting them.
4. Apply today’s file structure and request flow using those names.
5. Test the same success, invalid-input, and missing-resource situations shown in the Campus Store reference.

### Next Level

The route contract is clear, but no client can call it. Level 4 creates the first Express server. Continue with [Day 4](<Day4-Express.js Introduction and First Server.md>).
