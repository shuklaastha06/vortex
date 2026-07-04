import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    const { cartItems, paymentMethod } = await req.json();
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    // Run interactive transaction for stock safety and order creation
    const order = await prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsToCreate = [];

      for (const item of cartItems) {
        // Read and lock (implicitly inside txn) the product details
        const product = await tx.product.findUnique({
          where: { id: item.id }
        });

        if (!product) {
          throw new Error(`Product not found (ID: ${item.id}). Your cart may contain outdated items. Please clear your cart and try again.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} available.`);
        }

        // Decrement product inventory atomically
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } }
        });

        total += product.price * item.quantity;
        orderItemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price // Save snapshot of price at purchase time
        });
      }

      const status = paymentMethod === 'cod' ? 'PENDING' : (paymentMethod === 'upi' ? 'PAID' : 'PENDING');
      
      // Create the pending or paid order record
      return await tx.order.create({
        data: {
          userId: user.id,
          total,
          status,
          items: {
            create: orderItemsToCreate
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    });

    if (paymentMethod === 'cod' || paymentMethod === 'upi') {
      return NextResponse.json({ success: true, orderId: order.id });
    }

    // Check if Stripe is configured
    if (stripe) {
      const origin = req.nextUrl.origin;
      
      // Map order items to Stripe checkout line items
      const line_items = order.items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            description: item.product.description,
            images: [item.product.image],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      }));

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order.id}`,
        cancel_url: `${origin}/cart`,
        metadata: {
          orderId: order.id,
          userId: user.id,
        },
      });

      // Link order to stripe session ID
      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id }
      });

      return NextResponse.json({ url: session.url });
    } else {
      // Mock flow if Stripe keys are not configured in local environment
      return NextResponse.json({
        url: `${req.nextUrl.origin}/checkout/success?simulated=true&orderId=${order.id}`,
        isSimulated: true
      });
    }

  } catch (error) {
    console.error('Checkout error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Checkout initialization failed.' },
      { status: 400 }
    );
  }
}
