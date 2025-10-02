import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Skeleton loader for product cards
 */
export function ProductCardSkeleton() {
  return (
    <div className='animate-pulse bg-background rounded-lg border p-4'>
      <div className='bg-muted h-48 rounded-lg mb-4'></div>
      <div className='bg-muted h-4 rounded w-3/4 mb-2'></div>
      <div className='bg-muted h-4 rounded w-1/2 mb-4'></div>
      <div className='bg-muted h-8 rounded w-full'></div>
    </div>
  )
}

/**
 * Skeleton loader for category/product grid cards
 */
export function HomeCardSkeleton() {
  return (
    <Card className='w-full'>
      <CardContent className='p-4'>
        <div className='animate-pulse'>
          <div className='bg-muted h-6 rounded w-1/3 mb-4'></div>
          <div className='grid grid-cols-2 gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className='space-y-2'>
                <div className='bg-muted h-32 rounded-lg'></div>
                <div className='bg-muted h-4 rounded w-2/3'></div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton loader for product slider sections
 */
export function ProductSliderSkeleton() {
  return (
    <Card className='w-full'>
      <CardContent className='p-4'>
        <div className='animate-pulse'>
          <div className='bg-muted h-6 rounded w-1/4 mb-4'></div>
          <div className='flex gap-4 overflow-hidden'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className='flex-shrink-0 w-48 space-y-2'>
                <div className='bg-muted h-48 rounded-lg'></div>
                <div className='bg-muted h-4 rounded w-3/4'></div>
                <div className='bg-muted h-4 rounded w-1/2'></div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Full page skeleton for initial load
 */
export function HomePageSkeleton() {
  return (
    <div className='pb-4 sm:pb-6'>
      {/* Carousel skeleton */}
      <div className='animate-pulse bg-muted h-64 md:h-96 mb-4'></div>

      <div className='px-2 sm:px-3 md:p-4 space-y-3 md:space-y-4 bg-border'>
        {/* Categories card skeleton */}
        <div className='pt-3 sm:pt-4'>
          <HomeCardSkeleton />
        </div>

        {/* Tag sections skeleton */}
        {Array.from({ length: 3 }).map((_, index) => (
          <ProductSliderSkeleton key={index} />
        ))}
      </div>

      {/* Browsing history skeleton */}
      <div className='px-2 sm:px-3 md:p-4 bg-border mt-4'>
        <div className='animate-pulse bg-muted h-6 rounded w-1/4 mb-4'></div>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
