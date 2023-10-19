import { Contact } from '@prisma/client'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import axios from 'axios'
import { ChatProps } from '@/types/chat-types'

export type ChatState = {
  chats: ChatProps[]
  contacts: Contact[]
  selectedChat: ChatProps | null
  setChats: (chats: ChatProps[]) => void
  setContacts: (contacts: Contact[]) => void
  setSelectedChat: (contactId: string) => void
}

const useChatStore = createWithEqualityFn<ChatState>((set, get) => ({
  chats: [],
  contacts: [],
  selectedChat: null,
  setChats: (chats: ChatProps[]) => {
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
    const selectedChat = await axios.get<ChatProps>(`/api/chats/${contactId}`).then((response) => response.data)
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

