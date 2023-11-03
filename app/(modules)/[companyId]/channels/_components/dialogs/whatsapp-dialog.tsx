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
import { Icons } from '@/components/icons'
import { useParams } from 'next/navigation'
import { whatsAppChannelSchema } from '@/lib/validations/channel'

interface WhatsAppChannelProps {
  children: React.ReactNode
}
export default function WhatsAppChannelLinkDialog({ children }: WhatsAppChannelProps) {
  const queryClient = useQueryClient()
  const params = useParams()
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
  return (
    <Dialog open={isWhatsAppDialogOpen} onOpenChange={setIsWhatsAppDialogOpen}>
      <DialogTrigger asChild>
        {children}
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
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>

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
  )
}
