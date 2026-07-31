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
