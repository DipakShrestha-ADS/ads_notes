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
