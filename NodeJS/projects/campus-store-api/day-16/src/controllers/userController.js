import prisma from '../db/prisma.js';
import { createUserSchema, updateUserSchema } from '../schemas/userSchemas.js';

function invalid(res, result) {
  return res.status(400).json({
    message: 'Validation failed',
    errors: result.error.flatten().fieldErrors,
  });
}

export async function getAllUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
    });
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { products: true },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) return invalid(res, result);
  try {
    const user = await prisma.user.create({ data: result.data });
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) return invalid(res, result);
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: result.data,
    });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
