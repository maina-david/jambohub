'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import React, { useState } from 'react'

interface ChatsPageProps { }

// export const metadata = {
//   title: "Chats",
// }

function ChatsPage({ }: ChatsPageProps) {
  const [message, setMessage] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSend = () => {
    // Add logic for sending the message
    // For now, let's just clear the input
    setMessage('')
  }

  return (
    <div className='relative flex h-screen w-full'>
      {/* Sidebar Left */}
      <div className="flex h-full w-1/3 flex-col">
        <div className='flex w-full items-center p-3'>
          <Input placeholder='Search for contact...' />
        </div>
        <ScrollArea className='flex-1'>
          <div className='gap-4'>
            <h5 className='mb-3.5 ml-3 text-xl font-semibold tracking-tight'>
              Chats
            </h5>
            <div className='mb-1'>
              <div className="w-full items-start border px-3 py-2">
                chat 1
              </div>
              <div className="w-full items-start border px-3 py-2">
                chat 2
              </div>
              <div className="w-full items-start border px-3 py-2">
                chat 3
              </div>
            </div>
            <h5 className='mb-3.5 ml-3 text-xl font-semibold tracking-tight'>
              Contacts
            </h5>
            <div className='mb-1'>
              <div className="w-full items-start border px-3 py-2">
                Contact 1
              </div>
              <div className="w-full items-start border px-3 py-2">
                Contact 2
              </div>
              <div className="w-full items-start border px-3 py-2">
                Contact 3
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      {/* Sidebar Left*/}

      {/* ChatContent */}
      <div className="flex-2 flex flex-col overflow-hidden">
        <ScrollArea className='flex-1'>
          {/* Your chat area content goes here */}
        </ScrollArea>
        <div className='flex p-3'>
          <Input
            value={message}
            onChange={handleInputChange}
            placeholder='Type your message...'
          />
          <Button className='ml-2' disabled={!message} onClick={handleSend}>
            <PaperPlaneIcon className='mr-2 h-4 w-4' />
            Send
          </Button>
        </div>
      </div>
      {/* ChatContent */}
    </div>
  )
}

export default ChatsPage
