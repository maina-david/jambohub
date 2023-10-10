import { Chat } from '@prisma/client'
import { Contact } from '@prisma/client'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

export type ChatState = {
  chats: Chat[]
  contacts: Contact[]
  selectedChat: Chat | null
  setChats: (chats: Chat[]) => void
  setContacts: (contacts: Contact[]) => void
  setSelectedChat: (chats: Chat) => void
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
  setSelectedChat: (selectedChat: Chat) => {
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

