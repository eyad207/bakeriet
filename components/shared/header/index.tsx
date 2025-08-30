import Image from 'next/image'
import Link from 'next/link'
import { cache } from 'react'
import Menu from './menu'
import HeaderWrapper from './header-wrapper'
import UserButton from './user-button'
import CartButton from './cart-button'
import { getSetting } from '@/lib/actions/setting.actions'
import { getAllCategories } from '@/lib/actions/product.actions'
import 'server-only'
import { Phone, Clock, MapPin } from 'lucide-react'

// Dynamically import SearchToggle for client-side rendering
import HeaderSearchToggle from './header-search-toggle'

// Cached fetchers (will only hit DB once per build/revalidate period)
const getCachedSettings = cache(getSetting)

// Fetch tags server-side
async function getTags() {
  try {
    const baseUrl = '/'
    const res = await fetch(`${baseUrl}/api/tags`, { cache: 'no-store' })
    const data = await res.json()
    return Array.isArray(data.tags) ? data.tags : []
  } catch {
    return []
  }
}

export default async function Header() {
  // Fetch settings, tags, and categories
  const settings = await getCachedSettings()
  const tags = await getTags()
  const { site } = settings
  const categories = await getAllCategories()

  return (
    <HeaderWrapper>
      <header className='w-full bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 shadow-2xl'>
        {/* Top info bar - Hidden on mobile */}
        <div className='hidden sm:block bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-2 sm:py-3 px-4'>
          <div className='max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-4'>
            <div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm'>
              <div className='flex items-center gap-1'>
                <Phone className='h-3 w-3 sm:h-4 sm:w-4' />
                <span className='font-medium'>{site.phone}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Clock className='h-3 w-3 sm:h-4 sm:w-4' />
                <span className='font-medium'>Mon-Sun: 11:00 - 22:00</span>
              </div>
            </div>
            <div className='flex items-center gap-1 text-xs sm:text-sm'>
              <MapPin className='h-3 w-3 sm:h-4 sm:w-4' />
              <span className='font-medium text-center sm:text-left'>
                {site.address}
              </span>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className='w-full px-3 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-3 sm:py-4'>
            {/* Logo & Brand */}
            <div className='flex items-center shrink-0'>
              <Link
                href='/'
                className='flex items-center gap-2 sm:gap-3 rounded-xl lg:rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 px-1 py-1 sm:px-3 lg:py-1 shadow-lg hover:shadow-xl transform hover:scale-105'
              >
                <Image
                  src={site.logo}
                  width={60}
                  height={48}
                  alt={`${site.name} logo`}
                  className='h-8 w-10 sm:h-10 sm:w-12 lg:h-12 lg:w-14 rounded-full border-2 sm:border-3 border-white shadow-md object-cover'
                  priority
                />
                <div className='flex flex-col'>
                  <span className='font-bold text-lg sm:text-xl lg:text-2xl text-white drop-shadow-lg leading-tight'>
                    {site.name}
                  </span>
                  <span className='text-xs sm:text-sm lg:text-base text-white/90 font-medium leading-tight'>
                    Authentic Norwegian Cuisine
                  </span>
                </div>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <nav className='hidden nav:flex items-center gap-4 lg:gap-6 xl:gap-8'>
              {/* Tags before nav links */}
              {tags.length > 0 && (
                <div className='flex items-center gap-2'>
                  <div className='flex gap-1 lg:gap-2 overflow-x-auto max-w-[200px] lg:max-w-[300px]'>
                    {tags.map((tag: { name: string; _id: string }) => (
                      <a
                        key={tag._id}
                        href={`/?tag=${encodeURIComponent(tag.name)}`}
                        className='font-semibold text-sm lg:text-base text-white hover:text-yellow-200 transition-colors duration-200 relative group px-2 py-0.5 rounded-md cursor-pointer whitespace-nowrap'
                        style={{ textDecoration: 'none' }}
                      >
                        {tag.name}
                        <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300'></span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <Link
                href='/menu'
                className='font-semibold text-base lg:text-lg text-white hover:text-yellow-200 transition-colors duration-200 relative group'
              >
                Menu
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300'></span>
              </Link>
              <Link
                href='/reservations'
                className='font-semibold text-base lg:text-lg text-white hover:text-yellow-200 transition-colors duration-200 relative group'
              >
                Reservations
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300'></span>
              </Link>
              <Link
                href='/about'
                className='font-semibold text-base lg:text-lg text-white hover:text-yellow-200 transition-colors duration-200 relative group'
              >
                About
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300'></span>
              </Link>
              <Link
                href='/contact'
                className='font-semibold text-base lg:text-lg text-white hover:text-yellow-200 transition-colors duration-200 relative group'
              >
                Contact
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300'></span>
              </Link>
              {/* Desktop User Actions */}
              <div className='flex items-center gap-1 lg:gap-2 ml-4 lg:ml-6 pl-3 lg:pl-4 border-l border-white/30'>
                <div className='ml-2 flex items-center'>
                  <HeaderSearchToggle categories={categories} />
                </div>
                <UserButton />
                <CartButton />
              </div>
            </nav>
            {/* Mobile Menu */}
            <div className='nav:hidden flex items-center gap-2'>
              <div className='ml-2 flex items-center'>
                <HeaderSearchToggle categories={categories} />
              </div>
              <div className='scale-75'>
                <UserButton />
              </div>
              <Menu />
            </div>
          </div>
        </div>
      </header>
    </HeaderWrapper>
  )
}
