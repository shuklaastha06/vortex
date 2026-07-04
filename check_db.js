const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany();
  console.log("Products in DB:", products.map(p => p.id));
}

check().catch(console.error).finally(() => prisma.$disconnect());
