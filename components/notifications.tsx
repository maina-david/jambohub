'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BellDotIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"

export default function Notifications() {
  const params = useParams()
  
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={'ghost'} size={'sm'}>
          <BellDotIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        Notification go here
      </PopoverContent>
    </Popover>
  )
}
