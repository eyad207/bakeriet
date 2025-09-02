import { Metadata } from 'next'
import CheckoutForm from './checkout-form'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getSetting } from '@/lib/actions/setting.actions'
import { isWithinOpeningHours } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Store } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Checkout',
}

async function CheckoutContent() {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/checkout')
  }

  // Check opening hours
  const setting = await getSetting()
  const openingStatus = isWithinOpeningHours(setting.openingHours)

  if (!openingStatus.isOpen) {
    return (
      <div className='max-w-2xl mx-auto p-4'>
        <Card className='border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800'>
          <CardContent className='p-6 text-center'>
            <div className='flex justify-center mb-4'>
              <div className='flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/50'>
                <Store className='h-8 w-8 text-orange-600 dark:text-orange-400' />
              </div>
            </div>
            <h2 className='text-xl font-semibold text-orange-900 dark:text-orange-100 mb-2'>
              We&apos;re Currently Closed
            </h2>
            <p className='text-orange-700 dark:text-orange-300 mb-4'>
              {openingStatus.message ||
                'Sorry, we are not taking orders right now.'}
            </p>
            <div className='flex items-center justify-center gap-2 text-sm text-orange-600 dark:text-orange-400'>
              <Clock className='h-4 w-4' />
              <span>Please come back during our opening hours</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <CheckoutForm />
}

export default function CheckoutPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className='flex justify-center items-center py-8'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2'></div>
              <p className='text-muted-foreground'>Loading checkout...</p>
            </div>
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </div>
  )
}
