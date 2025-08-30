import Image from 'next/image'
import Link from 'next/link'
import { cache } from 'react'
import Menu from './menu'
import HeaderWrapper from './header-wrapper'
import UserButton from './user-button'
import CartButton from './cart-button'
import { getSetting } from '@/lib/actions/setting.actions'
import { getAllCategories, getAllTags } from '@/lib/actions/product.actions'
import 'server-only'
import { Phone, Clock, MapPin } from 'lucide-react'

// Dynamically import SearchToggle for client-side rendering
import HeaderSearchToggle from './header-search-toggle'

// Cached fetchers (will only hit DB once per build/revalidate period)
const getCachedSettings = cache(getSetting)

export default async function Header() {
  // Fetch settings, tags, and categories
  const settings = await getCachedSettings()
  const tags = await getAllTags()
  const { site } = settings
  const categories = await getAllCategories()

  return (
    <HeaderWrapper>
      <header className='w-full bg-white dark:bg-zinc-900 shadow-lg border-b border-orange-100 dark:border-zinc-800'>
        {/* Top info bar - Professional minimalist design */}
        <div className='hidden md:block bg-gradient-to-r from-orange-50 to-amber-50 dark:from-zinc-800 dark:to-zinc-700 border-b border-orange-100 dark:border-zinc-700'>
          <div className='max-w-7xl mx-auto px-4 py-2'>
            <div className='flex justify-between items-center text-sm'>
              <div className='flex items-center gap-6'>
                <div className='flex items-center gap-2 text-orange-700 dark:text-orange-400'>
                  <Phone className='h-4 w-4' />
                  <span className='font-medium'>{site.phone}</span>
                </div>
                <div className='flex items-center gap-2 text-orange-700 dark:text-orange-400'>
                  <Clock className='h-4 w-4' />
                  <span className='font-medium'>Mon-Sun: 11:00 - 22:00</span>
                </div>
              </div>
              <div className='flex items-center gap-2 text-orange-700 dark:text-orange-400'>
                <MapPin className='h-4 w-4' />
                <span className='font-medium'>{site.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main header - Clean and modern */}
        <div className='w-full'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-between h-16 lg:h-20'>
              {/* Logo & Brand - Horizontal layout for modern look */}
              <div className='flex items-center shrink-0'>
                <Link
                  href='/'
                  className='flex items-center gap-3 group transition-all duration-300 hover:opacity-80'
                >
                  <div className='relative'>
                    <Image
                      src={site.logo}
                      width={48}
                      height={48}
                      alt={`${site.name} logo`}
                      className='h-10 w-10 lg:h-12 lg:w-12 rounded-full border-2 border-orange-200 dark:border-orange-800 shadow-sm object-cover transition-all duration-300 group-hover:shadow-md'
                      priority
                    />
                    <div className='absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-bold text-xl lg:text-2xl text-gray-900 dark:text-white leading-none'>
                      {site.name}
                    </span>
                    <span className='text-xs lg:text-sm text-orange-600 dark:text-orange-400 font-medium leading-none mt-0.5'>
                      Authentic Norwegian Cuisine
                    </span>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation - Modern pill design */}
              <nav className='hidden lg:flex items-center gap-1'>
                {/* Main navigation links */}
                <div className='flex items-center gap-1 bg-gray-50 dark:bg-zinc-800 rounded-full p-1'>
                  <Link
                    href='/menu'
                    className='relative group px-5 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                  >
                    Menu
                  </Link>
                  <Link
                    href='/about'
                    className='relative group px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-white dark:hover:bg-zinc-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                  >
                    About
                  </Link>
                  <Link
                    href='/contact'
                    className='relative group px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-white dark:hover:bg-zinc-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                  >
                    Contact
                  </Link>
                </div>

                {/* Tags - Modern badge design */}
                {tags.length > 0 && (
                  <div className='flex items-center gap-2 ml-4'>
                    {tags.slice(0, 3).map((tag: string) => (
                      <a
                        key={tag}
                        href={`/?tag=${encodeURIComponent(tag)}`}
                        className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                        aria-label={`Filter by ${tag}`}
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                )}

                {/* User Actions - Clean separation */}
                <div className='flex items-center gap-2 ml-6 pl-6 border-l border-gray-200 dark:border-zinc-700'>
                  <HeaderSearchToggle categories={categories} />
                  <UserButton />
                  <CartButton />
                </div>
              </nav>

              {/* Mobile Navigation - Clean and compact */}
              <div className='flex lg:hidden items-center gap-3'>
                <HeaderSearchToggle categories={categories} />
                <UserButton />
                <Menu />
              </div>
            </div>
          </div>
        </div>
      </header>
    </HeaderWrapper>
  )
}
