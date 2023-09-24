'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import React from 'react'

interface ChannelProps {
  data: {
    name: string,
    description?: string | null,
    type: string,
    identifier: string | null,
    status: boolean,
    integrated: boolean
  }
}

export default function ChannelCard({ data }: ChannelProps) {
  return (
    <Card className="cursor pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
        <CardDescription>
          {data.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {data.type === 'WHATSAPP' &&
          (
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <Icons.whatsapp className='mr-2 h-4 w-4' />
              <div className="flex-1 space-y-1">
                {data.identifier ? (
                  <p className="text-sm font-medium leading-none">{data.identifier}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Not Linked.
                  </p>
                )}
              </div>
            </div>
          )
        }
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant={data.status ? 'destructive' : 'default'}
        >
          {data.status ? 'Deactivate' : 'Activate'}
        </Button>
        <Button
          variant={data.integrated ? 'destructive' : 'default'}
        >
          {data.integrated ? 'Unlink' : 'Integrate'}
        </Button>
      </CardFooter>
    </Card >
  )
}
