import { Chat } from '@prisma/client'
import { Contact } from '@prisma/client'
import { User } from 'next-auth'
import { getCurrentUser } from '@/lib/session'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

export type ChatState = {
  chats: Chat[]
  contacts: Contact[]
  userProfile: User | null
  selectedChat: Chat | null
  setUserProfile: () => void
  setChats: (chats: Chat[]) => void
  setContacts: (contacts: Contact[]) => void
  setSelectedChat: (chats: Chat) => void
}

const useChatStore = createWithEqualityFn<ChatState>((set, get) => ({
  chats: [],
  contacts: [],
  userProfile: null,
  selectedChat: null,
  setUserProfile: async () => {
    const user = await getCurrentUser()
    set({
      userProfile: user
    })

  },
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

