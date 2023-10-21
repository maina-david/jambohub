'use client'

import React, { useEffect, useState } from 'react'
import SideBarLeft from './SideBarLeft'
import ChatContentArea from './ChatContentArea'
import { useMediaQuery } from 'usehooks-ts'
import useChatStore, { ChatState } from '@/store/chatStore'
import { useQuery } from '@tanstack/react-query'
import { fetchAssignedChats, fetchCompanyContacts, getSelectedChatMessages } from '@/actions/chat-actions'
import { useParams } from 'next/navigation'
import Pusher from 'pusher-js'
import { env } from '@/env.mjs'
import { toast } from '@/components/ui/use-toast'

const selector = (state: ChatState) => ({
  chats: state.chats,
  contacts: state.contacts,
  selectedChat: state.selectedChat,
  setChats: state.setChats,
  setContacts: state.setContacts,
  setSelectedChat: state.setSelectedChat,
  addMessages: state.addMessages,
})

export default function ChatArea() {
  const {
    chats,
    contacts,
    selectedChat,
    setChats,
    setContacts,
    setSelectedChat,
    addMessages
  } = useChatStore(selector)
  const params = useParams()
  const isMdAndAbove = useMediaQuery('(min-width: 768px)')
  const isSmAndAbove = useMediaQuery('(min-width: 640px)')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const hidden = useMediaQuery('(min-width: 1024px)')
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const companyContacts = useQuery({
    queryKey: ['companyContacts'],
    queryFn: () => fetchCompanyContacts(params?.companyId as string),
  })

  const assignedChats = useQuery({
    queryKey: ['assignedChats'],
    queryFn: () => fetchAssignedChats(params?.companyId as string),
  })

  useEffect(() => {
    if (companyContacts.data) {
      setContacts(companyContacts.data)
    }
    if (assignedChats.data) {
      setChats(assignedChats.data)
    }

    const pusher = new Pusher(env.PUSHER_APP_SECRET, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER
    })

    // Subscribe to the "chat" channel to receive new chat messages
    const chatChannel = pusher.subscribe("chat");

    // Listen for the "new-chat-message" event
    chatChannel.bind("new-chat-message", function (data: { existingChat: { contact: { alias: string } } }) {
      toast({
        title: 'New Message',
        description: `You have a new message from ${data.existingChat.contact.alias}`,
      })
    })

    return () => {
      pusher.unsubscribe("chat")
    }

  }, [assignedChats.data, companyContacts.data, setChats, setContacts])

  return (
    <>
      {/* Sidebar Left */}
      <SideBarLeft
        isMdAndAbove={isMdAndAbove}
        leftSidebarOpen={leftSidebarOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        chats={chats}
        contacts={contacts}
        setSelectedChat={setSelectedChat}
        selectedChat={selectedChat}
      />
      {/* Sidebar Left*/}

      {/* ChatContent */}
      <ChatContentArea
        hidden={hidden}
        isMdAndAbove={isMdAndAbove}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        selectedChat={selectedChat} />
      {/* ChatContent */}
    </>
  )
}
