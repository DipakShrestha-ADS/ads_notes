import cors from 'cors';
import rateLimit from 'express-rate-limit';

export const corsMiddleware = cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});
