'use client'
import { memo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import useSettingStore from '@/hooks/use-setting-store'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
} from 'lucide-react'

// Lazy-load ChevronUp to reduce initial JS size
const ChevronUp = dynamic(
  () => import('lucide-react').then((m) => m.ChevronUp),
  { ssr: false }
)

function FooterComponent() {
  const {
    setting: { site },
  } = useSettingStore()
  const t = useTranslations()

  return (
    <footer className='relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white mt-20 overflow-hidden'>
      {/* Modern geometric background */}
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-0 w-full h-full opacity-5'>
          <div className='absolute top-10 left-10 w-32 h-32 bg-orange-500 rounded-full blur-xl'></div>
          <div className='absolute top-32 right-20 w-24 h-24 bg-orange-400 rounded-full blur-lg'></div>
          <div className='absolute bottom-20 left-1/3 w-40 h-40 bg-orange-600 rounded-full blur-2xl'></div>
        </div>
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
      </div>

      <div className='relative z-10'>
        {/* Back to top button with enhanced styling */}
        <div className='border-b border-zinc-700/50'>
          <Button
            variant='ghost'
            className='group w-full bg-zinc-800/50 backdrop-blur-sm hover:bg-orange-500/10 rounded-none py-6 text-gray-300 hover:text-white font-medium transition-all duration-300 border-0'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ChevronUp className='mr-3 h-5 w-5 group-hover:transform group-hover:-translate-y-1 transition-transform duration-300' />
            <span className='text-base'>{t('Footer.Back to top')}</span>
          </Button>
        </div>

        {/* Main footer content */}
        <div className='border-b border-zinc-700/50'>
          <div className='max-w-7xl mx-auto py-20 px-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
              {/* Brand Section */}
              <div className='lg:col-span-2 space-y-8'>
                <div className='flex items-center space-x-4'>
                  <div className='relative group'>
                    <div className='absolute inset-0 bg-orange-500/30 rounded-full opacity-75 group-hover:opacity-100 blur-md transition-opacity duration-300'></div>
                    <Image
                      src={site.logo}
                      alt={`${site.name} logo`}
                      width={72}
                      height={72}
                      priority
                      className='relative rounded-full shadow-2xl ring-4 ring-orange-500/20'
                    />
                  </div>
                  <div>
                    <h3 className='text-3xl font-bold text-white mb-2'>
                      {site.name}
                    </h3>
                    <p className='text-orange-300 text-lg font-medium'>
                      Authentic Norwegian Bakery
                    </p>
                  </div>
                </div>

                <p className='text-gray-300 leading-relaxed text-lg max-w-lg'>
                  Experience the finest Norwegian baking traditions with our
                  freshly baked breads, pastries, and delicacies. Made with
                  love, served with pride.
                </p>

                {/* Enhanced Contact Info */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='flex items-center space-x-3 p-4 bg-zinc-800/50 rounded-2xl backdrop-blur-sm border border-zinc-700/30 hover:border-orange-500/30 transition-colors duration-300'>
                    <div className='flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-xl'>
                      <MapPin className='w-6 h-6 text-orange-400' />
                    </div>
                    <div>
                      <p className='text-sm text-gray-400 font-medium'>
                        Location
                      </p>
                      <p className='text-white font-semibold'>{site.address}</p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3 p-4 bg-zinc-800/50 rounded-2xl backdrop-blur-sm border border-zinc-700/30 hover:border-orange-500/30 transition-colors duration-300'>
                    <div className='flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-xl'>
                      <Phone className='w-6 h-6 text-orange-400' />
                    </div>
                    <div>
                      <p className='text-sm text-gray-400 font-medium'>
                        Call Us
                      </p>
                      <p className='text-white font-semibold'>{site.phone}</p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3 p-4 bg-zinc-800/50 rounded-2xl backdrop-blur-sm border border-zinc-700/30 hover:border-orange-500/30 transition-colors duration-300'>
                    <div className='flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-xl'>
                      <Mail className='w-6 h-6 text-orange-400' />
                    </div>
                    <div>
                      <p className='text-sm text-gray-400 font-medium'>Email</p>
                      <p className='text-white font-semibold'>
                        info@bakeriet.no
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3 p-4 bg-zinc-800/50 rounded-2xl backdrop-blur-sm border border-zinc-700/30 hover:border-orange-500/30 transition-colors duration-300'>
                    <div className='flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-xl'>
                      <Clock className='w-6 h-6 text-orange-400' />
                    </div>
                    <div>
                      <p className='text-sm text-gray-400 font-medium'>Hours</p>
                      <p className='text-white font-semibold'>7:00 - 19:00</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className='text-lg font-semibold text-white mb-4'>
                    Follow Us
                  </h4>
                  <div className='flex space-x-4'>
                    {[
                      { icon: Instagram, href: '#', label: 'Instagram' },
                      { icon: Facebook, href: '#', label: 'Facebook' },
                      { icon: Twitter, href: '#', label: 'Twitter' },
                    ].map((social, index) => (
                      <Link
                        key={index}
                        href={social.href}
                        className='flex items-center justify-center w-12 h-12 bg-zinc-800/50 hover:bg-orange-500/20 rounded-xl border border-zinc-700/30 hover:border-orange-500/50 transition-all duration-300 group'
                        aria-label={social.label}
                      >
                        <social.icon className='w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors duration-300' />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className='space-y-6'>
                <h4 className='text-xl font-bold text-white flex items-center gap-2'>
                  <ArrowRight className='w-5 h-5 text-orange-500' />
                  Quick Links
                </h4>
                <div className='space-y-3'>
                  {[
                    { href: '/page/about-us', label: 'About Us' },
                    {
                      href: '/page/customer-service',
                      label: 'Customer Service',
                    },
                    { href: '/page/contact-us', label: 'Contact Us' },
                    { href: '/page/help', label: 'Help Center' },
                  ].map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className='group flex items-center text-gray-300 hover:text-orange-400 transition-all duration-300'
                    >
                      <div className='w-2 h-2 bg-orange-500/50 rounded-full mr-3 group-hover:bg-orange-400 transition-colors duration-300'></div>
                      <span className='group-hover:translate-x-1 transition-transform duration-300'>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className='space-y-6'>
                <h4 className='text-xl font-bold text-white flex items-center gap-2'>
                  <ArrowRight className='w-5 h-5 text-orange-500' />
                  Our Services
                </h4>
                <div className='space-y-3'>
                  {[
                    { href: '/menu', label: 'Fresh Bakery' },
                    { href: '/order', label: 'Online Orders' },
                    { href: '/catering', label: 'Catering' },
                    { href: '/special-orders', label: 'Special Orders' },
                  ].map((service, index) => (
                    <Link
                      key={index}
                      href={service.href}
                      className='group flex items-center text-gray-300 hover:text-orange-400 transition-all duration-300'
                    >
                      <div className='w-2 h-2 bg-orange-500/50 rounded-full mr-3 group-hover:bg-orange-400 transition-colors duration-300'></div>
                      <span className='group-hover:translate-x-1 transition-transform duration-300'>
                        {service.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className='py-8 px-6 bg-black/20 backdrop-blur-sm'>
          <div className='max-w-7xl mx-auto'>
            {/* Legal Links */}
            <div className='flex flex-wrap justify-center gap-8 mb-6'>
              {[
                {
                  href: '/page/conditions-of-use',
                  label: t('Footer.Conditions of Use'),
                },
                {
                  href: '/page/privacy-policy',
                  label: t('Footer.Privacy Notice'),
                },
                { href: '/page/help', label: t('Footer.Help') },
              ].map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className='text-sm text-gray-400 hover:text-orange-400 transition-all duration-300 hover:underline underline-offset-4 decoration-orange-400'
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <div className='text-center border-t border-zinc-700/50 pt-6'>
              <p className='text-sm text-gray-400 mb-2'>© {site.copyright}</p>
              <p className='text-xs text-gray-500 flex items-center justify-center gap-1'>
                Made with <Heart className='w-3 h-3 text-red-500' /> for an
                exceptional bakery experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default memo(FooterComponent)
