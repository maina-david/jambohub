'use client'

import { cn } from "@/lib/utils"
import EmojiPicker from 'emoji-picker-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SmilePlusIcon } from "lucide-react"

interface EmojiPickerDialogProps extends React.HTMLAttributes<HTMLDivElement> { }

export function EmojiPickerDialog({ className }: EmojiPickerDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={'icon'}
          className={cn(className)}
        >
          <SmilePlusIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <EmojiPicker />
      </DialogContent>
    </Dialog>
  )
}
