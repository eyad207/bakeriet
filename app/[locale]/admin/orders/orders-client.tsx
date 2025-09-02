'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime } from '@/lib/utils'
import ProductPrice from '@/components/shared/product/product-price'
import FilterInput from './FilterInput'
import {
  ShoppingBag,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Calendar,
  CreditCard,
  Truck,
  User,
  Hash,
  AlertCircle,
  Search,
  Trash2,
  ExternalLink,
  BarChart3,
  Wifi,
  WifiOff,
  RefreshCw,
  CircleDot,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useOrdersStream } from '@/hooks/use-orders-stream'
import { useNewOrderSound } from '@/hooks/use-new-order-sound'
import { deleteAllOrders, deleteOrder } from '@/lib/actions/order.actions'

export default function OrdersClient() {
  const searchParams = useSearchParams()
  const page = searchParams?.get('page') || '1'
  const orderId = searchParams?.get('orderId') || ''
  const sort = searchParams?.get('sort') || 'createdAt'
  const order = searchParams?.get('order') || 'desc'

  const [streamEnabled, setStreamEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const { data, isConnected, isConnecting, error, lastUpdate, reconnect } =
    useOrdersStream({
      page,
      orderId,
      sort,
      order,
      enabled: streamEnabled,
    })

  // Enable sound notifications for new orders
  useNewOrderSound(data, { enabled: soundEnabled && streamEnabled })

  // Connection status indicator
  const connectionStatus = useMemo(() => {
    if (isConnecting)
      return { color: 'yellow', text: 'Connecting...', icon: RefreshCw }
    if (isConnected) return { color: 'green', text: 'Live', icon: CircleDot }
    if (error) return { color: 'red', text: 'Disconnected', icon: WifiOff }
    return { color: 'gray', text: 'Offline', icon: WifiOff }
  }, [isConnected, isConnecting, error])

  const toggleStream = () => {
    setStreamEnabled(!streamEnabled)
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  // Show loading state when no data is available yet
  if (!data && isConnecting) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6'>
        <div className='max-w-7xl mx-auto'>
          <Card className='relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl'>
            <CardContent className='p-16'>
              <div className='flex flex-col items-center gap-4'>
                <RefreshCw className='h-12 w-12 text-blue-500 animate-spin' />
                <h2 className='text-xl font-semibold text-slate-700 dark:text-slate-300'>
                  Loading orders...
                </h2>
                <p className='text-slate-500 dark:text-slate-400'>
                  Establishing real-time connection
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const orders = data?.orders || []
  const totalPages = data?.totalPages || 1
  const stats = data?.stats || {
    totalOrders: 0,
    paidOrders: 0,
    deliveredOrders: 0,
    newOrders: 0,
    totalRevenue: 0,
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Premium Header with Real-time Status */}
        <Card className='relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50'>
          <div className='absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20' />
          <CardHeader className='relative pb-8'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
              <div className='flex items-center gap-4'>
                <div className='p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-xl'>
                  <ShoppingBag className='h-8 w-8 text-white' />
                </div>
                <div>
                  <div className='flex items-center gap-3 mb-2'>
                    <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-100'>
                      Order Management
                    </h1>
                    {/* Real-time status indicator */}
                    <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-slate-700/50 border'>
                      <connectionStatus.icon
                        className={`h-3 w-3 ${
                          connectionStatus.color === 'green'
                            ? 'text-green-500 animate-pulse'
                            : connectionStatus.color === 'yellow'
                              ? 'text-yellow-500 animate-spin'
                              : connectionStatus.color === 'red'
                                ? 'text-red-500'
                                : 'text-gray-400'
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          connectionStatus.color === 'green'
                            ? 'text-green-600 dark:text-green-400'
                            : connectionStatus.color === 'yellow'
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : connectionStatus.color === 'red'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-500'
                        }`}
                      >
                        {connectionStatus.text}
                      </span>
                    </div>
                    {/* Sound status indicator */}
                    <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-slate-700/50 border'>
                      {soundEnabled ? (
                        <Volume2 className='h-3 w-3 text-blue-500' />
                      ) : (
                        <VolumeX className='h-3 w-3 text-gray-400' />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          soundEnabled
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500'
                        }`}
                      >
                        {soundEnabled ? 'Sound On' : 'Sound Off'}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400'>
                    <span>
                      Monitor and manage customer orders with real-time updates
                    </span>
                    {lastUpdate && (
                      <span className='text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded'>
                        Last update: {lastUpdate.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                {/* Stream toggle */}
                <Button
                  variant={streamEnabled ? 'default' : 'outline'}
                  onClick={toggleStream}
                  className='group flex items-center gap-2'
                >
                  {streamEnabled ? (
                    <Wifi className='h-4 w-4' />
                  ) : (
                    <WifiOff className='h-4 w-4' />
                  )}
                  {streamEnabled ? 'Live Updates' : 'Enable Live'}
                </Button>
                {/* Sound toggle */}
                <Button
                  variant={soundEnabled ? 'default' : 'outline'}
                  onClick={toggleSound}
                  className='group flex items-center gap-2'
                  disabled={!streamEnabled}
                  title={
                    !streamEnabled
                      ? 'Enable live updates to use sound notifications'
                      : soundEnabled
                        ? 'Disable sound notifications'
                        : 'Enable sound notifications'
                  }
                >
                  {soundEnabled ? (
                    <Volume2 className='h-4 w-4' />
                  ) : (
                    <VolumeX className='h-4 w-4' />
                  )}
                  Sound
                </Button>
                {/* Reconnect button */}
                {error && (
                  <Button
                    variant='outline'
                    onClick={reconnect}
                    className='flex items-center gap-2'
                  >
                    <RefreshCw className='h-4 w-4' />
                    Reconnect
                  </Button>
                )}
                {/* Delete all orders */}
                <form action={deleteAllOrders}>
                  <Button
                    variant='destructive'
                    type='submit'
                    className='group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-6 py-3 font-semibold rounded-xl'
                  >
                    <div className='absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
                    <div className='relative flex items-center gap-2'>
                      <Trash2 className='h-4 w-4' />
                      Delete All Orders
                    </div>
                  </Button>
                </form>
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className='mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                <div className='flex items-center gap-2 text-red-700 dark:text-red-400'>
                  <AlertCircle className='h-4 w-4' />
                  <span className='text-sm font-medium'>{error}</span>
                </div>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Premium Stats Dashboard */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
          <Card className='relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl shadow-blue-200/30 dark:shadow-slate-900/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20' />
            <CardContent className='relative p-6 text-center'>
              <div className='flex justify-center mb-3'>
                <div className='p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg'>
                  <BarChart3 className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1'>
                {stats.totalOrders}
              </div>
              <div className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Total Orders
              </div>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl shadow-green-200/30 dark:shadow-slate-900/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105'>
            <div className='absolute inset-0 bg-gradient-to-br from-green-50/80 to-green-100/80 dark:from-green-900/20 dark:to-green-800/20' />
            <CardContent className='relative p-6 text-center'>
              <div className='flex justify-center mb-3'>
                <div className='p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg'>
                  <CreditCard className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='text-3xl font-bold text-green-600 dark:text-green-400 mb-1'>
                {stats.paidOrders}
              </div>
              <div className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Paid Orders
              </div>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl shadow-purple-200/30 dark:shadow-slate-900/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105'>
            <div className='absolute inset-0 bg-gradient-to-br from-purple-50/80 to-purple-100/80 dark:from-purple-900/20 dark:to-purple-800/20' />
            <CardContent className='relative p-6 text-center'>
              <div className='flex justify-center mb-3'>
                <div className='p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg'>
                  <Truck className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1'>
                {stats.deliveredOrders}
              </div>
              <div className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Delivered
              </div>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl shadow-orange-200/30 dark:shadow-slate-900/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105'>
            <div className='absolute inset-0 bg-gradient-to-br from-orange-50/80 to-orange-100/80 dark:from-orange-900/20 dark:to-orange-800/20' />
            <CardContent className='relative p-6 text-center'>
              <div className='flex justify-center mb-3'>
                <div className='p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg'>
                  <AlertCircle className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1'>
                {stats.newOrders}
              </div>
              <div className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                New Orders
              </div>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl shadow-emerald-200/30 dark:shadow-slate-900/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105'>
            <div className='absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-emerald-100/80 dark:from-emerald-900/20 dark:to-emerald-800/20' />
            <CardContent className='relative p-6 text-center'>
              <div className='flex justify-center mb-3'>
                <div className='p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg'>
                  <DollarSign className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1'>
                <ProductPrice price={stats.totalRevenue} plain />
              </div>
              <div className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Total Revenue
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filter Section */}
        <Card className='relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50'>
          <div className='absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50' />
          <CardContent className='relative p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg shadow-md'>
                <Search className='h-5 w-5 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-100'>
                Order Filters
              </h3>
            </div>
            <FilterInput defaultValue={orderId} />
          </CardContent>
        </Card>

        {/* Premium Orders Table */}
        <Card className='relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50'>
          <div className='absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50' />
          <CardHeader className='relative pb-6'>
            <div className='flex items-center gap-3'>
              <div className='p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg'>
                <Package className='h-6 w-6 text-white' />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                  Orders Overview
                </h2>
                <p className='text-slate-600 dark:text-slate-400'>
                  Real-time order management with automatic updates
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className='relative p-0'>
            {orders.length === 0 ? (
              <div className='text-center py-16'>
                <div className='flex flex-col items-center gap-4'>
                  <ShoppingBag className='h-16 w-16 text-slate-300 dark:text-slate-600' />
                  <div>
                    <h3 className='text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2'>
                      No orders found
                    </h3>
                    <p className='text-slate-500 dark:text-slate-400'>
                      Try adjusting your search criteria or check back later
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow className='border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-700/80'>
                      <TableHead className='px-6 py-5 font-bold text-slate-800 dark:text-slate-200'>
                        <Link
                          href={{
                            pathname: '/admin/orders',
                            query: {
                              page,
                              orderId,
                              sort: '_id',
                              order:
                                sort === '_id' && order === 'asc'
                                  ? 'desc'
                                  : 'asc',
                            },
                          }}
                          className='flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                        >
                          <Hash className='h-4 w-4' />
                          Order ID
                          {sort === '_id' && (
                            <span className='text-blue-600 dark:text-blue-400'>
                              {order === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </Link>
                      </TableHead>
                      <TableHead className='px-6 py-5 font-bold text-slate-800 dark:text-slate-200'>
                        <Link
                          href={{
                            pathname: '/admin/orders',
                            query: {
                              page,
                              orderId,
                              sort: 'createdAt',
                              order:
                                sort === 'createdAt' && order === 'asc'
                                  ? 'desc'
                                  : 'asc',
                            },
                          }}
                          className='flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                        >
                          <Calendar className='h-4 w-4' />
                          Date
                          {sort === 'createdAt' && (
                            <span className='text-blue-600 dark:text-blue-400'>
                              {order === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </Link>
                      </TableHead>
                      <TableHead className='px-6 py-5 font-bold text-slate-800 dark:text-slate-200'>
                        <div className='flex items-center gap-2'>
                          <User className='h-4 w-4' />
                          Customer
                        </div>
                      </TableHead>
                      <TableHead className='px-6 py-5 font-bold text-slate-800 dark:text-slate-200'>
                        <Link
                          href={{
                            pathname: '/admin/orders',
                            query: {
                              page,
                              orderId,
                              sort: 'totalPrice',
                              order:
                                sort === 'totalPrice' && order === 'asc'
                                  ? 'desc'
                                  : 'asc',
                            },
                          }}
                          className='flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                        >
                          <DollarSign className='h-4 w-4' />
                          Total
                          {sort === 'totalPrice' && (
                            <span className='text-blue-600 dark:text-blue-400'>
                              {order === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </Link>
                      </TableHead>
                      <TableHead className='px-6 py-5 font-bold text-slate-800 dark:text-slate-200'>
                        <div className='flex items-center gap-2'>
                          <CreditCard className='h-4 w-4' />
                          Payment
                        </div>
                      </TableHead>
                      <TableHead className='px-6 py-5 font-bold text-slate-800 dark:text-slate-200'>
                        <Link
                          href={{
                            pathname: '/admin/orders',
                            query: {
                              page,
                              orderId,
                              sort: 'isPaid',
                              order:
                                sort === 'isPaid' && order === 'asc'
                                  ? 'desc'
                                  : 'asc',
                            },
                          }}
                          className='flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                        >
                          <CheckCircle className='h-4 w-4' />
                          Paid
                          {sort === 'isPaid' && (
                            <span className='text-blue-600 dark:text-blue-400'>
                              {order === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </Link>
                      </TableHead>
                      <TableHead className='px-6 py-5 font-bold text-slate-800 dark:text-slate-200'>
                        <Link
                          href={{
                            pathname: '/admin/orders',
                            query: {
                              page,
                              orderId,
                              sort: 'isDelivered',
                              order:
                                sort === 'isDelivered' && order === 'asc'
                                  ? 'desc'
                                  : 'asc',
                            },
                          }}
                          className='flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                        >
                          <Truck className='h-4 w-4' />
                          Delivered
                          {sort === 'isDelivered' && (
                            <span className='text-blue-600 dark:text-blue-400'>
                              {order === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </Link>
                      </TableHead>
                      <TableHead className='px-6 py-5 font-bold text-slate-800 dark:text-slate-200'>
                        <div className='flex items-center gap-2'>
                          <Eye className='h-4 w-4' />
                          Status
                        </div>
                      </TableHead>
                      <TableHead className='px-6 py-5 font-bold text-slate-800 dark:text-slate-200'>
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order._id}
                        className='border-b border-slate-100/60 dark:border-slate-700/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-200'
                      >
                        <TableCell className='px-6 py-5'>
                          <div className='flex items-center gap-3'>
                            <div className='p-2 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg'>
                              <Hash className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                            </div>
                            <div>
                              <Link
                                href={`/admin/orders/${order._id}`}
                                className='font-mono text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors'
                              >
                                ...{order._id.slice(-6)}
                              </Link>
                              {!order.viewed && (
                                <Badge className='ml-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5'>
                                  NEW
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='px-6 py-5'>
                          <div className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                            <Clock className='h-4 w-4' />
                            <span className='text-sm'>
                              {formatDateTime(order.createdAt).dateTime}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='px-6 py-5'>
                          <div className='flex items-center gap-3'>
                            <div className='p-2 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg'>
                              <User className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                            </div>
                            <span className='font-medium text-slate-900 dark:text-slate-100'>
                              {order.user?.name || 'Unknown'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='px-6 py-5'>
                          <div className='font-bold text-emerald-600 dark:text-emerald-400'>
                            <ProductPrice price={order.totalPrice} plain />
                          </div>
                        </TableCell>
                        <TableCell className='px-6 py-5'>
                          <Badge
                            variant='outline'
                            className='bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          >
                            {order.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell className='px-6 py-5'>
                          <div className='flex items-center gap-2'>
                            {order.isPaid ? (
                              <>
                                <CheckCircle className='h-4 w-4 text-green-500' />
                                <span className='text-sm font-medium text-green-600 dark:text-green-400'>
                                  Paid
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className='h-4 w-4 text-red-500' />
                                <span className='text-sm font-medium text-red-600 dark:text-red-400'>
                                  Pending
                                </span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='px-6 py-5'>
                          <div className='flex items-center gap-2'>
                            {order.isDelivered ? (
                              <>
                                <Truck className='h-4 w-4 text-green-500' />
                                <span className='text-sm font-medium text-green-600 dark:text-green-400'>
                                  Delivered
                                </span>
                              </>
                            ) : (
                              <>
                                <Clock className='h-4 w-4 text-orange-500' />
                                <span className='text-sm font-medium text-orange-600 dark:text-orange-400'>
                                  Processing
                                </span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='px-6 py-5'>
                          <div className='flex items-center gap-2'>
                            {order.viewed ? (
                              <>
                                <Eye className='h-4 w-4 text-blue-500' />
                                <span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                                  Viewed
                                </span>
                              </>
                            ) : (
                              <>
                                <EyeOff className='h-4 w-4 text-gray-500' />
                                <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                                  New
                                </span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='px-6 py-5'>
                          <div className='flex items-center gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              asChild
                              className='hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-colors'
                            >
                              <Link href={`/admin/orders/${order._id}`}>
                                <ExternalLink className='h-4 w-4 mr-1' />
                                View
                              </Link>
                            </Button>
                            <DeleteDialog id={order._id} action={deleteOrder} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <Card className='relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50'>
            <div className='absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50' />
            <CardContent className='relative p-6'>
              <Pagination page={page} totalPages={totalPages} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
