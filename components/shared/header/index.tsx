import Image from 'next/image'
import Link from 'next/link'
import { cache } from 'react'
import Menu from './menu'
import HeaderWrapper from './header-wrapper'
import UserButton from './user-button'
import CartButton from './cart-button'
import { getSetting } from '@/lib/actions/setting.actions'
import 'server-only'
import { Phone, Clock, MapPin } from 'lucide-react'

// Cached fetchers (will only hit DB once per build/revalidate period)
const getCachedSettings = cache(getSetting)

// Fetch tags server-side
async function getTags() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/tags`, { cache: 'no-store' })
    const data = await res.json()
    return Array.isArray(data.tags) ? data.tags : []
  } catch {
    return []
  }
}

export default async function Header() {
  // Fetch settings and tags
  const settings = await getCachedSettings()
  const tags = await getTags()
  const { site } = settings

  return (
    <HeaderWrapper>
      <header className='w-full bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 shadow-2xl'>
        {/* Top info bar */}
        <div className='bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-2 px-4'>
          <div className='max-w-7xl mx-auto flex flex-wrap justify-between items-center text-sm'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-1'>
                <Phone className='h-4 w-4' />
                <span>+47 123 45 678</span>
              </div>
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4' />
                <span>Mon-Sun: 11:00 - 22:00</span>
              </div>
              <div className='flex items-center gap-1'>
                <MapPin className='h-4 w-4' />
                <span>Downtown Oslo</span>
              </div>
            </div>
            <div className='hidden sm:block'>
              <span className='font-medium'>
                🎉 Free delivery on orders over 500 NOK!
              </span>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className='w-full px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-4'>
            {/* Logo & Brand */}
            <div className='flex items-center shrink-0'>
              <Link
                href='/'
                className='flex items-center gap-3 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 px-4 py-2 shadow-lg hover:shadow-xl transform hover:scale-105'
              >
                <Image
                  src={site.logo}
                  width={48}
                  height={48}
                  alt={`${site.name} logo`}
                  className='h-12 w-12 rounded-full border-3 border-white shadow-md'
                  priority
                />
                <div className='flex flex-col'>
                  <span className='font-bold text-2xl text-white drop-shadow-lg'>
                    {site.name}
                  </span>
                  <span className='text-sm text-white/90 font-medium'>
                    Authentic Norwegian Cuisine
                  </span>
                </div>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <nav className='hidden nav:flex items-center gap-8'>
              {/* Tags before nav links */}
              {tags.length > 0 && (
                <div className='flex items-center gap-2'>
                  <div className='flex gap-2 overflow-x-auto max-w-[300px]'>
                    {tags.map((tag: { name: string; _id: string }) => (
                      <a
                        key={tag._id}
                        href={`/?tag=${encodeURIComponent(tag.name)}`}
                        className='font-semibold text-lg text-white hover:text-yellow-200 transition-colors duration-200 relative group px-2 py-0.5 rounded-md cursor-pointer whitespace-nowrap'
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
                className='font-semibold text-lg text-white hover:text-yellow-200 transition-colors duration-200 relative group'
              >
                Menu
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300'></span>
              </Link>
              <Link
                href='/reservations'
                className='font-semibold text-lg text-white hover:text-yellow-200 transition-colors duration-200 relative group'
              >
                Reservations
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300'></span>
              </Link>
              <Link
                href='/about'
                className='font-semibold text-lg text-white hover:text-yellow-200 transition-colors duration-200 relative group'
              >
                About
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300'></span>
              </Link>
              <Link
                href='/contact'
                className='font-semibold text-lg text-white hover:text-yellow-200 transition-colors duration-200 relative group'
              >
                Contact
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300'></span>
              </Link>
              {/* Desktop User Actions */}
              <div className='flex items-center gap-2 ml-6 pl-4 border-l border-white/30'>
                <UserButton />
                <CartButton />
              </div>
            </nav>
            {/* Mobile Menu */}
            <div className='nav:hidden flex items-center'>
              <Menu />
            </div>
          </div>
        </div>
      </header>
    </HeaderWrapper>
  )
}
