'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon, ChevronRightIcon, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'

type CardItem = {
  title: string
  link: { text: string; href: string }
  items: {
    name: string
    items?: string[]
    image: string
    href: string
    className?: string
  }[]
}

export function HomeCard({ cards }: { cards: CardItem[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentCardIndexRef = useRef<number>(0)
  const [isMobile, setIsMobile] = useState(false)

  // Add CSS for gradient animation
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Check if we're on mobile or desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // Consider lg breakpoint (1024px) as desktop
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Calculate total number of cards
  const totalCards = cards.length

  // Handle manual navigation with precise single-card scroll (mobile only)
  const scrollPrev = () => {
    if (!scrollContainerRef.current || !isMobile) return

    const newIndex = Math.max(0, currentCardIndex - 1)
    setCurrentCardIndex(newIndex)
    currentCardIndexRef.current = newIndex

    // Calculate the exact position to scroll to
    const cardElements =
      scrollContainerRef.current.querySelectorAll('.card-item')
    if (cardElements[newIndex]) {
      scrollContainerRef.current.scrollLeft =
        cardElements[newIndex].getBoundingClientRect().left +
        scrollContainerRef.current.scrollLeft -
        scrollContainerRef.current.getBoundingClientRect().left
    }
  }

  const scrollNext = () => {
    if (!scrollContainerRef.current || !isMobile) return

    const newIndex = Math.min(totalCards - 1, currentCardIndex + 1)
    setCurrentCardIndex(newIndex)
    currentCardIndexRef.current = newIndex

    // Calculate the exact position to scroll to
    const cardElements =
      scrollContainerRef.current.querySelectorAll('.card-item')
    if (cardElements[newIndex]) {
      scrollContainerRef.current.scrollLeft =
        cardElements[newIndex].getBoundingClientRect().left +
        scrollContainerRef.current.scrollLeft -
        scrollContainerRef.current.getBoundingClientRect().left
    }
  }

  // Auto-scroll functionality - only for mobile
  // Use a ref to avoid recreating intervals on every currentCardIndex change
  const startAutoScroll = () => {
    // Clear any existing interval first
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current)
    }

    autoScrollIntervalRef.current = setInterval(() => {
      if (!scrollContainerRef.current) return

      const newIndex = (currentCardIndexRef.current + 1) % totalCards
      currentCardIndexRef.current = newIndex
      setCurrentCardIndex(newIndex)

      // Decide selector based on mode
      const selector = isMobile ? '.card-item' : '.card-desktop'
      const cardElements = scrollContainerRef.current.querySelectorAll(selector)

      if (cardElements[newIndex]) {
        scrollContainerRef.current.scrollTo({
          left:
            cardElements[newIndex].getBoundingClientRect().left +
            scrollContainerRef.current.scrollLeft -
            scrollContainerRef.current.getBoundingClientRect().left,
          behavior: 'smooth',
        })
      } else if (!isMobile) {
        // Fallback: on desktop, if no matching element, scroll by a step (card width)
        const c = scrollContainerRef.current
        const cardEl = c.querySelector('.card-desktop') as HTMLElement | null
        const style = window.getComputedStyle(c)
        const gap = parseFloat(style.gap || style.columnGap || '24') || 24
        const step = cardEl
          ? cardEl.getBoundingClientRect().width + gap
          : c.clientWidth * 0.8
        c.scrollBy({ left: step, behavior: 'smooth' })
      }
    }, 3000)
  }

  useEffect(() => {
    // Start auto-scroll when on mobile OR when on desktop with many cards (>4)
    const shouldAuto = isMobile || (!isMobile && totalCards > 4)
    if (!shouldAuto) {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
        autoScrollIntervalRef.current = null
      }
      return
    }

    // start auto scroll when entering the appropriate mode
    startAutoScroll()

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
        autoScrollIntervalRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, totalCards])

  // Handle manual scroll - only for mobile
  const handleManualScroll = () => {
    if (!isMobile) return

    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current)
    }

    // Find the closest card to the current scroll position
    if (scrollContainerRef.current) {
      const containerLeft =
        scrollContainerRef.current.getBoundingClientRect().left
      const cardElements =
        scrollContainerRef.current.querySelectorAll('.card-item')

      let closestIndex = 0
      let minDistance = Infinity

      cardElements.forEach((card, index) => {
        const cardLeft = card.getBoundingClientRect().left
        const distance = Math.abs(cardLeft - containerLeft)
        if (distance < minDistance) {
          minDistance = distance
          closestIndex = index
        }
      })

      setCurrentCardIndex(closestIndex)
      currentCardIndexRef.current = closestIndex
    }

    // Restart auto-scroll after a pause
    setTimeout(() => {
      // Use the same start helper to ensure a single interval
      startAutoScroll()
    }, 5000)
  }

  // Desktop scroll helpers for when we render a horizontal row (>4 cards)
  const pauseAndRestartAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current)
      autoScrollIntervalRef.current = null
    }
    // Restart after 5s
    setTimeout(() => {
      startAutoScroll()
    }, 5000)
  }

  const scrollPrevDesktop = () => {
    const c = scrollContainerRef.current
    if (!c) return

    const cardEl = c.querySelector('.card-desktop') as HTMLElement | null
    const style = window.getComputedStyle(c)
    const gap = parseFloat(style.gap || style.columnGap || '24') || 24
    const step = cardEl
      ? cardEl.getBoundingClientRect().width + gap
      : c.clientWidth * 0.8

    c.scrollBy({ left: -step, behavior: 'smooth' })
    // pause auto scroll when user manually navigates
    pauseAndRestartAutoScroll()
  }

  const scrollNextDesktop = () => {
    const c = scrollContainerRef.current
    if (!c) return

    const cardEl = c.querySelector('.card-desktop') as HTMLElement | null
    const style = window.getComputedStyle(c)
    const gap = parseFloat(style.gap || style.columnGap || '24') || 24
    const step = cardEl
      ? cardEl.getBoundingClientRect().width + gap
      : c.clientWidth * 0.8

    c.scrollBy({ left: step, behavior: 'smooth' })
    // pause auto scroll when user manually navigates
    pauseAndRestartAutoScroll()
  }

  // Process items to ensure we only show 4 per card
  const processedCards = cards.map((card) => {
    const limitedItems = card.items.slice(0, 4)
    return { ...card, items: limitedItems }
  })

  // Render different layouts for mobile and desktop
  if (!isMobile) {
    // If there are more than 4 cards on desktop, render a horizontally scrollable row
    if (totalCards > 4) {
      return (
        <div className='relative w-full '>
          {/* Left control */}
          <Button
            variant='outline'
            size='icon'
            className='hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-orange-200/50 hover:border-orange-300/70 dark:bg-zinc-800/90 dark:border-orange-800/50 dark:hover:border-orange-600/70 w-10 h-10 hover:scale-110 transition-all duration-300 rounded-full'
            onClick={scrollPrevDesktop}
            aria-label='Scroll left'
          >
            <ChevronLeftIcon className='h-5 w-5 text-orange-600 dark:text-orange-400' />
          </Button>

          {/* Scrollable row */}
          <div
            ref={scrollContainerRef}
            className='w-full overflow-x-auto pb-4 scrollbar-hide scroll-smooth'
            role='list'
            aria-label='Home cards'
          >
            <div className='flex gap-6 lg:gap-8 min-w-max px-4'>
              {processedCards.map((card) => (
                <div role='listitem' key={card.title} className='flex-shrink-0'>
                  <Card className='card-desktop group relative flex flex-col overflow-hidden w-96 bg-gradient-to-br from-white via-orange-50/30 to-yellow-50/30 dark:from-zinc-900 dark:via-orange-950/30 dark:to-yellow-950/30 transition-all duration-700 hover:scale-[1.02] transform rounded-xl shadow-lg'>
                    <CardContent className='p-6 sm:p-7 md:p-8 flex-1 relative z-10'>
                      <div className='flex items-center mb-6'>
                        <div
                          className='w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 mr-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500'
                          style={{
                            clipPath:
                              'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                          }}
                        >
                          <Utensils className='w-6 h-6 text-white' />
                        </div>
                        <h3 className='text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-500'>
                          {card.title}
                        </h3>
                      </div>

                      <div className='grid grid-cols-2 gap-5 sm:gap-6'>
                        {card.items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                              'flex flex-col group/item cursor-pointer',
                              item.className
                            )}
                          >
                            <div className='relative mb-3 sm:mb-4 group-hover/item:scale-110 transition-transform duration-500'>
                              <div className='w-24 h-24 sm:w-28 sm:h-28 mx-auto bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-950/70 dark:to-yellow-950/70 flex items-center justify-center overflow-hidden relative transition-all duration-500 hover:shadow-lg group-hover/item:shadow-xl rounded-xl border-2 border-orange-200/50 dark:border-orange-800/50'>
                                <div className='absolute inset-0 bg-gradient-to-tr from-orange-200/50 via-yellow-200/30 to-orange-300/50 opacity-0 group-hover/item:opacity-100 transition-opacity duration-700 rounded-xl' />

                                <div className='relative z-10 p-2'>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    className='w-full h-full object-cover transition-all duration-700 group-hover/item:scale-110 rounded-lg'
                                    height={80}
                                    width={80}
                                  />
                                </div>
                              </div>
                            </div>
                            <p className='text-center text-sm sm:text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis group-hover/item:text-orange-600 dark:group-hover/item:text-orange-400 transition-colors duration-500 text-gray-700 dark:text-gray-200'>
                              {item.name}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </CardContent>

                    {card.link && (
                      <CardFooter className='pt-4 pb-5 px-6 sm:pt-5 sm:pb-6 sm:px-8 relative'>
                        <div className=' absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-300 to-transparent z-30 pointer-events-none'></div>
                        <Link
                          href={card.link.href}
                          className='group/link w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold transition-all duration-500 hover:scale-105 transform hover:shadow-lg relative overflow-hidden'
                          style={{
                            clipPath:
                              'polygon(15px 0%, 100% 0%, calc(100% - 15px) 100%, 0% 100%)',
                          }}
                        >
                          <div className='absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover/link:opacity-100 transition-opacity duration-500'></div>
                          <span className='relative z-10'>
                            {card.link.text}
                          </span>
                          <ChevronRightIcon className='ml-2 h-5 w-5 sm:h-6 sm:w-6 transform transition-transform duration-500 group-hover/link:translate-x-2 relative z-10' />
                        </Link>
                      </CardFooter>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Right control */}
          <Button
            variant='outline'
            size='icon'
            className='hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-orange-200/50 hover:border-orange-300/70 dark:bg-zinc-800/90 dark:border-orange-800/50 dark:hover:border-orange-600/70 w-10 h-10 hover:scale-110 transition-all duration-300 rounded-full'
            onClick={scrollNextDesktop}
            aria-label='Scroll right'
          >
            <ChevronRightIcon className='h-5 w-5 text-orange-600 dark:text-orange-400' />
          </Button>
        </div>
      )
    }

    // Desktop layout - geometric shapes design with hexagons and diamonds (<=4 cards)
    return (
      <div className='w-full grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
        {processedCards.map((card) => (
          <Card
            key={card.title}
            className='group relative flex flex-col overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-yellow-50/30 dark:from-zinc-900 dark:via-orange-950/30 dark:to-yellow-950/30 transition-all duration-700 hover:scale-[1.02] transform rounded-xl shadow-lg'
          >
            <CardContent className='p-6 sm:p-7 md:p-8 flex-1 relative z-10'>
              <div className='flex items-center mb-6'>
                <div
                  className='w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 mr-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500'
                  style={{
                    clipPath:
                      'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  }}
                >
                  <Utensils className='w-6 h-6 text-white' />
                </div>
                <h3 className='text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-500'>
                  {card.title}
                </h3>
              </div>

              <div className='grid grid-cols-2 gap-5 sm:gap-6'>
                {card.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex flex-col group/item cursor-pointer',
                      item.className
                    )}
                  >
                    <div className='relative mb-3 sm:mb-4 group-hover/item:scale-110 transition-transform duration-500'>
                      {/* Rectangle shape for all items */}
                      <div className='w-24 h-24 sm:w-28 sm:h-28 mx-auto bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-950/70 dark:to-yellow-950/70 flex items-center justify-center overflow-hidden relative transition-all duration-500 hover:shadow-lg group-hover/item:shadow-xl rounded-xl border-2 border-orange-200/50 dark:border-orange-800/50'>
                        {/* Animated background */}
                        <div className='absolute inset-0 bg-gradient-to-tr from-orange-200/50 via-yellow-200/30 to-orange-300/50 opacity-0 group-hover/item:opacity-100 transition-opacity duration-700 rounded-xl' />

                        <div className='relative z-10 p-2'>
                          <Image
                            src={item.image}
                            alt={item.name}
                            className='w-full h-full object-cover transition-all duration-700 group-hover/item:scale-110 rounded-lg'
                            height={80}
                            width={80}
                          />
                        </div>
                      </div>
                    </div>
                    <p className='text-center text-sm sm:text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis group-hover/item:text-orange-600 dark:group-hover/item:text-orange-400 transition-colors duration-500 text-gray-700 dark:text-gray-200'>
                      {item.name}
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>

            {card.link && (
              <CardFooter className='pt-4 pb-5 px-6 sm:pt-5 sm:pb-6 sm:px-8 relative'>
                <div className='absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-300 to-transparent z-30 pointer-events-none'></div>
                <Link
                  href={card.link.href}
                  className='group/link w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold transition-all duration-500 hover:scale-105 transform hover:shadow-lg relative overflow-hidden'
                  style={{
                    clipPath:
                      'polygon(15px 0%, 100% 0%, calc(100% - 15px) 100%, 0% 100%)',
                  }}
                >
                  {/* Animated background */}
                  <div className='absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover/link:opacity-100 transition-opacity duration-500'></div>
                  <span className='relative z-10'>{card.link.text}</span>
                  <ChevronRightIcon className='ml-2 h-5 w-5 sm:h-6 sm:w-6 transform transition-transform duration-500 group-hover/link:translate-x-2 relative z-10' />
                </Link>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    )
  }

  // Mobile layout - geometric shapes scrollable design
  return (
    <div className='relative'>
      {/* Navigation buttons - mobile only, now round */}
      <Button
        variant='outline'
        size='icon'
        className='absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-orange-200/50 hover:border-orange-300/70 dark:bg-zinc-800/90 dark:border-orange-800/50 dark:hover:border-orange-600/70 w-10 h-10 hover:scale-110 transition-all duration-300 rounded-full'
        onClick={scrollPrev}
        aria-label='Previous card'
        disabled={currentCardIndex === 0}
      >
        <ChevronLeftIcon className='h-5 w-5 text-orange-600 dark:text-orange-400' />
      </Button>

      <Button
        variant='outline'
        size='icon'
        className='absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-orange-200/50 hover:border-orange-300/70 dark:bg-zinc-800/90 dark:border-orange-800/50 dark:hover:border-orange-600/70 w-10 h-10 hover:scale-110 transition-all duration-300 rounded-full'
        onClick={scrollNext}
        aria-label='Next card'
        disabled={currentCardIndex === totalCards - 1}
      >
        <ChevronRightIcon className='h-5 w-5 text-orange-600 dark:text-orange-400' />
      </Button>

      {/* Card container with scroll snapping - mobile only */}
      <div
        className='overflow-x-auto pb-6 scrollbar-hide px-8 scroll-smooth snap-x snap-mandatory'
        ref={scrollContainerRef}
        onScroll={handleManualScroll}
        onMouseEnter={() => {
          if (autoScrollIntervalRef.current)
            clearInterval(autoScrollIntervalRef.current)
        }}
        onMouseLeave={() => {
          handleManualScroll()
        }}
      >
        <div className='flex gap-6 min-w-max'>
          {processedCards.map((card, cardIndex) => (
            <Card
              key={card.title}
              className={`card-item group relative flex flex-col w-[92vw] max-w-[420px] sm:w-[400px] flex-shrink-0 snap-center transition-all duration-700 hover:scale-[1.02] transform overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-yellow-50/30 dark:from-zinc-900 dark:via-orange-950/30 dark:to-yellow-950/30 rounded-xl shadow-lg`}
              data-index={cardIndex}
            >
              <CardContent className='p-4 sm:p-5 md:p-7 flex-1 relative z-10'>
                <div className='flex items-center mb-4 sm:mb-6'>
                  <div
                    className='w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 mr-3 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500'
                    style={{
                      clipPath:
                        'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    }}
                  >
                    <Utensils className='w-5 h-5 text-white' />
                  </div>
                  <h3 className='text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-500'>
                    {card.title}
                  </h3>
                </div>

                <div className='grid grid-cols-2 gap-4 sm:gap-5'>
                  {card.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex flex-col group/item cursor-pointer',
                        item.className
                      )}
                    >
                      <div className='bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-xl p-3 sm:p-4 flex items-center justify-center mb-2 sm:mb-3 overflow-hidden relative border-2 border-orange-100/70 dark:border-orange-800/40 hover:border-orange-300/80 dark:hover:border-orange-600/60 transition-all duration-500 hover:shadow-lg group-hover/item:shadow-xl group-hover/item:shadow-orange-200/30 dark:group-hover/item:shadow-orange-900/20'>
                        {/* Animated background */}
                        <div className='absolute inset-0 bg-gradient-to-tr from-orange-200/30 via-yellow-200/20 to-orange-300/30 opacity-0 group-hover/item:opacity-100 transition-opacity duration-700 rounded-xl' />

                        {/* Floating animation */}
                        <div className='transform transition-all duration-700 ease-out group-hover/item:translate-y-[-6px] sm:group-hover/item:translate-y-[-8px] relative z-10 group-hover/item:scale-110'>
                          <Image
                            src={item.image}
                            alt={item.name}
                            className='aspect-square object-cover max-w-full h-auto mx-auto rounded-lg shadow-sm group-hover/item:shadow-md transition-all duration-700'
                            height={100}
                            width={100}
                          />
                        </div>

                        {/* Subtle glow effect */}
                        <div className='absolute inset-0 rounded-xl bg-gradient-to-tr from-orange-400/10 to-yellow-400/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-700' />
                      </div>
                      <p className='text-center text-sm sm:text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis group-hover/item:text-orange-600 dark:group-hover/item:text-orange-400 transition-colors duration-500 text-gray-700 dark:text-gray-200'>
                        {item.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
              {card.link && (
                <CardFooter className='border-t-2 border-orange-100/50 dark:border-orange-800/30 pt-3 pb-4 px-4 sm:pt-4 sm:pb-5 sm:px-7 bg-gradient-to-r from-orange-25/30 to-yellow-25/30 dark:from-orange-950/20 dark:to-yellow-950/20'>
                  <Link
                    href={card.link.href}
                    className='text-sm sm:text-base font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-all duration-500 flex items-center group/link w-full justify-center hover:scale-105 transform'
                  >
                    <span className='relative'>
                      {card.link.text}
                      <div className='absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover/link:w-full transition-all duration-500' />
                    </span>
                    <ChevronRightIcon className='ml-2 h-4 w-4 sm:h-5 sm:w-5 transform transition-transform duration-500 group-hover/link:translate-x-1' />
                  </Link>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Enhanced pagination indicators - mobile only */}
      <div
        className='flex justify-center mt-6 gap-3'
        role='tablist'
        aria-label='Card navigation'
      >
        {Array.from({ length: totalCards }).map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full border-2 border-orange-400 dark:border-orange-600 transition-all duration-500 ${
              currentCardIndex === index
                ? 'w-8 bg-gradient-to-r from-orange-500 to-yellow-500 shadow-lg shadow-orange-300/50'
                : 'w-3 bg-orange-300/50 hover:bg-orange-400/70 hover:scale-110'
            }`}
            onClick={() => {
              setCurrentCardIndex(index)
              const cardElements =
                scrollContainerRef.current?.querySelectorAll('.card-item')
              if (cardElements && cardElements[index]) {
                scrollContainerRef.current?.scrollTo({
                  left:
                    cardElements[index].getBoundingClientRect().left +
                    scrollContainerRef.current.scrollLeft -
                    scrollContainerRef.current.getBoundingClientRect().left,
                  behavior: 'smooth',
                })
              }
            }}
            aria-label={`Go to card ${index + 1} of ${totalCards}`}
            role='tab'
            aria-selected={currentCardIndex === index}
            tabIndex={currentCardIndex === index ? 0 : -1}
          />
        ))}
      </div>
    </div>
  )
}
