'use client'

import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '@/components/user-avatar'
import { Separator } from '@/components/ui/separator'
import useChatStore, { ChatState } from '@/store/chat'

const selector = (state: ChatState) => ({
  chats: state.chats,
  contacts: state.contacts,
  userProfile: state.userProfile,
  selectedChat: state.selectedChat,
  setChats: state.setChats,
  setContacts: state.setContacts,
  setSelectedChat: state.setContacts,
  sendMessage: state.sendMessage,
  setUserProfile: state.setUserProfile
})

export default function SideBarLeft() {
  const {
    chats,
    contacts,
    userProfile,
    selectedChat,
    setChats,
    setContacts,
    setSelectedChat,
    sendMessage,
    setUserProfile } = useChatStore(selector)

  // useEffect(() => {
  //   setUserProfile()
  // }, [setUserProfile])

  return (
    <div className="flex flex-col rounded-l border md:w-1/3">
      <div className='flex items-center justify-between space-x-2 p-2.5'>
        <UserAvatar
          user={{ name: userProfile?.name || null, image: userProfile?.image || null }}
          className="h-8 w-8"
        />
        <Input placeholder='Search for contact...' />
      </div>
      <Separator />
      <ScrollArea className='h-[470px] w-full space-y-4'>
        <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">Chats</h5>
        <div className="mb-5">
          <div className="w-full items-start px-3 py-2">
            chat 1
          </div>
          <div className="w-full items-start px-3 py-2">
            chat 2
          </div>
          <div className="w-full items-start px-3 py-2">
            chat 3
          </div>
        </div>
        <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">Contacts</h5>
        <div>
          <div className="w-full items-start px-3 py-2">
            Contact 1
          </div>
          <div className="w-full items-start px-3 py-2">
            Contact 2
          </div>
          <div className="w-full items-start px-3 py-2">
            Contact 3
          </div>
          <div className="w-full items-start px-3 py-2">
            Contact 4
          </div>
          <div className="w-full items-start px-3 py-2">
            Contact 5
          </div>
          <div className="w-full items-start px-3 py-2">
            Contact 6
          </div>
          <div className="w-full items-start px-3 py-2">
            Contact 7
          </div>
          <div className="w-full items-start px-3 py-2">
            Contact 8
          </div>
          <div className="w-full items-start px-3 py-2">
            Contact 9
          </div>
          <div className="w-full items-start px-3 py-2">
            Contact 10
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
