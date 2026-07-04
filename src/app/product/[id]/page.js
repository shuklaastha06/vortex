import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductPage({ params }) {
  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      notFound();
    }

    // Convert non-serializable fields (like Decimal or Date) for the client component
    const serializedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      image: product.image,
      stock: product.stock,
      category: product.category,
      createdAt: product.createdAt.toISOString()
    };

    return <ProductDetailClient product={serializedProduct} />;
  } catch (error) {
    console.error('Failed to load product page:', error);
    notFound();
  }
}
export const dynamic = 'force-dynamic';
