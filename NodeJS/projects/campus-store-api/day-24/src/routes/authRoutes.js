import { Router } from 'express';
import { login, profile, register } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, profile);

export default router;
