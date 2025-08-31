'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { IOrder } from '@/lib/db/models/order.model'

interface PaymentStatusPollerProps {
  initialOrder: IOrder
  children: React.ReactNode
}

export default function PaymentStatusPoller({
  initialOrder,
  children,
}: PaymentStatusPollerProps) {
  const [order, setOrder] = useState<IOrder>(initialOrder)
  const [isPolling, setIsPolling] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentParam = searchParams?.get('payment')

  useEffect(() => {
    // Only poll if:
    // 1. Payment method is Stripe
    // 2. Order is not paid yet
    // 3. We have a payment parameter (indicating we came from payment success)
    const shouldPoll =
      order.paymentMethod === 'Stripe' && !order.isPaid && paymentParam

    if (!shouldPoll) return

    setIsPolling(true)
    const maxPolls = 30 // Maximum 30 seconds of polling
    const pollInterval = 1000 // Poll every 1 second
    let currentPollCount = 0

    const pollForPayment = async () => {
      try {
        const response = await fetch(`/api/orders/${order._id}/status`)
        if (!response.ok) {
          throw new Error('Failed to fetch order status')
        }

        const orderStatus = await response.json()

        if (orderStatus.isPaid) {
          // Update the order state to reflect payment
          setOrder((prev) => {
            const updatedOrder = { ...prev }
            updatedOrder.isPaid = true
            updatedOrder.paidAt = orderStatus.paidAt
            return updatedOrder as IOrder
          })
          setIsPolling(false)
          // Remove the payment parameter from URL
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.delete('payment')
          router.replace(newUrl.pathname + newUrl.search)
          return
        }

        currentPollCount++
        if (currentPollCount >= maxPolls) {
          setIsPolling(false)
          return
        }

        // Continue polling
        setTimeout(pollForPayment, pollInterval)
      } catch (err) {
        console.error('Error polling for payment:', err)
        setIsPolling(false)
      }
    }

    pollForPayment()
  }, [order._id, order.paymentMethod, order.isPaid, paymentParam, router])

  // Show payment processing banner for Stripe orders that aren't paid yet
  const showProcessingBanner =
    order.paymentMethod === 'Stripe' &&
    !order.isPaid &&
    (isPolling || paymentParam)

  return (
    <>
      {showProcessingBanner && (
        <Card className='mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2'>
              {isPolling ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
                  <div className='text-blue-800 dark:text-blue-200'>
                    Processing your payment... This may take a few moments.
                  </div>
                </>
              ) : order.isPaid ? (
                <>
                  <CheckCircle className='h-4 w-4 text-green-600' />
                  <div className='text-green-800 dark:text-green-200'>
                    Payment confirmed! Your order is being processed.
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className='h-4 w-4 text-amber-600' />
                  <div className='text-amber-800 dark:text-amber-200'>
                    Payment verification is taking longer than expected. If you
                    completed the payment, your order will be updated shortly.
                    Contact support if you continue to see this message.
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {children}
    </>
  )
}
