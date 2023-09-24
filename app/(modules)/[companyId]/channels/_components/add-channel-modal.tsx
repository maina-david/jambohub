'use client'

import React, { useState } from 'react'
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

const formSchema = z.object({
  channel: z.enum(['WHATSAPP', 'TWITTER', 'FACEBOOK', 'TIKTOK', 'SMS']),
  name: z.string().min(1)
})

function AddChannelModal() {
  const params = useParams()
  const channelModal = useChannelModal()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      channel: "WHATSAPP",
      name: "",
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    const companyId = params?.companyId
    try {
      const response = await axios.post(`/api/companies/${companyId}/channels`, {
        ...values,
      })
      channelModal.onClose()
      toast({
        title: "Success",
        description: "Channel created successfully!",
      })

    } catch (error) {
      if (error.response) {
        // Handle specific HTTP error codes
        const status = error.response.status
        if (status === 402) {
          toast({
            title: "Requires Pro Plan",
            description: "You need a Pro Plan to create more channels.",
            variant: "destructive",
            action: <ToastAction altText="Upgrade now">Upgrade now</ToastAction>,
          })
        } else if (status === 403) {
          toast({
            title: "Exceeded Maximum Company Limit",
            description: "You've reached the maximum channel limit for your plan.",
            variant: "destructive",
          })
        } else if (status === 422) {
          // Handle validation errors
          const validationErrors = error.response.data
          toast({
            title: "Validation Error",
            description: "Please correct the following errors: " + validationErrors.join(", "),
            variant: "destructive",
          })
        } else {
          // Handle other unexpected errors
          toast({
            title: "Something went wrong.",
            description: "Channel was not created. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        // Handle other unexpected errors
        toast({
          title: "Something went wrong.",
          description: "Channel was not created. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
      channelModal.onClose()
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
        <Button onClick={triggerModal} variant="outline">Add Channel</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New channel</DialogTitle>
          <DialogDescription>
            Add a new communication channel for integration
          </DialogDescription>
        </DialogHeader>
        <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="channel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a channel to integrate with" />
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
                    <Input disabled={isLoading} placeholder="Enter account name" {...field} />
                  </FormControl>
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
                )}{" "}Continue
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddChannelModal
