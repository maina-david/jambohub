import { Chat } from '@prisma/client'
import { Contact } from '@prisma/client'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import axios from 'axios'

export type ChatState = {
  chats: Chat[]
  contacts: Contact[]
  selectedChat: Chat | null
  setChats: (chats: Chat[]) => void
  setContacts: (contacts: Contact[]) => void
  setSelectedChat: (contactId: string) => void
}

const useChatStore = createWithEqualityFn<ChatState>((set, get) => ({
  chats: [],
  contacts: [],
  selectedChat: null,
  setChats: (chats: Chat[]) => {
    set({
      chats
    })
  },
  setContacts: (contacts: Contact[]) => {
    set({
      contacts
    })
  },
  setSelectedChat: async (contactId: string) => {
    const selectedChat = await axios.get<Chat>(`/api/chats/${contactId}`).then((response) => response.data)
    set({
      selectedChat
    })
  },
  removeSelectedChat: () => {
    set({
      selectedChat: null
    })
  },
}), shallow)

export default useChatStore

