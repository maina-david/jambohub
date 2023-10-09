import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

export const metadata = {
  title: "Chats",
}

function ChatsPage() {
  return (
    <div className='relative flex w-full'>
      {/* Sidebar Left */}
      <Card className="absolute block h-full w-[360px] flex-col border-2 shadow-2xl">
        <CardContent>
          <div className='flex w-full items-center px-5 py-3'>
            <Input placeholder='Search for contact...' />
          </div>
          <div className='gap-4'>
            <h5 className='mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight'>
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
            <h5 className='mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight'>
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
        </CardContent>
      </Card>
      {/* Sidebar Left*/}

      {/* ChatContent */}

      {/* ChatContent */}
    </div>
  )
}

export default ChatsPage
