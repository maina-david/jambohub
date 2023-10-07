import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import React from 'react'

export const metadata = {
  title: "Chats",
}

function ChatsPage() {
  return (
    <div className='relative grid w-full border-spacing-1 grid-cols-2 space-y-2 overflow-hidden'>
      {/* Chat Sidebar */}
      <div className='w-1/4 gap-2'>
        <Input
          type="search"
          placeholder="Search customers..."
          className="h-8 w-full sm:w-64 sm:pr-12"
        />
        <ScrollArea className='h-64 w-full'>
          <div>Chat 1</div>
          <div>Chat 2</div>
          <div>Chat 3</div>
          <div>Chat 4</div>
          <div>Chat 5</div>
        </ScrollArea>
      </div>
      {/* Chat Content Area */}
      <div className='w-3/4'>
        Chat Area content
      </div>
    </div>
  )
}

export default ChatsPage
