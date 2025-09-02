import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import OrdersClient from './orders-client'

export const metadata: Metadata = {
  title: 'Admin Orders',
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session || session.user.role !== 'Admin') {
    redirect('/sign-in')
  }

  return <OrdersClient />
}
