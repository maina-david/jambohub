import { Chat, ChatMessage, Contact, Customer } from "@prisma/client"

export interface ContactDetails extends Contact {
  customer?: Customer
}
export type SendMsgParamsType = {
  chat?: Chat
  message: string
  contact?: ContactDetails
}

export interface ChatProps extends Chat {
  chatMessages: ChatMessage[]
}
