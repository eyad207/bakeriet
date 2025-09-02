'use client'

import { useEffect, useRef } from 'react'
import { useSoundNotification } from './use-sound-notification'
import { OrdersData } from './use-orders-stream'

export interface UseNewOrderSoundOptions {
  enabled?: boolean
  volume?: number
}

export function useNewOrderSound(
  data: OrdersData | null,
  options: UseNewOrderSoundOptions = {}
) {
  const { enabled = true, volume = 0.7 } = options

  const previousOrderCountRef = useRef<number | null>(null)
  const previousTimestampRef = useRef<string | null>(null)
  const { playSound, canPlay } = useSoundNotification({
    enabled,
    volume,
    soundUrl: '/sounds/notification.mp3', // Will fallback to generated sound if file doesn't exist
  })

  useEffect(() => {
    if (!data || !enabled || !canPlay) return

    const currentOrderCount = data.stats.totalOrders
    const currentTimestamp = data.timestamp

    // If this is the first time we're getting data, just store the count and timestamp
    if (
      previousOrderCountRef.current === null ||
      previousTimestampRef.current === null
    ) {
      previousOrderCountRef.current = currentOrderCount
      previousTimestampRef.current = currentTimestamp
      return
    }

    // Check if order count has increased
    const orderCountIncreased =
      currentOrderCount > previousOrderCountRef.current

    // Also check if we have a newer timestamp (data has been updated)
    const dataIsNewer = currentTimestamp !== previousTimestampRef.current

    if (orderCountIncreased && dataIsNewer) {
      playSound()
    }

    // Update the previous values
    previousOrderCountRef.current = currentOrderCount
    previousTimestampRef.current = currentTimestamp
  }, [data, enabled, canPlay, playSound])

  // Reset the counters when data becomes null (e.g., on disconnect)
  useEffect(() => {
    if (!data) {
      previousOrderCountRef.current = null
      previousTimestampRef.current = null
    }
  }, [data])
}
