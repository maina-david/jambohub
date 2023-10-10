import React from 'react'
import SideBarLeft from './_components/SideBarLeft'
import ChatContentArea from './_components/ChatContentArea'

export const metadata = {
  title: "Chats",
}

export default function ChatsPage() {

  return (
    <div className='relative flex w-full shadow-2xl'>
      {/* Sidebar Left */}
      <SideBarLeft />
      {/* Sidebar Left*/}

      {/* ChatContent */}
      <ChatContentArea />
      {/* ChatContent */}
    </div>
  )
}
