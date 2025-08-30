'use client'

import { Progress } from '@/components/ui/progress'
import Rating from './rating'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { ChevronDownIcon, Star, TrendingUp } from 'lucide-react'

type RatingSummaryProps = {
  asPopover?: boolean
  avgRating: number
  numReviews: number
  ratingDistribution: {
    rating: number
    count: number
  }[]
}

export default function RatingSummary({
  asPopover,
  avgRating = 0,
  numReviews = 0,
  ratingDistribution = [],
}: RatingSummaryProps) {
  const t = useTranslations()

  const RatingDistribution = () => {
    const ratingPercentageDistribution = ratingDistribution.map((x) => ({
      ...x,
      percentage: Math.round((x.count / numReviews) * 100),
    }))

    return (
      <div className='space-y-6'>
        {/* Header with overall rating */}
        <div className='text-center space-y-2'>
          <div className='flex items-center justify-center gap-2'>
            <Star className='w-8 h-8 fill-amber-400 text-amber-400' />
            <span className='text-4xl font-bold text-gray-900 dark:text-gray-100'>
              {avgRating.toFixed(1)}
            </span>
          </div>
          <div className='flex items-center justify-center'>
            <Rating rating={avgRating} />
          </div>
          <p className='text-gray-600 dark:text-gray-400'>
            {t('Product.numReviews ratings', { numReviews })}
          </p>
        </div>

        {/* Rating distribution bars */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2 mb-4'>
            <TrendingUp className='w-4 h-4 text-orange-600' />
            <h4 className='font-semibold text-gray-900 dark:text-gray-100'>
              Rating Breakdown
            </h4>
          </div>
          {ratingPercentageDistribution
            .sort((a, b) => b.rating - a.rating)
            .map(({ rating, percentage, count }) => (
              <div
                key={rating}
                className='grid grid-cols-[60px_1fr_40px_40px] gap-3 items-center group'
              >
                <div className='text-sm font-medium flex items-center gap-1'>
                  {rating}
                  <Star className='w-3 h-3 fill-amber-400 text-amber-400' />
                </div>
                <div className='relative'>
                  <Progress
                    value={percentage}
                    className='h-3 bg-gray-100 dark:bg-gray-700'
                  />
                  <div
                    className='absolute top-0 left-0 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500 group-hover:shadow-md'
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className='text-sm text-right font-medium text-gray-600 dark:text-gray-400'>
                  {percentage}%
                </div>
                <div className='text-xs text-right text-gray-500 dark:text-gray-500'>
                  ({count})
                </div>
              </div>
            ))}
        </div>

        {/* Quality indicators */}
        <div className='grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700'>
          <div className='text-center'>
            <div className='text-lg font-bold text-green-600'>
              {ratingPercentageDistribution
                .filter((x) => x.rating >= 4)
                .reduce((acc, curr) => acc + curr.percentage, 0)}
              %
            </div>
            <div className='text-xs text-gray-600 dark:text-gray-400'>
              Positive Reviews
            </div>
          </div>
          <div className='text-center'>
            <div className='text-lg font-bold text-orange-600'>
              {avgRating >= 4.5
                ? 'Excellent'
                : avgRating >= 4
                  ? 'Very Good'
                  : avgRating >= 3
                    ? 'Good'
                    : 'Fair'}
            </div>
            <div className='text-xs text-gray-600 dark:text-gray-400'>
              Overall Quality
            </div>
          </div>
        </div>
      </div>
    )
  }

  return asPopover ? (
    <div className='flex items-center gap-1'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            className='px-2 [&_svg]:size-6 text-base hover:bg-orange-50 dark:hover:bg-orange-950/30'
          >
            <span className='font-bold'>{avgRating.toFixed(1)}</span>
            <Rating rating={avgRating} />
            <ChevronDownIcon className='w-5 h-5 text-muted-foreground' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80 p-6' align='end'>
          <div className='flex flex-col gap-4'>
            <RatingDistribution />
            <Separator />
            <Link
              className='text-center text-orange-600 hover:text-orange-700 font-medium transition-colors'
              href='#reviews'
            >
              {t('Product.See customer reviews')}
            </Link>
          </div>
        </PopoverContent>
      </Popover>
      <div>
        <Link
          href='#reviews'
          className='text-orange-600 hover:text-orange-700 transition-colors'
        >
          {t('Product.numReviews ratings', { numReviews })}
        </Link>
      </div>
    </div>
  ) : (
    <RatingDistribution />
  )
}
