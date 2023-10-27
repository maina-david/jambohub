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
import { AnimatePresence, motion } from 'framer-motion'
import AddContactDialog from './AddContactDialog'

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
    return null
  }

  const formatTimestamp = (timestamp?: Date) => {
    const date = timestamp ? new Date(timestamp) : new Date()
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const renderChatsAndContacts = () => {
    return (
      <>
        <div className="flex items-center justify-between space-x-2 p-2.5">
          <Input placeholder="Search for contact..." />
        </div>
        <Separator />
        <ScrollArea className="h-[470px] space-y-4">
          <h5 className="mb-3.5 ml-3 text-xl font-semibold tracking-tight">
            Chats
          </h5>
          <div className="mb-5 truncate hover:bg-accent">
            <AnimatePresence>
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex cursor-pointer flex-row items-start rounded-2xl px-3 py-2",
                      chat.contactId === selectedChat?.contactId && "bg-accent"
                    )}
                    onClick={() => setSelectedChat(chat.contactId)}
                  >
                    <UserAvatar
                      user={{ name: chat.Contact.name || null, image: null }}
                      className="mr-2 h-8 w-8"
                    />
                    <div className="flex-1 truncate">
                      <p className="truncate text-base font-medium tracking-tight">
                        {chat.Contact.name || chat.Contact.identifier}
                      </p>
                      <p className="truncate">
                        {getLastChatMessage(chat) &&
                          getLastChatMessage(chat)!.message!.length > 20
                          ? `${getLastChatMessage(chat)?.message.slice(0, 20)}...`
                          : getLastChatMessage(chat)?.message
                        }
                      </p>
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
                  </motion.div>
                ))
              ) : (
                <p className="mt-6 text-center text-sm">
                  No chats available
                </p>
              )}
            </AnimatePresence>
          </div>
          <div className='flex items-center gap-2'>
            <h5 className="flex items-center text-xl font-semibold">
              Contacts
            </h5>
            <div className="grow"></div>
            <AddContactDialog />
          </div>
          <AnimatePresence>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: "100%" }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full cursor-pointer px-3 py-2 hover:bg-accent"
                  onClick={() => setSelectedChat(contact.id)}
                >
                  <div className='flex flex-row items-start'>
                    <UserAvatar
                      user={{ name: contact.alias || null, image: null }}
                      className="mr-2 h-8 w-8"
                    />
                    <div className='flex-1 flex-col'>
                      <p className="text-base font-medium tracking-tight">{contact.name || contact.identifier}</p>
                      <p className="text-sm tracking-tight">{contact.alias || contact.alias}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="mt-6 text-center text-sm">
                No contacts available
              </p>
            )}
          </AnimatePresence>
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
