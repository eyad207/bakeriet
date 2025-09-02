'use client'

import useCartStore from '@/hooks/use-cart-store'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/currency'
import Link from 'next/link'
import React, { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  ShoppingBag,
  TrashIcon,
  X,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import useSettingStore from '@/hooks/use-setting-store'
import ProductPrice from './product/product-price'
import { useCartSidebarStore } from '@/hooks/use-cart-sidebar-store'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import type { OrderItem } from '@/types'
import {
  validateCartClientSide,
  isCartReadyForCheckout,
} from '@/lib/cart-validation-client'
import { Badge } from '../ui/badge'

// Memoized quantity selector component to prevent unnecessary re-renders
const QuantitySelector = memo(
  ({
    item,
    hasValidationIssue,
    isRefreshing,
    onQuantityUpdate,
  }: {
    item: OrderItem
    hasValidationIssue: boolean
    isRefreshing: boolean
    onQuantityUpdate: (item: OrderItem, quantity: number) => void
  }) => {
    const maxStock = Math.min(
      item.colors
        ?.find((c) => c.color === item.color)
        ?.sizes.find((s) => s.size === item.size)?.countInStock || 0,
      10 // Limit to 10 for UX
    )

    const handleValueChange = useCallback(
      (value: string) => {
        onQuantityUpdate(item, Number(value))
      },
      [item, onQuantityUpdate]
    )

    return (
      <Select
        value={item.quantity.toString()}
        onValueChange={handleValueChange}
        disabled={isRefreshing}
      >
        <SelectTrigger
          className={cn(
            'text-xs h-7 w-14 px-2',
            hasValidationIssue && 'border-red-300 bg-red-50 dark:bg-red-900/20'
          )}
          onFocus={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className='z-[999] bg-white dark:bg-gray-900'
          position='popper'
          side='bottom'
          align='center'
          sideOffset={4}
          avoidCollisions={true}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {Array.from({ length: maxStock }).map((_, i) => (
            <SelectItem value={(i + 1).toString()} key={i + 1}>
              {i + 1}
            </SelectItem>
          ))}
          <SelectItem value='0' className='text-red-600'>
            Remove
          </SelectItem>
        </SelectContent>
      </Select>
    )
  }
)

QuantitySelector.displayName = 'QuantitySelector'

// Enhanced validation interfaces
interface ValidationState {
  isValidating: boolean
  hasErrors: boolean
  errors: string[]
  invalidItems: string[]
  stockIssues: Array<{
    itemId: string
    itemName: string
    availableStock: number
    requestedQuantity: number
  }>
}

interface PriceChangeState {
  hasChanges: boolean
  isProcessing: boolean
  priceChanges: Array<{
    item: OrderItem
    oldPrice: number
    newPrice: number
    priceChange: number
    changeType: 'increase' | 'decrease'
  }>
}

// Custom hooks for cart operations
const useCartValidation = (items: OrderItem[]): ValidationState => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValidating: false,
    hasErrors: false,
    errors: [],
    invalidItems: [],
    stockIssues: [],
  })

  const validateCart = useCallback(async () => {
    if (items.length === 0) {
      setValidationState({
        isValidating: false,
        hasErrors: false,
        errors: [],
        invalidItems: [],
        stockIssues: [],
      })
      return
    }

    setValidationState((prev) => ({ ...prev, isValidating: true }))

    const clientValidation = validateCartClientSide({
      items,
      itemsPrice: 0, // Will be calculated
      totalPrice: 0, // Will be calculated
      taxPrice: undefined,
      shippingPrice: undefined,
      paymentMethod: undefined,
      shippingAddress: undefined,
      deliveryDateIndex: undefined,
    })

    const stockIssues: ValidationState['stockIssues'] = []

    // Enhanced stock validation
    items.forEach((item) => {
      const colorObj = item.colors?.find((c) => c.color === item.color)
      const sizeObj = colorObj?.sizes?.find((s) => s.size === item.size)

      if (sizeObj && sizeObj.countInStock < item.quantity) {
        stockIssues.push({
          itemId: item.clientId || item.product,
          itemName: item.name,
          availableStock: sizeObj.countInStock,
          requestedQuantity: item.quantity,
        })
      }
    })

    setValidationState({
      isValidating: false,
      hasErrors: !clientValidation.isValid || stockIssues.length > 0,
      errors: [...clientValidation.errors, ...clientValidation.warnings],
      invalidItems: clientValidation.invalidItems.map(
        (item) => item.clientId || item.product
      ),
      stockIssues,
    })
  }, [items])

  useEffect(() => {
    validateCart()
  }, [validateCart])

  return validationState
}

export default function CartSidebar() {
  const { isOpen, closeSidebar } = useCartSidebarStore()
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
    clearCart,
    refreshCartStock,
    refreshCartPrices,
  } = useCartStore()
  const {
    setting: {
      common: { freeShippingMinPrice },
    },
  } = useSettingStore()

  const router = useRouter()

  // Enhanced state management
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [priceChangeInfo, setPriceChangeInfo] = useState<PriceChangeState>({
    hasChanges: false,
    isProcessing: false,
    priceChanges: [],
  })

  // Validation hook
  const validation = useCartValidation(items)

  // Memoized calculations
  const cartSummary = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const hasValidItems = items.length > 0 && !validation.hasErrors
    const canCheckout =
      hasValidItems &&
      isCartReadyForCheckout({
        items,
        itemsPrice,
        totalPrice: itemsPrice,
        taxPrice: undefined,
        shippingPrice: undefined,
        paymentMethod: undefined,
        shippingAddress: undefined,
        deliveryDateIndex: undefined,
      })

    return {
      totalItems,
      hasValidItems,
      canCheckout,
      freeShippingRemaining: Math.max(0, freeShippingMinPrice - itemsPrice),
    }
  }, [items, validation.hasErrors, itemsPrice, freeShippingMinPrice])

  // Enhanced price and stock checking
  const checkPricesAndStock = useCallback(async () => {
    if (items.length === 0) return

    setIsRefreshing(true)
    setPriceChangeInfo((prev) => ({ ...prev, isProcessing: true }))

    try {
      // Check for price changes first
      const priceResult = await refreshCartPrices()

      if (priceResult.hasChanges) {
        setPriceChangeInfo({
          hasChanges: true,
          isProcessing: false,
          priceChanges: priceResult.priceChanges,
        })

        // Enhanced notification based on changes
        const totalIncreases = priceResult.priceChanges.filter(
          (c) => c.changeType === 'increase'
        ).length
        const totalDecreases = priceResult.priceChanges.filter(
          (c) => c.changeType === 'decrease'
        ).length
        const totalIncrease = priceResult.priceChanges
          .filter((c) => c.changeType === 'increase')
          .reduce((sum, c) => sum + c.priceChange, 0)
        const totalDecrease = priceResult.priceChanges
          .filter((c) => c.changeType === 'decrease')
          .reduce((sum, c) => sum + c.priceChange, 0)

        if (totalIncreases > 0 && totalDecreases > 0) {
          toast({
            title: 'Price and Discount Changes Detected',
            description: `${totalIncreases} items increased, ${totalDecreases} items decreased. Net change: ${formatPrice(totalIncrease - totalDecrease)}`,
            variant: 'default',
            duration: 6000,
          })
        } else if (totalIncreases > 0) {
          toast({
            title: 'Price Changes Detected',
            description: `${totalIncreases} items have increased by ${formatPrice(totalIncrease)} due to price or discount changes`,
            variant: 'destructive',
            duration: 6000,
          })
        } else {
          toast({
            title: 'Price Changes Detected',
            description: `${totalDecreases} items have decreased by ${formatPrice(totalDecrease)} due to price or discount changes`,
            variant: 'default',
            duration: 6000,
          })
        }
      } else {
        setPriceChangeInfo((prev) => ({ ...prev, isProcessing: false }))
      }

      // Then refresh stock
      await refreshCartStock()
    } catch (error) {
      console.error('Failed to check prices and stock:', error)
      toast({
        title: 'Error',
        description: 'Failed to update cart information',
        variant: 'destructive',
      })
    } finally {
      setIsRefreshing(false)
      setPriceChangeInfo((prev) => ({ ...prev, isProcessing: false }))
    }
  }, [items.length, refreshCartPrices, refreshCartStock])

  // Auto-refresh prices when cart sidebar opens
  useEffect(() => {
    if (isOpen && items.length > 0) {
      checkPricesAndStock()
    }
  }, [isOpen, items.length, checkPricesAndStock])

  const dismissPriceChanges = useCallback(() => {
    setPriceChangeInfo({
      hasChanges: false,
      isProcessing: false,
      priceChanges: [],
    })
    toast({
      title: 'Price Changes Accepted',
      description: 'Your cart has been updated with current prices',
      variant: 'default',
    })
  }, [])

  // Enhanced quantity update with validation
  const handleQuantityUpdate = useCallback(
    async (item: OrderItem, newQuantity: number) => {
      // Validate quantity before update
      if (newQuantity < 0 || !Number.isInteger(newQuantity)) {
        toast({
          title: 'Invalid Quantity',
          description: 'Quantity must be a positive whole number',
          variant: 'destructive',
        })
        return
      }

      // Check stock availability
      const colorObj = item.colors?.find((c) => c.color === item.color)
      const sizeObj = colorObj?.sizes?.find((s) => s.size === item.size)

      if (newQuantity > 0 && sizeObj && sizeObj.countInStock < newQuantity) {
        toast({
          title: 'Insufficient Stock',
          description: `Only ${sizeObj.countInStock} items available for ${item.name}`,
          variant: 'destructive',
        })
        return
      }

      try {
        await updateItem(item, newQuantity)

        if (newQuantity === 0) {
          toast({
            title: 'Item Removed',
            description: `${item.name} has been removed from your cart`,
            variant: 'default',
          })
        }
      } catch (error) {
        console.error('Failed to update item quantity:', error)
        toast({
          title: 'Error',
          description: 'Failed to update item quantity',
          variant: 'destructive',
        })
      }
    },
    [updateItem]
  )

  // Auto-refresh when sidebar opens
  useEffect(() => {
    if (isOpen && items.length > 0) {
      checkPricesAndStock()
    }
  }, [isOpen, items.length, checkPricesAndStock])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className='fixed inset-0 bg-black/30 dark:bg-black/50 z-[100] backdrop-blur-sm'
          />

          {/* Enhanced Sidebar */}
          <motion.div
            initial={{ x: 340 }}
            animate={{ x: 0 }}
            exit={{ x: 340 }}
            transition={{ type: 'spring', damping: 22 }}
            className={cn(
              'fixed top-0 bottom-0 z-[101] w-full max-w-[340px] xs:max-w-[380px] bg-white/70 dark:bg-zinc-900/80 shadow-2xl backdrop-blur-xl border-none rounded-l-3xl',
              'right-0',
              'overflow-hidden flex flex-col'
            )}
          >
            {/* Modern Header */}
            <div className='p-6 bg-gradient-to-r from-orange-500 to-yellow-400 text-white flex items-center justify-between relative shadow-lg rounded-tl-3xl'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-white/30 rounded-xl backdrop-blur-md shadow-sm'>
                  <ShoppingBag className='h-7 w-7 text-orange-600' />
                </div>
                <div>
                  <h2 className='text-2xl font-extrabold tracking-wide drop-shadow-sm'>
                    Din Handlekurv
                  </h2>
                  <p className='text-white/90 text-sm font-medium'>
                    {cartSummary.totalItems === 0
                      ? 'Handlekurven er tom'
                      : `${cartSummary.totalItems} vare${cartSummary.totalItems === 1 ? '' : 'r'}`}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-semibold text-white/90'>
                    {cartSummary.totalItems}{' '}
                    {cartSummary.totalItems === 1 ? 'Vare' : 'Varer'}
                  </span>
                  {validation.hasErrors && (
                    <Badge
                      variant='destructive'
                      className='text-xs px-1.5 py-0.5 shadow-md'
                    >
                      {validation.stockIssues.length + validation.errors.length}
                    </Badge>
                  )}
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={closeSidebar}
                  className='h-9 w-9 p-0 text-white/80 hover:text-white hover:bg-white/20 rounded-full border border-white/20 shadow-sm transition-all duration-150'
                >
                  <X className='h-5 w-5' />
                </Button>
              </div>
              {/* Loading indicator */}
              {(isRefreshing || priceChangeInfo.isProcessing) && (
                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-white/20'>
                  <div className='h-full bg-white animate-pulse' />
                </div>
              )}
            </div>

            {/* Enhanced Validation Notifications */}
            {validation.hasErrors && (
              <div className='p-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800'>
                <div className='flex items-start gap-2'>
                  <AlertTriangle className='h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-sm font-medium text-red-800 dark:text-red-200 mb-1'>
                      Cart Issues Detected
                    </h3>
                    <div className='space-y-1 text-xs text-red-700 dark:text-red-300'>
                      {validation.stockIssues.map((issue, index) => (
                        <div key={index}>
                          <span className='font-medium'>{issue.itemName}</span>
                          {' - '}
                          Only {issue.availableStock} in stock, requested{' '}
                          {issue.requestedQuantity}
                        </div>
                      ))}
                      {validation.errors.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Price Change Notification */}
            {priceChangeInfo.hasChanges && (
              <div className='p-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800'>
                <div className='flex items-start gap-2'>
                  <AlertTriangle className='h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-sm font-medium text-amber-800 dark:text-amber-200 mb-1'>
                      Price Changes Detected
                    </h3>
                    <div className='space-y-1 mb-2 max-h-20 overflow-y-auto'>
                      {priceChangeInfo.priceChanges.map((change, index) => (
                        <div
                          key={index}
                          className='text-xs text-amber-700 dark:text-amber-300'
                        >
                          <span className='font-medium'>
                            {change.item.name}
                          </span>
                          {'  '}
                          <span
                            className={cn(
                              'font-medium',
                              change.changeType === 'increase'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-green-600 dark:text-green-400'
                            )}
                          >
                            {change.changeType === 'increase' ? '+' : '-'}
                            {formatPrice(change.priceChange)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={dismissPriceChanges}
                      disabled={priceChangeInfo.isProcessing}
                      className='h-6 px-2 text-xs bg-white dark:bg-amber-900/50 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/70'
                    >
                      {priceChangeInfo.isProcessing ? (
                        <>
                          <Loader2 className='h-3 w-3 mr-1 animate-spin' />
                          Processing
                        </>
                      ) : (
                        'Accept Changes'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Cart Items */}
            <ScrollArea className='flex-1 overflow-y-auto py-3 px-1'>
              <div className='flex flex-col gap-3'>
                {items.length === 0 ? (
                  <div className='p-8 text-center'>
                    <ShoppingBag className='h-12 w-12 mx-auto text-muted-foreground/50 mb-3' />
                    <p className='text-muted-foreground text-sm'>
                      Your Shopping Cart is empty
                    </p>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={closeSidebar}
                      className='mt-2'
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  items.map((item) => {
                    const hasValidationIssue = validation.invalidItems.includes(
                      item.clientId || item.product
                    )
                    const stockIssue = validation.stockIssues.find(
                      (issue) =>
                        issue.itemId === (item.clientId || item.product)
                    )

                    return (
                      <div
                        key={`${item.clientId}-${item.quantity}`}
                        className={cn(
                          'bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-md p-4 flex gap-3 items-center group transition-all duration-200 border border-zinc-200 dark:border-zinc-800 hover:scale-[1.015] hover:shadow-lg',
                          hasValidationIssue &&
                            'border-red-300 ring-2 ring-red-200 dark:ring-red-400/40'
                        )}
                        onMouseDown={(e) => {
                          // Prevent mouse events from interfering with Select
                          if (
                            (e.target as HTMLElement).closest(
                              '[data-radix-select-trigger]'
                            )
                          ) {
                            e.stopPropagation()
                          }
                        }}
                      >
                        <Link
                          href={`/product/${item.slug}`}
                          className='shrink-0'
                          onClick={closeSidebar}
                        >
                          <div className='relative h-16 w-16 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white/60 group-hover:shadow-md'>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes='64px'
                              className='object-contain'
                            />
                            {hasValidationIssue && (
                              <div className='absolute inset-0 bg-red-500/20 flex items-center justify-center rounded-xl'>
                                <AlertTriangle className='h-4 w-4 text-red-600' />
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className='flex-1 min-w-0'>
                          <Link
                            href={`/product/${item.slug}`}
                            className='font-semibold text-base line-clamp-1 hover:text-orange-600 transition-colors'
                            onClick={closeSidebar}
                          >
                            {item.name}
                          </Link>

                          <div className='text-zinc-500 dark:text-zinc-300 text-xs mt-1 flex gap-2'>
                            {item.color && (
                              <span className='mr-2'>
                                <span className='font-medium'>Type</span>{' '}
                                {item.color}
                              </span>
                            )}
                            {item.size && (
                              <span>
                                <span className='font-medium'>Size:</span>{' '}
                                {item.size}
                              </span>
                            )}
                          </div>

                          {/* Stock warning */}
                          {stockIssue && (
                            <div className='text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1'>
                              <AlertTriangle className='h-3 w-3' />
                              Only {stockIssue.availableStock} available
                            </div>
                          )}

                          <div className='flex items-center justify-between mt-2'>
                            <div className='font-bold text-base text-orange-700 dark:text-yellow-300'>
                              <ProductPrice
                                price={item.price}
                                discountedPrice={item.discountedPrice}
                                plain
                              />
                              {item.discountedPrice && item.discount && (
                                <div className='text-xs text-green-600 mt-1'>
                                  {item.discount}% discount applied
                                </div>
                              )}
                            </div>

                            <div className='flex items-center gap-2'>
                              <QuantitySelector
                                item={item}
                                hasValidationIssue={hasValidationIssue}
                                isRefreshing={isRefreshing}
                                onQuantityUpdate={handleQuantityUpdate}
                              />

                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-150'
                                onClick={() => removeItem(item)}
                                disabled={isRefreshing}
                              >
                                <TrashIcon className='w-5 h-5' />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>

            {/* Enhanced Summary and Checkout */}
            <div className='p-4 bg-muted/30 border-t border-border/30'>
              {items.length > 0 && (
                <>
                  {/* Enhanced free shipping message */}
                  {cartSummary.freeShippingRemaining > 0 ? (
                    <div className='text-sm mb-3 p-2 bg-primary/10 rounded-md border border-primary/20'>
                      <div className='flex items-center gap-2 mb-1'>
                        <ShoppingBag className='h-4 w-4 text-primary' />
                        <span className='font-medium text-primary'>
                          Gratis levering tilgjengelig
                        </span>
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        Legg til{' '}
                        <span className='text-primary font-medium'>
                          {formatPrice(cartSummary.freeShippingRemaining)}
                        </span>{' '}
                        mer for å kvalifisere for gratis levering
                      </p>
                      <div className='mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                        <div
                          className='bg-primary h-2 rounded-full transition-all duration-300'
                          style={{
                            width: `${Math.min((itemsPrice / freeShippingMinPrice) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className='text-sm mb-3 p-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-md border border-green-200 dark:border-green-800'>
                      <div className='flex items-center gap-2'>
                        <div className='h-4 w-4 rounded-full bg-green-500 flex items-center justify-center'>
                          <div className='h-2 w-2 bg-white rounded-full' />
                        </div>
                        <span className='font-medium'>
                          Du har kvalifisert for gratis levering!
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Enhanced subtotal */}
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-muted-foreground'>
                      Totalt ({cartSummary.totalItems}{' '}
                      {cartSummary.totalItems === 1 ? 'Vare' : 'Varer'})
                    </span>
                    <span className='font-bold text-lg'>
                      <ProductPrice price={itemsPrice} plain />
                    </span>
                  </div>
                </>
              )}

              {/* Enhanced Action Buttons */}
              <div className='space-y-2'>
                <Button
                  type='button'
                  onClick={() => {
                    closeSidebar()
                    router.push('/checkout')
                  }}
                  className={cn(
                    'w-full py-2 text-base font-semibold rounded-2xl border-2 border-orange-300 text-orange-700 bg-white shadow-sm hover:bg-orange-50 hover:border-orange-500 hover:text-orange-900 transition-all duration-300 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-orange-200',
                    (!cartSummary.canCheckout || validation.hasErrors) &&
                      'opacity-60 pointer-events-none'
                  )}
                  style={{ position: 'relative' }}
                  disabled={
                    !cartSummary.canCheckout ||
                    validation.hasErrors ||
                    isRefreshing
                  }
                >
                  <span className='absolute inset-0 pointer-events-none transition-opacity duration-300 bg-black/10 opacity-0 group-hover:opacity-100' />
                  <span className='relative z-10 flex items-center justify-center'>
                    {validation.hasErrors ? (
                      <>
                        <AlertTriangle className='h-5 w-5 mr-2' />
                        Fix Issues to Checkout
                      </>
                    ) : isRefreshing ? (
                      <>
                        <Loader2 className='h-5 w-5 mr-2 animate-spin' />
                        Oppdaterer
                      </>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </span>
                </Button>

                <Link
                  href='/cart'
                  className={cn(
                    'w-full py-2 text-base font-semibold rounded-2xl border-2 border-orange-300 text-orange-700 bg-white shadow-sm transition-all duration-300 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-orange-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:border-orange-400 hover:text-orange-800 hover:shadow-md hover:scale-[1.02]',
                    items.length === 0 && 'opacity-50 pointer-events-none'
                  )}
                  onClick={closeSidebar}
                >
                  Gå til Handlekurven
                </Link>

                {items.length > 0 && (
                  <div className='flex gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={checkPricesAndStock}
                      disabled={isRefreshing}
                      className='flex-1 text-xs rounded-xl border border-yellow-400 bg-yellow-50 hover:bg-yellow-200 text-yellow-800 hover:text-yellow-900 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1 focus-visible:ring-2 focus-visible:ring-yellow-300'
                    >
                      {isRefreshing ? (
                        <>
                          <Loader2 className='h-4 w-4 mr-1 animate-spin' />
                          Oppdaterer
                        </>
                      ) : (
                        <>
                          <RefreshCw className='h-4 w-4 mr-1' />
                          Oppdater
                        </>
                      )}
                    </Button>

                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => {
                        clearCart()
                        closeSidebar()
                      }}
                      disabled={isRefreshing}
                      className='flex-1 text-xs rounded-xl border border-red-400 bg-red-50 hover:bg-red-200 text-red-700 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1 focus-visible:ring-2 focus-visible:ring-red-300'
                    >
                      <TrashIcon className='h-4 w-4 mr-1' />
                      Tøm Handlekurven
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
