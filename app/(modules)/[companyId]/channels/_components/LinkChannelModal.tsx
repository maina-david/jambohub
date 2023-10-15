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
  DialogTrigger
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Channel } from '@prisma/client'
import WhatsAppForm from './forms/WhatsAppForm'
import SMSForm from './forms/SMSForm'
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from 'react-hook-form'
import { toast } from "@/components/ui/use-toast"
import { Icons } from '@/components/icons'
import { useQueryClient } from '@tanstack/react-query'
import WhatsAppSignUpFlow from './forms/WhatsAppSignUpFlow'

interface ChannelProps extends React.HTMLAttributes<HTMLDivElement> {
  channel: Channel
}

const WhatsAppFormSchema = z.object({
  accessToken: z.string().min(1),
  phoneNumberId: z.string(),
})

const SMSFormSchema = z.object({
  apiKey: z.string()
})

export default function LinkChannelModal({ channel, className, children }: ChannelProps) {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const formSchema = channel.type === 'WHATSAPP' ? WhatsAppFormSchema : SMSFormSchema
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessToken: "",
      phoneNumberId: "",
      apiKey: "",
    },
  })

  // Determine the form to display based on the channel type
  const renderChannelForm = () => {
    switch (channel.type) {
      case 'WHATSAPP':
        return <WhatsAppSignUpFlow />
      case 'SMS':
        return <SMSForm form={form} />
      default:
        return null
    }
  }

  // Conditionally render the "Continue" button
  const renderContinueButton = () => {
    if (renderChannelForm()) {
      // Display the button only if a form is returned
      return (
        <Button
          disabled={isLoading}
          type="submit"
        >
          {isLoading && (
            <Icons.spinner className='mr-2 h-4 w-4' />
          )}{" "} Continue
        </Button>
      )
    }
    return null
  }

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      await axios.patch(`/api/companies/${channel.companyId}/channels/${channel.id}/link`, {
        ...values
      })
      queryClient.invalidateQueries({ queryKey: ['companyChannels'] })
      toast({
        title: 'Success',
        description: 'Channel linked successfully!',
      })
      setIsOpen(false)
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update the channel. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} variant="ghost" className={cn('', className)}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link {channel.name}</DialogTitle>
          <DialogDescription>Configure your {channel.type.toLowerCase()} settings below</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {renderChannelForm()}
              <DialogFooter>
                {renderContinueButton()} {/* Render the "Continue" button */}
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

