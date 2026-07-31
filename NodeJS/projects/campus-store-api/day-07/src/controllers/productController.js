import { createProductId, products } from '../data/products.js';

export function getAllProducts(req, res) {
  res.json({ data: products });
}

export function getProductById(req, res) {
  const product = products.find(item => item.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ data: product });
}

export function createProduct(req, res) {
  const { title, price, description = '' } = req.body;
  if (!title || typeof price !== 'number') {
    return res.status(400).json({ message: 'title and numeric price are required' });
  }
  const product = { id: createProductId(), title, price, description };
  products.push(product);
  res.status(201).json({ data: product });
}

export function updateProduct(req, res) {
  const index = products.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  const { title, price, description = '' } = req.body;
  if (!title || typeof price !== 'number') {
    return res.status(400).json({ message: 'title and numeric price are required' });
  }
  products[index] = { ...products[index], title, price, description };
  res.json({ data: products[index] });
}

export function deleteProduct(req, res) {
  const index = products.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  products.splice(index, 1);
  res.status(204).send();
}
