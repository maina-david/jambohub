'use client'

import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { Check, CheckIcon, MenuIcon, PhoneCallIcon, SearchIcon, VideoIcon, XCircleIcon } from 'lucide-react'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  EmojiClickData,
  Emoji,
  SuggestionMode,
  SkinTonePickerLocation
} from "emoji-picker-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SmilePlusIcon } from "lucide-react"
import { ChatProps } from '@/types/chat-types'
import { toast } from '@/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'

interface ChatContentAreaProps {
  isMdAndAbove: boolean
  handleLeftSidebarToggle: () => void
  selectedChat: ChatProps | null
}

const ChatContentArea = (props: ChatContentAreaProps) => {
  const {
    isMdAndAbove,
    handleLeftSidebarToggle,
    selectedChat
  } = props
  const queryClient = useQueryClient()
  const [isSending, setIsSending] = useState<boolean>(false)
  const scrollAreaRef = useRef(null)

  // Function to scroll to the bottom of the chat area
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current
      // @ts-ignore
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    scrollToBottom()
  }, [selectedChat])

  const handleStartConversation = () => {
    if (!isMdAndAbove) {
      handleLeftSidebarToggle()
    }
  }

  const [message, setMessage] = useState<string>('')

  function onClick(emojiData: EmojiClickData, event: MouseEvent) {
    setMessage(
      (message: string) =>
        message + (emojiData.emoji)
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSend = async () => {
    try {
      if (selectedChat) {
        setIsSending(true)
        const response = await axios.post('/api/chats/send-message', {
          chatId: selectedChat.id,
          messageType: 'TEXT',
          message
        })
        queryClient.invalidateQueries({ queryKey: ['assignedChats'] })
        setMessage('')
      }
    } catch (error) {
      console.log("Error sending message: ", error.message)
      toast({
        title: 'Error',
        description: 'Error sending message. Try again'
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn("whatsapp-chat-container flex flex-col", isMdAndAbove ? 'w-2/3' : 'grow')}>
      {selectedChat ? (
        <>
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-2.5">
            {isMdAndAbove ? null : (
              <div className='mx-2' onClick={handleLeftSidebarToggle}>
                <MenuIcon className="h-4 w-4" />
              </div>
            )}
            <div className="flex cursor-pointer items-center">
              <div className="flex flex-col">
                <h6 className="scroll-m-20 text-xl font-semibold tracking-tight">{selectedChat.Contact.alias || selectedChat.Contact.identifier}</h6>
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

          {/* Chat messages */}
          <div className="flex h-[470px] flex-col overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="flex-1 overflow-y-auto">
              {selectedChat.chatMessages?.map((chatMessage, index) => (
                <div
                  key={index}
                  className={cn('flex',
                    chatMessage.userId ? 'mr-2 flex-row-reverse' : 'flex-row')}
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
                    <div className={cn("flex space-x-1 text-sm text-gray-600 dark:text-gray-400",
                      chatMessage.userId ? 'justify-end' : 'justify-start')}>
                      {chatMessage.userId ? (
                        <div className='flex'>
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
              ))}
            </ScrollArea>

            {/* Input area */}
            <div className="flex border p-3">
              <Input
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size={'icon'} className='mx-2'>
                    <SmilePlusIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <EmojiPicker
                    onEmojiClick={onClick}
                    autoFocusSearch={false}
                    emojiStyle={EmojiStyle.NATIVE}
                    width={'100%'}
                  />
                </DialogContent>
              </Dialog>
              <Button
                className="ml-2"
                disabled={!message || isSending}
                onClick={handleSend}>
                <PaperPlaneIcon className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className={cn("flex flex-col items-center justify-center", isMdAndAbove ? 'h-[470px]' : 'h-[500px]')}>
          <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-muted px-7 pb-7 pt-8 shadow-2xl">
            <Icons.chat className="h-16 w-16" />
          </div>
          <div onClick={handleStartConversation} className={cn('rounded-md px-6 py-2 shadow-2xl', isMdAndAbove ? 'cursor-default' : 'cursor-pointer')}>
            <p className="text-lg font-medium leading-normal">Start Conversation</p>
          </div>
        </div>
      )
      }
    </div >
  )
}

export default ChatContentArea
