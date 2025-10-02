import React from 'react'
import { getSetting } from '@/lib/actions/setting.actions'
import { HomeClient } from '@/components/shared/home/home-client'

/**
 * Optimized Home Page with Progressive Loading
 *
 * Key improvements:
 * 1. Static page shell loads instantly (no blocking database queries)
 * 2. Only carousel data fetched server-side (small, fast query)
 * 3. All product data loads client-side with staggered progressive loading
 * 4. Smooth animations as content appears
 * 5. Aggressive caching with revalidation
 */

// Optimize cache configuration for instant static page delivery
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const revalidate = 3600 // revalidate every hour - carousels don't change often

export default async function HomePage() {
  // Only fetch carousel data server-side - this is fast and small
  const { carousels } = await getSetting()

  return <HomeClient carousels={carousels} />
}
