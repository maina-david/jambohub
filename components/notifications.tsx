'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BellDotIcon, MessageSquarePlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { fetchUserNotifications } from "@/actions/user-actions"
import { Notification } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import { BiSolidNotification } from "react-icons/bi"
import Link from "next/link"

export default function Notifications() {
  const [userNotifications, setuserNotifications] = useState<Notification[]>([])
  useEffect(() => {
    fetchUserNotifications().then((notifications) => { setuserNotifications(notifications) })
  }, [])

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={'ghost'} size={'sm'}>
          <BellDotIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <AnimatePresence>
          {userNotifications.length > 0 ? (
            userNotifications.map((userNotification) => {
              return (
                <motion.div
                  key={userNotification.id}
                  initial={{ opacity: 0, y: "100%" }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex cursor-pointer flex-row items-start py-2 hover:bg-accent"
                >
                  {userNotification.type === 'message' ? (
                    <MessageSquarePlusIcon className="mr-2 h-4 w-4" />
                  ) : userNotification.type === 'app' ? (
                    <BiSolidNotification className="mr-2 h-4 w-4" />
                  ) : (
                    <BiSolidNotification className="mr-2 h-4 w-4" />
                  )
                  }
                  <p className="truncate whitespace-nowrap">
                    {userNotification.data}
                  </p>
                </motion.div>
              )
            })
          ) : (
            <p className="text-center text-sm">
              All caught up
            </p>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  )
}
