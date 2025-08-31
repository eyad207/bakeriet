'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface HeaderSearchProps {
  compact?: boolean
  className?: string
}

export default function HeaderSearch({
  compact = false,
  className = '',
}: HeaderSearchProps) {
  const [query, setQuery] = useState('')
  // Removed category state
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Debounced suggestions fetch
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const response = await fetch(
            `/api/search-suggestions?q=${encodeURIComponent(query)}&limit=5`
          )
          const data = await response.json()
          setSuggestions(data.suggestions || [])
          setShowSuggestions(true)
        } catch {
          // Silently fail for header search
          setSuggestions([])
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 150) // Faster response for header

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      const searchParams = new URLSearchParams()
      searchParams.set('q', query.trim())
      const searchUrl = `/search?${searchParams.toString()}`
      router.push(searchUrl)
      setShowSuggestions(false)
    }
  }, [query, router])

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setQuery(suggestion)
      setShowSuggestions(false)
      const searchParams = new URLSearchParams()
      searchParams.set('q', suggestion)
      const searchUrl = `/search?${searchParams.toString()}`
      router.push(searchUrl)
    },
    [router]
  )

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSuggestionClick(suggestions[selectedIndex])
          } else {
            handleSearch()
          }
          break
        case 'Escape':
          setShowSuggestions(false)
          setSelectedIndex(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [
    showSuggestions,
    selectedIndex,
    suggestions,
    handleSuggestionClick,
    handleSearch,
  ])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Form classes for header integration
  const formClasses = cn(
    'group flex items-stretch overflow-hidden rounded-2xl bg-white dark:bg-zinc-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-zinc-700/50 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-300 dark:focus-within:border-orange-600',
    compact ? 'h-10 nav:h-11' : 'h-12',
    className
  )

  const heightClass = 'h-full'

  return (
    <div className='relative w-full'>
      <form
        action='/search'
        method='GET'
        className={formClasses}
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
      >
        {/* Search Input */}
        <div className='relative flex-1'>
          <Input
            ref={inputRef}
            className={cn(
              'border-0 bg-transparent text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none min-w-0 pr-12',
              heightClass,
              compact ? 'text-sm px-3' : 'text-base px-4'
            )}
            placeholder={
              compact ? 'Search menu...' : 'Search our restaurant menu...'
            }
            name='q'
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true)
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' && selectedIndex === -1) {
                e.preventDefault()
                handleSearch()
              }
            }}
            role='searchbox'
            aria-label='Search for products'
            aria-autocomplete='list'
            aria-describedby='search-instructions'
          />
          <div id='search-instructions' className='sr-only'>
            Use arrow keys to navigate suggestions, Enter to select, Escape to
            close
          </div>
        </div>

        {/* Search Button */}
        <button
          type='submit'
          className={cn(
            'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:from-orange-700 active:to-orange-800 text-white rounded-r-2xl transition-all duration-200 flex items-center justify-center group-hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2',
            heightClass,
            compact ? 'px-3 sm:px-4' : 'px-5 sm:px-6'
          )}
          aria-label='Search for products'
        >
          <Search
            className={cn(
              'transition-transform duration-200 group-hover:scale-110',
              compact ? 'w-4 h-4' : 'w-5 h-5'
            )}
          />
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className='absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-gray-200/50 dark:border-zinc-700/50 rounded-2xl shadow-xl backdrop-blur-sm z-50 max-h-64 overflow-hidden'
          role='listbox'
          aria-label='Search suggestions'
        >
          <div className='py-2'>
            <div className='px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-700'>
              Quick Suggestions
            </div>
            <div className='overflow-y-auto max-h-48'>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    'w-full text-left px-4 py-3 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 group',
                    index === selectedIndex &&
                      'bg-orange-50 dark:bg-orange-900/30 border-r-4 border-orange-500'
                  )}
                  role='option'
                  aria-selected={index === selectedIndex}
                  tabIndex={-1}
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors duration-200'>
                      <Search
                        className='h-4 w-4 text-orange-600 dark:text-orange-400'
                        aria-hidden='true'
                      />
                    </div>
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-200'>
                      {suggestion}
                    </span>
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
