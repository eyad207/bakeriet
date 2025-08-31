import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { getAllCategories } from '@/lib/actions/product.actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'
import { cn } from '@/lib/utils'

export default async function Search({
  compact = false,
}: {
  compact?: boolean
}) {
  const {
    site: { name },
  } = await getSetting()
  const categories = await getAllCategories()

  const t = await getTranslations()

  // Different classes based on compact mode (mobile) vs full mode (desktop)
  const formClasses = cn(
    'group flex items-stretch overflow-hidden rounded-2xl bg-white dark:bg-zinc-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-zinc-700/50 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-300 dark:focus-within:border-orange-600',
    compact ? 'h-10 nav:h-11' : 'h-12'
  )

  // Common height class to apply to all components
  const heightClass = 'h-full'

  return (
    <form action='/search' method='GET' className={formClasses}>
      <Select name='category'>
        <SelectTrigger
          className={cn(
            'w-auto border-0 bg-transparent hover:bg-gray-50 dark:hover:bg-zinc-700/50 text-gray-700 dark:text-gray-200 rounded-r-none transition-colors duration-200',
            heightClass,
            compact
              ? 'min-w-[50px] xs:min-w-[70px] text-xs'
              : 'min-w-[90px] xs:min-w-[110px] text-sm'
          )}
        >
          <SelectValue placeholder={t('Header.All')} />
        </SelectTrigger>
        <SelectContent
          position='popper'
          className='min-w-[150px] bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 shadow-lg rounded-xl'
        >
          <SelectItem
            value='all'
            className='hover:bg-orange-50 dark:hover:bg-orange-900/20 focus:bg-orange-50 dark:focus:bg-orange-900/20'
          >
            {t('Header.All')}
          </SelectItem>
          {categories.map((category) => (
            <SelectItem
              key={category}
              value={category}
              className='hover:bg-orange-50 dark:hover:bg-orange-900/20 focus:bg-orange-50 dark:focus:bg-orange-900/20'
            >
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className='w-px bg-gray-200 dark:bg-zinc-600' />

      <Input
        className={cn(
          'flex-1 border-0 bg-transparent text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none min-w-0',
          heightClass,
          compact ? 'text-sm px-3' : 'text-base px-4'
        )}
        placeholder={
          compact ? t('Header.Search') : t('Header.Search Site', { name })
        }
        name='q'
        type='search'
      />

      <button
        type='submit'
        className={cn(
          'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:from-orange-700 active:to-orange-800 text-white rounded-r-2xl transition-all duration-200 flex items-center justify-center group-hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2',
          heightClass,
          compact ? 'px-3 sm:px-4' : 'px-5 sm:px-6'
        )}
        aria-label={t('Header.Search')}
      >
        <SearchIcon
          className={cn(
            'transition-transform duration-200 group-hover:scale-110',
            compact ? 'w-4 h-4' : 'w-5 h-5'
          )}
        />
      </button>
    </form>
  )
}
