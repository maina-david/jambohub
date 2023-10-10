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
  setChats: async (companyId: string) => {
    const chats = await axios.get<Chat[]>(`/api/companies/${companyId}/chats`).then((response) => response.data)

    set({
      chats
    })
  },
  setContacts: async (companyId: string) => {
    const contacts = await axios.get<Contact[]>(`/api/companies/${companyId}/contacts`).then((response) => response.data)

    set({
      contacts
    })
  },
  setSelectedChat: async (chatId: string) => {
    const selectedChat = await axios.get(`/api/chats/${chatId}`).then((response) => response.data)
    set({
      selectedChat
    })
  }
}), shallow)

export default useChatStore
