import React from 'react'
import SideBarLeft from './_components/SideBarLeft'
import ChatContentArea from './_components/ChatContentArea'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Chats",
}

export default async function ChatsPage() {
const user = await getCurrentUser()

if(!user){
  return redirect('/login')
}
  return (
    <div className='relative flex w-full shadow-2xl'>
      {/* Sidebar Left */}
      <SideBarLeft user={user}/>
      {/* Sidebar Left*/}

      {/* ChatContent */}
      <ChatContentArea />
      {/* ChatContent */}
    </div>
  )
}
