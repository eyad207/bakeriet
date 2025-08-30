import { auth } from '@/auth'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOut } from '@/lib/actions/user.actions'
import { ChevronDownIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'

export default async function UserButton() {
  const session = await auth()
  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger
          className='px-6 py-2 w-[148px] h-[48px] items-center justify-center rounded-xl bg-gradient-to-r from-white/60 to-yellow-100 text-orange-700 font-semibold border border-orange-200 shadow-md hover:shadow-lg transform hover:scale-[1.04] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300/70 hidden nav:flex'
          asChild
          aria-label={
            session
              ? `User menu for ${session.user.name}`
              : 'User account menu - sign in or sign up'
          }
          aria-expanded={false}
          aria-haspopup='menu'
        >
          <div
            className='flex items-center gap-2 w-full h-full justify-center'
            role='button'
            tabIndex={0}
          >
            <div className='p-1.5 bg-orange-100 rounded-lg'>
              <UserIcon className='h-4 w-4 text-orange-600' />
            </div>
            <div className='flex flex-col text-sm text-left max-w-[70px]'>
              <span
                className='font-bold text-orange-900 text-base truncate'
                title={session ? (session.user.name ?? '') : 'Sign In'}
              >
                {session ? session.user.name : 'Sign In'}
              </span>
            </div>
            <ChevronDownIcon
              className='transition-transform duration-200 text-orange-400 h-4 w-4'
              aria-hidden='true'
            />
          </div>
        </DropdownMenuTrigger>
        {session ? (
          <DropdownMenuContent
            className='w-64 bg-white border border-orange-200 shadow-2xl rounded-xl p-3 backdrop-blur-md'
            align='end'
            forceMount
            role='menu'
            aria-label='User account menu'
          >
            <DropdownMenuLabel className='font-normal p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg mb-2'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full'>
                  <UserIcon className='h-4 w-4 text-white' />
                </div>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm font-semibold text-gray-900 leading-none'>
                    {session.user.name}
                  </p>
                  <p className='text-xs text-gray-600 leading-none'>
                    {session.user.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuGroup
              role='group'
              aria-label='Account actions'
              className='space-y-1'
            >
              <Link className='w-full' href='/account'>
                <DropdownMenuItem
                  className='hover:bg-orange-100/80 bg-white text-orange-800 transition-colors rounded-lg p-3 cursor-pointer font-semibold'
                  role='menuitem'
                  aria-label='Go to your account page'
                >
                  <div className='flex items-center gap-3'>
                    <div className='p-1.5 bg-orange-100 rounded-md'>
                      <UserIcon className='h-4 w-4 text-orange-600' />
                    </div>
                    <span className='font-semibold'>Your Account</span>
                  </div>
                </DropdownMenuItem>
              </Link>
              <Link className='w-full' href='/account/orders'>
                <DropdownMenuItem
                  className='hover:bg-orange-100/80 bg-white text-orange-800 transition-colors rounded-lg p-3 cursor-pointer font-semibold'
                  role='menuitem'
                  aria-label='View your orders'
                >
                  <div className='flex items-center gap-3'>
                    <div className='p-1.5 bg-orange-100 rounded-md'>
                      <span className='text-orange-600 text-sm'>📋</span>
                    </div>
                    <span className='font-semibold'>Your Orders</span>
                  </div>
                </DropdownMenuItem>
              </Link>

              {session.user.role === 'Admin' && (
                <Link className='w-full' href='/admin/overview'>
                  <DropdownMenuItem
                    className='hover:bg-orange-200/80 bg-white text-orange-900 transition-colors rounded-lg p-3 cursor-pointer font-semibold'
                    role='menuitem'
                    aria-label='Go to admin dashboard'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='p-1.5 bg-orange-100 rounded-md'>
                        <span className='text-orange-700 text-sm'>⚙️</span>
                      </div>
                      <span className='font-semibold'>Admin Dashboard</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuGroup>

            <div className='my-2 border-t border-gray-100' />

            <DropdownMenuItem className='p-0'>
              <form action={SignOut} className='w-full'>
                <Button
                  className='w-full py-3 px-3 h-auto justify-start hover:bg-red-100 bg-white text-red-700 hover:text-red-800 rounded-lg transition-colors font-semibold'
                  variant='ghost'
                  type='submit'
                  role='menuitem'
                  aria-label='Sign out of your account'
                >
                  <div className='flex items-center gap-3'>
                    <div className='p-1.5 bg-red-100 rounded-md'>
                      <span className='text-red-700 text-sm'>🚪</span>
                    </div>
                    <span className='font-semibold'>Sign Out</span>
                  </div>
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent
            className='w-64 bg-white border border-orange-200 shadow-2xl rounded-xl p-3'
            align='end'
            forceMount
            role='menu'
            aria-label='Account sign in menu'
          >
            <div className='p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg mb-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full'>
                  <UserIcon className='h-4 w-4 text-white' />
                </div>
                <div>
                  <p className='text-sm font-semibold text-gray-900'>
                    Welcome!
                  </p>
                  <p className='text-xs text-gray-600'>Access your account</p>
                </div>
              </div>
            </div>

            {/* Main actions */}
            <DropdownMenuGroup className='space-y-2'>
              <DropdownMenuItem asChild className='p-0'>
                <Link
                  className='flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-yellow-500 cursor-pointer hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg'
                  href='/sign-in'
                >
                  <div className='flex items-center gap-2'>
                    <span>🔐</span>
                    <span>Sign In</span>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className='p-0'>
                <Link
                  className='flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-semibold text-orange-700 bg-orange-50 cursor-pointer hover:bg-orange-200 transition-colors duration-200'
                  href='/sign-up'
                >
                  <div className='flex items-center gap-2'>
                    <span>✨</span>
                    <span>Create Account</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
