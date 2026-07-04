import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/db';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 400 });
  }

  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook signature mismatch: ${err.message}` }, { status: 400 });
  }

  // Handle the completed checkout session
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' }
        });
        console.log(`[Stripe Webhook] Order ${orderId} successfully updated to PAID.`);
      } catch (dbError) {
        console.error(`[Stripe Webhook] Failed to update order status in DB:`, dbError);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
export const dynamic = 'force-dynamic';
