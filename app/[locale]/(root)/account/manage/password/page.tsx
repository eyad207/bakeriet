import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import { ProfileForm } from './profile-form'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { getSetting } from '@/lib/actions/setting.actions'
import { KeyIcon, ChevronRightIcon, ShieldIcon } from 'lucide-react'

const PAGE_TITLE = 'Change Your Password'
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
        <div className='bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-3xl p-8 border border-orange-200/50 dark:border-orange-700/50'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-2xl'>
              <KeyIcon className='w-8 h-8 text-orange-600 dark:text-orange-400' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                {PAGE_TITLE}
              </h1>
              <p className='text-lg text-orange-700 dark:text-orange-300'>
                Update your account password
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className='bg-white dark:bg-zinc-800/50 border-2 border-gray-200 dark:border-zinc-700 shadow-lg rounded-3xl overflow-hidden'>
          <CardContent className='p-8'>
            <div className='mb-6'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl'>
                  <KeyIcon className='w-5 h-5 text-orange-600 dark:text-orange-400' />
                </div>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                  Password Settings
                </h2>
              </div>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                If you want to change the password associated with your{' '}
                {site.name}&apos;s account, you may do so below. Be sure to
                click the Save Changes button when you are done.
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-zinc-700/30 rounded-2xl p-6'>
              <ProfileForm />
            </div>

            {/* Security Tips */}
            <div className='mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl'>
              <div className='flex items-start gap-3'>
                <div className='flex items-center justify-center w-8 h-8 bg-amber-500/20 rounded-lg mt-0.5'>
                  <ShieldIcon className='w-4 h-4 text-amber-600 dark:text-amber-400' />
                </div>
                <div>
                  <h3 className='text-sm font-bold text-gray-900 dark:text-white mb-2'>
                    Password Security Tips
                  </h3>
                  <ul className='text-xs text-gray-700 dark:text-gray-300 space-y-1'>
                    <li className='flex items-center gap-2'>
                      <div className='w-1.5 h-1.5 bg-amber-500 rounded-full'></div>
                      Use at least 8 characters with a mix of letters, numbers,
                      and symbols
                    </li>
                    <li className='flex items-center gap-2'>
                      <div className='w-1.5 h-1.5 bg-amber-500 rounded-full'></div>
                      Avoid using personal information or common words
                    </li>
                    <li className='flex items-center gap-2'>
                      <div className='w-1.5 h-1.5 bg-amber-500 rounded-full'></div>
                      Use a unique password for this account
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}
