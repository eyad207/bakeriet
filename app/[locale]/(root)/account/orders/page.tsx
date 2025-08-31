import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, PackageCheckIcon } from 'lucide-react'
import Image from 'next/image'

import Pagination from '@/components/shared/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getMyOrders } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/db/models/order.model'
import { Badge } from '@/components/ui/badge'
import { formatDateTime, formatId } from '@/lib/utils'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Your Orders',
}

export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>
}) {
  const t = await getTranslations() // Initialize translations
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1
  const orders = await getMyOrders({
    page,
  })

  // Function to get status badge style
  const getStatusBadge = (
    isPaid: boolean,
    isDelivered: boolean,
    isShipped: boolean
  ) => {
    if (isDelivered) {
      return {
        text: t('Orders.Delivered'), // Translate status
        variant:
          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      }
    }
    if (isShipped) {
      return {
        text: t('Orders.Shipped'), // Translate status
        variant:
          'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      }
    }
    if (isPaid) {
      return {
        text: t('Orders.Processing'), // Translate status
        variant:
          'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      }
    }
    return {
      text: t('Orders.Pending'), // Translate status
      variant:
        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
    }
  }

  return (
    <div className='space-y-8'>
      {/* Breadcrumb navigation */}
      <div className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400'>
        <Link
          href='/account'
          className='hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 font-medium'
        >
          {t('Account.Your Account')}
        </Link>
        <ChevronRight className='h-4 w-4' />
        <span className='text-gray-900 dark:text-white font-semibold'>
          {t('Orders.Your Orders')}
        </span>
      </div>

      {/* Header */}
      <div className='bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-3xl p-8 border border-orange-200/50 dark:border-orange-700/50'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-2xl'>
            <PackageCheckIcon className='w-8 h-8 text-orange-600 dark:text-orange-400' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
              {t('Orders.Your Orders')}
            </h1>
            <p className='text-lg text-orange-700 dark:text-orange-300'>
              Track and manage your order history
            </p>
          </div>
        </div>
      </div>

      {orders.data.length === 0 ? (
        <Card className='p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 border-2 border-dashed border-gray-300 dark:border-zinc-600'>
          <div className='flex flex-col items-center gap-4'>
            <div className='flex items-center justify-center w-20 h-20 bg-gray-200 dark:bg-zinc-700 rounded-full'>
              <PackageCheckIcon className='w-10 h-10 text-gray-400 dark:text-zinc-500' />
            </div>
            <div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                {t('Orders.NoOrdersYet')}
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                Start exploring our delicious bakery items
              </p>
            </div>
            <Link
              href='/search'
              className={cn(
                buttonVariants(),
                'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
              )}
            >
              {t('Orders.StartShopping')}
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {/* Desktop table view */}
          <div className='hidden md:block bg-white dark:bg-zinc-800/50 rounded-3xl border border-gray-200 dark:border-zinc-700 shadow-lg overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow className='bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-b border-orange-200 dark:border-orange-700'>
                  <TableHead className='w-[120px] font-bold text-gray-900 dark:text-white'>
                    {t('Orders.Order ID')}
                  </TableHead>
                  <TableHead className='font-bold text-gray-900 dark:text-white'>
                    {t('Orders.Date')}
                  </TableHead>
                  <TableHead className='font-bold text-gray-900 dark:text-white'>
                    {t('Orders.Total')}
                  </TableHead>
                  <TableHead className='font-bold text-gray-900 dark:text-white'>
                    {t('Orders.Status')}
                  </TableHead>
                  <TableHead className='text-right font-bold text-gray-900 dark:text-white'>
                    {t('Orders.Actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.map((order: IOrder) => (
                  <TableRow
                    key={order._id}
                    className='hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors duration-200 border-b border-gray-100 dark:border-zinc-700'
                  >
                    <TableCell className='font-bold text-gray-900 dark:text-white'>
                      #{formatId(order._id)}
                    </TableCell>
                    <TableCell className='text-gray-700 dark:text-gray-300'>
                      {formatDateTime(order.createdAt!).dateOnly}
                    </TableCell>
                    <TableCell className='font-semibold text-gray-900 dark:text-white'>
                      <ProductPrice price={order.totalPrice} plain />
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'font-semibold px-3 py-1 rounded-full',
                          getStatusBadge(
                            order.isPaid,
                            order.isDelivered,
                            order.isShipped || false
                          ).variant
                        )}
                      >
                        {
                          getStatusBadge(
                            order.isPaid,
                            order.isDelivered,
                            order.isShipped || false
                          ).text
                        }
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Link
                        href={`/account/orders/${order._id}`}
                        className={cn(
                          buttonVariants({ size: 'sm', variant: 'outline' }),
                          'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 font-semibold px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg'
                        )}
                      >
                        {t('Orders.ViewDetails')}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card view - improved design */}
          <div className='md:hidden space-y-6'>
            {orders.data.map((order: IOrder) => (
              <Card
                key={order._id}
                className='overflow-hidden bg-white dark:bg-zinc-800/50 border-2 border-gray-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] rounded-2xl'
              >
                {/* Order header with status */}
                <div className='p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-b border-orange-200 dark:border-orange-700'>
                  <div className='flex items-center justify-between mb-3'>
                    <Badge
                      className={cn(
                        'font-semibold px-3 py-1 rounded-full text-sm',
                        getStatusBadge(
                          order.isPaid,
                          order.isDelivered,
                          order.isShipped || false
                        ).variant
                      )}
                    >
                      {
                        getStatusBadge(
                          order.isPaid,
                          order.isDelivered,
                          order.isShipped || false
                        ).text
                      }
                    </Badge>
                    <span className='text-sm font-semibold text-orange-700 dark:text-orange-300 bg-white dark:bg-zinc-800 px-3 py-1 rounded-full'>
                      {formatDateTime(order.createdAt!).dateOnly}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                      {t('Orders.Order')} #{formatId(order._id)}
                    </h3>
                    <div className='text-right'>
                      <span className='block text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium'>
                        {t('Orders.TotalAmount')}
                      </span>
                      <span className='font-bold text-lg text-gray-900 dark:text-white'>
                        <ProductPrice price={order.totalPrice} plain />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order content */}
                <div className='p-6 border-b border-gray-200 dark:border-zinc-700'>
                  {/* Order items preview */}
                  <div className='mb-4'>
                    <h4 className='text-sm font-bold text-gray-900 dark:text-white mb-3'>
                      {t('Orders.Items')}
                    </h4>
                    <div className='space-y-3'>
                      {/* Show first item with image */}
                      {order.items.length > 0 && (
                        <div className='flex items-center gap-4 p-3 bg-gray-50 dark:bg-zinc-700/30 rounded-xl'>
                          <div className='relative w-16 h-16 flex-shrink-0 border-2 border-orange-200 dark:border-orange-600 rounded-xl overflow-hidden bg-white dark:bg-zinc-800'>
                            <Image
                              src={order.items[0].image}
                              fill
                              sizes='64px'
                              alt={order.items[0].name}
                              className='object-cover'
                            />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm font-semibold text-gray-900 dark:text-white truncate'>
                              {order.items[0].name}
                            </p>
                            <p className='text-xs text-gray-600 dark:text-gray-400 font-medium'>
                              {t('Orders.Quantity', {
                                quantity: order.items[0].quantity,
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Item count indicator */}
                      {order.items.length > 1 && (
                        <div className='flex items-center gap-2 mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg'>
                          <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                          <p className='text-xs text-orange-700 dark:text-orange-300 font-medium'>
                            {t('Orders.MoreItems', {
                              count: order.items.length - 1,
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment and delivery info */}
                  <div className='grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-zinc-700/30 rounded-xl'>
                    <div className='flex items-center gap-2'>
                      <span
                        className={cn(
                          'w-3 h-3 rounded-full',
                          order.isPaid ? 'bg-green-500' : 'bg-amber-500'
                        )}
                      ></span>
                      <div>
                        <p className='text-xs text-gray-600 dark:text-gray-400 font-medium'>
                          Payment
                        </p>
                        <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                          {order.isPaid
                            ? t('Orders.Paid')
                            : t('Orders.PaymentPending')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className='text-xs text-gray-600 dark:text-gray-400 font-medium'>
                        Delivery
                      </p>
                      <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                        {formatDateTime(order.expectedDeliveryDate!).dateOnly}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order actions */}
                <div className='p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-zinc-700/30 dark:to-zinc-800/30 flex items-center justify-between'>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    {order.isPaid
                      ? t('Orders.PaidOn', {
                          date: formatDateTime(order.paidAt!).dateOnly,
                        })
                      : t('Orders.AwaitingPayment')}
                  </div>
                  <Link
                    href={`/account/orders/${order._id}`}
                    className={cn(
                      buttonVariants({ size: 'sm', variant: 'default' }),
                      'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 font-semibold px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg gap-2'
                    )}
                  >
                    {t('Orders.ViewDetails')}
                    <ChevronRight className='h-4 w-4' />
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {orders.totalPages > 1 && (
            <div className='mt-8 flex justify-center'>
              <div className='bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 p-4 shadow-lg'>
                <Pagination page={page} totalPages={orders.totalPages} />
              </div>
            </div>
          )}
        </>
      )}

      {/* Browsing History */}
      <div className='mt-16 bg-white dark:bg-zinc-800/50 rounded-3xl border border-gray-200 dark:border-zinc-700 p-6 shadow-lg'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl'>
            <PackageCheckIcon className='w-6 h-6 text-white' />
          </div>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
            {t('Orders.RecommendedForYou')}
          </h2>
        </div>
        <BrowsingHistoryList />
      </div>
    </div>
  )
}
