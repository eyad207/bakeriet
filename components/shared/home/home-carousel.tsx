'use client'

import * as React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ICarousel } from '@/types'
import { ChefHat, Star } from 'lucide-react'

export function HomeCarousel({ items }: { items: ICarousel[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  return (
    <div className='relative w-full mx-auto mb-6 sm:mb-8'>
      <Carousel
        dir='ltr'
        plugins={[plugin.current]}
        className='w-full rounded-b-3xl overflow-hidden shadow-2xl'
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={`${item.title}-${index}`}>
              <Link href={item.url} className='block relative group'>
                <div className='relative aspect-[10/9] sm:aspect-[16/8] md:aspect-[16/7] overflow-hidden'>
                  {/* Background Image with Overlay */}
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-105'
                    priority
                  />
                  {/* Gradient Overlay for Better Text Readability */}
                  <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent' />

                  {/* Content Container */}
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full max-w-2xl px-6 sm:px-12 md:px-16 lg:px-20'>
                      {/* Restaurant Badge */}
                      <div className='flex items-center gap-2 mb-3 sm:mb-4'>
                        <div className='flex items-center gap-1 bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium'>
                          <ChefHat className='h-3 w-3 sm:h-4 sm:w-4' />
                          Fresh Daily
                        </div>
                        <div className='flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium'>
                          <Star className='h-3 w-3 sm:h-4 sm:w-4 fill-current' />
                          Chef&apos;s Special
                        </div>
                      </div>

                      {/* Main Title */}
                      <h2 className=' sm:w-50 text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 text-white leading-tight drop-shadow-2xl'>
                        {item.title}
                      </h2>

                      {/* Call-to-Action Button */}
                      <div className='flex items-center gap-3 sm:gap-4'>
                        <Button
                          size='lg'
                          className='bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-yellow-400 hover:to-orange-500 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0'
                        >
                          {item.buttonCaption}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className='absolute top-4 right-4 sm:top-6 sm:right-6 opacity-20'>
                    <ChefHat className='h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-white' />
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className='hidden sm:flex left-4 md:left-8 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-md hover:scale-110 transition-all duration-200' />
        <CarouselNext className='hidden sm:flex right-4 md:right-8 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-md hover:scale-110 transition-all duration-200' />

        {/* Carousel Indicators */}
        <div className='absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2'>
          {items.map((_, index) => (
            <div
              key={index}
              className='w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/50 backdrop-blur-sm'
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}
