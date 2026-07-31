import 'dotenv/config';
import express from 'express';
import productRoutes from './routes/productRoutes.js';
import { requestLogger } from './middlewares/requestLogger.js';

const app = express();
app.use(express.json());
app.use(requestLogger);
app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

app.use('/products', productRoutes);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Database request failed' });
});
const port = Number(process.env.PORT) || 8888;
app.listen(port, () => {
  console.log(`Campus Store API running at http://localhost:${port}`);
});
