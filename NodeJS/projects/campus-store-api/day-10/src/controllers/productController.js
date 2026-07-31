import pool from '../db/pool.js';

export async function getAllProducts(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json({ data: result.rows });
  } catch (error) { next(error); }
}

export async function getProductById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.json({ data: result.rows[0] });
  } catch (error) { next(error); }
}

export async function createProduct(req, res, next) {
  try {
    const { title, price, description = null } = req.body;
    const result = await pool.query(
      'INSERT INTO products (title, price, description) VALUES ($1, $2, $3) RETURNING *',
      [title, price, description],
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (error) { next(error); }
}

export async function updateProduct(req, res, next) {
  try {
    const { title, price, description = null } = req.body;
    const result = await pool.query(
      'UPDATE products SET title = $1, price = $2, description = $3 WHERE id = $4 RETURNING *',
      [title, price, description, req.params.id],
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.json({ data: result.rows[0] });
  } catch (error) { next(error); }
}

export async function deleteProduct(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.status(204).send();
  } catch (error) { next(error); }
}
