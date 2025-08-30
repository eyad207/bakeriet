'use client'
import useBrowsingHistory from '@/hooks/use-browsing-history'
import React, { useEffect } from 'react'
import ProductSlider from './product/product-slider'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '../ui/card'

export default function BrowsingHistoryList({}: { className?: string }) {
  const { products = [] } = useBrowsingHistory() // Ensure products is always an array
  const t = useTranslations('Home')
  const [relatedCount, setRelatedCount] = React.useState(0)
  const [historyCount, setHistoryCount] = React.useState(0)
  React.useEffect(() => {
    // Fetch both related and history lists to determine if anything should be shown
    const fetchCounts = async () => {
      const base = '/api/products/browsing-history'
      const params = `?excludeId=&categories=${products.map((p) => p.category).join(',')}&ids=${products.map((p) => p.id).join(',')}`
      const [relatedRes, historyRes] = await Promise.all([
        fetch(`${base}?type=related${params}`),
        fetch(`${base}?type=history${params}`),
      ])
      const relatedData = await relatedRes.json()
      const historyData = await historyRes.json()
      setRelatedCount(Array.isArray(relatedData) ? relatedData.length : 0)
      setHistoryCount(Array.isArray(historyData) ? historyData.length : 0)
    }
    fetchCounts()
  }, [products])

  if (relatedCount === 0 && historyCount === 0) return null

  return (
    <div className='mt-3 sm:mt-5 md:mt-10'>
      <Card className='w-full'>
        <CardContent className='p-3 sm:p-4 md:p-6'>
          <div className='space-y-6 md:space-y-10'>
            {relatedCount > 0 && (
              <ProductList
                title={t("Related to items that you've viewed")}
                type='related'
              />
            )}
            {historyCount > 0 && (
              <div className='border-t border-border/50 dark:border-zinc-700 pt-4 mt-4'>
                <ProductList
                  title={t('Your browsing history')}
                  hideDetails
                  type='history'
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProductList({
  title,
  type = 'history',
  excludeId = '',
  hideDetails = false,
}: {
  title: string
  type: 'history' | 'related'
  excludeId?: string
  hideDetails?: boolean
}) {
  const { products = [] } = useBrowsingHistory() // Ensure products is always an array
  const [data, setData] = React.useState([])
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `/api/products/browsing-history?type=${type}&excludeId=${excludeId}&categories=${products
          .map((product) => product.category)
          .join(',')}&ids=${products.map((product) => product.id).join(',')}`
      )
      const data = await res.json()
      setData(data)
    }
    fetchProducts()
  }, [excludeId, products, type])

  return (
    data.length > 0 && (
      <ProductSlider title={title} products={data} hideDetails={hideDetails} />
    )
  )
}
