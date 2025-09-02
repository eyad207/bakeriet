'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { IOrderList } from '@/types'

export interface OrderStats {
  totalOrders: number
  paidOrders: number
  deliveredOrders: number
  newOrders: number
  totalRevenue: number
}

export interface OrdersData {
  orders: IOrderList[]
  totalPages: number
  stats: OrderStats
  timestamp: string
}

export interface UseOrdersStreamOptions {
  page?: string
  orderId?: string
  sort?: string
  order?: string
  enabled?: boolean
}

export function useOrdersStream(options: UseOrdersStreamOptions = {}) {
  const {
    page = '1',
    orderId = '',
    sort = 'createdAt',
    order = 'desc',
    enabled = true,
  } = options

  const [data, setData] = useState<OrdersData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    if (!enabled || eventSourceRef.current?.readyState === EventSource.OPEN) {
      return
    }

    setIsConnecting(true)
    setError(null)

    // Build URL with search params
    const params = new URLSearchParams({
      page,
      orderId,
      sort,
      order,
    })

    const url = `/api/admin/orders/stream?${params.toString()}`

    try {
      const eventSource = new EventSource(url)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setIsConnected(true)
        setIsConnecting(false)
        setError(null)
        reconnectAttemptsRef.current = 0
        console.log('Orders stream connected')
      }

      eventSource.onmessage = (event) => {
        try {
          const ordersData: OrdersData = JSON.parse(event.data)
          setData(ordersData)
          setLastUpdate(new Date())
        } catch (err) {
          console.error('Error parsing orders data:', err)
          setError('Failed to parse orders data')
        }
      }

      eventSource.onerror = () => {
        setIsConnected(false)
        setIsConnecting(false)

        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttemptsRef.current),
            30000
          )
          setError(`Connection lost. Reconnecting in ${delay / 1000}s...`)

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++
            connect()
          }, delay)
        } else {
          setError('Connection failed. Please refresh the page.')
        }
      }

      // Handle custom error events
      eventSource.addEventListener('error', (event) => {
        try {
          const errorData = JSON.parse((event as MessageEvent).data)
          setError(errorData.error || 'An error occurred')
        } catch {
          // Ignore parsing errors for generic error events
        }
      })
    } catch (err) {
      setIsConnecting(false)
      setError('Failed to establish connection')
      console.error('Error creating EventSource:', err)
    }
  }, [enabled, page, orderId, sort, order])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    setIsConnected(false)
    setIsConnecting(false)
  }, [])

  const reconnect = useCallback(() => {
    disconnect()
    reconnectAttemptsRef.current = 0
    setError(null)
    connect()
  }, [disconnect, connect])

  // Connect on mount and when params change
  useEffect(() => {
    if (enabled) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    data,
    isConnected,
    isConnecting,
    error,
    lastUpdate,
    reconnect,
    disconnect,
  }
}
