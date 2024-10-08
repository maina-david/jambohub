'use client'

import React, { useEffect, useState } from 'react'
import SideBarLeft from './SideBarLeft'
import ChatContentArea from './ChatContentArea'
import { useMediaQuery } from 'usehooks-ts'
import useChatStore, { ChatState } from '@/store/chatStore'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAssignedChats, fetchCompanyContacts, getSelectedChatMessages } from '@/actions/chat-actions'
import { useParams } from 'next/navigation'
import Pusher from 'pusher-js'
import { env } from '@/env.mjs'
import { toast } from '@/components/ui/use-toast'
import { ChatProps } from '@/types/chat-types'
import { ChatMessage } from '@prisma/client'

const selector = (state: ChatState) => ({
  chats: state.chats,
  contacts: state.contacts,
  selectedChat: state.selectedChat,
  setChats: state.setChats,
  setContacts: state.setContacts,
  setSelectedChat: state.setSelectedChat,
  removeSelectedChat: state.removeSelectedChat,
  addMessages: state.addMessages
})

export default function ChatArea() {
  const {
    chats,
    contacts,
    selectedChat,
    setChats,
    setContacts,
    setSelectedChat,
    removeSelectedChat,
    addMessages
  } = useChatStore(selector)
  const params = useParams()
  const isMdAndAbove = useMediaQuery('(min-width: 768px)')
  const isSmAndAbove = useMediaQuery('(min-width: 640px)')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const hidden = useMediaQuery('(min-width: 1024px)')
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const queryClient = useQueryClient()

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
      if (selectedChat) {
        const chat = chats.find((chat) => chat.id === selectedChat.id)
        if (chat) {
          selectedChat.chatMessages = chat.chatMessages
        }
      }
    }

    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER
    })

    // Subscribe to the "chat" channel to receive new chat messages
    const chatChannel = pusher.subscribe("chat")

    // Listen for the "new-chat-message" event
    chatChannel.bind("new-chat-message", function (data: { chat: ChatProps, chatMessage: ChatMessage }) {
      if (selectedChat && selectedChat.id === data.chat.id) {
        // If the selected chat matches the chat with the new message, add the message to it
        addMessages(data.chat.id, [data.chatMessage])
      }

      // Update the chat in the chats array
      const chat = chats.find((chat) => chat.id === data.chat.id)
      if (chat) {
        // Clone the chat to avoid directly modifying the original array
        const updatedChat = { ...chat }

        // Update the chat's chatMessages array with the new message
        updatedChat.chatMessages = [...(updatedChat.chatMessages || []), data.chatMessage]

        // Update the chat's unread messages count with the additional message
        updatedChat.unreadMessageCount = updatedChat.unreadMessageCount + 1

        // Find the index of the chat in the chats array
        const chatIndex = chats.findIndex((chat) => chat.id === data.chat.id)

        // Replace the chat at that index with the updated chat
        if (chatIndex !== -1) {
          chats[chatIndex] = updatedChat
        }
      }

      toast({
        title: 'New Message',
        description: `You have a new message from ${data.chat.Contact.alias}`,
      })
    })

    return () => {
      pusher.unsubscribe("chat")
    }

  }, [addMessages, assignedChats.data, chats, companyContacts.data, queryClient, removeSelectedChat, selectedChat, setChats, setContacts])

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
        setSelectedChat={setSelectedChat}
        selectedChat={selectedChat}
        addMessages={addMessages} />
      {/* ChatContent */}
    </>
  )
}
