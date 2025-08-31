import { NextRequest, NextResponse } from 'next/server'
import { getOrderById } from '@/lib/actions/order.actions'
import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await params
    const order = await getOrderById(orderId)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Ensure user can only access their own orders (unless admin)
    if (
      order.user.toString() !== session.user.id &&
      session.user.role !== 'Admin'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      paymentMethod: order.paymentMethod,
      _id: order._id,
    })
  } catch (error) {
    console.error('Error fetching order status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
