import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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

function ChannelCard({ data }: ChannelProps) {
  return (
    <Card>
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

export default ChannelCard
