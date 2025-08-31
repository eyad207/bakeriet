'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import CartClearOnPaymentSuccess from '@/components/shared/cart-clear-on-payment-success'
import { Loader2 } from 'lucide-react'

export default function StripeSuccessClient({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [isPolling, setIsPolling] = useState(true)
  const [pollCount, setPollCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const maxPolls = 30 // Maximum 30 seconds of polling
    const pollInterval = 1000 // Poll every 1 second

    const pollForPayment = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}/status`)
        if (!response.ok) {
          throw new Error('Failed to fetch order status')
        }

        const orderStatus = await response.json()

        if (orderStatus.isPaid) {
          setIsPolling(false)
          // Small delay to ensure cart is cleared
          setTimeout(() => {
            router.push(`/account/orders/${orderId}?payment=stripe`)
          }, 500)
          return
        }

        setPollCount((prev) => prev + 1)

        if (pollCount >= maxPolls) {
          setIsPolling(false)
          setError(
            'Payment verification is taking longer than expected. Please check your order status manually.'
          )
          return
        }

        // Continue polling
        setTimeout(pollForPayment, pollInterval)
      } catch (err) {
        console.error('Error polling for payment:', err)
        setIsPolling(false)
        setError(
          'Unable to verify payment status. Please check your order manually.'
        )
      }
    }

    pollForPayment()
  }, [orderId, router, pollCount])

  return (
    <div className='max-w-4xl w-full mx-auto space-y-8'>
      <CartClearOnPaymentSuccess />
      <div className='flex flex-col gap-6 items-center'>
        <h1 className='font-bold text-2xl lg:text-3xl'>
          Thanks for your purchase!
        </h1>

        {isPolling ? (
          <div className='flex flex-col items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span>Processing your order...</span>
            </div>
            <p className='text-sm text-muted-foreground text-center'>
              We&apos;re confirming your payment. This usually takes a few
              seconds.
            </p>
          </div>
        ) : error ? (
          <div className='flex flex-col items-center gap-4'>
            <div className='text-center'>
              <p className='text-destructive mb-2'>{error}</p>
              <Button asChild>
                <Link href={`/account/orders/${orderId}`}>
                  Check Order Status
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-4'>
            <p>Your order has been confirmed!</p>
            <Button asChild>
              <Link href={`/account/orders/${orderId}?payment=stripe`}>
                View Order
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
