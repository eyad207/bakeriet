'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { createOrder } from '@/lib/actions/order.actions'
import {
  calculateFutureDate,
  formatDateTime,
  isWithinOpeningHours,
} from '@/lib/utils'
import { ShippingAddressSchema } from '@/lib/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  TrashIcon,
  ShoppingBag,
  MapPin,
  Calendar as CalendarIcon,
} from 'lucide-react'
import CheckoutFooter from './checkout-footer'
import { ShippingAddress } from '@/types'
import useIsMounted from '@/hooks/use-is-mounted'
import useCartStore from '@/hooks/use-cart-store'
import useSettingStore from '@/hooks/use-setting-store'
import ProductPrice from '@/components/shared/product/product-price'
import { useTranslations } from 'next-intl'
import {
  validateCartClientSide,
  hasInvalidQuantities,
  getInvalidQuantityItems,
} from '@/lib/cart-validation-client'

const shippingAddressDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        fullName: 'Basir',
        street: '1911, 65 Sherbrooke Est',
        city: 'Montreal',
        province: 'Quebec',
        phone: '4181234567',
        postalCode: 'H2X 1C4',
        country: 'Canada',
      }
    : {
        fullName: '',
        street: '',
        city: '',
        province: '',
        phone: '',
        postalCode: '',
        country: '',
      }

const CheckoutForm = () => {
  const t = useTranslations('Checkout')
  const tCart = useTranslations('Cart')
  const { toast } = useToast()
  const router = useRouter()
  const {
    setting,
    setting: { availableDeliveryDates },
  } = useSettingStore()

  const {
    cart: {
      items,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      shippingAddress,
      deliveryDateIndex,
    },
    updateItem,
    removeItem,
    refreshCartStock,
    clearCart,
  } = useCartStore()
  const isMounted = useIsMounted()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const shippingAddressForm = useForm<ShippingAddress>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: shippingAddress || shippingAddressDefaultValues,
  })

  useEffect(() => {
    if (!isMounted || !shippingAddress) return
    shippingAddressForm.setValue('fullName', shippingAddress.fullName)
    shippingAddressForm.setValue('street', shippingAddress.street)
    shippingAddressForm.setValue('city', shippingAddress.city)
    shippingAddressForm.setValue('country', shippingAddress.country)
    shippingAddressForm.setValue('postalCode', shippingAddress.postalCode)
    shippingAddressForm.setValue('province', shippingAddress.province)
    shippingAddressForm.setValue('phone', shippingAddress.phone)
  }, [items, isMounted, router, shippingAddress, shippingAddressForm])

  useEffect(() => {
    refreshCartStock()
  }, [refreshCartStock])

  // Early validation - redirect if cart is invalid
  useEffect(() => {
    if (!isMounted) return

    if (items.length === 0) {
      toast({
        description: tCart('Your cart is empty'),
        variant: 'destructive',
      })
      return
    }

    // Check if any items have invalid quantities
    if (hasInvalidQuantities(items)) {
      toast({
        description: tCart('Please fix invalid quantities before checkout'),
        variant: 'destructive',
      })
      router.push('/cart?error=invalid-quantities')
      return
    }
  }, [items, isMounted, router, tCart, toast])

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)

    // Validate shipping address first
    const addressValid = await shippingAddressForm.trigger()
    if (!addressValid) {
      toast({
        description: t('Please fill in all required shipping information'),
        variant: 'destructive',
      })
      setIsPlacingOrder(false)
      return
    }

    // Update shipping address in cart
    const addressData = shippingAddressForm.getValues()
    useCartStore.getState().setShippingAddress(addressData)

    // Check opening hours first
    const openingStatus = isWithinOpeningHours(setting.openingHours)
    if (!openingStatus.isOpen) {
      toast({
        description: openingStatus.message || 'We are currently closed',
        variant: 'destructive',
      })
      setIsPlacingOrder(false)
      return
    }

    // Comprehensive cart validation
    const cartValidation = validateCartClientSide({
      items,
      itemsPrice,
      totalPrice,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
    })

    // Check for invalid quantities
    const invalidQuantityItems = getInvalidQuantityItems(items)

    if (!cartValidation.isValid || invalidQuantityItems.length > 0) {
      const errorMessages = [
        ...cartValidation.errors,
        ...invalidQuantityItems.map(
          (item) => `${item.name}: Invalid quantity (${item.quantity})`
        ),
      ]

      toast({
        description:
          errorMessages.length > 0
            ? errorMessages.join('; ')
            : t('Please fix cart issues before placing your order'),
        variant: 'destructive',
      })
      setIsPlacingOrder(false)
      return
    }

    if (deliveryDateIndex === undefined) {
      toast({
        description: t('Delivery date is required'),
        variant: 'destructive',
      })
      setIsPlacingOrder(false)
      return
    }

    // Default payment method to "Pay Here" (Stripe) - payment selection happens on payment page
    const orderPaymentMethod = totalPrice === 0 ? 'Free Order' : 'Stripe'

    const res = await createOrder({
      items,
      shippingAddress: addressData,
      expectedDeliveryDate: calculateFutureDate(
        availableDeliveryDates[deliveryDateIndex!].daysToDeliver
      ),
      deliveryDateIndex,
      paymentMethod: orderPaymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    })

    setIsPlacingOrder(false)

    if (!res.success) {
      toast({
        description: res.message,
        variant: 'destructive',
      })
    } else {
      toast({
        description: res.message,
        variant: 'default',
      })

      // For free orders, clear cart and go to order page
      if (totalPrice === 0) {
        clearCart()
        router.push(`/account/orders/${res.data?.orderId}`)
      } else {
        // For paid orders, go to payment page
        router.push(`/checkout/${res.data?.orderId}`)
      }
    }
  }

  const OrderSummary = () => (
    <Card className='sticky top-4'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-xl font-bold'>{t('orderSummary')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>{t('items')}:</span>
            <span className='font-medium'>
              <ProductPrice price={itemsPrice} plain />
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>
              {t('shippingHandling')}:
            </span>
            <span className='font-medium'>
              {shippingPrice === undefined ? (
                '--'
              ) : shippingPrice === 0 ? (
                t('free')
              ) : (
                <ProductPrice price={shippingPrice} plain />
              )}
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>{t('tax')}:</span>
            <span className='font-medium'>
              {taxPrice === undefined ? (
                '--'
              ) : (
                <ProductPrice price={taxPrice} plain />
              )}
            </span>
          </div>
          <div className='border-t pt-3 mt-3'>
            <div className='flex justify-between items-center'>
              <span className='text-lg font-bold'>{t('orderTotal')}:</span>
              <span className='text-2xl font-bold text-primary'>
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || items.some((it) => it.quantity === 0)}
          className='w-full h-12 text-lg font-semibold'
          size='lg'
        >
          {isPlacingOrder
            ? 'Behandler...'
            : totalPrice === 0
              ? 'Fullfør Bestilling'
              : 'Gå til Betaling'}
        </Button>

        <p className='text-xs text-center text-muted-foreground'>
          {totalPrice === 0
            ? 'Gratis bestilling - ingen betaling nødvendig'
            : 'Du vil bli omdirigert til betalingssiden'}
        </p>
      </CardContent>
    </Card>
  )

  if (!isMounted) return null

  return (
    <main className='max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8'>
      <div className='mb-8'>
        <h1 className='text-3xl md:text-4xl font-bold mb-2'>
          Gjennomgå Bestilling
        </h1>
        <p className='text-muted-foreground'>
          Fyll ut leveringsinformasjonen og gjennomgå bestillingen din
        </p>
      </div>

      <div className='grid lg:grid-cols-3 gap-6 md:gap-8'>
        <div className='lg:col-span-2 space-y-6'>
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <ShoppingBag className='h-5 w-5' />
                Dine Varer ({items.length}{' '}
                {items.length === 1 ? 'vare' : 'varer'})
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {items.map((item, index) => (
                <div
                  key={`${item.slug}-${index}`}
                  className='flex gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors'
                >
                  <div className='relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border'>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes='80px'
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                  </div>

                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-base mb-1 truncate'>
                      {item.name}
                    </h3>
                    <div className='flex gap-2 text-sm text-muted-foreground mb-2'>
                      {item.color && (
                        <span className='flex items-center gap-1'>
                          <span
                            className='w-3 h-3 rounded-full border'
                            style={{
                              backgroundColor: item.color.toLowerCase(),
                            }}
                          />
                          {item.color}
                        </span>
                      )}
                      {item.size && <span>Størrelse: {item.size}</span>}
                    </div>
                    <div className='flex items-center gap-3'>
                      <Select
                        value={item.quantity.toString()}
                        onValueChange={(value) => {
                          const newQuantity = Number(value)
                          if (newQuantity === 0) {
                            removeItem(item)
                          } else {
                            updateItem(item, newQuantity)
                          }
                        }}
                      >
                        <SelectTrigger className='w-24 h-9'>
                          <SelectValue>Ant: {item.quantity}</SelectValue>
                        </SelectTrigger>
                        <SelectContent position='popper'>
                          {Array.from({
                            length:
                              item.colors
                                .find((c) => c.color === item.color)
                                ?.sizes.find((s) => s.size === item.size)
                                ?.countInStock || 0,
                          }).map((_, i) => (
                            <SelectItem key={i + 1} value={`${i + 1}`}>
                              {i + 1}
                            </SelectItem>
                          ))}
                          <SelectItem value='0'>Fjern</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-9 w-9 p-0 text-muted-foreground hover:text-destructive'
                        onClick={() => removeItem(item)}
                      >
                        <TrashIcon className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>

                  <div className='text-right flex flex-col justify-between'>
                    <div className='font-bold text-lg'>
                      <ProductPrice
                        price={item.price}
                        discountedPrice={item.discountedPrice}
                        plain
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MapPin className='h-5 w-5' />
                Leveringsinformasjon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...shippingAddressForm}>
                <form className='space-y-4'>
                  <FormField
                    control={shippingAddressForm.control}
                    name='fullName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fullt Navn *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Skriv inn fullt navn'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={shippingAddressForm.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefonnummer *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Skriv inn telefonnummer'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={shippingAddressForm.control}
                    name='street'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse *</FormLabel>
                        <FormControl>
                          <Input placeholder='Gateadresse' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid md:grid-cols-2 gap-4'>
                    <FormField
                      control={shippingAddressForm.control}
                      name='city'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>By *</FormLabel>
                          <FormControl>
                            <Input placeholder='By' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={shippingAddressForm.control}
                      name='postalCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postnummer *</FormLabel>
                          <FormControl>
                            <Input placeholder='Postnummer' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid md:grid-cols-2 gap-4'>
                    <FormField
                      control={shippingAddressForm.control}
                      name='province'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fylke *</FormLabel>
                          <FormControl>
                            <Input placeholder='Fylke' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={shippingAddressForm.control}
                      name='country'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Land *</FormLabel>
                          <FormControl>
                            <Input placeholder='Land' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Delivery Date */}
          {deliveryDateIndex !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <CalendarIcon className='h-5 w-5' />
                  Leveringsdato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-3 p-4 bg-muted/30 rounded-lg'>
                  <CalendarIcon className='h-5 w-5 text-primary' />
                  <div>
                    <p className='font-medium'>
                      {
                        formatDateTime(
                          calculateFutureDate(
                            availableDeliveryDates[deliveryDateIndex]
                              .daysToDeliver
                          )
                        ).dateOnly
                      }
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {availableDeliveryDates[deliveryDateIndex].name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mobile Order Summary */}
          <div className='lg:hidden'>
            <OrderSummary />
          </div>

          <CheckoutFooter />
        </div>

        {/* Desktop Order Summary */}
        <div className='hidden lg:block'>
          <OrderSummary />
        </div>
      </div>
    </main>
  )
}

export default CheckoutForm
