'use client'

import React, { useEffect, useState } from 'react'
import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useChannelModal } from '@/hooks/use-channel-modal'
import { ToastAction } from '@/components/ui/toast'
import { useParams } from 'next/navigation'
import { SelectValue } from '@radix-ui/react-select'
import { Textarea } from '@/components/ui/textarea'
import { Channel } from '@prisma/client'

const formSchema = z.object({
  channel: z
    .string({
      required_error: "Please select a channel to integrate.",
    }),
  name: z.string().min(1),
  description: z.string().min(3).max(128)
})

interface ChannelProps {
  channel: Channel | null
}
export default function ChannelModal({ channel }: ChannelProps) {
  const params = useParams()
  const channelModal = useChannelModal()
  const [isLoading, setIsLoading] = useState(false)

  const isUpdateMode = !!channel
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channel: isUpdateMode ? channel?.type : '',
      name: isUpdateMode ? channel?.name : '',
      description: isUpdateMode ? channel?.description : '',
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    const companyId = params?.companyId

    try {
      if (isUpdateMode) {
        // Update existing channel
        const channelId = channel.id
        const response = await axios.patch(`/api/companies/${companyId}/channels/${channelId}`, {
          ...values,
        })
        channelModal.setChannel(response.data)
        toast({
          title: 'Success',
          description: 'Channel updated successfully!',
        })
      } else {
        // Create a new channel
        const response = await axios.post(`/api/companies/${companyId}/channels`, {
          ...values,
        })
        toast({
          title: 'Success',
          description: 'Channel created successfully!',
        })
      }

      channelModal.onClose()
    } catch (error) {
      // Handle errors
    } finally {
      setIsLoading(false)
    }
  }

  const onChange = (open: boolean) => {
    if (!open) {
      channelModal.onClose()
    }
  }

  function triggerModal() {
    channelModal.onOpen()
  }

  return (
    <Dialog open={channelModal.isOpen} onOpenChange={onChange}>
      <DialogTrigger asChild>
        <Button onClick={triggerModal} variant="outline">
          {isUpdateMode ? 'Edit Channel' : 'Add Channel'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdateMode ? 'Edit channel' : 'New channel'}</DialogTitle>
          <DialogDescription>
            {isUpdateMode ? 'Update communication channel for integration' : 'Add a new communication channel for integration'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="channel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading || isUpdateMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a channel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      <SelectItem value="TWITTER">Twitter</SelectItem>
                      <SelectItem value="FACEBOOK">Facebook</SelectItem>
                      <SelectItem value="TIKTOK">Tiktok</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the communication channel you want to integrate with.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter account name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the name associated with this account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      placeholder="Enter account description"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a brief description of the account. This will help identify the account&apos;s purpose.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={isLoading}
                type="submit">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}{' '}
                {isUpdateMode ? 'Update' : 'Continue'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

