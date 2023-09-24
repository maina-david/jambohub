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
  DialogTitle
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
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useChannelModal } from '@/hooks/use-channel-modal'

const formSchema = z.object({
  channel: z.enum(['WHATSAPP', 'TWITTER', 'FACEBOOK', 'TIKTOK', 'SMS']),
  name: z.string().min(1)
})

function AddChannelModal() {
  const channelModal = useChannelModal()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channel: "WHATSAPP",
      name: "",
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    try {

    } catch (error) {

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

  return (
    <Dialog open={channelModal.isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New channel</DialogTitle>
          <DialogDescription>
            Add a new communication channel for integration
          </DialogDescription>
        </DialogHeader>
        <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="channel"
              render={({ field }) => (
                <FormItem>
                  <Select {...field} disabled={isLoading}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectValue defaultValue={'WHATSAPP'}>WhatsApp</SelectValue>
                      <SelectValue defaultValue={'TWITTER'}>Twitter</SelectValue>
                      <SelectValue defaultValue={'FACEBOOK'}>Facebook</SelectValue>
                      <SelectValue defaultValue={'TIKTOK'}>Tiktok</SelectValue>
                      <SelectValue defaultValue={'SMS'}>SMS</SelectValue>
                    </SelectContent>
                  </Select>
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
