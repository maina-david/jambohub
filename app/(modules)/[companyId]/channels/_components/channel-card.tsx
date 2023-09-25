'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { format } from 'date-fns'
import { Channel } from "@prisma/client"
import { PencilIcon, Trash2Icon } from "lucide-react"
import Image from "next/image"

interface ChannelProps {
  data: Channel
}

export function ChannelCard({ data }: ChannelProps) {
  return (
    <Card className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <div className="flex justify-end px-4 pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="inline-block rounded-lg p-1.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                <svg
                  className="h-5 w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 3"
                >
                  <path
                    d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PencilIcon className="mr-2 h-2 w-2" />Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2Icon className="mr-2 h-2 w-2" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-10">
        <Image
          src={'/images/icons/whatsapp.svg'}
          alt={'WhatsApp'}
          width={34}
          height={34}
          className="mb-3 rounded-full shadow-lg"
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{data.name}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">{data.description}</span>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant={data.integrated ? 'destructive' : 'outline'}
        >
          {data.integrated ? 'Unlink' : 'Link'}
        </Button>
        <Button
          variant={data.status ? 'destructive' : 'outline'}
        >
          {data.integrated ? 'Deactivate' : 'Activate'}
        </Button>
      </CardFooter>
    </Card>
  )
}
