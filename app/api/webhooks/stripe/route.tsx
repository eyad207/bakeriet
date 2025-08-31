import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { sendPurchaseReceipt } from '@/emails'
import Order from '@/lib/db/models/order.model'
import { connectToDatabase } from '@/lib/db'
import { updateProductStock } from '@/lib/actions/order.actions'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return new NextResponse('Missing signature', { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing STRIPE_WEBHOOK_SECRET')
      return new NextResponse('Webhook secret not configured', { status: 500 })
    }

    const event = await stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    console.log('Stripe webhook event received:', event.type, 'ID:', event.id)

    // Handle both charge.succeeded and payment_intent.succeeded events
    if (
      event.type === 'charge.succeeded' ||
      event.type === 'payment_intent.succeeded'
    ) {
      await connectToDatabase()

      let orderId: string
      let email: string | null
      let pricePaidInCents: number

      if (event.type === 'charge.succeeded') {
        const charge = event.data.object as Stripe.Charge
        orderId = charge.metadata.orderId
        email = charge.billing_details.email
        pricePaidInCents = charge.amount
        console.log('Processing charge.succeeded for order:', orderId)
      } else {
        // payment_intent.succeeded
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        orderId = paymentIntent.metadata.orderId
        email = paymentIntent.receipt_email
        pricePaidInCents = paymentIntent.amount
        console.log('Processing payment_intent.succeeded for order:', orderId)
      }

      if (!orderId) {
        console.error('No orderId found in metadata for event:', event.id)
        return new NextResponse('Invalid metadata', { status: 400 })
      }

      const order = await Order.findById(orderId).populate('user', 'email')
      if (!order) {
        console.error('Order not found:', orderId, 'for event:', event.id)
        return new NextResponse('Order not found', { status: 404 })
      }

      // Prevent duplicate processing
      if (order.isPaid) {
        console.log('Order already paid:', orderId, '- skipping processing')
        return NextResponse.json({ message: 'Order already processed' })
      }

      console.log('Marking order as paid:', orderId)
      order.isPaid = true
      order.paidAt = new Date()
      order.paymentResult = {
        id: event.id,
        status: 'COMPLETED',
        email_address:
          email ||
          (typeof order.user === 'object' ? order.user.email : '') ||
          '',
        pricePaid: (pricePaidInCents / 100).toFixed(2),
      }
      await order.save()

      console.log('Order saved successfully:', orderId)

      try {
        await sendPurchaseReceipt({ order })
        console.log('Purchase receipt sent for order:', orderId)
      } catch (error) {
        console.error('Error sending receipt for order:', orderId, error)
      }

      try {
        await updateProductStock(orderId)
        console.log('Product stock updated for order:', orderId)
      } catch (error) {
        console.error('Error updating stock for order:', orderId, error)
      }

      return NextResponse.json({
        message: 'Payment processed successfully',
        orderId: orderId,
      })
    }

    console.log('Unhandled event type:', event.type)
    return NextResponse.json({ message: 'Event not handled' })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return new NextResponse(
      error instanceof Error ? error.message : 'Webhook error',
      { status: 400 }
    )
  }
}
