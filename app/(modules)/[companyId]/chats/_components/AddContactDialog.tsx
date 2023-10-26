import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  FaWhatsapp,
  FaXTwitter,
  FaFacebookMessenger,
  FaCommentSms
} from "react-icons/fa6"
import { UserPlus2Icon } from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const contactSchema = z.object({
  name: z.string().min(2).max(50),
  alias: z.string().min(2).max(50).optional(),
  channel: z.enum(['WHATSAPP']),
  identifier: z.string().min(1)
})

export default function AddContactDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      alias: "",
    },
  })

  function onSubmit(values: z.infer<typeof contactSchema>) {
    console.log(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} variant={'ghost'} size={'icon'}>
          <UserPlus2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Fill in the contact details to add a new contact.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name of the contact.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Alias</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact alias" {...field} />
                    </FormControl>
                    <FormDescription>
                      (Optional) An alias for the contact.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a channel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="WHATSAPP">
                          <FaWhatsapp className="mr-2 h-4 w-4" />
                          WhatsApp
                        </SelectItem>
                        <SelectItem disabled value="TWITTER">
                          <FaXTwitter className='mr-2 h-4 w-4' />
                          Twitter
                        </SelectItem>
                        <SelectItem disabled value="FACEBOOK_MESSENGER">
                          <FaFacebookMessenger className="mr-2 h-4 w-4" />
                          Messenger
                        </SelectItem>
                        <SelectItem disabled value="SMS">
                          <FaCommentSms className='mr-2 h-4 w-4' />
                          SMS
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the communication channel.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifier</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact identifier" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the contact&apos;s identifier.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save contact</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
