import 'dotenv/config';
import app from './app.js';

const port = Number(process.env.PORT) || 8888;
app.listen(port, () => {
  console.log(`Campus Store API running at http://localhost:${port}`);
});
