import {
  Menu as MenuIcon,
  Phone,
  MapPin,
  Clock,
  User,
  ShoppingBag,
  Settings,
  LogOut,
  LogIn,
  UtensilsCrossed,
  Calendar,
  ShoppingCart,
  Info,
  MessageCircle,
  Home,
} from 'lucide-react'
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
import PreferencesInline from './preferences-inline'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignOut } from '@/lib/actions/user.actions'
import { NavigationButton } from './navigation-button'
import { getAllTags } from '@/lib/actions/product.actions'

const Menu = async ({}: { forAdmin?: boolean }) => {
  // fetch current user session for mobile menu actions
  const session = await import('@/auth').then((mod) => mod.auth())
  const tags = await getAllTags()

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
          <SheetTrigger className='flex items-center justify-center h-10 w-10 sm:h-12 sm:w-auto sm:px-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg text-white transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'>
            <MenuIcon className='h-5 w-5 text-white' />
            <span className='font-semibold text-sm ml-2 hidden sm:inline text-white'>
              Menu
            </span>
          </SheetTrigger>

          <SheetContent
            className='bg-white dark:bg-zinc-900 text-gray-900 dark:text-white flex flex-col w-80 h-screen overflow-y-auto border-l border-gray-200 dark:border-zinc-800'
            side='right'
          >
            <SheetHeader className='w-full text-left border-b border-gray-100 dark:border-zinc-800 pb-6 pt-2'>
              <SheetTitle className='text-gray-900 dark:text-white text-2xl font-bold flex items-center gap-3'>
                <UtensilsCrossed className='h-6 w-6 text-orange-500' />
                Menu
              </SheetTitle>
            </SheetHeader>

            {/* Account Section */}
            <div className='space-y-4 py-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                <User className='h-5 w-5 text-orange-500' />
                Your Account
              </h3>
              <div className='space-y-2'>
                <SheetClose asChild>
                  <NavigationButton
                    href='/account'
                    className='w-full py-3 px-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3 group'
                  >
                    <User className='h-4 w-4 text-orange-500 group-hover:text-orange-600' />
                    Account Settings
                  </NavigationButton>
                </SheetClose>
                <SheetClose asChild>
                  <NavigationButton
                    href='/account/orders'
                    className='w-full py-3 px-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3 group'
                  >
                    <ShoppingBag className='h-4 w-4 text-orange-500 group-hover:text-orange-600' />
                    Order History
                  </NavigationButton>
                </SheetClose>
                {/* Admin dashboard link */}
                {session?.user.role === 'Admin' && (
                  <SheetClose asChild>
                    <Link
                      href='/admin/overview'
                      className='w-full py-3 px-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3 group'
                    >
                      <Settings className='h-4 w-4 text-orange-500 group-hover:text-orange-600' />
                      Admin Dashboard
                    </Link>
                  </SheetClose>
                )}
                {/* Sign out/in button */}
                {session ? (
                  <SheetClose asChild>
                    <form action={SignOut} className='w-full'>
                      <Button
                        className='w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 text-red-700 dark:text-red-400 font-medium flex items-center gap-3 group border-0'
                        variant='ghost'
                        type='submit'
                      >
                        <LogOut className='h-4 w-4' />
                        Sign Out
                      </Button>
                    </form>
                  </SheetClose>
                ) : (
                  <SheetClose asChild>
                    <Link
                      href='/sign-in'
                      className='w-full py-3 px-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-all duration-200 text-green-700 dark:text-green-400 font-medium flex items-center gap-3 group'
                      aria-label='Sign in'
                    >
                      <LogIn className='h-4 w-4' />
                      Sign In
                    </Link>
                  </SheetClose>
                )}
              </div>
            </div>

            {/* Preferences Section - For very small screens */}
            <div className='space-y-4 py-6 border-t border-gray-100 dark:border-zinc-800 xs:hidden'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                <Settings className='h-5 w-5 text-orange-500' />
                Preferences
              </h3>
              <div className='px-4 flex justify-center'>
                <PreferencesInline />
              </div>
            </div>

            {/* Navigation Section */}
            <div className='space-y-4 py-6 border-t border-gray-100 dark:border-zinc-800'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                <Home className='h-5 w-5 text-orange-500' />
                Restaurant
              </h3>
              <div className='space-y-2'>
                {/* Featured navigation items */}
                <SheetClose asChild>
                  <Link
                    href='/menu'
                    className='w-full py-4 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl transition-all duration-200 text-white font-bold flex items-center gap-3 shadow-md hover:shadow-lg group'
                  >
                    <UtensilsCrossed className='h-5 w-5 group-hover:scale-110 transition-transform' />
                    Our Menu
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href='/order'
                    className='w-full py-3 px-4 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-xl transition-all duration-200 text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-3 group border border-amber-200 dark:border-amber-800'
                  >
                    <ShoppingCart className='h-4 w-4 group-hover:scale-110 transition-transform' />
                    Order Online
                  </Link>
                </SheetClose>

                {/* Regular navigation */}
                <SheetClose asChild>
                  <Link
                    href='/reservations'
                    className='w-full py-3 px-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3 group'
                  >
                    <Calendar className='h-4 w-4 text-orange-500 group-hover:text-orange-600' />
                    Reservations
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href='/about'
                    className='w-full py-3 px-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3 group'
                  >
                    <Info className='h-4 w-4 text-orange-500 group-hover:text-orange-600' />
                    About Us
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href='/contact'
                    className='w-full py-3 px-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3 group'
                  >
                    <MessageCircle className='h-4 w-4 text-orange-500 group-hover:text-orange-600' />
                    Contact Us
                  </Link>
                </SheetClose>

                {/* Tags as modern chips */}
                {tags.length > 0 && (
                  <div className='pt-4'>
                    <h4 className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-3'>
                      Categories
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {tags.slice(0, 4).map((tag: string) => (
                        <SheetClose key={tag} asChild>
                          <Link
                            href={`/?tag=${encodeURIComponent(tag)}`}
                            className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                          >
                            {tag}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info Card */}
            <div className='mt-auto mb-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-zinc-800 dark:to-zinc-700 rounded-xl p-4 border border-orange-100 dark:border-zinc-700'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                <Phone className='h-5 w-5 text-orange-500' />
                Quick Contact
              </h3>
              <div className='space-y-3 text-sm'>
                <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                  <div className='flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full'>
                    <Phone className='h-4 w-4 text-orange-600' />
                  </div>
                  <span className='font-medium'>+47 123 45 678</span>
                </div>
                <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                  <div className='flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full'>
                    <MapPin className='h-4 w-4 text-orange-600' />
                  </div>
                  <span className='font-medium'>Downtown Oslo</span>
                </div>
                <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                  <div className='flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full'>
                    <Clock className='h-4 w-4 text-orange-600' />
                  </div>
                  <span className='font-medium'>Mon-Sun: 11:00 - 22:00</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu
