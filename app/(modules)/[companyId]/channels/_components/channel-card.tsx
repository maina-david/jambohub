'use client'

import { Button } from "@/components/ui/button"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useChannelModal } from "@/hooks/use-channel-modal"
import { cn } from "@/lib/utils"
import { Channel } from "@prisma/client"
import { CircleEllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useState } from "react"

interface ChannelProps {
  channel: Channel
}

export function ChannelCard({ channel }: ChannelProps) {
  const params = useParams()
  const [open, setOpen] = useState(false)
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

  const handleDeleteChannel = async () => {
    try {
      if (channel && params) {
        const response = await axios.delete(`/api/companies/${params.companyId}/channels//${channel.id}`)

        if (response.status === 204) {
          toast({
            title: 'Success',
            description: 'Channel deleted successfully!',
          })
        } else {
          // Handle the case where the delete was not successful
          console.error("Delete failed. Status code: ", response.status)
          toast({
            title: 'Deletion Failed',
            description: 'Failed to delete the channel. Please try again.',
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      // Handle errors, e.g., network issues, in this block
      console.error("Error deleting channel: ", error)
      toast({
        title: 'Deletion Failed',
        description: 'Failed to delete the channel. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setOpen(false)
    }
  }


  const typeColorClasses = {
    WHATSAPP: {
      text: 'text-green-700',
      bg: 'bg-green-50',
      ring: 'ring-green-600/20'
    },
    FACEBOOK: {
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      ring: 'ring-blue-600/20'
    },
    TWITTER: {
      text: 'text-blue-500',
      bg: 'bg-blue-50',
      ring: 'ring-blue-600/20'
    },
    TIKTOK: {
      text: 'text-pink-700',
      bg: 'bg-pink-50',
      ring: 'ring-pink-600/20'
    },
    SMS: {
      text: 'text-purple-700',
      bg: 'bg-purple-50',
      ring: 'ring-purple-600/20'
    },
  }[channel.type] || {
    text: 'text-gray-700',
    bg: 'bg-gray-50',
    ring: 'ring-gray-600/20'
  }


  return (
    <li className="col-span-1 rounded-lg shadow-2xl">
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
                <AlertDialog open={open} onOpenChange={setOpen}>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(event) => {
                        event.preventDefault();
                        setOpen(true);
                      }}>
                      <Trash2Icon className="mr-2 h-2 w-2" />Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete {channel.name} and remove your channel data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteChannel}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className={`inline-flex shrink-0 items-center rounded-full ${typeColorClasses.text} px-1.5 py-0.5 text-xs ${typeColorClasses.bg} font-medium ring-1 ring-inset ${typeColorClasses.ring} `}>
              {channel.type.toLowerCase()}
            </span>
          </div>
          <p className="mt-1 truncate text-sm">{channel.description}</p>
        </div>
        <Image
          className="shrink-0 rounded-full bg-gray-300"
          src={`/images/icons/${channel.type.toLowerCase()}.svg`}
          alt={`${channel.type.toLowerCase()}`}
          width={44}
          height={44}
        />
      </div>
      <div>
        <div className="-mt-px flex">
          <div className="my-1 flex w-0 flex-1">
            <Button
              variant={channel.integrated ? 'secondary' : 'outline'}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold"
            >
              {channel.integrated ? 'Unlink' : 'Link'}
            </Button>
          </div>
          <div className="my-1 flex w-0 flex-1">
            <Button
              variant={channel.status ? 'secondary' : 'outline'}
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
