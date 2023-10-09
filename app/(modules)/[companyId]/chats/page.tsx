'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { PhoneCallIcon, SearchIcon, VideoIcon } from 'lucide-react'
import React, { useState } from 'react'

// export const metadata = {
//   title: "Chats",
// }

function ChatsPage() {
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
    <div className='relative flex w-full'>
      {/* Sidebar Left */}
      <div className="flex h-full w-1/3 flex-col">
        <div className='flex w-full items-center p-3'>
          <Input placeholder='Search for contact...' />
        </div>
        <div className="h-[calc(100% - 4.0625rem)]">
          <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">Chats</h5>
          <div className="mb-5">
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
          <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">Contacts</h5>
          <div>
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
      </div>
      {/* Sidebar Left*/}

      {/* ChatContent */}
      <div className='h-full w-0 grow'>
        <div className='flex items-center justify-between px-5 py-2.5 '>
          <div className='flex items-center'>
            <div className='flex cursor-pointer items-center'>
              <Badge className='mr-3'></Badge>
              <div className='flex flex-col'>
                <h6 className='scroll-m-20 text-xl font-semibold tracking-tight'>Test User</h6>
              </div>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <Button size={'icon'} variant={'ghost'}>
              <PhoneCallIcon className='h-4 w-4' />
            </Button>
            <Button size={'icon'} variant={'ghost'}>
              <VideoIcon className='h-4 w-4' />
            </Button>
            <Button size={'icon'} variant={'ghost'}>
              <SearchIcon className='h-4 w-4' />
            </Button>
          </div>

        </div>


        <div className="h-[calc(100% - 8.875rem)] flex flex-1 flex-col overflow-hidden">
          <ScrollArea className='flex-1'>
            {/* Your chat area content goes here */}
          </ScrollArea>
          <div className='flex p-3'>
            <Input
              value={message}
              onChange={handleInputChange}
              placeholder='Type your message...'
            />
            <Button className="ml-2" disabled={!message} onClick={handleSend}>
              <PaperPlaneIcon className='mr-2 h-4 w-4' />
              Send
            </Button>
          </div>
        </div>
      </div>
      {/* ChatContent */}
    </div>
  )
}

export default ChatsPage
