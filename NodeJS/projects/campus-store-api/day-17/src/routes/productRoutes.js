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
