import React from 'react'
import ChatArea from './_components/ChatArea'

export const metadata = {
  title: "Chats",
}

export default function ChatsPage() {
  return (
    <div className='relative flex w-full shadow-2xl'>
      <ChatArea />
    </div>
  )
}
