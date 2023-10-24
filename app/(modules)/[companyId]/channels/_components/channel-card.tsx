'use client'

import { Button } from "@/components/ui/button"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useChannelModal } from "@/hooks/use-channel-modal"
import { cn } from "@/lib/utils"
import { Channel, ChannelToFlow, Flow } from "@prisma/client"
import { CircleEllipsisIcon, Link2Icon, PencilIcon, Trash2Icon } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Icons } from "@/components/icons"
import { useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
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
import { fetchCompanyFlows } from "@/actions/flow-actions"
import { CheckIcon } from "@radix-ui/react-icons"
import { ChannelProps } from "@/types/channel"

export function ChannelCard({ channel }: { channel: ChannelProps }) {
  const queryClient = useQueryClient()
  const params = useParams()
  const [open, setOpen] = useState<boolean>(false)
  const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = useState<boolean>(false)
  const [isLinkUnlinkLoading, setIsLinkUnlinkLoading] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const channelModal = useChannelModal()
  const [channelStatus, setChannelStatus] = useState(channel.status)
  const [isLoadingActivate, setIsLoadingActivate] = useState<boolean>(false)
  const [isLoadingDeactivate, setIsLoadingDeactivate] = useState<boolean>(false)
  const [isLinkChannelFlowOpen, setIsLinkChannelFlowOpen] = useState<boolean>(false)
  const [isLinkingChannelFlow, setIsLinkingChannelFlow] = useState<boolean>(false)
  const [flows, setFlows] = useState<Flow[]>([])
  const [selectedFlow, setSelectedFlow] = useState<string>('')

  console.log(channel)
  useEffect(() => {
    if (params?.companyId) {
      fetchCompanyFlows(params?.companyId as string).then((flows) => {
        setFlows(flows)
      })
    }
  }, [params?.companyId])

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

  const handleUnlinkChannel = async () => {
    try {
      if (channel && params && params.companyId) {
        setIsLinkUnlinkLoading(true)

        // Send a GET request to the /channel.id/unlink endpoint
        const response = await axios.patch(`/api/companies/${params.companyId}/channels/${channel.id}/unlink`)

        if (response.status === 200) {
          // Successfully unlinked the channel
          queryClient.invalidateQueries({ queryKey: ['companyChannels'] })
          toast({
            title: 'Success',
            description: 'Channel unlinked successfully!',
          })
        } else {
          // Handle the case where unlinking was not successful
          console.error('Unlinking failed. Status code: ', response.status)
          toast({
            title: 'Unlinking Failed',
            description: 'Failed to unlink the channel. Please try again.',
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      // Handle errors, e.g., network issues, in this block
      console.error('Error unlinking channel: ', error)
      toast({
        title: 'Unlinking Failed',
        description: 'Failed to unlink the channel. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLinkUnlinkLoading(false)
    }
  }

  const handleDeleteChannel = async () => {
    try {
      if (channel && params && params.companyId) {
        setIsLoading(true)
        const response = await axios.delete(`/api/companies/${params.companyId}/channels/${channel.id}`)

        if (response.status === 204) {
          queryClient.invalidateQueries({ queryKey: ['companyChannels'] })
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
      setIsLoading(false)
      setOpen(false)
    }
  }

  const handleActivateChannel = async () => {

    try {
      if (channel && params && params.companyId) {
        setIsLoadingActivate(true)
        const response = await axios.patch(`/api/companies/${params.companyId}/channels/${channel.id}/activate-deactivate`, {
          status: true, // Set the status to true for activation
        })

        if (response.status === 200) {
          queryClient.invalidateQueries({ queryKey: ['companyChannels'] })
          toast({
            title: 'Success',
            description: 'Channel activated successfully!',
          })
          setChannelStatus(true) // Update the status in the local state
        } else {
          // Handle the case where activation was not successful
          console.error('Activation failed. Status code: ', response.status)
          toast({
            title: 'Activation Failed',
            description: 'Failed to activate the channel. Please try again.',
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      // Handle errors, e.g., network issues, in this block
      console.error('Error activating channel: ', error)
      toast({
        title: 'Activation Failed',
        description: 'Failed to activate the channel. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingActivate(false)
    }
  }

  const handleDeactivateChannel = async () => {
    try {
      if (channel && params && params.companyId) {
        setIsLoadingDeactivate(true)
        const response = await axios.patch(`/api/companies/${params.companyId}/channels/${channel.id}/activate-deactivate`, {
          status: false, // Set the status to false for deactivation
        })

        if (response.status === 200) {
          queryClient.invalidateQueries({ queryKey: ['companyChannels'] })
          toast({
            title: 'Success',
            description: 'Channel deactivated successfully!',
          })
          setChannelStatus(false) // Update the status in the local state
        } else {
          // Handle the case where deactivation was not successful
          console.error('Deactivation failed. Status code: ', response.status)
          toast({
            title: 'Deactivation Failed',
            description: 'Failed to deactivate the channel. Please try again.',
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      // Handle errors, e.g., network issues, in this block
      console.error('Error deactivating channel: ', error)
      toast({
        title: 'Deactivation Failed',
        description: 'Failed to deactivate the channel. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingDeactivate(false)
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

  const LinkChannelToFlow = async () => {
    if (selectedFlow && params?.companyId) {
      const companyId = params.companyId
      const channelId = channel.id
      const flowId = selectedFlow

      try {
        setIsLinkingChannelFlow(true)
        const response = await axios.patch(`/api/companies/${companyId}/channels/${channelId}/link-flow`, {
          flowId
        })

        if (response.status === 200) {
          queryClient.invalidateQueries({ queryKey: ['companyChannels'] })
          toast({
            title: 'Success',
            description: 'Channel linked to flow successfully!',
          })
          setIsLinkChannelFlowOpen(false)
        } else {
          toast({
            title: 'Error',
            description: 'Failed to link flow to the channel.',
            variant: 'destructive'
          })
        }
      } catch (error) {
        // Handle network or other errors
        console.error("An error occurred during linking channel to flow:", error)
        toast({
          title: 'Error',
          description: 'Failed to link flow to the channel.',
          variant: 'destructive'
        })
      } finally {
        setIsLinkingChannelFlow(false)
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.li
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="col-span-1 rounded-lg border-2 shadow-2xl">
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
                  {channel.integrated && (
                    <AlertDialog
                      open={isUnlinkDialogOpen || isLinkUnlinkLoading}
                      onOpenChange={setIsUnlinkDialogOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(event) => {
                            event.preventDefault()
                            setIsUnlinkDialogOpen(true)
                          }}>
                          Unlink Account
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently unlink <span className="font-bold">{channel.name}</span> and remove your saved integration from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleUnlinkChannel}
                            disabled={isLinkUnlinkLoading}
                          >
                            {isLinkUnlinkLoading && (
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}{" "}Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <DropdownMenuItem onClick={openEditModal}>
                    <PencilIcon className="mr-2 h-2 w-2" />Edit
                  </DropdownMenuItem>
                  <AlertDialog open={open || isLoading} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.preventDefault()
                          setOpen(true)
                        }}>
                        <Trash2Icon className="mr-2 h-2 w-2" />Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete <span className="font-bold">{channel.name}</span> and remove your channel data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteChannel}
                          disabled={isLoading}
                        >
                          {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}{" "}Continue
                        </AlertDialogAction>
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
            <p className="mt-1 truncate text-sm font-bold">{channel.identifier ? channel.identifier : 'Not Linked'}</p>
          </div>
          <Image
            className="shrink-0 rounded-full dark:bg-white"
            src={`/images/icons/${channel.type.toLowerCase()}.svg`}
            alt={`${channel.type.toLowerCase()}`}
            width={44}
            height={44}
          />
        </div>
        <div>
          <div className="-mt-px flex">
            <div className="my-1 flex w-0 flex-1">
              <Popover open={isLinkChannelFlowOpen || isLinkingChannelFlow} onOpenChange={setIsLinkChannelFlowOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={'ghost'}
                    disabled={isLinkingChannelFlow}
                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold"
                    onClick={() => setIsLinkChannelFlowOpen(true)}
                  >
                    {isLinkingChannelFlow && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Channel<Link2Icon />Flow
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  onInteractOutside={() => setIsLinkChannelFlowOpen(false)}
                >
                  <Command className="mt-2 rounded-lg border shadow-md">
                    <CommandInput placeholder="Type a flow name to search..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Published Flows">
                        {flows.map((flow) => (
                          <CommandItem
                            disabled={channel.ChannelToFlow.flowId === flow.id}
                            key={flow.id}
                            value={flow.id}
                            onSelect={(currentValue) => {
                              setSelectedFlow(currentValue)
                              LinkChannelToFlow()
                            }}
                            className='cursor-pointer'
                          >
                            {channel.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                (selectedFlow === flow.id || channel.ChannelToFlow.flowId === flow.id) ? "opacity-100" : "opacity-0"
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
            <div className="my-1 flex w-0 flex-1">
              <Button
                variant={'ghost'}
                onClick={
                  channelStatus
                    ? handleDeactivateChannel
                    : handleActivateChannel
                }
                disabled={isLoadingActivate || isLoadingDeactivate}
                className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold"
              >
                {isLoadingActivate || isLoadingDeactivate ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  channelStatus ? 'Deactivate' : 'Activate'
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.li>
    </AnimatePresence>
  )
}
