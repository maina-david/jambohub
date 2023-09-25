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
import { Channel } from "@prisma/client"
import { PencilIcon, Trash2Icon } from "lucide-react"
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
  return (
    <li className="col-span-1 divide-y divide-gray-200 rounded-lg shadow">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium">{channel.name}</h3>
            <span className="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
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
        <div className="-mt-px mb-1 flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <Button
              variant={channel.integrated ? 'destructive' : 'outline'}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold"
            >
              {channel.integrated ? 'Unlink' : 'Link'}
            </Button>
          </div>
          <div className="-ml-px flex w-0 flex-1">
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
