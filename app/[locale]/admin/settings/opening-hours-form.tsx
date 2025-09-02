'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ISettingInput } from '@/types'
import { Clock, Calendar } from 'lucide-react'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const

export default function OpeningHoursForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const {
    watch,
    formState: { errors },
  } = form

  return (
    <Card id={id} className='shadow-sm border-0 bg-white/50 backdrop-blur-sm'>
      <CardHeader className='border-b border-border/50 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/30 dark:to-amber-950/30'>
        <CardTitle className='flex items-center gap-3 text-xl font-semibold'>
          <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg'>
            <Clock className='h-5 w-5' />
          </div>
          <div>
            <h3 className='text-lg font-semibold'>Opening Hours</h3>
            <p className='text-sm text-muted-foreground font-normal'>
              Manage your bakery&apos;s operating hours for each day of the week
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='p-6 space-y-6'>
        <div className='grid gap-6'>
          {DAYS_OF_WEEK.map((day, index) => {
            const dayErrors = errors.openingHours?.[index]

            return (
              <Card
                key={day.key}
                className='border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200'
              >
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <Calendar className='h-4 w-4 text-muted-foreground' />
                      <h4 className='font-medium text-base'>{day.label}</h4>
                    </div>
                    <FormField
                      control={form.control}
                      name={`openingHours.${index}.isOpen`}
                      render={({ field }) => (
                        <FormItem className='flex items-center gap-2'>
                          <FormControl>
                            <Checkbox
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className='text-sm font-medium'>
                            {field.value ? 'Open' : 'Closed'}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  {watch(`openingHours.${index}.isOpen`) && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name={`openingHours.${index}.openTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium text-muted-foreground'>
                              Opening Time
                            </FormLabel>
                            <FormControl>
                              <Input
                                type='time'
                                {...field}
                                value={
                                  field.value ||
                                  (watch(`openingHours.${index}.isOpen`)
                                    ? '09:00'
                                    : '')
                                }
                                className='bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20'
                              />
                            </FormControl>
                            <FormMessage className='text-xs'>
                              {dayErrors?.openTime?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`openingHours.${index}.closeTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium text-muted-foreground'>
                              Closing Time
                            </FormLabel>
                            <FormControl>
                              <Input
                                type='time'
                                {...field}
                                value={
                                  field.value ||
                                  (watch(`openingHours.${index}.isOpen`)
                                    ? '17:00'
                                    : '')
                                }
                                className='bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20'
                              />
                            </FormControl>
                            <FormMessage className='text-xs'>
                              {dayErrors?.closeTime?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {!watch(`openingHours.${index}.isOpen`) && (
                    <div className='text-center py-4'>
                      <p className='text-sm text-muted-foreground italic'>
                        Closed on {day.label}s
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className='mt-6 p-4 bg-blue-50/50 dark:bg-blue-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50'>
          <div className='flex items-start gap-3'>
            <div className='flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 mt-0.5'>
              <Clock className='h-3.5 w-3.5' />
            </div>
            <div className='flex-1'>
              <h4 className='text-sm font-medium text-blue-900 dark:text-blue-100 mb-1'>
                Opening Hours Information
              </h4>
              <p className='text-xs text-blue-700 dark:text-blue-300 leading-relaxed'>
                Orders placed outside of opening hours will be prevented. Make
                sure to set realistic hours that match your business operations.
                Time format should be in 24-hour format (HH:MM).
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
