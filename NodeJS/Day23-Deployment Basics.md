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
| Build Command | `npm install && npx prisma generate` |
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
DATABASE_URL="postgresql://username:password@dpg-xxxxx-a.oregon-postgres.render.com/dbname" npx prisma migrate deploy
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

If you see an error mentioning the Prisma client cannot be found, confirm your build command includes `npx prisma generate`, since the generated client is not committed to Git and must be created fresh on every deploy.

### 502 Bad Gateway right after deploy

The app may still be starting up. Wait a few seconds and try again. If it persists, check that your start command matches `npm start` and that `process.env.PORT` is used correctly.

---

## Summary

- Production means your code reads `process.env.PORT` instead of a hardcoded port
- Secrets are configured on the hosting platform's dashboard, never committed to Git
- Render needs a build command (`npm install && npx prisma generate`) and a start command (`npm start`)
- Use `npx prisma migrate deploy` to apply migrations to a production database, not `migrate dev`
- Always use a different `JWT_SECRET` in production than the one used locally
- Most deployment failures come down to a missing environment variable or unmigrated database

---

## Practice Tasks

1. Push your mini project to GitHub if it is not already there.
2. Create a PostgreSQL database on Render and copy its connection string.
3. Create a web service on Render connected to your repository, with the correct build and start commands.
4. Add all required environment variables in the Render dashboard.
5. Run `npx prisma migrate deploy` against the production database.
6. Test at least three routes against your live URL.

---

## Homework

Deploy your mini project to Render or Railway. Test every major route against the live URL and confirm they behave the same as they did locally. Write down the live API URL and note any deployment issues you ran into and how you fixed them.
