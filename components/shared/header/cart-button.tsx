'use client'

import { ShoppingCartIcon } from 'lucide-react'
import useIsMounted from '@/hooks/use-is-mounted'
import useCartStore from '@/hooks/use-cart-store'
import { useCartSidebarStore } from '@/hooks/use-cart-sidebar-store'

export default function CartButton() {
  const isMounted = useIsMounted()
  const { toggleSidebar } = useCartSidebarStore()
  const {
    cart: { items },
  } = useCartStore()
  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)

  return (
    <button
      onClick={toggleSidebar}
      className='px-3 sm:px-6 py-2 w-[44px] sm:w-[120px] md:w-[148px] h-[40px] sm:h-[48px] flex items-center justify-center rounded-xl bg-gradient-to-r from-white/60 to-yellow-100 text-orange-700 font-semibold border border-orange-200 shadow-md hover:shadow-lg transform hover:scale-[1.04] transition-all duration-200'
    >
      <div className='flex items-center text-sm relative w-full h-full justify-center'>
        <div className='relative'>
          <ShoppingCartIcon className='h-5 w-5 sm:h-6 sm:w-6 text-orange-600' />
          {isMounted && cartItemsCount > 0 && (
            <span className='absolute bg-orange-500 text-white px-1.5 rounded-full text-xs font-bold -right-2 -top-2 z-10 min-w-[18px] h-[18px] flex items-center justify-center shadow-md'>
              {cartItemsCount}
            </span>
          )}
        </div>
        <span className='font-semibold text-sm ml-2 hidden sm:inline text-orange-800'>
          Cart
        </span>
      </div>
    </button>
  )
}
