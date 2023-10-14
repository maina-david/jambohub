'use client'

import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '@/components/user-avatar'
import { Separator } from '@/components/ui/separator'
import useChatStore from '@/store/chatStore'
import { User } from 'next-auth'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { fetchAssignedChats, fetchCompanyContacts } from '@/actions/chat-actions'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'

interface SideBarLeftProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, 'name' | 'image' | 'email'>
  isMdAndAbove: boolean
  leftSidebarOpen: boolean
  handleLeftSidebarToggle: () => void
}

const SideBarLeft = (props: SideBarLeftProps) => {
  const {
    user,
    isMdAndAbove,
    leftSidebarOpen,
    handleLeftSidebarToggle
  } = props
  const params = useParams()
  const chats = useChatStore((state) => state.chats)
  const setChats = useChatStore((state) => state.setChats)
  const setContacts = useChatStore((state) => state.setContacts)
  const contacts = useChatStore((state) => state.contacts)
  const setSelectedChat = useChatStore((state) => state.setSelectedChat)

  const companyContacts = useQuery({
    queryKey: ['companyContacts'],
    queryFn: () => fetchCompanyContacts(params?.companyId as string),
  })

  const assignedChats = useQuery({
    queryKey: ['assignedChats'],
    queryFn: () => fetchAssignedChats(params?.companyId as string),
  })

  useEffect(() => {
    if (companyContacts.data) {
      setContacts(companyContacts.data)
    }
    if (assignedChats.data) {
      setChats(assignedChats.data)
    }
  }, [assignedChats.data, companyContacts.data, setChats, setContacts])

  if (isMdAndAbove) {
    return (
      <div className="flex flex-col rounded-l border md:w-1/3">
        <div className="flex items-center justify-between space-x-2 p-2.5">
          <UserAvatar
            user={{ name: user.name || null, image: user.image || null }}
            className="h-8 w-8"
          />
          <Input placeholder="Search for contact..." />
        </div>
        <Separator />
        <ScrollArea className="h-[470px] w-full space-y-4">
          <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">
            Chats
          </h5>
          <div className="mb-5">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className="w-full cursor-pointer items-start px-3 py-2"
                  onClick={() => setSelectedChat(chat)}
                >
                  {chat.externalRef}
                </div>
              ))
            ) : (
              <p className="text-center text-sm leading-7 [&:not(:first-child)]:mt-6">
                No chats available
              </p>
            )}
          </div>
          <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">
            Contacts
          </h5>
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="w-full cursor-pointer items-start px-3 py-2"
              >
                {contact.alias}
              </div>
            ))
          ) : (
            <p className="text-center text-sm leading-7 [&:not(:first-child)]:mt-6">
              No contacts available
            </p>
          )}
        </ScrollArea>
      </div>
    )
  } else {
    return (
      <Sheet open={leftSidebarOpen} onOpenChange={handleLeftSidebarToggle}>
        <SheetContent>
          <div className="flex items-center justify-between space-x-2 p-2.5">
            <UserAvatar
              user={{ name: user.name || null, image: user.image || null }}
              className="h-8 w-8"
            />
            <Input placeholder="Search for contact..." />
          </div>
          <Separator />
          <ScrollArea className="h-[470px] w-full space-y-4">
            <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">
              Chats
            </h5>
            <div className="mb-5">
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className="w-full cursor-pointer items-start px-3 py-2"
                    onClick={() => setSelectedChat(chat)}
                  >
                    {chat.externalRef}
                  </div>
                ))
              ) : (
                <p className="text-center text-sm leading-7 [&:not(:first-child)]:mt-6">
                  No chats available
                </p>
              )}
            </div>
            <h5 className="mb-3.5 ml-3 scroll-m-20 text-xl font-semibold tracking-tight">
              Contacts
            </h5>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="w-full cursor-pointer items-start px-3 py-2"
                >
                  {contact.alias}
                </div>
              ))
            ) : (
              <p className="text-center text-sm leading-7 [&:not(:first-child)]:mt-6">
                No contacts available
              </p>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    )
  }
}

export default SideBarLeft
