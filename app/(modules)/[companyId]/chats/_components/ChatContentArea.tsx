'use client'

import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { CheckIcon, XCircleIcon, MenuIcon, PhoneCallIcon, SearchIcon, VideoIcon } from 'lucide-react'
import { FaWhatsapp, FaXTwitter, FaFacebookMessenger, FaCommentSms } from "react-icons/fa6"
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react'
import { SmilePlusIcon } from 'lucide-react'
import { ChatProps } from '@/types/chat-types'
import { toast } from '@/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { Channel, ChannelType, ChatMessage } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { fetchChannels } from '@/actions/channel-actions'
import { useParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { PopoverContent } from '@radix-ui/react-popover'
import { Popover } from '@/components/ui/popover'

interface ChatContentAreaProps {
  hidden: boolean
  isMdAndAbove: boolean
  handleLeftSidebarToggle: () => void
  selectedChat: ChatProps | null
  addMessages: (chatId: string, messages: ChatMessage[]) => void
}

const ChatContentArea: React.FC<ChatContentAreaProps> = (props) => {
  const {
    hidden,
    isMdAndAbove,
    handleLeftSidebarToggle,
    selectedChat,
    addMessages } = props
  const queryClient = useQueryClient()
  const [isSending, setIsSending] = useState<boolean>(false)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const [isSelectChannelOpen, setIsSelectChannelOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [selectedChannel, setSelectedChannel] = useState<string>('')
  const params = useParams()
  const [channels, setChannels] = useState<Channel[]>([])

  useEffect(() => {
    if (params?.companyId) {
      fetchChannels(params.companyId as string).then((channels) => {
        setChannels(channels)
      })
    }

    const markChatAsRead = async () => {
      try {
        if (selectedChat) {
          // Filter for incoming messages that are unread
          const unreadIncomingMessages = selectedChat?.chatMessages?.filter((message) => {
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
      } catch (error) {
        console.error('Error marking chat as read:', error.message)
      }
    }

    if (scrollAreaRef.current && selectedChat) {
      // Scroll to the bottom every time a new message is added
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      })
      markChatAsRead()
    }
  }, [params?.companyId, queryClient, selectedChat])

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
        setIsSelectChannelOpen(true)
      } else {
        sendMessage()
        setIsSelectChannelOpen(false)
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
          addMessages(selectedChat.id, [response.data])
          setMessage('')
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
    <>
      <div className={cn('flex flex-col', isMdAndAbove ? 'w-2/3' : 'grow')}>
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
            <div className="flex h-[470px] flex-col overflow-hidden">
              <ScrollArea ref={scrollAreaRef} className="flex-1 overflow-y-auto">
                <AnimatePresence>
                  {selectedChat.chatMessages?.map((chatMessage, index) => (
                    <motion.div
                      key={chatMessage.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                    >
                      <div
                        key={index}
                        className={cn('flex', chatMessage.userId ? 'mr-2 flex-row-reverse' : 'flex-row')}
                      >
                        <div className="mb-2 max-w-[70%] p-2">
                          <div
                            className={cn(
                              chatMessage.userId ? 'bg-green-200 dark:bg-indigo-500' : 'bg-blue-200 dark:bg-blue-600',
                              'rounded-lg p-2'
                            )}
                          >
                            {chatMessage.message}
                          </div>
                          <div className={cn('flex space-x-1 text-sm text-gray-600 dark:text-gray-400', chatMessage.userId ? 'justify-end' : 'justify-start')}>
                            {chatMessage.userId ? (
                              <div className="flex">
                                {chatMessage.internalStatus === 'sent' ? (
                                  <>
                                    <CheckIcon className="h-4 w-4 text-green-500 dark:text-green-300" />
                                    <p>
                                      {new Date(chatMessage.timestamp).toLocaleString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true,
                                      })}
                                    </p>
                                  </>
                                ) : chatMessage.internalStatus === 'failed' ? (
                                  <>
                                    <XCircleIcon className="h-4 w-4 text-red-500 dark:text-red-300" />
                                    <p>
                                      {new Date(chatMessage.timestamp).toLocaleString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true,
                                      })}
                                    </p>
                                  </>
                                ) : (
                                  <p>
                                    {new Date(chatMessage.timestamp).toLocaleString('en-US', {
                                      hour: 'numeric',
                                      minute: 'numeric',
                                      hour12: true,
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
                                    hour12: true,
                                  })}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
              <div className="flex border p-3">
                <Input
                  readOnly={isSending}
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="mx-2">
                      <SmilePlusIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <EmojiPicker
                      onEmojiClick={onClick}
                      autoFocusSearch={false}
                      emojiStyle={EmojiStyle.NATIVE}
                      width="100%"
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  className="ml-2"
                  disabled={!message || isSending}
                  onClick={handleSend}
                >
                  <PaperPlaneIcon className="mr-2 h-4 w-4" />
                  Send
                </Button>
                <Popover open={isSelectChannelOpen} onOpenChange={setIsSelectChannelOpen}>
                  <PopoverContent
                    side={'top'}
                    onInteractOutside={() => setIsSelectChannelOpen(false)}
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
                </Popover>
              </div>
            </div>
          </>
        ) : (
          <div className={cn('flex flex-col items-center justify-center', isMdAndAbove ? 'h-[470px]' : 'h-[500px]')}>
            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-muted px-7 pb-7 pt-8 shadow-2xl">
              <Icons.chat className="h-16 w-16" />
            </div>
            <div onClick={handleStartConversation} className={cn('rounded-md px-6 py-2 shadow-2xl', isMdAndAbove ? 'cursor-default' : 'cursor-pointer')}>
              <p className="text-lg font-medium leading-normal">Start Conversation</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ChatContentArea
