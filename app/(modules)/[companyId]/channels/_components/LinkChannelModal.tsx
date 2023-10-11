'use client'

import React, { useState } from 'react'
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

interface ChannelProps extends React.HTMLAttributes<HTMLDivElement> {
  channel: Channel
}

const WhatsAppFormSchema = z.object({
  accessToken: z.string().min(1),
  phoneNumberId: z.number(),
})

const SMSFormSchema = z.object({
  apiKey: z.string()
})

export default function LinkChannelModal({ channel, className, children }: ChannelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const formSchema = channel.type === 'WHATSAPP' ? WhatsAppFormSchema : SMSFormSchema

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessToken: "",
      phoneNumberId: undefined,
      apiKey: "",
    },
  })

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
      console.log(values)
  }

  // Determine the form to display based on the channel type
  const renderChannelForm = () => {
    switch (channel.type) {
      case 'WHATSAPP':
        return <WhatsAppForm form={form} />
      case 'SMS':
        return <SMSForm form={form} />
      default:
        return null
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
                <Button type="submit">Continue</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
