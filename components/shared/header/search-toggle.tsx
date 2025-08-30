'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import HeaderSearch from './header-search'

export default function SearchToggle() {
  const [open, setOpen] = useState(false)

  return (
    <div className='relative'>
      <button
        className='flex items-center justify-center rounded-full p-2 bg-white/70 hover:bg-yellow-100 text-orange-600 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400'
        aria-label='Open search bar'
        onClick={() => setOpen((v) => !v)}
      >
        <Search className='w-6 h-6' />
      </button>
      {open && (
        <div className='absolute left-0 right-0 mt-3 z-50 w-screen max-w-2xl mx-auto px-4'>
          <div className='bg-white rounded-xl shadow-2xl border border-orange-100 p-4 animate-fade-in-down'>
            <HeaderSearch />
          </div>
        </div>
      )}
    </div>
  )
}
