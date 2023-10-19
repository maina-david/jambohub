'use client'

import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '@/components/user-avatar'
import { Separator } from '@/components/ui/separator'
import useChatStore from '@/store/chatStore'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { Chat, Contact } from '@prisma/client'

interface SideBarLeftProps extends React.HTMLAttributes<HTMLDivElement> {
  isMdAndAbove: boolean
  leftSidebarOpen: boolean
  handleLeftSidebarToggle: () => void
  chats: Chat[]
  contacts: Contact[]
  setSelectedChat: (contactId: string) => void
}

const SideBarLeft = (props: SideBarLeftProps) => {
  const {
    isMdAndAbove,
    leftSidebarOpen,
    handleLeftSidebarToggle,
    chats,
    contacts,
    setSelectedChat
  } = props

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
          <div className="mb-5">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className="w-full cursor-pointer items-start px-3 py-2"
                  onClick={() => setSelectedChat(chat.contactId)}
                >
                  {chat.externalRef}
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
                className="w-full cursor-pointer items-start px-3 py-2"
                onClick={() => setSelectedChat(contact.id)}
              >
                {contact.alias}
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
