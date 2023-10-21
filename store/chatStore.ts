import { $Enums, ChatMessage, Contact } from '@prisma/client'
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
  addMessages: (chatId: string, messages: ChatMessage[]) => void
}

const useChatStore = createWithEqualityFn<ChatState>((set, get) => ({
  chats: [] as ChatProps[],
  contacts: [] as Contact[],
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
    const selectedChat = await axios.get<ChatProps>(`/api/contacts/${contactId}/chats`).then((response) => response.data)
    set({
      selectedChat
    })
  },
  removeSelectedChat: () => {
    set({
      selectedChat: null
    })
  },
  addMessages: (chatId: string, messages: ChatMessage[]) => {
    set((state) => {
      if (state.selectedChat && state.selectedChat.id === chatId) {
        const updatedChat = {
          ...state.selectedChat,
          chatMessages: state.selectedChat.chatMessages
            ? [...state.selectedChat.chatMessages, ...messages]
            : [...messages],
        }
        return { selectedChat: updatedChat }
      }
      return state
    })
  }
}), shallow)

export default useChatStore

