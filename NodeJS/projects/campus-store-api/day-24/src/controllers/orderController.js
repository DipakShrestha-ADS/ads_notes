import prisma from '../db/prisma.js';
import { createOrderSchema } from '../schemas/orderSchemas.js';

export async function createOrder(req, res, next) {
  const result = createOrderSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Validation failed', errors: result.error.flatten().fieldErrors });
  }
  try {
    const product = await prisma.product.findUnique({ where: { id: result.data.productId } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        productId: product.id,
        quantity: result.data.quantity,
        unitPrice: product.price,
      },
      include: { product: true },
    });
    res.status(201).json({ data: order });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
}
