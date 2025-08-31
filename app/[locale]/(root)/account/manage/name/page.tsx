import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import { ProfileForm } from './profile-form'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { getSetting } from '@/lib/actions/setting.actions'
import { UserIcon, ChevronRightIcon } from 'lucide-react'

const PAGE_TITLE = 'Change Your Name'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

export default async function ProfilePage() {
  const session = await auth()
  const { site } = await getSetting()
  return (
    <div className='space-y-8 mb-24'>
      <SessionProvider session={session}>
        {/* Breadcrumb */}
        <div className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400'>
          <Link
            href='/account'
            className='hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 font-medium'
          >
            Your Account
          </Link>
          <ChevronRightIcon className='w-4 h-4' />
          <Link
            href='/account/manage'
            className='hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 font-medium'
          >
            Login & Security
          </Link>
          <ChevronRightIcon className='w-4 h-4' />
          <span className='text-gray-900 dark:text-white font-semibold'>
            {PAGE_TITLE}
          </span>
        </div>

        {/* Header */}
        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border border-blue-200/50 dark:border-blue-700/50'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl'>
              <UserIcon className='w-8 h-8 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                {PAGE_TITLE}
              </h1>
              <p className='text-lg text-blue-700 dark:text-blue-300'>
                Update your display name
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className='bg-white dark:bg-zinc-800/50 border-2 border-gray-200 dark:border-zinc-700 shadow-lg rounded-3xl overflow-hidden'>
          <CardContent className='p-8'>
            <div className='mb-6'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl'>
                  <UserIcon className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                </div>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                  Personal Information
                </h2>
              </div>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                If you want to change the name associated with your {site.name}
                &apos;s account, you may do so below. Be sure to click the Save
                Changes button when you are done.
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-zinc-700/30 rounded-2xl p-6'>
              <ProfileForm />
            </div>
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}
