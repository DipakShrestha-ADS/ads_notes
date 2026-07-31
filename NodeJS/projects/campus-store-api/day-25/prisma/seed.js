import bcrypt from 'bcrypt';
import prisma from '../src/db/prisma.js';

const password = await bcrypt.hash('Admin123!', 12);
await prisma.user.upsert({
  where: { email: 'admin@campus.test' },
  update: { role: 'ADMIN' },
  create: {
    name: 'Campus Administrator',
    email: 'admin@campus.test',
    password,
    role: 'ADMIN',
  },
});

await prisma.$disconnect();
console.log('Development administrator is ready.');
