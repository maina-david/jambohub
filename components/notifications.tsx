'use client'

import axios from 'axios'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BellDotIcon, MessageSquarePlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchUserNotifications } from "@/actions/user-actions"
import { AnimatePresence, motion } from "framer-motion"
import { BiSolidNotification } from "react-icons/bi"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Skeleton } from './ui/skeleton'
import { Icons } from './icons'
import { Notification } from '@prisma/client'
import { DotFilledIcon } from '@radix-ui/react-icons'

export default function Notifications() {
  const queryClient = useQueryClient()
  const { isLoading, isError, data } = useQuery({
    queryKey: ['userNotifications'],
    queryFn: () => fetchUserNotifications()
  })

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await axios.patch(`/api/users/notifications/${notificationId}/mark-read`)
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] })
    } catch (error) {
      console.log("Error marking notification as read: ", error)
    }
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={'ghost'} size={'sm'}>
          <BellDotIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {isLoading && (
          <div className='flex flex-row'>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className='flex flex-col'>
              <Skeleton className="h-4 w-[50px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        )}
        {isError && (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Icons.warning className="h-10 w-10" />
            </div>
          </div>
        )}
        {data && (
          data.length > 0 ? (
            data.map((userNotification: Notification) => {
              return (
                <AnimatePresence>
                  <motion.div
                    key={userNotification.id}
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex cursor-pointer flex-row items-start py-2 hover:bg-accent"
                  >
                    <div>
                      {userNotification.type === 'chat' ? (
                        <MessageSquarePlusIcon className="mr-2 h-4 w-4" />
                      ) : userNotification.type === 'app' ? (
                        <BiSolidNotification className="mr-2 h-4 w-4" />
                      ) : (
                        <BiSolidNotification className="mr-2 h-4 w-4" />
                      )
                      }
                    </div>
                    <div className="flex flex-col">
                      <p className="truncate whitespace-nowrap text-base font-medium">
                        {userNotification.title}
                      </p>
                      <p className="truncate whitespace-nowrap">
                        {userNotification.content}
                      </p>
                    </div>
                    <div className='items-center justify-center'>
                      <Button
                        variant={'ghost'}
                        size={'icon'}
                        onClick={() => markNotificationAsRead(userNotification.id)}
                      >
                        <DotFilledIcon className='h-2 w-2' />
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )
            })
          ) : (
            <p className="text-center text-sm">
              All caught up
            </p>
          )
        )}
      </PopoverContent>
    </Popover>
  )
}
