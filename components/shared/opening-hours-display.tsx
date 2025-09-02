'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar } from 'lucide-react'
import { OpeningHour } from '@/types'
import { isWithinOpeningHours, getNextOpeningTime } from '@/lib/utils'

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const

export default function OpeningHoursDisplay({
  openingHours,
  showTitle = true,
  compact = false,
}: {
  openingHours: OpeningHour[]
  showTitle?: boolean
  compact?: boolean
}) {
  const status = isWithinOpeningHours(openingHours)
  const nextOpeningTime = !status.isOpen
    ? getNextOpeningTime(openingHours)
    : null

  const today = new Date().getDay()
  const dayMap = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]
  const todayString = dayMap[today]

  if (compact) {
    return (
      <div className='flex items-center gap-2 text-sm'>
        <Clock className='h-4 w-4' />
        <Badge
          variant={status.isOpen ? 'default' : 'destructive'}
          className={
            status.isOpen ? 'bg-green-100 text-green-800 border-green-200' : ''
          }
        >
          {status.isOpen ? 'Open Now' : 'Closed'}
        </Badge>
        {!status.isOpen && nextOpeningTime && (
          <span className='text-muted-foreground'>Opens {nextOpeningTime}</span>
        )}
      </div>
    )
  }

  return (
    <Card className='shadow-sm border-0 bg-white/50 backdrop-blur-sm'>
      {showTitle && (
        <CardHeader className='pb-3 border-b border-border/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30'>
          <CardTitle className='flex items-center gap-3 text-lg font-semibold'>
            <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white'>
              <Clock className='h-4 w-4' />
            </div>
            <div>
              <h3 className='font-semibold'>Opening Hours</h3>
              <div className='flex items-center gap-2 mt-1'>
                <Badge
                  variant={status.isOpen ? 'default' : 'destructive'}
                  className={
                    status.isOpen
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : ''
                  }
                >
                  {status.isOpen ? 'Open Now' : 'Closed'}
                </Badge>
                {status.message && (
                  <span className='text-sm text-muted-foreground'>
                    {status.message}
                  </span>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className='p-4'>
        <div className='space-y-2'>
          {DAYS_OF_WEEK.map((day) => {
            const dayHours = openingHours.find((h) => h.day === day.key)
            const isToday = day.key === todayString

            return (
              <div
                key={day.key}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  isToday
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className='flex items-center gap-2'>
                  {isToday && <Calendar className='h-4 w-4 text-primary' />}
                  <span
                    className={`font-medium ${isToday ? 'text-primary' : ''}`}
                  >
                    {day.label}
                    {isToday && <span className='text-xs ml-1'>(Today)</span>}
                  </span>
                </div>

                <div className='text-sm'>
                  {dayHours?.isOpen ? (
                    <span className='text-green-700 dark:text-green-400'>
                      {dayHours.openTime} - {dayHours.closeTime}
                    </span>
                  ) : (
                    <span className='text-muted-foreground'>Closed</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {!status.isOpen && nextOpeningTime && (
          <div className='mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50'>
            <div className='flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300'>
              <Clock className='h-4 w-4' />
              <span>We&apos;ll be open again on {nextOpeningTime}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
