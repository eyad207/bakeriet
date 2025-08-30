import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import useSettingStore from '@/hooks/use-setting-store'

export default function StripeForm({
  priceInCents,
  orderId,
}: {
  priceInCents: number
  orderId: string
}) {
  const {
    setting: { site },
  } = useSettingStore()

  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [email, setEmail] = useState<string>()

  // Derive locale prefix from current pathname (app uses /[locale]/... routing).
  // This runs in the browser only (StripeForm is a client component).
  const getLocalePrefix = () => {
    if (typeof window === 'undefined') return ''
    const parts = window.location.pathname.split('/')
    // parts[0] is '', parts[1] should be the locale when present
    const maybeLocale = parts[1]
    return maybeLocale && maybeLocale.length > 0 ? `/${maybeLocale}` : ''
  }

  // Use priceInCents for display
  const displayPrice = priceInCents / 100

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (stripe == null || elements == null || email == null) return

    setIsLoading(true)
    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          // Include locale prefix so Stripe returns to the localized route
          return_url: `${site.url}${getLocalePrefix()}/checkout/${orderId}/stripe-payment-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('An unknown error occurred')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {errorMessage && <div className='text-destructive'>{errorMessage}</div>}
      <PaymentElement />
      <div>
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      </div>
      <Button
        className='w-full'
        size='lg'
        disabled={stripe == null || elements == null || isLoading}
      >
        {isLoading ? (
          'Purchasing...'
        ) : (
          <div>
            Purchase - <ProductPrice price={displayPrice} plain />
          </div>
        )}
      </Button>
    </form>
  )
}
