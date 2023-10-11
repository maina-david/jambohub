import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Channel } from '@prisma/client'
import React, { useState } from 'react'
import WhatsAppForm from './forms/WhatsAppForm'
import TwitterForm from './forms/TwitterForm'
import FacebookForm from './forms/FacebookForm'
import SMSForm from './forms/SMSForm'

interface ChannelProps extends React.HTMLAttributes<HTMLDivElement> {
  channel: Channel
}
export default function LinkChannelModal({ channel, className, children }: ChannelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Determine the form to display based on the channel type
  const renderChannelForm = () => {
    switch (channel.type) {
      case 'WHATSAPP':
        return <WhatsAppForm />
      case 'TWITTER':
        return <TwitterForm />
      case 'FACEBOOK':
        return <FacebookForm />
      case 'SMS':
        return <SMSForm />
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
      </DialogContent>
    </Dialog>
  )
}
