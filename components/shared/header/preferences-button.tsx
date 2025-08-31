'use client'

import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Settings,
  Languages,
  DollarSign,
  ChevronRight,
  Moon,
  Sun,
  Globe,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { i18n } from '@/i18n-config'
import useSettingStore from '@/hooks/use-setting-store'
import { setCurrencyOnServer } from '@/lib/actions/setting.actions'
import { useRouter } from 'next/navigation'
import useIsMounted from '@/hooks/use-is-mounted'
import LoadingOverlay from '@/components/shared/loading-overlay'

export default function PreferencesButton() {
  const { theme, setTheme } = useTheme()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const isMounted = useIsMounted()

  const {
    setting: { availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()

  const [languageLoading, setLanguageLoading] = React.useState(false)
  const [currencyLoading, setCurrencyLoading] = React.useState(false)

  const { locales } = i18n
  const currentLocale = locales.find((l) => l.code === locale)
  const selectedCurrency = availableCurrencies.find((c) => c.code === currency)

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === locale) return
    setLanguageLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
    } catch (error) {
      console.error('Failed to change language:', error)
      setLanguageLoading(false)
    }
  }

  const handleCurrencyChange = async (newCurrency: string) => {
    if (newCurrency === currency) return
    setCurrencyLoading(true)
    try {
      await setCurrencyOnServer(newCurrency)
      setCurrency(newCurrency)
      await new Promise((resolve) => setTimeout(resolve, 800))
      router.refresh()
    } catch (error) {
      console.error('Failed to change currency:', error)
    } finally {
      setCurrencyLoading(false)
    }
  }

  return (
    <>
      <LoadingOverlay
        isVisible={languageLoading}
        type='language'
        message='Switching language interface...'
      />
      <LoadingOverlay
        isVisible={currencyLoading}
        type='currency'
        message='Updating prices and currency...'
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='group h-8 sm:h-10 px-2 sm:px-3 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-gray-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 focus:ring-2 focus:ring-orange-500/20'
          >
            <Settings className='h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200' />
            <span className='hidden sm:inline ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-200'>
              Preferences
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className='w-64 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 shadow-xl rounded-2xl p-2 max-h-[70vh] overflow-auto'
          align='center'
          side='bottom'
        >
          <DropdownMenuLabel className='px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white'>
            Site Preferences
          </DropdownMenuLabel>

          <DropdownMenuSeparator className='bg-gray-200 dark:bg-zinc-700' />

          {/* Theme Settings */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className='flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200'>
              <div className='flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg'>
                {theme === 'dark' && isMounted ? (
                  <Moon className='h-4 w-4 text-orange-600 dark:text-orange-400' />
                ) : (
                  <Sun className='h-4 w-4 text-orange-600 dark:text-orange-400' />
                )}
              </div>
              <div className='flex-1'>
                <div className='font-medium text-gray-900 dark:text-white text-sm'>
                  Theme
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  {theme === 'dark' && isMounted ? 'Dark mode' : 'Light mode'}
                </div>
              </div>
              <ChevronRight className='h-4 w-4 text-gray-400' />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className='bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 shadow-lg rounded-xl p-1 max-h-[55vh] overflow-auto'>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={handleThemeChange}
              >
                <DropdownMenuRadioItem
                  value='light'
                  className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200'
                >
                  <Sun className='h-4 w-4 text-orange-600 dark:text-orange-400' />
                  <span className='text-sm font-medium'>Light mode</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value='dark'
                  className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200'
                >
                  <Moon className='h-4 w-4 text-orange-600 dark:text-orange-400' />
                  <span className='text-sm font-medium'>Dark mode</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Language Settings */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className='flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200'>
              <div className='flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
                <Languages className='h-4 w-4 text-blue-600 dark:text-blue-400' />
              </div>
              <div className='flex-1'>
                <div className='font-medium text-gray-900 dark:text-white text-sm'>
                  Language
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  {currentLocale?.name || 'English'}
                </div>
              </div>
              <ChevronRight className='h-4 w-4 text-gray-400' />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className='bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 shadow-lg rounded-xl p-1 max-h-[55vh] overflow-auto'>
              {locales.map((loc) => (
                <Link
                  key={loc.code}
                  href={pathname}
                  locale={loc.code}
                  onClick={() => handleLanguageChange(loc.code)}
                  className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 break-words whitespace-normal'
                >
                  <div className='flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full'>
                    <Globe className='h-3 w-3 text-blue-600 dark:text-blue-400' />
                  </div>
                  {loc.name}
                  {locale === loc.code && (
                    <div className='ml-auto w-2 h-2 bg-blue-500 rounded-full' />
                  )}
                </Link>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Currency Settings */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className='flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200'>
              <div className='flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg'>
                <DollarSign className='h-4 w-4 text-green-600 dark:text-green-400' />
              </div>
              <div className='flex-1'>
                <div className='font-medium text-gray-900 dark:text-white text-sm'>
                  Currency
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  {selectedCurrency?.name || 'USD'}
                </div>
              </div>
              <ChevronRight className='h-4 w-4 text-gray-400' />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className='bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 shadow-lg rounded-xl p-1 max-h-[55vh] overflow-auto'>
              {availableCurrencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => handleCurrencyChange(curr.code)}
                  className='w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-300 break-words whitespace-normal'
                >
                  <div className='flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full'>
                    <span className='text-xs font-bold text-green-600 dark:text-green-400'>
                      {curr.symbol}
                    </span>
                  </div>
                  <div className='flex-1 text-left'>
                    <div className='font-medium'>{curr.name}</div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                      {curr.code}
                    </div>
                  </div>
                  {currency === curr.code && (
                    <div className='w-2 h-2 bg-green-500 rounded-full' />
                  )}
                </button>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
