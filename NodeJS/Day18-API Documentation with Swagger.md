# Day 18 - API Documentation with Swagger

## What You Will Learn Today

- Why API documentation matters for both your team and API consumers
- What OpenAPI and Swagger are and how they relate to each other
- How to install and configure Swagger in an Express project
- How to document routes with request and response examples
- How to test API calls directly from the Swagger UI in your browser

---

## 1. Why API Documentation Matters

Imagine buying a new appliance with no instruction manual. You would have to guess every button and every setting. That is exactly what using an undocumented API feels like for another developer, or even for you six months later when you forgot how your own project works.

API documentation describes:

- Which routes exist
- What method each route uses (GET, POST, PUT, DELETE)
- What data the route expects in the request
- What data the route sends back
- What status codes and error messages to expect

Good documentation means a new developer, a frontend team, or a client can use your API without asking you constant questions.

---

## 2. What Is OpenAPI and Swagger

OpenAPI is a standard specification format for describing REST APIs. It defines a structured way to write down routes, parameters, and responses, usually as a YAML or JSON file.

Swagger is a set of tools built around the OpenAPI specification. The most useful tool for you is Swagger UI, which reads your OpenAPI description and turns it into an interactive webpage where anyone can see all your routes and test them directly in the browser.

Think of OpenAPI as the recipe, written in a very precise format. Swagger UI is the interactive cooking show that reads that recipe and lets you try each step yourself.

---

## 3. Installing Swagger Packages

```bash
npm i swagger-jsdoc swagger-ui-express
```

| Package            | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| swagger-jsdoc      | Reads comments in your code and turns them into an OpenAPI document |
| swagger-ui-express | Serves the OpenAPI document as an interactive webpage               |

---

## 4. Project Setup

```bash
mkdir day18-swagger-docs
cd day18-swagger-docs
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg zod bcrypt jsonwebtoken swagger-jsdoc swagger-ui-express
npm i prisma --save-dev
npm i -D nodemon
mkdir -p src/routes src/controllers src/db src/middlewares src/schemas src/config
```

`package.json`:

```json
{
  "name": "day18-swagger-docs",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

`.env`:

```
PORT=8888
POSTGRES_USER=userdipak
POSTGRES_PASSWORD=user_password
POSTGRES_DB=day18_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/day18_db?schema=public"
JWT_SECRET=your_very_long_and_random_secret_key_change_this_in_production
```

`.gitignore`:

```
node_modules/
.env
dist/
```

`docker-compose.yaml` - same as previous days.

Start the database: `podman compose up -d`

Prisma setup follows the same steps from Day 11 with the `User` model from Day 14.

---

## 5. Setting Up the Swagger Configuration

Create one file that defines the base OpenAPI structure. `swagger-jsdoc` scans your route files for special comments and merges them into this base structure.

```javascript
// src/config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

// The base definition describes general information about your API
const options = {
  definition: {
    openapi: '3.0.0',                 // the OpenAPI spec version being used
    info: {
      title: 'Day 18 Practice API',   // shown at the top of the Swagger UI page
      version: '1.0.0',
      description: 'API documentation built with Swagger for the Node.js course',
    },
    servers: [
      {
        url: 'http://localhost:8888', // base URL used when testing routes from the UI
        description: 'Local development server',
      },
    ],
    // Define a reusable security scheme for JWT bearer tokens
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Tell swagger-jsdoc where to look for documentation comments
  apis: ['./src/routes/*.js'],
};

// Generate the final OpenAPI document from the options above
export const swaggerSpec = swaggerJSDoc(options);
```

---

## 6. Documenting Routes with JSDoc Comments

Swagger reads special `@swagger` comments placed directly above each route. These comments use YAML syntax.

```javascript
// src/routes/authRoutes.js
import { Router } from 'express';
import { register, login } from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alice
 *               email:
 *                 type: string
 *                 example: alice@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: alice@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', login);

export default router;
```

The `tags: [Auth]` groups related routes together under an "Auth" section in the Swagger UI page.

---

## 7. Documenting a Protected Route

Routes that require a JWT token need the `security` field pointing to the `bearerAuth` scheme you defined earlier.

```javascript
// src/routes/productRoutes.js
import { Router } from 'express';
import { getAllProducts, createProduct } from '../controllers/productController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: A list of products
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (requires authentication)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: Wireless Mouse
 *               price:
 *                 type: number
 *                 example: 25.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: No token provided
 *       400:
 *         description: Validation error
 */
router.post('/', authenticate, createProduct);

export default router;
```

The `security: [{ bearerAuth: [] }]` line adds an "Authorize" lock icon in the Swagger UI for this specific route, letting you paste in a token before testing it.

---

## 8. Mounting Swagger UI in server.js

```javascript
// src/server.js
import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();

app.use(express.json());

// Serve the interactive Swagger UI page at /api-docs
// swaggerUi.serve sets up the required static assets
// swaggerUi.setup(swaggerSpec) renders the page using your OpenAPI document
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Day 18 - Swagger documentation working. Visit /api-docs to view it.' });
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});
```

---

## 9. Testing the Swagger UI

1. Start the server with `npm run dev`
2. Open `http://localhost:8888/api-docs` in your browser
3. You will see all documented routes grouped by tag (Auth, Products)
4. Click on any route to expand it and see its parameters and expected responses
5. Click "Try it out" to fill in real values and send an actual request from the page
6. For protected routes, click the "Authorize" button at the top, paste in a JWT token from `/auth/login`, and now every protected request you test will include that token automatically

---

## 10. Quick Reference for Common Swagger Fields

| Field         | Purpose                                                |
| ------------- | ------------------------------------------------------ |
| `summary`     | A short one-line description shown next to the route   |
| `tags`        | Groups routes into named sections in the UI            |
| `parameters`  | Documents query params, route params, and headers      |
| `requestBody` | Documents the expected JSON body for POST/PUT requests |
| `responses`   | Documents each possible status code and what it means  |
| `security`    | Marks a route as requiring authentication              |

---

## Summary

- API documentation helps other developers and your future self understand your API
- OpenAPI is the specification format, Swagger is the toolset built around it
- `swagger-jsdoc` reads comments in your route files and builds an OpenAPI document
- `swagger-ui-express` serves that document as an interactive webpage
- Use `@swagger` comment blocks directly above each route to document it
- Protected routes should reference the `bearerAuth` security scheme
- Visit `/api-docs` to see and test your entire API from the browser

---

## Practice Tasks

1. Set up Swagger in your project and confirm `/api-docs` loads in the browser.
2. Document the register and login routes with full request body examples.
3. Document at least two product routes, including one protected route.
4. Use the "Authorize" button to test a protected route directly from Swagger UI.
5. Add a `tags` group for a new resource, like `Users`, and document its routes.

---

## Homework

Document at least five routes from your mini project using Swagger. Include one authentication route, one protected route with the `bearerAuth` security requirement, and at least one route with query parameters documented, like pagination or filtering.
