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

## 2. Project Setup

```bash
mkdir day16-advanced-api
cd day16-advanced-api
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg zod
npm i prisma --save-dev
npm i -D nodemon
mkdir -p src/routes src/controllers src/db src/middlewares
```

`package.json`:

```json
{
  "name": "day16-advanced-api",
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
POSTGRES_DB=day16_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/day16_db?schema=public"
```

`.gitignore`:

```
node_modules/
.env
dist/
```

`docker-compose.yaml` - same as previous days.

Start the database: `podman compose up -d`

---

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
npx prisma migrate dev --name create_products
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

| Prisma Condition | Meaning | SQL Equivalent |
|---|---|---|
| `{ field: value }` | Exact match | `WHERE field = value` |
| `{ field: { contains: '...' } }` | Text contains | `WHERE field LIKE '%...%'` |
| `{ field: { gte: 50 } }` | Greater than or equal | `WHERE field >= 50` |
| `{ field: { lte: 200 } }` | Less than or equal | `WHERE field <= 200` |
| `{ field: { gt: 0 } }` | Greater than | `WHERE field > 0` |
| `{ field: { lt: 100 } }` | Less than | `WHERE field < 100` |
| `{ field: { not: value } }` | Not equal | `WHERE field != value` |
| `{ field: { in: [...] } }` | Value is in array | `WHERE field IN (...)` |

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
