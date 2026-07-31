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

## 4. Continue the Campus Store Project

Start with the completed Level 17 checkpoint from [Day 17](<Day17-File Uploads and Static File Serving.md>). If you missed that class, open its project preview and copy that checkpoint before continuing.

Run `npm install` to install Swagger packages.

For today’s lesson, work only with these project files:

- **Create `src/config/swagger.js`**: Define the OpenAPI document and bearer authentication scheme.
- **Edit `src/routes/productRoutes.js`**: Add OpenAPI route descriptions and schemas.
- **Edit `src/server.js`**: Mount Swagger UI at `/api-docs`.

The detailed lesson below explains the new concept. The connected Campus Store upgrade at the end shows how these changes fit into the growing project.

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

---

## Campus Store Storyline Project - Level 18

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 18 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 17 is your starting checkpoint. You can review it in [Day 17](<Day17-File Uploads and Static File Serving.md>).

You describe the store API with OpenAPI and expose Swagger UI.

### Today’s Project Level

Run `npm install` to install Swagger packages.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Edit | `package.json` | Add the Swagger document generator and interactive UI packages. |
| Regenerate | `package-lock.json` | Record the installed documentation dependencies. |
| Create | `src/config/swagger.js` | Define the OpenAPI document and bearer authentication scheme. |
| Edit | `src/routes/productRoutes.js` | Add OpenAPI route descriptions and schemas. |
| Edit | `src/server.js` | Mount Swagger UI at `/api-docs`. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 17 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 18 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Edit `package.json`

Add the Swagger document generator and interactive UI packages.

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
    "seed": "node prisma/seed.js"
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
    "swagger-ui-express": "^5.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "prisma": "^6.19.0"
  }
}
~~~

This is the complete Level 18 version of `package.json`. Add the Swagger document generator and interactive UI packages. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Regenerate `package-lock.json`

Do not type or edit `package-lock.json` by hand. Record the installed documentation dependencies. Run `npm install` from the `campus-store-api/` root; npm will create or refresh this exact file automatically.

#### Step 3 — Create `src/config/swagger.js`

Define the OpenAPI document and bearer authentication scheme.

**File: `src/config/swagger.js`**

~~~javascript
import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerDocument = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Campus Store API',
      version: '1.0.0',
      description: 'The cumulative reference project for the Node.js course.',
    },
    servers: [{ url: 'http://localhost:8888' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/*.js'],
});
~~~

This is the complete Level 18 version of `src/config/swagger.js`. Define the OpenAPI document and bearer authentication scheme. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Edit `src/routes/productRoutes.js`

Add OpenAPI route descriptions and schemas.

**File: `src/routes/productRoutes.js`**

~~~javascript
import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  uploadProductImage,
  updateProduct,
} from '../controllers/productController.js';
import { uploadProductImage as imageUpload } from '../middlewares/uploadProductImage.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Browse products
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product list
 */
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize('ADMIN'), createProduct);
router.put('/:id', authenticate, authorize('ADMIN'), updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteProduct);
router.post('/:id/image', authenticate, authorize('ADMIN'), imageUpload.single('image'), uploadProductImage);

export default router;
~~~

This is the complete Level 18 version of `src/routes/productRoutes.js`. Add OpenAPI route descriptions and schemas. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 5 — Edit `src/server.js`

Mount Swagger UI at `/api-docs`.

**File: `src/server.js`**

~~~javascript
import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());
const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.resolve(currentDir, '../uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use(errorHandler);
const port = Number(process.env.PORT) || 8888;
app.listen(port, () => {
  console.log(`Campus Store API running at http://localhost:${port}`);
});
~~~

This is the complete Level 18 version of `src/server.js`. Mount Swagger UI at `/api-docs`. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Open `http://localhost:8888/api-docs`, authorize with an admin token, and call a documented route.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 18, your reference project has this cumulative structure:

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
│   └── server.js
├── uploads/
│   └── .gitkeep
├── .env.example
├── .gitignore
├── docker-compose.yaml
├── package-lock.json
└── package.json
```

Your completed checkpoint now:

- Shows interactive documentation at `/api-docs`.
- Explains bearer tokens and product query parameters.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Open `http://localhost:8888/api-docs`, authorize with an admin token, and call a documented route.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Document routes, parameters, bodies, security, and examples for any assigned project.

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

Documented routes are easier to use, but public APIs also need defensive limits. Level 19 adds security middleware. Continue with [Day 19](<Day19-Security Essentials for Node.js APIs.md>).
