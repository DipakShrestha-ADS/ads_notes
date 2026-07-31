# Day 23 - Deployment Basics

## What You Will Learn Today

- What preparing a project for production actually means
- How to configure production environment variables safely
- How to deploy a Node.js and PostgreSQL API to Render
- How to run Prisma migrations against your production database
- How to test your live deployed API
- Common deployment issues and how to fix them

---

## 1. What "Preparing for Production" Means

Everything you built so far ran on your own laptop using `localhost`. Deployment means putting your API on a server that anyone on the internet can reach, not just you.

Before deploying, a few things need attention:

- Your app must read the port from an environment variable, not a hardcoded number, because the hosting platform decides which port to use
- Your database must be a real hosted database, not a local Podman container, since your laptop is not always turned on
- Secrets like `JWT_SECRET` and `DATABASE_URL` must be configured on the hosting platform, never committed to Git
- Your `package.json` scripts must be correct, since the platform runs `npm install` and then your start script automatically

Your code from Day 4 onward already reads the port correctly:

```javascript
const PORT = process.env.PORT || 8888;
```

This line means: use whatever port the platform assigns, and fall back to 8888 only when running locally. This single line is what makes your app "deployment ready" for the port.

---

## 2. Choosing a Hosting Platform

This course uses Render, a free and simple platform for hosting Node.js APIs and PostgreSQL databases. Railway works almost identically if you prefer it instead. The steps below use Render.

---

## 3. Preparing Your Project

Confirm your `package.json` has the correct scripts:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

Render runs `npm install` automatically, then runs whatever command you configure as the start command, which should be `npm start`.

Confirm `.gitignore` excludes secrets and generated files:

```
node_modules/
.env
dist/
```

Push your project to a GitHub repository, since Render deploys directly from a connected Git repository.

```bash
git init
git add .
git commit -m "Prepare project for deployment"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

---

## 4. Creating a PostgreSQL Database on Render

1. Log in to Render and click "New" then "PostgreSQL"
2. Give the database a name and choose the free tier
3. Once created, Render gives you a connection string that looks like this:

```
postgresql://username:password@dpg-xxxxx-a.oregon-postgres.render.com/dbname
```

4. Copy this connection string. You will use it as your production `DATABASE_URL`.

This replaces your local `docker-compose.yaml` PostgreSQL container. In production, you use Render's hosted database instead of Podman.

---

## 5. Creating the Web Service on Render

1. Click "New" then "Web Service"
2. Connect your GitHub repository
3. Configure the service:

| Setting       | Value                                |
| ------------- | ------------------------------------ |
| Build Command | `npm install && npx prisma generate --config prisma/prisma.config.js` |
| Start Command | `npm start`                          |
| Environment   | Node                                 |

4. Add environment variables under the "Environment" tab. Add each one individually, matching your local `.env` file:

```
DATABASE_URL = postgresql://username:password@dpg-xxxxx-a.oregon-postgres.render.com/dbname
JWT_SECRET = your_production_secret_key_different_from_local
NODE_ENV = production
```

Do not add `PORT` yourself. Render sets it automatically, and your code already reads `process.env.PORT` correctly.

Never paste your local `.env` values directly into production. Use a different, stronger `JWT_SECRET` in production than the one on your laptop.

---

## 6. Running Migrations Against the Production Database

Your production database starts empty. You need to run your Prisma migrations against it once, so the tables exist.

Locally, temporarily point your `DATABASE_URL` at the production database to run the migration:

```bash
# Run this from your local terminal, using the production DATABASE_URL
DATABASE_URL="postgresql://username:password@dpg-xxxxx-a.oregon-postgres.render.com/dbname" npx prisma migrate deploy --config prisma/prisma.config.js
```

`prisma migrate deploy` applies existing migrations without generating new ones, which is the correct command to use in production. `prisma migrate dev` is only for local development.

After this runs successfully, your production database has all the same tables as your local one.

---

## 7. Deploying

Once the build command and environment variables are set, Render automatically builds and deploys your app. You can watch the build logs in real time from the Render dashboard.

When deployment finishes, Render gives you a live URL like:

```
https://my-project.onrender.com
```

---

## 8. Testing the Deployed API

Test the same way you tested locally, just using the live URL instead of `localhost`:

```
GET https://my-project.onrender.com/
Expected: your usual health check response

POST https://my-project.onrender.com/auth/register
Body: { "name": "Alice", "email": "alice@example.com", "password": "secret123" }
Expected: 201 with the created account

GET https://my-project.onrender.com/users
Expected: 200 with the list of users
```

If your API works locally but fails only after deployment, the problem is almost always a missing environment variable or a database that has not been migrated yet.

---

## 9. Common Deployment Issues

### Application Error or Blank Page

Usually means the app crashed on startup. Check the Render logs for the exact error, most often a missing environment variable like `DATABASE_URL`.

### Cannot connect to database

Usually means `DATABASE_URL` was not set correctly in the environment variables, or migrations were never run against the production database.

### CORS errors from your frontend

Your `ALLOWED_ORIGIN` environment variable from Day 19 needs to be updated to the actual deployed frontend URL, not `http://localhost:5173`.

### Prisma Client not generated

If you see an error mentioning the Prisma client cannot be found, confirm your build command includes `npx prisma generate --config prisma/prisma.config.js`, since the generated client is not committed to Git and must be created fresh on every deploy.

### 502 Bad Gateway right after deploy

The app may still be starting up. Wait a few seconds and try again. If it persists, check that your start command matches `npm start` and that `process.env.PORT` is used correctly.

---

## Summary

- Production means your code reads `process.env.PORT` instead of a hardcoded port
- Secrets are configured on the hosting platform's dashboard, never committed to Git
- Render needs a build command (`npm install && npx prisma generate --config prisma/prisma.config.js`) and a start command (`npm start`)
- Use `npx prisma migrate deploy --config prisma/prisma.config.js` to apply migrations to a production database, not `migrate dev`
- Always use a different `JWT_SECRET` in production than the one used locally
- Most deployment failures come down to a missing environment variable or unmigrated database

---

## Practice Tasks

1. Push your mini project to GitHub if it is not already there.
2. Create a PostgreSQL database on Render and copy its connection string.
3. Create a web service on Render connected to your repository, with the correct build and start commands.
4. Add all required environment variables in the Render dashboard.
5. Run `npx prisma migrate deploy --config prisma/prisma.config.js` against the production database.
6. Test at least three routes against your live URL.

---

## Homework

Deploy your mini project to Render or Railway. Test every major route against the live URL and confirm they behave the same as they did locally. Write down the live API URL and note any deployment issues you ran into and how you fixed them.

---

## Campus Store Storyline Project - Level 23

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 23 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 22 is your starting checkpoint. You can review it in [Day 22](<Day22-Docker Basics for Node.js Projects.md>).

You add a production health check, build command, and Render service definition.

### Today’s Project Level

No new package is required.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Create | `render.yaml` | Describe the web service, build command, start command, health path, and environment variables. |
| Edit | `package.json` | Add a production build command that generates Prisma Client. |
| Edit | `.env.example` | Document production-safe placeholders. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 22 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 23 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Create `render.yaml`

Describe the web service, build command, start command, health path, and environment variables.

**File: `render.yaml`**

~~~yaml
services:
  - type: web
    name: campus-store-api
    runtime: node
    plan: free
    buildCommand: npm ci && npm run build
    startCommand: npm start
    healthCheckPath: /
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: ALLOWED_ORIGIN
        sync: false
~~~

This is the complete Level 23 version of `render.yaml`. Describe the web service, build command, start command, health path, and environment variables. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Edit `package.json`

Add a production build command that generates Prisma Client.

**File: `package.json`**

~~~json
{
  "name": "campus-store-api",
  "version": "1.0.0",
  "private": true,
  "description": "Cumulative Campus Store API course project",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "db:generate": "prisma generate --config prisma/prisma.config.js",
    "db:migrate": "prisma migrate dev --config prisma/prisma.config.js",
    "db:studio": "prisma studio --config prisma/prisma.config.js",
    "seed": "node prisma/seed.js",
    "test": "npm run db:generate && NODE_OPTIONS=--experimental-vm-modules jest --runInBand",
    "build": "prisma generate --config prisma/prisma.config.js"
  },
  "dependencies": {
    "dotenv": "^16.6.1",
    "express": "^5.1.0",
    "pg": "^8.16.3",
    "@prisma/adapter-pg": "^6.19.0",
    "@prisma/client": "^6.19.0",
    "zod": "^4.1.12",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^2.0.2",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1",
    "cors": "^2.8.5",
    "helmet": "^8.1.0",
    "express-rate-limit": "^8.1.0",
    "morgan": "^1.10.1",
    "winston": "^3.18.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "prisma": "^6.19.0",
    "jest": "^30.2.0",
    "supertest": "^7.1.4"
  }
}
~~~

This is the complete Level 23 version of `package.json`. Add a production build command that generates Prisma Client. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 3 — Edit `.env.example`

Document production-safe placeholders.

**File: `.env.example`**

~~~properties
# Copy this file to .env, then replace every example value.
PORT=8888
STORE_NAME="Campus Store"
STORE_KEY=campus-secret
POSTGRES_USER=campus_user
POSTGRES_PASSWORD=campus_password
POSTGRES_DB=campus_store
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://campus_user:campus_password@localhost:5555/campus_store?schema=public"
JWT_SECRET=replace_this_with_a_long_random_secret
ALLOWED_ORIGIN=http://localhost:5173
NODE_ENV=development
~~~

This is the complete Level 23 version of `.env.example`. Document production-safe placeholders. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Run `npm run build && npm start` locally with production-style environment values.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 23, your reference project has this cumulative structure:

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
│   │   └── 20260731000600_add_product_image/
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
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── schemas/
│   │   ├── authSchemas.js
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
└── render.yaml
```

Your completed checkpoint now:

- Uses the host-provided `PORT` and `DATABASE_URL`.
- Generates Prisma Client during the build.
- Exposes `/` as a deployment health check.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Run `npm run build && npm start` locally with production-style environment values.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Separate local and production configuration without changing application code.

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

The first milestone can be deployed, but the final story still needs a transaction connecting users and products. Level 24 adds orders. Continue with [Day 24](<Day24-Final Project Development Day.md>).
