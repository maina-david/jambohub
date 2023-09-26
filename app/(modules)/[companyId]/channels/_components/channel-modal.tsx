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
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useChannelModal } from '@/hooks/use-channel-modal'
import { ToastAction } from '@/components/ui/toast'
import { useParams } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { useQueryClient } from '@tanstack/react-query'

const formSchema = z.object({
  channel: z
    .string({
      required_error: "Please select a channel to integrate.",
    }),
  name: z.string().min(1),
  description: z.string().min(3).max(128)
})

export default function ChannelModal() {
  const queryClient = useQueryClient()
  const params = useParams()
  const channelModal = useChannelModal()
  const [isLoading, setIsLoading] = useState(false)
  const channel = channelModal.channel
  const isUpdateMode = !!channel

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channel: '',
      name: '',
      description: '',
    },
  })

  if (isUpdateMode) {
    form.setValue('channel', channel.type)
    form.setValue('name', channel.name)
    form.setValue('description', channel.description)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    const companyId = params?.companyId

    try {
      if (isUpdateMode) {
        // Update existing channel
        const channelId = channel?.id
        const response = await axios.patch(`/api/companies/${companyId}/channels/${channelId}`, {
          ...values,
        })

        // Check if the update was successful
        if (response.status === 200) {
          queryClient.invalidateQueries({ queryKey: ['companyChannels'] })
          toast({
            title: 'Success',
            description: 'Channel updated successfully!',
          })
        } else {
          // Handle the case where the update was not successful
          toast({
            title: 'Update Failed',
            description: 'Failed to update the channel. Please try again.',
            variant: 'destructive',
          })
        }
      } else {
        // Create a new channel
        const response = await axios.post(`/api/companies/${companyId}/channels`, {
          ...values,
        })

        // Check if the creation was successful
        if (response.status === 201) {
          queryClient.invalidateQueries({ queryKey: ['companyChannels'] })
          toast({
            title: 'Success',
            description: 'Channel created successfully!',
          })
        } else {
          // Handle the case where the creation was not successful
          toast({
            title: 'Creation Failed',
            description: 'Failed to create the channel. Please try again.',
            variant: 'destructive',
          })
        }
      }

      channelModal.onClose()
    } catch (error) {
      // Handle specific errors
      if (error.response) {
        if (error.response.status === 422 && error.response.data) {
          // Handle validation errors
          const validationErrors = error.response.data
          // Update form field errors
          form.setError('channel', {
            type: 'manual',
            message: validationErrors.channel || '',
          })
          form.setError('name', {
            type: 'manual',
            message: validationErrors.name || '',
          })
          form.setError('description', {
            type: 'manual',
            message: validationErrors.description || '',
          })
        } else if (error.response.status === 402) {
          // Handle RequiresProPlanError
          toast({
            title: 'Requires Pro Plan',
            description: 'You need a pro plan for this operation.',
            variant: 'destructive',
          })
        } else if (error.response.status === 403) {
          // Handle RequiresActivePlanError or MaximumPlanResourcesError
          toast({
            title: 'Permission Denied',
            description: 'You do not have permission for this operation.',
            variant: 'destructive',
          })
        }
      } else {
        // Handle general errors
        console.error(error)
        toast({
          title: 'Error',
          description: 'An error occurred. Please try again later.',
          variant: 'destructive',
        })
      }
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
                    value={field.value !== '' ? field.value : undefined}
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

