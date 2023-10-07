import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import React from 'react'

export const metadata = {
  title: "Chats",
}

function ChatsPage() {
  return (
    <div className='relative grid w-full border-spacing-1 grid-cols-2 space-y-2 overflow-hidden'>
      {/* Chat Sidebar */}
      <div className='w-1/4 gap-2 border shadow'>
        <div className='flex w-full'>
          <Input
            type="search"
            placeholder="Search customers..."
            className="h-8 w-full sm:w-64 sm:pr-12"
          />
        </div>
        <ScrollArea className='h-72 w-48 rounded-md border'>
          <h5 className="scroll-m-20 text-xl font-semibold tracking-tight">Chats</h5>
          <div>Chat 1</div>
          <div>Chat 2</div>
          <div>Chat 3</div>
          <div>Chat 4</div>
          <div>Chat 5</div>
          <h5 className="scroll-m-20 text-xl font-semibold tracking-tight">Contacts</h5>
          <div>Contact 1</div>
          <div>Contact 2</div>
          <div>Contact 3</div>
          <div>Contact 4</div>
          <div>Contact 5</div>
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
