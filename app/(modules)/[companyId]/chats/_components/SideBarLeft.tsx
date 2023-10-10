'use client'

import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '@/components/user-avatar'
import { Separator } from '@/components/ui/separator'
import useChatStore from '@/store/chatStore'

export default function SideBarLeft(user) {
  const chats = useChatStore((state) => state.chats)
  const contacts = useChatStore((state) => state.contacts)
  const userProfile = useChatStore((state) => state.userProfile)
  const setSelectedChat = useChatStore((state) => state.setSelectedChat)
  const setUserProfile = useChatStore((state) => state.setUserProfile)

  useEffect(() => {
    setUserProfile(user)
  }, [setUserProfile, user])

  return (
    <div className="flex flex-col rounded-l border md:w-1/3">
      <div className="flex items-center justify-between space-x-2 p-2.5">
        <UserAvatar
          user={{ name: userProfile?.name || null, image: userProfile?.image || null }}
          className="h-8 w-8"
        />
        <Input placeholder="Search for contact..." />
      </div>
      <Separator />
      <ScrollArea className="h-[470px] w-full space-y-4">
        <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">Chats</h5>
        <div className="mb-5">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="w-full cursor-pointer items-start px-3 py-2"
            >
              {chat.externalRef}
            </div>
          ))}
        </div>
        <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">Contacts</h5>
        <div>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="w-full cursor-pointer items-start px-3 py-2"
            >
              {contact.alias}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

