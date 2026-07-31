import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

const products = [
  { id: 1, title: 'Notebook', price: 4.5 },
  { id: 2, title: 'Campus Hoodie', price: 28 },
];
let nextId = 3;

app.get('/', (req, res) => res.json({ message: 'Campus Store API is running' }));
app.get('/products', (req, res) => res.json({ data: products }));
app.get('/products/:id', (req, res) => {
  const product = products.find(item => item.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ data: product });
});
app.post('/products', (req, res) => {
  const { title, price } = req.body;
  if (!title || typeof price !== 'number') return res.status(400).json({ message: 'title and numeric price are required' });
  const product = { id: nextId++, title, price };
  products.push(product);
  res.status(201).json({ data: product });
});
app.put('/products/:id', (req, res) => {
  const product = products.find(item => item.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const { title, price } = req.body;
  if (!title || typeof price !== 'number') return res.status(400).json({ message: 'title and numeric price are required' });
  product.title = title;
  product.price = price;
  res.json({ data: product });
});
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  products.splice(index, 1);
  res.status(204).send();
});

const port = Number(process.env.PORT) || 8888;
app.listen(port, () => console.log(`Campus Store API running at http://localhost:${port}`));
