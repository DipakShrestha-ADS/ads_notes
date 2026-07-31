# Day 17 - File Uploads and Static File Serving

## What You Will Learn Today

- How multipart form data works and why file uploads need special handling
- How to install and configure Multer
- How to upload a single file, like a profile image
- How to upload multiple files at once
- How to validate file type and file size before accepting an upload
- How to serve uploaded files publicly so they can be viewed in a browser

---

## 1. Why File Uploads Are Different

Regular JSON requests send text data. A file upload sends binary data, like the actual bytes of an image. This uses a different content type called `multipart/form-data`.

Think of a normal request like sending a letter with only words written on paper. A file upload is like sending a package with a physical object inside, wrapped separately from the note that describes it. The wrapping and the object need special handling that plain text does not need.

Express does not handle `multipart/form-data` on its own. You need a middleware library called Multer to read the incoming file, save it somewhere, and give you access to file details in your route handler.

---

## 2. Installing Multer

```bash
npm i multer
```

Multer handles parsing the multipart form data, saving files to disk, and giving you an object describing each uploaded file.

---

## 3. Continue the Campus Store Project

Start with the completed Level 16 checkpoint from [Day 16](<Day16-Advanced REST API Features.md>). If you missed that class, open its project preview and copy that checkpoint before continuing.

Run `npm install`, migrate with `add_product_image`, and restart the server.

For today’s lesson, work only with these project files:

- **Replace `prisma/schema.prisma`**: Add the optional Product image URL.
- **Create `src/middlewares/uploadProductImage.js`**: Configure Multer storage, size limits, and image type checks.
- **Edit `src/controllers/productController.js`**: Save the uploaded image URL on the product.
- **Edit `src/routes/productRoutes.js`**: Add `POST /products/:id/image`.
- **Create `uploads/.gitkeep`**: Keep the upload directory while ignoring uploaded content.
- **Edit `src/server.js`**: Serve `/uploads` statically.

The detailed lesson below explains the new concept. The connected Campus Store upgrade at the end shows how these changes fit into the growing project.

## 4. Configuring Multer

Multer needs to know where to save files and how to name them. Create one shared configuration file.

```javascript
// src/middlewares/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname since this is an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// diskStorage tells Multer exactly where and how to save each file
const storage = multer.diskStorage({
  // destination decides which folder the file goes into
  destination: (req, file, cb) => {
    // cb(error, destinationFolder) - null means no error
    cb(null, path.join(__dirname, '..', 'uploads'));
  },

  // filename decides what the saved file is called on disk
  filename: (req, file, cb) => {
    // Build a unique name: timestamp + original extension
    // This prevents two uploads with the same name from overwriting each other
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);   // e.g. ".png"
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// fileFilter runs before saving - reject files that are not images
function fileFilter(req, file, cb) {
  // Only allow these MIME types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);    // accept the file
  } else {
    // Reject the file and pass an error message
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed'), false);
  }
}

// Create the configured Multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,   // 5 MB max file size, in bytes
  },
});
```

---

## 5. Uploading a Single File

Multer gives you `upload.single('fieldName')` for one file per request.

```javascript
// src/controllers/uploadController.js

// POST /upload/profile - handles a single file upload
export function uploadProfileImage(req, res) {
  // If fileFilter rejected the file, req.file will be undefined
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded or file type not allowed' });
  }

  // req.file contains details about the saved file
  const fileInfo = {
    originalName: req.file.originalname,   // the name on the user's computer
    savedName: req.file.filename,          // the name Multer saved it as
    size: req.file.size,                   // size in bytes
    mimetype: req.file.mimetype,           // e.g. "image/png"
    // Build the public URL where this file can be viewed
    url: `/uploads/${req.file.filename}`,
  };

  res.status(201).json({
    success: true,
    message: 'Profile image uploaded successfully',
    data: fileInfo,
  });
}
```

```javascript
// src/routes/uploadRoutes.js
import { Router } from 'express';
import { upload } from '../middlewares/upload.js';
import { uploadProfileImage, uploadProductImages } from '../controllers/uploadController.js';

const router = Router();

// upload.single('avatar') expects one file sent under the field name "avatar"
router.post('/profile', upload.single('avatar'), uploadProfileImage);

export default router;
```

The `'avatar'` string must match the field name used in the form or in Postman when sending the file.

---

## 6. Uploading Multiple Files

Use `upload.array('fieldName', maxCount)` when the client can send several files under one field.

```javascript
// src/controllers/uploadController.js (continued)

// POST /upload/product-images - handles multiple file uploads
export function uploadProductImages(req, res) {
  // req.files (plural) is an array when using upload.array()
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  // Map each uploaded file into a clean response object
  const files = req.files.map(file => ({
    originalName: file.originalname,
    savedName: file.filename,
    size: file.size,
    url: `/uploads/${file.filename}`,
  }));

  res.status(201).json({
    success: true,
    message: `${files.length} image(s) uploaded successfully`,
    data: files,
  });
}
```

```javascript
// src/routes/uploadRoutes.js (add this route)
// upload.array('images', 5) accepts up to 5 files under the field name "images"
router.post('/product-images', upload.array('images', 5), uploadProductImages);
```

---

## 7. Handling Multer Errors

If a file is too large or the wrong type, Multer throws an error. Catch it with a small error handling wrapper.

```javascript
// src/middlewares/errorHandler.js
import multer from 'multer';

export function errorHandler(err, req, res, next) {
  // Multer errors have a specific error class you can check for
  if (err instanceof multer.MulterError) {
    // Example: err.code === 'LIMIT_FILE_SIZE' when the file exceeds the size limit
    return res.status(400).json({ success: false, message: err.message });
  }

  // Custom errors thrown from fileFilter also land here
  if (err.message && err.message.includes('not allowed')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  console.error(`[Error] ${req.method} ${req.url} - ${err.message}`);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message || 'Internal Server Error' });
}
```

---

## 8. Serving Uploaded Files Publicly

Express has a built-in way to serve static files from a folder. This makes uploaded images viewable directly in a browser.

```javascript
// src/server.js
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from './routes/uploadRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// Serve every file inside src/uploads at the /uploads URL path
// Example: a file saved as src/uploads/avatar-123.png
// becomes viewable at http://localhost:8888/uploads/avatar-123.png
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Day 17 - File uploads working' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

## 9. Testing File Uploads

In Postman or Thunder Client, you cannot send files as raw JSON. You need to use `form-data` mode in the request body.

Single upload:
```
POST http://localhost:8888/upload/profile
Body type: form-data
Key: avatar (type: File) -> choose an image from your computer
Expected: 201 with file details including a url field
```

Multiple upload:
```
POST http://localhost:8888/upload/product-images
Body type: form-data
Key: images (type: File) -> select multiple files, or add the same key multiple times
Expected: 201 with an array of file details
```

Viewing the uploaded file:
```
Copy the "url" value from the response, for example /uploads/avatar-172foo.png
Open http://localhost:8888/uploads/avatar-172foo.png in your browser
Expected: the image displays directly in the browser
```

Testing the file type restriction:
```
POST http://localhost:8888/upload/profile
Body type: form-data
Key: avatar -> choose a .pdf or .txt file
Expected: 400 - Only JPEG, PNG, and WEBP images are allowed
```

Testing the file size limit:
```
POST http://localhost:8888/upload/profile
Key: avatar -> choose an image larger than 5 MB
Expected: 400 - File too large
```

---

## Summary

- File uploads use `multipart/form-data`, which is different from JSON requests
- Multer is the standard Express middleware for handling file uploads
- `multer.diskStorage()` controls where files are saved and what they are named
- `fileFilter` rejects files based on MIME type before they are saved
- `limits.fileSize` caps how large an uploaded file can be
- `upload.single('field')` handles one file, `upload.array('field', max)` handles several
- `express.static()` serves a folder's contents as public URLs

---

## Practice Tasks

1. Set up the project and test uploading a single profile image.
2. Test uploading multiple product images in one request.
3. Try uploading a non-image file and confirm you get the correct 400 error.
4. Try uploading a file larger than 5 MB and confirm the size limit error appears.
5. Open an uploaded image directly in your browser using the returned url.

---

## Homework

Add a file upload feature to your mini project. Add a profile picture upload to the user model, or a product image upload to the product model. Store the returned file URL in the corresponding database record using Prisma.

---

## Campus Store Storyline Project - Level 17

This section applies today’s lesson to one project that grows throughout the course. Open **View Day 17 Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

Level 16 is your starting checkpoint. You can review it in [Day 16](<Day16-Advanced REST API Features.md>).

You upload a validated image, save its public URL, and serve uploaded files.

### Today’s Project Level

Run `npm install`, migrate with `add_product_image`, and restart the server.

| Action | Path from `campus-store-api/` | Why |
| --- | --- | --- |
| Edit | `package.json` | Add Multer as today’s upload dependency. |
| Regenerate | `package-lock.json` | Record the installed upload dependency. |
| Edit | `.gitignore` | Ignore uploaded runtime files while keeping the empty directory. |
| Replace | `prisma/schema.prisma` | Add the optional Product image URL. |
| Create | `src/middlewares/uploadProductImage.js` | Configure Multer storage, size limits, and image type checks. |
| Edit | `src/controllers/productController.js` | Save the uploaded image URL on the product. |
| Edit | `src/routes/productRoutes.js` | Add `POST /products/:id/image`. |
| Create | `uploads/.gitkeep` | Keep the upload directory while ignoring uploaded content. |
| Edit | `src/server.js` | Serve `/uploads` statically. |

Use the paths exactly as shown. A path beginning with `src/` belongs inside the `src` folder. A file without a folder prefix belongs in the project root beside `package.json`.

### Guided Upgrade

1. Copy the complete Level 16 checkpoint into your working `campus-store-api` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the `campus-store-api/` root.
4. Open **View Day 17 Project** to compare every saved file with the completed checkpoint.

#### Step 1 — Edit `package.json`

Add Multer as today’s upload dependency.

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
    "multer": "^2.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "prisma": "^6.19.0"
  }
}
~~~

This is the complete Level 17 version of `package.json`. Add Multer as today’s upload dependency. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 2 — Regenerate `package-lock.json`

Do not type or edit `package-lock.json` by hand. Record the installed upload dependency. Run `npm install` from the `campus-store-api/` root; npm will create or refresh this exact file automatically.

#### Step 3 — Edit `.gitignore`

Ignore uploaded runtime files while keeping the empty directory.

**File: `.gitignore`**

~~~text
node_modules/
.env
logs/*.log
!logs/.gitkeep
src/generated/
uploads/*
!uploads/.gitkeep
~~~

This is the complete Level 17 version of `.gitignore`. Ignore uploaded runtime files while keeping the empty directory. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 4 — Replace `prisma/schema.prisma`

Add the optional Product image URL.

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
  imageUrl    String?
  userId      Int?
  user        User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
~~~

This is the complete Level 17 version of `prisma/schema.prisma`. Add the optional Product image URL. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 5 — Create `src/middlewares/uploadProductImage.js`

Configure Multer storage, size limits, and image type checks.

**File: `src/middlewares/uploadProductImage.js`**

~~~javascript
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(currentDir, '../../uploads');

const storage = multer.diskStorage({
  destination: uploadDir,
  filename(req, file, callback) {
    const safeExtension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExtension}`);
  },
});

export const uploadProductImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    callback(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype));
  },
});
~~~

This is the complete Level 17 version of `src/middlewares/uploadProductImage.js`. Configure Multer storage, size limits, and image type checks. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 6 — Edit `src/controllers/productController.js`

Save the uploaded image URL on the product.

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

This is the complete Level 17 version of `src/controllers/productController.js`. Save the uploaded image URL on the product. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 7 — Edit `src/routes/productRoutes.js`

Add `POST /products/:id/image`.

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

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize('ADMIN'), createProduct);
router.put('/:id', authenticate, authorize('ADMIN'), updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteProduct);
router.post('/:id/image', authenticate, authorize('ADMIN'), imageUpload.single('image'), uploadProductImage);

export default router;
~~~

This is the complete Level 17 version of `src/routes/productRoutes.js`. Add `POST /products/:id/image`. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 8 — Create `uploads/.gitkeep`

Keep the upload directory while ignoring uploaded content.

**File: `uploads/.gitkeep`**

~~~text

~~~

This is the complete Level 17 version of `uploads/.gitkeep`. Keep the upload directory while ignoring uploaded content. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Step 9 — Edit `src/server.js`

Serve `/uploads` statically.

**File: `src/server.js`**

~~~javascript
import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());
const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.resolve(currentDir, '../uploads')));
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

This is the complete Level 17 version of `src/server.js`. Serve `/uploads` statically. Save it at exactly this path before continuing; imports in the checkpoint assume this location.

#### Expected result

Upload an image with form-data field `image`, then open the returned image URL in the browser.

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart `npm run dev` after configuration changes.

### Completed Level

At the end of Level 17, your reference project has this cumulative structure:

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

- Accepts one product image.
- Rejects unsupported file types and oversized files.
- Serves saved files through a public URL.

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- Upload an image with form-data field `image`, then open the returned image URL in the browser.
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

Use the same flow for avatars, book covers, documents, certificates, or vehicle photos.

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

The API works, but another developer must guess how to call it. Level 18 adds interactive documentation. Continue with [Day 18](<Day18-API Documentation with Swagger.md>).
