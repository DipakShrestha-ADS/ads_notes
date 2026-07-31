import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';
import { loginSchema, registerSchema } from '../schemas/authSchemas.js';

function tokenFor(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
}

export async function register(req, res, next) {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Validation failed', errors: result.error.flatten().fieldErrors });
  }
  try {
    const existing = await prisma.user.findUnique({ where: { email: result.data.email } });
    if (existing) return res.status(409).json({ message: 'Email is already registered' });
    const password = await bcrypt.hash(result.data.password, 12);
    const user = await prisma.user.create({
      data: { ...result.data, password },
      select: { id: true, name: true, email: true, role: true },
    });
    res.status(201).json({ data: user, token: tokenFor(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ message: 'Invalid login body' });
  try {
    const user = await prisma.user.findUnique({ where: { email: result.data.email } });
    const valid = user && await bcrypt.compare(result.data.password, user.password);
    if (!valid) return res.status(401).json({ message: 'Email or password is incorrect' });
    res.json({ token: tokenFor(user) });
  } catch (error) {
    next(error);
  }
}

export async function profile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}
