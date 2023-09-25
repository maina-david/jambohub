'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChannelModal } from "@/hooks/use-channel-modal"
import { cn } from "@/lib/utils"
import { Channel } from "@prisma/client"
import { CircleEllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react"
import Image from "next/image"

interface ChannelProps {
  channel: Channel
}

export function ChannelCard({ channel }: ChannelProps) {
  const channelModal = useChannelModal()
  const openEditModal = () => {
    // Check if there is channel to determine edit or create mode
    if (channel) {
      // Edit mode: set the channel
      channelModal.setChannel(channel)
    } else {
      // Create mode: clear any existing channel
      channelModal.setChannel(null)
    }

    channelModal.onOpen()
  }

  const ringColorClass = {
    WHATSAPP: 'ring-green-500',
    FACEBOOK: 'ring-blue-500',
    TWITTER: 'ring-blue-300',
    TIKTOK: 'ring-pink-500',
    SMS: 'ring-purple-500',
  }[channel.type] || ''


  const typeColorClasses = {
    WHATSAPP: {
      text: 'text-green-700',
      bg: 'bg-green-50',
    },
    FACEBOOK: {
      text: 'text-blue-700',
      bg: 'bg-blue-50',
    },
    TWITTER: {
      text: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    TIKTOK: {
      text: 'text-pink-700',
      bg: 'bg-pink-50',
    },
    SMS: {
      text: 'text-purple-700',
      bg: 'bg-purple-50',
    },
  }[channel.type] || {
    text: 'text-gray-700',
    bg: 'bg-gray-50',
  }


  return (
    <li className={`col-span-1 divide-y divide-current rounded-lg shadow ring-2 ${ringColorClass}`}>
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <h3 className="truncate text-sm font-medium">{channel.name}</h3>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={openEditModal}>
                  <PencilIcon className="mr-2 h-2 w-2" />Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash2Icon className="mr-2 h-2 w-2" />Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className={`inline-flex shrink-0 items-center rounded-full ${typeColorClasses.text} px-1.5 py-0.5 text-xs ${typeColorClasses.bg} font-medium ring-1 ring-inset ring-green-600/20 `}>
              {channel.type.toLowerCase()}
            </span>
          </div>
          <p className="mt-1 truncate text-sm">{channel.description}</p>
        </div>
        <Image
          className=" shrink-0 rounded-full bg-gray-300"
          src={`/images/icons/${channel.type.toLowerCase()}.svg`}
          alt={`${channel.type.toLowerCase()}`}
          width={44}
          height={44}
        />
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="my-1 flex w-0 flex-1">
            <Button
              variant={channel.integrated ? 'destructive' : 'outline'}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold"
            >
              {channel.integrated ? 'Unlink' : 'Link'}
            </Button>
          </div>
          <div className="my-1 flex w-0 flex-1">
            <Button
              variant={channel.status ? 'destructive' : 'outline'}
              className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold"
            >
              {channel.status ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}
