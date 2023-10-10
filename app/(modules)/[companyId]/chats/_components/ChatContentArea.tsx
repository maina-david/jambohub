'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { PhoneCallIcon, SearchIcon, VideoIcon } from 'lucide-react'

export default function ChatContentArea(){
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
  return  (
    <div className='flex flex-col rounded-r border md:w-2/3'>
      <div className='flex items-center justify-between px-5 py-2.5'>
        <div className='flex cursor-pointer items-center'>
          <div className='flex flex-col'>
            <h6 className='scroll-m-20 text-xl font-semibold tracking-tight'>Test User</h6>
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
      <Separator />
      <div className="flex h-[470px] flex-col overflow-hidden">
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
  )
}
