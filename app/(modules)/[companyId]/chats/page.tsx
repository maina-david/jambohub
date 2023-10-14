import React from 'react'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'
import ChatArea from './_components/ChatArea'

export const metadata = {
  title: "Chats",
}

export default async function ChatsPage() {
  const user = await getCurrentUser()

  if (!user) {
    return redirect('/login')
  }
  return (
    <div className='relative flex w-full shadow-2xl'>
      <ChatArea user={user} />
    </div>
  )
}
