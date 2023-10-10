import React from 'react'
import axios from 'axios'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { Chat } from '@prisma/client'
import { Contact } from '@prisma/client'
import { User } from 'next-auth'

export type ChatState = {
  chats: Chat[]
  contacts: Contact[]
  userProfile: User | null
  selectedChat: Chat | null
}

const useChatStore = createWithEqualityFn<ChatState>((set, get) => ({
  chats: [],
  contacts: [],
  userProfile: null,
  selectedChat: null,
  setUserProfile: (user: User) => {
    set({
      userProfile: user
    })
  },
  setChats: (chats: Chat[]) => {
    set({
      chats: chats
    })
  },
  setContacts: (contacts: Contact[]) => {
    set({
      contacts: contacts
    })
  },
  setSelectedChat: async (chatId: string) => {
    const chat = await axios.get<Chat>(`/api/chats/${chatId}`).then((response) => response.data)
    set({
      selectedChat: chat
    })
  }
}), shallow)

export default useChatStore
