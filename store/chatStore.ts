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
  addMessages: (chatId: string, messages: ChatMessage[]) => {
    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            chatMessages: [...(chat.chatMessages || []), ...messages],
          }
        }
        return chat
      }),
    }))
  },
}), shallow)

export default useChatStore

