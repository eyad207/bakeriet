'use client'

import * as React from 'react'
import { Settings, Languages, DollarSign, Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLocale } from 'next-intl'
import { i18n } from '@/i18n-config'
import useSettingStore from '@/hooks/use-setting-store'
import { setCurrencyOnServer } from '@/lib/actions/setting.actions'
import { useRouter } from 'next/navigation'
import useIsMounted from '@/hooks/use-is-mounted'

export default function PreferencesInline() {
  const { theme, setTheme } = useTheme()
  const locale = useLocale()
  const router = useRouter()
  const isMounted = useIsMounted()

  const {
    setting: { availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()

  const [open, setOpen] = React.useState(false)
  const [, setLangLoading] = React.useState(false)
  const [, setCurrencyLoading] = React.useState(false)

  const { locales } = i18n

  const handleThemeChange = (newTheme: string) => setTheme(newTheme)

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === locale) return
    setLangLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
    } finally {
      setLangLoading(false)
    }
  }

  const handleCurrencyChange = async (newCurrency: string) => {
    if (newCurrency === currency) return
    setCurrencyLoading(true)
    try {
      await setCurrencyOnServer(newCurrency)
      setCurrency(newCurrency)
      router.refresh()
    } finally {
      setCurrencyLoading(false)
    }
  }

  return (
    <div className='w-full'>
      <div className='flex justify-center'>
        <button
          onClick={() => setOpen((s) => !s)}
          className='group h-10 sm:h-12 px-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all shadow-sm'
          aria-expanded={open}
        >
          <div className='flex items-center gap-2'>
            <Settings className='h-4 w-4 text-orange-500' />
            <span className='font-medium hidden sm:inline'>Preferences</span>
          </div>
        </button>
      </div>

      {open && (
        <div className='mt-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-2 space-y-2'>
          {/* Theme */}
          <div className='flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20'>
            <div className='flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg'>
              {theme === 'dark' && isMounted ? (
                <Moon className='h-4 w-4 text-orange-600' />
              ) : (
                <Sun className='h-4 w-4 text-orange-600' />
              )}
            </div>
            <div className='flex-1'>
              <div className='font-medium text-sm text-gray-900 dark:text-white'>
                Theme
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                {theme === 'dark' && isMounted ? 'Dark mode' : 'Light mode'}
              </div>
            </div>
            <div className='flex gap-1'>
              <button
                onClick={() => handleThemeChange('light')}
                className={`px-2 py-1 rounded ${theme === 'light' ? 'bg-orange-100' : 'bg-transparent'}`}
              >
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-orange-100' : 'bg-transparent'}`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Language */}
          <div className='px-2 py-2 rounded-lg'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
                <Languages className='h-4 w-4 text-blue-600' />
              </div>
              <div className='flex-1'>
                <div className='font-medium text-sm text-gray-900 dark:text-white'>
                  Language
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  Select site language
                </div>
              </div>
            </div>
            <div className='mt-2 grid grid-cols-2 gap-2'>
              {locales.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => handleLanguageChange(loc.code)}
                  className='w-full text-left px-2 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20'
                >
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center'>
                      <Globe className='h-3 w-3 text-blue-600' />
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium'>{loc.name}</div>
                      <div className='text-xs text-gray-500'>{loc.code}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div className='px-2 py-2 rounded-lg'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg'>
                <DollarSign className='h-4 w-4 text-green-600' />
              </div>
              <div className='flex-1'>
                <div className='font-medium text-sm text-gray-900 dark:text-white'>
                  Currency
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  Choose display currency
                </div>
              </div>
            </div>
            <div className='mt-2 space-y-2'>
              {availableCurrencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => handleCurrencyChange(curr.code)}
                  className='w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20'
                >
                  <div className='flex items-center justify-center w-6 h-6 bg-green-100 rounded-full'>
                    <span className='text-xs font-bold text-green-600'>
                      {curr.symbol}
                    </span>
                  </div>
                  <div className='flex-1 text-left'>
                    <div className='font-medium'>{curr.name}</div>
                    <div className='text-xs text-gray-500'>{curr.code}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
