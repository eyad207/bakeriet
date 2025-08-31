import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import {
  UserIcon,
  MailIcon,
  KeyIcon,
  ChevronRightIcon,
  EditIcon,
} from 'lucide-react'

const PAGE_TITLE = 'Login & Security'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}
export default async function ProfilePage() {
  const t = await getTranslations() // Initialize translations
  const session = await auth()

  const managementSections = [
    {
      icon: <UserIcon className='w-6 h-6 text-orange-500' />,
      title: t('Account.Name'),
      value: session?.user.name,
      href: '/account/manage/name',
      description: 'Update your display name',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
    {
      icon: <MailIcon className='w-6 h-6 text-orange-500' />,
      title: t('Account.Email'),
      value: session?.user.email,
      href: '/account/manage/email',
      description: 'Change your email address',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
    {
      icon: <KeyIcon className='w-6 h-6 text-orange-500' />,
      title: t('Account.Password'),
      value: '••••••••••••',
      href: '/account/manage/password',
      description: 'Update your password',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
  ]

  return (
    <div className='space-y-8 mb-24'>
      <SessionProvider session={session}>
        {/* Breadcrumb */}
        <div className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400'>
          <Link
            href='/account'
            className='hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 font-medium'
          >
            {t('Account.Your Account')}
          </Link>
          <ChevronRightIcon className='w-4 h-4' />
          <span className='text-gray-900 dark:text-white font-semibold'>
            {t('Account.LoginSecurity')}
          </span>
        </div>

        {/* Header */}
        <div className='bg-gradient-to-r from-orange-50 to-orange-50 dark:from-orange-900/20 dark:to-orange-900/20 rounded-3xl p-8 border border-orange-200/50 dark:orange-blue-700/50'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl'>
              <UserIcon className='w-8 h-8 text-orange-600 dark:text-orange-400' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                {t('Account.LoginSecurity')}
              </h1>
              <p className='text-lg text-orange-700 dark:text-orange-300'>
                Manage your account security and personal information
              </p>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className='space-y-4'>
          {managementSections.map((section, index) => (
            <Card
              key={index}
              className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${section.bgColor} border-2 ${section.borderColor} hover:border-opacity-70`}
            >
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4 flex-1'>
                    <div className='flex items-center justify-center w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl shadow-md'>
                      {section.icon}
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-1'>
                        {section.title}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                        {section.description}
                      </p>
                      <p className='text-gray-800 dark:text-gray-200 font-mono bg-white dark:bg-zinc-800 px-3 py-1 rounded-lg inline-block'>
                        {section.value}
                      </p>
                    </div>
                  </div>
                  <Link href={section.href}>
                    <Button
                      className='group bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:shadow-md'
                      variant='outline'
                    >
                      <EditIcon className='w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200' />
                      {t('Account.Edit')}
                      <ChevronRightIcon className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200' />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Tips */}
        <Card className='bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200 dark:border-amber-800'>
          <CardContent className='p-6'>
            <div className='flex items-start gap-4'>
              <div className='flex items-center justify-center w-12 h-12 bg-amber-500/20 rounded-xl'>
                <KeyIcon className='w-6 h-6 text-amber-600 dark:text-amber-400' />
              </div>
              <div>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>
                  Security Tips
                </h3>
                <ul className='text-sm text-gray-700 dark:text-gray-300 space-y-2'>
                  <li className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-amber-500 rounded-full'></div>
                    Use a strong, unique password for your account
                  </li>
                  <li className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-amber-500 rounded-full'></div>
                    Keep your email address up to date for security
                    notifications
                  </li>
                  <li className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-amber-500 rounded-full'></div>
                    Never share your login credentials with others
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}
