'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BellDotIcon } from "lucide-react"
import { Button } from "./ui/button"

export default function Notifications() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={'ghost'} size={'sm'}>
          <BellDotIcon className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        Notification go here
      </PopoverContent>
    </Popover>
  )
}
