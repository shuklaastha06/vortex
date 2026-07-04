import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const reviews = await prisma.review.findMany({
      where: { productId: id },
      include: {
        user: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json({ error: 'Failed to retrieve reviews.' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please login to submit a review.' }, { status: 401 });
    }

    const { id } = params;
    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: { productId: id, userId: user.id }
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product.' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId: id,
        userId: user.id
      },
      include: {
        user: { select: { name: true } }
      }
    });

    return NextResponse.json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('Submit review error:', error);
    return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
