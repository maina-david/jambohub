'use client'

import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import {
  CheckIcon,
  XCircleIcon,
  MenuIcon,
  PhoneCallIcon,
  SearchIcon,
  VideoIcon
} from 'lucide-react'
import {
  FaWhatsapp,
  FaXTwitter,
  FaFacebookMessenger,
  FaCommentSms
} from "react-icons/fa6"
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react'
import { SmilePlusIcon } from 'lucide-react'
import { ChatProps } from '@/types/chat-types'
import { toast } from '@/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { Channel, ChannelType, ChatMessage } from '@prisma/client'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { fetchChannels } from '@/actions/channel-actions'
import { useParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { PopoverContent } from '@radix-ui/react-popover'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { useTheme } from "next-themes"
import Linkify from "linkify-react"
import { format, isToday } from 'date-fns'

interface ChatContentAreaProps {
  hidden: boolean
  isMdAndAbove: boolean
  handleLeftSidebarToggle: () => void
  setSelectedChat: (contactId: string) => void
  selectedChat: ChatProps | null
  addMessages: (chatId: string, messages: ChatMessage[]) => void
}

const ChatContentArea: React.FC<ChatContentAreaProps> = ({
  hidden,
  isMdAndAbove,
  handleLeftSidebarToggle,
  setSelectedChat,
  selectedChat,
  addMessages,
}) => {
  const { theme } = useTheme()
  const queryClient = useQueryClient()
  const [isSending, setIsSending] = useState<boolean>(false)
  const bottomScrollAreaRef = useRef<HTMLDivElement | null>(null)
  const [isChannelPopoverOpen, setIsChannelPopoverOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [selectedChannel, setSelectedChannel] = useState<string>('')
  const params = useParams()
  const [channels, setChannels] = useState<Channel[]>([])

  const scrollToLastMessage = () => {
    if (selectedChat && bottomScrollAreaRef.current) {
      bottomScrollAreaRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const markChatAsRead = async () => {
    try {
      if (selectedChat) {
        // Filter for incoming messages that are unread
        if (selectedChat.chatMessages && selectedChat.chatMessages.length > 0) {
          const unreadIncomingMessages = selectedChat?.chatMessages.filter((message) => {
            return message.direction === 'INCOMING' && message.internalStatus === 'unread'
          })

          if (unreadIncomingMessages) {
            if (unreadIncomingMessages.length > 0) {
              const messageIds = unreadIncomingMessages.map((message) => message.id)

              const response = await axios.post(`/api/chats/${selectedChat.id}/messages/mark-read`, {
                messageIds,
              })

              if (response.status === 201) {
                queryClient.invalidateQueries({ queryKey: ['assignedChats'] })
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error marking chat as read:', error.message)
    }
  }

  useEffect(() => {
    scrollToLastMessage()
    markChatAsRead()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat, selectedChat?.chatMessages])

  useEffect(() => {
    if (params?.companyId) {
      fetchChannels(params.companyId as string).then((channels) => {
        setChannels(channels)
      })
    }
  }, [params?.companyId])

  const handleStartConversation = () => {
    if (!isMdAndAbove) {
      handleLeftSidebarToggle()
    }
  }

  function onClick(emojiData: EmojiClickData) {
    setMessage((prevMessage) => prevMessage + emojiData.emoji)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }
  const handleSend = async () => {
    if (selectedChat) {
      if (!selectedChat.channelId && !selectedChannel) {
        setIsChannelPopoverOpen(true)
      } else {
        sendMessage()
        setIsChannelPopoverOpen(false)
      }
    }
  }
  const sendMessage = async () => {
    try {
      if (selectedChat) {
        setIsSending(true)
        const response = await axios.post('/api/chats/send-message', {
          chatId: selectedChat.id,
          contactId: selectedChat.contactId,
          channelId: selectedChat.channelId ? selectedChat.channelId : selectedChannel,
          messageType: 'TEXT',
          message,
        })

        if (response.status === 200) {
          setSelectedChat(selectedChat.id)
          setMessage('')
          scrollToLastMessage()
          queryClient.invalidateQueries({ queryKey: ['assignedChats'] })
        }
      }
    } catch (error) {
      console.error('Error sending message:', error.message)
      toast({
        title: 'Error',
        description: 'Error sending message. Try again',
        variant: 'destructive'
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!isSending && message) {
        e.preventDefault()
        handleSend()
      }
    }
  }

  return (
    <div className={cn('flex h-[85vh] flex-col', isMdAndAbove ? 'w-2/3' : 'w-full')}>
      {selectedChat ? (
        <>
          <div className="flex items-center justify-between px-5 py-2.5">
            {!isMdAndAbove && (
              <div className="mx-2" onClick={handleLeftSidebarToggle}>
                <MenuIcon className="h-4 w-4" />
              </div>
            )}
            <div className="flex cursor-pointer items-center">
              <div className="flex flex-col">
                <h6 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {selectedChat.Contact.name || selectedChat.Contact.identifier}
                </h6>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="ghost">
                <PhoneCallIcon className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <VideoIcon className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Separator />
          <AnimatePresence>
            <ScrollArea className="relative h-[80vh] flex-1">
              {selectedChat.chatMessages && selectedChat.chatMessages?.map((chatMessage, index) => {
                const messageDate = new Date(chatMessage.timestamp);
                const currentMessageDate = messageDate.toLocaleDateString();
                const previousMessageDate =
                  index > 0 ? new Date(selectedChat.chatMessages[index - 1].timestamp).toLocaleDateString() : null;

                const showDateDivider = currentMessageDate !== previousMessageDate;

                return (
                  <motion.div
                    key={chatMessage.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {showDateDivider && (
                      <div className="my-2 text-center text-sm text-gray-500">
                        {isToday(messageDate)
                          ? 'Today'
                          : format(messageDate, 'MMMM d, yyyy')}
                      </div>
                    )}
                    <div
                      key={index}
                      className={cn(
                        'flex',
                        chatMessage.userId ? 'mr-2 flex-row-reverse' : 'flex-row'
                      )}
                    >
                      <div className="mb-2 max-w-[70%] p-2">
                        <div
                          className={cn(
                            chatMessage.userId
                              ? 'bg-green-200 dark:bg-indigo-500'
                              : 'bg-blue-200 dark:bg-blue-600',
                            'rounded-lg p-2'
                          )}
                        >
                          <Linkify
                            as="p"
                            options={{
                              format: {
                                url: (value) => (value.length > 50 ? value.slice(0, 50) + "…" : value),
                              },
                              target: '_blank',
                              render: {
                                url: ({ attributes, content }) => {
                                  return (
                                    <a
                                      {...attributes}
                                      className="text-blue-500 underline hover:underline-offset-4 dark:text-blue-300"
                                    >
                                      {content}
                                    </a>
                                  )
                                },
                              },
                            }}
                          >
                            {chatMessage.message}
                          </Linkify>
                        </div>
                        <div
                          className={cn(
                            'flex space-x-1 text-sm text-gray-600 dark:text-gray-400',
                            chatMessage.userId ? 'justify-end' : 'justify-start'
                          )}
                        >
                          {chatMessage.userId ? (
                            <div className="flex">
                              {chatMessage.externalStatus === 'sent' ? (
                                <>
                                  <CheckIcon className="h-4 w-4 text-green-500 dark:text-green-300" />
                                  <p>
                                    {new Date(chatMessage.timestamp).toLocaleString(
                                      'en-US',
                                      {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: false,
                                      }
                                    )}
                                  </p>
                                </>
                              ) : chatMessage.externalStatus === 'read' ? (
                                <>
                                  <div className="flex">
                                    <CheckIcon className="h-4 w-4 text-green-500 dark:text-green-300" />
                                    <CheckIcon className="h-4 w-4 text-green-500 dark:text-green-300" />
                                  </div>
                                  <p>
                                    {new Date(chatMessage.timestamp).toLocaleString(
                                      'en-US',
                                      {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: false,
                                      }
                                    )}
                                  </p>
                                </>
                              ) : chatMessage.externalStatus === 'failed' ? (
                                <>
                                  <XCircleIcon className="h-4 w-4 text-red-500 dark:text-red-300" />
                                  <p>
                                    {new Date(chatMessage.timestamp).toLocaleString(
                                      'en-US',
                                      {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: false,
                                      }
                                    )}
                                  </p>
                                </>
                              ) : (
                                <p>
                                  {new Date(chatMessage.timestamp).toLocaleString('en-US', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: false,
                                  })}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <p>
                                {new Date(chatMessage.timestamp).toLocaleString('en-US', {
                                  hour: 'numeric',
                                  minute: 'numeric',
                                  hour12: false,
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              <div ref={bottomScrollAreaRef}></div>
            </ScrollArea>
          </AnimatePresence>
          <div className="flex border p-3">
            <Input
              readOnly={isSending}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="mx-2">
                  <SmilePlusIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <EmojiPicker
                  onEmojiClick={onClick}
                  autoFocusSearch={false}
                  emojiStyle={EmojiStyle.NATIVE}
                  width="100%"
                  theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}
                />
              </PopoverContent>
            </Popover>
            {!selectedChat.channelId && !selectedChannel ?
              (<Popover open={isChannelPopoverOpen} onOpenChange={setIsChannelPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className="ml-2"
                    disabled={!message || isSending}
                  >
                    <PaperPlaneIcon className="mr-2 h-4 w-4" />
                    {isSending ? 'Sending...' : 'Send'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  onInteractOutside={() => setIsChannelPopoverOpen(false)}
                >
                  <Command className="mt-2 rounded-lg border shadow-md">
                    <CommandInput placeholder="Type a channel name to search..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Integrated Channels">
                        {channels.map((channel) => (
                          <CommandItem
                            disabled={isSending}
                            key={channel.id}
                            value={channel.id}
                            onSelect={(currentValue) => {
                              setSelectedChannel(currentValue)
                              handleSend()
                            }}
                            className='cursor-pointer'
                          >
                            {channel.type === ChannelType.WHATSAPP && (
                              <FaWhatsapp className="mr-2 h-4 w-4" />
                            )}
                            {channel.type === ChannelType.TWITTER && (
                              <FaXTwitter className="mr-2 h-4 w-4" />
                            )}
                            {channel.type === ChannelType.FACEBOOK_MESSENGER && (
                              <FaFacebookMessenger className="mr-2 h-4 w-4" />
                            )}
                            {channel.type === ChannelType.SMS && (
                              <FaCommentSms className="mr-2 h-4 w-4" />
                            )}
                            {channel.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedChannel === channel.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>) : (
                <Button
                  className="ml-2"
                  disabled={!message || isSending}
                  onClick={handleSend}
                >
                  <PaperPlaneIcon className="mr-2 h-4 w-4" />
                  {isSending ? 'Sending...' : 'Send'}
                </Button>
              )
            }
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-muted px-7 pb-7 pt-8 shadow-2xl">
              <Icons.chat className="h-16 w-16" />
            </div>
            <div onClick={handleStartConversation} className={cn('rounded-md px-6 py-2 shadow-2xl', isMdAndAbove ? 'cursor-default' : 'cursor-pointer')}>
              <p className="text-lg font-medium leading-normal">Start Conversation</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatContentArea
