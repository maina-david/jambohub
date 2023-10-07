import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import React from 'react'

export const metadata = {
  title: "Chats",
}

function ChatsPage() {
  return (
    <div className='relative flex w-full border-spacing-1 overflow-hidden'>
      {/* Chat Sidebar */}
      <div>
        <div className='flex items-center space-x-2'>
          <Input
            type="search"
            placeholder="Search customers..."
            className="h-8 w-full sm:w-64 sm:pr-12"
          />
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
            <MagnifyingGlassIcon className='h-4 w-4' />
          </kbd>
        </div>
        <ScrollArea className='h-64 w-full'>
          <div>Chat 1</div>
          <div>Chat 1</div>
          <div>Chat 1</div>
          <div>Chat 1</div>
          <div>Chat 1</div>
          <div>Chat 1</div>
        </ScrollArea>
      </div>
      {/* Chat Content Area */}
      <div>
        Chat Area content
      </div>
    </div>
  )
}

export default ChatsPage
