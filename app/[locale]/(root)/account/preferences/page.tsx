import { Metadata } from 'next'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import ThemeSwitcher from '@/components/shared/header/theme-switcher'
import { Moon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Preferences',
}

export default async function PreferencesPage() {
  return (
    <div className='mb-24'>
      <div className='flex gap-2 text-sm text-muted-foreground'>
        <Link href='/account' className='hover:text-foreground'>
          Your Account
        </Link>
        <span>›</span>
        <span className='font-medium'>Preferences</span>
      </div>

      <header className='mt-4 mb-6'>
        <h1 className='text-3xl font-extrabold'>Preferences</h1>
        <p className='text-muted-foreground mt-2 max-w-2xl'>
          Manage your theme preferences for a better dining experience
        </p>
      </header>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card className='hover:shadow-lg transition'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <Moon className='w-6 h-6 text-primary' />
              <div>
                <CardTitle>Theme</CardTitle>
                <CardDescription className='text-sm'>
                  Switch between light and dark mode for comfortable browsing
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ThemeSwitcher />
          </CardContent>
        </Card>
      </div>

      <Separator className='my-8' />
    </div>
  )
}
