import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to retrieve orders.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    const { action, orderId } = await req.json();

    if (action === 'finalize-mock') {
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }

      if (order.userId !== user.id) {
        return NextResponse.json({ error: 'Unauthorized access to order.' }, { status: 403 });
      }

      // Mark the simulated checkout order as PAID
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      return NextResponse.json({ order: updatedOrder });
    } else if (action === 'get-order') {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }

      // Allow either the order owner or an administrator to view the order
      if (order.userId !== user.id && user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized access to order.' }, { status: 403 });
      }

      return NextResponse.json({ order });
    }

    return NextResponse.json({ error: 'Invalid action parameter.' }, { status: 400 });
  } catch (error) {
    console.error('Order action handler error:', error);
    return NextResponse.json({ error: 'Failed to process order request.' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
