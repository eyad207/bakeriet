import { Menu as MenuIcon, Phone, MapPin, Clock } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import UserButton from './user-button'
import CartButton from './cart-button'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignOut } from '@/lib/actions/user.actions'
import { NavigationButton } from './navigation-button'
import ThemeSwitcher from './theme-switcher'

const Menu = async ({}: { forAdmin?: boolean }) => {
  // fetch current user session for mobile menu actions
  const session = await import('@/auth').then((mod) => mod.auth())
  return (
    <div className='flex items-center'>
      {/* Desktop menu - visible above 1000px */}
      <nav className='hidden nav:flex items-center gap-3 lg:gap-4'>
        <div className='flex items-center gap-3'>
          <UserButton />
          <CartButton />
        </div>
      </nav>

      {/* Mobile menu - visible below 1000px */}
      <nav className='flex items-center nav:hidden gap-2'>
        <CartButton />
        <Sheet>
          <SheetTrigger className='p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 text-white'>
            <MenuIcon className='h-6 w-6' />
          </SheetTrigger>

          <SheetContent
            className='bg-gradient-to-br from-orange-500 to-yellow-500 text-white flex flex-col py-6 w-80 h-screen overflow-y-auto'
            side='right'
          >
            <SheetHeader className='w-full text-left border-b border-white/20 pb-4'>
              <SheetTitle className='text-white text-2xl font-bold'>
                Menu
              </SheetTitle>
            </SheetHeader>
            {/* Account Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-white/90'>
                Your Account
              </h3>
              <div className='space-y-3 flex flex-col'>
                <SheetClose asChild>
                  <NavigationButton
                    href='/account'
                    className='py-3 px-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 text-white font-medium flex items-center gap-2'
                  >
                    👤 Your Account
                  </NavigationButton>
                </SheetClose>
                <SheetClose asChild>
                  <NavigationButton
                    href='/account/orders'
                    className='py-3 px-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 text-white font-medium flex items-center gap-2'
                  >
                    📋 Your Orders
                  </NavigationButton>
                </SheetClose>
                {/* Admin dashboard link */}
                {session?.user.role === 'Admin' && (
                  <SheetClose asChild>
                    <Link
                      href='/admin/overview'
                      className='py-3 px-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 text-white font-medium flex items-center gap-2'
                    >
                      ⚙️ Admin
                    </Link>
                  </SheetClose>
                )}
                {/* Sign out button */}
                {session ? (
                  <SheetClose asChild>
                    <form action={SignOut} className='w-full'>
                      <Button
                        className='w-full py-3 px-4 bg-red-500/20 backdrop-blur-sm rounded-xl hover:bg-red-500/30 transition-all duration-200 text-white font-medium flex items-center gap-2'
                        variant='ghost'
                        type='submit'
                      >
                        🚪 Sign Out
                      </Button>
                    </form>
                  </SheetClose>
                ) : (
                  <SheetClose asChild>
                    <Link
                      href='/sign-in'
                      className='py-3 px-4 bg-green-500/20 backdrop-blur-sm rounded-xl hover:bg-green-500/30 transition-all duration-200 text-white font-medium flex items-center gap-2'
                      aria-label='Sign in'
                    >
                      🔐 Sign In
                    </Link>
                  </SheetClose>
                )}
              </div>
            </div>
            <div className='mt-6 flex flex-col gap-6 flex-1'>
              {/* Restaurant Navigation */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-white/90'>
                  Navigation
                </h3>
                <div className='space-y-3 flex flex-col'>
                  <SheetClose asChild>
                    <Link
                      href='/menu'
                      className='flex items-center gap-3 py-3 px-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 text-white font-medium'
                    >
                      🍽️ Our Menu
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href='/reservations'
                      className='flex items-center gap-3 py-3 px-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 text-white font-medium'
                    >
                      📅 Reservations
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href='/order'
                      className='flex items-center gap-3 py-3 px-4 bg-white backdrop-blur-sm rounded-xl hover:bg-white/90 transition-all duration-200 text-orange-600 font-bold'
                    >
                      🛍️ Order Online
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href='/about'
                      className='flex items-center gap-3 py-3 px-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 text-white font-medium'
                    >
                      ℹ️ About Us
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href='/contact'
                      className='flex items-center gap-3 py-3 px-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 text-white font-medium'
                    >
                      📞 Contact
                    </Link>
                  </SheetClose>
                </div>
              </div>

              {/* Contact Info */}
              <div className='space-y-4 bg-white/10 backdrop-blur-sm rounded-xl p-4'>
                <h3 className='text-lg font-semibold text-white/90'>
                  Quick Contact
                </h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4' />
                    <span>+47 123 45 678</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4' />
                    <span>Downtown Oslo</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-4 w-4' />
                    <span>Mon-Sun: 11:00 - 22:00</span>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className='space-y-3 bg-white/10 backdrop-blur-sm rounded-xl p-4'>
                <h3 className='text-lg font-semibold text-white/90'>
                  Settings
                </h3>
                <ThemeSwitcher />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu
