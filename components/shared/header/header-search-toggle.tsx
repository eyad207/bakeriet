'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Search } from 'lucide-react'
import HeaderSearch from './header-search'

export default function HeaderSearchToggle({}: { categories?: string[] }) {
  const [open, setOpen] = useState(false)
  const modalContentRef = useRef<HTMLDivElement>(null)

  // Close search bar on outside click (only if click is outside modal content)
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      // Prevent closing if click is inside the modal or a Radix Select portal
      const target = e.target as Node
      const isInModal =
        modalContentRef.current && modalContentRef.current.contains(target)
      const isInRadixPortal =
        !!document.querySelector('.radix-select-content') &&
        document.querySelector('.radix-select-content')!.contains(target)
      if (!isInModal && !isInRadixPortal) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick, true)
    return () => document.removeEventListener('mousedown', handleClick, true)
  }, [open])

  return (
    <div className='relative'>
      <button
        className='flex items-center justify-center rounded-full p-1.5 sm:p-2 bg-white/30 hover:bg-white/60 transition-colors duration-200 text-orange-700 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400'
        aria-label='Open search bar'
        onClick={() => setOpen((v) => !v)}
        type='button'
      >
        <Search className='w-5 h-5 sm:w-6 sm:h-6' />
      </button>
      {open &&
        typeof window !== 'undefined' &&
        createPortal(
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
            {/* Overlay with blur and dark background */}
            <div
              className='fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300'
              style={{ zIndex: 9999 }}
            />
            {/* Centered search modal */}
            <div
              className='fixed inset-0 flex justify-center items-start w-full h-full pt-[90px] sm:pt-[110px]'
              style={{ zIndex: 10000 }}
            >
              <div
                ref={modalContentRef}
                className='w-full sm:max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-orange-200 p-4 sm:p-6 animate-fade-in-down relative'
              >
                <HeaderSearch />
                <button
                  className='absolute top-2 right-2 text-gray-400 hover:text-orange-500 transition-colors text-xl font-bold'
                  aria-label='Close search bar'
                  onClick={() => setOpen(false)}
                  type='button'
                >
                  ×
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
