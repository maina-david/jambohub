'use client'

import React, { useState } from 'react'
import axios from 'axios'
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
import { createContactSchema } from '@/lib/validations/contact'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { toast } from "@/components/ui/use-toast"
import { Icons } from '@/components/icons'

export default function AddContactDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const params = useParams()

  const form = useForm<z.infer<typeof createContactSchema>>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      name: "",
      alias: "",
      identifier: ""
    },
  })

  async function onSubmit(values: z.infer<typeof createContactSchema>) {
    if (params?.companyId) {
      try {
        setIsLoading(true)
        const response = await axios.post(`/api/companies/${params.companyId}/contacts`, {
          ...values
        })

        if (response.status === 201) {
          queryClient.invalidateQueries({ queryKey: ['companyContacts'] })
          toast({
            title: 'Success',
            description: 'Contact created successfully!',
          })
          setIsOpen(false)
        } else {
          toast({
            title: 'Error',
            description: 'Failed to create contact!',
          })
        }
      } catch (error) {
        console.log('Error creating contact: ', error.message)
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
            form.setError('alias', {
              type: 'manual',
              message: validationErrors.alias || '',
            })
            form.setError('identifier', {
              type: 'manual',
              message: validationErrors.identifier || '',
            })
          }
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Dialog open={isOpen || isLoading} onOpenChange={setIsOpen}>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="Enter contact name" {...field} />
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
                    <Input disabled={isLoading} placeholder="Enter contact alias" {...field} />
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
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a channel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="WHATSAPP">
                        <span className="flex">
                          <FaWhatsapp className="mr-2 h-4 w-4" />
                          WhatsApp
                        </span>
                      </SelectItem>
                      <SelectItem disabled value="TWITTER">
                        <span className="flex">
                          <FaXTwitter className='mr-2 h-4 w-4' />
                          Twitter
                        </span>
                      </SelectItem>
                      <SelectItem disabled value="FACEBOOK_MESSENGER">
                        <span className="flex">
                          <FaFacebookMessenger className="mr-2 h-4 w-4" />
                          Messenger
                        </span>
                      </SelectItem>
                      <SelectItem disabled value="SMS">
                        <span className="flex">
                          <FaCommentSms className='mr-2 h-4 w-4' />
                          SMS
                        </span>
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
                    <Input disabled={isLoading} placeholder="Enter contact identifier" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the contact&apos;s identifier.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={isLoading}
                type="submit"
              >
                {isLoading && (
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                )}{' '}
                {isLoading ? 'Saving contact...' : 'Save contact'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
