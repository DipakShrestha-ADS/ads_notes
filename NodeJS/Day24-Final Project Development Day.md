# Day 24 - Final Project Development Day

## What You Will Learn Today

- How to plan your final project so you do not get stuck halfway through
- How to organize your remaining work using a clear task list
- Which parts of the course map to which parts of your final project
- How to debug independently when you get stuck
- What a complete, gradeable final project looks like

---

## 1. What Today Is For

Today is a full working day. There is no new syntax to learn. You already know everything you need: Express, PostgreSQL, Prisma, validation, authentication, authorization, advanced queries, file uploads, documentation, security, logging, testing, and deployment.

Today is about applying all of it together into one complete project, based on one of the ideas from the course, or your own idea if it was approved.

Suggested final project ideas from the course:

- Student Management API
- Course Management API
- Blog API
- E-commerce API
- Library Management API
- Job Portal API

Whichever one you picked, the underlying structure is always the same: users, authentication, a few core resources, relationships between them, and clean API design.

---

## 2. Mapping the Course to Your Project

Use this table to connect what you learned to what your final project needs.

| Day          | Skill                            | Where it applies in your project          |
| ------------ | -------------------------------- | ----------------------------------------- |
| Day 4 to 6   | Express basics, CRUD, middleware | Your core route setup                     |
| Day 7        | Project structure                | Your `src/` folder organization           |
| Day 9 to 11  | PostgreSQL, Prisma               | Your database schema and models           |
| Day 12       | Validation and error handling    | Every request body you accept             |
| Day 14 to 15 | Auth and roles                   | Login, registration, and protected routes |
| Day 16       | Pagination, filtering, sorting   | Your list endpoints                       |
| Day 17       | File uploads                     | Profile pictures or item images           |
| Day 18       | Swagger docs                     | Documenting your finished API             |
| Day 19       | Security                         | Helmet, CORS, rate limiting               |
| Day 20       | Logging                          | Tracking requests and errors              |
| Day 21       | Testing                          | A few tests proving your core routes work |
| Day 22 to 23 | Docker and deployment            | Getting the project live                  |

---

## 3. Building Your Task List

Before writing any more code today, write down every remaining piece of work as a checklist. This keeps you from losing track of what is done and what is left.

Example checklist for a Course Management API:

```
Database
[ ] User model with role field
[ ] Course model
[ ] Enrollment model connecting users and courses

Auth
[ ] Register route
[ ] Login route
[ ] JWT middleware
[ ] Role-based middleware (admin can create courses, users can enroll)

Core routes
[ ] CRUD for courses
[ ] Enroll in a course route
[ ] List my enrolled courses route
[ ] Pagination and search on course list

Extras
[ ] Course thumbnail image upload
[ ] Swagger docs for at least 5 routes
[ ] Helmet, CORS, rate limiting added
[ ] At least 3 passing tests
[ ] Deployed to Render with a live link
```

Write your own version of this list for your actual project idea before continuing.

---

## 4. Recommended Build Order

If you are unsure where to start, follow this order. It matches how the course was taught and avoids getting stuck.

1. Design your Prisma schema first. Get your models and relationships right before writing any routes.
2. Run your first migration and confirm tables exist using Prisma Studio.
3. Build authentication (register, login, JWT middleware) before anything else, since most other routes depend on knowing who the user is.
4. Build your core CRUD routes for your main resources.
5. Add validation with Zod to every route that accepts a body.
6. Add role-based protection to routes that should be restricted.
7. Add pagination, search, and filtering to your list routes.
8. Add one file upload feature if your project has images.
9. Add Helmet, CORS, and rate limiting.
10. Add logging with Morgan and Winston.
11. Write a handful of tests for your most important routes.
12. Document your API with Swagger.
13. Deploy to Render.

You do not have to do these in one sitting today, but this is the order that avoids rework.

---

## 5. Debugging Independently

When you get stuck today, work through this checklist before asking for help. This is the same process a working developer uses every day.

1. Read the actual error message and stack trace. What file and line does it point to?
2. Check the terminal running your server, not just Postman. The real error often only shows in the server terminal.
3. Confirm the request you are sending matches what your route expects. Check the URL, the method, and the request body.
4. Add a `console.log()` right before the line that seems to be failing, to check what value a variable actually holds.
5. Check Prisma Studio to confirm the data in the database actually looks the way you expect.
6. If a route depends on authentication, confirm you are sending a valid, non-expired token in the Authorization header.

```javascript
// Example of a quick debugging log added temporarily to check a value
export async function createCourse(req, res) {
  console.log('Incoming body:', req.body);   // check exactly what data arrived
  console.log('Authenticated user:', req.user);   // check who the middleware identified

  // ...rest of the function
}
```

Remove these temporary `console.log()` lines once you find and fix the bug.

---

## 6. What a Complete Final Project Looks Like

By the end of today and tomorrow, your project should have:

- A clear folder structure following the course conventions (`src/server.js`, `controllers/`, `routes/`, `middlewares/`, `db/`)
- A working Prisma schema with at least two related models
- Registration, login, and JWT-protected routes
- Full CRUD for your main resource, with validation on every write
- At least one list route with pagination and either filtering or search
- Helmet, CORS, and rate limiting active
- A `.env` file that is never committed, and a `.gitignore` that excludes it
- A README or Swagger docs describing how to use your API

---

## Summary

- Today is for applying everything you learned into one working project, not learning new syntax
- Write a clear task checklist before continuing to code, so you always know what is left
- Build in this order: schema, migrations, auth, core CRUD, validation, roles, advanced features, security, logging, tests, docs, deployment
- When stuck, read the actual error and stack trace first, then check request data, then check the database
- A complete final project touches almost every topic covered from Day 1 to Day 23

---

## Practice Tasks

1. Write your full task checklist for your specific final project idea.
2. Confirm your Prisma schema is finalized and migrated.
3. Confirm authentication and at least one protected route work correctly.
4. Work through your checklist in the recommended build order, checking off each item as you finish it.
5. List any blockers you hit today so you can resolve them with guidance before tomorrow's presentation day.

---

## Homework

Complete as many remaining items on your checklist as possible. Make sure your core CRUD routes, authentication, and validation are fully working, since these are the most heavily weighted parts of the final project. Prepare to present your project tomorrow.
