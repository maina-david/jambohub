'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '@/components/user-avatar'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ChatProps } from '@/types/chat-types'
import { cn } from '@/lib/utils'
import { Contact } from '@prisma/client'

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
      return messages[messages.length - 1].message
    }
    return 'No messages'
  }

  const renderChatsAndContacts = () => {
    return (
      <>
        <div className="flex items-center justify-between space-x-2 p-2.5">
          <Input placeholder="Search for contact..." />
        </div>
        <Separator />
        <ScrollArea className="h-[470px] w-full space-y-4">
          <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">
            Chats
          </h5>
          <div className="mb-5 hover:bg-accent">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "relative flex w-full cursor-pointer flex-row items-center px-3 py-2", 
                    chat.contactId === selectedChat?.contactId && "bg-accent"
                  )}
                  onClick={() => setSelectedChat(chat.contactId)}
                >
                  <UserAvatar
                    user={{ name: chat.Contact.alias || null, image: null }}
                    className="mr-2 h-8 w-8"
                  />
                  <div className="flex flex-col">
                    <p className="scroll-m-20 text-base font-medium tracking-tight">
                      {chat.Contact.alias || chat.Contact.identifier}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(chat.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    {getLastChatMessage(chat)}
                    {chat.unreadMessageCount > 0 && (
                      <span className="absolute rounded-full bg-red-500 p-1 text-xs text-white">
                        {chat.unreadMessageCount}
                      </span>
                    )}
                  </div>
                </div>

              ))
            ) : (
              <p className="text-center text-sm leading-7 [&:not(:first-child)]:mt-6">
                No chats available
              </p>
            )}
          </div>
          <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">
            Contacts
          </h5>
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="w-full cursor-pointer items-start px-3 py-2 hover:bg-accent"
                onClick={() => setSelectedChat(contact.id)}
              >
                <div className='flex flex-row'>
                  <UserAvatar
                    user={{ name: contact.alias || null, image: null }}
                    className="mr-2 h-8 w-8"
                  />
                  <p className="scroll-m-20 text-base font-medium tracking-tight">{contact.alias || contact.identifier}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm leading-7 [&:not(:first-child)]:mt-6">
              No contacts available
            </p>
          )}
        </ScrollArea>
      </>
    )
  }

  if (isMdAndAbove) {
    return (
      <div className="flex flex-col rounded-l border md:w-1/3">
        {renderChatsAndContacts()}
      </div>
    )
  } else {
    return (
      <Sheet open={leftSidebarOpen} onOpenChange={handleLeftSidebarToggle}>
        <SheetContent side={'left'}>
          {renderChatsAndContacts()}
        </SheetContent>
      </Sheet>
    )
  }
}

export default SideBarLeft
