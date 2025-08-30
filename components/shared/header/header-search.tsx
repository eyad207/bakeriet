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
    'flex items-stretch shadow-md rounded-md overflow-hidden',
    compact ? 'h-9 nav:h-10' : 'h-10',
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
        {/* Modern Search Bar - No Category Select */}

        {/* Search Input */}
        <div className='relative flex-1'>
          <Input
            ref={inputRef}
            className={cn(
              'rounded-none dark:border-gray-300 bg-gray-100 text-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-w-0 pr-12',
              heightClass,
              compact ? 'text-xs xs:text-sm' : 'text-sm xs:text-base'
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
            'bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground text-black rounded-s-none rounded-e-md transition-colors duration-200 flex items-center justify-center',
            heightClass,
            compact ? 'px-1.5 sm:px-2' : 'px-3 sm:px-4'
          )}
          aria-label='Search for products'
        >
          <Search className='w-3 h-3 xs:w-4 xs:h-4' />
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto'
          role='listbox'
          aria-label='Search suggestions'
        >
          <div className='py-2'>
            <div className='px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Suggestions
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  'w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors',
                  index === selectedIndex &&
                    'bg-blue-50 border-r-2 border-blue-500'
                )}
                role='option'
                aria-selected={index === selectedIndex}
                tabIndex={-1}
              >
                <div className='flex items-center gap-2'>
                  <Search
                    className='h-3 w-3 text-gray-400'
                    aria-hidden='true'
                  />
                  <span className='text-sm text-gray-900'>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
