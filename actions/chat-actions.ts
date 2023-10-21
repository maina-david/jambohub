import axios from 'axios'
import { ChatMessage, Contact } from '@prisma/client'
import { ChatProps } from '@/types/chat-types'

export const fetchCompanyContacts = (companyId: string): Promise<Contact[]> =>
  axios.get(`/api/companies/${companyId}/contacts`).then((response) => response.data)

export const fetchAssignedChats = (companyId: string): Promise<ChatProps[]> =>
  axios.get(`/api/companies/${companyId}/chats`).then((response) => response.data)

export const getSelectedChatMessages = (chatId: string): Promise<ChatMessage[]> =>
  axios.get(`/api/chat/${chatId}/messages`).then((response) => response.data)
