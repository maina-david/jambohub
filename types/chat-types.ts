import { Chat, Contact, Customer } from "@prisma/client"

export interface ContactDetails extends Contact {
  customer?: Customer
}
export type SendMsgParamsType = {
  chat?: Chat
  message: string
  contact?: ContactDetails
}
