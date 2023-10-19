'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { MenuIcon, PhoneCallIcon, SearchIcon, VideoIcon } from 'lucide-react'
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

  const handleStartConversation = () => {
    if (!isMdAndAbove) {
      handleLeftSidebarToggle()
    }
  }

  const [message, setMessage] = useState<string>('')

  function onClick(emojiData: EmojiClickData, event: MouseEvent) {
    setMessage(
      (message: string) =>
        message + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSend = () => {
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn("flex flex-col rounded-r border",
      isMdAndAbove ? 'w-2/3' : 'grow')}>
      {selectedChat ? (
        <>
          <div className="flex items-center justify-between px-5 py-2.5">
            {isMdAndAbove ? null : (
              <div className='mx-2' onClick={handleLeftSidebarToggle}>
                <MenuIcon className="h-4 w-4" />
              </div>
            )}
            <div className="flex cursor-pointer items-center">
              <div className="flex flex-col">
                <h6 className="scroll-m-20 text-xl font-semibold tracking-tight">{selectedChat.Contact.identifier}</h6>
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
            <ScrollArea className="flex-1 overflow-y-auto">
              {/* Your chat area content goes here */}
            </ScrollArea>
            <div className="flex border p-3">
              <Input
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size={'icon'}
                    className='mx-2'
                  >
                    <SmilePlusIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <EmojiPicker
                    onEmojiClick={onClick}
                    autoFocusSearch={false}
                    emojiStyle={EmojiStyle.NATIVE}
                    width={'100%'}
                  // theme={Theme.AUTO}
                  // searchDisabled
                  // skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
                  // height={350}
                  // width="50%"
                  // emojiVersion="0.6"
                  // lazyLoadEmojis={true}
                  // previewConfig={{
                  //   defaultCaption: "Pick one!",
                  //   defaultEmoji: "1f92a" // 🤪
                  // }}
                  // suggestedEmojisMode={SuggestionMode.RECENT}
                  // skinTonesDisabled
                  // searchPlaceHolder="Filter"
                  // defaultSkinTone={SkinTones.MEDIUM}
                  // emojiStyle={EmojiStyle.NATIVE}
                  // categories={[
                  //   {
                  //     name: "Fun and Games",
                  //     category: Categories.ACTIVITIES
                  //   },
                  //   {
                  //     name: "Smiles & Emotions",
                  //     category: Categories.SMILEYS_PEOPLE
                  //   },
                  //   {
                  //     name: "Flags",
                  //     category: Categories.FLAGS
                  //   },
                  //   {
                  //     name: "Yum Yum",
                  //     category: Categories.FOOD_DRINK
                  //   }
                  // ]}
                  />
                </DialogContent>
              </Dialog>
              <Button className="ml-2" disabled={!message} onClick={handleSend}>
                <PaperPlaneIcon className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className={cn("flex flex-col items-center justify-center",
          isMdAndAbove ? 'h-[470px]' : 'h-[500px]')}>
          <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-muted px-7 pb-7 pt-8 shadow-2xl">
            <Icons.chat className="h-16 w-16" />
          </div>
          <div
            onClick={handleStartConversation}
            className={cn('rounded-md px-6 py-2 shadow-2xl',
              isMdAndAbove ? 'cursor-default' : 'cursor-pointer')}
          >
            <p className="text-lg font-medium leading-normal">Start Conversation</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatContentArea
