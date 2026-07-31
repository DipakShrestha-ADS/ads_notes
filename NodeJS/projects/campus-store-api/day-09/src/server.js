import 'dotenv/config';
import express from 'express';
import os from 'node:os';
import productRoutes from './routes/productRoutes.js';
import { fileLogger } from './middlewares/fileLogger.js';
import { requestLogger } from './middlewares/requestLogger.js';

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(fileLogger);
app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

app.use('/products', productRoutes);
app.get('/system', (req, res) => {
  res.json({
    nodeVersion: process.version,
    platform: os.platform(),
    uptimeSeconds: Math.round(process.uptime()),
    freeMemoryBytes: os.freemem(),
  });
});

const port = Number(process.env.PORT) || 8888;
app.listen(port, () => {
  console.log(`Campus Store API running at http://localhost:${port}`);
});
