import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access only.' }, { status: 403 });
    }

    // Get aggregate revenue (Paid or Shipped orders)
    const paidOrders = await prisma.order.findMany({
      where: {
        status: { in: ['PAID', 'SHIPPED'] }
      },
      select: { total: true }
    });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

    // Order counts
    const totalOrdersCount = await prisma.order.count();

    // Customer counts
    const totalCustomersCount = await prisma.user.count({
      where: { role: 'CUSTOMER' }
    });

    // Products warning list (stock < 10)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: { lt: 10 }
      },
      select: {
        id: true,
        name: true,
        stock: true,
        category: true
      }
    });

    // Recent orders feed
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      stats: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders: totalOrdersCount,
        totalCustomers: totalCustomersCount,
        lowStockAlerts: lowStockProducts.length,
      },
      lowStockProducts,
      recentOrders
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    return NextResponse.json({ error: 'Failed to retrieve admin stats.' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
