import 'dotenv/config';

const port = Number(process.env.PORT) || 8888;
const storeName = process.env.STORE_NAME || 'Campus Store';

console.log(`${storeName} project configuration loaded.`);
console.log(`The future API will use port ${port}.`);
