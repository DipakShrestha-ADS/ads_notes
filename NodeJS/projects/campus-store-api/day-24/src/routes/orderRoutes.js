import { Router } from 'express';
import { createOrder, getMyOrders } from '../controllers/orderController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
router.use(authenticate);
router.get('/', getMyOrders);
router.post('/', createOrder);

export default router;
