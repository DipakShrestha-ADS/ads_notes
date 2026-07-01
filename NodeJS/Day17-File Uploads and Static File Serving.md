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

## 3. Project Setup

```bash
mkdir day17-file-uploads
cd day17-file-uploads
npm init -y
npm i express dotenv pg @prisma/client @prisma/adapter-pg zod multer
npm i prisma --save-dev
npm i -D nodemon
mkdir -p src/routes src/controllers src/db src/middlewares src/uploads
```

`package.json`:

```json
{
  "name": "day17-file-uploads",
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
POSTGRES_DB=day17_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://userdipak:user_password@localhost:5555/day17_db?schema=public"
```

`.gitignore`:

```
node_modules/
.env
dist/
src/uploads/*
!src/uploads/.gitkeep
```

The last two lines ignore every uploaded file but keep the `uploads` folder itself tracked in Git using an empty `.gitkeep` file.

`docker-compose.yaml` - same as previous days.

Start the database: `podman compose up -d`

Prisma setup follows the same steps from Day 11 if you want to store file references in the database. For this lesson, the focus is on the upload mechanism itself.

---

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
