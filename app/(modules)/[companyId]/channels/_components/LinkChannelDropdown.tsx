'use client'

import React, { useEffect, useState } from 'react'
import {
  FaWhatsapp,
  FaXTwitter,
  FaFacebookMessenger,
} from "react-icons/fa6"
import { BiDialpad } from "react-icons/bi"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Icons } from '@/components/icons'
import { useParams } from 'next/navigation'
import { ussdChannelSchema, whatsAppChannelSchema } from '@/lib/validations/channel'
export default function LinkChannelDropdown() {
  const queryClient = useQueryClient()
  const params = useParams()
  const [isUSSDDialogOpen, setIsUSSDDialogOpen] = useState<boolean>(false)
  const [isUSSDLoading, setIsUSSDLoading] = useState<boolean>(false)
  const [isWhatsAppDialogOpen, setIsWhatsAppDialogOpen] = useState<boolean>(false)
  const [isWhatsAppLoading, setIsWhatsAppLoading] = useState<boolean>(false)
  const WhatsAppForm = useForm<z.infer<typeof whatsAppChannelSchema>>({
    resolver: zodResolver(whatsAppChannelSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      phoneNumberId: '',
      accessToken: '',
    },
  })
  const USSDForm = useForm<z.infer<typeof ussdChannelSchema>>({
    resolver: zodResolver(ussdChannelSchema),
    defaultValues: {
      name: '',
      serviceCode: '',
      username: '',
      apiKey: '',
    },
  })

  const onWhatsAppFormSubmit = async (values: z.infer<typeof whatsAppChannelSchema>) => {
    try {
      setIsWhatsAppLoading(true)
      await axios.post(`/api/companies/${params?.companyId}/channels/whatsapp`, {
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
          WhatsAppForm.setError('name', {
            type: 'manual',
            message: validationErrors.name || '',
          })
          WhatsAppForm.setError('phoneNumber', {
            type: 'manual',
            message: validationErrors.phoneNumber || '',
          })
          WhatsAppForm.setError('phoneNumberId', {
            type: 'manual',
            message: validationErrors.phoneNumberId || '',
          })
          WhatsAppForm.setError('accessToken', {
            type: 'manual',
            message: validationErrors.accessToken || '',
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
      setIsWhatsAppLoading(false)
    }
  }

  const onUSSDFormSubmit = async (values: z.infer<typeof ussdChannelSchema>) => {
    try {
      setIsUSSDLoading(true)
      await axios.post(`/api/companies/${params?.companyId}/channels/ussd`, {
        ...values
      })
      queryClient.invalidateQueries(['companyChannels'])
      setIsUSSDDialogOpen(false)
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
          USSDForm.setError('name', {
            type: 'manual',
            message: validationErrors.name || '',
          })
          USSDForm.setError('serviceCode', {
            type: 'manual',
            message: validationErrors.serviceCode || '',
          })
          USSDForm.setError('username', {
            type: 'manual',
            message: validationErrors.username || '',
          })
          USSDForm.setError('apiKey', {
            type: 'manual',
            message: validationErrors.apiKey || '',
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
      setIsUSSDLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={'outline'}>
          Connect Channel
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Supported Channels</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Dialog open={isWhatsAppDialogOpen} onOpenChange={setIsWhatsAppDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
                setIsWhatsAppDialogOpen(true)
              }}
              className="cursor-pointer"
            >
              <FaWhatsapp className="mr-2 h-4 w-4" />
              WhatsApp
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New WhatsApp Channel</DialogTitle>
              <DialogDescription>Add a new WhatsApp channel for integration</DialogDescription>
            </DialogHeader>
            <div className='grid'>
              <Form {...WhatsAppForm}>
                <form onSubmit={WhatsAppForm.handleSubmit(onWhatsAppFormSubmit)}>
                  <FormField
                    control={WhatsAppForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isWhatsAppLoading}
                            placeholder="Enter Name"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the name for the WhatsApp channel
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={WhatsAppForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isWhatsAppLoading}
                            placeholder="Enter Phone Number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Enter the Phone Number associated with your WhatsApp account.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={WhatsAppForm.control}
                    name="phoneNumberId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number ID</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isWhatsAppLoading}
                            placeholder="Enter Phone Number ID"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Enter the Phone Number ID associated with your WhatsApp account.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={WhatsAppForm.control}
                    name="accessToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Token</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isWhatsAppLoading}
                            placeholder="Enter Access Token"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Enter the Access Token associated with your WhatsApp account.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      disabled={isWhatsAppLoading}
                      type='submit'
                    >
                      {isWhatsAppLoading && (
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
        <Dialog open={isUSSDDialogOpen} onOpenChange={setIsUSSDDialogOpen} modal>
          <DialogTrigger asChild>
            <DropdownMenuItem
              className='cursor-pointer'
              onSelect={(event) => {
                event.preventDefault()
                setIsUSSDDialogOpen(true)
              }}
            >
              <BiDialpad className='mr-2 h-4 w-4' />
              USSD
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New USSD channel</DialogTitle>
              <DialogDescription>
                Only Africa&apos;s Talking integration supported.
                Make sure you specify callback url as:
                <code
                  className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                  https://jambohub.vercel.app/api/webhooks/ussd
                </code>
              </DialogDescription>
            </DialogHeader>
            <Form {...USSDForm}>
              <form onSubmit={USSDForm.handleSubmit(onUSSDFormSubmit)}>
                <FormField
                  control={USSDForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUSSDLoading}
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
                  control={USSDForm.control}
                  name="serviceCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Code</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUSSDLoading}
                          placeholder="Enter account service code"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the service code associated with this account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={USSDForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUSSDLoading}
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
                  control={USSDForm.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUSSDLoading}
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
                <DialogFooter>
                  <Button
                    disabled={isUSSDLoading}
                    type='submit'
                  >
                    {isUSSDLoading && (
                      <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Continue
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <DropdownMenuItem
          disabled
          className='cursor-not-allowed'
        >
          <FaFacebookMessenger className='mr-2 h-4 w-4' />
          Messenger
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled
          className='cursor-not-allowed'
        >
          <FaXTwitter className='mr-2 h-4 w-4' />
          Twitter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}
