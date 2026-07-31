import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

app.get('/about', (req, res) => {
  res.json({ name: 'Campus Store API', purpose: 'Manage campus products' });
});

app.post('/messages', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'message is required' });
  res.status(201).json({ received: message });
});

const port = Number(process.env.PORT) || 8888;
app.listen(port, () => console.log(`Campus Store API running at http://localhost:${port}`));
