import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import RecentOrdersList from '@/components/shared/account/recent-orders-list'
import { Card, CardContent } from '@/components/ui/card'
import {
  PackageCheckIcon,
  ShieldCheckIcon,
  UserIcon,
  ClockIcon,
} from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { auth } from '@/auth'
import { getRecentOrders } from '@/lib/actions/order.actions'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Your Account',
}

export default async function AccountPage() {
  const session = await auth()
  const userName = session?.user?.name || 'there'
  const t = await getTranslations() // Initialize translations
  // Fetch recent orders if user is logged in
  const recentOrders = session?.user?.id
    ? await getRecentOrders(session.user.id)
    : []

  const accountCards = [
    {
      title: t('Account.Orders'),
      description: t('Account.TrackReturnBuy'),
      icon: <PackageCheckIcon className='w-8 h-8 text-orange-500' />,
      href: '/account/orders',
      gradient: 'from-orange-500/10 to-orange-600/10',
      hoverGradient: 'hover:from-orange-500/20 hover:to-orange-600/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
    {
      title: t('Account.LoginSecurity'),
      description: t('Account.Edit Login Name Mobile'),
      icon: <ShieldCheckIcon className='w-8 h-8 text-blue-500' />,
      href: '/account/manage',
      gradient: 'from-blue-500/10 to-blue-600/10',
      hoverGradient: 'hover:from-blue-500/20 hover:to-blue-600/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
  ]

  return (
    <div className='space-y-8'>
      {/* Header Section */}
      <div className='bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-3xl p-8 border border-orange-200/50 dark:border-orange-700/50'>
        <div className='flex items-center gap-4 mb-4'>
          <div className='flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-2xl'>
            <UserIcon className='w-8 h-8 text-orange-600 dark:text-orange-400' />
          </div>
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2'>
              {t('Dashboard.Hello')}, {userName}
            </h1>
            <p className='text-lg text-orange-700 dark:text-orange-300 font-medium'>
              {t('Dashboard.WelcomeMessage')}
            </p>
          </div>
        </div>
      </div>

      {/* Account Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {accountCards.map((card, index) => (
          <Link href={card.href} key={index} className='block h-full group'>
            <Card
              className={`h-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-br ${card.gradient} ${card.hoverGradient} border-2 ${card.borderColor} hover:border-opacity-70`}
            >
              <CardContent className='p-8 flex gap-6 h-full'>
                <div className='shrink-0 group-hover:scale-110 transition-transform duration-300'>
                  {card.icon}
                </div>
                <div className='space-y-3 flex-1'>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300'>
                    {card.title}
                  </h2>
                  <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className='space-y-6'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl'>
            <ClockIcon className='w-6 h-6 text-white' />
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
              {t('Dashboard.RecentOrders')}
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              {t('Dashboard.QuickAccess')}
            </p>
          </div>
        </div>

        <div className='bg-white dark:bg-zinc-800/50 rounded-3xl border border-gray-200 dark:border-zinc-700 p-6 shadow-lg'>
          <RecentOrdersList orders={recentOrders} />
        </div>
      </div>

      <Separator className='my-8 bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-600 to-transparent' />

      {/* Browsing History */}
      <div className='bg-white dark:bg-zinc-800/50 rounded-3xl border border-gray-200 dark:border-zinc-700 p-6 shadow-lg'>
        <BrowsingHistoryList />
      </div>
    </div>
  )
}
