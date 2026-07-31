# Day 16 - Advanced REST API Features

## What You Will Learn Today

- How to add pagination so APIs do not return thousands of records at once
- How to filter results using query parameters
- How to implement text search on string fields
- How to sort results by different columns in any order
- How to filter by a numeric range (min/max price)
- How to return a clean response with metadata alongside data

---

## 1. Why These Features Matter

A real API never sends all records in a single response. Imagine an e-commerce site with 50,000 products. Sending all 50,000 in one response would:

- Slow down the server significantly
- Slow down the client
- Waste bandwidth for data the user may never look at

Pagination, filtering, searching, and sorting let the client ask for exactly what it needs. These are standard features of every production API.

---

## 2. Continue the Campus Store Project

Start with the completed Level 15 checkpoint from [Day 15](<Day15-Authorization and Role-Based Access Control.md>). If you missed that class, open its project preview and copy that checkpoint before continuing.

Run the category migration and regenerate Prisma Client.

For today’s lesson, work only with these project files:

- **Replace `prisma/schema.prisma`**: Add the Product category field.
- **Edit `src/schemas/productSchemas.js`**: Validate the new category field.
- **Replace `src/controllers/productController.js`**: Build Prisma `where`, `orderBy`, `skip`, and `take` values from query parameters.

The detailed lesson below explains the new concept. The connected Campus Store upgrade at the end shows how these changes fit into the growing project.

## 3. Prisma Setup

```bash
npx prisma init
mv prisma/prisma.config.ts prisma/prisma.config.js
```

`prisma/schema.prisma`:

```prisma
generator client {
  provider     = "prisma-client-js"
  output       = "../src/generated/prisma"
  moduleFormat = "esm"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          Int      @id @default(autoincrement())
  title       String
  price       Float
  category    String
  description String?
  createdAt   DateTime @default(now())
}
```

```bash
npx prisma migrate dev --config prisma/prisma.config.js --name create_products
```

Create `src/db/prisma.js` (same as Day 11).

---

## 4. Seeding Test Data

Before testing advanced queries, you need enough records to page through. Create a seed script:

```javascript
// prisma/seed.js
import prisma from '../src/db/prisma.js';

async function seed() {
  const products = [
    { title: 'Laptop Pro', price: 1200, category: 'Electronics', description: 'Powerful developer laptop' },
    { title: 'Wireless Mouse', price: 25, category: 'Electronics', description: 'Ergonomic wireless mouse' },
    { title: 'Standing Desk', price: 450, category: 'Furniture', description: 'Adjustable height desk' },
    { title: 'Mechanical Keyboard', price: 120, category: 'Electronics', description: 'Tactile mechanical keys' },
    { title: 'Monitor 27inch', price: 350, category: 'Electronics', description: 'QHD display' },
    { title: 'Desk Chair', price: 250, category: 'Furniture', description: 'Ergonomic office chair' },
    { title: 'USB Hub', price: 35, category: 'Electronics', description: '7-port USB hub' },
    { title: 'Webcam HD', price: 80, category: 'Electronics', description: '1080p webcam' },
    { title: 'Desk Lamp', price: 45, category: 'Furniture', description: 'LED adjustable lamp' },
    { title: 'Headphones', price: 150, category: 'Electronics', description: 'Noise cancelling' },
    { title: 'Notebook Set', price: 15, category: 'Stationery', description: 'Pack of 5 notebooks' },
    { title: 'Pen Set', price: 8, category: 'Stationery', description: 'Ballpoint pens' },
    { title: 'Backpack', price: 60, category: 'Accessories', description: 'Laptop backpack' },
    { title: 'Cable Organizer', price: 12, category: 'Accessories', description: 'Desk cable management' },
    { title: 'Phone Stand', price: 18, category: 'Accessories', description: 'Adjustable phone holder' },
    { title: 'Laptop Stand', price: 55, category: 'Accessories', description: 'Portable laptop riser' },
    { title: 'Mousepad XL', price: 22, category: 'Electronics', description: 'Large desk mousepad' },
    { title: 'External SSD', price: 90, category: 'Electronics', description: '1TB portable SSD' },
    { title: 'Printer', price: 180, category: 'Electronics', description: 'Color inkjet printer' },
    { title: 'Bookshelf', price: 130, category: 'Furniture', description: '5-shelf bookcase' },
  ];

  // Delete existing records first to avoid duplicates on re-runs
  await prisma.product.deleteMany();

  // Insert all 20 products in one query
  await prisma.product.createMany({ data: products });

  console.log('Seed complete: 20 products created');
  await prisma.$disconnect();
}

seed();
```

```bash
node prisma/seed.js
```

---

## 5. Pagination

Pagination splits results into pages. The client sends `page` and `limit` as query parameters.

- `page=1` is the first page
- `limit=5` means 5 records per page
- `skip` = (page - 1) * limit

```
GET /products?page=1&limit=5    <- first 5 records
GET /products?page=2&limit=5    <- next 5 records (6 through 10)
GET /products?page=3&limit=5    <- records 11 through 15
```

Here is the basic pagination logic:

```javascript
// src/controllers/productController.js
import prisma from '../db/prisma.js';

export async function getAllProducts(req, res) {
  // Read query params and apply defaults
  const page = parseInt(req.query.page) || 1;        // default page 1
  const limit = parseInt(req.query.limit) || 10;     // default 10 per page
  const skip = (page - 1) * limit;                   // records to skip before this page

  try {
    // Run both queries in parallel using Promise.all for better performance
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,               // skip records from previous pages
        take: limit,        // take only 'limit' records
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),   // total number of products (used to calculate total pages)
    ]);

    // Calculate how many pages exist in total
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: products,
      meta: {
        total,         // how many records exist in the database
        page,          // current page
        limit,         // records per page
        totalPages,    // how many pages exist
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
```

---

## 6. Filtering

Filtering lets the client narrow results by a specific field value.

```
GET /products?category=Electronics
GET /products?category=Furniture
```

Build a `where` object dynamically:

```javascript
export async function getAllProducts(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Start with an empty where clause and add conditions as needed
  const where = {};

  if (req.query.category) {
    // Filter by exact category value - only return products in this category
    where.category = req.query.category;
  }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,          // pass the filter to findMany
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),   // count must use the same where clause
    ]);

    res.status(200).json({
      success: true,
      data: products,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
```

---

## 7. Search

Search lets the client find records where a text field contains a keyword.

```
GET /products?search=keyboard
GET /products?search=desk
```

Prisma's `contains` with `mode: 'insensitive'` does a case-insensitive text search:

```javascript
if (req.query.search) {
  // contains is equivalent to SQL: WHERE title LIKE '%keyboard%'
  // mode: 'insensitive' means "Keyboard", "keyboard", and "KEYBOARD" all match
  where.title = {
    contains: req.query.search,
    mode: 'insensitive',
  };
}
```

---

## 8. Sorting

Sorting lets the client choose the order of results.

```
GET /products?sortBy=price&order=asc
GET /products?sortBy=price&order=desc
GET /products?sortBy=title&order=asc
```

Only allow specific fields to be sorted. Never pass the `sortBy` query param directly to Prisma without checking it:

```javascript
// Define which fields are allowed as sort columns
// This prevents potential injection if someone sends a crafted sortBy value
const allowedSortFields = ['price', 'title', 'createdAt'];

// Use the requested sortBy only if it is in the allowed list, otherwise default to createdAt
const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';

// Only allow 'asc' or 'desc', default to 'desc'
const order = req.query.order === 'asc' ? 'asc' : 'desc';
```

Pass it to `orderBy` using a computed property:

```javascript
orderBy: { [sortBy]: order },   // [sortBy] uses the variable as the key
```

---

## 9. Price Range Filter

```
GET /products?minPrice=50&maxPrice=200
```

Prisma uses `gte` (greater than or equal) and `lte` (less than or equal):

```javascript
if (req.query.minPrice || req.query.maxPrice) {
  where.price = {};

  if (req.query.minPrice) {
    where.price.gte = parseFloat(req.query.minPrice);   // gte = >=
  }

  if (req.query.maxPrice) {
    where.price.lte = parseFloat(req.query.maxPrice);   // lte = <=
  }
}
```

---

## 10. Full getAllProducts - All Features Combined

This is the complete controller function with pagination, filtering, search, sorting, and price range all working together:

```javascript
// src/controllers/productController.js
import prisma from '../db/prisma.js';

export async function getAllProducts(req, res) {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  // Cap the limit at 100 - never allow a client to request unlimited records
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const skip = (page - 1) * limit;

  // Sorting - only allow specific fields to prevent injection
  const allowedSortFields = ['price', 'title', 'createdAt'];
  const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';
  const order = req.query.order === 'asc' ? 'asc' : 'desc';

  // Build the where clause dynamically based on what query params are provided
  const where = {};

  if (req.query.category) {
    where.category = req.query.category;          // exact match filter
  }

  if (req.query.search) {
    where.title = {
      contains: req.query.search,
      mode: 'insensitive',                        // case-insensitive text search
    };
  }

  if (req.query.minPrice || req.query.maxPrice) {
    where.price = {};
    if (req.query.minPrice) where.price.gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) where.price.lte = parseFloat(req.query.maxPrice);
  }

  try {
    // Run data query and count query in parallel for better performance
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        sortBy,
        order,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
```

---

## 11. Routes and Server

```javascript
// src/routes/productRoutes.js
import { Router } from 'express';
import { getAllProducts } from '../controllers/productController.js';

const router = Router();

router.get('/', getAllProducts);

export default router;
```

```javascript
// src/server.js
import 'dotenv/config';
import express from 'express';
import productRoutes from './routes/productRoutes.js';

const app = express();

app.use(express.json());
app.use('/products', productRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Day 16 - Advanced API features working' });
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
```

---

## 12. Testing All Features

Run the seed script first:

```bash
node prisma/seed.js
```

Then test each feature:

```
# Pagination
GET /products?page=1&limit=5
GET /products?page=2&limit=5

# Filter by category
GET /products?category=Electronics
GET /products?category=Furniture
GET /products?category=Stationery

# Search by title keyword
GET /products?search=desk
GET /products?search=keyboard

# Sort by price
GET /products?sortBy=price&order=asc
GET /products?sortBy=price&order=desc

# Sort by title alphabetically
GET /products?sortBy=title&order=asc

# Price range
GET /products?minPrice=50&maxPrice=200

# Combine everything
GET /products?category=Electronics&sortBy=price&order=asc&page=1&limit=5
GET /products?search=desk&sortBy=price&order=desc
```

---

## 13. Prisma Filter Reference

| Prisma Condition                 | Meaning               | SQL Equivalent             |
| -------------------------------- | --------------------- | -------------------------- |
| `{ field: value }`               | Exact match           | `WHERE field = value`      |
| `{ field: { contains: '...' } }` | Text contains         | `WHERE field LIKE '%...%'` |
| `{ field: { gte: 50 } }`         | Greater than or equal | `WHERE field >= 50`        |
| `{ field: { lte: 200 } }`        | Less than or equal    | `WHERE field <= 200`       |
| `{ field: { gt: 0 } }`           | Greater than          | `WHERE field > 0`          |
| `{ field: { lt: 100 } }`         | Less than             | `WHERE field < 100`        |
| `{ field: { not: value } }`      | Not equal             | `WHERE field != value`     |
| `{ field: { in: [...] } }`       | Value is in array     | `WHERE field IN (...)`     |

---

## Summary

- Pagination uses `skip` and `take` in Prisma, calculated from `page` and `limit`
- Always return metadata: `total`, `page`, `limit`, `totalPages` alongside the data array
- Filter by building a `where` object dynamically from query params
- Search uses Prisma's `contains` with `mode: 'insensitive'` for case-insensitive matching
- Sort using `orderBy: { [field]: order }` with a whitelist of allowed field names
- Price range uses `gte` and `lte` inside the `price` condition
- Cap the maximum `limit` value (100) to prevent requests that return too much data

---

## Practice Tasks

1. Run the seed script and confirm 20 products are created using Prisma Studio.
2. Test pagination: fetch page 1 with limit 5, then page 2 with limit 5.
3. Filter by each category and confirm only matching products are returned.
4. Search for "desk" and verify every result has "desk" in the title.
5. Sort by price ascending and confirm the cheapest product is first.
6. Combine search and sort: `?search=mouse&sortBy=price&order=asc`.

---

## Homework

Add pagination, filtering by category, and sorting by price to the products API from your mini project. Make sure the response includes the `meta` object with `total`, `page`, `limit`, and `totalPages` on every request.

---

## Campus Store Storyline Project - Level 16

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 16 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 15 is your starting checkpoint. You can review it in [Day 15](<Day15-Authorization and Role-Based Access Control.md>).

You add pagination, category filters, search, price ranges, and sorting.

### Today’s Project Level

Run the category migration and regenerate Prisma Client.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Replace | `prisma/schema.prisma` | Add the Product category field. |
| Edit | `src/schemas/productSchemas.js` | Validate the new category field. |
| Replace | `src/controllers/productController.js` | Build Prisma `where`, `orderBy`, `skip`, and `take` values from query parameters. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 15 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 16 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Replace `prisma/schema.prisma`

Add the Product category field.

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
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Product {
  id          Int       @id @default(autoincrement())
  title       String
  price       Float
  description String?
  category    String    @default("General")
  userId      Int?
  user        User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
~~~

This is the complete Level 16 version of `prisma/schema.prisma`. Add the Product category field. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Edit `src/schemas/productSchemas.js`

Validate the new category field.

**File: `src/schemas/productSchemas.js`**

~~~javascript
import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().trim().min(2, 'Title must contain at least 2 characters'),
  price: z.number().positive('Price must be greater than zero'),
  description: z.string().trim().optional(),
  category: z.string().trim().min(2).optional(),
  userId: z.number().int().positive().nullable().optional(),
});

export const updateProductSchema = createProductSchema.partial();
~~~

This is the complete Level 16 version of `src/schemas/productSchemas.js`. Validate the new category field. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 3 — Replace `src/controllers/productController.js`

Build Prisma `where`, `orderBy`, `skip`, and `take` values from query parameters.

**File: `src/controllers/productController.js`**

~~~javascript
import prisma from '../db/prisma.js';
import { createProductSchema, updateProductSchema } from '../schemas/productSchemas.js';

function invalid(res, result) {
  return res.status(400).json({ message: 'Validation failed', errors: result.error.flatten().fieldErrors });
}

export async function getAllProducts(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const sortBy = ['title', 'price', 'createdAt'].includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';
    const order = req.query.order === 'asc' ? 'asc' : 'desc';
    const where = {
      ...(req.query.category ? { category: req.query.category } : {}),
      ...(req.query.search ? { title: { contains: req.query.search, mode: 'insensitive' } } : {}),
      ...((req.query.minPrice || req.query.maxPrice) ? {
        price: {
          ...(req.query.minPrice ? { gte: Number(req.query.minPrice) } : {}),
          ...(req.query.maxPrice ? { lte: Number(req.query.maxPrice) } : {}),
        },
      } : {}),
    };
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);
    res.json({ data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  const result = createProductSchema.safeParse(req.body);
  if (!result.success) return invalid(res, result);
  try {
    const product = await prisma.product.create({ data: result.data });
    res.status(201).json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  const result = updateProductSchema.safeParse(req.body);
  if (!result.success) return invalid(res, result);
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: result.data,
    });
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function uploadProductImage(req, res, next) {
  if (!req.file) return res.status(400).json({ message: 'Select one image file' });
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { imageUrl: `/uploads/${req.file.filename}` },
    });
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
}
~~~

This is the complete Level 16 version of `src/controllers/productController.js`. Build Prisma `where`, `orderBy`, `skip`, and `take` values from query parameters. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Call `/products?search=book&category=Books&sortBy=price&order=asc&page=1&limit=5`.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 16, your reference project has this cumulative structure:

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
│   │   └── 20260731000500_add_category/
│   │       └── migration.sql
│   ├── prisma.config.js
│   ├── schema.prisma
│   └── seed.js
├── src/
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
│   │   └── requireStoreKey.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── schemas/
│   │   ├── authSchemas.js
│   │   ├── productSchemas.js
│   │   └── userSchemas.js
│   └── server.js
├── .env.example
├── .gitignore
├── docker-compose.yaml
├── package-lock.json
└── package.json
```

Your completed checkpoint now:

- Returns pagination metadata.
- Combines search, category, price, and sorting filters.
- Rejects invalid pagination values safely.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Call `/products?search=book&category=Books&sortBy=price&order=asc&page=1&limit=5`.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Build flexible list endpoints without creating a separate route for every filter.

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

Products are easy to find, but they have no images. Level 17 adds file uploads. Continue with [Day 17](<Day17-File Uploads and Static File Serving.md>).
