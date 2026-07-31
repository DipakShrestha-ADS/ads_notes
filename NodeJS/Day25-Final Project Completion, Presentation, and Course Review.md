# Day 25 - Final Project Completion, Presentation, and Course Review

## What You Will Learn Today

- How to structure a clear, confident presentation of your final project
- What to show and explain during a live demo
- How to walk through your project's routes, models, and auth flow out loud
- A full recap of every major concept from Day 1 to Day 24
- How to reflect on your growth and plan what to learn next

---

## 1. Finishing Touches Before Presenting

Before you present, run through this final checklist.

```
[ ] Server starts without errors: npm run dev
[ ] Database is migrated and reachable: podman compose up -d, then npx prisma studio --config prisma/prisma.config.js
[ ] Every route you plan to demo actually works, tested in Postman right now
[ ] .env is not committed to Git, and .gitignore is correct
[ ] Your deployed link (if you deployed) is live and reachable
[ ] You know exactly which routes require a token, and you have a valid token ready to paste in
```

If something is broken, fix it now rather than discovering it live during the demo.

---

## 2. How to Structure Your Presentation

A clear presentation follows a simple order. You do not need slides, just a logical walkthrough.

### Step 1: What the project does

Start with one or two sentences. Example: "This is a Course Management API. Users can register, log in, browse available courses, and enroll. Admins can create and manage courses."

### Step 2: Show the project structure

Open your `src/` folder and briefly explain the layout:

```
src/
  server.js
  routes/
  controllers/
  middlewares/
  db/
  schemas/
```

Say out loud what each folder is responsible for. This shows you understand organization, not just that you copied code.

### Step 3: Walk through the database design

Open Prisma Studio or your `schema.prisma` file. Explain your models and how they relate. Example: "A User can enroll in many Courses, and a Course can have many enrolled Users, through this Enrollment join table."

### Step 4: Demo the authentication flow

Live in Postman or Thunder Client:

1. Register a new user
2. Log in with that user and get the token
3. Try accessing a protected route without the token (show the 401)
4. Try again with the token (show it succeeds)

### Step 5: Demo the core features

Walk through your main CRUD routes. Show validation catching bad input. Show pagination or filtering if you built it. Show the file upload if you built one.

### Step 6: Show security and extras

Briefly mention what you added: Helmet, CORS, rate limiting, logging, tests, Swagger docs. You do not need to demo every single one in depth, just point them out.

### Step 7: Show the deployed link if available

Open your live Render URL and make one real request against it, proving it actually works outside your own laptop.

---

## 3. Explaining Your Code Out Loud

When explaining any piece of code during your demo, use this pattern: what it does, then why you built it that way.

Example explanation for a middleware:

"This is my `authenticate` middleware. It reads the token from the Authorization header, verifies it against my JWT secret, and attaches the decoded user to the request. I put it before any route that should require login, like creating a course."

This kind of explanation shows understanding, not memorization.

---

## 4. Full Course Recap: Day 1 to Day 25

### Foundations (Day 1 to 3)
You learned what backend development is, how Node.js works, how npm and `package.json` manage a project, and the fundamentals of HTTP and REST API design.

### Express and CRUD (Day 4 to 8)
You built your first Express server, learned to handle requests and responses, built full CRUD APIs, understood middleware, organized code into a proper folder structure, and used Node's core modules like `fs`, `path`, and `os`.

### Database and ORM (Day 9 to 13)
You learned relational database fundamentals, connected Node.js directly to PostgreSQL with the `pg` package, then moved to Prisma ORM for cleaner, safer database code. You combined everything into your first full mini project with validation and error handling.

### Authentication and Authorization (Day 14 to 15)
You learned to hash passwords with bcrypt, generate and verify JWT tokens, and build role-based access control so different users have different permissions.

### Advanced API Features (Day 16 to 18)
You added pagination, filtering, search, and sorting to your list endpoints. You handled file uploads with Multer. You documented your API with Swagger so others can understand and test it without reading your source code.

### Production Readiness (Day 19 to 23)
You secured your API with Helmet, CORS, and rate limiting. You added structured logging with Morgan and Winston. You wrote automated tests with Jest and Supertest. You containerized your app with a Dockerfile and Podman. You deployed your project to a live server.

### Final Project (Day 24 to 25)
You combined every single skill from the course into one complete, deployed, tested, documented, and secured REST API.

---

## 5. Key Concepts Quick Reference

| Concept          | What It Does                                                 |
| ---------------- | ------------------------------------------------------------ |
| Express Router   | Organizes routes into separate files                         |
| Middleware       | Functions that run before your route handler, in order       |
| Prisma Client    | Lets you query your database using JavaScript methods        |
| Zod              | Validates incoming request data against a defined schema     |
| bcrypt           | Hashes passwords so the real password is never stored        |
| JWT              | A signed token that proves a user's identity on each request |
| Helmet           | Adds secure HTTP headers automatically                       |
| CORS             | Controls which frontend origins can call your API            |
| Rate limiting    | Caps how many requests one client can send in a time window  |
| Morgan / Winston | Logs requests and errors for debugging                       |
| Jest / Supertest | Runs automated tests against your API                        |
| Dockerfile       | Instructions for packaging your app into a container image   |
| Render / Railway | Hosting platforms that run your deployed API                 |

---

## 6. Final Reflection

Answer these honestly for yourself. There are no wrong answers here, this is about understanding your own growth.

**What you learned**

Think back to Day 1. You started by printing text to a terminal. Now you can build, secure, test, and deploy a full backend system. Write down two or three specific skills you are proud of.

**What was difficult**

Every learner struggles somewhere different. Common difficult points are async/await timing, understanding JWT the first time, and debugging deployment environment variables. Write down what was hardest for you and how you eventually got through it.

**What you want to build next**

Now that you know backend development, what real project do you want to build for yourself? Maybe it is an app idea you had before this course, or an extension of your final project with more features.

---

## Summary

- A strong presentation walks through purpose, structure, database design, auth, core features, and security in that order
- Explain your code by saying what it does and why you built it that way, not just reading it out loud
- The course took you from printing "hello world" to deploying a fully secured, tested, documented REST API
- Every concept from Day 1 to Day 23 comes together in your final project
- Reflection matters as much as the code. Understanding what was hard and what you want to build next is how you keep growing after this course ends

---

## Practice Tasks

1. Run through the pre-presentation checklist and fix anything broken.
2. Practice your presentation once out loud before presenting it for real.
3. Prepare your Postman or Thunder Client requests in advance so you are not typing them live under pressure.
4. Write your final reflection honestly.

---

## Homework

Submit your final reflection covering what you learned, what was difficult, and what you want to build next. If you have not already, make sure your final project repository is complete, your deployed link works, and your documentation is accessible.

---

## Campus Store Storyline Project - Level 25

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 25 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 24 is your starting checkpoint. You can review it in [Day 24](<Day24-Final Project Development Day.md>).

You finish the README, final checks, documentation, tests, and presentation path.

### Today’s Project Level

Run `npm install`, `npx prisma generate --config prisma/prisma.config.js`, `npm test`, and `npm start`.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Create | `README.md` | Explain setup, architecture, routes, security, tests, containers, and deployment. |
| Edit | `tests/health.test.js` | Keep the final public behavior covered. |
| Review | `prisma/schema.prisma` | Confirm User, Product, Role, and Order relationships. |
| Review | `src/` | Confirm routes, controllers, schemas, middleware, configuration, and startup are clearly separated. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 24 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 25 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Create `README.md`

Explain setup, architecture, routes, security, tests, containers, and deployment.

**File: `README.md`**

~~~markdown
# Campus Store API

This project is the cumulative reference implementation for the 25-day Node.js REST API course.

## Run locally

1. Copy `.env.example` to `.env`.
2. Run `npm install`.
3. Start PostgreSQL with `podman compose up -d postgres`.
4. Run `npm run db:migrate` and `npm run db:generate`.
5. Run `npm run seed`.
6. Start the API with `npm run dev`.

## Main routes

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile`
- `GET /products`
- `POST /products` for administrators
- `POST /products/:id/image` for administrators
- `GET /orders` for the authenticated user
- `POST /orders` for the authenticated user
- `GET /api-docs`

## Verify

Run `npm test`, open Swagger UI, and complete one register, login, browse, and order flow.

## Adapt the reference

Keep the architecture and replace Product and Order with the main resource and transaction from your assigned project.
~~~

This is the complete Level 25 version of `README.md`. Explain setup, architecture, routes, security, tests, containers, and deployment. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Edit `tests/health.test.js`

Keep the final public behavior covered.

**File: `tests/health.test.js`**

~~~javascript
import request from 'supertest';
import app from '../src/app.js';

describe('Campus Store public API', () => {
  test('GET / returns the health message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/Campus Store API/);
  });

  test('an unknown route returns 404 JSON', async () => {
    const response = await request(app).get('/does-not-exist');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });

  test('Helmet adds a content security policy header', async () => {
    const response = await request(app).get('/');
    expect(response.headers['content-security-policy']).toBeDefined();
  });
});
~~~

This is the complete Level 25 version of `tests/health.test.js`. Keep the final public behavior covered. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 3 — Review `prisma/schema.prisma`

Confirm User, Product, Role, and Order relationships.

**File: `prisma/schema.prisma`**

~~~prisma
generator client {
  provider     = "prisma-client-js"
  output       = "../src/generated/prisma"
  moduleFormat = "esm"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CUSTOMER
  ADMIN
}

model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String
  role      Role      @default(CUSTOMER)
  products  Product[]
  orders    Order[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Product {
  id          Int       @id @default(autoincrement())
  title       String
  price       Float
  description String?
  category    String    @default("General")
  imageUrl    String?
  userId      Int?
  user        User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  orders      Order[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Order {
  id        Int      @id @default(autoincrement())
  quantity  Int
  unitPrice Float
  userId    Int
  productId Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  createdAt DateTime @default(now())
}
~~~

This is the complete Level 25 version of `prisma/schema.prisma`. Confirm User, Product, Role, and Order relationships. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Review `src/`

Open the `src/` folder and check it against the action table. Confirm routes, controllers, schemas, middleware, configuration, and startup are clearly separated. No code is copied for this step because the checkpoint asks you to review an existing folder, not introduce a new code sample.

#### Expected result

Run the automated tests, walk through one authenticated order flow, open Swagger UI, and rehearse the README presentation order.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 25, your reference project has this cumulative structure:

```text
campus-store-api/
├── docs/
│   ├── api-plan.md
│   └── data-model.md
├── logs/
│   └── .gitkeep
├── prisma/
│   ├── migrations/
│   │   ├── 20260731000100_create_products/
│   │   │   └── migration.sql
│   │   ├── 20260731000200_add_users/
│   │   │   └── migration.sql
│   │   ├── 20260731000300_add_authentication/
│   │   │   └── migration.sql
│   │   ├── 20260731000400_add_roles/
│   │   │   └── migration.sql
│   │   ├── 20260731000500_add_category/
│   │   │   └── migration.sql
│   │   ├── 20260731000600_add_product_image/
│   │   │   └── migration.sql
│   │   └── 20260731000700_add_orders/
│   │       └── migration.sql
│   ├── prisma.config.js
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   │   ├── logger.js
│   │   ├── security.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── data/
│   │   └── products.js
│   ├── db/
│   │   └── prisma.js
│   ├── middlewares/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   ├── fileLogger.js
│   │   ├── requestLogger.js
│   │   ├── requireStoreKey.js
│   │   └── uploadProductImage.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── schemas/
│   │   ├── authSchemas.js
│   │   ├── orderSchemas.js
│   │   ├── productSchemas.js
│   │   └── userSchemas.js
│   ├── app.js
│   └── server.js
├── tests/
│   └── health.test.js
├── uploads/
│   └── .gitkeep
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yaml
├── Dockerfile
├── package-lock.json
├── package.json
├── README.md
└── render.yaml
```

Your completed checkpoint now:

- Provides the complete documented Campus Store reference API.
- Demonstrates the reusable architecture for another assigned domain.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Run the automated tests, walk through one authenticated order flow, open Swagger UI, and rehearse the README presentation order.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Use the same completion checklist to submit any assigned backend confidently.

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

This reference journey is complete. Reuse the same levels to plan, build, test, document, and deploy your own project.
