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

- Learner Management API
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

---

## Campus Store Storyline Project - Level 24

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 24 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 23 is your starting checkpoint. You can review it in [Day 23](<Day23-Deployment Basics.md>).

You combine users and products through an authenticated order transaction.

### Today’s Project Level

Run the order migration, generate Prisma Client, and restart the API.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Replace | `prisma/schema.prisma` | Add Order and its relationships to User and Product. |
| Create | `src/schemas/orderSchemas.js` | Validate product ID and quantity. |
| Create | `src/controllers/orderController.js` | Create and list the current user’s orders. |
| Create | `src/routes/orderRoutes.js` | Protect order routes with authentication. |
| Edit | `src/app.js` | Mount `/orders`. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 23 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 24 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Replace `prisma/schema.prisma`

Add Order and its relationships to User and Product.

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

This is the complete Level 24 version of `prisma/schema.prisma`. Add Order and its relationships to User and Product. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Create `src/schemas/orderSchemas.js`

Validate product ID and quantity.

**File: `src/schemas/orderSchemas.js`**

~~~javascript
import { z } from 'zod';

export const createOrderSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(20),
});
~~~

This is the complete Level 24 version of `src/schemas/orderSchemas.js`. Validate product ID and quantity. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 3 — Create `src/controllers/orderController.js`

Create and list the current user’s orders.

**File: `src/controllers/orderController.js`**

~~~javascript
import prisma from '../db/prisma.js';
import { createOrderSchema } from '../schemas/orderSchemas.js';

export async function createOrder(req, res, next) {
  const result = createOrderSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Validation failed', errors: result.error.flatten().fieldErrors });
  }
  try {
    const product = await prisma.product.findUnique({ where: { id: result.data.productId } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        productId: product.id,
        quantity: result.data.quantity,
        unitPrice: product.price,
      },
      include: { product: true },
    });
    res.status(201).json({ data: order });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
}
~~~

This is the complete Level 24 version of `src/controllers/orderController.js`. Create and list the current user’s orders. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Create `src/routes/orderRoutes.js`

Protect order routes with authentication.

**File: `src/routes/orderRoutes.js`**

~~~javascript
import { Router } from 'express';
import { createOrder, getMyOrders } from '../controllers/orderController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
router.use(authenticate);
router.get('/', getMyOrders);
router.post('/', createOrder);

export default router;
~~~

This is the complete Level 24 version of `src/routes/orderRoutes.js`. Protect order routes with authentication. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 5 — Edit `src/app.js`

Mount `/orders`.

**File: `src/app.js`**

~~~javascript
import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import logger from './config/logger.js';
import { swaggerDocument } from './config/swagger.js';
import { authLimiter, corsMiddleware, generalLimiter } from './config/security.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());
const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use(helmet());
app.use(corsMiddleware);
app.use(generalLimiter);
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use('/uploads', express.static(path.resolve(currentDir, '../uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

app.use('/auth', authLimiter, authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);
export default app;
~~~

This is the complete Level 24 version of `src/app.js`. Mount `/orders`. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Log in, create an order with a valid product ID, then call `GET /orders` with the same token.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 24, your reference project has this cumulative structure:

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
└── render.yaml
```

Your completed checkpoint now:

- Creates an order for the authenticated user.
- Reads only that user’s orders.
- Returns related product information.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Log in, create an order with a valid product ID, then call `GET /orders` with the same token.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Replace Order with Enrollment, Borrowing, Booking, Application, Submission, Rental, or another project relationship.

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

The full business flow works. Level 25 verifies, documents, and presents the finished project. Continue with [Day 25](<Day25-Final Project Completion, Presentation, and Course Review.md>).
