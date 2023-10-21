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
    set((state) => {
      // Find the selected chat
      const selectedChat = state.selectedChat

      if (selectedChat && selectedChat.id === chatId) {
        // If the selected chat matches the provided chatId, update its chatMessages
        const updatedChat = {
          ...selectedChat,
          chatMessages: selectedChat.chatMessages
            ? [...selectedChat.chatMessages, ...messages]
            : [...messages],
        }

        // Update the selectedChat with the updated chat
        return {
          selectedChat: updatedChat,
        }
      }

      // If the selected chat doesn't match the provided chatId, do nothing
      return state
    })
  }

}), shallow)

export default useChatStore

