import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { IProduct } from '@/lib/db/models/product.model'

import { formatNumber, generateId, round2, cn } from '@/lib/utils'
import { formatPrice } from '@/lib/currency'
import ProductPrice from './product-price'
import ImageHover from './image-hover'
import AddToCart from './add-to-cart'
import { useTranslations } from 'next-intl'
import { Clock, Users, Flame, Star, ChefHat } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
  className,
  hideAddToCartButton = false, // New prop to conditionally hide add to cart button
  hideBrandOnMobile = false, // New prop to conditionally hide brand name on mobile
  isInInfiniteList = false, // New prop to conditionally style for infinite list
}: {
  product: IProduct
  hideDetails?: boolean
  hideBorder?: boolean
  hideAddToCart?: boolean
  className?: string
  hideAddToCartButton?: boolean // New prop to conditionally hide add to cart button
  hideBrandOnMobile?: boolean // New prop to conditionally hide brand name on mobile
  isInInfiniteList?: boolean // New prop to conditionally style for infinite list
}) => {
  const ProductImage = () => (
    <div
      className={cn(
        'relative group overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-zinc-800 dark:to-zinc-700',
        {
          'h-48 sm:h-64': isInInfiniteList,
          'h-56 sm:h-72': !isInInfiniteList,
        }
      )}
    >
      {/* Restaurant-style image presentation */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10' />

      {/* Food type badge */}
      <div className='absolute top-3 left-3 z-20'>
        <Badge
          variant='secondary'
          className='bg-white/90 backdrop-blur-sm text-orange-600 font-medium text-xs px-2 py-1 shadow-sm border-orange-200'
        >
          <ChefHat className='w-3 h-3 mr-1' />
          {product.category}
        </Badge>
      </div>

      {product.images.length > 1 ? (
        <ImageHover
          src={product.images[0]}
          hoverSrc={product.images[1]}
          alt={`${product.name} - ${product.brand} dish with hover view${product.description ? ', ' + product.description.substring(0, 50) + '...' : ''}`}
        />
      ) : (
        <div className='relative w-full h-full'>
          <Image
            src={product.images[0]}
            alt={`${product.name} - ${product.brand} delicious dish${product.description ? ', ' + product.description.substring(0, 50) + '...' : ''}`}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='object-cover transition-transform duration-700 group-hover:scale-110'
            priority={false}
          />
        </div>
      )}

      {/* Serving size indicator */}
      <div className='absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500'>
        <Badge
          variant='secondary'
          className='bg-white/90 backdrop-blur-sm text-gray-700 font-medium text-xs px-2 py-1 shadow-sm'
        >
          <Users className='w-3 h-3 mr-1' />
          {product.colors[0]?.sizes[0]?.size || 'Single Serving'}
        </Badge>
      </div>
    </div>
  )

  const discountedPrice = product.discountedPrice ?? undefined

  const ProductDetails = () => {
    const tags = product?.tags || []

    return (
      <div className='space-y-3 flex flex-col h-full'>
        {/* Restaurant/Brand name - smaller, elegant */}
        <p
          className={cn(
            'text-sm font-medium text-orange-600 dark:text-orange-400 tracking-wide',
            {
              'hidden sm:block': hideBrandOnMobile,
            }
          )}
        >
          {product.brand}
        </p>

        {/* Dish name - prominent, appetizing */}
        <h3
          className='text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-300 cursor-pointer'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </h3>

        {/* Description for restaurant items */}
        {product.description && (
          <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 flex-grow'>
            {product.description}
          </p>
        )}

        {/* Rating and reviews - restaurant style */}
        <div
          className={cn('flex items-center gap-3 justify-between', {
            'hidden sm:flex': isInInfiniteList,
          })}
        >
          <div className='flex items-center gap-1'>
            <div className='flex items-center'>
              <Star className='w-4 h-4 fill-amber-400 text-amber-400' />
              <span className='font-semibold text-gray-900 dark:text-gray-100 ml-1'>
                {product.avgRating.toFixed(1)}
              </span>
            </div>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              ({formatNumber(product.numReviews)})
            </span>
          </div>

          {/* Preparation time indicator */}
          <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400'>
            <Clock className='w-4 h-4' />
            <span>15-20 min</span>
          </div>
        </div>

        {/* Price section - restaurant style */}
        <div className='mt-auto pt-2 border-t border-gray-100 dark:border-gray-700'>
          <ProductPrice
            isDeal={tags.includes('todays-deal')}
            price={product.price}
            discountedPrice={discountedPrice}
            forListing
          />
        </div>
      </div>
    )
  }

  const AddButton = () => (
    <div className='w-full space-y-2'>
      {/* Restaurant-style order button */}
      <AddToCart
        minimal
        item={{
          clientId: generateId(),
          product: product._id,
          size: product.colors[0]?.sizes[0]?.size,
          color: product.colors[0]?.color,
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: round2(product.price),
          discountedPrice: product.discountedPrice
            ? round2(product.discountedPrice)
            : undefined,
          discount: product.discount || undefined,
          quantity: 1,
          image: product.images[0],
          colors: product.colors,
        }}
        selectedSize={product.colors[0]?.sizes[0]?.size}
      />

      {/* Quick order info */}
      <div className='flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400'>
        <span className='flex items-center gap-1'>
          <Clock className='w-3 h-3' />
          Ready in 15-20 min
        </span>
        <span className='flex items-center gap-1'>
          <Users className='w-3 h-3' />
          Serves{' '}
          {product.colors[0]?.sizes[0]?.size?.includes('Family')
            ? '4-5'
            : product.colors[0]?.sizes[0]?.size?.includes('Sharing')
              ? '2-3'
              : '1'}
        </span>
      </div>
    </div>
  )

  const discountPercent = product.discount ? Math.round(product.discount) : null
  const t = useTranslations()

  return hideBorder ? (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        'group flex flex-col h-full cursor-pointer bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-800',
        className,
        {
          'hover:bg-orange-50 dark:hover:bg-zinc-800': isInInfiniteList,
          'hover:-translate-y-1': !isInInfiniteList,
        }
      )}
      aria-label={`View ${product.name} by ${product.brand} - ${formatPrice(product.discountedPrice ?? product.price)} ${product.discount ? `(${product.discount}% off)` : ''}`}
    >
      <ProductImage />
      {!hideDetails && (
        <>
          <div
            className={cn('flex-1 p-4', {
              'p-3 sm:p-4': isInInfiniteList,
              'p-4 sm:p-6': !isInInfiniteList,
            })}
          >
            <ProductDetails />
          </div>
          {!hideAddToCart && !hideAddToCartButton && (
            <div className='p-4 pt-0 sm:p-6 sm:pt-0'>
              <AddButton />
            </div>
          )}
        </>
      )}

      {/* Enhanced discount badge for restaurants */}
      {discountPercent && (
        <div className='absolute top-4 right-4 z-30'>
          <div className='bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg'>
            <span className='flex items-center gap-1'>
              <Flame className='w-3 h-3' />
              {discountPercent}% OFF
            </span>
          </div>
        </div>
      )}
    </Link>
  ) : (
    <Link
      href={`/product/${product.slug}`}
      aria-label={`View ${product.name} by ${product.brand} - ${formatPrice(product.discountedPrice ?? product.price)} ${product.discount ? `(${product.discount}% off)` : ''}`}
    >
      <Card
        className={cn(
          'group flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-900 hover:shadow-xl transition-all duration-500 border-2 border-gray-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-800 rounded-2xl',
          className,
          {
            'hover:bg-orange-50 dark:hover:bg-zinc-800': isInInfiniteList,
            'hover:-translate-y-1 hover:shadow-2xl': !isInInfiniteList,
          }
        )}
      >
        <CardHeader className='p-0 relative'>
          <ProductImage />
        </CardHeader>
        {!hideDetails && (
          <>
            <CardContent
              className={cn('flex-1', {
                'p-3 sm:p-4': isInInfiniteList,
                'p-4 sm:p-6': !isInInfiniteList,
              })}
            >
              <ProductDetails />
            </CardContent>
            {!hideAddToCart && !hideAddToCartButton && (
              <CardFooter
                className={cn(
                  'border-t border-gray-100 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50 group-hover:border-orange-100 dark:group-hover:border-orange-900/50 transition-colors duration-500',
                  {
                    'p-3 sm:p-4': isInInfiniteList,
                    'p-4 sm:p-6': !isInInfiniteList,
                  }
                )}
              >
                <AddButton />
              </CardFooter>
            )}
          </>
        )}

        {/* Enhanced discount badge for restaurants */}
        {discountPercent && (
          <div className='absolute top-4 right-4 z-30'>
            <div className='bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg animate-pulse'>
              <span className='flex items-center gap-1'>
                <Flame className='w-3 h-3' />
                {discountPercent}% {t('Product.OFF')}
              </span>
            </div>
          </div>
        )}
      </Card>
    </Link>
  )
}

export default ProductCard
