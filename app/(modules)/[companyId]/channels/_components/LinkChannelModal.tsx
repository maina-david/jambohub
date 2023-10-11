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

interface ChannelProps extends React.HTMLAttributes<HTMLDivElement> {
  channel: Channel
}

export default function LinkChannelModal({ channel, className, children }: ChannelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>(null)

  // Handle form submission
  const handleSubmit = (data: any) => {
    try {
      setFormData(data)
      console.log(data) 
    } catch (error) {
      // Handle errors, if any
    } finally {
      // Close the dialog or perform any necessary actions
    }
  }

  // Determine the form to display based on the channel type
  const renderChannelForm = () => {
    switch (channel.type) {
      case 'WHATSAPP':
        return <WhatsAppForm onSubmit={handleSubmit} />
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
          {renderChannelForm()}
        </div>
        <DialogFooter>
          {formData ? (
            <Button type="submit">Continue</Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
