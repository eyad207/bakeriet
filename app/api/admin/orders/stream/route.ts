import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { getAllOrders } from '@/lib/actions/order.actions'
import { connectToDatabase } from '@/lib/db'
import Order from '@/lib/db/models/order.model'

export const dynamic = 'force-dynamic'

// Helper function to get total order count
async function getTotalOrderCount() {
  await connectToDatabase()
  const filter = {
    $or: [
      { isPaid: true }, // Include paid orders
      { paymentMethod: 'Cash On Delivery' }, // Include COD orders
    ],
  }
  return await Order.countDocuments(filter)
}

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await auth()
  if (!session || session.user.role !== 'Admin') {
    return new Response('Unauthorized', { status: 401 })
  }

  // Get search params for filtering
  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page') || '1'
  const orderId = searchParams.get('orderId') || ''
  const sort = searchParams.get('sort') || 'createdAt'
  const order = searchParams.get('order') || 'desc'

  // Set up Server-Sent Events headers
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  })

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const sendUpdate = async () => {
        try {
          // Fetch latest orders data
          const orders = await getAllOrders({
            page: Number(page),
            orderId,
            sort,
            order,
          })

          // Get accurate total count of all orders in the system
          const totalOrders = await getTotalOrderCount()

          const paidOrders = orders.data.filter((order) => order.isPaid).length
          const deliveredOrders = orders.data.filter(
            (order) => order.isDelivered
          ).length
          const newOrders = orders.data.filter((order) => !order.viewed).length
          const totalRevenue = orders.data
            .filter((order) => order.isPaid)
            .reduce((sum, order) => sum + order.totalPrice, 0)

          const data = {
            orders: orders.data,
            totalPages: orders.totalPages,
            stats: {
              totalOrders,
              paidOrders,
              deliveredOrders,
              newOrders,
              totalRevenue,
            },
            timestamp: new Date().toISOString(),
          }

          // Send data as SSE event
          const message = `data: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(message))
        } catch (error) {
          console.error('Error fetching orders data:', error)
          // Send error event
          const errorMessage = `event: error\ndata: ${JSON.stringify({
            error: 'Failed to fetch orders data',
            timestamp: new Date().toISOString(),
          })}\n\n`
          controller.enqueue(encoder.encode(errorMessage))
        }
      }

      // Send initial data immediately
      sendUpdate()

      // Send updates every 5 seconds
      const intervalId = setInterval(sendUpdate, 5000)

      // Send keep-alive ping every 30 seconds
      const keepAliveId = setInterval(() => {
        const ping = `: keep-alive ${Date.now()}\n\n`
        controller.enqueue(encoder.encode(ping))
      }, 30000)

      // Cleanup on close
      const cleanup = () => {
        clearInterval(intervalId)
        clearInterval(keepAliveId)
      }

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        cleanup()
        controller.close()
      })

      return cleanup
    },
  })

  return new Response(stream, { headers })
}
