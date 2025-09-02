'use client'

import { useState } from 'react'
import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProductGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(0)

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className='space-y-4'>
      {/* Main Image */}
      <div className='relative group bg-gradient-to-br from-orange-50 to-amber-50 dark:from-zinc-800 dark:to-zinc-700 rounded-2xl overflow-hidden'>
        <div className='relative h-[400px] md:h-[500px] lg:h-[600px]'>
          <Zoom>
            <Image
              src={images[selectedImage]}
              alt={`Product image ${selectedImage + 1}`}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in'
              priority
            />
          </Zoom>
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant='secondary'
              size='icon'
              className='absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm'
              onClick={prevImage}
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
            <Button
              variant='secondary'
              size='icon'
              className='absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm'
              onClick={nextImage}
            >
              <ChevronRight className='w-4 h-4' />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className='absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm'>
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide'>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              onMouseOver={() => setSelectedImage(index)}
              className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden transition-all duration-300 ${
                selectedImage === index
                  ? 'ring-2 ring-orange-500 shadow-lg scale-105'
                  : 'ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-orange-300 hover:scale-102'
              }`}
            >
              <Image
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                fill
                sizes='96px'
                className='object-cover'
              />
              {selectedImage === index && (
                <div className='absolute inset-0 bg-orange-500/20' />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
