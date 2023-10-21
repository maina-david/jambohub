'use client'

import React, { useEffect, useState } from 'react'
import SideBarLeft from './SideBarLeft'
import ChatContentArea from './ChatContentArea'
import { useMediaQuery } from 'usehooks-ts'
import useChatStore, { ChatState } from '@/store/chatStore'
import { useQuery } from '@tanstack/react-query'
import { fetchAssignedChats, fetchCompanyContacts } from '@/actions/chat-actions'
import { useParams } from 'next/navigation'

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
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)

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
      if (selectedChat) {
        // Update chatMessages for the selected chat
        const chatId = selectedChat.id
        const chatMessages = assignedChats.data.find(chat => chat.id === chatId)?.chatMessages
        if (chatMessages) {
          addMessages(chatId, chatMessages)
        }
      }
    }
  }, [selectedChat, addMessages, assignedChats.data, companyContacts.data, setChats, setContacts, setSelectedChat])

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
        isMdAndAbove={isMdAndAbove}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        selectedChat={selectedChat} />
      {/* ChatContent */}
    </>
  )
}
