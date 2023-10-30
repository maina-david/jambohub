'use client'

import React, { useState } from 'react'
import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { Button } from '@/components/ui/button'
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
import { useQueryClient } from '@tanstack/react-query'
import { FaCommentSms } from 'react-icons/fa6'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Icons } from '@/components/icons'
import { useParams } from 'next/navigation'
import { smsChannelSchema } from '@/lib/validations/channel'
import { Alert } from '@/components/ui/alert'

export default function SmsChannelLinkDialog() {
  const queryClient = useQueryClient()
  const params = useParams()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const form = useForm<z.infer<typeof smsChannelSchema>>({
    resolver: zodResolver(smsChannelSchema),
    defaultValues: {
      provider: 'AT',
      name: '',
      shortCode: '',
      username: '',
      apiKey: '',
      apiSecret: ''
    },
  })

  const onSubmit = async (values: z.infer<typeof smsChannelSchema>) => {
    try {
      setIsLoading(true)
      await axios.post(`/api/companies/${params?.companyId}/channels/sms`, {
        ...values
      })
      queryClient.invalidateQueries(['companyChannels'])
      toast({
        title: 'Success',
        description: 'Channel created successfully!',
      })
    } catch (error) {
      // Handle specific errors
      if (error.response) {
        if (error.response.status === 422 && error.response.data) {
          // Handle validation errors
          const validationErrors = error.response.data
          // Update form field errors
          form.setError('provider', {
            type: 'manual',
            message: validationErrors.provider || '',
          })
          form.setError('name', {
            type: 'manual',
            message: validationErrors.name || '',
          })
          form.setError('shortCode', {
            type: 'manual',
            message: validationErrors.shortCode || '',
          })
          form.setError('username', {
            type: 'manual',
            message: validationErrors.username || '',
          })
          form.setError('apiKey', {
            type: 'manual',
            message: validationErrors.apiKey || '',
          })
          form.setError('apiSecret', {
            type: 'manual',
            message: validationErrors.apiSecret || '',
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
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} variant={'ghost'}>
          <FaCommentSms className='mr-2 h-4 w-4' />
          SMS
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New SMS channel</DialogTitle>
          <DialogDescription>
            Add a new sms channel for integration
          </DialogDescription>
          <Alert>For 2 way sms make sure you put url as callback</Alert>
        </DialogHeader>
        <div className='grid'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      Enter a display name to associate with this account.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="provider"
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
                        <SelectItem value="AT">Africa&apos;s Talking</SelectItem>
                        <SelectItem value="BONGA">Bonga SMS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the sms provider you want to integrate with.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ShortCode</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter account shortcode"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the shortcode associated with this account.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter account username"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the username associated with this account.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter API Key"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the API Key associated with this account.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apiSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Secret</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter account API secret"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the API secret associated with this account.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  disabled={isLoading}
                  type='submit'
                >
                  {isLoading && (
                    <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Continue
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
