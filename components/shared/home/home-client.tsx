'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { HomeCard } from '@/components/shared/home/home-card'
import { HomeCarousel } from '@/components/shared/home/home-carousel'
import ProductSlider from '@/components/shared/product/product-slider'
import { Card, CardContent } from '@/components/ui/card'
import { ProductSliderSkeleton, HomeCardSkeleton } from './home-skeleton'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import InfiniteProductList from '@/components/shared/infinite-product-list'
import { useTranslations } from 'next-intl'
import { ICarousel } from '@/types'
import { IProduct } from '@/lib/db/models/product.model'

interface Tag {
  _id: string
  name: string
}

interface Category {
  name: string
  image: string
}

interface HomeClientProps {
  carousels: ICarousel[]
}

/**
 * Client-side progressive loading component for homepage
 * Implements staggered loading for optimal perceived performance
 */
export function HomeClient({ carousels }: HomeClientProps) {
  const t = useTranslations('Home')
  const [tags, setTags] = useState<Tag[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tagProducts, setTagProducts] = useState<
    Map<string, { products: IProduct[]; isLoading: boolean }>
  >(new Map())
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)

  // Memoize the function to avoid recreating it
  const loadTagProductsStaggered = useCallback(async () => {
    // Only load first 6 tags for performance
    const tagsToLoad = tags.slice(0, 6)

    for (let i = 0; i < tagsToLoad.length; i++) {
      const tag = tagsToLoad[i]

      // Set loading state
      setTagProducts((prev) => {
        const newMap = new Map(prev)
        newMap.set(tag._id, { products: [], isLoading: true })
        return newMap
      })

      // Stagger requests to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, i * 200))

      try {
        const response = await fetch(
          `/api/products/home?type=tag-products&tagId=${tag._id}&limit=4`
        )
        const data = await response.json()

        if (data.success) {
          setTagProducts((prev) => {
            const newMap = new Map(prev)
            newMap.set(tag._id, { products: data.data, isLoading: false })
            return newMap
          })
        }
      } catch (error) {
        console.error(`Failed to load products for tag ${tag.name}:`, error)
        setTagProducts((prev) => {
          const newMap = new Map(prev)
          newMap.set(tag._id, { products: [], isLoading: false })
          return newMap
        })
      }
    }
  }, [tags])

  // Load tags and categories first
  useEffect(() => {
    loadInitialData()
  }, [])

  // Load products for each tag progressively
  useEffect(() => {
    if (tags.length > 0) {
      loadTagProductsStaggered()
    }
  }, [tags, loadTagProductsStaggered])

  async function loadInitialData() {
    try {
      setIsLoadingInitial(true)

      // Load tags and categories in parallel
      const [tagsRes, categoriesRes] = await Promise.all([
        fetch('/api/products/home?type=tags'),
        fetch('/api/products/home?type=categories&limit=4'),
      ])

      const [tagsData, categoriesData] = await Promise.all([
        tagsRes.json(),
        categoriesRes.json(),
      ])

      if (tagsData.success) {
        setTags(tagsData.data)
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data)
      }
    } catch (error) {
      console.error('Failed to load initial data:', error)
    } finally {
      setIsLoadingInitial(false)
    }
  }

  // Build cards for HomeCard component
  const cards = [
    {
      title: t('Categories to explore'),
      link: {
        text: t('See More'),
        href: '/search',
      },
      items: categories.map((category) => ({
        name: category.name,
        image: category.image,
        href: `/search?category=${category.name}&q=all`,
        className: 'transition-transform duration-300 hover:scale-105',
      })),
    },
  ]

  return (
    <div className='pb-4 sm:pb-6'>
      {/* Carousel - loads immediately */}
      <HomeCarousel items={carousels} />

      <div className='px-2 sm:px-3 md:p-4 space-y-3 md:space-y-4 bg-border'>
        {/* Categories section */}
        <div className='pt-3 sm:pt-4'>
          {isLoadingInitial ? (
            <HomeCardSkeleton />
          ) : (
            <div
              className='animate-fade-in-up'
              style={{ animationDelay: '0.1s' }}
            >
              <HomeCard cards={cards} />
            </div>
          )}
        </div>

        {/* Tag sections - load progressively */}
        {tags.slice(0, 6).map((tag, index) => {
          const tagData = tagProducts.get(tag._id)
          const isLoading = !tagData || tagData.isLoading
          const products = tagData?.products || []

          return (
            <div
              key={tag._id}
              className='animate-fade-in-up'
              style={{ animationDelay: `${0.2 + index * 0.15}s` }}
            >
              {isLoading ? (
                <ProductSliderSkeleton />
              ) : products.length > 0 ? (
                <Card className='w-full'>
                  <CardContent className='p-2 sm:p-3 md:p-4 items-center gap-3'>
                    <ProductSlider title={tag.name} products={products} />
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )
        })}
      </div>

      {/* Browsing history */}
      <div className='px-2 sm:px-3 md:p-4 bg-border'>
        <BrowsingHistoryList />
      </div>

      {/* Infinite product list */}
      <div className='px-2 sm:px-3 md:p-4 bg-border'>
        <h2 className='font-bold text-xl py-4'>{t('See More')}</h2>
        <InfiniteProductList />
      </div>
    </div>
  )
}
