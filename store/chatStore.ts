import { ChatMessage, Contact } from '@prisma/client'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { ChatProps } from '@/types/chat-types'
import { nanoid } from 'nanoid/non-secure'

export type ChatState = {
  chats: ChatProps[]
  contacts: Contact[]
  selectedChat: ChatProps | null
  setChats: (chats: ChatProps[]) => void
  setContacts: (contacts: Contact[]) => void
  setSelectedChat: (contactId: string) => void
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
  setSelectedChat: (contactId: string) => {
    // Find the chat in the chats array with the matching contactId
    const chat = get().chats.find((chat) => chat.Contact.id === contactId)

    if (chat) {
      set({
        selectedChat: chat
      })
    } else {
      // If no chat is found, create a new chat object and add it to the chats array
      const contact = get().contacts.find((contact) => contact.id === contactId)

      if (contact) {
        const newChat: ChatProps = {
          id: nanoid(),
          Contact: contact,
          chatMessages: [],
          category: 'INTERACTIVE',
          channelId: '',
          companyId: contact.companyId,
          contactId: '',
          externalRef: null,
          status: 'OPEN',
          timestamp: new Date(),
        }

        set({
          chats: [...get().chats, newChat],
          selectedChat: newChat
        })
      }
    }
  },
  removeSelectedChat: () => {
    set({
      selectedChat: null
    })
  },
}), shallow)

export default useChatStore

