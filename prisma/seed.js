const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  console.log('Clearing database...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding users...');
  const adminPassword = hashPassword('admin123');
  const customerPassword = hashPassword('customer123');

  const admin = await prisma.user.create({
    data: {
      email: 'admin@ecommerce.com',
      name: 'E-Commerce Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@ecommerce.com',
      name: 'John Doe',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('Seeding products...');
  const products = [
    {
      name: 'Vortex Mechanical Keyboard',
      description: 'An elegant mechanical keyboard with hot-swappable switches, dynamic RGB backlighting, and a premium double-shot PBT keycap set.',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1618384887929-16ec33faf9c1?w=600&auto=format&fit=crop&q=80',
      stock: 15,
      category: 'Electronics',
    },
    {
      name: 'Aero Wireless Headset',
      description: 'Ultra-low latency wireless gaming headset featuring spatial audio, custom-tuned 50mm drivers, and a high-clearance noise-cancelling microphone.',
      price: 189.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      stock: 8,
      category: 'Electronics',
    },
    {
      name: 'Minimalist Leather Wallet',
      description: 'Handcrafted from full-grain vegetable-tanned leather. Designed to hold up to 10 cards and cash in a sleek, front-pocket friendly footprint.',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1627124765135-5667c7d19c54?w=600&auto=format&fit=crop&q=80',
      stock: 40,
      category: 'Accessories',
    },
    {
      name: 'Nomad Canvas Backpack',
      description: 'Water-resistant waxed canvas backpack with dedicated 16-inch laptop compartment, leather accents, and heavy-duty brass zippers.',
      price: 110.00,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      stock: 12,
      category: 'Accessories',
    },
    {
      name: 'Premium Wool Overcoat',
      description: 'Tailored fit winter overcoat constructed from an Italian wool blend. Features classic lapels, three-button closure, and satin interior lining.',
      price: 245.00,
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
      stock: 6,
      category: 'Apparel',
    },
    {
      name: 'Apex Running Sneakers',
      description: 'High-performance lightweight running shoes engineered with responsive foam cushioning and breathable engineered mesh upper.',
      price: 135.00,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      stock: 25,
      category: 'Apparel',
    },
    {
      name: 'Glassmorphic Table Lamp',
      description: 'A contemporary table lamp featuring a frosted glass base, dimmable LED glow, and warm-toned fabric shade for a premium cozy workspace.',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
      stock: 10,
      category: 'Home Decor',
    },
    {
      name: 'Nordic Ceramic Vase Set',
      description: 'A set of three matte ceramic vases with geometric ribbed textures. Designed to elevate modern minimal table centerpieces.',
      price: 55.00,
      image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&auto=format&fit=crop&q=80',
      stock: 18,
      category: 'Home Decor',
    }
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('Database seeded successfully!');
  console.log(`Admin credentials: email: admin@ecommerce.com, password: admin123`);
  console.log(`Customer credentials: email: customer@ecommerce.com, password: customer123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
