import axios from 'axios'
import { create } from 'zustand'
import { Chat } from '@prisma/client'
import { Contact } from '@prisma/client'
import { User } from 'next-auth'
import { SendMsgParamsType } from '@/types/chat-types'
import { getCurrentUser } from '@/lib/session'

export type ChatState = {
  chats: Chat[]
  contacts: Contact[]
  userProfile: User | null
  selectedChat: Chat | null
  setUserProfile: () => void
  setChats: (companyId: string) => void
  setContacts: (companyId: string) => void
  setSelectedChat: (chatId: string) => void
  sendMessage: (messageObj: SendMsgParamsType) => void
}

const useChatStore = create<ChatState>((set, get) => ({
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
  },
  removeSelectedChat: () => {
    set({
      selectedChat: null
    })
  },
  sendMessage: async (messageObj: SendMsgParamsType) => {
    const response = await axios.post(`/api/chats/send-message`, {
      data: {
        messageObj
      }
    })

    if(messageObj.contact){
      // set selected chat based on this contact's ID
      get().setSelectedChat(response.data.id)
    }

    if (messageObj.contact?.customer){
      get().setChats(messageObj.contact?.customer?.companyId)
      get().setContacts(messageObj.contact?.customer?.companyId)
    }

    return response.data

  }
}))

export default useChatStore

