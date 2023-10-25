'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '@/components/user-avatar'
import { Separator } from '@/components/ui/separator'
import { ChatProps } from '@/types/chat-types'
import { cn } from '@/lib/utils'
import { Contact } from '@prisma/client'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { UserPlus2Icon } from 'lucide-react'

interface SideBarLeftProps extends React.HTMLAttributes<HTMLDivElement> {
  isMdAndAbove: boolean
  leftSidebarOpen: boolean
  handleLeftSidebarToggle: () => void
  contacts: Contact[]
  chats: ChatProps[]
  setSelectedChat: (contactId: string) => void
  selectedChat: ChatProps | null
}

const SideBarLeft = (props: SideBarLeftProps) => {
  const {
    isMdAndAbove,
    leftSidebarOpen,
    handleLeftSidebarToggle,
    chats,
    contacts,
    setSelectedChat,
    selectedChat,
  } = props

  const getLastChatMessage = (chat: ChatProps) => {
    const messages = chat.chatMessages || []
    if (messages.length > 0) {
      return messages[messages.length - 1]
    }
  }

  const formatTimestamp = (timestamp?: Date) => {
    const date = timestamp ? new Date(timestamp) : new Date()
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const renderChatsAndContacts = () => {
    return (
      <>
        <div className="flex w-full items-center justify-between space-x-2 p-2.5">
          <Input placeholder="Search for contact..." />
        </div>
        <Separator />
        <ScrollArea className="h-[470px] w-full space-y-4">
          <h5 className="mb-3.5 ml-3 text-xl font-semibold tracking-tight">
            Chats
          </h5>
          <div className="mb-5 hover:bg-accent">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "flex cursor-pointer flex-row items-start rounded-2xl px-3 py-2",
                    chat.contactId === selectedChat?.contactId && "bg-accent"
                  )}
                  onClick={() => setSelectedChat(chat.contactId)}
                >
                  <UserAvatar
                    user={{ name: chat.Contact.alias || null, image: null }}
                    className="mr-2 h-8 w-8"
                  />
                  <div className="flex-1 truncate">
                    <p className="truncate text-base font-medium tracking-tight">
                      {chat.Contact.alias || chat.Contact.identifier}
                    </p>
                    {getLastChatMessage(chat) ? <p className='truncate'>{getLastChatMessage(chat)?.message}</p> : null}
                  </div>
                  <div className='flex flex-col items-end'>
                    <p className="whitespace-nowrap text-sm text-gray-500">
                      {getLastChatMessage(chat) ? formatTimestamp(getLastChatMessage(chat)?.timestamp) : formatTimestamp()}
                    </p>
                    {chat.unreadMessageCount > 0 && (
                      <span className="rounded-full bg-red-500 p-1 text-xs text-white">
                        {chat.unreadMessageCount}
                      </span>
                    )}
                  </div>
                </div>

              ))
            ) : (
              <p className="mt-6 text-center text-sm">
                No chats available
              </p>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <h5 className="flex items-center text-xl font-semibold">
              Contacts
            </h5>
            <div className="grow"></div>
            <Button variant={'ghost'} size={'icon'}>
              <UserPlus2Icon className="h-4 w-4" />
            </Button>
          </div>
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="w-full cursor-pointer px-3 py-2 hover:bg-accent"
                onClick={() => setSelectedChat(contact.id)}
              >
                <div className='flex flex-row items-start'>
                  <UserAvatar
                    user={{ name: contact.alias || null, image: null }}
                    className="mr-2 h-8 w-8"
                  />
                  <p className="text-base font-medium tracking-tight">{contact.alias || contact.identifier}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="mt-6 text-center text-sm">
              No contacts available
            </p>
          )}
        </ScrollArea>
      </>
    )
  }

  if (isMdAndAbove) {
    return (
      <div className="flex w-[320px] flex-col border-r">
        {renderChatsAndContacts()}
      </div>
    )
  } else {
    return (
      <div className="md:hidden">
        <Sheet open={leftSidebarOpen} onOpenChange={handleLeftSidebarToggle}>
          <SheetContent side={'left'}>
            {renderChatsAndContacts()}
          </SheetContent>
        </Sheet>
      </div>
    )
  }
}

export default SideBarLeft
