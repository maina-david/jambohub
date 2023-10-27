import React from 'react'
import ChatArea from './_components/ChatArea'

export const metadata = {
  title: "Chats",
}

export default function ChatsPage() {
  return (
    <div className='flex shadow-2xl'>
      <ChatArea />
    </div>
  )
}
