'use client'

import { Icons } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
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
      <CardContent className="grid gap-6">
        {data.type === 'WHATSAPP' &&
          (
            <div className="grid grid-cols-2 gap-4">
              <Label>
                <Icons.whatsapp />
                WhatsApp
              </Label>
              <div>
                <Label>
                  {data.identifier ? (
                    <span>{data.identifier}</span>
                  ) : (
                    <Badge variant={'secondary'}>Not Linked</Badge>
                  )}
                </Label>
              </div>
            </div>
          )
        }
      </CardContent>
      <CardFooter>
        <Button
          variant={data.status ? 'destructive' : 'default'}
        >
          {data.status ? 'Deactivate' : 'Activate'}
        </Button>
        <Button
          variant={data.integrated ? 'destructive' : 'default'}
        >
          {data.integrated ? 'Integrate' : 'Unlink'}
        </Button>
      </CardFooter>
    </Card >
  )
}
