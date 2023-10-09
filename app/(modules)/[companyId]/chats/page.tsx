'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { PhoneCallIcon, SearchIcon, VideoIcon } from 'lucide-react'
import React, { useState } from 'react'

function ChatsPage() {
  const [message, setMessage] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSend = () => {
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='relative flex w-full space-y-2 shadow-2xl'>
      {/* Sidebar Left */}
      <div className="flex w-1/3 flex-col border">
        <div className='flex w-full items-center p-2.5'>
          <Input placeholder='Search for contact...' />
        </div>
        <ScrollArea className='h-[450px] w-full'>
          <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">Chats</h5>
          <div className="mb-5">
            <div className="w-full items-start px-3 py-2">
              chat 1
            </div>
            <div className="w-full items-start px-3 py-2">
              chat 2
            </div>
            <div className="w-full items-start px-3 py-2">
              chat 3
            </div>
          </div>
          <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">Contacts</h5>
          <div>
            <div className="w-full items-start px-3 py-2">
              Contact 1
            </div>
            <div className="w-full items-start px-3 py-2">
              Contact 2
            </div>
            <div className="w-full items-start px-3 py-2">
              Contact 3
            </div>
            <div className="w-full items-start px-3 py-2">
              Contact 4
            </div>
            <div className="w-full items-start px-3 py-2">
              Contact 5
            </div>
            <div className="w-full items-start px-3 py-2">
              Contact 6
            </div>
          </div>
        </ScrollArea>
      </div>
      {/* Sidebar Left*/}

      {/* ChatContent */}
      <div className='flex grow flex-col border'>
        <div className='flex items-center justify-between px-5 py-2.5'>
          <div className='flex items-center'>
            <div className='flex cursor-pointer items-center'>
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

        <div className="flex h-[450px] flex-1 flex-col overflow-hidden">
          <ScrollArea className='flex-1 overflow-y-auto'>
            {/* Your chat area content goes here */}
          </ScrollArea>
          <div className='flex p-3'>
            <Input
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
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
