'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { MenuIcon, PhoneCallIcon, SearchIcon, VideoIcon } from 'lucide-react'
import useChatStore from '@/store/chatStore'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'

interface ChatContentAreaProps {
  isMdAndAbove: boolean
  handleLeftSidebarToggle: () => void
}

const ChatContentArea = (props: ChatContentAreaProps) => {
  const {
    isMdAndAbove,
    handleLeftSidebarToggle
  } = props

  const handleStartConversation = () => {
    if (!isMdAndAbove) {
      handleLeftSidebarToggle()
    }
  }

  const selectedChat = useChatStore((state) => state.selectedChat)
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
    <div className={cn("flex flex-col rounded-r border",
      isMdAndAbove ? 'w-2/3' : 'grow')}>
      {selectedChat ? (
        <>
          <div className="flex items-center justify-between px-5 py-2.5">
            {isMdAndAbove ? null : (
              <div className='mx-2' onClick={handleLeftSidebarToggle}>
                <MenuIcon className="h-4 w-4" />
              </div>
            )}
            <div className="flex cursor-pointer items-center">
              <div className="flex flex-col">
                <h6 className="scroll-m-20 text-xl font-semibold tracking-tight">Test User</h6>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="ghost">
                <PhoneCallIcon className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <VideoIcon className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex h-[470px] flex-col overflow-hidden">
            <ScrollArea className="flex-1 overflow-y-auto">
              {/* Your chat area content goes here */}
            </ScrollArea>
            <div className="flex p-3">
              <Input
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
              />
              <Button className="ml-2" disabled={!message} onClick={handleSend}>
                <PaperPlaneIcon className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </>
      ) : (
          <div className={cn("flex flex-col items-center justify-center",
            isMdAndAbove ? 'h-[470px]' : 'h-[500px]')}>
          <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-muted px-7 pb-7 pt-8 shadow-2xl">
            <Icons.chat className="h-16 w-16" />
          </div>
          <div
            onClick={handleStartConversation}
            className={cn('rounded-md px-6 py-2 shadow-2xl',
              isMdAndAbove ? 'cursor-pointer' : 'cursor-default')}
          >
            <p className="text-lg font-medium leading-normal">Start Conversation</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatContentArea
